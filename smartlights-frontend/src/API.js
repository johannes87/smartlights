const apiEndpoint = process.env.REACT_APP_BACKEND_URL;

const sendJSON = async (httpMethod, path, data) => {
  await fetch(`${apiEndpoint}${path}`, {
    method: httpMethod,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

const getLights = async () => {
  const result = await fetch(`${apiEndpoint}/v1/lights`);
  const lightStates = await result.json();
  return lightStates;
};

const setLightPower = async (lightId, power) => {
  await sendJSON('PUT', `/v1/lights/${lightId}`, { power });
};

const setLightColorAndBrightness = async (lightId, color, brightness) => {
  await sendJSON('PUT', `/v1/lights/${lightId}`, { color, brightness });
};

const getPresets = async () => {
  const result = await fetch(`${apiEndpoint}/v1/presets`);
  return await result.json();
};

const addPreset = async (presetName, presetData) => {
  await sendJSON('POST', '/v1/presets', { presetName, presetData });
};

const removePreset = async (presetName) => {
  await sendJSON('DELETE', '/v1/presets', { presetName });
};

export {
  getLights,
  setLightPower,
  setLightColorAndBrightness,
  getPresets,
  addPreset,
  removePreset,
};
