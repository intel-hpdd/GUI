import highland from 'highland';

describe('job indicator', () => {
  beforeEach(module('jobIndicator'));

  describe('monitor', function () {
    var jobMonitor, socketStream, stream;

    beforeEach(module(function ($provide) {
      stream = highland();

      socketStream = jasmine.createSpy('socketStream')
        .and.returnValue(stream);

      $provide.value('socketStream', socketStream);
    }));

    beforeEach(inject(function (_jobMonitor_) {
      jobMonitor = _jobMonitor_;
    }));

    it('should return a stream', function () {
      expect(highland.isStream(jobMonitor())).toBe(true);
    });

    it('should request pending and tasked jobs', function () {
      jobMonitor();
      expect(socketStream).toHaveBeenCalledOnceWith('/job/', {
        jsonMask: 'objects(write_locks,read_locks,description)',
        qs: {
          limit: 0,
          state__in: ['pending', 'tasked']
        }
      });
    });

    it('should pluck objects out of the stream', function () {
      jobMonitor()
        .each(function (x) {
          expect(x).toEqual([{ foo: 'bar' }]);
        });

      stream.write({
        objects: [{ foo: 'bar' }]
      });
    });
  });

  describe('directive', function () {
    var $scope, $timeout, element, node, getPopover, i, stream;

    beforeEach(inject(function ($rootScope, $compile, _$timeout_, addProperty) {
      $timeout = _$timeout_;

      element = '<div><job-status record-id="recordId" job-stream="stream"></job-status></div>';

      $scope = $rootScope.$new();

      stream = highland();

      $scope.stream = stream.through(addProperty);
      $scope.recordId = 'host/6';

      node = $compile(element)($scope);

      $scope.$digest();

      $scope = node.find('.job-status').scope();

      getPopover = function getPopover () {
        return node.find('i ~ .popover');
      };
    }));

    describe('toggling', function () {
      beforeEach(function () {
        var response = [
          {
            read_locks: [],
            write_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            description: 'write lock description'
          }
        ];

        stream.write(response);
        $scope.$digest();

        i = node.find('i');
        i.trigger('click');
        $timeout.flush();
      });

      it('should display the popover', function () {
        expect(getPopover()).toHaveClass('in');
      });

      it('should show the lock icon', function () {
        expect($scope.shouldShowLockIcon()).toEqual(true);
      });

      it('should have a toggle status of closed', function () {
        i.trigger('click');
        $timeout.flush();
        expect(getPopover().length).toBe(0);
      });

    });

    describe('populate jobs on data change', function () {
      describe('write locks', function () {
        var response;
        beforeEach(function () {
          response = [
            {
              read_locks: [],
              write_locks: [
                {
                  locked_item_uri: 'host/6'
                }
              ],
              description: 'write lock description'
            }
          ];

          stream.write(response);
        });

        it('should contain a write lock job message', function () {
          expect($scope.writeMessages).toEqual(['write lock description']);
        });

        it('should get write lock tooltip message ', function () {
          expect($scope.getLockTooltipMessage()).toEqual('1 ongoing write lock operation.' +
            ' Click to review details.');
        });
      });

      describe('read locks', function () {
        var response;
        beforeEach(function () {
          response = [
            {
              read_locks: [
                {
                  locked_item_uri: 'host/6'
                }
              ],
              write_locks: [],
              description: 'read lock description'
            }
          ];

          stream.write(response);
        });

        it('should contain a read lock job message', function () {
          expect($scope.readMessages).toEqual(['read lock description']);
        });

        it('should get read lock tooltip message ', function () {
          expect($scope.getLockTooltipMessage()).toEqual('Locked by 1 pending operation. ' +
            'Click to review details.');
        });
      });

      describe('read and write locks', function () {
        var response;

        beforeEach(function () {
          response = [
            {
              read_locks: [
                {
                  locked_item_uri: 'host/6'
                }
              ],
              write_locks: [],
              description: 'read lock description'
            },
            {
              read_locks: [],
              write_locks: [
                {
                  locked_item_uri: 'host/6'
                }
              ],
              description: 'write lock description'
            }
          ];

          stream.write(response);
        });

        it('should contain a read and write lock job message', function () {
          var messages = $scope.readMessages
            .concat($scope.writeMessages);

          expect(messages)
            .toEqual(['read lock description', 'write lock description']);
        });

        it('should get lock tooltip message for both read and write lock messages', function () {
          expect($scope.getLockTooltipMessage()).toEqual('There is 1 ongoing write lock' +
            ' operation and 1 pending read lock operation. Click to review details.');
        });
      });
    });

    describe('lock icon interaction', function () {
      var response;

      beforeEach(function () {
        response = [
          {
            read_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            write_locks: [],
            description: 'read lock description'
          },
          {
            read_locks: [],
            write_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            description: 'write lock description'
          }
        ];

        stream.write(response);

        // Update the html
        $scope.$digest();

        i = node.find('i');
      });

      it('should display the info icon', function () {
        expect(i).toBeShown();
      });

      it('should display the popover after clicking info icon', function () {
        i.trigger('click');
        $timeout.flush();

        expect(getPopover()).toBeShown();
      });

      it('should display the tooltip after mousing over the info icon', function () {
        i[0].dispatchEvent(new MouseEvent('mouseover'));
        $timeout.flush();

        var tooltip = node.find('.tooltip');
        expect(tooltip).toBeShown();
      });
    });

    describe('read message updates', function () {
      var response;
      beforeEach(function () {
        response = [
          {
            read_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            write_locks: [],
            description: 'read lock description1'
          }
        ];

        stream.write(response);

        // Change the response to have 2 messages now
        response = [
          {
            read_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            write_locks: [],
            description: 'read lock description1'
          },
          {
            read_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            write_locks: [],
            description: 'read lock description2'
          }
        ];

        stream.write(response);

        // Now, remove the first message so that only message 2 remains
        response = [
          {
            read_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            write_locks: [],
            description: 'read lock description2'
          }
        ];

        stream.write(response);
      });

      it('should contain the second message in the status array.', function () {
        expect($scope.readMessages).toEqual(['read lock description2']);
      });

      it('should contain only message1 in the difference array.', function () {
        expect($scope.readMessageDifference).toEqual(['read lock description1']);
      });
    });

    describe('write message updates', function () {
      var response;
      beforeEach(function () {
        response = [
          {
            read_locks: [],
            write_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            description: 'write lock description1'
          }
        ];

        stream.write(response);

        // Change the response to have 2 messages now
        response = [
          {
            read_locks: [],
            write_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            description: 'write lock description1'
          },
          {
            read_locks: [],
            write_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            description: 'write lock description2'
          }
        ];

        stream.write(response);

        // Now, remove the first message so that only message 2 remains
        response = [
          {
            read_locks: [],
            write_locks: [
              {
                locked_item_uri: 'host/6'
              }
            ],
            description: 'write lock description2'
          }
        ];

        stream.write(response);
      });

      it('should contain the second message in the status array.', function () {
        expect($scope.writeMessages).toEqual(['write lock description2']);
      });

      it('should contain only message1 in the difference array.', function () {
        expect($scope.writeMessageDifference).toEqual(['write lock description1']);
      });
    });
  });
});
