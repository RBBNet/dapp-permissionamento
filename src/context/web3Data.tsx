import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { web3Factory } from "@/chain/factory/Web3Factory";

type Props = {
  children: ReactNode
}

type ContextType =
  {
    Web3: Web3 | undefined;
    setWeb3: React.Dispatch<React.SetStateAction<Web3 | undefined>>;
  }

const Web3Context = createContext<ContextType | undefined>(undefined);

export const Web3Provider: React.FC<Props> = props => {
    const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
 

    useEffect(()=>{
        web3Factory().then(provider =>{
            setWeb3(provider)
        })
    }, [])

    const value = useMemo(
        () => ({
          Web3:web3,
          setWeb3,
        }),
        [
          web3,
          setWeb3
        ]
    );
    return <Web3Context.Provider value={value} {...props} />;
}

export const useWeb3 = () => {
    const context = useContext(Web3Context);

    if (!context) {
      throw new Error('useNetwork must be used within a DataProvider.');
    }

    const { Web3 } = context;

    return {
      Web3
    };
  };
  