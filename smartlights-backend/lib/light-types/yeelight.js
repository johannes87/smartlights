const yeelight = require('yeelight.io');
const dnsPromises = require('dns/promises');

/**
 * Hack: Get IPv4 from host.
 * This function is needed because some Yeelights are not accessible via their
 * IPv6 address, therefore we explicitly request an IPv4 address.
 * Using yeelight.io's `Bulb` otherwise resolves to the IPv6 address, and fails when connecting.
 *
 * @param {string} hostname
 */
async function getIPv4(hostname) {
  const ipv4Addresses = await dnsPromises.resolve4(hostname);
  if (ipv4Addresses.length !== 0) {
    return ipv4Addresses[0];
  } else {
    throw new Error('No IPs in result');
  }
}

async function getStatus(host) {
  return new Promise(async (resolve, reject) => {
    let ipv4 = null;
    try {
      ipv4 = await getIPv4(host);
    } catch (error) {
      reject(`Could not resolve host ${host}: ${error}`);
    }
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
        color,
      });
    });
    bulb.on('error', () => {
      reject(`Could not connect to ${ipv4}`);
    });
    bulb.connect();
    const connectTimeout = 500;
    setTimeout(() => {
      bulb.disconnect();
      reject(`Connection timed out to ${ipv4}`);
    }, connectTimeout);
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
