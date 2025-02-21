import { AbiItem  } from 'web3-utils';

export default class ContractChainABI{
    address: string;
    abi: AbiItem[];
    name: string;

    constructor(address: string, abi: any){
        this.address = address;
        this.abi = abi as AbiItem[];
        // this.abi[0].inputs
        this.name = abi.contractName;
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
        
        let methods: AbiItem[] = []
        this.abi.forEach(element =>{
            if (element.type === 'function' && element.stateMutability && element.stateMutability !== 'view') {
                // Teste para filtrar 
                methods.push(element);
              }
        });
        return methods;
    }
}
