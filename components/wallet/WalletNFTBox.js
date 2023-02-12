import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Button } from "web3uikit";
import { formatUnits } from "@ethersproject/units";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_NFT_BY_ID from "../../subgraph/query-get-active-nft-by-id";
import ListNFTModal from "./ListNFTModal";
import UpdateNFTModal from "../common/UpdateNFTModal";
import CancelNFTModal from "../common/CancelNFTModal";

export default function WalletNFTBox({
  nftMarketplaceAddress,
  tokenId,
  tokenURI,
  nftAddress,
}) {
  const { isWeb3Enabled } = useMoralis();

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const hideListeModal = () => {
    refetch();
    updateUI();
    setShowListModal(false);
  };
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const hideUpdateModal = () => {
    refetch();
    updateUI();
    setShowUpdateModal(false);
  };
  const [showCancelModal, setShowCancelModal] = useState(false);
  const hideCancelModal = () => {
    refetch();
    updateUI();
    setShowCancelModal(false);
  };

  const {
    loading: fetchingNft,
    error,
    refetch,
    data: nft,
  } = useQuery(GET_ACTIVE_NFT_BY_ID, {
    variables: {
      tokenId: tokenId,
      nftAddress: nftAddress._value,
    },
  });

  async function updateUI() {
    if (tokenURI) {
      const tokenURIResponse = await (await fetch(tokenURI)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled]);

  const handleListNFT = () => {
    setShowListModal(true);
  };

  const handleUpdateNFT = () => {
    setShowUpdateModal(true);
  };

  const handleCancelNFT = () => {
    setShowCancelModal(true);
  };

  return (
    <div>
      <div>
        {imageURI ? (
          <div className="w-60">
            <ListNFTModal
              isVisible={showListModal}
              tokenId={tokenId}
              nftAddress={nftAddress._value}
              marketplaceAddress={nftMarketplaceAddress}
              tokenName={tokenName}
              onClose={hideListeModal}
              key={`Wallet${nftAddress._value}${tokenId}`}
            />
            <UpdateNFTModal
              isVisible={showUpdateModal}
              tokenId={tokenId}
              nftAddress={nftAddress._value}
              marketplaceAddress={nftMarketplaceAddress}
              tokenName={tokenName}
              onClose={hideUpdateModal}
              key={`Wallet${nftAddress._value}${tokenId}`}
            />
            <CancelNFTModal
              isVisible={showCancelModal}
              tokenId={tokenId}
              nftAddress={nftAddress._value}
              marketplaceAddress={nftMarketplaceAddress}
              tokenName={tokenName}
              onClose={hideCancelModal}
              key={`Wallet${nftAddress._value}${tokenId}`}
            />

            <div className="flex items-center flex-col">
              <div className="inline-flex items-center gap-2">
                <Card
                  title={tokenName}
                  description={tokenDescription}
                  isSelected={
                    fetchingNft || !nft || nft.activeNfts.length == 0
                      ? false
                      : true
                  }
                >
                  <div className="p-2 h-72">
                    <div className="flex flex-col items-end gap-2">
                      <div>
                        <span className="text-left">
                          {!fetchingNft && nft && nft.activeNfts.length > 0
                            ? Math.round(
                                (parseFloat(
                                  formatUnits(nft.activeNfts[0].price, 18)
                                ) +
                                  Number.EPSILON) *
                                  1e5
                              ) /
                                1e5 +
                              " ETH"
                            : ""}
                        </span>
                        <span className="font-bold"> #{tokenId}</span>
                      </div>
                      <Image
                        loader={() => imageURI}
                        src={imageURI}
                        height="200"
                        width="200"
                      />
                    </div>
                  </div>
                </Card>
              </div>
              {!fetchingNft && nft && nft.activeNfts.length == 0 ? (
                <div className="p-2">
                  <Button
                    text="List"
                    size="regular"
                    theme="colored"
                    color="blue"
                    onClick={handleListNFT}
                  />
                </div>
              ) : !fetchingNft && nft && nft.activeNfts.length > 0 ? (
                <div className="p-2 gap-2 grid grid-cols-2 grid-rows-1">
                  <Button
                    text="Update"
                    size="regular"
                    theme="colored"
                    color="yellow"
                    onClick={handleUpdateNFT}
                  />

                  <Button
                    text="Cancel"
                    size="regular"
                    theme="colored"
                    color="red"
                    onClick={handleCancelNFT}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
