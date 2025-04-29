
import { useEffect, useRef, useState } from "react";
import Table from "../../components/Table";
import { useAccountData } from "../../context/accountData";
import { PAGE_SIZE,useNodeData } from "../../context/nodesData";
import { useOrganizationData } from "../../context/organizationData";
import { ConvertNameToRoleID, ConvertNodeType, formatOrganization } from "../../util/StringUtils"
import { Fill, Modal } from "../../components/Modal";
import { NodeRulesV2 } from "../../chain/@types/NodeRulesV2Impl";
 import { Nodes as NodeRulesABI} from "../../chain/ContractsABI"
import { showErrorMessage } from "@/util/ContractUtils";
import Pagination from "@/components/Pagination";

type UpdateComponentProps = {
    readonly: boolean;
}

function NodesTable(){
    const {  orgList } = useOrganizationData();
    const { operatorData } = useAccountData();
    const { nodeRulesContract,  getPage, nodesCount, onUpdate } = useNodeData();

    const [toggleModalAdd, setToggleModalAdd] = useState(false);
    const [toggleModalRemove, setToggleModalRemove] = useState(false);
    const [toggleModalUpdate, setToggleModalUpdate] = useState(false);
    const [readonlyView, setReadonlyView] = useState(false);

    const [nodeList, setNodeList] = useState<NodeRulesV2.NodeDataStruct[]>([])
    const [node, setNode] = useState<NodeRulesV2.NodeDataStructOutput | null>(null)

    const [ currentPage, setCurrentPage ] = useState(1)

    useEffect(()=>{     
        if(nodeRulesContract){
            getPage(currentPage).then(proposals => {
                if(!proposals) return;
                setNodeList(proposals)
            })
        }
    }, [currentPage])
    // console.log(nodeList)
    useEffect(()=>{     
        if(nodeRulesContract){
            getPage(currentPage).then(proposals => {
                if(!proposals) return;
                setNodeList(proposals)
            })
        }
    }, [nodeRulesContract, onUpdate])

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
            ).catch(error =>{
                showErrorMessage("Falha ao adicionar novo nó local. ", error, NodeRulesABI)
            }).then(()=> setToggleModalAdd(false))
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
        nodeRulesContract?.deleteLocalNode(enodeHigh, enodeLow).catch(error =>{
            showErrorMessage("Falha ao remover nó local.", error, NodeRulesABI)
        }).then(()=>setToggleModalRemove(false))
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

    const _updateNode = async (enodeHigh:string, enodeLow:string, nodeType:string, name:string, status:string) =>{
        
        try{
            if(name != node?.name || nodeType != node.nodeType.toString()){
                await nodeRulesContract?.updateLocalNode(enodeHigh, enodeLow, nodeType, name);
            }
    
            if(status != node?.active.toString()){
    
                await nodeRulesContract?.updateLocalNodeStatus(enodeHigh, enodeLow, status == 'true');
            }
        }catch(ex){
            showErrorMessage("Falha ao atualizar nó local.", ex, NodeRulesABI)
        }
        setToggleModalUpdate(false)
        
    }

    const UpdateComponent = ({readonly} : UpdateComponentProps) => {
        const enodeHighRef = useRef<HTMLInputElement | null>(null);
        const enodeLowRef  = useRef<HTMLInputElement | null>(null);
        const nameRef      = useRef<HTMLInputElement | null>(null);
        const nodeTypeRef  = useRef<HTMLSelectElement| null>(null);
        const statusRef    = useRef<HTMLSelectElement| null>(null);

        return (
            <>
                <Modal title={!readonly ? "Atualizar Nó" : "Nó"} setState={setToggleModalUpdate}>
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
                            <input ref={nameRef} defaultValue={node?.name} type="text" readOnly={readonly} />
                        </Fill>
                        <Fill>
                            <div>
                                <label htmlFor="tipo">Papel do Nó</label>
                                <select ref={nodeTypeRef} defaultValue={node?.nodeType.toString()} id="tipo" name="tipo" disabled={readonly}>
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
                            <select ref={statusRef} defaultValue={node?.active.toString()} id="status" disabled={readonly} >
                                <option value="true">Ativo</option>
                                <option value="false">Inativo</option>

                            </select>
                        </Fill>
                        {
                            !readonly ? 
                            <Fill>
                                <button onClick={()=>_updateNode(enodeHighRef.current!.value, 
                                                                enodeLowRef.current!.value,
                                                                nodeTypeRef.current!.value,
                                                                nameRef.current!.value,
                                                                statusRef.current!.value)}>
                                    Atualizar
                                </button>
                            </Fill>  
                            : ""  
                        }


                    
                    
                    
                </Modal>
        
            </>
        )
    }

    const updateNode = (data: NodeRulesV2.NodeDataStructOutput | undefined) =>{
        if(!data) return;
        setReadonlyView(false)

        setNode(data);
        setToggleModalUpdate(true)
    }

    const viewNode = (data: NodeRulesV2.NodeDataStructOutput | undefined) =>{
        if(!data) return;

        setReadonlyView(true)

        
        setNode(data);
        setToggleModalUpdate(true)
    }

    const ActionsComponent = (data:NodeRulesV2.NodeDataStructOutput | undefined) =>{
        if(data == undefined) return;
        return (
            <>
                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                    <img width={"16px"} src="/icons/view.png" onClick={()=>viewNode(data)} />
                    { 
                        data.orgId == operatorData?.orgId 
                        && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE")
                    ? 
                    <>
                        <img width={"16px"} src="/icons/edit.png" onClick={()=> {updateNode(data)}} />
                        <img width={"16px"} src="/icons/delete.png" onClick={()=>_deleteNode(data.enodeHigh, data.enodeLow)} />
                    </>

                    : ""}
                </div>
                
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
            toggleModalUpdate ? <UpdateComponent readonly={readonlyView} /> : ""
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

        {
            nodesCount > PAGE_SIZE ?
                <Pagination changePage={setCurrentPage} totalPages={Math.ceil(nodesCount / PAGE_SIZE)}/>
            : ""
        }
    </>
    )
}

export default NodesTable;