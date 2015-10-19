import { AboutCtrl } from '../../../../source/chroma_ui/iml/about/about-controller-exports';

describe('about controller', () => {
  var help, ENV, ctrl;

  beforeEach(() => {
    help = {
      get: jasmine.createSpy('get').andReturn('2015')
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
    expect(ctrl).toEqual({
      IS_RELEASE: false,
      VERSION: 123,
      BUILD: 'test build',
      COPYRIGHT_YEAR: '2015'
    });
  });
});
