import {apiPathToUiPath} from '../../../source/iml/route-utils.js';

describe('route utils', () => {
  it('should convert a filesystem api resource to a routeable link', () => {
    expect(apiPathToUiPath('/api/filesystem/1/'))
      .toEqual('configure/filesystem/1/');
  });

  it('should convert a host api resource to a routeable link', () => {
    expect(apiPathToUiPath('/api/host/1/'))
      .toEqual('configure/server/1/');
  });

  it('should convert any other api resource to a routeable link', () => {
    expect(apiPathToUiPath('/api/volume/1/'))
      .toEqual('volume/1/');
  });
});
