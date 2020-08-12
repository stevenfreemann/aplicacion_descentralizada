const path = require("path");


module.exports = {
  contracts_build_directory: path.join(__dirname, "../../dapp/front/src/contracts"),
  networks: {
    development: {
    host: "192.168.174.129",     // Localhost (default: none)
    port: 8545,            // Standard Ethereum port (default: none)
    network_id: 5777,       // Any network (default: none)
    }
  }
}
