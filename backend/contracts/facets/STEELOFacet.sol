// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../libraries/LibAppStorage.sol";
import "../libraries/LibDiamond.sol";
import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";
import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import {LibSteelo} from "../libraries/LibSteelo.sol";

contract STEELOFacet {
   
	AppStorage internal s;



	function steeloInitiate() public returns (bool success) {
		LibSteelo.initiate(msg.sender);
		return true;
	}

	function getName () public view returns (string memory) {
		return "Steelo";
	}

	function getSteeloName () public view returns (string memory) {
		return s.name;
	}
	function getSteeloSymbol () public view returns (string memory) {
		return s.symbol;
	}
	function getSteeloTotalSupply () public view returns (uint256 ) {
		return s.totalSupply;
	}






}
