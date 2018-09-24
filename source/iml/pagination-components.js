// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Meta } from "./api-types.js";
import Inferno, { linkEvent } from "inferno";
import WindowClickListener from "./window-click-listener.js";
import DropdownContainer from "./dropdown-component.js";

type EntriesProps = {
  entries: number,
  setEntries: Function
};

export const EntriesDropdown = (props: EntriesProps) => (
  <WindowClickListener>
    <DropdownContainer>
      <button type="button" class="btn btn-info btn-sm dropdown-toggle" aria-haspopup="true" aria-expanded="false">
        Entries: {props.entries} <span class="caret" />
      </button>
      <ul role="menu" class="dropdown-menu">
        {[10, 25, 50, 100].map(x => (
          <li>
            <a onClick={linkEvent(x, props.setEntries)}>{x}</a>
          </li>
        ))}
      </ul>
    </DropdownContainer>
  </WindowClickListener>
);

type PerPageProps = {
  meta: Meta
};

export const TableInfo = ({ meta }: PerPageProps) => (
  <span>
    showing {meta.offset + 1}-{Math.min(meta.offset + meta.limit, meta.total_count)} of {meta.total_count}
  </span>
);

const computePage = ({ limit, offset }) => (limit === 0 ? 1 : Math.floor(offset / limit + 1));

const computePages = ({ limit, total_count: totalCount }) => (limit === 0 ? 1 : Math.ceil(totalCount / limit));

const MAX_SIZE = 5;

function getPages(page: number, pages: number): number[] {
  let startPage = 1;
  let endPage = pages;

  if (pages > MAX_SIZE) {
    startPage = Math.max(page - Math.floor(MAX_SIZE / 2), 1);
    endPage = startPage + MAX_SIZE - 1;

    if (endPage > pages) {
      endPage = pages;
      startPage = endPage - MAX_SIZE + 1;
    }
  }

  const xs = [];
  for (let i = startPage; i <= endPage; i++) xs.push(i);
  return xs;
}

const computeOffset = (page, limit) => (page - 1) * limit;

type PagerProps = {
  meta: Meta,
  setOffset: Function
};

export const Pager = ({ meta, setOffset }: PagerProps) => {
  const pages = computePages(meta);

  if (pages === 1) return;

  const page = computePage(meta);

  return (
    <ul class="pagination">
      <li className={`pagination-prev ${page === 1 ? "disabled" : ""}`}>
        <a onClick={linkEvent(computeOffset(page - 1, meta.limit), setOffset)}>‹</a>
      </li>
      {getPages(page, pages).map(x => (
        <li className={`pagination-page ${page === x ? "active" : ""}`}>
          <a onClick={linkEvent(computeOffset(x, meta.limit), setOffset)}>{x}</a>
        </li>
      ))}
      <li class={`pagination-next ${page === pages ? "disabled" : ""}`}>
        <a onClick={linkEvent(computeOffset(page + 1, meta.limit), setOffset)}>›</a>
      </li>
    </ul>
  );
};
