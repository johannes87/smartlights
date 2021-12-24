const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getLights } = require('./lib/lights-repository');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API usage:
// GET /v1/lights: return all lights, including brightness, power state, and color for each light.

app.get('/v1/lights', async (req, res) => {
    const lights = await getLights();
    res.json(lights);
});

app.put('/v1/lights/all', (req, res) => {
    res.json(req.body);
});

app.put('/v1/lights/:id', (req, res) => {
    res.json(req.body);
});

app.listen(8000, () => console.log('server started'));

