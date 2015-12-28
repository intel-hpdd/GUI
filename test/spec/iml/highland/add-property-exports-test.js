import λ from 'highland';

import {noop} from 'intel-fp/fp';

import addProperty from
  '../../../../source/chroma_ui/iml/highland/add-property-exports';

describe('add property', () => {
  var stream, propertyStream;

  beforeEach(() => {
    stream = λ();
    spyOn(stream, 'destroy');
    propertyStream = stream.through(addProperty);
  });

  it('should be a function', () => {
    expect(addProperty).toEqual(jasmine.any(Function));
  });

  it('should expose a property method', () => {
    expect(propertyStream.property).toEqual(jasmine.any(Function));
  });

  it('should push a value', () => {
    propertyStream
      .property()
      .each((x) => {
        expect(x).toEqual('x');
      });

    stream.write('x');
  });

  it('should remember the last value for more properties', () => {
    stream.write('x');

    propertyStream
      .property()
      .each(noop);

    propertyStream
      .property()
      .each((x) => {
        expect(x).toEqual('x');
      });
  });

  it('should work with new consumers', () => {
    stream.write('x');

    propertyStream
      .property()
      .each(noop);

    stream.write('y');

    propertyStream
      .property()
      .each((y) => {
        expect(y).toEqual('y');
      });
  });

  it('should register a fork', () => {
    var ps = propertyStream.property();

    expect(propertyStream._consumers[0]).toBe(ps);
  });

  it('should destroy the fork', () => {
    var ps = propertyStream.property();

    ps.destroy();

    expect(propertyStream._consumers.length).toBe(0);
  });

  it('should destroy the stream', () => {
    propertyStream.destroy();

    expect(stream.destroy).toHaveBeenCalledOnce();
  });
});
