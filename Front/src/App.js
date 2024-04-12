import { useState } from "react";
import { ethers } from "ethers";
// Import ABI Code to interact with smart contract
import Diamond from "./artifacts/aiyzra.json";
import "./App.css";

// The contract address
const diamondAddress = "0xbd515F3Eb5995a69E6abEb9A38Df33634ae0015A";

function App() {
  // Property Variables

  const [message, setMessage] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  // Helper Functions

  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchGreeting() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        diamondAddress,
        Diamond.abi,
        signer
      );
     
      try {
        // Call Greeter.greet() and display current greeting in `console`
        /* 
          function greet() public view returns (string memory) {
            return greeting;
          }
        */
	await contract.steeloInitiate();
	await contract.ERC20initiate();
        const name = await contract.getSteeloName();
        const symbol = await contract.getSteeloSymbol();
        const test2 = await contract.test2Func20();
        const planet = await contract.getSteeloTotalSupply();
        const ERC20name = await contract.getERC20name();
        const boss = await contract.getBigBoss();
        const ezra = await contract.ezra1();
        const test1 = await contract.test1Func20();

        console.log("name :", name);
        console.log("symbol :", symbol);
        console.log("test2 :", test2.toString());
        console.log("planet :", planet.toString());
        console.log("ERC20name :", ERC20name);
        console.log("Boss :", boss);
        console.log("ezra:", ezra);
        console.log("test1", test1.toString());
        setCurrentGreeting(name);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function setGreeting() {
    if (!message) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract with signer
      /*
        function setGreeting(string memory _greeting) public {
          console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
          greeting = _greeting;
        } 
      */
      const contract = new ethers.Contract(diamondAddress, Diamond.abi, signer);
	
      const transaction = await contract.getName();

      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  // Return
  return (
    <div className="App">
      <div className="App-header">
        {/* DESCRIPTION  */}
        <div className="description">
          <h1>Greeter.sol</h1>
          <h3>Full stack dapp using ReactJS and Hardhat</h3>
        </div>
        {/* BUTTONS - Fetch and Set */}
        <div className="custom-buttons">
          <button onClick={fetchGreeting} style={{ backgroundColor: "green" }}>
            Fetch Greeting
          </button>
          <button onClick={setGreeting} style={{ backgroundColor: "red" }}>
            Set Greeting
          </button>
        </div>
        {/* INPUT TEXT - String  */}
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Set Greeting Message"
        />

        {/* Current Value stored on Blockchain */}
        <h2 className="greeting">Greeting: {currentGreeting}</h2>
      </div>
    </div>
  );
}

export default App;
