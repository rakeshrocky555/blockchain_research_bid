//for deploying the smart contract we use the below migration code
var ResearchBid = artifacts.require("./ResearchPapers.sol");

module.exports = function (deployer) {
  deployer.deploy(ResearchBid);
};