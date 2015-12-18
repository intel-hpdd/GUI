describe('add property', function () {
  'use strict';

  beforeEach(window.module('highland'));

  var addProperty, stream, propertyStream;

  beforeEach(inject(function (_addProperty_) {
    stream = highland();
    spyOn(stream, 'destroy');
    addProperty = _addProperty_;
    propertyStream = stream.through(addProperty);
  }));

  it('should be a function', function () {
    expect(addProperty).toEqual(jasmine.any(Function));
  });

  it('should expose a property method', function () {
    expect(propertyStream.property).toEqual(jasmine.any(Function));
  });

  it('should push a value', function () {
    propertyStream
      .property()
      .each(function (x) {
        expect(x).toEqual('x');
      });

    stream.write('x');
  });

  it('should remember the last value for more properties', function () {
    stream.write('x');

    propertyStream
      .property()
      .each(_.noop);

    propertyStream
      .property()
      .each(function (x) {
        expect(x).toEqual('x');
      });
  });

  it('should work with new consumers', function () {
    stream.write('x');

    propertyStream
      .property()
      .each(_.noop);

    stream.write('y');

    propertyStream
      .property()
      .each(function (y) {
        expect(y).toEqual('y');
      });
  });

  it('should register a fork', function () {
    var ps = propertyStream.property();

    expect(propertyStream._consumers[0]).toBe(ps);
  });

  it('should destroy the fork', function () {
    var ps = propertyStream.property();

    ps.destroy();

    expect(propertyStream._consumers.length).toBe(0);
  });

  it('should destroy the stream', function () {
    propertyStream.destroy();

    expect(stream.destroy).toHaveBeenCalledOnce();
  });
});
