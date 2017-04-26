import { mock, resetAll } from '../../../system-mock.js';

describe('about states', () => {
  let aboutState;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/about/about-states.js', {
      'source/iml/about/assets/html/about.html': {
        default: 'aboutTemplate'
      }
    });

    aboutState = mod.aboutState;
  });

  afterEach(resetAll);

  it('should create the state', () => {
    expect(aboutState).toEqual({
      name: 'app.about',
      url: '/about',
      controller: 'AboutCtrl',
      controllerAs: 'about',
      template: 'aboutTemplate',
      params: {
        resetState: {
          dynamic: true
        }
      },
      data: {
        anonymousReadProtected: true,
        eulaState: true,
        kind: 'About Intel® Manager for Lustre* software',
        icon: 'fa-info-circle'
      }
    });
  });
});
