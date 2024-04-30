import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import CryptoJS from 'crypto-js';

//INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from "../../../assets";
import { convertTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";

const Chat = ({
  functionName,
  readMessage,
  friendMsg,
  account,
  userName,
  loading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  // STATE
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setChatData(router.query);
  }, [router.isReady]);

  useEffect(() => {
    if (chatData.address) {
      readMessage(chatData.address);
      readUser(chatData.address);
    }
  }, [chatData.address]);

  useEffect(() => {
    // Generate AES key based on the chat code
    if (currentUserName && currentUserAddress) {
      const chatCode = generateChatCode(account, currentUserAddress);
      const key = generateAESKey(chatCode);
      setAesKey(key);
      console.log(aesKey);
    }
  }, [currentUserName, currentUserAddress, friendMsg]);

  

  // Function to generate chat code
  const generateChatCode = (pubkey1, pubkey2) => {
    const address1 = pubkey1.toLowerCase();
    const address2 = pubkey2.toLowerCase();
    return address1 < address2
      ? CryptoJS.SHA256(address1 + address2).toString()
      : CryptoJS.SHA256(address2 + address1).toString();
  };

  // Function to generate AES key
  const generateAESKey = (chatCode) => {
    return CryptoJS.enc.Utf8.parse(chatCode);
  };

  // AES encryption function
  const [aesKey, setAesKey] = useState(generateAESKey(generateChatCode(account, currentUserAddress)));
  // AES encryption function
const encryptMessage = (message) => {
  if (!aesKey) {
    const chatCode = generateChatCode(account, currentUserAddress);
    const key = generateAESKey(chatCode);
    setAesKey(key);
  }
  const chatCode = generateChatCode(account, currentUserAddress);
  const key = generateAESKey(chatCode);
  setAesKey(key);
  const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey, { iv: aesKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  
  return encryptedMessage.toString();
};

// AES decryption function
// AES decryption function
const decryptMessage = (encryptedMessage) => {
  if (!aesKey) {
    console.error('AES key is not defined.');
    return '';
  }
  if (!encryptedMessage) {
    console.error('Encrypted message is not provided.');
    return '';
  }

  console.log('Decrypting message with AES key:', aesKey);
  console.log('Encrypted message:', encryptedMessage);

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, aesKey, { iv: aesKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted message:', decryptedMessage);
    return decryptedMessage;
  } catch (error) {
    console.error('Error decrypting message:', error);
    return '';
  }
};



  return (
    <div className={Style.Chat}>
      {currentUserName && currentUserAddress ? (
        <div className={Style.Chat_user_info}>
          <Image src={images.accountName} alt="image" width={70} height={70} />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      ) : (
        "<-----------------Select a chat----------------->"
      )}

      <div className={Style.Chat_box_box}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {friendMsg.map((el, i) => (
              <div key={i}>
                <div className={Style.Chat_box_left_title}>
                  <Image
                    src={images.accountName}
                    alt="image"
                    width={50}
                    height={50}
                  />
                  <span>
                    {el.sender === chatData.address ? chatData.name : userName} {""}
                    <small>Time: {convertTime(el.timestamp)}</small>
                  </span>
                </div>
                <p key={i + 1}>
                  {decryptMessage(el.msg)}
                </p>
              </div>
            ))}
          </div>
        </div>
        {currentUserName && currentUserAddress ? (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <input
                type="text"
                placeholder="type your message"
                onChange={(e) => setMessage(e.target.value)}
              />
              {loading === true ? (
                <Loader />
              ) : (
                <Image
                  src={images.send1}
                  alt="file"
                  width={50}
                  height={50}
                  onClick={() =>
                    functionName({ msg: encryptMessage(message), address: chatData.address })
                  }
                />
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Chat;
