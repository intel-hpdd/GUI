// @flow

import StorageResourceHistogram from "../../../../source/iml/storage/storage-resource-histogram.js";
import { renderToSnapshot } from "../../../test-utils.js";

it("should render as expected", () => {
  const data = {
    type: "histogram",
    title: "my first histogram",
    series: [
      {
        label: "reads",
        name: "reads",
        type: "histogram",
        data: {
          bin_labels: [">1", ">2", ">3"],
          values: [2, 3, 4]
        },
        unit_name: "reads"
      }
    ]
  };

  expect(renderToSnapshot(<StorageResourceHistogram chart={data} />)).toMatchSnapshot();
});

it("should render as expected with two series", () => {
  const data = {
    type: "histogram",
    title: "my second histogram",
    series: [
      {
        label: "reads",
        name: "reads",
        type: "histogram",
        data: {
          bin_labels: [">1", ">2", ">3"],
          values: [2, 3, 4]
        },
        unit_name: "reads"
      },
      {
        label: "writes",
        name: "writes",
        type: "histogram",
        data: {
          bin_labels: [">1", ">2", ">3"],
          values: [2.5, 3.5, 4.5]
        },
        unit_name: "writes"
      }
    ]
  };

  expect(renderToSnapshot(<StorageResourceHistogram chart={data} />)).toMatchSnapshot();
});
