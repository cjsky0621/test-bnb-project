import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../CSS/WalletCard.css";
import Button from "react-bootstrap/Button";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";
import abi from "../abis/baby.json"

const WalletCardEthers = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [babyBalance, setBabyBalance] = useState(0);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [provider, setProvider] = useState(null);
  const [babyTokenContract, setBabyTokenContract] = useState(null)
  const [senderAddress, setSenderAddress] = useState("")

  const [sendBNBAmount, setSendBNBAmount] = useState (0)

  const babyToken = "0xc748673057861a797275CD8A068AbB95A902e8de";

  const connectWalletHandler = () => {
    if (window.ethereum && defaultAccount == null) {
      // set ethers provider
      setProvider(new ethers.providers.Web3Provider(window.ethereum));

      // connect to metamask
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText("Wallet Connected");
          setDefaultAccount(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else if (!window.ethereum) {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  useEffect(()=> {console.log ("FDDDDD", provider)
    if (provider) setBabyTokenContract(new ethers.Contract(babyToken, abi, provider))
  }, [provider])

  useEffect(()=> {
    const fetchBalance = async() => {
      const balance = await babyTokenContract.balanceOf(defaultAccount)
      console.log(balance, "KKKKKKKKKK")
      setBabyBalance (balance.toString())
    }
    if (babyTokenContract && defaultAccount) fetchBalance()
  }, [babyTokenContract, defaultAccount])

  useEffect(() => {
    if (defaultAccount) {
      provider.getBalance(defaultAccount).then((balanceResult) => {
        setUserBalance(ethers.utils.formatEther(balanceResult));
      });
    }
  }, [defaultAccount]);

  const sendTokens = () => {
    const tx = {
      from: defaultAccount,
      to: senderAddress,
      value: ethers.utils.parseEther(sendBNBAmount),
      nonce: provider.getTransactionCount(defaultAccount, "latest"),
      gasLimit: ethers.utils.hexlify("0x200000"), // 100000
      gasPrice: provider.getGasPrice(),
    }

    const signer = provider.getSigner()
    signer.sendTransaction(tx)
  }
  return (
    <div>
      <div class="card" style={{minWidth: 500}}>
        <div class="card-header">Test blockchain</div>
        <div class="card-body" style={{width: 500}}>
          <h3 class="card-title">Connect your MetaMask </h3>
          <p class="card-text"></p>
          <Button variant="primary" onClick={connectWalletHandler}>
            {connButtonText}
          </Button>
          <hr></hr>
          <div className="accountDisplay">
            <h3>Address Wallet: </h3>
            <p>
              <i>{defaultAccount}</i>
            </p>
            <div className="balanceDisplay">
              <span>Balance(BNB): </span><span>{userBalance} BNB</span><br/>
              <span>Balance(babyDoge): </span><span>{babyBalance} babyDoge</span>
            </div>
            <div className="sendTransaction" style={{marginTop: 20}}>
            <span><input value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)}/> </span><span>Receiver</span><br/>
              <span><input value={sendBNBAmount} onChange={(e) => setSendBNBAmount(e.target.value)}/> </span><span><Button variant="primary" onClick={sendTokens}>Send</Button></span><br/>
            </div>
            {errorMessage}
          </div>
        </div>
      </div>
      <Footer />
    </div>  

  );
};

export default WalletCardEthers;
