import angular from 'angular';
const {module, inject} = angular.mock;

describe('override action click', function () {
  'use strict';

  var record, openAddServerModal, overrideActionClick;

  beforeEach(module('server', function ($provide) {
    $provide.constant('ADD_SERVER_STEPS', {
      ADD: 'add',
      STATUS: 'status',
      SELECT_PROFILE: 'select profile'
    });

    openAddServerModal = jasmine.createSpy('openAddServerModal')
      .and.returnValue({
        resultStream: highland()
      });
    $provide.value('openAddServerModal', openAddServerModal);
  }));

  beforeEach(inject(function (_overrideActionClick_) {
    overrideActionClick = _overrideActionClick_;

    record = {
      state: 'undeployed',
      install_method: 'root_password'
    };
  }));

  it('should be a function', function () {
    expect(overrideActionClick).toEqual(jasmine.any(Function));
  });

  it('should fallback without an action state', function () {
    overrideActionClick(record, {}).each(function (resp) {
      expect(resp).toEqual('fallback');
    });
  });

  [
    // add step
    {
      record: {
        state: 'undeployed',
        install_method: 'root_password'
      },
      action: {
        state: 'deployed'
      },
      step: 'add'
    },
    // server status step
    {
      record: {
        state: 'undeployed',
        install_method: 'existing_keys_choice'
      },
      action: {
        state: 'deployed'
      },
      step: 'status'
    },
    // select profile
    {
      record: {
        state: 'pending',
        install_method: 'existing_keys_choice',
        server_profile: {
          initial_state: 'unconfigured'
        }
      },
      action: {
        state: 'deployed'
      },
      step: 'select profile'
    }
  ].forEach(function testStep (data) {
    it('should open the add server modal when needed for step ' + data.step, function () {
      overrideActionClick(data.record, data.action);
      expect(openAddServerModal).toHaveBeenCalledOnceWith(data.record, data.step);
    });
  });
});
