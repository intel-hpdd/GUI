// @flow

import Inferno from 'inferno';

import { mock, resetAll } from '../../system-mock.js';
import { querySelector } from '../../../source/iml/dom-utils.js';

describe('help tooltip', () => {
  let root, helpTooltip: HTMLElement, HelpTooltip, HELP_TEXT;

  describe('with a message', () => {
    beforeEachAsync(async function() {
      root = document.createElement('div');
      HELP_TEXT = {
        my_key: 'your value'
      };

      const mod = await mock('source/iml/help-tooltip.js', {
        'source/iml/environment.js': { HELP_TEXT }
      });

      HelpTooltip = mod.default;
      Inferno.render(
        <HelpTooltip
          helpKey="my_key"
          direction="bottom"
          moreClasses={['extra-class']}
        />,
        root
      );

      helpTooltip = querySelector(root, '.inferno-tt');
    });

    afterEach(resetAll);

    it('should render the helpTooltip', () => {
      expect(helpTooltip).not.toBeNull();
    });

    it('should have the helpTooltip class', () => {
      expect(helpTooltip.classList).toContain('tooltip');
    });

    it('should have the inferno-tt class', () => {
      expect(helpTooltip.classList).toContain('inferno-tt');
    });

    it('should have the position class', () => {
      expect(helpTooltip.classList).toContain('bottom');
    });

    it('should have the extra class', () => {
      expect(helpTooltip.classList).toContain('extra-class');
    });

    it('should have the helpTooltip-arrow', () => {
      const helpTooltipArrow = querySelector(helpTooltip, '.tooltip-arrow');
      expect(helpTooltipArrow).not.toBeNull();
    });

    it('should have an inner section with a message', () => {
      const tooltipInner = querySelector(helpTooltip, '.tooltip-inner');
      expect(tooltipInner.textContent).toEqual('your value');
    });
  });

  describe('without a message', () => {
    beforeEach(() => {
      root = document.createElement('div');

      Inferno.render(
        <HelpTooltip
          helpKey=""
          direction="bottom"
          moreClasses={['extra-class']}
        />,
        root
      );

      helpTooltip = querySelector(root, '.inferno-tt');
    });

    it('should not render a tooltip', () => {
      expect(helpTooltip).toBeNull();
    });
  });
});
