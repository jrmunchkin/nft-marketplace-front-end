import { Modal, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { useBetween } from "use-between";
import { useMarketplace } from "../../hooks/useMarketplace";
import nftMarketplace from "../../constants/nftMarketplace.json";

export default function CancelNFTModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  tokenName,
  onClose,
}) {
  const dispatch = useNotification();

  const { setIsNFTListed } = useBetween(useMarketplace);

  const {
    runContractFunction: cancelNFT,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "cancelNftListing",
    params: {
      _nftAddress: nftAddress,
      _tokenId: tokenId,
    },
  });

  const handleCancelNFTSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT canceled",
      title: "Your NFT has been removed from the marketplace!",
      position: "topR",
    });
    onClose && onClose();
    setIsNFTListed(true);
  };

  const handleCancelNFTError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Someting went wrong?";
    dispatch({
      type: "error",
      message: message,
      title: "Error canceling NFT!",
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
      okText="Remove NFT"
      title={"Remove " + tokenName + " from the marketplace?"}
      onOk={() => {
        cancelNFT({
          onError: handleCancelNFTError,
          onSuccess: handleCancelNFTSuccess,
        });
      }}
    >
      <div className="flex item-center p-4 flex-col">
        {"Are you sure you want to remove " +
          tokenName +
          " from the marketplace?"}
      </div>
    </Modal>
  );
}
