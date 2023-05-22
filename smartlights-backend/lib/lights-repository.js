const config = require('./config');

const lightTypes = {
  yeelight: require('./light-types/yeelight'),
};

// not const so it can be replaced in lights-repository.test.js
let lightsConfig = config.parseConfig().lights;

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
    Object.entries(lightsConfig).map(([lightId, lightConfig]) => {
      return getLightStatus({ id: lightId, ...lightConfig });
    })
  );

  const lightIds = Object.keys(lightsConfig);
  let lightStatuses = {};
  lightStatusesArray.forEach((lightStatus, idx) => {
    const lightId = lightIds[idx];
    lightStatuses[lightId] = lightStatus;
  });

  return lightStatuses;
}

async function setLightPower(lightId, power) {
  const lightConfig = lightsConfig[lightId];
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
  const lightConfig = lightsConfig[lightId];
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
  const lightConfig = lightsConfig[lightId];
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
