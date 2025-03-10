import * as ContractsABI from "./ContractsABI"
export function getContracts(){
    return Object.entries(ContractsABI)
}