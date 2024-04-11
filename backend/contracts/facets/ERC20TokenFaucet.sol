// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/LibAppStorage.sol";
import "../libraries/LibMeta.sol";
import "../libraries/LibERC721.sol";
import "../libraries/LibDiamond.sol";
import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";
import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { IERC173 } from "../interfaces/IERC173.sol";
import {LibERC20} from "../libraries/LibERC20.sol";

contract ezraCoin  {
   
	AppStorage internal s;
        

	

	event ERC20Transfer(
		address indexed _from,
		address indexed _to,
		uint _value
	);

	event ERC20Approval(
		address indexed _owner,
		address indexed _spender,
		uint _value
	);


	function ERC20initiate() public returns (bool success) {
		LibERC20.initiate(msg.sender);
		return true;
	}
	

	function ERC20updateFee(uint256 _fee) external {
        	LibDiamond.enforceIsContractOwner();
        	s.fee = _fee;
    }

	function getERC20name() public view returns (string memory) {
        	return s.ERC20name;
    	}
	function ERC20transfer(address _to, uint256 _value) public returns (bool success) {
		LibERC20.transfer(msg.sender, _to, _value);
		return true;
	}

	function ERC20transferFrom(address from, address _to, uint256 _value) public returns (bool success) {
		LibERC20.transferFrom(from, _to, _value);
		return true;
	}


	function ERC20approve(address _spender, uint256 _value) public returns (bool success) {
		LibERC20.approve(msg.sender, _spender, _value);	
		return true;
	}

	function ERC20donate() public payable {
		LibERC20.donate(msg.sender, msg.value);
        	s.donation[msg.sender] += msg.value;
        }
    	

	function ERC20withdraw() external {
		LibDiamond.enforceIsContractOwner();
               (bool success, ) = msg.sender.call{value: address(this).balance}("");
                require(success, "Transfer failed.");
	}



}
