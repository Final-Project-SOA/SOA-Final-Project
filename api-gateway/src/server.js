const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Gateway Running');
});

app.get('/patients', (req, res) => {

    console.log("PATIENT ROUTE CALLED");

    res.json({
        patients: [
            {
                id: 1,
                name: "Fatma"
            },
            {
                id: 2,
                name: "Eya"
            }
        ]
    });

});

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});