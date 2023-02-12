import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Button } from "web3uikit";
import { formatUnits } from "@ethersproject/units";
import { truncateStr } from "../../utils/utils";
import { useEvmNFTMetadata } from "@moralisweb3/next";
import UpdateNFTModal from "../common/UpdateNFTModal";
import CancelNFTModal from "../common/CancelNFTModal";
import BuyNFTModal from "./BuyNFTModal";

export default function ListedNFTBox({
  chainId,
  nftMarketplaceAddress,
  tokenId,
  nftAddress,
  price,
  seller,
}) {
  const { isWeb3Enabled, account } = useMoralis();

  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [isOwnedByUser, setIsOwnedByUser] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };
  const [showCancelModal, setShowCancelModal] = useState(false);
  const hideCancelModal = () => {
    setShowCancelModal(false);
  };
  const [showBuyModal, setShowBuyModal] = useState(false);
  const hideBuyModal = () => {
    setShowBuyModal(false);
  };

  const { fetch: fetchNFT } = useEvmNFTMetadata();

  async function updateUI() {
    const nft = await fetchNFT({
      chain: chainId,
      address: nftAddress,
      tokenId: tokenId,
    });
    if (nft.tokenUri) {
      const tokenURIResponse = await (await fetch(nft.tokenUri)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      setIsOwnedByUser(seller === account || seller === undefined);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled, account, nftAddress, tokenId]);

  const handleBuyNFT = () => {
    updateUI();
    setShowBuyModal(true);
  };

  const handleUpdateNFT = () => {
    updateUI();
    setShowUpdateModal(true);
  };

  const handleCancelNFT = () => {
    updateUI();
    setShowCancelModal(true);
  };

  return (
    <div>
      <div>
        {imageURI ? (
          <div className="w-60">
            <UpdateNFTModal
              isVisible={showUpdateModal}
              tokenId={tokenId}
              nftAddress={nftAddress}
              marketplaceAddress={nftMarketplaceAddress}
              tokenName={tokenName}
              onClose={hideUpdateModal}
              key={`Listed${nftAddress}${tokenId}`}
            />
            <CancelNFTModal
              isVisible={showCancelModal}
              tokenId={tokenId}
              nftAddress={nftAddress}
              marketplaceAddress={nftMarketplaceAddress}
              tokenName={tokenName}
              onClose={hideCancelModal}
              key={`Listed${nftAddress}${tokenId}`}
            />
            <BuyNFTModal
              isVisible={showBuyModal}
              tokenId={tokenId}
              nftAddress={nftAddress}
              marketplaceAddress={nftMarketplaceAddress}
              tokenName={tokenName}
              price={price}
              onClose={hideBuyModal}
              key={`Listed${nftAddress}${tokenId}`}
            />

            <div className="flex items-center flex-col">
              <div className="inline-flex items-center gap-2">
                <Card title={tokenName} description={tokenDescription}>
                  <div className="p-2 h-72">
                    <div className="flex flex-col items-end gap-2">
                      <div>
                        <span className="text-left">
                          {Math.round(
                            (parseFloat(formatUnits(price, 18)) +
                              Number.EPSILON) *
                              1e5
                          ) /
                            1e5 +
                            " ETH"}
                        </span>
                        <span className="font-bold"> #{tokenId}</span>
                      </div>
                      <div className="italic text-sm">
                        Owned by{" "}
                        {isOwnedByUser ? "you" : truncateStr(seller || "", 15)}
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
              {!isOwnedByUser ? (
                <div className="p-2">
                  <Button
                    text="Buy"
                    size="regular"
                    theme="colored"
                    color="green"
                    onClick={handleBuyNFT}
                  />
                </div>
              ) : (
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
