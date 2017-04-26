import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('command modal', () => {
  let CommandModalCtrl, $uibModal, stream;

  beforeEach(() => {
    $uibModal = {
      open: jest.fn()
    };

    stream = jest.fn();

    const mod = require('../../../../source/iml/command/command-modal-ctrl.js');

    mod.openCommandModalFactory($uibModal)(stream);
    CommandModalCtrl = mod.CommandModalCtrl;
  });

  describe('open command modal', () => {
    it('should open the modal', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        template: `<div class="modal-header">
  <h3 class="modal-title">Commands</h3>
</div>
<div class="modal-body command-modal-body">
  <uib-accordion close-others="false">
    <uib-accordion-group is-open="commandModal['accordion' + $index]" ng-repeat="command in commandModal.commands track by command.id">
      <uib-accordion-heading>
        <i class="fa" ng-class="{'fa-chevron-down': commandModal['accordion' + $index], 'fa-chevron-right': !commandModal['accordion' + $index]}"></i>
        <i class="fa header-status" ng-class="{'fa-times': command.state === 'cancelled', 'fa-exclamation': command.state === 'failed', 'fa-check': command.state === 'succeeded', 'fa-refresh fa-spin': command.state === 'pending'}"></i>
        <span>
          {{ ::command.message }} - {{ ::command.created_at | date:'MMM dd yyyy HH:mm:ss' }}
        </span>
      </uib-accordion-heading>
      <h4>Details:</h4>
      <table class="table">
        <tr>
          <td>Created At</td>
          <td>{{ ::command.created_at | date:'MMM dd yyyy HH:mm:ss' }}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td>{{command.state | capitalize}}</td>
        </tr>
      </table>

      <div ng-if="command.jobs.length > 0" ng-controller="JobTreeCtrl as jobTree">
        <h4>Jobs</h4>
        <div class="well jobs">
          <div ng-if="jobTree.jobs.length === 0">
            Loading Jobs... <i class="fa fa-spinner fa-spin"></i>
          </div>

          <div ng-repeat="job in jobTree.jobs track by job.id"
               ng-include="'job.html'"></div>
        </div>
      </div>

      <div ng-if="command.logs">
        <h4>Logs</h4>
        <pre class="logs">{{ command.logs }}</pre>
      </div>
    </uib-accordion-group>
  </uib-accordion>
</div>
<div class="modal-footer">
  <button class="btn btn-danger" ng-click="$close('close')">Close <i class="fa fa-times-circle-o"></i></button>
</div>`,
        controller: 'CommandModalCtrl',
        controllerAs: 'commandModal',
        windowClass: 'command-modal',
        backdrop: 'static',
        backdropClass: 'command-modal-backdrop',
        resolve: {
          commandsStream: expect.any(Function)
        }
      });
    });

    describe('commands', () => {
      let handle, commandStream;

      beforeEach(() => {
        handle = $uibModal.open.mock.calls[0][0].resolve.commandsStream;
        commandStream = handle();
      });

      it('should provide a command stream', () => {
        expect(commandStream).toEqual(stream);
      });
    });
  });

  describe('ctrl', () => {
    let commandsStream, commandModal;

    beforeEach(
      angular.mock.inject(($rootScope, propagateChange) => {
        commandsStream = highland();

        commandModal = new CommandModalCtrl(
          commandsStream,
          $rootScope.$new(),
          propagateChange
        );
      })
    );

    it('should open the first accordion', () => {
      expect(commandModal.accordion0).toBe(true);
    });

    const states = {
      cancelled: { cancelled: true },
      failed: { errored: true },
      succeeded: { complete: true },
      pending: {
        cancelled: false,
        failed: false,
        complete: false
      }
    };

    Object.keys(states).forEach(state => {
      it(`should be in state ${state}`, () => {
        commandsStream.write(wrap(states[state]));

        const expected = Object.assign(
          {
            state: state,
            jobs: []
          },
          states[state]
        );

        expect(commandModal.commands).toEqual(wrap(expected));
      });
    });

    it('should trim logs', () => {
      commandsStream.write(
        wrap({
          logs: '    '
        })
      );

      expect(commandModal.commands).toEqual([
        {
          id: 1,
          logs: '',
          jobs: [],
          state: 'pending'
        }
      ]);
    });

    function wrap() {
      const commands = [].slice.call(arguments, 0);

      return commands.map((command, index) => {
        return Object.assign(
          {
            id: index + 1,
            logs: '',
            jobs: []
          },
          command
        );
      });
    }
  });
});
