import { ExtendedAbiItem } from "@/chain/@types/component/ExtendedAbiItem";
import ContractChainABI from "@/chain/abis/ContractChainABI";
import { getContracts } from "@/chain/ContractsABIUtils";
import { Fill } from "@/components/Modal";
import { useWeb3 } from "@/context/web3Data";
import { useState, useRef, useEffect, useImperativeHandle, BaseSyntheticEvent } from "react";
import { AbiParameter, AbiFunctionFragment } from "web3";

type Props = {
   ref:any;
}

type Calldata = {
    address: string;
    calldata: string;
}

export type ContractBuilderType = {
    getValue: ()=> Calldata;
}

export default function ContractCallBuilder({ ref }:Props) {
    const [isCustomContract, setIsCustomContract] = useState(false);
    const [contract, setContract] = useState<ContractChainABI | undefined>();

    const {Web3} = useWeb3();

    const [methods, setMethods] = useState<ExtendedAbiItem[]>([]);
    const methodsRef = useRef<ExtendedAbiItem[]>([])
    const curMethodIndex = useRef<string | number | undefined>(undefined)
    const [inputs, setInputs] = useState<readonly AbiParameter[]>([])
    const inputsCountRef      = useRef(15)
    const inputsValueRef = useRef({});

    const customAddress = useRef<HTMLInputElement | null>(null);
    const customData    = useRef<HTMLInputElement | null>(null);

    useEffect(()=>{
        if(contract != undefined){
            let contractMethods = contract.getPublicMethods()
            setMethods(contractMethods)
            methodsRef.current = contractMethods
            inputsValueRef.current = {};
            inputsCountRef.current = 0;
            setInputs([]);
        }
    }, [contract])
    
    const onChangeContract = (event: BaseSyntheticEvent) =>{
        if(event.target.value == "custom-contract"){
            setIsCustomContract(true)
            setContract(undefined);
        }else{
            setIsCustomContract(false)
            if(event.target.value != "none"){
                setContract(getContracts()[event.target.value][1])
            }else{
                setInputs([])
                setContract(undefined)
            }
        }
    }

    let getMethodInputs = (index: number) => {
        return methods[index].inputs;
    }

    let getValue = () =>{

        if(Web3 == undefined){
            console.error("Web3 esta undefined")
            return;
        }

        if(isCustomContract){
            return customData.current?.value
        }else{
            if(curMethodIndex.current == "none"){
                throw new Error("Método 'none' não suportado")
            }

            let abi = methodsRef.current[curMethodIndex.current as number]
            if(Object.keys(inputsValueRef.current).length < inputsCountRef.current){
                throw new Error("O número de inputs não corresponde aos valores preenchidos")
            }

            return {
                address: contract?.address,
                calldata:Web3.eth.abi.encodeFunctionCall(abi as AbiFunctionFragment, Object.values(inputsValueRef.current))
            }
        }

    }

    useImperativeHandle(ref, () => {
        return {
            getValue
        };
    }, [Web3, contract]);

    let onChangeMethod = (event: BaseSyntheticEvent)=>{
        curMethodIndex.current = event.target.value
        inputsValueRef.current = {}
        console.log("Mudando contratos")
        if(event.target.value == "none"){
            setInputs([]);
            inputsCountRef.current = 15;
        }else{
            let _inputs = getMethodInputs(event.target.value)
            if(_inputs){
                setInputs(_inputs)
                inputsCountRef.current = _inputs.length;
            }
        }
    }

    let onChangeParameter = (name:string, value: string) =>{
        inputsValueRef.current = {
            ...inputsValueRef.current,
            [name]: value
        };
    }

    return  (
        <>
            <Fill>
                <div>
                    <label htmlFor="contract">Contrato</label>
                    <select  name="" id="contract" onChange={onChangeContract}>
                        <option value="none">Selecione</option>

                        {
                            getContracts().map((element, index) => <option key={index} value={index}>{element[0]}</option>)
                        }
                        <option value="custom-contract">Outro</option>
                    </select>
                </div>
            </Fill>

            {
                isCustomContract ? 
                    <>
                        <Fill>
                            <div>
                                <label htmlFor="custom_address_contract">Endereço do contrato</label>
                                <input ref={customAddress} type="text" id="custom_address_contract" />
                            </div>
                        </Fill>
                        <Fill>
                            <div>
                                <label htmlFor="custom_data_contract">Dados de entrada</label>
                                <input ref={customData} type="text" id="custom_data_contract" />
                            </div>
                        </Fill>
                    </> 
                : contract != undefined ?
                    <>
                        <Fill>
                            <div>
                                <label htmlFor="contract">Método do contrato</label>
                                <select name="" id="contract_methods" onChange={onChangeMethod}>
                                    <option value="none">Selecione</option>
                                    {
                                        methods.map((element, index) => <option key={"method_"+index} value={index}>{element.name}</option>)
                                    }
                                </select>
                            </div>
                        </Fill>
                        {/* Paramêtros da função selecionada acima */}
                        {
                            inputs.length > 0 ?
                                inputs.map((element, index) =>
                                    <Fill key={`parameter_${index}`}>
                                        <label htmlFor={`parameter_${element.name}`}>{element.name}</label>
                                        <input onChange={(event) => onChangeParameter(element.name, event.target.value)} type="text" id={`parameter_${element.name}`} />
                                    </Fill>)
                            : ""
                        }
                    </> 
                : ""
            }
        </>
    )
}