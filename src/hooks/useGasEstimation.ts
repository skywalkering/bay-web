import { useState } from "react";
import { useNetwork, usePublicClient } from "wagmi";
import {
  Address,
  PublicClient,
  parseAbi,
  parseUnits,
  createPublicClient,
  http,
} from "viem";
import {
  getAddLiqFunctionName,
  getChefAbi,
  getRouterAbi,
} from "@utils/abis/contract-helper-methods";
import { FarmType } from "@utils/types";
import { mainnet, moonbeam, moonriver } from "viem/chains";

const estimateGas = async (
  publicClient: PublicClient,
  address: Address,
  contractType: number, // 0: chef, 1: router, 2: lp
  functionType: number, // 0: addliq, 1: removeliq, 2: stake, 3: unstake, 4: claimrewards
  functionName: string,
  farm: FarmType,
  account: Address,
  args: Array<any>
) => {
  console.log(
    "egparams",
    address,
    contractType,
    functionType,
    functionName,
    farm,
    account,
    args,
    contractType == 0
      ? parseAbi(getChefAbi(farm?.protocol!, farm?.chef))
      : parseAbi(
          getRouterAbi(
            farm?.protocol!,
            farm?.farmType == "StandardAmm" ? false : true
          )
        )
  );

  // if any arg is 0
  // if (args.some((a) => a == 0)) {
  //   console.log("arg0");
  //   return BigInt(0);
  // }

  const gasEstimate = await publicClient.estimateContractGas({
    address: address as any,
    abi:
      contractType == 0
        ? parseAbi(getChefAbi(farm?.protocol!, farm?.chef))
        : parseAbi(
            getRouterAbi(
              farm?.protocol!,
              farm?.farmType == "StandardAmm" ? false : true
            )
          ),
    functionName: functionName as any,
    args: args,
    account: account as any,
  });
  console.log("gasssss", gasEstimate);
  return gasEstimate;
  // return BigInt(0);
};

const getGasPrice = async (publicClient: PublicClient): Promise<bigint> => {
  const gasPrice = await publicClient.getGasPrice();
  return gasPrice;
};

const useGasEstimation = (
  address: Address,
  contractType: number, // 0: chef, 1: router, 2: lp
  functionType: number, // 0: addliq, 1: removeliq, 2: stake, 3: unstake, 4: claimrewards
  functionName: string,
  farm: FarmType,
  account: Address,
  args: Array<any>
) => {
  const { chain } = useNetwork();
  // const publicClient = usePublicClient({ chainId: 1284 });
  const publicClient = usePublicClient();
  // const publicClient = createPublicClient({
  //   chain: moonbeam,
  //   transport: http(),
  // });
  const [gasEstimateAmount, setGasEstimateAmount] = useState<number>(0);
  const [gasPrice, setGasPrice] = useState<number>(0);

  // if any arg is 0
  if (args.some((a) => a == 0)) {
    console.log("arg0");
    return {
      gasEstimate: 0,
    };
  } else {
    try {
      estimateGas(
        publicClient,
        address,
        contractType,
        functionType,
        functionName,
        farm,
        account,
        args
      ).then((res) => {
        setGasEstimateAmount(Number(res));
      });
    } catch (error) {
      setGasEstimateAmount(0);
      console.log("Error: Estimating Gas", error);
    }
    // const eg = estimateGas()

    try {
      getGasPrice(publicClient).then((res) => {
        setGasPrice(Number(res));
      });
    } catch (error) {
      setGasPrice(0);
      console.log("Error: Getting Gas Price", error);
    }

    console.log(
      "gasEstimateAmount",
      gasEstimateAmount,
      "gasPrice",
      gasPrice,
      "gas",
      (gasEstimateAmount * gasPrice) / 10 ** 18
    );

    return {
      gasEstimate: (gasEstimateAmount * gasPrice) / 10 ** 18,
    };
  }
};

export default useGasEstimation;
