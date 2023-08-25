const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const lightsRepository = require('./lib/lights-repository');
const presetsRepository = require('./lib/presets-repository');

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
app.put('/v1/lights/:lightId', async (req, res) => {
  const { lightId } = req.params;
  const { power, color, brightness } = req.body;

  if (power) {
    await lightsRepository.setLightPower(lightId, power);
  }
  if (color) {
    await lightsRepository.setLightColorThrottled(lightId, color);
  }
  if (brightness) {
    await lightsRepository.setLightBrightnessThrottled(lightId, brightness);
  }
  res.json(req.body);
});

/**
 * Load a preset with a given preset name.
 */
app.put('/v1/lights', async (req, res) => {
  const { presetName } = req.body;
  const result = await presetsRepository.loadPreset(presetName, lightsRepository);
  if (!result.error) {
    res.json(req.body);
  } else {
    res.status(400).send(result);
  }
});

/**
 * Create a preset from the current status of all lights.
 */
app.post('/v1/presets', async (req, res) => {
  const { presetName } = req.body;
  const lights = await lightsRepository.getLights();
  presetsRepository.savePreset(presetName, lights);
  res.json(req.body);
});

/**
 * Get all stored presets.
 */
app.get('/v1/presets', (_, res) => {
  const presets = presetsRepository.getPresets();
  res.json(presets);
});

/**
 * Rename a preset.
 */
app.put('/v1/presets/:presetName', (req, res) => {
  const { presetName } = req.params;
  const { newName } = req.body;

  const result = presetsRepository.renamePreset(presetName, newName);
  if (!result.error) {
    res.json(req.body);
  } else {
    res.json(result);
  }
});

/**
 * Delete a preset.
 */
app.delete('/v1/presets', (req, res) => {
  const { presetName } = req.body;
  presetsRepository.deletePreset(presetName);
  res.json(req.body);
});

const port = 8000;
app.listen(8000, () => console.log(`Server started at port ${port}`));
