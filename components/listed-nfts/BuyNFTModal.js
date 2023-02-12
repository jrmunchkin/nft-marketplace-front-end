import { Modal, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { useBetween } from "use-between";
import { useMarketplace } from "../../hooks/useMarketplace";
import nftMarketplace from "../../constants/NftMarketplace.json";

export default function BuyNFTModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  tokenName,
  price,
  onClose,
}) {
  const dispatch = useNotification();

  const { setIsNFTListed } = useBetween(useMarketplace);

  const {
    runContractFunction: buyNFT,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "buyNft",
    params: {
      _nftAddress: nftAddress,
      _tokenId: tokenId,
    },
    msgValue: price,
  });

  const handleBuyNFTSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT Bought",
      title: "You just buy a new NFT!",
      position: "topR",
    });
    onClose && onClose();
    setIsNFTListed(true);
  };

  const handleBuyNFTError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure to have enough funds";
    dispatch({
      type: "error",
      message: message,
      title: "Error buying NFT!",
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
      okText="Buy NFT"
      title={"Buy " + tokenName + " from the marketplace?"}
      onOk={() => {
        buyNFT({
          onError: handleBuyNFTError,
          onSuccess: handleBuyNFTSuccess,
        });
      }}
    >
      <div className="flex item-center p-4 flex-col">
        {"Are you sure you want to buy " + tokenName + " from the marketplace?"}
      </div>
    </Modal>
  );
}
