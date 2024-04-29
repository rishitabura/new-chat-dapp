import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import CryptoJS from 'crypto-js';

//INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from "../../../assets";
import { convertTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";

// Fixed AES key (16 bytes for AES-128, 24 bytes for AES-192, 32 bytes for AES-256)
// Access AES key from environment variable
const aesKey = CryptoJS.enc.Utf8.parse(process.env.AES_KEY);

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
  }, []);

  // AES encryption function
  const encryptMessage = (message) => {
    

    const encryptedMessage = CryptoJS.AES.encrypt(message, aesKey, { iv: aesKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encryptedMessage.toString();
  };

  // AES decryption function
  const decryptMessage = (encryptedMessage) => {
    console.log('AES Key:', process.env.AES_KEY);
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, aesKey, { iv: aesKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
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
