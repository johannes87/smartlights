function presetNotFound(presetName) {
  return `Preset "${presetName}" not found.`;
}

function newNameNotProvided() {
  return 'No new name provided';
}

module.exports = { presetNotFound, newNameNotProvided };
