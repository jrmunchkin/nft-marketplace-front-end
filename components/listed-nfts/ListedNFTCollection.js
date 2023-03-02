import { useQuery } from "@apollo/client";
import GET_ACTIVE_NFT_BY_ADDRESS from "../../subgraph/query-get-active-nft-by-address";
import ListedNFTBox from "./ListedNFTBox";

export default function ListedNFTCollection({
  nftMarketplaceAddress,
  tokenAddress,
  chainId,
}) {
  const {
    loading: fetchingNfts,
    error,
    refetch,
    data: nfts,
  } = useQuery(GET_ACTIVE_NFT_BY_ADDRESS, {
    variables: {
      nftAddress: tokenAddress,
    },
  });

  return (
    <div className="grid p-4 gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {fetchingNfts || !nfts ? (
        <div></div>
      ) : (
        nfts.activeNfts.map((nft) => {
          return (
            <ListedNFTBox
              chainId={chainId}
              nftMarketplaceAddress={nftMarketplaceAddress}
              tokenId={nft.tokenId}
              nftAddress={tokenAddress}
              price={nft.price}
              seller={nft.seller}
              key={`Listed${tokenAddress}${nft.tokenId}`}
            />
          );
        })
      )}
    </div>
  );
}
