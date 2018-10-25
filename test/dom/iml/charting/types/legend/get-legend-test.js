import * as fp from "@iml/fp";
import mockD3 from "d3";
import * as maybe from "@iml/maybe";
import { flushD3Transitions } from "../../../../../test-utils.js";

describe("get legend", () => {
  let getLegendFactory, getLegend, div, svg, w, h, mouseClick, d3Select;

  beforeEach(() => {
    d3Select = mockD3.select;
    mockD3.select = x => {
      const selected = d3Select(x);
      selected.selectAll(".legend-group")[0].forEach(svgElement => {
        svgElement.getBoundingClientRect = () => {
          const width = svgElement.__data__.length * 12;
          return { width, height: 12 };
        };
      });

      return selected;
    };

    jest.mock("d3", () => mockD3);
    mouseClick = new MouseEvent("click");
    div = document.createElement("div");
    w = 700;
    h = 300;
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    div.appendChild(svg);
    div.appendChild(document.createTextNode("bla"));
    document.body.appendChild(div);
    getLegendFactory = require("../../../../../../source/iml/charting/types/legend/get-legend.js").getLegendFactory;
    getLegend = getLegendFactory();
  });

  afterEach(() => {
    document.body.removeChild(div);
    mockD3.select = d3Select;
  });

  it("should be a function", () => {
    expect(getLegend).toEqual(expect.any(Function));
  });

  describe("instance", () => {
    let legend, legendContainer;
    const componentNames = [
      "running actions with stuff",
      "waiting requests in queue",
      "idle workers",
      "running actions with stuff2",
      "waiting requests in queue2",
      "idle workers2"
    ];

    beforeEach(() => {
      const colorOrdinal = mockD3.scale.ordinal();
      colorOrdinal.domain(componentNames);
      colorOrdinal.range(
        mockD3.scale
          .category10()
          .range()
          .slice(0, componentNames.length)
      );
      legend = getLegend()
        .colors(colorOrdinal)
        .width(w)
        .height(45)
        .padding(10)
        .showLabels(true); // Add and position a legend group

      legendContainer = mockD3
        .select("svg")
        .append("g")
        .attr("class", "legend-wrap")
        .call(legend);

      flushD3Transitions(mockD3);
    });

    it("should have a colors accessor", () => {
      expect(legend.colors).toEqual(expect.any(Function));
    });

    it("should have a width accessor", () => {
      expect(legend.width).toEqual(expect.any(Function));
    });

    it("should have a height accessor", () => {
      expect(legend.height).toEqual(expect.any(Function));
    });

    it("should have a padding accessor", () => {
      expect(legend.padding).toEqual(expect.any(Function));
    });

    it("should have a radius accessor", () => {
      expect(legend.radius).toEqual(expect.any(Function));
    });

    it("should have a showLabels accessor", () => {
      expect(legend.showLabels).toEqual(expect.any(Function));
    });

    it("should have a dispatch accessor", () => {
      expect(legend.dispatch).toEqual(expect.any(Function));
    });

    describe("group", () => {
      componentNames.forEach(name => {
        it(`should have a circle for ${name}`, () => {
          const circle = legendContainer.selectAll(".legend-circle").filter(d => d === name);
          expect(circle.size()).toBe(1);
        });
      });

      componentNames.forEach(name => {
        it(`should have a label for ${name}`, () => {
          const label = legendContainer.selectAll(".legend-label").filter(d => d === name);
          expect(label.text()).toEqual(name);
        });
      });
    });

    describe("events", () => {
      let onSelectionSpy, node;

      beforeEach(() => {
        onSelectionSpy = jest.fn();
        legend.dispatch().on("selection", onSelectionSpy);
      });

      describe("on selected", () => {
        componentNames.forEach(name => {
          it(`should dispatch the selection event for "${name}"`, () => {
            node = legendContainer
              .selectAll(".legend-group")
              .filter(d => d === name)
              .node();
            node.dispatchEvent(mouseClick);
            expect(onSelectionSpy).toHaveBeenCalledOnceWith(name, true);
          });
        });

        componentNames.forEach(name => {
          it(`should not have a fill opacity for "${name}"`, () => {
            node = legendContainer
              .selectAll(".legend-group")
              .filter(d => d === name)
              .node();
            node.dispatchEvent(mouseClick);
            const circle = mockD3.select(node).selectAll(".legend-circle");
            flushD3Transitions(mockD3);
            expect(circle.attr("fill-opacity")).toBe("0");
          });
        });
      });

      describe("on unselected", () => {
        componentNames.forEach(name => {
          it(`should dispatch the selection event for "${name}"`, () => {
            node = legendContainer
              .selectAll(".legend-group")
              .filter(d => d === name)
              .node();
            node.dispatchEvent(mouseClick); // select
            node.dispatchEvent(mouseClick); // deselect
            expect(onSelectionSpy).toHaveBeenCalledOnceWith(name, false);
          });
        });

        componentNames.forEach(name => {
          it(`should have a fill opacity for "${name}"`, () => {
            node = legendContainer
              .selectAll(".legend-group")
              .filter(d => d === name)
              .node();
            node.dispatchEvent(mouseClick); // select
            flushD3Transitions(mockD3);
            node.dispatchEvent(mouseClick); // unselect
            const circle = mockD3.select(node).select(".legend-circle");
            flushD3Transitions(mockD3);
            expect(circle.attr("fill-opacity")).toBe("1");
          });
        });
      });
    });

    describe("layout", () => {
      let itemDimensions;

      beforeEach(() => {
        legendContainer.call(legend);
      });

      describe("with labels", () => {
        it("should display the label", () => {
          const labels = legendContainer.selectAll(".legend-wrap g text");
          const displayIsInherit = fp.flow(
            fp.invokeMethod("getAttribute")(["display"]),
            fp.eq("inherit")
          );
          const hasLabels = fp.flow(
            fp.head,
            maybe.fromJust.bind(null),
            fp.every(displayIsInherit)
          )(labels);
          expect(hasLabels).toEqual(true);
        });

        it("should display the circles", () => {
          const circles = legendContainer.selectAll(".legend-wrap g circle");
          const displayPropNotSet = fp.flow(
            fp.invokeMethod("getAttribute")(["display"]),
            fp.eq(null)
          );
          const hasCircles = fp.flow(
            fp.head,
            maybe.fromJust.bind(null),
            fp.every(displayPropNotSet)
          )(circles);
          expect(hasCircles).toEqual(true);
        });

        xit("should not overlap with others", () => {
          itemDimensions = fp.flow(
            fp.head,
            maybe.fromJust.bind(null),
            fp.map(getItemDimensions)
          )(legendContainer.selectAll(".legend-wrap > g"));
          expect(verifyNoIntersections(itemDimensions)).toBe(true);
        });

        it("should be arranged in the appropriate order", () => {
          const labels = fp.head(legendContainer.selectAll(".legend-wrap g text"));
          expect(verifyInExpectedOrder(maybe.fromJust(labels), componentNames)).toBe(true);
        });
      });

      describe("without labels", () => {
        beforeEach(() => {
          legend.width(200);
          legendContainer.call(legend);
        });

        it("should not display the label", () => {
          const labels = legendContainer.selectAll(".legend-wrap g text");
          const displayIsNone = fp.flow(
            fp.invokeMethod("getAttribute")(["display"]),
            fp.eq("none")
          );
          const noLabels = fp.flow(
            fp.head,
            maybe.fromJust.bind(null),
            fp.every(displayIsNone)
          )(labels);
          expect(noLabels).toBe(true);
        });

        it("should display the circles", () => {
          const circles = legendContainer.selectAll(".legend-wrap g circle");
          const displayPropNotSet = fp.flow(
            fp.invokeMethod("getAttribute")(["display"]),
            fp.eq(null)
          );
          const hasCircles = fp.flow(
            fp.head,
            maybe.fromJust.bind(null),
            fp.every(displayPropNotSet)
          )(circles);
          expect(hasCircles).toEqual(true);
        });

        xit("should not overlap with others", () => {
          itemDimensions = fp.flow(
            xs => xs[0],
            fp.map(getItemDimensions)
          )(legendContainer.selectAll(".legend-wrap > g"));
          expect(verifyNoIntersections(itemDimensions)).toBe(true);
        });

        it("should be arranged in the appropriate order", () => {
          const labels = fp.head(legendContainer.selectAll(".legend-wrap g text"));
          expect(verifyInExpectedOrder(maybe.fromJust(labels), componentNames)).toBe(true);
        });
      });
    });
    const detectCollision = a => b => {
      const horizontalIntersection = (a.right >= b.left && a.left <= b.left) || (b.right >= a.left && b.left <= a.left);
      const verticalIntersection = a.top === b.top && a.bottom === b.bottom;
      return !horizontalIntersection || (horizontalIntersection && !verticalIntersection);
    };
    function verifyNoIntersections(itemDimensions) {
      return itemDimensions.every((dims, index, arr) => {
        return fp.every(detectCollision(dims))(arr.slice(index + 1));
      });
    }
    function verifyInExpectedOrder(labels, componentNames) {
      return labels.every((label, index) => {
        return fp.flow(
          fp.invokeMethod("indexOf")([label.textContent]),
          fp.eq(index)
        )(componentNames);
      });
    }
    function getItemDimensions(item) {
      const clientRect = item.getBoundingClientRect();
      return {
        left: clientRect.left,
        right: clientRect.right,
        top: clientRect.top,
        bottom: clientRect.bottom
      };
    }
  });
});
