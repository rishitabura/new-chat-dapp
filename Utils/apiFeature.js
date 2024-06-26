const { ethers } = require("ethers");

import Web3Modal from "web3modal";

import { ChatAppAddress, ChatAppABI } from "../Context/constants";

export const CheckIfWalletConnected = async () => {
  alert("Install MetaMask");
  try {
    if (!window.ethereum) return console.log("Install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const firstAccount = accounts[0];
    // const secAccount = accounts[1];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = async () => {
  try {
    // if (!window.ethereum) return console.log("Install MateMask");

    // const accounts = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });

    if (!window.ethereum) return console.log("Install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

const fetchContract = (signer) =>
  new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

// export const connectingWithContract = async () => {
//   try {
//     const web3modal = new Web3Modal();
//     const connection = await web3modal.connect();
//     console.log(connection);
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();
//     const contract = fetchContract(signer);
//     return contract;
//   } catch (error) {
//     console.log(error);
//   }
// };
export const connectingWithContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log(error);
  }
};

// export const converTime = (time) => {
//   const newTime = new Date(time.toNumber());

//   const realTime =
//     newTime.getHours() +
//     "/" +
//     newTime.getMinutes() +
//     "/" +
//     newTime.getSeconds() +
//     "  Date:" +
//     newTime.getDate() +
//     "/" +
//     (newTime.getMonth() + 1) +
//     "/" +
//     newTime.getFullYear();

//   return realTime;
// };
// export const convertTime = (time) => {
//   // const newTime = new Date(time);
//    // Convert BigInt to milliseconds (number)
//    const milliseconds = Number(time); // This may lose precision for large BigInts

//    // Create a Date object from milliseconds
//    const newTime = new Date(milliseconds);

//   const realTime =
//     newTime.getHours() +
//     ":" +
//     newTime.getMinutes() +
//     ":" +
//     newTime.getSeconds() +
//     "  Date:" +
//     newTime.getDate() +
//     "/" +
//     (newTime.getMonth() + 1) +
//     "/" +
//     newTime.getFullYear();

//   return realTime;
// };


export const convertTime = (time) => {
  // Ensure that time is converted to milliseconds if it's in seconds
  const timestamp = typeof time === 'bigint' ? time * 1000n : BigInt(time) * 1000n;

  // Create a Date object from the provided timestamp
  const newTime = new Date(Number(timestamp));

  // Extract individual components of the date and time
  const hours = newTime.getHours().toString().padStart(2, '0');
  const minutes = newTime.getMinutes().toString().padStart(2, '0');
  const seconds = newTime.getSeconds().toString().padStart(2, '0');
  const date = newTime.getDate();
  const month = newTime.getMonth() + 1;
  const year = newTime.getFullYear();

  // Construct the formatted date and time string
  const formattedTime = `${hours}:${minutes}:${seconds}  Date:${date}/${month}/${year}`;

  return formattedTime;
};


