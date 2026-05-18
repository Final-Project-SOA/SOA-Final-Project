const express = require('express');
const cors = require('cors');

const patientClient = require('./grpc/patientClient');
const appointmentClient = require('./grpc/appointmentClient');

const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./graphql/schema');

async function startServer() {

    const app = express();

    app.use(cors());

    app.use(express.json());
    app.get('/patients', (req, res) => {

        patientClient.GetPatients({}, (error, response) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json(response);

        });

    });

    app.post('/patients', express.json(), (req, res) => {

        patientClient.AddPatient(req.body, (error, response) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json(response);

        });

    });

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
    app.get('/appointments', (req, res) => {

    appointmentClient.GetAppointments(
        {},
        (error, response) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json(response);

        }
    );

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
                return res.status(500).json(error);
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