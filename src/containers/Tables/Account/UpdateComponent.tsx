import { AccountRulesV2 } from "@/chain/@types";
import { Modal, Fill } from "@/components/Modal";
import { useAccountData } from "@/context/accountData";
import { ConvertNameToRoleID, ConvertRoleID } from "@/util/StringUtils";
import { useRef } from "react";
import { AccountRules as AccountRulesABI } from "@/chain/ContractsABI";
import { showErrorMessage } from "@/util/ContractUtils";

type Props = {
    updateData: AccountRulesV2.AccountDataStructOutput | undefined;
    toggleModal: boolean;
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly?: boolean
}

export default function UpdateComponent( {updateData, toggleModal, setToggleModal, readonly} : Props) {
    const { accountRulesContract } = useAccountData();

    const typeRef = useRef<HTMLSelectElement | null>(null);
    const hashRef = useRef<HTMLTextAreaElement | null>(null);
    const statusRef = useRef<HTMLSelectElement | null>(null);


    async function _updateAccount(roledID: string, hash: string, status: string){
        if(updateData == undefined) return;
        let statusBoolean = status == 'true';

        roledID = "0x" + ConvertNameToRoleID(roledID)
        
        try{
            if(statusBoolean != updateData?.active){
                await accountRulesContract?.updateLocalAccountStatus(updateData?.account, statusBoolean)
            }
            
            if(roledID != updateData.roleId || hash != updateData.dataHash){
        
                await accountRulesContract?.updateLocalAccount(updateData?.account, roledID, hash);
            }
        }catch(ex){
            showErrorMessage("Falha ao atualizar conta.", ex, AccountRulesABI.abi)
        }
        setToggleModal(false)
    }

    return (
        <>
            <Modal title={!readonly ? "Atualizar conta" : "Conta"} state={toggleModal} setState={setToggleModal}>
                <Fill>
                    <label htmlFor="">Endereço</label>
                    <input type="text" defaultValue={updateData?.account} readOnly={readonly} />
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="tipo">Papel da Conta</label>
                        <select id="tipo" name="tipo" ref={typeRef} defaultValue={ConvertRoleID(updateData?.roleId)} disabled={readonly}>
                            <option value="LOCAL_ADMIN_ROLE">Local</option>
                            <option value="DEPLOYER_ROLE">Deployer</option>
                            <option value="USER_ROLE">User</option>
                        </select>
                    </div>
                </Fill>
                <Fill>
                    <label htmlFor="hash">Hash</label>
                    <textarea id="hash" ref={hashRef} defaultValue={updateData?.dataHash} readOnly={readonly}/>
                </Fill>
                <Fill>
                    <label htmlFor="status">Status</label>
                    <select id="status" ref={statusRef} defaultValue={updateData?.active.toString()} disabled={readonly}>
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>

                    </select>
                </Fill>
                {
                    !readonly ?
                    <Fill>
                        <button onClick={()=>{_updateAccount(typeRef.current!.value, hashRef.current!.value, statusRef.current!.value)}}>
                            Atualizar
                        </button>
                    </Fill> : ""
                }
                
            </Modal>
        
        </>
    )
}