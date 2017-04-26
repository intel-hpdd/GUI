// @flow

import Tooltip from '../../../source/iml/tooltip.js';
import Inferno from 'inferno';

import { querySelector } from '../../../source/iml/dom-utils.js';

describe('tooltip', () => {
  let root, tooltip: HTMLElement;

  describe('with a message', () => {
    beforeEach(() => {
      root = document.createElement('div');

      Inferno.render(
        <Tooltip
          message="Test message"
          direction="bottom"
          size="large"
          moreClasses={['extra-class']}
        />,
        root
      );

      tooltip = querySelector(root, '.inferno-tt');
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

    it('should have the size class', () => {
      expect(tooltip.classList).toContain('large');
    });

    it('should have the tooltip-arrow', () => {
      const tooltipArrow = querySelector(tooltip, '.tooltip-arrow');
      expect(tooltipArrow).not.toBeNull();
    });

    it('should have an inner section with a message', () => {
      const tooltipInner = querySelector(tooltip, '.tooltip-inner');
      expect(tooltipInner.textContent).toEqual('Test message');
    });
  });

  describe('without a message', () => {
    beforeEach(() => {
      root = document.createElement('div');

      Inferno.render(
        <Tooltip message="" direction="bottom" moreClasses={['extra-class']} />,
        root
      );

      tooltip = querySelector(root, '.inferno-tt');
    });

    it('should not render a tooltip', () => {
      expect(tooltip).toBeNull();
    });
  });
});
