import { Modal, Fill } from "@/components/Modal";
import { useAccountData } from "@/context/accountData";
import { useRef, useState } from "react";

type Props = {
    toggleModal: boolean;
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteComponent({toggleModal, setToggleModal} : Props){
    const { accountRulesContract } = useAccountData();
    

    function deleteAccount(){
        if(!addressRemoveRef.current) return;

        accountRulesContract!.deleteLocalAccount(addressRemoveRef.current.value).catch(error =>{
            alert("Falha ao deletar conta local. Error : \n" + error)
        }).then(()=>{
            setToggleModal(false)
        });
    }
    const addressRemoveRef = useRef<HTMLInputElement >(null);

    return (
        <Modal title={"Remover conta"} state={toggleModal} setState={setToggleModal}>

            <Fill>
                <label htmlFor="">Endereço</label>
                <input ref={addressRemoveRef} type="text" />
            </Fill>

            <Fill>
                <button  onClick={deleteAccount}>
                    Remover
                </button>
            </Fill>
        </Modal>
    )
    
}