const apiEndpoint = "http://localhost:8000";

const setLightPower = (id, power) => {
  fetch(`${apiEndpoint}/v1/lights/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ power }),
  });
};

export { setLightPower };
