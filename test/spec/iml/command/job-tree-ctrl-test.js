import angular from '../../../angular-mock-setup.js';
import highland from 'highland';

describe('job tree', () => {
  describe('job tree ctrl', () => {
    let $scope,
      jobTree,
      getJobStream,
      jobStream,
      mockSocketStream,
      GROUPS,
      openStepModal,
      job,
      ss,
      JobTreeCtrl;

    beforeEach(() => {
      jest.resetModules();
      ss = highland();
      mockSocketStream = jest.fn(() => ss);

      jest.mock(
        '../../../../source/iml/socket/socket-stream.js',
        () => mockSocketStream
      );

      const mod = require('../../../../source/iml/command/job-tree-ctrl.js');

      JobTreeCtrl = mod.JobTreeCtrl;
    });

    beforeEach(
      angular.mock.inject($rootScope => {
        jobStream = highland();
        jest.spyOn(jobStream, 'destroy');
        getJobStream = jest.fn(() => jobStream);

        GROUPS = {};

        openStepModal = jest.fn();

        $scope = $rootScope.$new();

        $scope.command = {
          jobs: []
        };

        jest.spyOn($scope, '$on');

        job = {
          id: '2',
          resource_uri: '/api/job/2/',
          available_transitions: [{}]
        };

        jobTree = {};

        JobTreeCtrl.bind(jobTree)($scope, getJobStream, GROUPS, openStepModal);
      })
    );

    it('should have a groups property', () => {
      expect(jobTree.GROUPS).toBe(GROUPS);
    });

    it('should have a jobs property', () => {
      expect(jobTree.jobs).toEqual([]);
    });

    it('should have a method to open the step modal', () => {
      jobTree.openStep(job);

      expect(openStepModal).toHaveBeenCalledOnceWith(job);
    });

    it("should tell if the job should show it's transition", () => {
      expect(jobTree.showTransition(job)).toBe(true);
    });

    it('should get the job', () => {
      expect(getJobStream).toHaveBeenCalledOnceWith([]);
    });

    it('should set the jobs', () => {
      const response = [job];

      jobStream.write(response);

      expect(jobTree.jobs).toEqual([job]);
    });

    it('should listen for destroy', () => {
      expect($scope.$on).toHaveBeenCalledOnceWith(
        '$destroy',
        expect.any(Function)
      );
    });

    it('should end the stream on destroy', () => {
      $scope.$on.mock.calls[0][1]();

      expect(jobStream.destroy).toHaveBeenCalledTimes(1);
    });

    describe('do transition', () => {
      beforeEach(() => {
        jobTree.doTransition(job, 'cancelled');
      });

      it('should put the transition', () => {
        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          job.resource_uri,
          {
            method: 'put',
            json: angular.extend({ state: 'cancelled' }, job)
          },
          true
        );
      });

      it('should hide transition while pending', () => {
        expect(jobTree.showTransition(job)).toBe(false);
      });

      it('should show transition when finished', () => {
        ss.write({});

        expect(jobTree.showTransition(job)).toBe(true);
      });
    });
  });

  describe('get job stream', () => {
    let mockSocketStream, jobTree, ss, stream;

    beforeEach(() => {
      jest.resetModules();
      ss = highland();
      mockSocketStream = jest.fn(() => ss);

      jest.mock(
        '../../../../source/iml/socket/socket-stream.js',
        () => mockSocketStream
      );

      const mod = require('../../../../source/iml/command/job-tree-ctrl.js');

      jobTree = jest.fn();
      const getJobStream = mod.getJobStreamFactory(jobTree);
      stream = getJobStream(['/api/job/1/', '/api/job/2/']);
    });

    it('should call socketStream', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith('/job', {
        qs: {
          id__in: ['1', '2'],
          limit: 0
        }
      });
    });

    it('should return a stream', () => {
      const proto = Object.getPrototypeOf(highland());

      expect(Object.getPrototypeOf(stream)).toBe(proto);
    });

    describe('convert to tree', () => {
      let response;

      beforeEach(() => {
        response = {
          objects: [{}]
        };
      });

      it('should convert to a tree', () => {
        ss.write(response);

        stream.each(() => {
          expect(jobTree).toHaveBeenCalledOnceWith([{}]);
        });
      });

      it('should return the converted tree', () => {
        jobTree.mockReturnValue([{ converted: true }]);

        ss.write(response);

        stream.each(x => {
          expect(x).toEqual([{ converted: true }]);
        });
      });
    });
  });
});
