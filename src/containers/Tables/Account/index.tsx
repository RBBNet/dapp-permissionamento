
import Table from "../../../components/Table";
import { PAGE_SIZE, useAccountData } from "../../../context/accountData";
import { ConvertNameToRoleID, ConvertRoleID } from "../../../util/StringUtils"
import {Modal, Fill} from "../../../components/Modal";
import { useEffect, useRef, useState } from "react";

import { useOrganizationData } from "../../../context/organizationData";
import { AccountRulesV2 } from "../../../chain/@types";

import { formatOrganization } from "../../../util/StringUtils";
import AddComponent from "./AddComponent";
import UpdateComponent from "./UpdateComponent";
import Pagination from "@/components/Pagination";
import DeleteComponent from "./DeleteComponent";

function AccountTable(){
    const { accountRulesContract, operatorData, onUpdate, accountsCount, getPage } = useAccountData();
    const { orgList } = useOrganizationData();

    getPage(1).then(result => console.log(result))

    const [toggleModalAdd, setToggleModalAdd] = useState(false);
    
    const [toggleModalUpdate, setToggleModalUpdate] = useState(false);
    const [toggleModalRemove, setToggleModalRemove] = useState(false);

    const [ currentPage, setCurrentPage ] = useState(1)

    const [accountList, setAccountList] = useState<AccountRulesV2.AccountDataStructOutput[]>([])
    const [updateData, setUpdateData] = useState<AccountRulesV2.AccountDataStructOutput | undefined>();

    const [readonlyView, setReadonlyView] = useState(false)
    
    useEffect(()=>{
        
        if(accountRulesContract){
            getPage(currentPage).then(accounts => {
                if(!accounts) return;
                setAccountList(accounts)
                
            })

        }
    }, [currentPage])

    useEffect(()=>{
        if(accountRulesContract)
            getPage(currentPage).then(accounts=>{
                if(accounts != undefined)
                setAccountList(accounts);
            }).catch(exception =>{
                console.log(exception)
            })
    }, [ onUpdate])

    function updateAccount(data: any | undefined){
        if(!data) return;

        setReadonlyView(false)

        setToggleModalUpdate(true)
        setUpdateData(data)
    }

    function viewAccount(data: any | undefined){
        if(!data) return;

        setReadonlyView(true)

        setToggleModalUpdate(true)
        setUpdateData(data)
    }

    
    const deleteAccount = (acc:string) =>{
        accountRulesContract!.deleteLocalAccount(acc).catch(error =>{
            alert("Falha ao deletar conta local. Error : \n" + error)
        })
    }

    const ActionsComponent = (data: any) =>{
        return (
            <>
                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                <img width={"16px"} src="/icons/view.png" onClick={()=>viewAccount(data)} />
                    { 
                        data.orgId == operatorData?.orgId 
                        && data.roleId !=  "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                        && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                    ? 
                    <>
                        <img width={"16px"} src="/icons/edit.png" onClick={()=>updateAccount(data)} />
                        <img width={"16px"} src="/icons/delete.png" onClick={()=>deleteAccount(data.account)} />
                        {/* <img width={"16px"} src="/icons/blocked.png" /> */}
                    </>
                    : ""}
                
                </div>
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
            'call': (hash:string)=> hash.substring(0, 6) + "..." + hash.substring(hash.length - 4, hash.length)
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
            toggleModalAdd ? <AddComponent toggleModal={toggleModalAdd} setToggleModal={setToggleModalAdd}/> : ""
        }
        { 
            toggleModalUpdate ? <UpdateComponent readonly={readonlyView} updateData={updateData} toggleModal={toggleModalUpdate} setToggleModal={setToggleModalUpdate}/> : "" 
        }
        {
            toggleModalRemove ? <DeleteComponent toggleModal={toggleModalRemove} setToggleModal={setToggleModalRemove}/> : ""
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

           {
                accountsCount > PAGE_SIZE ?
                    <Pagination changePage={setCurrentPage} totalPages={Math.ceil(accountsCount / PAGE_SIZE)}/>
                : ""
            }
    </>
    )
}

export default AccountTable;