import React, { useState, useEffect } from 'react'
import './VerifyContainer.css';
import { IonButton } from '@ionic/react';

declare const window: any;

interface ContainerProps { }

const VerifyContainer: React.FC<ContainerProps> = () => {

  const [network, setNetwork] = useState("");
  const [currentHash, setCurrentHash] = useState(localStorage.getItem("bridgeTransaction"));
  const [splitHash, setSplitHash] = useState("");

  const generateUrl = () => {
    let temp: any = currentHash?.split(":");
    if (temp[0] === 'ethereum'){
      setNetwork("1");
      setSplitHash(temp[1]);
    } else {
      setNetwork("100");
      setSplitHash(temp[0])
    }
  }

  const viewTransaction = () => {
    window.open(`https://alm-xdai.herokuapp.com/${network}/${splitHash}`);
  }

  const clear = () => {
    localStorage.setItem('bridgeTransaction', "");
  }

  useEffect(() => {
    if (currentHash) {
      generateUrl();
    }
  }, []);

  return (
    <>
      <div className="container">
        <strong>Check Bridge Transfer Status</strong>
        {currentHash &&
          <>
          <p className="tx">Transaction Id: {splitHash}</p>
          <IonButton color="danger" size="small" onClick={viewTransaction}>Execute On ABM Live Monitoring Tool</IonButton>
          <a href="https://docs.tokenbridge.net/about-tokenbridge/components/amb-live-monitoring-application" target="_blank">See TokenBridge Docs</a>
          </>
        }
        <br />
          <IonButton color="danger" size="small" onClick={clear}>CLEAR</IonButton>
      </div>
    </>
  );
};

export default VerifyContainer;