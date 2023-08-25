const fs = require('fs');
const yaml = require('js-yaml');
const luxon = require('luxon');
const { setTimeout } = require('timers/promises');
const errorMessages = require('./error-messages');

const presetsConfigFileName = './config_presets.yml';

function getConfig() {
  let presetsConfig = {};
  if (fs.existsSync(presetsConfigFileName)) {
    presetsConfig = yaml.load(fs.readFileSync(presetsConfigFileName, 'utf-8'));
  }
  return presetsConfig;
}

function writeConfig(presetsConfig) {
  fs.writeFileSync(presetsConfigFileName, yaml.dump(presetsConfig));
}

/**
 * Get clean data from current light state, so that only relevant info is stored.
 * @param {*} lights the lights data from lightsRepository
 * @returns cleaned lights data for storing in presets config
 */
function cleanLightsData(lights) {
  const cleanedLights = {};
  for (const [lightId, lightConfig] of Object.entries(lights)) {
    if (lightConfig.power === 'disconnected') {
      continue;
    }
    const { brightness, color } = lightConfig;
    cleanedLights[lightId] = { brightness, color };
  }
  return cleanedLights;
}

function savePreset(presetName, lights) {
  const cleanedLights = cleanLightsData(lights);
  const presetsConfig = getConfig();
  presetsConfig[presetName] = {};
  presetsConfig[presetName].lights = cleanedLights;
  presetsConfig[presetName].createDate = luxon.DateTime.now().toISO();
  writeConfig(presetsConfig);
}

function getPresets() {
  return getConfig();
}

function deletePreset(presetName) {
  const presetsConfig = getConfig();
  delete presetsConfig[presetName];
  writeConfig(presetsConfig);
}

function renamePreset(presetName, newName) {
  const presetsConfig = getConfig();
  if (!newName) {
    return { error: errorMessages.newNameNotProvided() };
  }
  if (!presetsConfig[presetName]) {
    return { error: errorMessages.presetNotFound(presetName) };
  }
  presetsConfig[newName] = presetsConfig[presetName];
  delete presetsConfig[presetName];
  writeConfig(presetsConfig);

  return { error: false };
}

async function loadPreset(presetName, lightsRepository) {
  const presets = getPresets();
  const requestedPreset = presets[presetName];
  if (!requestedPreset) {
    return { error: errorMessages.presetNotFound(presetName) };
  }
  console.log(`Loading preset: "${presetName}"`);
  const lightPowerOperations = [];
  const lightColorOperations = [];
  const lightBrightnessOperations = [];
  for (const [lightId, lightConfig] of Object.entries(requestedPreset.lights)) {
    lightPowerOperations.push(async () =>
      lightsRepository.setLightPower(lightId, 'on')
    );
    lightColorOperations.push(
      async () =>
        await lightsRepository.setLightColorImmediately(
          lightId,
          lightConfig.color
        )
    );
    lightBrightnessOperations.push(
      async () =>
        await lightsRepository.setLightBrightnessImmediately(
          lightId,
          lightConfig.brightness
        )
    );
  }
  await Promise.all(lightPowerOperations.map((e) => e()));
  await setTimeout(500);
  await Promise.all(lightColorOperations.map((e) => e()));
  await setTimeout(500);
  await Promise.all(lightBrightnessOperations.map((e) => e()));

  return { error: false };
}

module.exports = {
  savePreset,
  getPresets,
  deletePreset,
  renamePreset,
  loadPreset,
};
