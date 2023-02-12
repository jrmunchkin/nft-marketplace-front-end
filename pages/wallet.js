import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/wallet/Main";

export default function Home() {
  return (
    <div className="py-0 p-8">
      <Head>
        <title>Wallet</title>
        <meta name="description" content="Wallet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
    </div>
  );
}
