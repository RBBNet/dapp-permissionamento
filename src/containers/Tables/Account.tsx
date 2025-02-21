
import Table from "../../components/Table";
import { useAccountData } from "../../context/accountData";
import { ConvertNameToRoleID, ConvertRoleID } from "../../util/StringUtils"
import {Modal, Fill} from "../../containers/Modal/";
import { useEffect, useRef, useState } from "react";

import { ethers } from "ethers";
import { useOrganizationData } from "../../context/organizationData";
import { AccountRulesV2 } from "../../chain/@types";

import { formatOrganization } from "../../util/StringUtils";

function AccountTable(){
    const { accountRulesContract, operatorData, onUpdate } = useAccountData();
    const { orgList } = useOrganizationData();

    const [toggleModalAdd, setToggleModalAdd] = useState(false);
    const [toggleModalRemove, setToggleModalRemove] = useState(false);
    const [toggleModalUpdate, setToggleModalUpdate] = useState(false);

    const [accountList, setAccountList] = useState<AccountRulesV2.AccountDataStructOutput[]>([])
    const [updateData, setUpdateData] = useState<AccountRulesV2.AccountDataStructOutput | undefined>();
    
    useEffect(()=>{
        accountRulesContract?.getAccounts(1, 999).then(accounts=>{
            setAccountList(accounts);
        }).catch(exception =>{
            console.log(exception)
        })
    }, [ onUpdate])
    
    const AddComponent = () =>{
        const addressRef = useRef<HTMLInputElement >(null);
        const typeRef = useRef<HTMLSelectElement >(null);
        const hashRef = useRef<HTMLTextAreaElement >(null);

        function createAccount(){
            if(!addressRef.current || !hashRef.current || !typeRef.current) return;
    
            let address = addressRef.current.value;
            let roleId = ethers.keccak256(ethers.toUtf8Bytes(typeRef.current.value));
            let dataHash = ethers.keccak256(ethers.toUtf8Bytes(hashRef.current.value))
    
            accountRulesContract!.addLocalAccount(address, 
                roleId, dataHash)
        }

        return (
            <Modal title={"Criar conta"} setState={setToggleModalAdd}>
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

    function _updateAccount(roledID: string, hash: string, status: string){
        if(updateData == undefined) return;
        let statusBoolean = status == 'true';

        roledID = "0x" + ConvertNameToRoleID(roledID)
        
        if(statusBoolean != updateData?.active){
            accountRulesContract?.updateLocalAccountStatus(updateData?.account, statusBoolean)
        }
        
        if(roledID != updateData.roleId || hash != updateData.dataHash){

            accountRulesContract?.updateLocalAccount(updateData?.account, roledID, hash);
        }
    }

    function updateAccount(data: any | undefined){
        if(!data) return;

        setToggleModalUpdate(true)
        setUpdateData(data)
    }

    const UpdateAccountComponent = () => {
        const typeRef = useRef<HTMLSelectElement | null>(null);
        const hashRef = useRef<HTMLTextAreaElement | null>(null);
        const statusRef = useRef<HTMLSelectElement | null>(null);
        return (
            <>
                <Modal title={"Atualizar conta"} setState={setToggleModalUpdate}>
                    <Fill>
                        <label htmlFor="">Endereço</label>
                        <input type="text" defaultValue={updateData?.account} readOnly />
                    </Fill>
                    <Fill>
                        <div>
                            <label htmlFor="tipo">Papel da Conta</label>
                            <select id="tipo" name="tipo" ref={typeRef} defaultValue={ConvertRoleID(updateData?.roleId)}>
                                <option value="LOCAL_ADMIN_ROLE">Local</option>
                                <option value="DEPLOYER_ROLE">Deployer</option>
                                <option value="USER_ROLE">User</option>
                            </select>
                        </div>
                    </Fill>
                    <Fill>
                        <label htmlFor="hash">Hash</label>
                        <textarea id="hash" ref={hashRef} defaultValue={updateData?.dataHash}/>
                    </Fill>
                    <Fill>
                        <label htmlFor="status">Status</label>
                        <select id="status" ref={statusRef} defaultValue={updateData?.active.toString()}>
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>

                        </select>
                    </Fill>
                    <Fill>
                        <button onClick={()=>{_updateAccount(typeRef.current?.value, hashRef.current?.value, statusRef.current?.value)}}>
                            Atualizar
                        </button>
                    </Fill>
                    
                </Modal>
            
            </>
        )
    }

    function _deleteAccount(address: string){
        accountRulesContract!.deleteLocalAccount(address);
    }

    
    const DeleteComponent = () =>{
        function deleteAccount(){
            if(!addressRemoveRef.current) return;
    
            _deleteAccount(addressRemoveRef.current?.value)
        }
        const addressRemoveRef = useRef<HTMLInputElement >(null);

        return (
            <Modal title={"Remover conta"} state={toggleModalRemove} setState={setToggleModalRemove}>

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

    const ActionsComponent = (data: any) =>{
        return (
            <>
                { 
                    data.orgId == operatorData?.orgId 
                    && data.roleId !=  "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                    && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                ? 
                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                    <img width={"16px"} src="/icons/edit.png" onClick={()=>updateAccount(data)} />
                    <img width={"16px"} src="/icons/delete.png" onClick={()=>_deleteAccount(data.account)} />
                    <img width={"16px"} src="/icons/blocked.png" />
                </div>
                : "―"}
                
            </>
        )
    }

    const columns = [
        {
            'name': 'Organização',
            'value':'orgId',
            'call':(data:any)=>formatOrganization(orgList, data)
        },
        {
            'name':'Endereço',
            'value':'account'
        },
        {
            'name':'Papel',
            'value':'roleId',
            'call': (hash: string)=> ConvertRoleID(hash, true)
        },
        {
            'name':'Hash',
            'value':'dataHash',
            'call': ()=> 'HASH'
        },
        {
            'name':'Status',
            'value':'active'
        },
        {
            'name':'Ações',
            'value':"_",
            'component':ActionsComponent
        }
    ]

    return (
    <>
        {
            toggleModalAdd ? <AddComponent/> : ""
        }
        { 
            toggleModalUpdate ? <UpdateAccountComponent/> : "" 
        }
        {
            toggleModalRemove ? <DeleteComponent/> : ""
        }
    

        
        {
            operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE") ?
            <div style={{display:"flex", flexDirection:"row-reverse", gap:"10px"}}>
                <button style={{padding:'10px'}} onClick={()=>setToggleModalAdd(true)}>
                    Criar
                </button>
                <button style={{padding:'10px'}} onClick={()=>setToggleModalRemove(true)}>
                    Remover
                </button>
            </div>
            : ""

        }
        <Table columns={columns} data={accountList}/>
    </>
    )
}

export default AccountTable;