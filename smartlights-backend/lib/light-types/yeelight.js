const yeelight = require('yeelight.io');
const dnsPromises = require('dns/promises');
const EventEmitter = require('events');
const { Kefir } = require('kefir');
const ping = require('ping');

/**
 * Yeelight is rate-limited to 60 connections/second. Therefore we use Kefir to
 * throttle the events. Otherwise, the Yeelight will be unreachable for a few
 * minutes if the rate limits is exceeded.
 *
 * Because at the moment, each user-color-setting in the frontend involves two
 * connections to the yeelight (for color and brightness), we restrict each to
 * 30 connections/second (throttle with 2000ms).
 *
 * @see https://yeelight.readthedocs.io/en/latest/
 */
const yeelightEmitter = new EventEmitter();
Kefir.fromEvents(yeelightEmitter, 'color')
  .throttle(2000)
  .observe({
    async value({ host, color }) {
      try {
        const ipv4 = await getIPv4(host);
        yeelight.color(ipv4, color.r, color.g, color.b);
      } catch (error) {
        console.debug(`Couldn't set color of light at host ${host}: ${error}`);
      }
    },
  });
Kefir.fromEvents(yeelightEmitter, 'brightness')
  .throttle(2000)
  .observe({
    async value({ host, brightness }) {
      try {
        const ipv4 = await getIPv4(host);
        yeelight.brightness(ipv4, brightness);
      } catch (error) {
        console.debug(
          `Couldn't set brightness of light at host ${host}: ${error}`
        );
      }
    },
  });

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

    // Hack: bulb needs to be accessed before becoming available 
    // if not accessed for a while.
    await ping.promise.probe(host);

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
  yeelightEmitter.emit('color', { host, color });
}

async function setBrightness(host, brightness) {
  yeelightEmitter.emit('brightness', { host, brightness });
}

module.exports = {
  getStatus,
  setPower,
  setColor,
  setBrightness,
};
