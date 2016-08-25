import Maybe from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('breadcrumb', () => {
  let getResolvedData, mod, breadcrumbComponent, $scope,
    $compile, el, $transitions, $state, $stateParams, template,
    linkIcon, link, onSuccess, onStart, global;

  beforeEachAsync(async function () {
    getResolvedData = jasmine.createSpy('getResolvedData');
    onSuccess = jasmine.createSpy('onSuccess');
    onStart = jasmine.createSpy('onStart');
    global = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    mod = await mock('source/iml/breadcrumb/breadcrumb.js', {
      'source/iml/route-utils.js': {
        getResolvedData
      },
      'source/iml/global.js': {
        default: global
      }
    });

    breadcrumbComponent = mod.default;
  });

  afterEach(resetAll);

  beforeEach(module(($compileProvider, $provide) => {
    $transitions = {
      onSuccess: jasmine
        .createSpy('onSuccess')
        .and
        .returnValue(onSuccess),
      onStart: jasmine
        .createSpy('onStart')
        .and
        .returnValue(onStart)
    };

    $state = {
      router: {
        globals: {
          $current: {}
        }
      },
      transitions: {}
    };

    $stateParams = {
      resetState: false
    };

    $provide.value('$transitions', $transitions);
    $provide.value('$state', $state);
    $provide.value('$stateParams', $stateParams);
    $compileProvider.component('breadcrumb', breadcrumbComponent);
  }));

  beforeEach(inject(function (_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    template = '<breadcrumb></breadcrumb>';
  }));

  describe('starting at dashboard route', () => {
    beforeEach(() => {
      $state.router.globals.$current = {
        name: 'app.dashboard.overview',
        data: {
          kind: 'dashboard',
          icon: 'icon1'
        }
      };

      getResolvedData
        .and
        .returnValue(Maybe.of(undefined));

      el = $compile(template)($scope)[0];
      $scope.$digest();
      link = el.querySelector.bind(el, 'li:first-child > span');
      linkIcon = el.querySelector.bind(el, 'li:nth-of-type(1) i');
    });

    it('should display the kind and label', () => {
      expect(link().textContent.trim()).toEqual('dashboard');
    });

    it('should display the icon for the dashbaord', () => {
      expect(linkIcon()).toHaveClass('icon1');
    });

    it('should not render while loading', () => {
      $transitions.onStart.calls.argsFor(0)[1]();
      $scope.$digest();

      expect(el.querySelector('ol'))
        .toBeNull();
    });

    describe('navigating to dashboard filesystem', () => {
      let transitionSuccess, transition,
        curRoute, link2, linkIcon2;

      beforeEach(() => {
        curRoute = {
          name: 'app.dashboard.fs',
          data: {
            icon: 'icon2',
            kind: 'dashboard-fs'
          }
        };
        transition = {
          to: jasmine.createSpy('to').and.returnValue(curRoute)
        };

        getResolvedData.and.returnValue(Maybe.of({
          label: 'fs1',
          kind: 'dashboard-fs'
        }));

        $transitions.onStart.calls.argsFor(0)[1]();
        transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
        transitionSuccess(transition);

        $scope.$digest();
        link = el.querySelector.bind(el, 'li:nth-of-type(1) a');
        link2 = el.querySelector.bind(el, 'li:nth-of-type(2) > span');
        linkIcon2 = el.querySelector.bind(el, 'li:nth-of-type(2) i');
      });

      it('should set the ui-state attribute for dashboard', () => {
        expect(link().getAttribute('ui-state'))
          .toEqual('breadcrumb.name');
      });

      it('should set the ui-state-params attribute for dashboard', () => {
        expect(link().getAttribute('ui-state-params'))
          .toEqual('breadcrumb.params');
      });

      it('should display the kind and label for dashboard', () => {
        expect(link().textContent.trim()).toEqual('dashboard');
      });

      it('should display the icon for the dashbaord', () => {
        expect(linkIcon()).toHaveClass('icon1');
      });

      it('should display the filesystem', () => {
        expect(link2().textContent.trim()).toEqual('dashboard-fs : fs1');
      });

      it('should display the icon for the filesystem', () => {
        expect(linkIcon2()).toHaveClass('icon2');
      });

      describe('navigating to target', () => {
        let link3, linkIcon3;
        beforeEach(() => {
          curRoute = {
            name: 'app.dashboard.fs.mdt',
            data: {
              icon: 'icon3',
              kind: 'dashboard-mdt'
            }
          };

          transition = {
            to: jasmine.createSpy('to').and.returnValue(curRoute)
          };

          getResolvedData.and.returnValue(Maybe.of({
            label: 'fs1-MDT0000',
            kind: 'dashboard-mdt'
          }));

          $transitions.onStart.calls.argsFor(0)[1]();
          transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
          transitionSuccess(transition);

          $scope.$digest();
          link = el.querySelector.bind(el, 'li:nth-of-type(1) a');
          link2 = el.querySelector.bind(el, 'li:nth-of-type(2) a');
          link3 = el.querySelector.bind(el, 'li:nth-of-type(3) > span');
          linkIcon3 = el.querySelector.bind(el, 'li:nth-of-type(3) i');
        });

        it('should set the ui-state attribute for dashboard', () => {
          expect(link().getAttribute('ui-state'))
            .toEqual('breadcrumb.name');
        });

        it('should set the ui-state-params attribute for dashboard', () => {
          expect(link().getAttribute('ui-state-params'))
            .toEqual('breadcrumb.params');
        });

        it('should display the kind and label for dashboard', () => {
          expect(link().textContent.trim()).toEqual('dashboard');
        });

        it('should display the icon for the dashbaord', () => {
          expect(linkIcon()).toHaveClass('icon1');
        });

        it('should set the ui-state attribute for filesystem', () => {
          expect(link2().getAttribute('ui-state')).toEqual('breadcrumb.name');
        });

        it('should set the ui-state-params attribute for filesystem', () => {
          expect(link2().getAttribute('ui-state-params')).toEqual('breadcrumb.params');
        });

        it('should display the icon for the filesystem', () => {
          expect(linkIcon2()).toHaveClass('icon2');
        });

        it('should display the target kind and label', () => {
          expect(link3().textContent.trim()).toEqual('dashboard-mdt : fs1-MDT0000');
        });

        it('should display the icon for the target', () => {
          expect(linkIcon3()).toHaveClass('icon3');
        });

        describe('going back to filesystem', () => {
          beforeEach(() => {
            curRoute = {
              name: 'app.dashboard.fs',
              data: {
                icon: 'icon2',
                kind: 'dashboard-fs'
              }
            };

            transition = {
              to: jasmine.createSpy('to').and.returnValue(curRoute)
            };

            getResolvedData.and.returnValue(Maybe.of({
              label: 'fs1',
              kind: 'dashboard-fs'
            }));

            $transitions.onStart.calls.argsFor(0)[1]();
            transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
            transitionSuccess(transition);

            $scope.$digest();
            link = el.querySelector.bind(el, 'li:nth-of-type(1) a');
            link2 = el.querySelector.bind(el, 'li:nth-of-type(2) > span');
            link3 = el.querySelector.bind(el, 'li:nth-of-type(3)');
          });

          it('should set the ui-state attribute for dashboard', () => {
            expect(link().getAttribute('ui-state'))
              .toEqual('breadcrumb.name');
          });

          it('should set the ui-state-params attribute for dashboard', () => {
            expect(link().getAttribute('ui-state-params'))
              .toEqual('breadcrumb.params');
          });

          it('should display the kind and label for dashboard', () => {
            expect(link().textContent.trim()).toEqual('dashboard');
          });

          it('should display the icon for the dashbaord', () => {
            expect(linkIcon()).toHaveClass('icon1');
          });

          it('should display the filesystem', () => {
            expect(link2().textContent.trim()).toEqual('dashboard-fs : fs1');
          });

          it('should display the icon for the filesystem', () => {
            expect(linkIcon2()).toHaveClass('icon2');
          });

          it('should not display the target', () => {
            expect(link3()).toBe(null);
          });

          it('should not display the icon for the target', () => {
            expect(linkIcon3()).toBe(null);
          });

          describe('resetting the state', () => {
            beforeEach(() => {
              curRoute = {
                name: 'app.server'
              };

              transition = {
                to: jasmine.createSpy('to').and.returnValue(curRoute)
              };

              getResolvedData.and.returnValue(Maybe.of({
                kind: 'servers'
              }));

              $stateParams.resetState = true;

              $transitions.onStart.calls.argsFor(0)[1]();
              transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
              transitionSuccess(transition);

              $scope.$digest();
              link = el.querySelector.bind(el, 'li:nth-of-type(1) > span');
            });

            it('should display the server', () => {
              expect(link().textContent.trim()).toEqual('servers');
            });

            it('should display only one item', () => {
              expect(el.querySelectorAll('li').length).toEqual(1);
            });
          });
        });

        describe('going back to filesystem with back button', () => {
          beforeEach(() => {
            curRoute = {
              name: 'app.dashboard.fs',
              data: {
                icon: 'icon2',
                kind: 'dashboard-fs'
              }
            };

            transition = {
              to: jasmine.createSpy('to').and.returnValue(curRoute)
            };

            getResolvedData.and.returnValue(Maybe.of({
              label: 'fs1',
              kind: 'filesystem'
            }));

            $transitions.onStart.calls.argsFor(0)[1]();
          });

          describe('when popState fires before on success', () => {
            beforeEach(() => {
              global.addEventListener.calls.argsFor(0)[1]();
              transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
              transitionSuccess(transition);

              $scope.$digest();
              link = el.querySelector.bind(el, 'li:nth-of-type(1) a');
              link2 = el.querySelector.bind(el, 'li:nth-of-type(2) > span');
              link3 = el.querySelector.bind(el, 'li:nth-of-type(3)');
            });

            it('should display the kind and label for dashboard', () => {
              expect(link().textContent.trim()).toEqual('dashboard');
            });

            it('should display the icon for the dashbaord', () => {
              expect(linkIcon()).toHaveClass('icon1');
            });

            it('should display the filesystem', () => {
              expect(link2().textContent.trim()).toEqual('dashboard-fs : fs1');
            });

            it('should display the icon for the filesystem', () => {
              expect(linkIcon2()).toHaveClass('icon2');
            });

            it('should not display a third breadcrumb', () => {
              expect(link3()).toEqual(null);
            });
          });

          describe('when success fires before popState', () => {
            beforeEach(() => {
              transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
              transitionSuccess(transition);
              global.addEventListener.calls.argsFor(0)[1]();

              $scope.$digest();
              link = el.querySelector.bind(el, 'li:nth-of-type(1) a');
              link2 = el.querySelector.bind(el, 'li:nth-of-type(2) > span');
              link3 = el.querySelector.bind(el, 'li:nth-of-type(3)');
            });

            it('should display the kind and label for dashboard', () => {
              expect(link().textContent.trim()).toEqual('dashboard');
            });

            it('should display the icon for the dashbaord', () => {
              expect(linkIcon()).toHaveClass('icon1');
            });

            it('should display the filesystem', () => {
              expect(link2().textContent.trim()).toEqual('dashboard-fs : fs1');
            });

            it('should display the icon for the filesystem', () => {
              expect(linkIcon2()).toHaveClass('icon2');
            });

            it('should not display a third breadcrumb', () => {
              expect(link3()).toEqual(null);
            });
          });
        });
      });
    });

    describe('on destroy', () => {
      beforeEach(() => {
        $scope.$destroy();
      });

      it('should destroy the onStart callback', () => {
        expect(onStart)
          .toHaveBeenCalledOnce();
      });

      it('should destroy the onSuccess callback', () => {
        expect(onSuccess)
          .toHaveBeenCalledOnce();
      });
    });
  });

  describe('starting 3 levels deep and hitting the back button', () => {
    let transitionSuccess, backButtonRoute, transition, link, linkIcon,
      link2;

    beforeEach(() => {
      $state.router.globals.$current = {
        name: 'app.dashboard.fs.ost',
        data: {
          kind: 'dashboard-target',
          icon: 'icon3'
        }
      };

      backButtonRoute = {
        name: 'app.server',
        data: {
          icon: 'icon-server',
          kind: 'server'
        }
      };

      transition = {
        to: jasmine.createSpy('to').and.returnValue(backButtonRoute)
      };

      getResolvedData
        .and
        .returnValue(Maybe.of(undefined));

      el = $compile(template)($scope)[0];

      $transitions.onStart.calls.argsFor(0)[1]();
    });

    describe('when popState fires before onSuccess', () => {
      beforeEach(() => {
        global.addEventListener.calls.argsFor(0)[1]();
        transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
        transitionSuccess(transition);

        $scope.$digest();
        link = el.querySelector.bind(el, 'li:first-child > span');
        link2 = el.querySelector.bind(el, 'li:nth-of-type(2)');
        linkIcon = el.querySelector.bind(el, 'li:nth-of-type(1) i');
      });

      it('should display the server span', () => {
        expect(link().textContent.trim()).toEqual('server');
      });

      it('should display the server icon', () => {
        expect(linkIcon()).toHaveClass('icon-server');
      });

      it('should not display the dashboard-target', () => {
        expect(link2()).toEqual(null);
      });
    });

    describe('when onSuccess fires before popState', () => {
      beforeEach(() => {
        transitionSuccess = $transitions.onSuccess.calls.argsFor(0)[1];
        transitionSuccess(transition);
        global.addEventListener.calls.argsFor(0)[1]();

        $scope.$digest();
        link = el.querySelector.bind(el, 'li:first-child > span');
        link2 = el.querySelector.bind(el, 'li:nth-of-type(2)');
        linkIcon = el.querySelector.bind(el, 'li:nth-of-type(1) i');
      });

      it('should display the server span', () => {
        expect(link().textContent.trim()).toEqual('server');
      });

      it('should display the server icon', () => {
        expect(linkIcon()).toHaveClass('icon-server');
      });

      it('should not display the dashboard-target', () => {
        expect(link2()).toEqual(null);
      });
    });
  });
});