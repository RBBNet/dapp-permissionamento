import ContractChainABI from "./abis/ContractChainABI";
import AccountRulesV2Impl from "./abis/AccountRulesV2Impl.json";
export const AccountRules = new ContractChainABI(import.meta.env.VITE_ACCOUNT_CONTRACT_ADDRESS, AccountRulesV2Impl.abi, AccountRulesV2Impl);
import NodesRulesV2Impl from "./abis/NodeRulesV2Impl.json";
export const Nodes        = new ContractChainABI(import.meta.env.VITE_NODES_CONTRACT_ADDRESS, NodesRulesV2Impl.abi, NodesRulesV2Impl);
import OrganizationImpl from "./abis/OrganizationImpl.json"
export const Organization = new ContractChainABI(import.meta.env.VITE_ORGANIZATION_CONTRACT_ADDRESS, OrganizationImpl.abi, OrganizationImpl);
import AccountIngressImpl from "./abis/AccountIngress.json"
export const AccountIngress = new ContractChainABI(import.meta.env.VITE_ORGANIZATION_CONTRACT_ADDRESS, AccountIngressImpl.abi, AccountIngressImpl);