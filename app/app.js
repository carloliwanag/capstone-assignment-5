const HDWalletProvider = require('@truffle/hdwallet-provider');
const { mnemonic } = require('../secrets.json');
const web3 = require('web3');

const address = '0xfe4e25b5F89669053223E077FbCB909825ae9286';

const owner = '0x5CF87a7Ed479AeCEE0D8b7Cc2AcF73B114967dC5';

const {
  abi,
} = require('../eth-contracts/build/contracts/SolnSquareVerifier.json');

const main = async () => {
  const provider = new HDWalletProvider(
    mnemonic,
    'wss://rinkeby.infura.io/ws/v3/91dd495617a44c508e7669a2cda75255'
  );

  const web3Instance = new web3(provider);

  const contract = new web3Instance.eth.Contract(abi, address, {
    gasLimit: '1000000',
  });

  const proofs = [
    '2-4',
    '3-9',
    '4-16',
    '5-25',
    '6-36',
    '7-49',
    '8-64',
    '9-81',
    '10-100',
    '11-121',
  ];

  for (let i = 0; i < proofs.length; i++) {
    let {
      proof,
      inputs,
    } = require(`../zokrates/proofs/proof${proofs[i]}.json`);

    let tokenId = i + 1;

    const response = await contract.methods
      .mint(tokenId, proof.a, proof.b, proof.c, inputs)
      .send({
        from: owner,
      });

    console.log('response for token: ' + tokenId + '-> ' + response);
    console.log('');
  }
};

main();
