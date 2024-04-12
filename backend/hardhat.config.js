require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('solidity-coverage')
require("hardhat-gas-reporter");
require("hardhat-diamond-abi");
require('hardhat-abi-exporter');
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
  
});

function filterDuplicateFunctions(abiElement, index, fullAbiL, fullyQualifiedName) {
  if (["function", "event"].includes(abiElement.type)) {
    const funcSignature = genSignature(abiElement.name, abiElement.inputs, abiElement.type);
    if (elementSeenSet.has(funcSignature)) {
      return false;
    }
    elementSeenSet.add(funcSignature);
  } else if (abiElement.type === 'event') {

  }

  return true;

}

const elementSeenSet = new Set();
// filter out duplicate function signatures
function genSignature(name, inputs, type) {
  return `${type} ${name}(${inputs.reduce((previous, key) => 
    {
      const comma = previous.length ? ',' : '';
      return previous + comma + key.internalType;
    }, '' )})`;
}


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: '0.8.1',
  
  diamondAbi: {
    // (required) The name of your Diamond ABI
    name: "aiyzra",
    include: ['Facet'],
    strict: true,
    filter: filterDuplicateFunctions,
    
  },

  abiExporter: {
    // This plugin will copy the ABI from the DarkForest artifact into our `@darkforest_eth/contracts` package as `abis/DarkForest.json`
    path: './data/abi',
    runOnCompile: true,
    // We don't want additional directories created, so we explicitly set the `flat` option to `true`
    flat: true,
    // We **only** want to copy the DarkForest ABI (which is the Diamond ABI we generate) and the initializer ABI to this folder, so we limit the matched files with the `only` option
    only: [':Diamond$', ':DiamondInit$'],
  },

  networks: {
    
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ['0xa8e9aa87ee430950e906de74b75dd03bb7da20c7d6118d5efad467a185436acf', '0xd67460fd15ea87e041daec427378517174b1af247a06310c14e07afd6322356d', '0x53d3fe202f914a69ec77307767f2131d8743d2a205efc3288dc598cd025b07e7'],
      timeout: 600000
    }  
    
  },

  
};
