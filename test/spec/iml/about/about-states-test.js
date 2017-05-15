import { aboutState } from '../../../../source/iml/about/about-states.js';

describe('about states', () => {
  it('should create the state', () => {
    expect(aboutState).toEqual({
      name: 'app.about',
      url: '/about',
      component: 'aboutComponent',
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
