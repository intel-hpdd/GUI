import serverModule from '../../../../source/iml/server/server-module';

describe('hostlist filter service', function() {
  let pdshFilter, naturalSortFilter;

  beforeEach(
    module(serverModule, function($provide) {
      pdshFilter = jasmine.createSpy('pdshFilter');
      $provide.value('pdshFilter', pdshFilter);

      naturalSortFilter = jasmine.createSpy('naturalSortFilter');
      $provide.value('naturalSortFilter', naturalSortFilter);
    })
  );

  let hostlistFilter;

  beforeEach(
    inject(function(_hostlistFilter_) {
      hostlistFilter = _hostlistFilter_;
    })
  );

  it('should expose the expected interface', function() {
    expect(hostlistFilter).toEqual({
      setHosts: expect.any(Function),
      setHash: expect.any(Function),
      setFuzzy: expect.any(Function),
      setReverse: expect.any(Function),
      compute: expect.any(Function)
    });
  });

  describe('computing a filtered hostlist', function() {
    beforeEach(function() {
      pdshFilter.and.returnValue('host1Filtered');

      hostlistFilter
        .setHosts(['host1', 'host2'])
        .setHash({ host1: '' })
        .setFuzzy(true)
        .setReverse(false)
        .compute();
    });

    it('should call the pdsh filter', function() {
      expect(pdshFilter).toHaveBeenCalledOnceWith(
        ['host1', 'host2'],
        { host1: '' },
        expect.any(Function),
        true
      );
    });

    it('should call the natural sort filter', function() {
      expect(naturalSortFilter).toHaveBeenCalledOnceWith(
        'host1Filtered',
        expect.any(Function),
        false
      );
    });
  });
});
