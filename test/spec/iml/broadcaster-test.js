import highland from 'highland';
import broadcaster from '../../../source/iml/broadcaster.js';

describe('broadcaster', () => {
  let source$, broadcast, viewer1$, viewer2$, viewer3$, spy;
  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    source$ = highland();
    source$.write(1);
    source$.write(2);
    source$.write(3);

    spyOn(source$, 'destroy')
      .and.callThrough();

    broadcast = broadcaster(source$);
  });

  describe('with one viewer', () => {
    beforeEach(() => {
      viewer1$ = broadcast();
    });

    it('should pass the latest value to the new viewer', () => {
      viewer1$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });
  });

  describe('with two viewers', () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
    });

    it('should pass the latest value to the first viewer', () => {
      viewer1$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should pass the latest value to the second viewer', () => {
      viewer2$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });
  });

  describe('with three viewers', () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();
    });

    it('should pass the latest value to the first viewer', () => {
      viewer1$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should pass the latest value to the second viewer', () => {
      viewer2$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should pass the latest value to the third viewer', () => {
      viewer3$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();

      source$.write({
        __HighlandStreamError__: true,
        error: new Error('boom!')
      });
    });

    it('should receive the error on viewer 1', () => {
      viewer1$.pull(() => {});
      viewer1$.pull(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith(new Error('boom!'), undefined);
    });

    it('should receive the error on viewer 2', () => {
      viewer2$.pull(() => {});
      viewer2$.pull(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith(new Error('boom!'), undefined);
    });

    it('should receive the error on viewer 3', () => {
      viewer3$.pull(() => {});
      viewer3$.pull(spy);

      expect(spy)
        .toHaveBeenCalledOnceWith(new Error('boom!'), undefined);
    });
  });

  describe('destroying', () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();
    });

    describe('one of the viewers', () => {
      beforeEach(() => {
        viewer1$.destroy();
        source$.write(4);
      });

      it('should no longer receive data on the viewer', () => {
        viewer1$.each(spy);
        expect(spy).not.toHaveBeenCalledWith(4);
      });

      it('should receive data on the second stream', () => {
        viewer2$.each(spy);
        expect(spy).toHaveBeenCalledOnceWith(4);
      });

      it('should receive data on the third stream', () => {
        viewer3$.each(spy);
        expect(spy).toHaveBeenCalledOnceWith(4);
      });
    });
  });

  describe('ending the broadcast', () => {
    let viewer4$;
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();

      broadcast.endBroadcast();

      viewer4$ = broadcast();

      source$.write(4);
    });

    it('should call destroy on the source$ once', () => {
      expect(source$.destroy).toHaveBeenCalledOnce();
    });

    it('should write 3 to the first viewer', () => {
      viewer1$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should not write the latest value to the first viewer', () => {
      viewer1$.each(spy);
      expect(spy).not.toHaveBeenCalledOnceWith(4);
    });

    it('should write 3 to the second viewer', () => {
      viewer2$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should not write the latest value to the second viewer', () => {
      viewer2$.each(spy);
      expect(spy).not.toHaveBeenCalledOnceWith(4);
    });

    it('should write 3 to the third viewer', () => {
      viewer3$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should not write the latest value to the third viewer', () => {
      viewer3$.each(spy);
      expect(spy).not.toHaveBeenCalledOnceWith(4);
    });

    it('should write 3 to the fourth viewer', () => {
      viewer4$.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(3);
    });

    it('should not write the latest value to the fourth viewer', () => {
      viewer4$.each(spy);
      expect(spy).not.toHaveBeenCalledOnceWith(4);
    });
  });
});
