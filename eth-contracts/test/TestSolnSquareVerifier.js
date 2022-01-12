let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
let Verifier = artifacts.require('Verifier');
contract('SolnSquareVerifier', (accounts) => {
  const accountOne = accounts[0];

  describe('SolnSquareVerifier can do as is expected', () => {
    before(async () => {
      let verifier = await Verifier.new({ from: accountOne });
      this.contract = await SolnSquareVerifier.new(verifier.address, {
        from: accountOne,
      });
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('should allow new solutions to be added', async () => {
      let { proof, inputs } = require('../../zokrates/proofs/proof2-4.json');
      let tokenId = 99;

      await this.contract.mint(tokenId, proof.a, proof.b, proof.c, inputs);

      let owner = await this.contract.ownerOf(tokenId);
      assert.equal(accountOne, owner);

      let supply = await this.contract.totalSupply();
      assert.ok(supply > 0);
    });

    it('should not allow existing solutions to be added', async () => {
      let { proof, inputs } = require('../../zokrates/proofs/proof2-4.json');
      let tokenId = 97;

      try {
        await this.contract.mint(tokenId, proof.a, proof.b, proof.c, inputs);
      } catch (err) {
        console.log(err.message);
        assert.ok(err.message.indexOf('Solution has been submitted') !== -1);
      }
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('should allow tokens to be minted', async () => {
      let { proof, inputs } = require('../../zokrates/proofs/proof5-25.json');
      let tokenId = 201;

      await this.contract.mint(tokenId, proof.a, proof.b, proof.c, inputs);

      let owner = await this.contract.ownerOf(tokenId);
      assert.equal(accountOne, owner);

      let supply = await this.contract.totalSupply();
      assert.ok(supply > 0);
    });
  });
});
