import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/40390/nft-marketplace/v0.0.1",
});

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ApolloProvider>
    </MoralisProvider>
  );
}

export default MyApp;
