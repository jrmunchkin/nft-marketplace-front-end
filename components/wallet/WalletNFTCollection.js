import { useEvmWalletNFTs } from "@moralisweb3/next";
import WalletNFTBox from "./WalletNFTBox";

export default function WalletNFTCollection({
  nftMarketplaceAddress,
  account,
  chainId,
  tokenAddress,
}) {
  const {
    data: nfts,
    error,
    fetch,
    isFetching,
  } = useEvmWalletNFTs({
    address: account,
    chain: chainId,
    tokenAddresses: [tokenAddress],
  });

  return (
    <div className="grid p-4 gap-4 grid-cols-6">
      {isFetching || !nfts ? (
        <div></div>
      ) : (
        nfts.map((nft) => {
          return (
            <WalletNFTBox
              nftMarketplaceAddress={nftMarketplaceAddress}
              tokenId={nft.tokenId}
              tokenURI={nft.tokenUri}
              nftAddress={tokenAddress}
              key={`Wallet${tokenAddress}${nft.tokenId}`}
            />
          );
        })
      )}
    </div>
  );
}
