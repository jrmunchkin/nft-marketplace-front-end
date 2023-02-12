import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import nftMarketplace from "../../constants/nftMarketplace.json";

export default function UpdateNFTModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  tokenName,
  onClose,
}) {
  const dispatch = useNotification();

  const [priceToUpdate, setPriceToUpdate] = useState(0);

  const {
    runContractFunction: updateNFT,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "updateNftListing",
    params: {
      _nftAddress: nftAddress,
      _tokenId: tokenId,
      _newPrice: ethers.utils.parseEther(priceToUpdate || "0"),
    },
  });

  const handleUpdateNFTSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT updated",
      title: "Your NFT price has been updated!",
      position: "topR",
    });
    onClose && onClose();
    setPriceToUpdate("0");
  };

  const handleUpdateNFTError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure your price is above 0?";
    dispatch({
      type: "error",
      message: message,
      title: "Error updating NFT!",
      position: "topR",
    });
  };

  return (
    <Modal
      headerHasBottomBorder
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      isOkDisabled={isLoading || isFetching}
      isCancelDisabled={isLoading || isFetching}
      okText="Update NFT"
      title={"Give a new price (ETH) for your " + tokenName}
      onOk={() => {
        updateNFT({
          onError: handleUpdateNFTError,
          onSuccess: handleUpdateNFTSuccess,
        });
      }}
    >
      <div className="flex item-center p-4 flex-col">
        <Input
          label="Price in ETH"
          name="Updating price"
          type="number"
          onChange={(event) => {
            setPriceToUpdate(event.target.value);
          }}
        ></Input>
      </div>
    </Modal>
  );
}
