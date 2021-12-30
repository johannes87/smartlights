const yeelight = require('yeelight.io');
const dnsPromises = require('dns/promises');

const timeoutMs = 500;

let dnsCache = {};
/**
 * Hack: Get IPv4 from host.
 * This function is needed because some Yeelights are not accessible via their
 * IPv6 address, therefore we explicitly request an IPv4 address.
 * Using yeelight.io's `Bulb` otherwise resolves to the IPv6 address, and fails when connecting.
 *
 * @param {string} hostname
 */
async function getIPv4(hostname) {
    if (dnsCache[hostname]) {
        return dnsCache[hostname];
    }

    const ipv4Addresses = await dnsPromises.resolve4(hostname);
    if (ipv4Addresses.length != 0) {
        dnsCache[hostname] = ipv4Addresses[0];
        return ipv4Addresses[0];
    } else {
        return null;
    }
}

async function getStatus(host) {
    return new Promise(async (resolve, reject) => {
        const ipv4 = await getIPv4(host);
        const bulb = new yeelight.Bulb(ipv4);

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

async function setPower(host, power) {
    const ipv4 = await getIPv4(host);

    if (power === 'on') {
        yeelight.on(ipv4);
    } else {
        yeelight.off(ipv4);
    }
}

async function setColor(host, color) {
    const ipv4 = await getIPv4(host);

    yeelight.color(ipv4, color.r, color.g, color.b);
}

async function setBrightness(host, brightness) {
    const ipv4 = await getIPv4(host);

    yeelight.brightness(ipv4, brightness);
}

module.exports = {
    getStatus: getStatus,
    setPower: setPower,
    setColor: setColor,
    setBrightness: setBrightness,
};
