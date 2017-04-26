import AboutCtrl from '../../../../source/iml/about/about-controller';

describe('about controller', () => {
  let help, ENV, ctrl;

  beforeEach(() => {
    help = {
      get: jasmine.createSpy('get').and.returnValue('2015')
    };

    ENV = {
      IS_RELEASE: false,
      VERSION: 123,
      BUILD: 'test build'
    };

    ctrl = new AboutCtrl(ENV, help);
  });

  it('should be a function', () => {
    expect(AboutCtrl).toEqual(jasmine.any(Function));
  });

  it('should call help when invoked', () => {
    expect(help.get).toHaveBeenCalledOnceWith('copyright_year');
  });

  it('should return an instance of the about controller', () => {
    const scope = {
      IS_RELEASE: false,
      VERSION: 123,
      BUILD: 'test build',
      COPYRIGHT_YEAR: '2015'
    };

    expect(ctrl).toEqual(scope);
  });
});
