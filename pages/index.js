import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/listed-nfts/Main";

export default function Home() {
  return (
    <div className="py-0 p-8">
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
    </div>
  );
}
