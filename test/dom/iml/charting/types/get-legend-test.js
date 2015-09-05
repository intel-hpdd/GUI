describe('get legend', function () {

  beforeEach(module('charting'));

  var d3, getLegend, div, svg, w, h, mouseClick, getElement, translate, components;

  beforeEach(inject(function (_getLegend_, _d3_) {
    d3 = _d3_;
    getLegend = _getLegend_;

    translate = function translate(x, y) {
      return 'translate(%s,%s)'.sprintf(x, y);
    };

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

  afterEach(function () {
    div.removeChild(document.querySelector('svg'));
    document.body.removeChild(div);
  });

  it('should be a function', function () {
    expect(getLegend).toEqual(jasmine.any(Function));
  });

  describe('instance', function () {
    var color, componentNames, legend, legendContainer;

    componentNames = [
      "running actions with stuff",
      "waiting requests in queue",
      "idle workers",
      "running actions with stuff2",
      "waiting requests in queue2",
      "idle workers2"
    ];

    beforeEach(inject(function (d3) {
      color = d3.scale.category10();

      var colorOrdinal = d3.scale.ordinal();
      colorOrdinal.domain(componentNames);
      colorOrdinal.range(d3.scale.category10().range().slice(0, componentNames.length));

      // name to value ordinal scale
      // domain would be a NAME
      // range would be a color
      legend = getLegend()
        .colors(colorOrdinal)
        .width(w)
        .height(28)
        .padding(10)
        .showLabels(true);

      // Add and position a legend group
      legendContainer = d3.select('svg')
        .append('g')
        .attr('class', 'legend-wrap')
        .datum(colorOrdinal.domain())
        .call(legend);

      components = legendContainer.node().querySelectorAll.bind(legendContainer.node());
    }));

    it('should have a colors accessor', function () {
      expect(legend.colors).toEqual(jasmine.any(Function));
    });

    it('should have a width accessor', function () {
      expect(legend.width).toEqual(jasmine.any(Function));
    });

    it('should have a height accessor', function () {
      expect(legend.height).toEqual(jasmine.any(Function));
    });

    it('should have a padding accessor', function () {
      expect(legend.padding).toEqual(jasmine.any(Function));
    });

    it('should have a radius accessor', function () {
      expect(legend.radius).toEqual(jasmine.any(Function));
    });

    it('should have a showLabels accessor', function () {
      expect(legend.showLabels).toEqual(jasmine.any(Function));
    });

    it('should have a dispatch accessor', function () {
      expect(legend.dispatch).toEqual(jasmine.any(Function));
    });

    describe('group', function () {
      componentNames.forEach(function (name) {
        it('should have a circle for %s'.sprintf(name), function () {
          var circle = legendContainer.select('.legend-wrap g[data-name="%s"] circle'.sprintf(name));
          expect(circle).not.toBeNull();
        });
      });

      componentNames.forEach(function (name) {
        it('should have a label for %s'.sprintf(name), function () {
          var label = legendContainer.select('.legend-wrap g[data-name="%s"] text'.sprintf(name));
          expect(label.text()).toEqual(name);
        });
      });
    });

    describe('events', function () {
      var onSelectionSpy, node;

      beforeEach(function () {
        onSelectionSpy = jasmine.createSpy('onSelectionSpy');
        legend.dispatch().on('selection', onSelectionSpy);
      });

      describe('on selected', function () {
        componentNames.forEach(function (name) {
          it('should dispatch the selection event for "%s"'.sprintf(name), function () {
            node = getElement(legendContainer.select('.legend-wrap g[data-name="%s"]'.sprintf(name)));
            node.dispatchEvent(mouseClick);
            expect(onSelectionSpy).toHaveBeenCalledOnceWith(name, true);
          });
        });

        componentNames.forEach(function (name) {
          it('should not have a fill opacity for "%s"'.sprintf(name), function () {
            node = getElement(legendContainer.select('.legend-wrap g[data-name="%s"]'.sprintf(name)));
            node.dispatchEvent(mouseClick);

            var circle = getElement(legendContainer.select('.legend-wrap g[data-name="%s"] circle'.sprintf(name)));

            expect(circle.getAttribute('fill-opacity')).toEqual('0');
          });
        });
      });

      describe('on unselected', function () {
        componentNames.forEach(function (name) {
          it('should dispatch the selection event for "%s"'.sprintf(name), function () {
            node = getElement(legendContainer.select('.legend-wrap g[data-name="%s"]'.sprintf(name)));
            node.dispatchEvent(mouseClick); // select
            node.dispatchEvent(mouseClick); // deselect
            expect(onSelectionSpy).toHaveBeenCalledOnceWith(name, false);
          });
        });

        componentNames.forEach(function (name) {
          it('should have a fill opacity for "%s"'.sprintf(name), function () {
            var circle;
            node = getElement(legendContainer.select('.legend-wrap g[data-name="%s"]'.sprintf(name)));
            node.dispatchEvent(mouseClick); // select
            node.dispatchEvent(mouseClick); // unselect

            circle = getElement(legendContainer.select('.legend-wrap g[data-name="%s"] circle'.sprintf(name)));

            expect(circle.getAttribute('fill-opacity')).toBeNull();
          });
        });
      });
    });

    describe('layout', function () {
      var itemDimensions;

      describe('with labels', function () {

        it('should display the label', function () {
          var labels = legendContainer.selectAll('.legend-wrap g text');
          var displayIsInherit = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq('inherit'));
          var hasLabels = fp.flow(fp.head, fp.every(displayIsInherit))(labels);

          expect(hasLabels).toEqual(true);
        });

        it('should display the circles', function () {
          var circles = legendContainer.selectAll('.legend-wrap g circle');
          var displayPropNotSet = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq(null));
          var hasCircles = fp.flow(fp.head, fp.every(displayPropNotSet))(circles);

          expect(hasCircles).toEqual(true);
        });

        it('should not overlap with others', function () {
          itemDimensions = fp.flow(fp.head, fp.map(getItemDimensions))(legendContainer
            .selectAll('.legend-wrap > g'));

          expect(verifyNoIntersections(itemDimensions)).toBe(true);
        });

        it('should be arranged in the appropriate order', function () {
          var labels = fp.head(legendContainer.selectAll('.legend-wrap g text'));
          expect(verifyInExpectedOrder(labels, componentNames)).toBe(true);
        });
      });

      describe('without labels', function () {
        beforeEach(function () {
          legend.width(400);
          legendContainer.call(legend);
        });

        it('should not display the label', function () {
          var labels = legendContainer.selectAll('.legend-wrap g text');
          var displayIsNone = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq('none'));
          var hasLabels = fp.flow(fp.head, fp.every(displayIsNone))(labels);

          expect(hasLabels).toEqual(true);
        });

        it('should display the circles', function () {
          var circles = legendContainer.selectAll('.legend-wrap g circle');
          var displayPropNotSet = fp.flow(fp.invokeMethod('getAttribute', ['display']), fp.eq(null));
          var hasCircles = fp.flow(fp.head, fp.every(displayPropNotSet))(circles);

          expect(hasCircles).toEqual(true);
        });

        it('should not overlap with others', function () {
          itemDimensions = fp.flow(fp.head, fp.map(getItemDimensions))(legendContainer
            .selectAll('.legend-wrap > g'));

          expect(verifyNoIntersections(itemDimensions)).toBe(true);
        });

        it('should be arranged in the appropriate order', function () {
          var labels = fp.head(legendContainer.selectAll('.legend-wrap g text'));
          expect(verifyInExpectedOrder(labels, componentNames)).toBe(true);
        });
      });
    });

    var noCollision = fp.curry(2, detectCollision);
    function verifyNoIntersections (itemDimensions) {
      return itemDimensions.every(function (dims, index, arr) {
        return fp.every(noCollision(dims), arr.slice(index + 1));
      });
    }

    function verifyInExpectedOrder (labels, componentNames) {
      return labels.every(function (label, index) {
        return fp.flow(fp.invokeMethod('indexOf', [label.textContent]), fp.eq(index))(componentNames);
      });
    }

    function detectCollision (a, b) {
      var horizontalIntersection = (a.right >= b.left && a.left <= b.left) || (b.right >= a.left && b.left <= a.left);
      var verticalIntersection = a.top === b.top && a.bottom === b.bottom;
      return !horizontalIntersection || (horizontalIntersection && !verticalIntersection);
    }

    function getItemDimensions(item) {
      var clientRect = item.getBoundingClientRect();
      return {
        left: clientRect.left,
        right: clientRect.right,
        top: clientRect.top,
        bottom: clientRect.bottom,
        name: item.getAttribute('data-name')
      };
    }

  });
});

