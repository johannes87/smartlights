function presetNotFound(presetName) {
  return `Preset "${presetName}" not found.`;
}

function newNameNotProvided() {
  return 'No new name provided';
}

function presetAlreadyExists(presetName) {
  return `The preset "${presetName}" already exists.`;
}

module.exports = { presetNotFound, newNameNotProvided, presetAlreadyExists };
