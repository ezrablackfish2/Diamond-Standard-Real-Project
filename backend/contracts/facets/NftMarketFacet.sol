pragma solidity ^0.8.1;
import "../tokens/ERC721Diamond.sol";
import {LibERC721} from "../libraries/LibERC721.sol";
import "../libraries/Base64.sol";
import "../libraries/LibDiamond.sol";
import {CharacterAttributes, BigBoss} from "../libraries/LibAppStorage.sol";
import "hardhat/console.sol";


contract NftMarket is ERC721Diamond {


  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint newBossHp, uint newPlayerHp);


    function updateFee(uint256 _fee) external {

        LibDiamond.enforceIsContractOwner();
        s.fee = _fee;

    }


  
  function mintCharacterNFT(uint _characterIndex) external payable{
    require(msg.value >= s.fee);
    uint256 newItemId = s._tokenIds;

    _safeMint(msg.sender, newItemId);

    s.nftHolderAttributes[newItemId] = CharacterAttributes({
      
      characterIndex: _characterIndex,
      name: s.defaultCharacters[_characterIndex].name,
      imageURI: s.defaultCharacters[_characterIndex].imageURI,
      hp: s.defaultCharacters[_characterIndex].hp,
      maxHp: s.defaultCharacters[_characterIndex].hp,
      attackDamage: s.defaultCharacters[_characterIndex].attackDamage,
      levels: s.defaultCharacters[_characterIndex].levels
      
    });


    
    s.totalTokens = newItemId;
    s._tokenIds += 1;
    
    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);

  }


  function tokenURI(uint256 _tokenId) public view override returns (string memory) 
  {
    CharacterAttributes memory charAttributes = s.nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

    string memory json = Base64.encode(

        abi.encodePacked(
          '{"name": "',
          charAttributes.name,
          ' -- NFT #: ',
          Strings.toString(_tokenId),
          '", "description": "An epic NFT", "image": "ipfs://',
          charAttributes.imageURI,
          '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ', strAttackDamage,'}, { "trait_type": "Levels", "value": "',charAttributes.levels,'"} ]}'          
        )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    
    return output;
  }


  function attackBoss(uint tokenID) public {
    
    require(s._owners[tokenID] == msg.sender, "Not NFT Owner");
    CharacterAttributes storage player = s.nftHolderAttributes[tokenID];

    require (
      player.hp > 0,
      "Error: character must have HP to attack boss."
    );

    require (
      s.bigBoss.hp > 0,
      "Error: boss must have HP to attack boss."
    );

    if (s.bigBoss.hp < player.attackDamage) {
      s.bigBoss.hp = 0;
    } else {
      s.bigBoss.hp = s.bigBoss.hp - player.attackDamage;
    }

    if (player.hp < s.bigBoss.attackDamage) {
      player.hp = 0;
    } else {
      player.hp = player.hp - s.bigBoss.attackDamage;
    }

    emit AttackComplete(s.bigBoss.hp, player.hp);
  }


  function checkIfUserHasNFT() public view returns (CharacterAttributes[] memory) {
    
    uint[] memory nftArray = LibERC721._tokensOfOwner(msg.sender);

    if(nftArray.length == 0){
      CharacterAttributes[] memory emptyStruct;
      return emptyStruct;
    }

    CharacterAttributes[] memory charArray = new CharacterAttributes[](nftArray.length);

    for(uint i=0; i<nftArray.length; i++){

        charArray[i] = s.nftHolderAttributes[nftArray[i]];

    }

    return charArray;

  }
  
  function getBigBoss() public view returns (BigBoss memory) {
    
    return s.bigBoss;

  }
  

  function getAllDefaultCharacters() external view returns (CharacterAttributes[] memory) {

    return s.defaultCharacters;

  }


  function withdraw() external {

    LibDiamond.enforceIsContractOwner();
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    require(success, "Transfer failed.");

  }

  function nftHolders(address user) external view returns(uint256[] memory val) {

    return LibERC721._tokensOfOwner(user);

  }

  function nftHolderAttributes(uint256 tokenID) external view returns(CharacterAttributes memory) {

    return LibERC721.getNFTHolderAttributes(tokenID);

  }

  function totalTokens() external view returns(uint256 val) {

    val = s.totalTokens;

  }


}
