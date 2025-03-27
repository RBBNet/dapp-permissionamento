import { getContracts } from "@/chain/ContractsABIUtils"
import { Fill } from "@/components/Modal"
import { BaseSyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react"
import CustomContract, { CustomContractParameter } from "./CustomContract"
import InputsContract, { InputsContractParameters } from "./InputsContract"

type Props = {
    ref: any;
    parameters?: CalldataParameters;
    initialData?: ExportableCalldata;
}

export type CalldataParameters = {
    name: string;
    address: string;
    method?:string;
    parameters: string[];
}

export type CalldataComponentType = {
    getCalldata: ()=> ExportableCalldata | undefined;
}

type GettableData = {
    getData : () => any
}

export type ExportableCalldata = {
    contract: string;
    address: string;
    parameters: string[];
    extra: any | InputsContractParameters | CustomContractParameter | undefined;
    isCustom: boolean;
}


export default function CalldataComponent({ref, initialData} : Props){
    
    const [selectedContract, setSelectedContract] = useState('none')

    const parameterRef = useRef<GettableData | undefined>(undefined)

    useEffect(()=>{
        if(!initialData) return;

        setSelectedContract(initialData.contract)
    }, [])

    
    const onSelectContract = (value: BaseSyntheticEvent) => {
        setSelectedContract(value.target.value)
    }

    const getCalldata = () : ExportableCalldata | undefined =>{
        if(selectedContract == "none")
            return undefined
            // throw new Error("Contrato não selecionado")

        let isCustom = selectedContract == "custom";

        let data = parameterRef.current!.getData();


        if(isCustom){
            let customData = data as CustomContractParameter
            return {
                contract: selectedContract,
                address: customData.address,
                parameters: [customData.hash],
                extra: customData,
                isCustom
            }
        }else{
            let inputsData = data as InputsContractParameters

            let contract = getContracts()[parseInt(selectedContract)][1]

            return {
                contract: selectedContract,
                address: contract.address,
                parameters: Object.values(inputsData.parameters),
                extra: inputsData,
                isCustom
            }
        }
    }

    useImperativeHandle(ref, () : CalldataComponentType => ({
        getCalldata
    }), [selectedContract])

    return (
        <>
            <Fill>
                <div>
                    <label htmlFor="contract">Contrato</label>
                    <select name="" id="contract" value={selectedContract} onChange={onSelectContract}>
                        <option value="none">Selecione</option>
                        {
                            getContracts().map((element, index) => <option key={index} value={index}>{element[0]}</option>)
                        }
                        <option value="custom">Outro</option>
                    </select>
                </div>
            </Fill>

            {
                selectedContract != "none" ?
                <>
                    { 
                        selectedContract == "custom" ? <CustomContract extra={initialData?.extra} ref={parameterRef}/>
                        : <InputsContract extra={initialData?.extra} ref={parameterRef} selectedContract={selectedContract}/>
                    }
                </>
                :""
            }
    
        </>
    )
}
