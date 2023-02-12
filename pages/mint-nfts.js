import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/mint-nfts/Main";

export default function Home() {
  return (
    <div className="py-0 p-8">
      <Head>
        <title>Mint NFTs</title>
        <meta name="description" content="Mint NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
    </div>
  );
}
