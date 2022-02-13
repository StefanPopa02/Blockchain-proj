import React, { useContext, useState } from "react";
import { Button, Input, Divider } from "antd";
import { useEffect } from "react/cjs/react.development";
import {
  getFinantatorsFundingEvidenceForTaskWeb3,
  getSelectedAccWeb3,
} from "../../../../web3/Web3Client";
import { GlobalContext } from "../../../../context/MyContext";

export default function FinantatorActions({
  setFunding,
  goalReached,
  withdraw,
  selectedTask,
  ...rest
}) {
  const [myLedger, setMyLedger] = useState({
    finantatorAddr: "",
    fundingAmount: 0,
  });

  useEffect(() => {
    const getFinantatorsLedger = () => {
      getFinantatorsFundingEvidenceForTaskWeb3(selectedTask.taskIndex).then(
        (finantatorsLedger) => {
          getSelectedAccWeb3().then((selectedAcc) => {
            const result = finantatorsLedger.filter(
              (finantator) =>
                finantator.finantatorAddr.toUpperCase() ===
                selectedAcc.toUpperCase()
            );
            if (result.length > 0) {
              console.log(result);
              let fundingtotal = 0;
              result.forEach((res) => {
                fundingtotal += parseInt(res.fundingAmount);
              });
              setMyLedger({
                finantatorAddr: result[0].finantatorAddr,
                fundingAmount: fundingtotal,
              });
            }
          });
        }
      );
    };
    getFinantatorsLedger();
  }, [selectedTask, myLedger.fundingAmount]);

  const [financing, setFinancing] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Finantator Actions</h1>
      <h2>{`Your funding: ${myLedger.fundingAmount}`}</h2>
      {goalReached ? (
        <h2>Task has been funded!</h2>
      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ flex: 1, paddingRight: 80 }}>
            <h2>Finance amount</h2>
            <Input onChange={(e) => setFinancing(e.target.value)} />
            <Button
              type="primary"
              style={{ marginTop: 4 }}
              onClick={() => {
                setFunding(financing);
              }}
            >
              Finance task
            </Button>
          </div>
          <Divider type="vertical" />
          <div style={{ flex: 1, paddingRight: 80 }}>
            <h2>Withdraw amount</h2>
            <Input onChange={(e) => setWithdrawAmount(e.target.value)} />
            <Button
              type="primary"
              danger
              style={{ marginTop: 4 }}
              onClick={() => {
                withdraw(withdrawAmount);
              }}
            >
              Withdraw
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
