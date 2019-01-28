// @flow

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type CompositeIdT = {
  contentTypeId: string,
  id: string
};

export const compositeIdsToQueryString = (compositeIds: CompositeIdT[]) =>
  compositeIds.map(({ contentTypeId, id }: CompositeIdT) => `composite_ids=${contentTypeId}:${id}`).join("&");
