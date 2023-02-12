import { gql } from "@apollo/client";

const GET_ACTIVE_NFT_BY_ID = gql`
  query ($tokenId: BigInt!, $nftAddress: Bytes!) {
    activeNfts(
      first: 1
      where: {
        buyer: "0x0000000000000000000000000000000000000000"
        tokenId: $tokenId
        nftAddress: $nftAddress
      }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default GET_ACTIVE_NFT_BY_ID;
