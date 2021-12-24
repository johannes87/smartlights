const fs = require('fs');
const yaml = require('js-yaml');
const lightTypeYeelight = require('./light-types/yeelight');

const lightTypes = {
    'yeelight': lightTypeYeelight,
};

function parseConfig() {
    const file = fs.readFileSync('./config.yaml', 'utf8');
    return yaml.load(file);
}

async function getLightStatus(lightConfig) {
    let lightStatus = {
        id: lightConfig.id,
        name: lightConfig.name,
        power: 'off',
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
    const config = parseConfig();

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


function setLightPower(id, power) {

}

function setLightBrightness(id, brightness) {

}

function setLightColor(id, color) {

}

module.exports = {
    getLights: getLights,
    setLightPower: setLightPower,
    setLightBrightness: setLightBrightness,
    setLightColor: setLightColor,
};