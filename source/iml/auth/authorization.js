//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from "inferno";
import store from "../store/get-store.js";
import global from "../global.js";

let user;

store.select("session").each(({ session }) => (user = session.user));

export function groupAllowed(groupName) {
  const hasGroups = user && Array.isArray(user.groups);

  return (
    hasGroups &&
    user.groups.some(group => {
      //Superusers can do everything.
      if (group.name === GROUPS.SUPERUSERS) return true;

      //Filesystem administrators can do everything a filesystem user can do.
      if (group.name === GROUPS.FS_ADMINS && groupName === GROUPS.FS_USERS) return true;

      // Fallback to matching on names.
      return group.name === groupName;
    })
  );
}

export const GROUPS = Object.freeze({
  SUPERUSERS: "superusers",
  FS_ADMINS: "filesystem_administrators",
  FS_USERS: "filesystem_users"
});

export function restrictTo() {
  return {
    link($scope, el, attrs) {
      if (!groupAllowed(attrs.restrictTo)) el.addClass("invisible");
    }
  };
}

export const RestrictToComponent = ({ group, children }: { group: string, children: React$Element<*> }) => {
  if (groupAllowed(group)) return <>{children}</>;
};

export function restrict() {
  return {
    link($scope, el, attrs) {
      if (groupAllowed(attrs.restrict)) el.addClass("invisible");
    }
  };
}

const csrfRegex = /csrftoken=([^;|$]+)/;
export const getCSRFToken = () => {
  const csrfTokenMatch = global.document.cookie.match(csrfRegex);
  const csrfToken = {};

  if (csrfTokenMatch && csrfTokenMatch[1]) csrfToken["X-CSRFToken"] = csrfTokenMatch[1];
  return csrfToken;
};
