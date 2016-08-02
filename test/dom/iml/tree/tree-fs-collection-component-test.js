//@flow

import highland from 'highland';

import store from '../../../../source/iml/store/get-store.js';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

import type {
  $scopeT,
  $compileT
} from 'angular';

describe('tree fs collection component', () => {
  let mod,
    socketStream,
    socket$;

  beforeEachAsync(async function () {
    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .callFake(() => socket$ = highland());

    jasmine.clock().install();

    mod = await mock('source/iml/tree/tree-fs-collection-component.js', {
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      }
    });
  });

  beforeEach(module('extendScope', $compileProvider => {
    $compileProvider.component('treeFsCollection', mod.default);
  }));

  let el;

  beforeEach(inject(($compile:$compileT, $rootScope:$scopeT) => {
    const $scope = $rootScope.$new();
    const template = '<tree-fs-collection parent-id="0"></tree-fs-collection>';

    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  afterEach(resetAll);

  afterEach(() => jasmine.clock().uninstall());

  afterEach(() => store.dispatch({
    type: 'RESET_STATE'
  }));

  afterEach(() => jasmine.clock().tick(1));

  it('should render the collection', () => {
    expect(el)
      .not
      .toBe(null);
  });

  it('should link to the fs page', () => {
    const route = el
      .querySelector('a')
      .getAttribute('ui-sref');

    expect(route)
      .toBe('app.fileSystem({ resetState: true })');
  });

  it('should show the spinner while data is fetching', () => {
    expect(el.querySelector('i.fa-spin'))
      .not
      .toBeNull();
  });

  describe('on data', () => {
    beforeEach(() => {
      store.dispatch({
        type: 'ADD_TREE_ITEMS',
        payload: [{
          parentTreeId: 0,
          treeId: 1,
          type: 'fs',
          meta: {
            offset: 10
          }
        }]
      });

      socket$.write({
        objects: [
          {
            id: 1,
            label: 'fs1'
          }
        ],
        meta: {
          offset: 10
        }
      });
      jasmine.clock().tick(1);
    });

    it('should hide the spinner when data comes in', () => {
      expect(el.querySelector('i.fa-spin'))
        .toBeNull();
    });

    it('should not show the children', () => {
      expect(el.querySelector('.children'))
        .toBeNull();
    });

    describe('on click', () => {
      beforeEach(() => {
        const chevron = el.querySelector('i.fa-chevron-right');
        chevron.click();
      });

      it('should show the children', () => {
        expect(el.querySelector('.children'))
          .not
          .toBeNull();
      });

      it('should display the children', () => {
        expect(el.querySelector('tree-fs-item'))
          .not
          .toBeNull();
      });

      it('should update the children list when one is removed', () => {
        socket$.write({
          objects: [],
          meta: {
            offset: 10
          }
        });
        jasmine.clock().tick(1);

        expect(el.querySelector('tree-fs-item'))
          .toBeNull();
      });

      it('should update the children list when one is added', () => {
        socket$.write({
          objects: [
            {
              id: 1,
              label: 'fs1'
            },
            {
              id: 2,
              label: 'fs2'
            }
          ],
          meta: {
            offset: 10
          }
        });
        jasmine.clock().tick(1);

        expect(el.querySelectorAll('tree-fs-item').length)
          .toBe(2);
      });
    });
  });
});
