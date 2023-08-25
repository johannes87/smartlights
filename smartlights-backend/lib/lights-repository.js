const fs = require('fs');
const yaml = require('js-yaml');

const lightTypes = {
  yeelight: require('./light-types/yeelight'),
};

function getConfig() {
  const file = fs.readFileSync('./config_lights.yaml', 'utf8');
  return yaml.load(file);
}

// not const so it can be replaced in lights-repository.test.js
let config = getConfig();

function getLightTypeLibrary(lightId) {
  const lightConfig = config[lightId];
  return lightTypes[lightConfig.type];
}

async function getLightStatus(lightId, lightConfig) {
  const lightTypeLibrary = getLightTypeLibrary(lightId);
  let lightStatus = {
    name: lightConfig.name,
    power: 'disconnected',
  };

  try {
    const fetchedStatus = await lightTypeLibrary.getStatus(lightConfig.host);
    lightStatus = { ...lightStatus, ...fetchedStatus };
    return lightStatus;
  } catch (error) {
    console.debug(
      `Couldn't get status from light "${lightId}" at host "${lightConfig.host}": ${error}`
    );
  }
  return lightStatus;
}

async function getLights() {
  const lightStatusesArray = await Promise.all(
    Object.entries(config).map(([lightId, lightConfig]) => {
      return getLightStatus(lightId, lightConfig);
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
  const lightTypeLibrary = getLightTypeLibrary(lightId);
  const { host } = config[lightId];
  try {
    console.log(`Setting power of light "${lightId}" to "${power}"`);
    await lightTypeLibrary.setPower(host, power);
  } catch (error) {
    console.debug(`Couldn't set power of light "${lightId}": ${error}"`);
  }
}

/**
 * @param {Object} color Object with keys r, g, b and values 0-255
 */
async function setLightColorThrottled(lightId, color) {
  const lightTypeLibrary = getLightTypeLibrary(lightId);
  const { host } = config[lightId];

  console.log(
    `Throttled: Setting color of light "${lightId}" to ${JSON.stringify(color)}`
  );
  await lightTypeLibrary.setColorThrottled(host, color);
}

/**
 * @param {Object} color Object with keys r, g, b and values 0-255
 */
async function setLightColorImmediately(lightId, color) {
  const lightTypeLibrary = getLightTypeLibrary(lightId);
  const { host } = config[lightId];

  console.log(
    `Immediately: Setting color of light "${lightId}" to ${JSON.stringify(
      color
    )}`
  );
  await lightTypeLibrary.setColorImmediately(host, color);
}

/**
 * @param {Number} brightness value in range 0-100
 */
async function setLightBrightnessThrottled(lightId, brightness) {
  const lightTypeLibrary = getLightTypeLibrary(lightId);
  const { host } = config[lightId];

  console.log(
    `Throttled: Setting brightness of light ${lightId} to ${brightness}`
  );
  await lightTypeLibrary.setBrightnessThrottled(host, brightness);
}

/**
 * @param {Number} brightness value in range 0-100
 */
async function setLightBrightnessImmediately(lightId, brightness) {
  const lightTypeLibrary = getLightTypeLibrary(lightId);
  const { host } = config[lightId];

  console.log(
    `Immediately: Setting brightness of light ${lightId} to ${brightness}`
  );
  await lightTypeLibrary.setBrightnessImmediately(host, brightness);
}

module.exports = {
  getLights,
  setLightPower,
  setLightBrightnessThrottled,
  setLightBrightnessImmediately,
  setLightColorThrottled,
  setLightColorImmediately,
};
