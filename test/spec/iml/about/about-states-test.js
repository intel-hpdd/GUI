import {
  aboutState
} from '../../../../source/iml/about/about-states.js';

describe('about states', () => {
  it('should create the state', () => {
    expect(aboutState)
      .toEqual({
        name: 'app.about',
        url: '/about',
        controller: 'AboutCtrl',
        controllerAs: 'about',
        templateUrl: '/static/chroma_ui/source/iml/about/assets/html/about.js',
        params: {
          resetState: {
            dynamic: true
          }
        },
        data: {
          anonymousReadProtected: true,
          eulaState: true
        }
      });
  });
});
