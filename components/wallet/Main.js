import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { constants } from "ethers";
import { useEvmWalletNFTCollections } from "@moralisweb3/next";
import { Select } from "web3uikit";
import networkMapping from "../../constants/contractAddresses.json";
import WalletNFTCollection from "./WalletNFTCollection";
import ProceedsBox from "./ProceedsBox";

export default function Main() {
  const { account, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const nftMarketplaceAddress = chainId
    ? networkMapping[chainId]["NftMarketplace"][
        networkMapping[chainId]["NftMarketplace"].length - 1
      ]
    : constants.AddressZero;

  if (!isWeb3Enabled) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please connect your wallet!</h1>
      </div>
    );
  }

  if (!chainIdHex || !networkMapping[chainId]) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please use Goerli network!</h1>
      </div>
    );
  }

  function getCollections() {
    let data = [];
    nftCollections.map((collection) => {
      data.push({
        id: collection.tokenAddress,
        label: collection.name,
      });
    });
    return data;
  }

  const [collectionName, setCollectionName] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");

  const {
    data: nftCollections,
    error,
    fetch,
    isFetching,
  } = useEvmWalletNFTCollections({ address: account, chain: chainIdHex });

  useEffect(() => {
    if (isWeb3Enabled) {
      setCollectionName("");
      setCollectionAddress("");
      fetch();
    }
  }, [isWeb3Enabled, account]);

  return (
    <div>
      <div className="absolute top-36 right-16">
        <ProceedsBox
          nftMarketplaceAddress={nftMarketplaceAddress}
          key={`Wallet${nftMarketplaceAddress}`}
        />
      </div>
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">
          Choose one of your collection
        </h1>
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            {isFetching || !nftCollections ? (
              <div></div>
            ) : (
              <Select
                id="Select"
                onChange={(event) => {
                  setCollectionName(event.label);
                  setCollectionAddress(event.id);
                }}
                options={getCollections()}
                width="400px"
              />
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div>
          {collectionAddress == "" ? (
            <div className="flex p-4 items-center flex-col">
              Select a collection first...
            </div>
          ) : (
            <div>
              <h1 className="py-4 px-4 font-bold text-2xl">{collectionName}</h1>
              <div className="flex flex-wrap">
                <WalletNFTCollection
                  nftMarketplaceAddress={nftMarketplaceAddress}
                  account={account}
                  chainId={chainIdHex}
                  tokenAddress={collectionAddress}
                  key={`Wallet${collectionAddress}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
