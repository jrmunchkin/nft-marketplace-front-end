import { useState } from "react";

export const useMarketplace = () => {
  const [isNFTListed, setIsNFTListed] = useState(false);
  const [isNFTBought, setIsNFTBought] = useState(false);

  return {
    isNFTListed,
    setIsNFTListed,
    isNFTBought,
    setIsNFTBought,
  };
};
