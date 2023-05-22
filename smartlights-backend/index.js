const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const lightsRepository = require('./lib/lights-repository');
const presets = require('./lib/presets');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API usage:
// GET /v1/lights: return all lights, including brightness, power state, and color for each light.

app.get('/v1/lights', async (req, res) => {
  const lights = await lightsRepository.getLights();
  res.json(lights);
});

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

app.get('/v1/presets', (req, res) => {
  res.json(presets.getPresets());
});

app.post('/v1/presets', (req, res) => {
  if (req.body.presetName && req.body.presetData) {
    presets.addPreset(req.body.presetName, req.body.presetData);
  }
  res.json(req.body);
});

app.delete('/v1/presets', (req, res) => {
  if (req.body.presetName) {
    presets.removePreset(req.body.presetName);
  }
  res.json(req.body);
});

const port = 8000;
app.listen(8000, () => console.log(`Server started at port ${port}`));
