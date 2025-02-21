
import { useEffect, useRef, useState } from "react";
import Table from "../../components/Table";
import { useAccountData } from "../../context/accountData";
import { useNodeData } from "../../context/nodesData";
import { useOrganizationData } from "../../context/organizationData";
import { ConvertNameToRoleID, ConvertNodeType, formatOrganization } from "../../util/StringUtils"
import { Fill, Modal } from "../Modal";
import { AccountRulesV2 } from "../../chain/@types";
import { NodeRulesV2 } from "../../chain/@types/NodeRulesV2Impl";

function NodesTable(){
    const {  orgList } = useOrganizationData();
    const { operatorData } = useAccountData();
    const { nodeRulesContract, nodeList } = useNodeData();

    const [toggleModalAdd, setToggleModalAdd] = useState(false);
    const [toggleModalRemove, setToggleModalRemove] = useState(false);
    const [toggleModalUpdate, setToggleModalUpdate] = useState(false);

    const [node, setNode] = useState<NodeRulesV2.NodeDataStructOutput | null>(null)

    useEffect(()=>{

    }, [nodeRulesContract])

    const AddComponent = () =>{
        const nameRef = useRef<HTMLInputElement | null>( null);
        const enodeHighRef = useRef<HTMLTextAreaElement | null>(null);
        const enodeLowRef = useRef<HTMLTextAreaElement | null>(null);
        const nodeType = useRef<HTMLSelectElement | null>(null);


        const _addLocalNode = () =>{
            if(enodeHighRef.current == null || enodeLowRef.current == null 
                || nodeType.current == null || nameRef.current == null ) return;
                
            nodeRulesContract?.addLocalNode(
                enodeHighRef?.current.value, enodeLowRef?.current.value, nodeType.current.value, nameRef?.current.value
            )
        }

        return(
            <Modal title={"Criar Nó"} state={toggleModalAdd} setState={setToggleModalAdd}>
                <Fill>
                    <div>
                        <label htmlFor="name">Nome</label>
                        <input ref={nameRef} id="name" type="text" />
                    </div>
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="">eNode High</label>
                        <textarea ref={enodeHighRef} />
                    </div>
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="">eNode Low</label>
                        <textarea ref={enodeLowRef} />
                    </div>
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="">Tipo de Nó</label>
                        <select ref={nodeType} name="" id="">
                            <option value="0">Boot</option>
                            <option value="1">Validator</option>
                            <option value="2">Writer</option>
                            <option value="3">WriterPartner</option>
                            <option value="4">ObserverBoot</option>
                            <option value="5">Observer</option>
                            <option value="6">Other</option>
                        </select>
                    </div>

                </Fill>

                <Fill>
                    
                    <button onClick={_addLocalNode}>
                        Criar
                    </button>
                </Fill>
            </Modal>
        )
    }

    const _deleteNode = (enodeHigh:string, enodeLow:string) =>{
        nodeRulesContract?.deleteNode(enodeHigh, enodeLow)
    }

    const RemoveComponent = () =>{
        const enodeHigh = useRef<HTMLInputElement | null>(null);
        const enodeLow = useRef<HTMLInputElement | null>(null);


        return (
            <Modal title={"Remover Nó"} state={toggleModalRemove} setState={setToggleModalRemove}>
                <Fill>
                    <label htmlFor="">Enode High</label>
                    <input ref={enodeHigh} type="text" />
                </Fill>
                <Fill>
                    <label htmlFor="">Enode Low</label>
                    <input ref={enodeLow} type="text" />
                </Fill>

                <Fill>
                    <button onClick={() => {
                                if (!enodeHigh.current || !enodeLow.current) return;
                                _deleteNode(enodeHigh.current.value, enodeLow.current.value);
                            }}>
                        Remover
                    </button>
                </Fill>
            </Modal>
        )
    }

    const _updateNode = (enodeHigh:string, enodeLow:string, nodeType:string, name:string, status:string) =>{
        
        if(name != node?.name || nodeType != node.nodeType.toString()){
            nodeRulesContract?.updateLocalNode(enodeHigh, enodeLow, nodeType, name);
        }

        if(status != node?.active.toString()){

            nodeRulesContract?.updateLocalNodeStatus(enodeHigh, enodeLow, status == 'true');
        }
        
    }

    const UpdateComponent = () => {
        const enodeHighRef = useRef<HTMLInputElement | null>(null);
        const enodeLowRef  = useRef<HTMLInputElement | null>(null);
        const nameRef      = useRef<HTMLInputElement | null>(null);
        const nodeTypeRef  = useRef<HTMLSelectElement| null>(null);
        const statusRef    = useRef<HTMLSelectElement| null>(null);

        return (
            <>
                <Modal title={"Atualizar Nó"} setState={setToggleModalUpdate}>
                    <Fill>
                        <label htmlFor="">eNode High</label>
                        <input ref={enodeHighRef} defaultValue={node?.enodeHigh} type="text" readOnly />
                    </Fill>
                    <Fill>
                        <label htmlFor="">eNode Low</label>
                        <input ref={enodeLowRef} defaultValue={node?.enodeLow} type="text" readOnly />
                    </Fill>
                    <Fill>
                        <label htmlFor="">Nome</label>
                        <input ref={nameRef} defaultValue={node?.name} type="text" />
                    </Fill>
                    <Fill>
                        <div>
                            <label htmlFor="tipo">Papel do Nó</label>
                            <select ref={nodeTypeRef} defaultValue={node?.nodeType.toString()} id="tipo" name="tipo" >
                                <option value="0">Boot</option>
                                <option value="1">Validator</option>
                                <option value="2">Writer</option>
                                <option value="3">WriterPartner</option>
                                <option value="4">ObserverBoot</option>
                                <option value="5">Observer</option>
                                <option value="6">Other</option>
                            </select>
                        </div>
                    </Fill>
                    <Fill>
                        <label htmlFor="status">Status</label>
                        <select ref={statusRef} defaultValue={node?.active.toString()} id="status" >
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>

                        </select>
                    </Fill>
                    <Fill>
                        <button onClick={()=>_updateNode(enodeHighRef.current?.value, 
                                                         enodeLowRef.current?.value,
                                                         nodeTypeRef.current?.value,
                                                         nameRef.current?.value,
                                                         statusRef.current?.value)}>
                            Atualizar
                        </button>
                    </Fill>
                    
                </Modal>
        
            </>
        )
    }


    const ActionsComponent = (data:NodeRulesV2.NodeDataStructOutput | undefined) =>{
        if(data == undefined) return;
        return (
            <>
                { 
                    data.orgId == operatorData?.orgId 
                    && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                ? 
                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                    <img width={"16px"} src="/icons/edit.png" onClick={()=> {setNode(data);setToggleModalUpdate(true)}}/>
                    <img width={"16px"} src="/icons/delete.png" onClick={()=>_deleteNode(data.enodeHigh, data.enodeLow)} />

                </div>
                : "―"}
                
            </>
        )
    }

    const columns = [
        {
            'name': 'Nome',
            'value':'name'
        },
        {
            'name':'Organização',
            'value':'orgId',
            'call':(data:any)=>formatOrganization(orgList, data)
        },
        {
            'name':'Tipo',
            'value':'nodeType',
            'call': ConvertNodeType
        },
        {
            'name':'Status',
            'value':'active'
        },
        {
            'name':'Ações',
            'value':'_',
            'component':ActionsComponent
        }
    ]

    return (
    <>
        {
            toggleModalAdd ? <AddComponent/> : ""
        }
        {
            toggleModalRemove ? <RemoveComponent/> : ""
        }

        {
            toggleModalUpdate ? <UpdateComponent/> : ""
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
        <Table columns={columns} data={nodeList}/>
    </>
    )
}

export default NodesTable;