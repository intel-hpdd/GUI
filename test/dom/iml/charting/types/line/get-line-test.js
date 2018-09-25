import * as fp from "@iml/fp";
import { default as mockD3 } from "d3";
import { gt } from "@iml/math";
import { flushD3Transitions } from "../../../../../test-utils.js";

const viewLens = fp.flow(
  fp.lensProp,
  fp.view
);
const getCoord = (curr, idx) => Math.round(curr.split(",")[idx]);

describe("get line", () => {
  function getCoords(line) {
    return line
      .getAttribute("d")
      .split(/([L|M])/)
      .filter(
        fp.flow(
          viewLens("length"),
          x => gt(0, x)
        )
      )
      .reduce((arr, curr) => {
        if (/[M|L]/.test(curr)) {
          arr.push({ type: curr });
        } else {
          const last = arr[arr.length - 1];
          last.x = getCoord(curr, 0);
          last.y = getCoord(curr, 1);
        }
        return arr;
      }, []);
  }

  let getLine, div, svg, query;

  beforeEach(() => {
    jest.mock("d3", () => mockD3);

    jest.mock("../../../../../../source/iml/global.js", () => ({
      location: {
        href: "https://foo/"
      }
    }));

    getLine = require("../../../../../../source/iml/charting/types/line/get-line").default;

    Element.prototype.getTotalLength = () => 100;
    div = document.createElement("div");
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 500);
    svg.setAttribute("height", 500);
    div.appendChild(svg);
    query = svg.querySelector.bind(svg);
  });

  afterEach(() => {
    delete Element.prototype.getTotalLength;
  });

  it("should be a function", () => {
    expect(getLine).toEqual(expect.any(Function));
  });

  describe("instance", () => {
    let inst, spy, setup;
    beforeEach(() => {
      inst = getLine();
      spy = jest.fn();

      const x = mockD3.scale.linear();
      x.range([0, 100]);

      const y = mockD3.scale.linear();
      y.range([100, 0]);

      svg = mockD3.select(svg).append("g");
      setup = d => {
        x.domain([0, mockD3.max(d, viewLens("x"))]);
        y.domain([0, mockD3.max(d, viewLens("y"))]);
        inst
          .xScale(x)
          .yScale(y)
          .xValue(viewLens("x"))
          .xComparator((a, b) => fp.eq(a)(b))
          .yValue(viewLens("y"));
        svg.datum(d).call(inst);
      };
    });

    it("should have a color accessor", () => {
      expect(inst.color()).toEqual("#000000");
    });

    it("should have a color setter", () => {
      inst.color("#111111");
      expect(inst.color()).toEqual("#111111");
    });

    it("should have an xValue accessor", () => {
      expect(inst.xValue()).toEqual(expect.any(Function));
    });

    it("should have an xValue setter", () => {
      inst.xValue(spy);
      expect(inst.xValue()).toBe(spy);
    });

    it("should have a yValue accessor", () => {
      expect(inst.yValue()).toEqual(expect.any(Function));
    });

    it("should have a yValue setter", () => {
      inst.yValue(spy);
      expect(inst.yValue()).toBe(spy);
    });

    it("should have an xScale accessor", () => {
      expect(inst.xScale()).toEqual(expect.any(Function));
    });

    it("should have a xScale setter", () => {
      inst.xScale(spy);
      expect(inst.xScale()).toBe(spy);
    });

    it("should have a yScale accessor", () => {
      expect(inst.yScale()).toEqual(expect.any(Function));
    });

    it("should have a yScale setter", () => {
      inst.yScale(spy);
      expect(inst.yScale()).toBe(spy);
    });

    it("should have an xComparator accessor", () => {
      expect(inst.xComparator()).toEqual(expect.any(Function));
    });

    it("should have an xComparator setter", () => {
      inst.xComparator(spy);
      expect(inst.xComparator()).toBe(spy);
    });

    it("should have an opacity accessor", () => {
      expect(inst.opacity()).toBe(1);
    });

    it("should have an opacity setter", () => {
      inst.opacity(0);
      expect(inst.opacity()).toBe(0);
    });

    it("should have a count getter", () => {
      expect(inst.getCount()).toEqual(1);
    });

    describe("with data", () => {
      let line;

      beforeEach(() => {
        setup([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }]);
        line = query(".clipPath1 path.line1");
      });

      it("should add a clip path", () => {
        expect(query("clipPath#clip1")).toBeDefined();
      });

      it("should set the clipping to rectangle the scale width", () => {
        expect(query("rect").getAttribute("width")).toEqual("100");
      });

      it("should set the clipping rectangle to the scale height", () => {
        expect(query("rect").getAttribute("height")).toEqual("100");
      });

      it("should set the corresponding clip path", () => {
        expect(query(".clipPath1").getAttribute("clip-path")).toEqual("url(https://foo/#clip1)");
      });
      it("should calculate the line from data", () => {
        expect(line.getAttribute("d")).toEqual("M0,100L50,50L100,0");
      });

      it("should set the color on the line", () => {
        expect(line.getAttribute("stroke")).toEqual("#000000");
      });

      it("should set stroke-dasharray to the total length of the line", () => {
        expect.assertions(2);
        line
          .getAttribute("stroke-dasharray")
          .split(" ")
          .map(fp.unary(parseInt))
          .forEach(x => expect(x).toBeGreaterThan(0));
      });

      it("should set stroke-dashoffset to the total length of the line", () => {
        expect(parseInt(line.getAttribute("stroke-dashoffset"))).toBeGreaterThan(0);
      });

      it("should animate stroke-dashoffset to 0", () => {
        flushD3Transitions(mockD3);
        expect(line.getAttribute("stroke-dashoffset")).toEqual("0");
      });

      it("should animate stroke-dasharray to 0", () => {
        flushD3Transitions(mockD3);
        expect(line.getAttribute("stroke-dasharray")).toBeNull();
      });

      describe("and updating", () => {
        beforeEach(() => {
          flushD3Transitions(mockD3);
          setup([{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }]);
        });

        describe("previous layout", () => {
          let coords;

          beforeEach(() => {
            coords = getCoords(line);
          });

          it("should move to 0,100", () => {
            expect(coords[0]).toEqual({ type: "M", x: 0, y: 100 });
          });

          it("should draw a line to 50,50", () => {
            expect(coords[1]).toEqual({ type: "L", x: 50, y: 50 });
          });

          it("should draw a line to 100,0", () => {
            expect(coords[2]).toEqual({ type: "L", x: 100, y: 0 });
          });
        });

        it("should update the line data keep the previous point and duplicate the last point", () => {
          expect(mockD3.select(line).datum()).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }]);
        });

        describe("ending layout", () => {
          let coords;
          beforeEach(() => {
            flushD3Transitions(mockD3);
            coords = getCoords(line);
          });

          it("should move to 33,67", () => {
            expect(coords[0]).toEqual({ type: "M", x: 33, y: 67 });
          });

          it("should draw a line to 67,33", () => {
            expect(coords[1]).toEqual({ type: "L", x: 67, y: 33 });
          });

          it("should draw a line to 100,0", () => {
            expect(coords[2]).toEqual({ type: "L", x: 100, y: 0 });
          });
        });

        it("should end with new data", () => {
          flushD3Transitions(mockD3);
          expect(mockD3.select(line).datum()).toEqual([{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }]);
        });
      });

      describe("and exiting", () => {
        beforeEach(() => {
          flushD3Transitions(mockD3);
          setup([]);
          flushD3Transitions(mockD3);
        });

        it("should remove the line", () => {
          expect(query(".clipPath1 path.line1")).toBeNull();
        });
      });
    });
  });
});
