import { ExtendedAbiItem } from "@/chain/@types/component/ExtendedAbiItem";
import { getContracts } from "@/chain/ContractsABIUtils";
import { Fill } from "@/components/Modal";
import { useState, useEffect, useImperativeHandle, BaseSyntheticEvent, useRef } from "react";
import { AbiParameter } from "web3";

type Props = {
    ref: any;
    selectedContract: string;
    extra?: InputsContractParameters;
}

export type InputsContractParameters = {
    contract_method_index: string;
    parameters: Record<string, string>;
    abi_function_fragment: ExtendedAbiItem | undefined;
}

export default function InputsContract({ref, selectedContract, extra}: Props){
    const [methods, setMethods] = useState<readonly ExtendedAbiItem[]>([])
    const [inputs, setInputs] = useState<readonly AbiParameter[]>([])
    const [inputsValues, setInputsValues] = useState<Record<string, string>>({})
    const [selectedMethod, setSelectedMethod] = useState('none')
    const methodRef = useRef<HTMLSelectElement>(null);
    const loaded = useRef<boolean>(false);

    const skipUpdate = useRef<boolean>(false); 
    useEffect(()=>{
        if(!extra) {
            return;
        }

        skipUpdate.current = true;
        loaded.current = true;
        
        if(!selectedContract) return;

        let index:number = parseInt(selectedContract);
        let methods = getContracts()[index][1].getPublicMethods()
        setMethods(methods)

        let indexMethod: number = parseInt(extra.contract_method_index);
        if(extra.contract_method_index){
            setSelectedMethod(extra.contract_method_index)
        }

        if(extra.parameters){
            let inputsOnContract = methods[indexMethod]

            if(inputsOnContract){
                setInputs(inputsOnContract.inputs!);
                setInputsValues(extra.parameters)
            }
        }
    }, [])

    useEffect(()=>{
        if(selectedContract == "none" || selectedContract == "custom") return;
        if (skipUpdate.current) {
            skipUpdate.current = false;
            return;
        }

        let index:number = parseInt(selectedContract);
        setMethods(getContracts()[index][1].getPublicMethods());
        setInputs([])
        setInputsValues({})
        if(methodRef.current)
            methodRef.current.value = "none"
    }, [selectedContract])

    useEffect(()=>{
        if(selectedMethod == "none") return;
        if (skipUpdate.current) {
            skipUpdate.current = false;
            return;
        }

        let index:number = parseInt(selectedContract);
        let indexMethod: number = parseInt(selectedMethod);

        let inputsOnContract = getContracts()[index][1].getPublicMethods()[indexMethod]
        // if(!inputsOnContract){
        //     throw new Error("Inputs não encontradas para o contrato selecionado");
        // }

        if(inputsOnContract){
            setInputs(inputsOnContract.inputs!);

            if(extra?.parameters)
                setInputsValues(extra.parameters)
        }
    }, [selectedMethod])

    const getData = () : InputsContractParameters =>{
        // if(Object.keys(inputsValues).length != inputs.length){
        //     throw new Error("A quantidade de valores inseridos não corresponde a quantidade de parametros")
        // }

        // if(selectedMethod == "none")
        //     throw new Error("Método não selecionado")

        return {
            contract_method_index: selectedMethod,
            parameters: inputsValues,
            abi_function_fragment: selectedMethod == "none" ? undefined : methods[parseInt(selectedMethod)]
        }
    }

    const handleInputChange = (event: BaseSyntheticEvent) =>{
        const { name, value } = event.target;
        setInputsValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
        //console.log(inputsValues)
    }

    useImperativeHandle(ref, () => ({
        getData
    }), [selectedMethod, inputs, inputsValues])

    const onChangeMethod = (event: BaseSyntheticEvent) =>{
        setSelectedMethod(event.target.value);
    }

    return (
        <>
            <Fill>
                <div>
                    <label htmlFor="method">Método</label>
                    <select name="" id="method" value={selectedMethod} onChange={onChangeMethod} ref={methodRef}>
                        <option defaultChecked value="none">Selecione</option>
                        {
                            methods.map((element, index) => <option key={index} value={index}>{element.name}</option>)
                        }
                    </select>
                    
                </div>
            </Fill>

            {
                inputs.length > 0 ?
                    <>
                        {
                            inputs.map(element =>
                                <Fill>
                                    <div>
                                        <label htmlFor="">{element.name}</label>
                                        <input type="text" name={element.name} value={inputsValues[element.name]} onChange={handleInputChange} />
                                    </div>
                                </Fill>
                            )
                        }
                    </>
                : ""
            }
        </>
    )
}