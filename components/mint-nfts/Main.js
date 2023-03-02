import { useMoralis } from "react-moralis";
import { useState } from "react";
import { Select } from "web3uikit";
import networkMapping from "../../constants/contractAddresses.json";
import mintableCollections from "../../constants/mintableCollections.json";
import MintBox from "./MintBox";

export default function Main() {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  let abiForId = [];

  if (!isWeb3Enabled) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please connect your wallet!</h1>
      </div>
    );
  }

  if (!chainId || !networkMapping[chainId]) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please use Goerli network!</h1>
      </div>
    );
  }

  function getCollections() {
    let data = [];
    mintableCollections.map((collection) => {
      import("../../constants/" + collection.abi + ".json").then((res) => {
        abiForId[collection.address] = res.default;
        data.push({
          id: collection.address,
          label: collection.name,
        });
      });
    });
    return data;
  }

  const [collectionName, setCollectionName] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [collectionAbi, setCollectionAbi] = useState("");

  return (
    <div>
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Choose one collection</h1>
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            <Select
              id="Select"
              onChange={(event) => {
                setCollectionName(event.label);
                setCollectionAddress(event.id);
                setCollectionAbi(abiForId[event.id]);
              }}
              options={getCollections()}
              width="320px"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div>
          {collectionAddress != "" ? (
            <MintBox
              tokenName={collectionName}
              tokenAddress={collectionAddress}
              tokenAbi={collectionAbi}
              key={`${collectionAddress}`}
            />
          ) : (
            <div className="flex p-4 items-center flex-col">
              Select a collection first...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
