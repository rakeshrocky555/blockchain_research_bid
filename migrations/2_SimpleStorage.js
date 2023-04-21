//for deploying the smart contract we use this migration code
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};