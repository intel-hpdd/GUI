// @flow

import Inferno from 'inferno';

import { renderToSnapshot } from '../../../test-utils.js';

const Child = (props: Object) =>
  <div>
    {JSON.stringify(props[props.propName])}
  </div>;

describe('charting', () => {
  let Chart;

  beforeEach(() => {
    jest.mock('@iml/debounce', () => fn => fn);

    Chart = require('../../../../source/iml/charting/chart.js').default;
  });

  it('should match', () => {
    expect(
      renderToSnapshot(
        <Chart
          margins={{ top: 50, right: 50, bottom: 50, left: 50 }}
          points={[1, 2, 3]}
        >
          <Child propName="margins" />
          <Child propName="dimensions" />
          <Child propName="points" />
        </Chart>
      )
    ).toMatchSnapshot();
  });

  it('should set state on resize', () => {
    const root = document.createElement('div');
    root.style.setProperty('width', '500px');
    root.style.setProperty('height', '500px');

    Inferno.render(
      <Chart
        margins={{ top: 50, right: 50, bottom: 50, left: 50 }}
        points={[1, 2, 3]}
      >
        <Child propName="margins" />
        <Child propName="dimensions" />
        <Child propName="points" />
      </Chart>,
      root
    );

    // $FlowFixMe: Mocking for test
    root.querySelector('svg').getBoundingClientRect = () => ({
      width: 500,
      height: 500
    });

    window.dispatchEvent(new Event('resize', { bubbles: true }));

    expect(root).toMatchSnapshot();
  });

  it('should cleanup when unmounting', () => {
    jest.spyOn(window, 'removeEventListener');

    const root = document.createElement('div');
    root.style.setProperty('width', '500px');
    root.style.setProperty('height', '500px');

    Inferno.render(
      <Chart
        margins={{ top: 50, right: 50, bottom: 50, left: 50 }}
        points={[1, 2, 3]}
      >
        <Child propName="margins" />
        <Child propName="dimensions" />
        <Child propName="points" />
      </Chart>,
      root
    );

    Inferno.render(null, root);
  });
});
