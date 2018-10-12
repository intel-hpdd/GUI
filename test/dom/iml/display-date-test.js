// @flow

import { querySelector } from "../../../source/iml/dom-utils.js";
import angular from "../../angular-mock-setup.js";
import highland from "highland";

import type { HighlandStreamT } from "highland";

type UtcStream = HighlandStreamT<{ isUtc: boolean }>;
interface MockMoment {
  utc: Function;
}

describe("Display Date Component", () => {
  let root: HTMLElement,
    displayDate,
    dateElement: HTMLElement,
    $scope: $scope,
    $compile,
    template: string,
    tzPicker$: UtcStream,
    tzPickerB: () => UtcStream,
    mockMoment: MockMoment,
    mockMomentFormat,
    mockMomentUtc,
    mockMomentUtcFormat;

  beforeEach(() => {
    tzPicker$ = highland();
    tzPickerB = jest.fn(() => tzPicker$);

    mockMomentUtcFormat = jest.fn(() => "2018-07-01 12:30:00");
    mockMomentUtc = jest.fn(() => ({
      format: mockMomentUtcFormat
    }));

    mockMomentFormat = jest.fn(() => "2018-07-01 08:30:00");
    mockMoment = (jest.fn(() => ({
      format: mockMomentFormat
    })): any);
    mockMoment.utc = mockMomentUtc;

    jest.mock("moment", () => mockMoment);
    displayDate = require("../../../source/iml/display-date.js").displayDateComponent;
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component("displayDate", displayDate);
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $scope.tzPickerB = tzPickerB;
      $scope.datetime = "2018-07-01T12:30:00.0000+00:00";
      $compile = _$compile_;
      template = '<display-date tz-picker-b="tzPickerB" datetime="datetime"></tz-picker>';
    })
  );

  beforeEach(() => {
    tzPicker$.write({ isUtc: false });

    root = $compile(template)($scope)[0];
    querySelector(document, "body").appendChild(root);
    dateElement = querySelector(root, ".date");
  });

  afterEach(() => {
    querySelector(document, "body").removeChild(root);
  });

  describe("local time", () => {
    it("should create markup", () => {
      expect(dateElement).toMatchSnapshot();
    });

    it("should pass the ISO date to moment", () => {
      expect(mockMoment).toHaveBeenCalledOnceWith("2018-07-01T12:30:00.0000+00:00");
    });

    it("should format the date", () => {
      expect(mockMomentFormat).toHaveBeenCalledOnceWith("YYYY-MM-DD HH:mm:ss");
    });
  });

  describe("utc", () => {
    beforeEach(() => {
      tzPicker$.write({ isUtc: true });
    });

    it("should create the markup", () => {
      expect(dateElement).toMatchSnapshot();
    });

    it("should pass the ISO date to moment", () => {
      expect(mockMomentUtc).toHaveBeenCalledOnceWith("2018-07-01T12:30:00.0000+00:00");
    });

    it("should format the date", () => {
      expect(mockMomentUtcFormat).toHaveBeenCalledOnceWith("YYYY-MM-DD HH:mm:ss");
    });
  });

  describe("removing", () => {
    it("should no longer render the element", () => {
      $scope.$destroy();
      const removedDateDisplay = root.querySelector(".date");
      expect(removedDateDisplay).toBeNull();
    });
  });
});
