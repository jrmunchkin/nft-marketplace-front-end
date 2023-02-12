import { useWeb3Contract, useMoralis } from "react-moralis";
import { formatUnits } from "@ethersproject/units";
import { useEffect, useState } from "react";
import { Button, useNotification } from "web3uikit";

export default function MintBox({ tokenAddress, tokenName, tokenAbi }) {
  const { account, isWeb3Enabled } = useMoralis();

  const [nbFreeNFT, setNbFreeNFT] = useState(0);
  const [mintFee, setMintFee] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: mintNFT,
    isLoading: isLoadingMint,
    isFetching: isFetchingMint,
  } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: tokenAddress,
    functionName: "mintNft",
    msgValue: mintFee,
  });

  const {
    runContractFunction: mintFreeNFT,
    isLoading: isLoadingMintFree,
    isFetching: isFetchingMintFree,
  } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: tokenAddress,
    functionName: "mintFreeNft",
  });

  const { runContractFunction: getMintFee } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: tokenAddress,
    functionName: "getMintFee",
  });

  const { runContractFunction: getNbUserFreeNFT } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: tokenAddress,
    functionName: "getNbUserFreeNft",
    params: {
      _user: account,
    },
  });

  const handleMintNFTSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT minted",
      title: "Your NFT will soon be available in your wallet!",
      position: "topR",
    });
    updateUI();
  };

  const handleMintNFTError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure you give enough ETH?";
    dispatch({
      type: "error",
      message: message,
      title: "Error minting NFT!",
      position: "topR",
    });
  };

  async function updateUI() {
    const mintFeeFromCall = (await getMintFee()).toString();
    setMintFee(mintFeeFromCall);
    const nbFreeNFTFromCall = (await getNbUserFreeNFT()).toNumber();
    setNbFreeNFT(nbFreeNFTFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled, account, tokenAddress]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4"> {tokenName} </h1>
      <div className="box-border rounded-lg border-2 bg-white">
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            {nbFreeNFT < 3 ? (
              <div className="font-bold text-xl">
                {"You have " + (3 - nbFreeNFT) + " free NFT to mint!"}
              </div>
            ) : (
              <div className="font-bold text-xl">
                {"Mint Fee : " + formatUnits(mintFee, 18) + " ETH"}
              </div>
            )}
          </div>
          <div className="p-4">
            <Button
              text={nbFreeNFT < 3 ? "Mint Free NFT!" : "Mint NFT!"}
              size="xl"
              theme="colored"
              color="green"
              onClick={async function () {
                if (nbFreeNFT < 3) {
                  await mintFreeNFT({
                    onError: handleMintNFTError,
                    onSuccess: handleMintNFTSuccess,
                  });
                } else {
                  await mintNFT({
                    onError: handleMintNFTError,
                    onSuccess: handleMintNFTSuccess,
                  });
                }
              }}
              disabled={
                isLoadingMintFree ||
                isFetchingMintFree ||
                isLoadingMint ||
                isFetchingMint
              }
              isLoading={
                isLoadingMintFree ||
                isFetchingMintFree ||
                isLoadingMint ||
                isFetchingMint
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
