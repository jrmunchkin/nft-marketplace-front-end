import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl text-white">
        NFT Marketplace
      </h1>
      <div className="flex flex-row items-center">
        <Link className="mr-4 p-6 text-white" href="/">
          Recently listed NFTs
        </Link>
        <Link className="mr-4 p-6 text-white" href="/wallet">
          Your Wallet
        </Link>
        <Link className="mr-4 p-6 text-white" href="/mint-nfts">
          Mint NFTs
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
