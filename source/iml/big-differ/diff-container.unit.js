import { DiffContainerController } from './diff-container';

describe('diff container', () => {
  let diffContainerController, spy;

  beforeEach(() => {
    diffContainerController = new DiffContainerController();
    diffContainerController.$onInit();

    spy = jasmine.createSpy('spy');
  });

  it('should reset a differ', () => {
    diffContainerController.register({
      reset: spy,
      getState: () => 'foo'
    });

    diffContainerController.reset();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should tell if a differ is clean', () => {
    diffContainerController.register({
      reset: spy,
      getState: () => {
        return {
          status: 'clean'
        };
      }
    });

    expect(diffContainerController.noSubmit()).toBe(true);
  });

  it('should tell if a differ is dirty', () => {
    diffContainerController.register({
      reset: spy,
      getState: () => {
        return {
          status: 'clean'
        };
      }
    });

    diffContainerController.register({
      reset: spy,
      getState: () => {
        return {
          status: 'local'
        };
      }
    });

    expect(diffContainerController.noSubmit()).toBe(false);
  });

  it('should splice out differs', () => {
    const differ = {
      reset: spy,
      getState: () => {
        return {
          status: 'local'
        };
      }
    };

    diffContainerController.register(differ);

    diffContainerController.deregister(differ);

    expect(diffContainerController.noSubmit()).toBe(true);
  });
});
