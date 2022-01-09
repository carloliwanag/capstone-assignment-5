var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  const tokenURI = 'test';

  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      await this.contract.mint(account_one, 1, tokenURI, { from: account_one });
      await this.contract.mint(account_one, 2, tokenURI, { from: account_one });
      await this.contract.mint(account_one, 3, tokenURI, { from: account_one });
      await this.contract.mint(account_one, 4, tokenURI, { from: account_one });
      await this.contract.mint(account_one, 5, tokenURI), { from: account_one };
    });

    it('should return total supply', async function () {
      let total = await this.contract.totalSupply();
      assert.equal(5, total);
    });

    it('should get token balance', async function () {
      let balance = await this.contract.balanceOf(account_one);
      assert.equal(5, balance);

      balance = await this.contract.balanceOf(account_two);
      assert.equal(0, balance);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async function () {
      let tokenURI = await this.contract.tokenURI(1);
      assert.equal(
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1',
        tokenURI
      );
    });

    it('should transfer token from one owner to another', async function () {
      const tokenId = 1;

      await this.contract.transferFrom(account_one, account_two, tokenId, {
        from: account_one,
      });

      let balance = await this.contract.balanceOf(account_one);
      assert.equal(4, balance);

      balance = await this.contract.balanceOf(account_two);
      assert.equal(1, balance);

      let owner = await this.contract.ownerOf(tokenId);
      assert.equal(owner, account_two);
    });
  });

  describe('have ownership properties', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it('should fail when minting when address is not contract owner', async function () {
      try {
        await this.contract.mint(account_one, 6, tokenURI, {
          from: account_two,
        });
      } catch (err) {
        assert.ok(err.message.indexOf('Caller not owner') !== -1);
      }
    });

    it('should return contract owner', async function () {
      let contractOwner = await this.contract.getOwner();
      assert.equal(account_one, contractOwner);
    });
  });
});
