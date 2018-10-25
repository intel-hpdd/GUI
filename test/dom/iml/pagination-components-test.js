// @flow
import { render } from "inferno";
import { Pager, EntriesDropdown, TableInfo } from "../../../source/iml/pagination-components.js";
import { renderToSnapshot } from "../../test-utils.js";
import { querySelector } from "../../../source/iml/dom-utils.js";
import type { Meta } from "../../../source/iml/api-types.js";

describe("EntriesDropdown DOM testing", () => {
  let clickHandler, vnode;

  beforeEach(() => {
    clickHandler = jest.fn();
    vnode = <EntriesDropdown entries={10} setEntries={clickHandler} />;
  });

  it("should render entries as expected", () => {
    expect(renderToSnapshot(vnode)).toMatchSnapshot();
  });

  describe("clicking", () => {
    let root;

    beforeEach(() => {
      root = document.createElement("div");
      querySelector(document, "body").appendChild(root);
      render(vnode, root);
    });

    afterEach(() => {
      querySelector(document, "body").removeChild(root);
    });

    it("should open when clicked", () => {
      querySelector(root, "button").click();

      expect(root.innerHTML).toMatchSnapshot();
    });

    it("should call handler when entry is clicked", () => {
      querySelector(root, "button").click();
      root.querySelectorAll("a")[1].click();

      expect(clickHandler).toHaveBeenCalledOnceWith(25, expect.any(Object));
    });
  });
});

describe("TableInfo DOM testing", () => {
  let meta: Meta;

  beforeEach(() => {
    meta = {
      limit: 10,
      total_count: 100,
      offset: 10,
      previous: null,
      next: null
    };
  });

  it("should render as expected", () => {
    expect(renderToSnapshot(<TableInfo meta={meta} />)).toMatchSnapshot();
  });
});

describe("Pager DOM testing", () => {
  let meta: Meta, clickHandler;

  beforeEach(() => {
    meta = {
      limit: 10,
      total_count: 100,
      offset: 10,
      previous: null,
      next: null
    };

    clickHandler = jest.fn();
  });

  it("should render nothing if there is a single page", () => {
    meta = {
      limit: 10,
      total_count: 10,
      offset: 0,
      previous: null,
      next: null
    };
    expect(renderToSnapshot(<Pager meta={meta} setOffset={clickHandler} />)).toMatchSnapshot();
  });

  it("should render as expected", () => {
    const newMeta = {
      ...meta,
      limit: 25,
      total_count: 100,
      offset: 49
    };

    expect(renderToSnapshot(<Pager meta={newMeta} setOffset={clickHandler} />)).toMatchSnapshot();
  });

  it("should reset pages if on the trailing edge", () => {
    const newMeta = {
      ...meta,
      limit: 25,
      total_count: 200,
      offset: 199
    };

    expect(renderToSnapshot(<Pager meta={newMeta} setOffset={clickHandler} />)).toMatchSnapshot();
  });

  it("should disable the previous button if on the first page", () => {
    const newMeta = {
      ...meta,
      limit: 25,
      total_count: 100,
      offset: 0
    };

    expect(renderToSnapshot(<Pager meta={newMeta} setOffset={clickHandler} />)).toMatchSnapshot();
  });

  it("should disable the next button if on the last page", () => {
    const newMeta = {
      ...meta,
      limit: 25,
      total_count: 100,
      offset: 95
    };

    expect(renderToSnapshot(<Pager meta={newMeta} setOffset={clickHandler} />)).toMatchSnapshot();
  });

  describe("click handling", () => {
    let root;

    beforeEach(() => {
      root = document.createElement("div");
      querySelector(document, "body").appendChild(root);

      render(<Pager meta={meta} setOffset={clickHandler} />, root);
    });

    afterEach(() => {
      querySelector(document, "body").removeChild(root);
    });

    it("should go to the previous page when clicking previous", () => {
      querySelector(root, ".pagination-prev a").click();

      expect(clickHandler).toHaveBeenCalledOnceWith(0, expect.any(Object));
    });

    it("should go to the next page when clicking next", () => {
      querySelector(root, ".pagination-next a").click();

      expect(clickHandler).toHaveBeenCalledOnceWith(20, expect.any(Object));
    });

    it("should go to the clicked page", () => {
      querySelector(root, ".pagination-page a").click();

      expect(clickHandler).toHaveBeenCalledOnceWith(0, expect.any(Object));
    });
  });
});
