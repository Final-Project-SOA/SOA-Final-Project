const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Medical Service Running');
});

app.listen(4002, () => {
    console.log('Medical Service running on port 4002');
});