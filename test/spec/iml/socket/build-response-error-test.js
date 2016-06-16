import buildResponseError from '../../../../source/iml/socket/build-response-error.js';

describe('build response error', () => {
  it('should keep an existing error', () => {
    var response = {
      error: new Error('boom!')
    };

    expect(buildResponseError(response)).toBe(response.error);
  });

  it('should wrap a string error in an Error', () => {
    var response = {
      error: 'boom!'
    };

    var error = new Error('boom!');

    expect(buildResponseError(response)).toEqual(error);
  });

  it('should convert an object literal to an error instance', () => {
    var response = {
      error: {
        message: 'boom!',
        statusCode: 500
      }
    };

    var error = new Error('boom!');
    error.statusCode = 500;

    expect(buildResponseError(response)).toEqual(error);
  });
});
