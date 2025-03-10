import { Fill, Modal } from "@/components/Modal";
import { useRef } from "react";
import ContractCallBuilder, { ContractBuilderType } from "./ContractCallBuilder";
import { Web3Provider } from "@/context/web3Data";
import { useGovernanceData } from "@/context/governancaData";

type Props = {
    toggleModal: boolean;
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddComponent({ toggleModal, setToggleModal}: Props){
    const { governanceContract} = useGovernanceData();

    const blockInput = useRef<HTMLInputElement | null>(null)
    const descriptionInput = useRef<HTMLTextAreaElement | null>(null)

    const contractBuilderRef = useRef<ContractBuilderType>(null)


    const createProposal = () =>{
        //let address = contract?.address
        if(!contractBuilderRef.current || !blockInput.current || !descriptionInput.current) return;

        let callData = contractBuilderRef.current.getValue()
        console.log(callData)
        governanceContract?.createProposal([callData.address], [callData.calldata], blockInput.current.value, descriptionInput.current.value )
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
                    <input type="number" ref={blockInput} id="blocks" defaultValue={200} />
                </div>
            </Fill>

            <Web3Provider>
                <ContractCallBuilder ref={contractBuilderRef} />
            </Web3Provider>

            <Fill>
                
                <button onClick={createProposal}>
                    Criar
                </button>
            </Fill>
        </Modal>
    )
}