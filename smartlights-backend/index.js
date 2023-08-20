const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const lightsRepository = require('./lib/lights-repository');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/**
 * Get status for all lights (color, brightness, power state).
 */
app.get('/v1/lights', async (_, res) => {
  const lights = await lightsRepository.getLights();
  res.json(lights);
});

/**
 * Set status of a specific light.
 */
app.put('/v1/lights/:id', (req, res) => {
  if (req.body.power) {
    lightsRepository.setLightPower(req.params.id, req.body.power);
  }
  if (req.body.color) {
    lightsRepository.setLightColor(req.params.id, req.body.color);
  }
  if (req.body.brightness) {
    lightsRepository.setLightBrightness(req.params.id, req.body.brightness);
  }

  res.json(req.body);
});

const port = 8000;
app.listen(8000, () => console.log(`Server started at port ${port}`));
