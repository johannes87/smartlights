const fs = require('fs');
const yaml = require('js-yaml');

const configFilePath = './config.yaml';
const configFileEncoding = 'utf8';

function parseConfig() {
  const configContent = fs.readFileSync(configFilePath, configFileEncoding);
  return yaml.load(configContent);
}

function writePresets(presets) {
  const configContent = fs.readFileSync(configFilePath, configFileEncoding);
  const configObject = yaml.load(configContent);
  configObject.presets = presets;
  fs.writeFileSync(configFilePath, yaml.dump(configObject));
}

module.exports = { parseConfig, writePresets };
