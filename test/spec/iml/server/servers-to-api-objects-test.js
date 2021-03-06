import serversToApiObjects from "../../../../source/iml/server/servers-to-api-objects.js";

describe("servers to api objects", function() {
  let ADD_SERVER_AUTH_CHOICES, servers;

  beforeEach(function() {
    ADD_SERVER_AUTH_CHOICES = {
      EXISTING_KEYS: "existing_keys_choice",
      ROOT_PASSWORD: "id_password_root",
      ANOTHER_KEY: "private_key_choice"
    };

    servers = {
      addresses: ["lotus-34vm5.iml.intel.com", "lotus-34vm6.iml.intel.com"]
    };
  });

  it("should munge servers added with an existing key", function() {
    servers.auth_type = ADD_SERVER_AUTH_CHOICES.EXISTING_KEYS;

    const result = serversToApiObjects(servers);

    expect(result).toEqual([
      {
        address: "lotus-34vm5.iml.intel.com",
        auth_type: "existing_keys_choice"
      },
      {
        address: "lotus-34vm6.iml.intel.com",
        auth_type: "existing_keys_choice"
      }
    ]);
  });

  it("should munge servers added with a root password", function() {
    servers.auth_type = ADD_SERVER_AUTH_CHOICES.ROOT_PASSWORD;
    servers.root_password = "foo";

    const result = serversToApiObjects(servers);

    expect(result).toEqual([
      {
        address: "lotus-34vm5.iml.intel.com",
        auth_type: ADD_SERVER_AUTH_CHOICES.ROOT_PASSWORD,
        root_password: "foo"
      },
      {
        address: "lotus-34vm6.iml.intel.com",
        auth_type: ADD_SERVER_AUTH_CHOICES.ROOT_PASSWORD,
        root_password: "foo"
      }
    ]);
  });

  it("should munge servers added with a private key", function() {
    servers.auth_type = ADD_SERVER_AUTH_CHOICES.ANOTHER_KEY;
    servers.private_key = "bar";
    servers.private_key_passphrase = "baz";

    const result = serversToApiObjects(servers);

    expect(result).toEqual([
      {
        address: "lotus-34vm5.iml.intel.com",
        auth_type: ADD_SERVER_AUTH_CHOICES.ANOTHER_KEY,
        private_key: "bar",
        private_key_passphrase: "baz"
      },
      {
        address: "lotus-34vm6.iml.intel.com",
        auth_type: ADD_SERVER_AUTH_CHOICES.ANOTHER_KEY,
        private_key: "bar",
        private_key_passphrase: "baz"
      }
    ]);
  });
});
