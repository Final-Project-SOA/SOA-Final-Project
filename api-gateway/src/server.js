const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Gateway Running');
});

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});