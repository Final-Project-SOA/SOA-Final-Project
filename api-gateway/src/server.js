const express = require('express');
const cors = require('cors');

const patientClient = require('./grpc/patientClient');
const appointmentClient = require('./grpc/appointmentClient');

const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./graphql/schema');

async function startServer() {

    const app = express();

    app.use(cors());

    /*
        GraphQL doit être monté AVANT express.json()
        sinon erreur Postman:
        "InternalServerError: stream is not readable"
    */
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/graphql'
    });

    /*
        express.json() est utilisé seulement pour REST
        après GraphQL
    */
    app.use(express.json());

    app.get('/patients', (req, res) => {

        patientClient.GetPatients({}, (error, response) => {

            if (error) {
                return res.status(500).json({
                    message: 'Patient service error',
                    error: error.message
                });
            }

            res.json(response);

        });

    });

    app.post('/patients', (req, res) => {

        patientClient.AddPatient(req.body, (error, response) => {

            if (error) {
                return res.status(500).json({
                    message: 'Patient creation error',
                    error: error.message
                });
            }

            res.json(response);

        });

    });

    app.get('/appointments', (req, res) => {

        appointmentClient.GetAppointments({}, (error, response) => {

            if (error) {
                return res.status(500).json({
                    message: 'Appointment service error',
                    error: error.message
                });
            }

            res.json(response);

        });

    });

    app.post('/appointments', (req, res) => {

        appointmentClient.CreateAppointment(

            {
                patientId: req.body.patientId,
                doctor: req.body.doctor,
                date: req.body.date
            },

            (error, response) => {

                if (error) {
                    return res.status(500).json({
                        message: 'Appointment creation error',
                        error: error.message
                    });
                }

                res.json(response);

            }

        );

    });

    app.get('/mcp-email/status', (req, res) => {

        res.json({
            name: 'MCP Email AI Agent',
            status: 'active',
            service: 'medical-service',
            trigger: 'Appointment Created',
            technology: 'Nodemailer + Gmail App Password',
            description:
                'The MCP Email AI Agent automatically sends an email notification when a new medical appointment is created.',
            lastEvent: 'Waiting for appointment event'
        });

    }
    
);
app.get('/patients/search', (req, res) => {
    patientClient.SearchPatients(
        {
            keyword: req.query.keyword || ''
        },
        (error, response) => {
            if (error) {
                return res.status(500).json({
                    message: 'Patient search error',
                    error: error.message
                });
            }

            res.json(response);
        }
    );
});

app.put('/patients/:id', (req, res) => {
    patientClient.UpdatePatient(
        {
            id: Number(req.params.id),
            name: req.body.name,
            age: Number(req.body.age),
            disease: req.body.disease
        },
        (error, response) => {
            if (error) {
                return res.status(500).json({
                    message: 'Patient update error',
                    error: error.message
                });
            }

            res.json(response);
        }
    );
});

app.delete('/patients/:id', (req, res) => {
    patientClient.DeletePatient(
        {
            id: Number(req.params.id)
        },
        (error, response) => {
            if (error) {
                return res.status(500).json({
                    message: 'Patient delete error',
                    error: error.message
                });
            }

            res.json(response);
        }
    );
});
app.get('/appointments/search', (req, res) => {
    appointmentClient.SearchAppointments(
        {
            keyword: req.query.keyword || ''
        },
        (error, response) => {
            if (error) {
                return res.status(500).json({
                    message: 'Appointment search error',
                    error: error.message
                });
            }

            res.json(response);
        }
    );
});

app.put('/appointments/:id', (req, res) => {
    appointmentClient.UpdateAppointment(
        {
            id: Number(req.params.id),
            patientId: Number(req.body.patientId),
            doctor: req.body.doctor,
            date: req.body.date
        },
        (error, response) => {
            if (error) {
                return res.status(500).json({
                    message: 'Appointment update error',
                    error: error.message
                });
            }

            res.json(response);
        }
    );
});

app.delete('/appointments/:id', (req, res) => {
    appointmentClient.DeleteAppointment(
        {
            id: Number(req.params.id)
        },
        (error, response) => {
            if (error) {
                return res.status(500).json({
                    message: 'Appointment delete error',
                    error: error.message
                });
            }

            res.json(response);
        }
    );
});
    app.listen(3000, () => {

        console.log('Gateway running on port 3000');
        console.log('GraphQL running on:');
        console.log('http://localhost:3000/graphql');

    });

}

startServer();