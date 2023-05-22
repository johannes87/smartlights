const config = require('./config');

function getPresetsConfig() {
  return config.parseConfig().presets;
}

function getPresets() {
  return getPresetsConfig();
}

function addPreset(presetName, presetData) {
  const presets = getPresetsConfig();
  presets[presetName] = presetData;
  config.writePresets(presets);
}

function removePreset(presetName) {
  const presets = getPresetsConfig();
  delete presets[presetName];
  config.writePresets(presets);
}

module.exports = { getPresets, addPreset, removePreset };
