const rewire = require('rewire');
const yeelight = rewire('./yeelight');

test('getIPv4 throws an ENOTFOUND error for a non-existant host', () => {
    const getIPv4 = yeelight.__get__('getIPv4');
    expect(getIPv4('nonexistant.host.invalid')).rejects.toThrow('ENOTFOUND');
});

test('getStatus rejects for a non-existant host', () => {
    const getStatus = yeelight.__get__('getStatus');
    expect(getStatus('nonexistant.host.invalid')).rejects.toMatch('Could not resolve host');
});