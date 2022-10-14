const switchPolygonRequest = () => {
  return window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x89" }],
  });
};

const addPolygonChainRequest = () => {
  return window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
        blockExplorerUrls: ["https://explorer.matic.network/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
      },
    ],
  });
};

export const switchPolygonNetwork = async () => {
  if (window.ethereum) {
    try {
      await switchPolygonRequest();
    } catch (error) {
      if (error.code === 4902) {
        try {
          await addPolygonChainRequest();
          await switchPolygonRequest();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};
