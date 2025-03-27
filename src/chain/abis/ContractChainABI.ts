import * as ContractsABI from "../ContractsABI";
import { ExtendedAbiItem } from '../@types/component/ExtendedAbiItem';


export default class ContractChainABI{
    address: string;
    abi: ExtendedAbiItem[];
    name: string;

    constructor(address: string, abi: any, jsonabi: any){
        this.address = address;
        this.abi = abi as ExtendedAbiItem[];
        // this.abi[0].inputs
        console.log("Adicionando contrato "+ jsonabi.contractName)
        this.name = jsonabi.contractName;
    }

    // getMethod(name: string){
    //     this.abi.forEach(element =>{
    //         if (element.name == name) {
    //             return element;
    //           }
    //     });
    //     return null
    // }

    getPublicMethods(){
        
        let methods: ExtendedAbiItem[] = []
        this.abi.forEach(element =>{
            if (element.type === 'function' && element.stateMutability && element.stateMutability !== 'view') {
                // Teste para filtrar 
                methods.push(element);
              }
        });
        return methods;
    }
}
