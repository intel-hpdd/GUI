import angular from 'angular';
const {module, inject} = angular.mock;

describe('job tree', function () {
  beforeEach(module('command'));

  describe('job tree ctrl', function () {

    var $scope, jobTree, getJobStream, jobStream, socketStream,
      GROUPS, openStepModal, job;

    beforeEach(inject(function ($rootScope, $controller) {
      jobStream = highland();
      spyOn(jobStream, 'destroy');
      getJobStream = jasmine.createSpy('getJobStream')
        .andReturn(jobStream);
      socketStream = jasmine.createSpy('socketStream')
        .andReturn(highland());

      GROUPS = {};

      openStepModal = jasmine.createSpy('openStepModal');

      $scope = $rootScope.$new();

      $scope.command = {
        jobs: []
      };

      spyOn($scope, '$on').andCallThrough();

      job = {
        id: '2',
        resource_uri: '/api/job/2/',
        available_transitions: [{}]
      };

      jobTree = $controller('JobTreeCtrl', {
        $scope: $scope,
        getJobStream: getJobStream,
        GROUPS: GROUPS,
        openStepModal: openStepModal,
        socketStream: socketStream
      });
    }));

    it('should have a groups property', function () {
      expect(jobTree.GROUPS).toBe(GROUPS);
    });

    it('should have a jobs property', function () {
      expect(jobTree.jobs).toEqual([]);
    });

    it('should have a method to open the step modal', function () {
      jobTree.openStep(job);

      expect(openStepModal).toHaveBeenCalledOnceWith(job);
    });

    it('should tell if the job should show it\'s transition', function () {
      expect(jobTree.showTransition(job)).toBe(true);
    });

    it('should get the job', function () {
      expect(getJobStream).toHaveBeenCalledOnceWith([]);
    });

    it('should set the jobs', function () {
      var response = [job];

      getJobStream.plan().write(response);

      expect(jobTree.jobs).toEqual([job]);
    });

    it('should listen for destroy', function () {
      expect($scope.$on).toHaveBeenCalledOnceWith('$destroy', jasmine.any(Function));
    });

    it('should end the stream on destroy', function () {
      $scope.$on.mostRecentCall.args[1]();

      expect(jobStream.destroy).toHaveBeenCalledOnce();
    });

    describe('do transition', function () {
      beforeEach(function () {
        jobTree.doTransition(job, 'cancelled');
      });

      it('should put the transition', function () {
        expect(socketStream).toHaveBeenCalledOnceWith(job.resource_uri, {
          method: 'put',
          json: angular.extend({ state: 'cancelled' }, job)
        }, true);
      });

      it('should hide transition while pending', function () {
        expect(jobTree.showTransition(job)).toBe(false);
      });

      it('should show transition when finished', function () {
        socketStream.plan().write({});

        expect(jobTree.showTransition(job)).toBe(true);
      });
    });
  });

  describe('get job stream', function () {
    var socketStream, jobTree;

    beforeEach(module(function ($provide) {
      socketStream = jasmine.createSpy('socketStream')
        .andReturn(highland());

      jobTree = jasmine.createSpy('jobTree');

      $provide.value('socketStream', socketStream);
      $provide.value('jobTree', jobTree);
    }));

    var stream;

    beforeEach(inject(function (getJobStream) {
      stream = getJobStream(['/api/job/1/', '/api/job/2/']);
    }));

    it('should call socketStream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/job', {
        qs: {
          id__in: ['1', '2'],
          limit: 0
        }
      });
    });

    it('should return a stream', function () {
      var proto = Object.getPrototypeOf(highland());

      expect(Object.getPrototypeOf(stream)).toBe(proto);
    });

    describe('convert to tree', function () {
      var response;

      beforeEach(function () {
        response = {
          objects: [{}]
        };
      });

      it('should convert to a tree', function () {
        socketStream.plan().write(response);

        stream.each(function () {
          expect(jobTree).toHaveBeenCalledOnceWith([{}]);
        });
      });

      it('should return the converted tree', function () {
        jobTree.andReturn([{ converted: true }]);

        socketStream.plan().write(response);

        stream.each(function (x) {
          expect(x).toEqual([{ converted: true }]);
        });
      });
    });
  });
});
