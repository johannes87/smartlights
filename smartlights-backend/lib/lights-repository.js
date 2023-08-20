const fs = require('fs');
const yaml = require('js-yaml');

const lightTypes = {
  yeelight: require('./light-types/yeelight'),
};

function parseConfig() {
  const file = fs.readFileSync('./config.yaml', 'utf8');
  return yaml.load(file);
}

// not const so it can be replaced in lights-repository.test.js
let config = parseConfig();

async function getLightStatus(lightConfig) {
  let lightStatus = {
    name: lightConfig.name,
    power: 'disconnected',
  };
  const lightType = lightTypes[lightConfig.type];

  try {
    const fetchedStatus = await lightType.getStatus(lightConfig.host);
    lightStatus = { ...lightStatus, ...fetchedStatus };
    return lightStatus;
  } catch (error) {
    console.debug(
      `Couldn't get status from light "${lightConfig.id}" at host "${lightConfig.host}": ${error}`
    );
  }
  return lightStatus;
}

async function getLights() {
  const lightStatusesArray = await Promise.all(
    Object.entries(config).map(([lightId, lightConfig]) => {
      return getLightStatus({ id: lightId, ...lightConfig });
    })
  );

  const lightIds = Object.keys(config);
  let lightStatuses = {};
  lightStatusesArray.forEach((lightStatus, idx) => {
    const lightId = lightIds[idx];
    lightStatuses[lightId] = lightStatus;
  });

  return lightStatuses;
}

async function setLightPower(lightId, power) {
  const lightConfig = config[lightId];
  const lightType = lightTypes[lightConfig.type];
  try {
    console.log(`Setting power of light "${lightId}" to "${power}"`);
    await lightType.setPower(lightConfig.host, power);
  } catch (error) {
    console.debug(`Couldn't set power of light "${lightId}": ${error}"`);
  }
}

/**
 * @param {Object} color Object with keys r, g, b and values 0-255
 */
async function setLightColor(lightId, color) {
  const lightConfig = config[lightId];
  const lightType = lightTypes[lightConfig.type];
  console.log(
    `Setting color of light "${lightId}" to ${JSON.stringify(color)}`
  );
  await lightType.setColor(lightConfig.host, color);
}

/**
 * @param {Number} brightness value in range 0-100
 */
async function setLightBrightness(lightId, brightness) {
  const lightConfig = config[lightId];
  const lightType = lightTypes[lightConfig.type];
  console.log(`Setting brightness of light ${lightId} to ${brightness}`);
  await lightType.setBrightness(lightConfig.host, brightness);
}

module.exports = {
  getLights,
  setLightPower,
  setLightBrightness,
  setLightColor,
};
