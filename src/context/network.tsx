import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { NodeIngress } from "../chain/@types";
import { AccountIngress } from "../chain/@types/AccountIngress";
import { useConfig } from '../context/configData';
import { providerFactory } from "../chain/provider";
import { accountIngressFactory } from "../chain/factory/AccountIngress";
import { nodeIngressFactory } from "../chain/factory/NodeIngress";
import { Signer } from "ethers";

type Props = {
  children: ReactNode
}

type ContextType =
  | {
      networkId?: number;
      setNetworkId: React.Dispatch<React.SetStateAction<number | undefined>>;
      signer: Signer | undefined;
      setSigner: React.Dispatch<React.SetStateAction<Signer | undefined>>
      contracts: {
        accountIngressContract?: AccountIngress;
        setAccountIngressContract: React.Dispatch<React.SetStateAction<AccountIngress | undefined>>;
        nodeIngressContract?: NodeIngress;
        setNodeIngressContract: React.Dispatch<React.SetStateAction<NodeIngress | undefined>>;
      };
    }
  | undefined;

const NetworkContext = createContext<ContextType>(undefined);

export const NetworkProvider: React.FC<Props> = props => {
    const [accountIngressContract, setAccountIngressContract] = useState<AccountIngress | undefined>(undefined);
    const [nodeIngressContract, setNodeIngressContract] = useState<NodeIngress | undefined>(undefined);
    const [networkId, setNetworkId] = useState<number | undefined>(undefined);
    const [signer, setSigner] = useState<Signer | undefined>(undefined);
 
    
    const config = useConfig();

    useEffect(()=>{
        providerFactory().then(provider =>{
            accountIngressFactory(config, provider)
                .then(accountIngress => setAccountIngressContract(accountIngress))
            nodeIngressFactory(config, provider)
                .then(nodeingress =>setNodeIngressContract(nodeingress))
            setSigner(provider)
        })
    })

    const value = useMemo(
        () => ({
          networkId,
          setNetworkId,
          signer,
          setSigner,
          contracts: {
            accountIngressContract,
            setAccountIngressContract,
            nodeIngressContract,
            setNodeIngressContract,
          }
        }),
        [
          accountIngressContract,
          setAccountIngressContract,
          nodeIngressContract,
          setNodeIngressContract,
          networkId,
          setNetworkId
        ]
    );
    return <NetworkContext.Provider value={value} {...props} />;
}

export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (!context) {
      throw new Error('useNetwork must be used within a DataProvider.');
    }
  
    const config = useConfig();
  
    const { contracts, signer, networkId, setNetworkId } = context;
  
    useEffect(() => {
      const ingress = contracts.accountIngressContract || contracts.nodeIngressContract;
      if (ingress === undefined) {
        setNetworkId(undefined);
      } else {
        // ingress.provider.getNetwork().then(network => setNetworkId(network.chainId));
      }
    }, [contracts.accountIngressContract, contracts.nodeIngressContract, setNetworkId]);
  
    const isCorrectNetwork = useMemo(() => {
      if (networkId === undefined) {
        return undefined;
      } else {
        return config.networkId === 'any' || networkId.toString() === config.networkId;
      }
    }, [networkId, config.networkId]);
  
    return {
      isCorrectNetwork,
      networkId,
      accountIngressContract: contracts.accountIngressContract,
      nodeIngressContract: contracts.nodeIngressContract,
      signer: signer
    };
  };
  