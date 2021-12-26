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
        id: lightConfig.id,
        name: lightConfig.name,
        power: 'disconnected',
    };
    const lightType = lightTypes[lightConfig.type];

    try {
        const fetchedStatus = await lightType.getStatus(lightConfig.host);
        lightStatus = {...lightStatus, ...fetchedStatus};
        return lightStatus;
    } catch (error) {
        console.log(`Couldn't reach ${lightConfig.id}: ${error}`);
    }
    return lightStatus;
}

async function getLights() {
    // We want an array of objects where each object has a key "id" with the light ID
    const configArray = Object
        .entries(config)
        .map(([key, value]) => {
            return {
                id: key,
                ...value,
            };
        });

    const lightStatuses = await Promise.all(
        configArray.map(lightConfig => getLightStatus(lightConfig))
    );
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