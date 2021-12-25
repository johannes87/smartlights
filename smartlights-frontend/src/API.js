const apiEndpoint = "http://localhost:8000";

const getLights = async () => {
  const result = await fetch(`${apiEndpoint}/v1/lights`);
  const lightStates = await result.json();
  return lightStates;
}

const setLightPower = (id, power) => {
  fetch(`${apiEndpoint}/v1/lights/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ power }),
  });
};

export { getLights, setLightPower };
