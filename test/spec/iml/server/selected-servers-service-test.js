import serverModule from '../../../../source/iml/server/server-module';

describe('selected servers service', function() {
  beforeEach(module(serverModule));

  let selectedServers;

  beforeEach(
    inject(function(_selectedServers_) {
      selectedServers = _selectedServers_;

      selectedServers.servers['https://hostname1.localdomain'] = true;
    })
  );

  it('should be an object', function() {
    expect(selectedServers).toEqual(jasmine.any(Object));
  });

  it('should have a servers property', function() {
    expect(selectedServers.servers).toEqual(jasmine.any(Object));
  });

  const dataProvider = [
    {
      name: 'all',
      expected: true
    },

    {
      name: 'none',
      expected: false
    },
    {
      name: 'invert',
      expected: false
    }
  ];

  dataProvider.forEach(function checktype(item) {
    it('should toggle for ' + item.name, function() {
      selectedServers.toggleType(item.name);

      expect(selectedServers.servers['https://hostname1.localdomain']).toBe(
        item.expected
      );
    });
  });

  it('should add a new server', function() {
    selectedServers.addNewServers([{ fqdn: 'https://hostname2.localdomain' }]);

    expect(selectedServers.servers['https://hostname2.localdomain']).toBe(
      false
    );
  });
});
