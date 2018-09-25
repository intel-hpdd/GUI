//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function SelectedServersService() {
  "ngInject";
  const selectedServers = this;

  this.servers = {};

  /**
   * Toggles the server according to the specified type.
   * @param {String} name
   */
  this.toggleType = function toggleType(name) {
    let checked;

    if (name === "all")
      checked = function handleCheckedAll(key) {
        selectedServers.servers[key] = true;
      };
    else if (name === "none")
      checked = function handleCheckedNone(key) {
        selectedServers.servers[key] = false;
      };
    else if (name === "invert")
      checked = function handleCheckedInvert(key) {
        selectedServers.servers[key] = !selectedServers.servers[key];
      };

    Object.keys(selectedServers.servers).forEach(checked);
  };

  /**
   * Given an array of servers, adds them to the selectedServers array
   * if they don't already exist.
   * @param {Array} servers
   */
  this.addNewServers = function addNewServers(servers) {
    servers.forEach(function addThem(server) {
      if (selectedServers.servers[server.fqdn] == null) selectedServers.servers[server.fqdn] = false;
    });
  };
}
