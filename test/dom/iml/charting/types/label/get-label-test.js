import * as fp from 'intel-fp';

import {
  getLabelFactory
} from '../../../../../../source/iml/charting/types/label/get-label';

describe('get label', () => {
  let d3, getLabel, svg, label;

  beforeEach(module('d3'));

  beforeEach(
    inject(function(_d3_) {
      d3 = _d3_;

      getLabel = getLabelFactory(d3);

      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', 500);
      svg.setAttribute('height', 500);

      label = getLabel();
    })
  );

  it('should be a function', () => {
    expect(getLabel).toEqual(jasmine.any(Function));
  });

  it('should have a color getter', () => {
    expect(label.color()).toBe('#000000');
  });

  it('should have a color setter', () => {
    label.color('#FFFFFF');

    expect(label.color()).toBe('#FFFFFF');
  });

  it('should have a fill getter', () => {
    expect(label.fill()).toBe('#FFFFFF');
  });

  it('should have a fill setter', () => {
    label.fill('#000000');

    expect(label.fill()).toBe('#000000');
  });

  it('should have a width getter', () => {
    expect(label.width()).toBe(0);
  });

  it('should have a width setter', () => {
    label.width(100);

    expect(label.width()).toBe(100);
  });

  it('should have a height getter', () => {
    expect(label.height()).toBe(0);
  });

  it('should have a height setter', () => {
    label.height(100);

    expect(label.height()).toBe(100);
  });

  it('should have a data getter', () => {
    expect(label.data()).toBe(fp.identity);
  });

  it('should have a data setter', () => {
    label.data(['x']);

    expect(label.data()).toEqual(['x']);
  });

  describe('rendering', () => {
    let qs;

    beforeEach(() => {
      label.data(() => ['data string']);
      label.fill('#111111');
      label.width(500);
      label.height(400);

      document.body.appendChild(svg);

      d3.select(svg).datum([1, 2, 3, 4, 5, 6]).call(label);

      qs = expr => svg.querySelector(expr);
    });

    afterEach(() => {
      document.body.removeChild(svg);
    });

    it('should append a rect', () => {
      expect(qs('.label-rect')).not.toBeNull();
    });

    it('should set fill on the rect', () => {
      expect(qs('.label-rect').getAttribute('fill')).toBe('#111111');
    });

    it('should set height on the rect', () => {
      expect(qs('.label-rect').getAttribute('height')).toBe('400');
    });

    it('should set width on the rect', () => {
      expect(qs('.label-rect').getAttribute('width')).toBe('500');
    });

    it('should append text', () => {
      expect(qs('.label-text')).not.toBeNull();
    });

    it('should set text content', () => {
      expect(qs('.label-text').textContent).toBe('data string');
    });

    it('should set text x position', () => {
      expect(qs('.label-text').getAttribute('x')).toBe('250');
    });

    it('should set text y position', () => {
      const labelText = qs('.label-text');
      const { height } = labelText.getBoundingClientRect();

      expect(parseFloat(qs('.label-text').getAttribute('y'), 10)).toBe(
        (400 + height) / 2
      );
    });

    it('should set text anchor to middle', () => {
      expect(qs('.label-text').style['text-anchor']).toBe('middle');
    });

    it('should set the fill', () => {
      expect(qs('.label-text').getAttribute('fill')).toBe('#000000');
    });

    describe('with no data', () => {
      beforeEach(() => {
        label.data(() => []);

        d3.select(svg).call(label);

        window.flushD3Transitions();
      });

      it('should remove the rect', () => {
        expect(qs('.label-rect')).toBeNull();
      });

      it('should remove the text', () => {
        expect(qs('.label-text')).toBeNull();
      });
    });
  });
});
