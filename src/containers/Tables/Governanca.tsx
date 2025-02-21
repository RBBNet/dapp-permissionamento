import { BaseSyntheticEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import Table, { TableColumn } from "../../components/Table";
import { ProposalResult, ProposalStatus, useGovernanceData } from "../../context/governancaData";
import { Governance } from "../../chain/@types";

import Web3, { AbiFragment, AbiFunctionFragment, AbiItem, AbiParameter } from "web3";
import { ConvertNameToRoleID, formatTimeDifference, randomString } from "../../util/StringUtils";
import { useAccountData } from "../../context/accountData";
import { useNetwork } from "../../context/network";
import { Block, toNumber } from "ethers";
import * as ContractsABI from "../../chain/ContractsABI";
import { Fill, Modal } from "../Modal";
import ContractChainABI from "../../chain/abis/ContractChainABI";
import { web3Factory } from "../../chain/factory/Web3Factory";
import { useOrganizationData } from "../../context/organizationData";

type DecompiledCalldata = {
    parameters: any;
    address: string;
    function: string;
}

export default function GovernancaTable(){
    const { governanceContract, onUpdate } = useGovernanceData();
    const { orgList } = useOrganizationData();
    const [ proposalList, setProposalList ] = useState<Governance.ProposalDataStructOutput[]>([])
    const { signer } = useNetwork();
    const { operatorData } = useAccountData();
    const [ lastblock, setLastBlock ] = useState<Block | null>(null)
    const [ penultimateBlock, setPenultimateBlock ] = useState<Block | null>(null);
    const [ web3, setWeb3] = useState<Web3| null>(null)
    const [ toggleModalAdd, setToggleModalAdd]   = useState(false);
    const [ toggleModalView, setToggleModalView] = useState(false);

    const [ currentProposal, setCurrentProposal] = useState<Governance.ProposalDataStructOutput>();

    useEffect(()=>{
        if(web3 == null){
            web3Factory().then(result => setWeb3(result));
        }
        if(signer != undefined){
            signer?.provider?.getBlock("latest").then(_lastBlock => {
                if(lastblock == null || lastblock == undefined) return;
                setLastBlock(_lastBlock)
                signer.provider?.getBlock(lastblock.number - 1).then(_penultimateBlock => setPenultimateBlock(_penultimateBlock))
            })

        }

        // MOCK 
        // Implementando a consulta de propostas através do idSeed e ir consultando um por um
        let fetchProposals = async (): Promise<Governance.ProposalDataStructOutput[]> =>{
            return new Promise(resolve =>{
                governanceContract?.getProposals(1, 100).then((proposals) =>{

                    resolve(proposals)
                   
                });
            });
        }
        console.log("Atualiando propostas")
        fetchProposals().then(proposals => {
            setProposalList(proposals)
            if(currentProposal != undefined){
                for(let proposal of proposals){
                    if(proposal.id == currentProposal.id) setCurrentProposal(proposal); break;
                    
                }
            }
        })

    }, [governanceContract, operatorData, onUpdate])

    
    const ActionsComponent = (data: Governance.ProposalDataStructOutput) =>{

        const selectProposal = () =>{
            setCurrentProposal(data)
            setToggleModalView(true)
        }

        return (
            <>

                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                    {
                        toNumber(data.status) == 3 && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE") ?
                        <img width={"16px"} src="/icons/up-arrow.png"/>
                        : ""
                    }
                    {/* <img width={"16px"} src="/icons/delete.png" /> */}
                    <img width={"16px"} src="/icons/view.png" onClick={selectProposal} />
                </div>

                
            </>
        )
    }
    const getContracts = () =>{
        return Object.entries(ContractsABI)
    }

    let getContractMethods = (contract: ContractChainABI) =>{
        return contract.getPublicMethods()
    }

    const AddComponent = () =>{
        const [isCustomContract, setIsCustomContract] = useState(false);
        const [contract, setContract] = useState<ContractChainABI | undefined>();
        const blockInput = useRef<HTMLInputElement | undefined>(undefined)
        const descriptionInput = useRef<HTMLTextAreaElement | undefined>(undefined)

        const contractBuilderRef = useRef(null)


        const createProposal = () =>{
            let address = contract?.address

            governanceContract?.createProposal([address], [contractBuilderRef.current.getValue()], blockInput.current.value, descriptionInput.current.value )
        }

        const ContractCallBuilder = ({ref}:any) =>{

            const [methods, setMethods] = useState<AbiItem[]>([]);
            const methodsRef = useRef<AbiItem[]>([])
            const curMethodIndex = useRef<string | number | undefined>(undefined)
            const [inputs, setInputs] = useState<readonly AbiParameter[]>([])
            const inputsCountRef      = useRef(15)
            const inputsValueRef = useRef({});

            const customAddress = useRef<HTMLInputElement | undefined>();
            const customData    = useRef<HTMLInputElement | undefined>();

            useEffect(()=>{
                if(contract != undefined){
                    let contractMethods = getContractMethods(contract)
                    setMethods(contractMethods)
                    methodsRef.current = contractMethods
                    inputsValueRef.current = {};
                    inputsCountRef.current = 0;
                    setInputs([]);
                }
            }, [contract])
            

            let getMethodInputs = (index: number) => {
                return methods[index].inputs;
            }

            let getValue = () =>{
                if(isCustomContract){

                    return customData.current?.value
                }else{
                    if(curMethodIndex.current == "none"){
                        throw new Error("Método 'none' não suportado")
                    }
    
                    let abi = methodsRef.current[curMethodIndex.current as number]
                    if(Object.keys(inputsValueRef.current).length < inputsCountRef.current){
                        throw new Error("O número de inputs não corresponde aos valores preenchidos")
                    }
                    // console.log(web3?.eth.abi.encodeFunctionCall(abi as AbiFunctionFragment, Object.values(inputsValueRef.current)))
                    return web3?.eth.abi.encodeFunctionCall(abi as AbiFunctionFragment, Object.values(inputsValueRef.current))
                    
                }

            }

            useImperativeHandle(ref, () => {
                return {
                    getValue
                };
            }, []);

            let onChangeMethod = (event: BaseSyntheticEvent)=>{
                curMethodIndex.current = event.target.value
                inputsValueRef.current = {}
                if(event.target.value == "none"){
                    setInputs([]);
                    inputsCountRef.current = 15;
                }else{
                    let _inputs = getMethodInputs(event.target.value)
                    if(_inputs){
                        setInputs(_inputs)
                        inputsCountRef.current = _inputs.length;
                    }
                }
            }

            let onChangeParameter = (name:string, value: string) =>{
                console.log("Atualizando parametro " + name)
                console.log(inputsValueRef)
                inputsValueRef.current = {
                    ...inputsValueRef.current,
                    [name]: value
                };
            }

            return  (
                <>
                    {
                        isCustomContract ? 
                            <>
                                <Fill>
                                    <div>
                                        <label htmlFor="custom_address_contract">Endereço do contrato</label>
                                        <input ref={customAddress} type="text" id="custom_address_contract" />
                                    </div>
                                </Fill>
                                <Fill>
                                    <div>
                                        <label htmlFor="custom_data_contract">Dados de entrada</label>
                                        <input ref={customData} type="text" id="custom_data_contract" />
                                    </div>
                                </Fill>
                            </> 
                        : contract != undefined ?
                            <>
                                <Fill>
                                    <div>
                                        <label htmlFor="contract">Método do contrato</label>
                                        <select name="" id="contract_methods" onChange={onChangeMethod}>
                                            <option value="none">Selecione</option>
                                            {
                                                methods.map((element, index) => <option key={"method_"+index} value={index}>{element.name}</option>)
                                            }
                                        </select>
                                    </div>
                                </Fill>
                                {/* Paramêtros da função selecionada acima */}
                                {
                                    inputs.length > 0 ?
                                        inputs.map((element, index) =>
                                            <Fill key={`parameter_${index}`}>
                                                <label htmlFor={`parameter_${element.name}`}>{element.name}</label>
                                                <input onChange={(event) => onChangeParameter(element.name, event.target.value)} type="text" id={`parameter_${element.name}`} />
                                            </Fill>)
                                    : ""
                                }
                            </> 
                        : ""
                    }
                </>
            )
        }

        const onChangeContract = (event: BaseSyntheticEvent) =>{
            console.log(event.target.value == "custom-contract")
            if(event.target.value == "custom-contract"){
                setIsCustomContract(true)
                setContract(undefined);
            }else{
                setIsCustomContract(false)
                if(event.target.value != "none"){
                    setContract(getContracts()[event.target.value][1])

                }
            }
        }

        return (
            <Modal title={"Criar nova proposta"} state={toggleModalAdd} setState={setToggleModalAdd}>
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
                <Fill>
                    <div>
                        <label htmlFor="contract">Contrato</label>
                        <select  name="" id="contract" onChange={onChangeContract}>
                            <option value="none">Selecione</option>

                            {
                                getContracts().map((element, index) => <option key={index} value={index}>{element[0]}</option>)
                            }
                            <option value="custom-contract">Outro</option>
                        </select>
                    </div>
                </Fill>
                <ContractCallBuilder ref={contractBuilderRef}/>

                <Fill>
                    
                    <button onClick={createProposal}>
                        Criar
                    </button>
                </Fill>
            </Modal>
        )
    }

    const ViewComponent = () =>{
        // console.log(currentProposal)
        const [toggleVotesView, setToggleVotesView] = useState(false);
        const [toggleCallsView, setToggleCallsView] = useState(false);
        const [toggleCancelView, setToggleCancelView] = useState(false);
        const [operatorVoted, setOperatorVoted] = useState(false);
        useEffect(()=>{
            setOperatorVoted(verifyOperatorVote());
        }, [onUpdate])

        const convertVoteStatus = (status: number) =>{
            switch(status){
                case 0:
                    return "Não votado"
                case 1:
                    return "Aprovado"
                case 2:
                    return "Reprovado"
            }
        }

        const VotesView = () =>{

            return (
                <Modal title={"Votos"} setState={()=>setToggleVotesView(false)}>
                    <Fill>
                        <table className="custom">
                            <thead>
                                <tr>
                                    <td>
                                        Organização
                                    </td>
                                    <td>
                                        Status do Voto
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentProposal?.organizations.map((organization, index) => 
                                        <tr key={`${organization}`}>
                                            <td>
                                                {
                                                //    {orgList.find(org => org.id === toNumber(organization))}
                                                    orgList.find(org => org.id === toNumber(organization))?.name
                                                }
                                            </td>
                                            <td>
                                                {
                                                    convertVoteStatus(toNumber(currentProposal?.votes[index]))
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                    </Fill>
                    <></>
                </Modal>
            )
        }

        const CallsView = () =>{
            const [calldatasDecompiled, setCalldatasDecompiled] = useState<DecompiledCalldata[]>([]);

            const tryToDecompileCalldata = () =>{
                if(currentProposal == undefined || web3 == undefined) return;
                // Pega os contratos e suas ABI conhecidos
                let contracts = getContracts();
                let calldatas = []
                // Passar por cada contrato e call data
                for(let i = 0 ; i < currentProposal.targets.length; i++){
                    let calldata = currentProposal.calldatas[i];
                    let address  = currentProposal.targets[i];
                    let contractOnChain = undefined
                    // Identificar o contrato com base no endereço
                    for(var contract of contracts){
                        if(contract[1].address.toLowerCase() === address.toLowerCase()){
                            contractOnChain = contract;
                        }
                    }

                    if(!contractOnChain) continue;

                    let abi = contractOnChain[1].abi;
                    let selector = calldata.slice(0, 10);
                    let paramsData = "0x" + calldata.slice(10);
            

                    // Compilar cada função do contrato e comparar com a da calldata
                    for (let func of abi) {
                        if (!func.name || !func.inputs) continue;
                        
                        let functionSignature = `${func.name}(${func.inputs.map(input => input.type).join(",")})`;
                        let functionSelector = web3.utils.keccak256(functionSignature).slice(0, 10);
                        
                        if (functionSelector === selector) {
                            console.log(`Function Found: ${functionSignature}`);
                            
                            try {
                                let decodedParams = web3.eth.abi.decodeParameters(func.inputs, paramsData);
                                calldatas.push({function:functionSignature, parameters:  decodedParams, address} );
                            } catch (error) {
                                console.log("Error decoding params:", error);
                            }
                            break;
                        }
                    }
                }
                setCalldatasDecompiled(calldatas);
             
            }

            useEffect(()=>{
                tryToDecompileCalldata();
            }, [])

            

            return (
                <Modal title={"Chamadas"} setState={()=>setToggleCallsView(false)}>
                    <Fill>
                        <table className="custom">
                            <thead>
                                <tr>
                                    <td>
                                        Chamada
                                    </td>
                                    <td>
                                        Endereço
                                    </td>
                                    <td>
                                        Dados
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    calldatasDecompiled.map((calldata, index) => 
                                        <tr key={`${index}`}>
                                            <td>
                                                {
                                                    calldata.function
                                                }
                                            </td>
                                            <td>
                                                {
                                                    calldata.address
                                                }
                                            </td>
                                            <td>
                                                {
                                                    Object.keys(calldata.parameters).slice(0, Object.keys(calldata.parameters).length / 2).map(parameter => `${calldata.parameters[parameter].toString()},`)
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                    </Fill>
                    <></>
                </Modal>
            )
        }

        const OperatorVoteView = () =>{

            const Vote = (status: boolean) =>{
                governanceContract?.castVote(currentProposal?.id, status);
            }

            return (
                <>
                    <Fill>
                        <hr/>

                    </Fill>
                    <Fill>
                        <button onClick={()=>Vote(true)}>
                            Aprovar
                        </button>
                    </Fill>
                    <Fill>
                        <button onClick={()=>Vote(false)}>
                            Reprovar
                        </button>
                    </Fill>
                </>
            )
        }

        const CancelView = () =>{
            const reasonRef = useRef<any>();

            const cancelProposal = () =>{
                governanceContract?.cancelProposal(currentProposal?.id, reasonRef.current.value)
            }

            return (
                <Modal title="Cancelar proposta" setState={setToggleCancelView}>
                    <Fill>
                        <div>
                            <label htmlFor="cancel_proposal">Motivo</label>
                            <textarea ref={reasonRef} id="cancel_proposal"></textarea>
                        </div>
                    </Fill>
                    <Fill>
                        <button onClick={()=>cancelProposal()}>
                            Cancelar proposta
                        </button>
                    </Fill>
                </Modal>
            )
        }

        const operatorIsCreator = () : (number | undefined) =>{
            if(currentProposal == undefined) return undefined;
            for(let i = 0; i < currentProposal?.organizations.length; i++)
            {
                if(currentProposal?.organizations[i] == operatorData?.orgId){

                    return i
                }
            }
            console.log("Não encontrado")
            return undefined
        }

        const verifyOperatorVote = () =>{
            if(currentProposal == undefined) return false;
            
            let index = operatorIsCreator()
            if(index == undefined) return false;

            if(toNumber(currentProposal?.votes[index]) == 0){
                return true
            }else{
                return false
            }
        }

        return (
            <>
                <Modal title={"Proposta"} setState={setToggleModalView}>
                    <div>
                        <label htmlFor="">ID</label>
                        <input type="text" readOnly defaultValue={`${currentProposal?.id}`} />   
                    </div>
                    <div>
                        <label htmlFor="">Autor</label>
                        <input type="text" readOnly defaultValue={`${currentProposal?.creator}`} />
                    </div>
                    <Fill>
                        <div>
                            <label htmlFor="">Descrição</label>
                            <textarea style={{height:"120px"}} defaultValue={`${currentProposal?.description}`} name="" id="" readOnly></textarea>
                        </div>
                    </Fill>
                    <div>
                        <label htmlFor="">Duração de blocos</label>
                        <input type="text" readOnly defaultValue={`${currentProposal?.blocksDuration}`} />
                    </div>
                    <div>
                        <label htmlFor="">Criado no bloco</label>
                        <input type="text" readOnly defaultValue={`${currentProposal?.creationBlock}`} />
                    </div>
                    <Fill>
                        <button onClick={()=>setToggleVotesView(true)}>
                            Ver votos
                        </button>
                    </Fill>
                    <Fill>
                        <button onClick={()=>setToggleCallsView(true)}>
                            Ver chamadas
                        </button>
                    </Fill>
                    { 
                        operatorVoted ?
                        <OperatorVoteView/> : ""
                    }
                    {
                        operatorIsCreator() != undefined && currentProposal?.status == 1 ?
                        <Fill>
                        <button onClick={()=>setToggleCancelView(true)}>
                            Cancelar
                        </button>
                        </Fill> : ""
                    }
                </Modal>
                { toggleCancelView ? <CancelView/> : ""}
                { toggleCallsView ? <CallsView/> : "" }
                { toggleVotesView ? <VotesView/> : "" }
            </>
        )
    }

    const statusConvert = (status: bigint): string | JSX.Element =>{
        let proposalStatus = toNumber(status) as ProposalStatus
        switch(proposalStatus){
            case ProposalStatus.Active:
                return "Ativo"
            case ProposalStatus.Executed:
                return 'Executado'
            case ProposalStatus.Finished:
                return 'Finalizado'
            case ProposalStatus.Cancelled:
                return 'Cancelado'
            case ProposalStatus.Undefined:
            default:
                return 'Desconhecido'
        }
    }

    const resultConvert = (status: bigint): string =>{
        let proposalResult = toNumber(status) as ProposalResult
        switch(proposalResult){
            case ProposalResult.Approved:
                return 'Ativo'
            case ProposalResult.Rejected:
                return 'Executado'
            case ProposalResult.Undefined:
            default:
                return 'Aguardando'
        }
    }

    const calculateRemainingTime = (block: Governance.ProposalDataStructOutput) : string =>{
        if(!lastblock || !penultimateBlock ) return "Indisponível"
        let mediumTimeBlock = 4;// lastblock.timestamp - penultimateBlock.timestamp;
        
        // console.log("Tempo médio entre blocos: " + mediumTimeBlock)
        // console.log(lastblock.timestamp)
        // console.log(penultimateBlock.timestamp)

        let lastBlockToVote = toNumber(block.creationBlock + block.blocksDuration);
        if(lastBlockToVote < lastblock.number){
            return "Encerrado";
        }

        let remainingBlocks = lastBlockToVote - lastblock.number;

        return "~"+formatTimeDifference(remainingBlocks * mediumTimeBlock);
    }

    const columns : TableColumn[] = [
        {
            'name': 'ID',
            'value':'id',
        },
        {
            'name':'Autor',
            'value':'creator'
        },
        {
            'name':'Descrição',
            'value':'description',
        },
        {
            'name':'Tempo restante',
            'value':'creationBlock',
            'component': calculateRemainingTime
        },
        {
            'name':'Status',
            'value':'status',
            'call': statusConvert
        },
        {
            'name':'Resultado',
            'value':'result',
            'call': resultConvert
        },
        {
            'name':'Ações',
            'value':"_",
            'component':ActionsComponent
        }
    ]
    
    return (
        <>
            { toggleModalAdd ? <AddComponent/> : ""}
            { toggleModalView ? <ViewComponent/> : ""}

            {
                operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE") ?
                <div style={{display:"flex", flexDirection:"row-reverse", gap:"10px"}}>
                    <button style={{padding:'10px'}} onClick={()=>setToggleModalAdd(true)}>
                        Criar proposta
                    </button>
                </div>
                : ""
    
            }
            <Table columns={columns} data={proposalList}/>
        </>
    )
}