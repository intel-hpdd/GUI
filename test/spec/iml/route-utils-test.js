import {apiPathToUiPath} from '../../../source/iml/route-utils.js';

describe('route utils', () => {
  it('should convert a filesystem api resource to a routeable link', () => {
    expect(apiPathToUiPath('/api/filesystem/1/'))
      .toEqual('/ui/configure/filesystem/detail/1/');
  });

  it('should convert a host api resource to a routeable link', () => {
    expect(apiPathToUiPath('/api/host/1/'))
      .toEqual('/ui/configure/server/1/');
  });

  it('should convert any other api resource to a routeable link', () => {
    expect(apiPathToUiPath('/api/volume/1/'))
      .toEqual('/ui/volume/1/');
  });

  it('should return an empty string if a resource uri is not provided', () => {
    expect(apiPathToUiPath())
      .toEqual('');
  });
});
