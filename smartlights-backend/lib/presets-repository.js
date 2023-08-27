const fs = require('fs');
const yaml = require('js-yaml');
const { setTimeout } = require('timers/promises');
const {
  presetAlreadyExists,
  newNameNotProvided,
  presetNotFound,
} = require('./error-messages');
const { DateTime } = require('luxon');

const presetsConfigFileName = './config_presets.yml';

function getConfig() {
  let presetsConfig = {};
  if (fs.existsSync(presetsConfigFileName)) {
    presetsConfig = yaml.load(fs.readFileSync(presetsConfigFileName, 'utf-8'));
  }
  return presetsConfig;
}

/**
 * @param {Object} presetsConfig
 */
function writeConfig(presetsConfig) {
  fs.writeFileSync(presetsConfigFileName, yaml.dump(presetsConfig));
}

/**
 * Get clean data from current light state, so that only relevant info is stored.
 * @param {Object} lights the lights data from lightsRepository
 * @returns cleaned lights data for storing in presets config
 */
function cleanLightsData(lights) {
  const cleanedLights = {};
  for (const [lightId, lightConfig] of Object.entries(lights)) {
    if (lightConfig.power === 'disconnected' || lightConfig.power === 'off') {
      continue;
    }
    const { brightness, color } = lightConfig;
    cleanedLights[lightId] = { brightness, color };
  }
  return cleanedLights;
}

/**
 * @param {string} presetName
 * @param {Object} lights
 */
function savePreset(presetName, lights) {
  const cleanedLights = cleanLightsData(lights);
  const presetsConfig = getConfig();
  if (presetsConfig[presetName]) {
    return { error: presetAlreadyExists(presetName) };
  }
  presetsConfig[presetName] = {};
  presetsConfig[presetName].lights = cleanedLights;
  presetsConfig[presetName].createDate = DateTime.now().toISO();
  writeConfig(presetsConfig);
  return { error: false };
}

function getPresets() {
  return getConfig();
}

/**
 * @param {string} presetName
 */
function deletePreset(presetName) {
  const presetsConfig = getConfig();
  delete presetsConfig[presetName];
  writeConfig(presetsConfig);
}

/**
 * @param {string} presetName
 * @param {string} newName
 */
function renamePreset(presetName, newName) {
  const presetsConfig = getConfig();
  if (!newName) {
    return { error: newNameNotProvided() };
  }
  if (presetsConfig[newName]) {
    return { error: presetAlreadyExists(newName) };
  }
  if (!presetsConfig[presetName]) {
    return { error: presetNotFound(presetName) };
  }
  presetsConfig[newName] = presetsConfig[presetName];
  delete presetsConfig[presetName];
  writeConfig(presetsConfig);

  return { error: false };
}

/**
 * @param {string} presetName
 * @param {Object} lightsRepository
 */
async function loadPreset(presetName, lightsRepository) {
  const presets = getPresets();
  const requestedPreset = presets[presetName];
  if (!requestedPreset) {
    return { error: presetNotFound(presetName) };
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
