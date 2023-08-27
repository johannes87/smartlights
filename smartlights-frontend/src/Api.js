import { DateTime } from 'luxon';

/**
 * @param {string} path
 */
function getEndpointUrl(path) {
  return new URL(path, process.env.REACT_APP_BACKEND_URL);
}

/**
 * @param {('GET'|'PUT'|'POST'|'DELETE')} httpMethod
 * @param {string} path
 */
async function sendRequest(httpMethod, path, data = null) {
  const requestInit = {
    method: httpMethod,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (data) {
    requestInit.body = JSON.stringify(data);
  }
  const result = await fetch(getEndpointUrl(path), requestInit);
  return await result.json();
}

export async function getLights() {
  return sendRequest('GET', '/v1/lights');
}

/**
 * @param {string} lightId
 * @param {string} power
 */
export function setLightPower(lightId, power) {
  return sendRequest('PUT', `/v1/lights/${lightId}`, { power });
}

/**
 * @param {string} lightId
 * @param {Object} color
 * @param {Number} brightness
 */
export function setLightColorAndBrightness(lightId, color, brightness) {
  return sendRequest('PUT', `/v1/lights/${lightId}`, {
    color,
    brightness,
  });
}

export async function getPresets() {
  const presets = await sendRequest('GET', '/v1/presets');
  return Object.entries(presets)
    .map(([presetName, presetConfig]) => ({
      presetName,
      ...presetConfig,
    }))
    .sort((a, b) => {
      // Newest entry comes first in list
      const dateTimeA = DateTime.fromISO(a.createDate);
      const dateTimeB = DateTime.fromISO(b.createDate);

      if (dateTimeA < dateTimeB) {
        return 1;
      } else if (dateTimeA > dateTimeB) {
        return 0;
      }
      return 0;
    });
}

/**
 * @param {string} presetName
 */
export async function createPreset(presetName) {
  return sendRequest('POST', '/v1/presets', { presetName });
}

/**
 * @param {string} presetName
 */
export async function deletePreset(presetName) {
  return sendRequest('DELETE', `/v1/presets/${encodeURIComponent(presetName)}`);
}
