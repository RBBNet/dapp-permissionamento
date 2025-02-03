

export type Config = {
  accountIngressAddress: string;
  nodeIngressAddress: string;
  networkId: string;
  organizationAddress:string;
  accountRulesAddress:string;
  nodeRulesAddress:string;
};

const loadConfig = async (): Promise<Config> => {

    let accountIngressAddress = import.meta.env.VITE_ACCOUNT_INGRESS_CONTRACT_ADDRESS;
    let nodeIngressAddress = import.meta.env.VITE_NODE_INGRESS_CONTRACT_ADDRESS;
    let networkId = import.meta.env.VITE_CHAIN_ID;
    let organizationAddress = import.meta.env.VITE_ORGANIZATION_CONTRACT_ADDRESS
    let accountRulesAddress = import.meta.env.VITE_ACCOUNT_CONTRACT_ADDRESS
    let nodeRulesAddress = import.meta.env.VITE_NODES_CONTRACT_ADDRESS
    if(!accountIngressAddress || !nodeIngressAddress || !networkId){
        throw new DOMException("")
    }

    return { accountIngressAddress, nodeIngressAddress, networkId, organizationAddress, accountRulesAddress, nodeRulesAddress };

};

export const configPromise = loadConfig();
