/* global describe it before ethers */

const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets
} = require('../scripts/libraries/diamond.js')

const { deployDiamond } = require('../scripts/deploy.js')

const { assert, expect } = require('chai')



const transformRentalData = (rentalData) => {
  return {
    
    price: rentalData.price.toString(),
    expiresAt: rentalData.expiresAt.toString(),
    maxRental: rentalData.maxRental.toString(),
    seller: rentalData.seller.toString(),
    renter: rentalData.renter.toString(),
    isRented: rentalData.isRented.toString()    
  };
};

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    levels: characterData.levels    
  };
};

describe('DiamondTest', async function () {
  let diamondAddress
  let diamondCutFacet
  let diamondLoupeFacet
  let ownershipFacet
  let tx
  let receipt
  let result
  const addresses = []
  let owner, addr1, addr2, addr3;
  this.timeout(60000);

  before(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    diamondAddress = await deployDiamond()
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress)
    ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress)
  })

  it('should have three facets', async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address)
    }

    assert.equal(addresses.length, 3)
  }).timeout(600000);


	

  it('should add NFT market facet', async () => {

      const DynamicGameFacet = await ethers.getContractFactory('NftMarket')
      const dynamicGameFacet = await DynamicGameFacet.deploy()
  
      let selectors = getSelectors(dynamicGameFacet);
      selectors = selectors.remove(['supportsInterface'])
      let addresses = [];
      addresses.push(dynamicGameFacet.address);
      
      await diamondCutFacet.diamondCut([[dynamicGameFacet.address, FacetCutAction.Add, selectors]], ethers.constants.AddressZero, '0x');
  
      result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0]);
      assert.sameMembers(result, selectors)
  
    }).timeout(600000)
   
  
  it('should check Nft Market facet constructor args', async () => { 
  
      const nftMarket = await ethers.getContractAt('NftMarket', diamondAddress)
      let bossTxn = await nftMarket.getBigBoss();
      let result = transformCharacterData(bossTxn);
 

      expect(result.name).to.equal("THANOS");
      expect((result.hp).toString()).to.equal("100000");
      expect((result.maxHp).toString()).to.equal("100000");
      expect((result.attackDamage).toString()).to.equal("150");

 
 

    }).timeout(600000)


	it('should add ERC20 facet', async () => {

      const ERC20 = await ethers.getContractFactory('ezraCoin')
      const erc20 = await ERC20.deploy()
  
      let selectors = getSelectors(erc20);
      let addresses = [];
      addresses.push(erc20.address);
      
      await diamondCutFacet.diamondCut([[erc20.address, FacetCutAction.Add, selectors]], ethers.constants.AddressZero, '0x');
  
      result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0]);
      assert.sameMembers(result, selectors)
  
    })

	it('should check ERC20 constructor args', async () => { 
  
      const ERC20 = await ethers.getContractAt('ezraCoin', diamondAddress)
      let name = await ERC20.getERC20name()
 

      expect(name).to.equal("ezraCoin");

    })
	it('Should Fetch NftMarket', async function () {

      nftMarket = await ethers.getContractAt('NftMarket', diamondAddress)

    });

    it('Should Mint Characters', async function () {
        
        for (let i = 0; i < 16; i++) {
          await expect(nftMarket.connect(owner).mintCharacterNFT(i, {value: ethers.utils.parseEther("0.5")})).to.not.be.reverted; 
        }

    });

    it('Should Fail To Mint If Amount Is Low', async function () {
      
      await expect(nftMarket.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.005")})).to.be.reverted; 
      await expect(nftMarket.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.002")})).to.be.reverted; 

    });

//    it('Should compare the fee', async function () {
//      
//      const ERC20 = await ethers.getContractAt('ezraCoin', diamondAddress)
//      let fee = await ERC20.ERC20UpdateFee(25) 
//      expect(fee).to.equal(25);
//    });

    it('should approve transfer of tokens from one account to another with allowance', async () => {
    const ERC20 = await ethers.getContractAt('ezraCoin', diamondAddress);
    await expect(ERC20.connect(owner).ERC20approve(addr1.address, ethers.utils.parseEther("10"))).to.not.be.reverted;


}).timeout(600000)


   it('should allow only the nftMarket owner to update fee', async function() {
      
        const nftMarket = await ethers.getContractAt('NftMarket', diamondAddress)
        await expect(nftMarket.connect(owner).updateFee(ethers.utils.parseEther("0.2"))).to.not.be.reverted;

    });

   it('should allow only the ERC20 owner to update fee', async function() {
      
        const ERC20 = await ethers.getContractAt('ezraCoin', diamondAddress)
        await expect(ERC20.connect(owner).ERC20updateFee(ethers.utils.parseEther("0.2"))).to.not.be.reverted;

    });
   it('should allow only the ERC20 owner to donate some ether', async function() {
      
        const ERC20 = await ethers.getContractAt('ezraCoin', diamondAddress)
        await expect(ERC20.connect(owner).ERC20donate({value: ethers.utils.parseEther("20")})).to.not.be.reverted;

    });

    it('Withdraw should only work with owner and balance after withdrawal must be higher', async function() {
            
      const balanceBefore = await ethers.provider.getBalance(owner.address);
  
      const ERC20 = await ethers.getContractAt('ezraCoin', diamondAddress)
      await expect(ERC20.connect(owner).ERC20withdraw()).to.not.be.reverted;
  
      const balanceAfter = await ethers.provider.getBalance(owner.address);
      
      expect(balanceAfter.gt(balanceBefore), 'Balance is not higher').to.be.true;
        
    });
});
    
 
	

