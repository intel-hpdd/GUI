import { appState } from '../../../../source/iml/app/app-states.js';
describe('app states', () => {
  it('should create the state', () => {
    expect(appState).toMatchSnapshot();
  });
});
