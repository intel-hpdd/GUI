expect.extend({
  toHaveBeenCalledOnceWith(received, ...rest) {
    expect.assertions(3);

    expect(received).toHaveBeenCalledWith(...rest);
    expect(received).toHaveBeenCalledTimes(1);

    return {
      message: () => 'Nice Work!',
      pass: true
    };
  },
  toHaveBeenCalledTwiceWith(received, args) {
    expect.assertions(3);

    expect(received).toHaveBeenCalledWith(args);
    expect(received).toHaveBeenCalledTimes(2);

    return {
      message: () => 'Nice Work!',
      pass: true
    };
  }
});
