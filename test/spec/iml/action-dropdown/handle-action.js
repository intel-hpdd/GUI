describe('handle action', function () {
  'use strict';

  var socketStream, actionStream, openConfirmActionModal;

  beforeEach(module('action-dropdown-module', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function () {
        return (actionStream = highland());
      });
    $provide.value('socketStream', socketStream);

    openConfirmActionModal = jasmine.createSpy('openConfirmActionModal')
      .andReturn({ resultStream: highland() });
    $provide.value('openConfirmActionModal', openConfirmActionModal);
  }));

  var $rootScope, handleAction;

  beforeEach(inject(function (_$rootScope_, _handleAction_) {
    $rootScope = _$rootScope_;
    handleAction = _handleAction_;
  }));

  describe('job', function () {
    var record, action;

    beforeEach(function () {
      record = { label: 'foo bar' };

      action = {
        verb: 'foo',
        class_name: 'bar',
        args: { some: 'stuff' },
        confirmation: 'Are you sure you want to foo bar?'
      };
    });

    it('should open the confirm modal if there is confirmation', function () {
      handleAction(record, action);

      expect(openConfirmActionModal)
        .toHaveBeenCalledOnceWith('foo(foo bar)', [ 'Are you sure you want to foo bar?' ]);
    });

    it('should not open the confirm modal without confirmation', function () {
      delete action.confirmation;

      handleAction(record, action);

      expect(openConfirmActionModal).not.toHaveBeenCalled();
    });

    it('should send the job after confirmation', function () {
      handleAction(record, action).each(function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/command', {
          method: 'post',
          json: {
            jobs: [{
              class_name: 'bar',
              args: { some: 'stuff' }
            }],
            message: 'foo(foo bar)'
          }
        }, true);
      });

      openConfirmActionModal.plan().resultStream.write(true);

      $rootScope.$digest();

      actionStream.write({});
    });

    it('should skip the action result', function () {
      handleAction(record, action).each(function (x) {
        expect(x).toBeUndefined();
      }, true);

      openConfirmActionModal.plan().resultStream.write(true);
      $rootScope.$digest();
      actionStream.write({ foo: 'bar' });
    });

    it('should not skip the action result', function () {
      handleAction(record, action).each(function (x) {
        expect(x).toEqual({ foo: 'bar' });
      }, true);

      openConfirmActionModal.plan().resultStream.write(false);
      $rootScope.$digest();
      actionStream.write({ foo: 'bar' });
    });
  });

  it('should put the new param for conf param', function () {
    var action = {
      param_key: 'some',
      param_value: 'value',
      mdt: {
        resource: 'target',
        id: '1',
        conf_params: []
      }
    };

    handleAction({}, action);

    expect(socketStream).toHaveBeenCalledOnceWith('/target/1', {
      method: 'put',
      json: {
        resource: 'target',
        id: '1',
        conf_params: []
      }
    }, true);
  });

  describe('state change', function () {
    var record, action, stream;

    beforeEach(function () {
      record = { resource_uri: '/api/target/2' };

      action = { state: 'stopped' };

      stream = handleAction(record, action);
    });

    it('should perform a dry run', function () {
      expect(socketStream).toHaveBeenCalledOnceWith(record.resource_uri, {
        method: 'put',
        json: {
          dry_run: true,
          state: 'stopped'
        }
      }, true);
    });

    describe('dry run', function () {
      var response;

      beforeEach(function () {
        response = {
          transition_job: {
            description: 'It\'s gonna do stuff!'
          },
          dependency_jobs: [
            {
              requires_confirmation: true,
              description: 'This will do stuff'
            }
          ]
        };

        actionStream.write(response);
      });

      it('should open the confirm action modal', function () {
        stream.each(function () {
          expect(openConfirmActionModal)
            .toHaveBeenCalledOnceWith('It\'s gonna do stuff!', ['This will do stuff']);
        });

        openConfirmActionModal.plan().resultStream.write(true);

        $rootScope.$digest();

        actionStream.write({});
      });

      it('should send the new state after confirm', function () {
        stream.each(function () {
          expect(expect(socketStream).toHaveBeenCalledOnceWith('/api/target/2', {
            method: 'put',
            json: { state: 'stopped' }
          }, true));
        });

        openConfirmActionModal.plan().resultStream.write(true);

        $rootScope.$digest();

        actionStream.write({});
      });
    });
  });
});
