const express = require('express');
const cors = require('cors');

const patientClient = require('./grpc/patientClient');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Gateway Running');
});

app.get('/patients', (req, res) => {

    patientClient.GetPatients({}, (error, response) => {

        if (error) {
            return res.status(500).json(error);
        }

        res.json(response);
    });

});

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});