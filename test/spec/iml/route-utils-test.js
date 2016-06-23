import {uriPropertiesLink} from '../../../source/iml/route-utils.js';

describe('route utils', () => {
  it('should convert a filesystem api resource to a routeable link', () => {
    expect(uriPropertiesLink('/api/filesystem/1/', 'filesystem 1'))
      .toEqual('<a class="navigation" href="/configure/filesystem/detail/1/">filesystem 1</a>');
  });

  it('should convert a host api resource to a routeable link', () => {
    expect(uriPropertiesLink('/api/host/1/', 'lotus-35vm13.iml.intel.com'))
      .toEqual('<a href="/ui/configure/server/1/">lotus-35vm13.iml.intel.com</a>');
  });

  it('should convert any other api resource to a routeable link', () => {
    expect(uriPropertiesLink('/api/volume/1/', 'volume 1'))
      .toEqual('<a class="navigation" href="/volume/1/">volume 1</a>');
  });

  it('should return an empty string if a resource uri is not provided', () => {
    expect(uriPropertiesLink())
      .toEqual('');
  });
});
