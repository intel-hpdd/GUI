import buildResponseError from '../../../../source/iml/socket/build-response-error.js';

describe('build response error', () => {
  it('should keep an existing error', () => {
    const err = new Error('boom!');

    expect(buildResponseError(err))
      .toBe(err);
  });

  it('should wrap a string error in an Error', () => {
    const err = 'boom!';
    const error = new Error('boom!');

    expect(buildResponseError(err))
      .toEqual(error);
  });

  it('should convert an object literal to an error instance', () => {
    const err = {
      message: 'boom!',
      statusCode: 500
    };

    const error = new Error('boom!');
    error.statusCode = 500;

    expect(buildResponseError(err))
      .toEqual(error);
  });
});
