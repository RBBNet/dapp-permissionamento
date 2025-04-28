import { Fill, Modal } from "@/components/Modal";
import { useAccountData } from "@/context/accountData";
import { ethers } from "ethers";
import { useRef } from "react";

type Props = {
    toggleModal: boolean;
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddComponent({ toggleModal, setToggleModal}: Props){
    const { accountRulesContract } = useAccountData();
    const addressRef = useRef<HTMLInputElement >(null);
    const typeRef = useRef<HTMLSelectElement >(null);
    const hashRef = useRef<HTMLTextAreaElement >(null);

    function createAccount(){
        if(!addressRef.current || !hashRef.current || !typeRef.current) return;

        let address = addressRef.current.value;
        let roleId = ethers.keccak256(ethers.toUtf8Bytes(typeRef.current.value));
        let dataHash = ethers.keccak256(ethers.toUtf8Bytes(hashRef.current.value))

        accountRulesContract!.addLocalAccount(address, 
            roleId, dataHash).catch(error =>{
                alert("Erro ao adicionar conta local. \nError :" + error)
            }).then(()=>{
                setToggleModal(false)
            })
    }

    return (
        <Modal title={"Criar conta"} state={toggleModal} setState={setToggleModal} >
            <div>
                <label htmlFor="">Endereço</label>
                <input ref={addressRef} type="text" />
            </div>
            <div>
                <label htmlFor="">Papel da Conta</label>
                <select ref={typeRef} name="" id="">
                    <option value="LOCAL_ADMIN_ROLE">Local</option>
                    <option value="DEPLOYER_ROLE">Deployer</option>
                    <option value="USER_ROLE">User</option>
                </select>
            </div>
            <Fill>
                <label htmlFor="">Hash</label>
                <textarea ref={hashRef} style={{resize:"none", minHeight:"70px"}} name="" id="" />
            </Fill>

            <Fill>
                
                <button  onClick={createAccount}>
                    Criar
                </button>
            </Fill>
        </Modal>
    )
}