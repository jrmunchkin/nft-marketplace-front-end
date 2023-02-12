import { gql } from "@apollo/client";

const GET_ACTIVE_NFT_BY_ADDRESS = gql`
  query ($nftAddress: Bytes!) {
    activeNfts(
      where: {
        buyer: "0x0000000000000000000000000000000000000000"
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

export default GET_ACTIVE_NFT_BY_ADDRESS;
