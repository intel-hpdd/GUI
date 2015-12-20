import angular from 'angular';
const {module, inject} = angular.mock;

describe('get legend', () => {
  beforeEach(module('legend'));

  var d3, getLegend, div, svg, w, h,
    mouseClick, getElement, translate;

  beforeEach(inject((_getLegend_, _d3_) => {
    d3 = _d3_;
    getLegend = _getLegend_;

    translate = (x, y) => `translate(${x},${y})`;

    getElement = fp.flow(fp.head, fp.head);
    mouseClick = new MouseEvent('click');

    div = document.createElement('div');

    w = 700;
    h = 300;

    svg = document
      .createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    div.appendChild(svg);
    document.body.appendChild(div);
  }));

  afterEach(() => {
    document.body.removeChild(div);
  });

  it('should be a function', () => {
    expect(getLegend).toEqual(jasmine.any(Function));
  });

  describe('instance', () => {
    var componentNames, legend, legendContainer;

    componentNames = [
      'running actions with stuff',
      'waiting requests in queue',
      'idle workers',
      'running actions with stuff2',
      'waiting requests in queue2',
      'idle workers2'
    ];

    beforeEach(inject((d3) => {
      var colorOrdinal = d3.scale.ordinal();
      colorOrdinal.domain(componentNames);
      colorOrdinal.range(d3.scale.category10().range().slice(0, componentNames.length));

      legend = getLegend()
        .colors(colorOrdinal)
        .width(w)
        .height(45)
        .padding(10)
        .showLabels(true);

      // Add and position a legend group
      legendContainer = d3.select('svg')
        .append('g')
        .attr('class', 'legend-wrap')
        .call(legend);

      window.flushD3Transitions();
    }));

    it('should have a colors accessor', () => {
      expect(legend.colors).toEqual(jasmine.any(Function));
    });

    it('should have a width accessor', () => {
      expect(legend.width).toEqual(jasmine.any(Function));
    });

    it('should have a height accessor', () => {
      expect(legend.height).toEqual(jasmine.any(Function));
    });

    it('should have a padding accessor', () => {
      expect(legend.padding).toEqual(jasmine.any(Function));
    });

    it('should have a radius accessor', () => {
      expect(legend.radius).toEqual(jasmine.any(Function));
    });

    it('should have a showLabels accessor', () => {
      expect(legend.showLabels).toEqual(jasmine.any(Function));
    });

    it('should have a dispatch accessor', () => {
      expect(legend.dispatch).toEqual(jasmine.any(Function));
    });

    describe('group', () => {
      componentNames.forEach((name) => {
        it(`should have a circle for ${name}`, () => {
          const circle = legendContainer
            .selectAll('.legend-circle')
            .filter((d) => d === name);

          expect(circle.size()).toBe(1);
        });
      });

      componentNames.forEach((name) => {
        it(`should have a label for ${name}`, () => {
          const label = legendContainer
            .selectAll('.legend-label')
            .filter((d) => d === name);

          expect(label.text()).toEqual(name);
        });
      });
    });

    describe('events', () => {
      var onSelectionSpy, node;

      beforeEach(() => {
        onSelectionSpy = jasmine.createSpy('onSelectionSpy');

        legend.dispatch()
          .on('selection', onSelectionSpy);
      });

      describe('on selected', () => {
        componentNames.forEach((name) => {
          it(`should dispatch the selection event for "${name}"`, () => {
            node = legendContainer
              .selectAll('.legend-group')
              .filter((d) => d === name)
              .node();

            node.dispatchEvent(mouseClick);
            expect(onSelectionSpy).toHaveBeenCalledOnceWith(name, true);
          });
        });

        componentNames.forEach((name) => {
          it(`should not have a fill opacity for "${name}"`, () => {
            node = legendContainer
              .selectAll('.legend-group')
              .filter((d) => d === name)
              .node();

            node.dispatchEvent(mouseClick);

            const circle = d3.select(node)
              .selectAll('.legend-circle');

            window.flushD3Transitions();

            expect(circle.attr('fill-opacity')).toBe('0');
          });
        });
      });

      describe('on unselected', () => {
        componentNames.forEach((name) => {
          it(`should dispatch the selection event for "${name}"`, () => {
            node = legendContainer
              .selectAll('.legend-group')
              .filter((d) => d === name)
              .node();

            node.dispatchEvent(mouseClick); // select
            node.dispatchEvent(mouseClick); // deselect

            expect(onSelectionSpy)
              .toHaveBeenCalledOnceWith(name, false);
          });
        });

        componentNames.forEach((name) => {
          it(`should have a fill opacity for "${name}"`, () => {
            node = legendContainer
              .selectAll('.legend-group')
              .filter((d) => d === name)
              .node();

            node.dispatchEvent(mouseClick); // select
            window.flushD3Transitions();
            node.dispatchEvent(mouseClick); // unselect

            const circle = d3.select(node)
              .select('.legend-circle');

            window.flushD3Transitions();

            expect(circle.attr('fill-opacity')).toBe('1');
          });
        });
      });
    });

    describe('layout', () => {
      var itemDimensions;

      describe('with labels', () => {

        it('should display the label', () => {
          var labels = legendContainer.selectAll('.legend-wrap g text');
          var displayIsInherit = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq('inherit'));
          var hasLabels = fp.flow(fp.head, fp.every(displayIsInherit))(labels);

          expect(hasLabels).toEqual(true);
        });

        it('should display the circles', () => {
          var circles = legendContainer.selectAll('.legend-wrap g circle');
          var displayPropNotSet = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq(null));
          var hasCircles = fp.flow(fp.head, fp.every(displayPropNotSet))(circles);

          expect(hasCircles).toEqual(true);
        });

        it('should not overlap with others', () => {
          itemDimensions = fp.flow(fp.head, fp.map(getItemDimensions))(legendContainer
            .selectAll('.legend-wrap > g'));

          expect(verifyNoIntersections(itemDimensions)).toBe(true);
        });

        it('should be arranged in the appropriate order', () => {
          var labels = fp.head(legendContainer.selectAll('.legend-wrap g text'));
          expect(verifyInExpectedOrder(labels, componentNames)).toBe(true);
        });
      });

      describe('without labels', () => {
        beforeEach(() => {
          legend.width(400);
          legendContainer.call(legend);
        });

        it('should not display the label', () => {
          var labels = legendContainer.selectAll('.legend-wrap g text');
          var displayIsNone = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq('none'));
          var hasLabels = fp.flow(fp.head, fp.every(displayIsNone))(labels);

          expect(hasLabels).toEqual(true);
        });

        it('should display the circles', () => {
          var circles = legendContainer.selectAll('.legend-wrap g circle');
          var displayPropNotSet = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq(null));
          var hasCircles = fp.flow(fp.head, fp.every(displayPropNotSet))(circles);

          expect(hasCircles).toEqual(true);
        });

        it('should not overlap with others', () => {
          itemDimensions = fp.flow(fp.head, fp.map(getItemDimensions))(legendContainer
            .selectAll('.legend-wrap > g'));

          expect(verifyNoIntersections(itemDimensions)).toBe(true);
        });

        it('should be arranged in the appropriate order', () => {
          var labels = fp.head(legendContainer.selectAll('.legend-wrap g text'));
          expect(verifyInExpectedOrder(labels, componentNames)).toBe(true);
        });
      });
    });

    var noCollision = fp.curry(2, detectCollision);
    function verifyNoIntersections (itemDimensions) {
      return itemDimensions.every((dims, index, arr) => {
        return fp.every(noCollision(dims), arr.slice(index + 1));
      });
    }

    function verifyInExpectedOrder (labels, componentNames) {
      return labels.every((label, index) => {
        return fp.flow(fp.invokeMethod('indexOf', [label.textContent]), fp.eq(index))(componentNames);
      });
    }

    function detectCollision (a, b) {
      var horizontalIntersection = (a.right >= b.left && a.left <= b.left) || (b.right >= a.left && b.left <= a.left);
      var verticalIntersection = a.top === b.top && a.bottom === b.bottom;
      return !horizontalIntersection || (horizontalIntersection && !verticalIntersection);
    }

    function getItemDimensions (item) {
      var clientRect = item.getBoundingClientRect();
      return {
        left: clientRect.left,
        right: clientRect.right,
        top: clientRect.top,
        bottom: clientRect.bottom
      };
    }

  });
});

