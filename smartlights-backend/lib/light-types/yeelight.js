const { Bulb } = require('yeelight.io');

const timeoutMs = 500;

async function getStatus(host) {
    return new Promise((resolve, reject) => {
        const bulb = new Bulb(host);
        bulb.on('connected', () => {
            bulb.getProps();
        });
        bulb.on('props', () => {
            const status = bulb.status();
            bulb.disconnect();

            resolve({
                power: status.power,
                brightness: status.bright,
                color: status.rgb,
            });
        });
        bulb.on('error', () => {
            reject('Could not connect');
        });
        bulb.connect();
        setTimeout(() => {
            bulb.disconnect();
            reject('Connection timed out');
        }, timeoutMs);
    });
}

function setPower(host, power) {

}

function setColor(host, color) {

}

function setBrightness(host, brightness) {

}

module.exports = {
    getStatus: getStatus,
};
