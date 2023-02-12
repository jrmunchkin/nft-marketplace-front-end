import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { constants } from "ethers";
import { useQuery } from "@apollo/client";
import { Select } from "web3uikit";
import { useBetween } from "use-between";
import { useMarketplace } from "../../hooks/useMarketplace";
import networkMapping from "../../constants/contractAddresses.json";
import GET_ACTIVE_NFT from "../../subgraph/query-get-active-nft";
import ListedNFTBox from "./ListedNFTBox";
import ListedNFTCollection from "./ListedNFTCollection";

export default function Main() {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
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

  if (!chainId || !networkMapping[chainId]) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please use Goerli network!</h1>
      </div>
    );
  }

  const {
    loading: fetchingListedNfts,
    error,
    refetch,
    data: listedNfts,
  } = useQuery(GET_ACTIVE_NFT);

  function getCollections() {
    let data = [
      {
        id: "none",
        label: "Recently listed",
      },
    ];
    listedNfts.activeNfts.map(async (nft) => {
      let obj = data.find((el) => el.id == nft.nftAddress);
      if (!obj) {
        data.push({
          id: nft.nftAddress,
          label: nft.nftAddress,
        });
      }
    });
    return data;
  }

  const { setIsNFTListed, isNFTListed } = useBetween(useMarketplace);
  const [collectionName, setCollectionName] = useState("Recently listed");
  const [collectionAddress, setCollectionAddress] = useState("none");

  useEffect(() => {
    if (isNFTListed) {
      refetch();
      setIsNFTListed(false);
    }
  }, [isNFTListed]);

  return (
    <div>
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Choose one collection</h1>
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            {fetchingListedNfts || !listedNfts ? (
              <div>Loading...</div>
            ) : (
              <Select
                id="Select"
                defaultOptionIndex={0}
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
          {collectionAddress == "none" ? (
            <div>
              <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
              <div className="flex flex-wrap">
                <div className="grid p-4 gap-4 grid-cols-6">
                  {fetchingListedNfts || !listedNfts ? (
                    <div></div>
                  ) : (
                    listedNfts.activeNfts.map((nft) => {
                      const { price, nftAddress, tokenId, seller } = nft;
                      return (
                        <div>
                          <ListedNFTBox
                            chainId={chainIdHex}
                            price={price}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            nftMarketplaceAddress={nftMarketplaceAddress}
                            seller={seller}
                            key={`RecentlyListed${nftAddress}${tokenId}`}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="py-4 px-4 font-bold text-2xl">{collectionName}</h1>
              <div className="flex flex-wrap">
                <ListedNFTCollection
                  nftMarketplaceAddress={nftMarketplaceAddress}
                  chainId={chainIdHex}
                  tokenAddress={collectionAddress}
                  key={`Listed${collectionAddress}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
