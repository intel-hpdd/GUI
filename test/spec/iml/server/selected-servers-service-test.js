import selectedServersService from '../../../../source/iml/server/selected-servers-service.js';

describe('selected servers service', () => {
  let selectedServers;
  beforeEach(() => {
    selectedServers = {};
    selectedServersService.bind(selectedServers)();
    selectedServers.servers['https://hostname1.localdomain'] = true;
  });

  it('should be an object', () => {
    expect(selectedServers).toEqual(expect.any(Object));
  });
  it('should have a servers property', () => {
    expect(selectedServers.servers).toEqual(expect.any(Object));
  });
  const dataProvider = [
    { name: 'all', expected: true },
    { name: 'none', expected: false },
    { name: 'invert', expected: false }
  ];
  dataProvider.forEach(function checktype(item) {
    it('should toggle for ' + item.name, () => {
      selectedServers.toggleType(item.name);
      expect(selectedServers.servers['https://hostname1.localdomain']).toBe(
        item.expected
      );
    });
  });
  it('should add a new server', () => {
    selectedServers.addNewServers([{ fqdn: 'https://hostname2.localdomain' }]);
    expect(selectedServers.servers['https://hostname2.localdomain']).toBe(
      false
    );
  });
});
