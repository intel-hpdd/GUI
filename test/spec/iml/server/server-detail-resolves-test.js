import highland from "highland";
import * as maybe from "@iml/maybe";
import Immutable from "seamless-immutable";

describe("server detail resolves", () => {
  let mockStore,
    mockSocketStream,
    mockGetNetworkInterfaceStream,
    mockNetworkInterfaceStream,
    corosyncStream,
    pacemakerStream,
    lnetStream,
    serverStream,
    $stateParams,
    serverDetailResolves,
    spy;

  beforeEach(() => {
    mockStore = {
      select: jest.fn(key => {
        if (key === "server") return (serverStream = highland());
        else if (key === "lnetConfiguration") return (lnetStream = highland());
        else return highland();
      })
    };

    mockSocketStream = jest.fn(path => {
      if (path === "/corosync_configuration") return (corosyncStream = highland());

      if (path === "/pacemaker_configuration") return (pacemakerStream = highland());
    });

    mockNetworkInterfaceStream = highland();

    mockGetNetworkInterfaceStream = jest.fn(() => mockNetworkInterfaceStream);

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);
    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);
    jest.mock("../../../../source/iml/lnet/get-network-interface-stream.js", () => mockGetNetworkInterfaceStream);

    const mod = require("../../../../source/iml/server/server-detail-resolves.js");

    spy = jest.fn();

    $stateParams = {
      id: "1"
    };

    serverDetailResolves = mod.default;
  });

  it("should be a function", () => {
    expect(serverDetailResolves).toEqual(expect.any(Function));
  });

  describe("getting a promise", () => {
    let promise;

    beforeEach(() => {
      promise = serverDetailResolves($stateParams);

      mockNetworkInterfaceStream.write({});
      corosyncStream.write({
        objects: [{}]
      });
      pacemakerStream.write({
        objects: []
      });
    });

    it("should create a locksStream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("locks");
    });

    it("should create an alertMonitorStream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("alertIndicators");
    });

    it("should create a serverStream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("server");
    });

    it("should create a lnet configuration stream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("lnetConfiguration");
    });

    describe("filtering server data", () => {
      beforeEach(async () => {
        serverStream.write([
          {
            id: 1,
            address: "lotus-35vm15.lotus.hpdd.lab.intel.com"
          },
          {
            id: 2,
            address: "lotus-35vm16.lotus.hpdd.lab.intel.com"
          }
        ]);

        const resolves = await promise;
        resolves.serverStream.each(spy);
      });

      it("should return the server associated with the route", () => {
        expect(spy).toHaveBeenCalledOnceWith({
          id: 1,
          address: "lotus-35vm15.lotus.hpdd.lab.intel.com"
        });
      });

      it("should not return servers which have an id that does not match the route", () => {
        expect(spy).not.toHaveBeenCalledWith({
          id: 2,
          address: "lotus-35vm16.lotus.hpdd.lab.intel.com"
        });
      });
    });

    describe("filtering lnet configuration data", () => {
      beforeEach(async () => {
        lnetStream.write(
          Immutable({
            1: {
              id: 1,
              host_id: 1,
              state: "lnet_up",
              resource_uri: "/api/lnet_configuration/1/",
              label: "lnet configuration"
            },
            2: {
              id: 2,
              host_id: 2,
              state: "lnet_up",
              resource_uri: "/api/lnet_configuration/2/",
              label: "lnet configuration"
            }
          })
        );

        const resolves = await promise;
        resolves.lnetConfigurationStream().each(spy);
      });

      it("should return the item associated with the route", () => {
        expect(spy).toHaveBeenCalledOnceWith({
          host_id: 1,
          id: 1,
          label: "LNet Configuration",
          resource_uri: "/api/lnet_configuration/1/",
          state: "lnet_up"
        });
      });

      it("should not return items not associated with the route", () => {
        expect(spy).not.toHaveBeenCalledWith({
          id: 2,
          host: "/api/host/2/",
          state: "lnet_up",
          resource_uri: "/api/lnet_configuration/2/",
          label: "lnet configuration"
        });
      });
    });

    it("should create a network interface stream", () => {
      expect(mockGetNetworkInterfaceStream).toHaveBeenCalledOnceWith({
        jsonMask: "objects(id,inet4_address,name,nid,lnd_types,resource_uri)",
        qs: {
          host__id: "1",
          limit: 0
        }
      });
    });

    it("should create a pacemaker configuration stream", () => {
      expect(mockSocketStream).toHaveBeenCalledTimes(2);
      expect(mockSocketStream).toHaveBeenCalledWith("/pacemaker_configuration", {
        jsonMask: "objects(resource_uri,available_actions,state,content_type_id,id,label)",
        qs: {
          host__id: "1",
          limit: 0
        }
      });
    });

    it("should return an object of streams", async () => {
      const result = await promise;

      expect(result).toEqual({
        locksStream: expect.any(Function),
        alertMonitorStream: expect.any(Function),
        serverStream: expect.any(Object),
        lnetConfigurationStream: expect.any(Function),
        networkInterfaceStream: expect.any(Object),
        corosyncConfigurationStream: expect.any(Function),
        pacemakerConfigurationStream: expect.any(Function)
      });
    });
  });
});

describe("getting data", () => {
  let result, mockStore, mockSocketStream, mockGetNetworkInterfaceStream;
  beforeEach(async () => {
    mockStore = {
      select: jest.fn(key => {
        if (key === "server") return highland([[{ id: 5, name: "b" }, { id: 7, name: "a" }, { id: 10, name: "c" }]]);
      })
    };

    mockSocketStream = jest.fn();
    mockGetNetworkInterfaceStream = jest.fn();

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);
    jest.mock("../../../../source/iml/lnet/get-network-interface-stream.js", () => mockGetNetworkInterfaceStream);

    jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);

    const mod = require("../../../../source/iml/server/server-detail-resolves.js");

    result = await mod.getData({ id: 7 });
  });

  it("should not call the socket stream", () => {
    expect(mockSocketStream).not.toHaveBeenCalled();
  });

  it("should not call getNetworkInterfaceStream", () => {
    expect(mockGetNetworkInterfaceStream).not.toHaveBeenCalled();
  });

  it("should returned the object matching the id", () => {
    expect(result).toEqual(maybe.ofJust({ id: 7, name: "a" }));
  });
});
