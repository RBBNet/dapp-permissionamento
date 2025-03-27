import { Fill } from "@/components/Modal";
import { useState, useRef, useEffect, useImperativeHandle, BaseSyntheticEvent } from "react";
import CalldataComponent, { CalldataComponentType, CalldataParameters, ExportableCalldata } from "./CalldataComponent"
import { useWeb3 } from "@/context/web3Data";
import { CustomContractParameter } from "./CustomContract";
import { InputsContractParameters } from "./InputsContract";

type Props = {
   ref:any;
}
type CalldataObject = {
    _id: string;
    name: string;
    extra?: ExportableCalldata;
}

type Calldata = {
    addresses: string[]
    hashes   : string[]
}

export type ContractBuilderType = {
    getValue: ()=> Calldata;
}

export default function ContractCallBuilder({ ref }:Props) {
    const { Web3 } = useWeb3();
    const [calldatasObj, setCalldatasObj ] = useState<Record<string, CalldataObject>>({})
    const [currentCalldata, setCurrentCalldata] = useState<CalldataObject | undefined>(undefined);
    const [calldataState, setCalldataState] = useState<JSX.Element | undefined>(undefined)
    const callSelectRef = useRef<HTMLSelectElement | null>(null)
    const calldataComponentRef = useRef<CalldataComponentType>();

    const updatedRef = useRef(false)

    const addCalldata = () =>{
        let id = crypto.randomUUID()
        var calldataObject: CalldataObject = { _id: id, name : "Paramêtro não definido " + id.substring(0, 5)};
        updatedRef.current = true;

        setCalldatasObj(prevValues => ({
            ...prevValues,
            [id]: calldataObject
        }));
    }

    const updateCalldata = (id: string, updatedData: Partial<CalldataObject>) => {
        if(!(id in calldatasObj)) return
        setCalldatasObj(prev => ({
            ...prev,
            [id]: {
                ...prev[id], // Mantém os valores existentes
                ...updatedData, // Sobrescreve apenas os valores atualizados
            }
        }));
    };

    const delCalldata = () =>{
        updatedRef.current = true;

        setCalldatasObj(calldatas => {
            const newCalldatas = { ...calldatas };

            delete newCalldatas[currentCalldata!._id]; // Remove a chave correspondente

            return newCalldatas;
        })
    }

    const onChangeCalldata = (event: BaseSyntheticEvent) =>{
        changeCalldata(event.target.value)
    }
    
    const changeCalldata = (id:string | undefined) => {

        if(!id){
            setCurrentCalldata(undefined)
            setCalldataState(undefined)
            return;
        }
        if(currentCalldata && calldatasObj){
            // Salvar informações do calldata anterior
            
            let newData = calldataComponentRef.current?.getCalldata();
            
            if(newData == undefined)
                console.error("Não foi possível retornar as informações do contrato")
            else{
                let object = currentCalldata;
                object.extra = newData
                
                updateCalldata(currentCalldata._id, object)
            }
        }
        // Atualiza para o novo calldata
        let obj = calldatasObj[id]
        setCurrentCalldata(obj)
        setCalldataState(<CalldataComponent key={obj?._id} ref={calldataComponentRef} initialData={obj?.extra}/>);
    }

    useImperativeHandle(ref, ()=> ({
        getValue
    }), [calldatasObj, currentCalldata])

    const getValue = () : Calldata =>{

        // Atualizar o objeto atual
        let calldatas = calldatasObj;
        if(currentCalldata){
            if(calldataComponentRef.current)
                calldatas[currentCalldata?._id].extra = calldataComponentRef.current?.getCalldata()
        }

        let keys = Object.keys(calldatas);

        let addresses: string[] = []
        let hashes: string[] = []

        keys.forEach(key =>{
            let calldata = calldatas[key];
            if(!calldata.extra)
                throw new Error(`Calldata de ${key} não foi preenchido`)

            let data = calldata.extra;

            addresses.push(data.address);
            
            if(data.isCustom){
                hashes.push(data.parameters[0]);
            }else{
                //encontrar o abi
                let dataParameters = data.extra as InputsContractParameters;
                if(!dataParameters.abi_function_fragment){
                    throw new Error("ABI function não informado")
                }

                let hash = Web3?.eth.abi.encodeFunctionCall(dataParameters.abi_function_fragment, Object.values(dataParameters.parameters))
                if(!hash) throw new Error("Hash veio undefined")
                hashes.push(hash)
                
            }
        })
        return {
            addresses,
            hashes
        }
    }

    useEffect(() => {
        let calldatasArray = Object.keys(calldatasObj)

        if(updatedRef.current && calldatasArray.length > 0){

            updatedRef.current = false;
            let lastObject = calldatasObj[calldatasArray[calldatasArray.length - 1]]

            changeCalldata(lastObject._id)
            if(callSelectRef.current)
                callSelectRef.current.value = lastObject._id
        }
        if(calldatasArray.length == 0){

            changeCalldata(undefined)
        }
        
    }, [Web3,calldatasObj]);

    
    return  (
        <>
            <Fill>
                {/* Seleção e criação de chamadas */}
                <div>
                    <label htmlFor="">Chamadas</label>
                    <div style={{display:"flex", flexDirection:"row", gap:"5px"}}>
                        <select ref={callSelectRef}  name="" id="contracts" style={{flex:1}} onChange={onChangeCalldata}>
                            {
                                Object.keys(calldatasObj).length == 0 ?
                                    <option value="none">Nenhuma chamada criada</option>
                                :
                                <>
                                    {
                                        Object.keys(calldatasObj).map((element) => 
                                            <option value={calldatasObj[element]._id}>{calldatasObj[element].name}</option>
                                        )
                                    }
                                </>
                            }
                            
                        </select>
                        <button style={{minWidth:"32px"}} onClick={addCalldata}>
                            +
                        </button>
                        <button style={{minWidth:"32px"}} onClick={delCalldata}>
                            -
                        </button>
                    </div>
                </div>
            </Fill>
            {/*  */}
            {
                calldataState
            }
            
        </>
    )
}