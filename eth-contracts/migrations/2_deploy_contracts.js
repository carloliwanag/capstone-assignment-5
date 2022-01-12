// migrating the appropriate contracts
// var SquareVerifier = artifacts.require("./SquareVerifier.sol");
// var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

// var CustomERC721Token = artifacts.require('CustomERC721Token');
var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

module.exports = function (deployer) {
  // deployer.deploy(SquareVerifier);
  // deployer.deploy(SolnSquareVerifier);
  // deployer.deploy(CustomERC721Token);
  deployer.deploy(Verifier).then((resp) => {
    return deployer.deploy(SolnSquareVerifier, resp.address);
  });
};
