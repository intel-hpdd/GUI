import highland from "highland";
import * as maybe from "@iml/maybe";

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

    it("should create a jobMonitorStream", () => {
      expect(mockStore.select).toHaveBeenCalledOnceWith("jobIndicators");
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
        lnetStream.write([
          {
            id: 1,
            host: "/api/host/1/",
            state: "lnet_up",
            resource_uri: "/api/lnet_configuration/1/",
            label: "lnet configuration"
          },
          {
            id: 2,
            host: "/api/host/2/",
            state: "lnet_up",
            resource_uri: "/api/lnet_configuration/2/",
            label: "lnet configuration"
          }
        ]);

        const resolves = await promise;
        resolves.lnetConfigurationStream().each(spy);
      });

      it("should return the item associated with the route", () => {
        expect(spy).toHaveBeenCalledOnceWith({
          id: 1,
          host: "/api/host/1/",
          state: "lnet_up",
          resource_uri: "/api/lnet_configuration/1/",
          label: "lnet configuration"
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

    it("should create a corosync configuration stream", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith("/corosync_configuration", {
        jsonMask: "objects(resource_uri,available_actions,mcast_port,locks,state,id,network_interfaces)",
        qs: {
          host__id: "1",
          limit: 0
        }
      });
    });

    it("should create a pacemaker configuration stream", () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith("/pacemaker_configuration", {
        jsonMask: "objects(resource_uri,available_actions,locks,state,id)",
        qs: {
          host__id: "1",
          limit: 0
        }
      });
    });

    it("should return an object of streams", async () => {
      const result = await promise;

      expect(result).toEqual({
        jobMonitorStream: expect.any(Function),
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
