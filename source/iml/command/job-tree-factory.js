//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@mfl/lodash-mixins';

export default function jobTreeFactory() {
  'ngInject';
  /**
   * Given an array of jobs turns them into
   * a tree structure.
   * @param {Array} jobs
   * @returns {Object}
   */
  return function jobTree(jobs) {
    const shallowestOccurrence = {};

    const children = _(jobs).pluck('wait_for').flatten().unique().value();
    const roots = _(jobs).pluck('resource_uri').difference(children).value();

    const tree = roots.map(function buildTree(uri) {
      const root = getAJob(uri);
      return jobChildren(root, 0);
    });

    tree.forEach(function pruneTree(job) {
      prune(job, 0);
    });

    return tree;

    /**
     * Returns a job for a given resource_uri
     * or undefined if there is no match.
     * @param {String} uri
     * @returns {Object|undefined}
     */
    function getAJob(uri) {
      return _.find(jobs, { resource_uri: uri });
    }

    /**
     * Populates a job with it's children.
     * Marks the shallowest occurrence of a job for pruning purposes.
     * @param {Object} job
     * @param {Number} depth
     * @returns {Object}
     */
    function jobChildren(job, depth) {
      const shallowest = shallowestOccurrence[job.resource_uri];
      if (shallowest == null || shallowest > depth)
        shallowestOccurrence[job.resource_uri] = depth;

      const children = job.wait_for.reduce(function expandChildren(arr, uri) {
        const child = getAJob(uri);

        if (child) arr.push(jobChildren(child, depth + 1));

        return arr;
      }, []);

      return _.extend({ children: children }, job);
    }

    /**
     * Traverses the tree removing jobs deeper than
     * their shallowest depth.
     * @param {Object} job
     * @param {Number} depth
     */
    function prune(job, depth) {
      const childDepth = depth + 1;

      job.children = job.children
        .filter(function pruneByDepth(child) {
          return shallowestOccurrence[child.resource_uri] >= childDepth;
        })
        .map(function pruneChild(child) {
          prune(child, childDepth);

          return child;
        });
    }
  };
}
