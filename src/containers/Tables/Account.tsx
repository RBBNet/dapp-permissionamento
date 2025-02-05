
import Table from "../../components/Table";
import { useAccountData } from "../../context/accountData";
import { ConvertNameToRoleID, ConvertRoleID } from "../../util/StringUtils"
import {Modal, Fill} from "../../containers/Modal/";
import { useEffect, useRef, useState } from "react";

import { ethers } from "ethers";
import { useOrganizationData } from "../../context/organizationData";
import { AccountRulesV2, AccountRulesV2Impl } from "../../chain/@types";
import { Organization } from "../../chain/@types/OrganizationImpl";
import { BigNumberish } from "ethers";

function AccountTable(){
    const { accountList, accountRulesContract, operatorAddress } = useAccountData();
    const { organizationContract, orgList } = useOrganizationData();

    const [toggleModalAdd, setToggleModalAdd] = useState(false);
    const [toggleModalRemove, setToggleModalRemove] = useState(false);
    const [toggleModalUpdate, setToggleModalUpdate] = useState(false);

    const [accountData, setAccountData] = useState<AccountRulesV2.AccountDataStructOutput | undefined>();
    const [organization, setOrganization] = useState<Organization.OrganizationDataStructOutput>();
    const [updateData, setUpdateData] = useState<AccountRulesV2.AccountDataStructOutput | undefined>();

    const addressRemoveRef = useRef<HTMLInputElement >(null);
    const addressRef = useRef<HTMLInputElement >(null);
    const typeRef = useRef<HTMLSelectElement >(null);
    const hashRef = useRef<HTMLTextAreaElement >(null);

    useEffect(()=>{
        
        accountRulesContract?.getAccount(operatorAddress).then(account=>{
            setAccountData(account);
            organizationContract?.getOrganization(account.orgId).then(org =>{
                setOrganization(org)
            })
        }).catch(exception =>{
            // Handle do erro de conta inexistente
            console.log(exception)
            setOrganization(undefined)
            setAccountData(undefined);
        })
    }, [accountRulesContract, operatorAddress])

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

    const UpdateAccountComponent = (props: any) => {
        const typeRef = useRef<HTMLSelectElement | null>();
        const hashRef = useRef<HTMLTextAreaElement | null>();
        const statusRef = useRef<HTMLSelectElement | null>();
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

    function deleteAccount(){
        if(!addressRemoveRef.current) return;

        _deleteAccount(addressRemoveRef.current?.value)
    }

    function createAccount(){
        if(!addressRef.current || !hashRef.current || !typeRef.current) return;

        let address = addressRef.current.value;
        let roleId = ethers.keccak256(ethers.toUtf8Bytes(typeRef.current.value));
        let dataHash = ethers.keccak256(ethers.toUtf8Bytes(hashRef.current.value))
        console.log(dataHash)
        console.log(roleId)
        console.log(address)

        accountRulesContract!.addLocalAccount(address, 
            roleId, dataHash)
    }

    function formatRoleId(roleId: string){
        let formatted = ConvertRoleID(roleId)

        return formatted.substring(0, formatted.indexOf("_"))
    
    }

    function formatOrganization(orgId: BigNumberish){
        let org = undefined;
        for(let orgD of orgList){
            if(orgD.id == orgId as number){
                org = orgD;
            }
        }
        if(org){
            return org.name
        }
        return "undefined"
    }

    const actionsComponent = (data: any) =>{
        return (
            <>
                { 
                    data.orgId == accountData?.orgId 
                    && data.roleId !=  "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                    && accountData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                ? 
                <>
                    <img width={"16px"} src="/icons/user.png" alt="" onClick={()=>updateAccount(data)} />
                    <img width={"16px"} src="/icons/delete.png" alt="" onClick={()=>_deleteAccount(data.account)} />

                </>
                : "―"}
                
            </>
        )
    }

    const columns = [
        {
            'name': 'Organização',
            'value':'orgId',
            'call':formatOrganization
        },
        {
            'name':'Endereço',
            'value':'account'
        },
        {
            'name':'Papel',
            'value':'roleId',
            'call':formatRoleId
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
            'component':actionsComponent
        }
    ]

    return (
    <>
        { toggleModalUpdate ? <UpdateAccountComponent/> : "" }

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

        <Modal title={"Criar conta"} state={toggleModalAdd} setState={setToggleModalAdd}>
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
        {
            accountData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE") ?
            <div style={{display:"flex", flexDirection:"row-reverse", gap:"10px"}}>
                <button style={{padding:'10px'}} onClick={()=>setToggleModalAdd(true)}>
                    Criar conta
                </button>
                <button style={{padding:'10px'}} onClick={()=>setToggleModalRemove(true)}>
                    Remover conta
                </button>
            </div>
            : ""

        }
        <Table columns={columns} data={accountList}/>
    </>
    )
}

export default AccountTable;