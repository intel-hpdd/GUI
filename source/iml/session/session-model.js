//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default (modelFactory, UserModel) => {
  'ngInject';
  const Session = modelFactory({ url: 'session' });

  Session.subTypes = {
    user: UserModel
  };

  Session.login = function(username, password) {
    const session = Session.save({ username: username, password: password });

    session.$promise = session.$promise.then(function(resp) {
      return resp.$get();
    });

    return session;
  };

  return Session;
};
