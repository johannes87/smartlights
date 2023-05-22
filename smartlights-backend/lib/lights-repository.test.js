const rewire = require('rewire');
const lightsRepository = rewire('./lights-repository');

lightsRepository.__set__('lightsConfig', {
  lightWithNonExistantHost: {
    name: 'I am a light that does not exist',
    host: 'thisisnotarealhostname.invalid',
    type: 'yeelight',
  },
});

test('setLightPower does not throw an exception for a non-existant host', async () => {
  await expect(
    lightsRepository.setLightPower('lightWithNonExistantHost', 'on')
  ).resolves.toBeUndefined();
});
