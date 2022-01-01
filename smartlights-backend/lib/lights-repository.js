const fs = require('fs');
const yaml = require('js-yaml');

const lightTypes = {
    'yeelight': require('./light-types/yeelight'),
};

function parseConfig() {
    const file = fs.readFileSync('./config.yaml', 'utf8');
    return yaml.load(file);
}

const config = parseConfig();

async function getLightStatus(lightConfig) {
    let lightStatus = {
        name: lightConfig.name,
        power: 'disconnected',
    };
    const lightType = lightTypes[lightConfig.type];

    try {
        const fetchedStatus = await lightType.getStatus(lightConfig.host);
        lightStatus = {...lightStatus, ...fetchedStatus};
        return lightStatus;
    } catch (error) {
        console.log(`Couldn't reach light "${lightConfig.id}" at host "${lightConfig.host}": ${error}`);
    }
    return lightStatus;
}

async function getLights() {
    const lightStatusesArray = await Promise.all(
        Object.entries(config).map(([lightId, lightConfig]) => {
            return getLightStatus({id: lightId, ...lightConfig});
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

function setLightPower(lightId, power) {
    const lightConfig = config[lightId];
    const lightType = lightTypes[lightConfig.type];
    lightType.setPower(lightConfig.host, power);
}

function setLightColor(lightId, color) {
    const lightConfig = config[lightId];
    const lightType = lightTypes[lightConfig.type];
    lightType.setColor(lightConfig.host, color);
}

function setLightBrightness(lightId, brightness) {
    const lightConfig = config[lightId];
    const lightType = lightTypes[lightConfig.type];
    lightType.setBrightness(lightConfig.host, brightness);
}

module.exports = {
    getLights: getLights,
    setLightPower: setLightPower,
    setLightBrightness: setLightBrightness,
    setLightColor: setLightColor,
};