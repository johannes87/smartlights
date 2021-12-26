const yeelight = require('yeelight.io');

const timeoutMs = 500;

async function getStatus(host) {
    return new Promise((resolve, reject) => {
        const bulb = new yeelight.Bulb(host);
        bulb.on('connected', () => {
            bulb.getProps();
        });
        bulb.on('props', () => {
            const status = bulb.status();
            bulb.disconnect();

            const color = {
                r: (status.rgb >> 16) & 0xff,
                g: (status.rgb >> 8) & 0xff,
                b: status.rgb & 0xff,
            };

            resolve({
                power: status.power,
                brightness: status.bright,
                color: color,
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
    if (power === 'on') {
        yeelight.on(host);
    } else {
        yeelight.off(host);
    }
}

function setColor(host, color) {
    yeelight.color(host, color.r, color.g, color.b);
}

function setBrightness(host, brightness) {
    yeelight.brightness(host, brightness);
}

module.exports = {
    getStatus: getStatus,
    setPower: setPower,
    setColor: setColor,
    setBrightness: setBrightness,
};
