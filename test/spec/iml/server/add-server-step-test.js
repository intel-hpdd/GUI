import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('Add server step', () => {
  let AddServerStepCtrl,
    addServersStep;

  beforeEachAsync(async function () {
    const mod = await mock('source/iml/server/add-server-step.js', {
      'source/iml/server/assets/html/add-server-step.html!text': {
        default: 'addServerTemplate'
      }
    });

    AddServerStepCtrl = mod.AddServerStepCtrl;
    addServersStep = mod.addServersStepFactory();
  });

  afterEach(resetAll);

  let $stepInstance,
    addServerStepCtrl;

  [
    {},
    {
      servers: {
        auth_type: 'existing_keys_choice',
        addresses: ['foo2.localdomain']
      }
    },
    {
      servers: {
        auth_type: 'existing_keys_choice',
        addresses: ['foo1.localdomain']
      }
    }
  ].forEach(data => {
    describe('controller', () => {
      let $scope;

      beforeEach(inject($rootScope => {
        $scope = $rootScope.$new();

        $stepInstance = {
          getState: jasmine.createSpy('getState'),
          transition: jasmine.createSpy('transition')
        };

        addServerStepCtrl = new AddServerStepCtrl(
          $scope,
          $stepInstance,
          {
            ...data
          }
        );
      }));

      it('should setup the controller', () => {
        const expected = window.extendWithConstructor(AddServerStepCtrl, {
          fields: {
            auth_type: getDataInstallMethod(data),
            pdsh: getPdshExpression(data)
          },
          CHOICES: Object.freeze({
            EXISTING_KEYS: 'existing_keys_choice',
            ROOT_PASSWORD: 'id_password_root',
            ANOTHER_KEY: 'private_key_choice'
          }),
          pdshUpdate: jasmine.any(Function),
          transition: jasmine.any(Function),
          close: jasmine.any(Function)
        });

        expect(addServerStepCtrl).toEqual(expected);
      });

      it('should update the fields on pdsh change', () => {
        addServerStepCtrl.pdshUpdate('foo[01-02].com', ['foo01.com', 'foo02.com'],
          {'foo01.com': 1, 'foo02.com': 1});

        expect(addServerStepCtrl.fields).toEqual({
          auth_type: 'existing_keys_choice',
          pdsh: 'foo[01-02].com',
          addresses: [ 'foo01.com', 'foo02.com' ]
        });
      });

      describe('calling transition', () => {
        beforeEach(() => {
          addServerStepCtrl.transition();
        });

        it('should set add server to disabled', () => {
          expect(addServerStepCtrl.disabled).toEqual(true);
        });

        it('should call transition on the step instance', () => {
          const expected = {
            data: {
              servers: {
                auth_type: getDataInstallMethod(data)
              },
              pdsh: getPdshExpression(data)
            }
          };

          expect($stepInstance.transition)
            .toHaveBeenCalledOnceWith('next', expected);
        });
      });
    });

    function getDataInstallMethod (data) {
      return (data.servers) ? data.servers.auth_type : 'existing_keys_choice';
    }

    function getPdshExpression (data) {
      return data.pdsh;
    }
  });

  describe('add servers step', () => {
    it('should create the step with the expected interface', () => {
      expect(addServersStep).toEqual({
        template: 'addServerTemplate',
        controller: 'AddServerStepCtrl as addServer',
        transition: jasmine.any(Function)
      });
    });

    describe('transition', () => {
      let steps, result;

      beforeEach(() => {
        steps = {
          serverStatusStep: jasmine.createSpy('serverStatusStep')
        };

        result = addServersStep.transition(steps);
      });

      it('should return the next step and data', () => {
        expect(result).toEqual(steps.serverStatusStep);
      });
    });
  });
});
