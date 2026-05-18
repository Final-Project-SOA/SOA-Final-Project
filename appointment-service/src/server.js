const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Appointment Service Running');
});

app.listen(4001, () => {
    console.log('Appointment Service running on port 4001');
});