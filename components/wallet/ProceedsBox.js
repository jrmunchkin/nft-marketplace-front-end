import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Button, useNotification } from "web3uikit";
import { Reload } from "@web3uikit/icons";
import nftMarketplace from "../../constants/NftMarketplace.json";

export default function ProceedsBox({ nftMarketplaceAddress }) {
  const { isWeb3Enabled, account } = useMoralis();
  const [proceeds, setProceeds] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: withdrawProceeds,
    isLoading: isLoading,
    isFetching: isFetching,
  } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: nftMarketplaceAddress,
    functionName: "withdrawProceeds",
  });

  const { runContractFunction: getProceeds } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: nftMarketplaceAddress,
    functionName: "getProceeds",
    params: {
      _seller: account,
    },
  });

  async function updateUI() {
    const proceedsFromCall = (await getProceeds()).toString();
    const formattedProceedsBalance = proceedsFromCall
      ? Math.round(
          (parseFloat(formatUnits(proceedsFromCall, 18)) + Number.EPSILON) * 1e5
        ) / 1e5
      : 0;
    setProceeds(formattedProceedsBalance);
  }

  const handleWithdrawProceedsSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your proceeds have been withdrawed!",
      title: "Proceeds withdrawed!",
      position: "topR",
    });
    updateUI();
  };

  const handleWithdrawProceedsError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure you have proceeds to withdraw?";
    dispatch({
      type: "error",
      message: message,
      title: "Error withdrawing proceeds!",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  return (
    <div className="flex items-center flex-col">
      <div className="box-border rounded-lg border-2 bg-white">
        <div className="flex items-end flex-col">
          <Button
            icon={<Reload fontSize="30px" />}
            iconLayout="icon-only"
            theme="outline"
            onClick={async function () {
              await updateUI();
            }}
          />
        </div>
        <div className="flex items-center p-2 flex-col">
          <div className="inline-flex items-center gap-2">
            <div className="font-bold text-lg">
              {"Proceeds : " + proceeds + " ETH"}
            </div>
          </div>
          <div className="p-2">
            <Button
              text="Withdraw Proceeds!"
              size="small"
              theme="colored"
              color="green"
              onClick={async function () {
                await withdrawProceeds({
                  onError: handleWithdrawProceedsError,
                  onSuccess: handleWithdrawProceedsSuccess,
                });
              }}
              disabled={isLoading || isFetching}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
