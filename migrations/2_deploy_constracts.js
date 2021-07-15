var Memory = artifacts.require("./Memory.sol");

module.exports = function(deployer) {
  deployer.deploy(Memory);
};