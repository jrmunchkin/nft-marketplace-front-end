import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import { useBetween } from "use-between";
import { useMarketplace } from "../../hooks/useMarketplace";
import nftMarketplace from "../../constants/nftMarketplace.json";
import erc721Abi from "../../constants/erc721.json";

export default function ListNFTModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  tokenName,
  onClose,
}) {
  const dispatch = useNotification();

  const { setIsNFTListed } = useBetween(useMarketplace);
  const [priceToList, setPriceToList] = useState(0);

  const { runContractFunction: approve } = useWeb3Contract({
    abi: erc721Abi,
    contractAddress: nftAddress,
    functionName: "approve",
    params: {
      to: marketplaceAddress,
      tokenId: tokenId,
    },
  });

  const {
    runContractFunction: listNFT,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "listNft",
    params: {
      _nftAddress: nftAddress,
      _tokenId: tokenId,
      _price: ethers.utils.parseEther(priceToList || "0"),
    },
  });

  const handleApproveToken = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your NFT has been approved, it will now be listed!",
      title: "NFT approved!",
      position: "topR",
    });
    await listNFT({
      onError: handleListNFTError,
      onSuccess: handleListNFTSuccess,
    });
  };

  const handleListNFTSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT listed",
      title: "Your NFT has been listed on the Marketplace!",
      position: "topR",
    });
    onClose && onClose();
    setPriceToList("0");
    setIsNFTListed(true);
  };

  const handleListNFTError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure your price is above 0?";
    dispatch({
      type: "error",
      message: message,
      title: "Error listing NFT!",
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
      okText="List NFT"
      title={
        "Set a price (ETH) to list your " + tokenName + " on the Marketplace"
      }
      onOk={() => {
        approve({
          onError: (error) => {
            console.log(error);
          },
          onSuccess: handleApproveToken,
        });
      }}
    >
      <div className="flex item-center p-4 flex-col">
        <Input
          label="Price in ETH"
          name="Listing price"
          type="number"
          onChange={(event) => {
            setPriceToList(event.target.value);
          }}
        ></Input>
      </div>
    </Modal>
  );
}
