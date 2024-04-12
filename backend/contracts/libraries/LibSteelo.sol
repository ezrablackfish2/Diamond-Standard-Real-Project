    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./LibAppStorage.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";


library LibSteelo {

	function initiate(address from) internal {
		AppStorage storage s = LibAppStorage.diamondStorage();
		s.name = "Steelo";
		s.symbol = "STH";
		s.totalSupply = 100;
		
	}
	
	

}
