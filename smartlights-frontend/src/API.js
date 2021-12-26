const apiEndpoint = "http://localhost:8000";

const sendJSON = (httpMethod, path, data) => {
  fetch(`${apiEndpoint}/${path}`, {
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
}

const setLightPower = (lightId, power) => {
  sendJSON('PUT', `v1/lights/${lightId}`, { power });
};

const setLightColorAndBrightness = (lightId, color, brightness) => {
  sendJSON('PUT', `v1/lights/${lightId}`, { color, brightness });
}

export { getLights, setLightPower, setLightColorAndBrightness };
