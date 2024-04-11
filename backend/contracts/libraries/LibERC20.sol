    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./LibAppStorage.sol";
import "./LibMeta.sol";
import "./LibRentalStorage.sol";


library LibERC20 {

	function initiate(address from) internal {
		AppStorage storage s = LibAppStorage.diamondStorage();
		s.ERC20balanceOf[from] = 10000;	
	}
	function approve(address from, address to, uint256 amount) internal {
	        AppStorage storage s = LibAppStorage.diamondStorage();
	        s.ERC20allowance[from][to] = amount;
	}
	function donate(address from, uint256 amount) internal {
	        AppStorage storage s = LibAppStorage.diamondStorage();
		s.donation[from] += amount;
	}
	
	function transfer(address from, address to, uint256 amount) internal {
	        AppStorage storage s = LibAppStorage.diamondStorage();
		s.ERC20balanceOf[from] -= amount;
		s.ERC20balanceOf[to] += amount;
	}

}
