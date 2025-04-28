import { Fill, Modal } from "@/components/Modal";
import { useRef } from "react";
import ContractCallBuilder, { ContractBuilderType } from "./ContractCallBuilder";
import { Web3Provider } from "@/context/web3Data";
import { useGovernanceData } from "@/context/governancaData";
import { CutSpaces } from "@/util/StringUtils";

type Props = {
    toggleModal: boolean;
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddComponent({ toggleModal, setToggleModal}: Props){
    const { governanceContract } = useGovernanceData();

    const blockInput = useRef<HTMLInputElement | null>(null)
    const descriptionInput = useRef<HTMLTextAreaElement | null>(null)

    const contractBuilderRef = useRef<ContractBuilderType>(null)

    

    const createProposal = () =>{
        //let address = contract?.address
        if(CutSpaces(descriptionInput.current.value) == "" || CutSpaces(descriptionInput.current.value) == " "){
            alert("Você deve preencher o campo descrição")
            return;
        }

        if(!contractBuilderRef.current || !blockInput.current || !descriptionInput.current) return;

        let callData = contractBuilderRef.current.getValue()
        // console.log(callData)
        governanceContract?.createProposal(callData.addresses, callData.hashes, blockInput.current.value, descriptionInput.current.value ).then(()=>{
            setToggleModal(false)
        }).catch(error =>{
            console.log(error['message'])
            alert("Ocorreu um error durante a transação: " + error['message'] + "\n. Confirá o console para mais detalhes");
            console.error(error)
        })
    }

    


    return (
        <Modal title={"Criar nova proposta"} state={toggleModal} setState={setToggleModal}>
            <Fill>
                <div>
                    <label htmlFor="description">Descrição</label>
                    <textarea ref={descriptionInput} id="description" />
                </div>
            </Fill>
            <Fill>
                <div>
                    <label htmlFor="blocks">Duração em blocos</label>
                    <input type="number" ref={blockInput} id="blocks" defaultValue={200} min={1}/>
                </div>
            </Fill>

            <Web3Provider>
                <ContractCallBuilder ref={contractBuilderRef}/>
            </Web3Provider>

            <Fill>
                
                <button onClick={createProposal}>
                    Criar
                </button>
            </Fill>
        </Modal>
    )
}