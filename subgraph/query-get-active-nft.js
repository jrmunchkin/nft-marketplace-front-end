import { gql } from "@apollo/client";

const GET_ACTIVE_NFT = gql`
  {
    activeNfts(where: { buyer: "0x0000000000000000000000000000000000000000" }) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default GET_ACTIVE_NFT;
