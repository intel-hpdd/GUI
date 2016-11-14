// @flow

import Tooltip from '../../../source/iml/tooltip.js';
import Inferno from 'inferno';

describe('tooltip', () => {
  let root, tooltip;

  describe('with a message', () => {
    beforeEach(() => {
      root = document.createElement('div');

      Inferno.render(
        <Tooltip message="Test message" direction="bottom"
          moreClasses={['extra-class']} />,
        root
      );

      tooltip = root.querySelector('.inferno-tt');
    });

    it('should render the tooltip', () => {
      expect(tooltip).not.toBeNull();
    });

    it('should have the tooltip class', () => {
      expect(tooltip.classList).toContain('tooltip');
    });

    it('should have the inferno-tt class', () => {
      expect(tooltip.classList).toContain('inferno-tt');
    });

    it('should have the position class', () => {
      expect(tooltip.classList).toContain('bottom');
    });

    it('should have the extra class', () => {
      expect(tooltip.classList).toContain('extra-class');
    });

    it('should have the tooltip-arrow', () => {
      const tooltipArrow = tooltip.querySelector('.tooltip-arrow');
      expect(tooltipArrow).not.toBeNull();
    });

    it('should have an inner section with a message', () => {
      const tooltipInner = tooltip.querySelector('.tooltip-inner');
      expect(tooltipInner.textContent).toEqual('Test message');
    });
  });

  describe('without a message', () => {
    beforeEach(() => {
      root = document.createElement('div');

      Inferno.render(
        <Tooltip message="" direction="bottom"
          moreClasses={['extra-class']} />,
        root
      );

      tooltip = root.querySelector('.inferno-tt');
    });

    it('should not render a tooltip', () => {
      expect(tooltip).toBeNull();
    });
  });
});
