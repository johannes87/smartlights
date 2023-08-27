function presetNotFound(presetName) {
  return `Preset "${presetName}" not found.`;
}

function newNameNotProvided() {
  return 'No new name provided';
}

function presetAlreadyExists(presetName) {
  return `The preset "${presetName}" already exists.`;
}

function presetNameMustNotBeEmpty() {
  return `A new preset needs a name.`;
}

module.exports = {
  presetNotFound,
  newNameNotProvided,
  presetAlreadyExists,
  presetNameMustNotBeEmpty,
};
