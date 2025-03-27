import { Governance } from "@/chain/@types/Governance";
import { getContracts } from "@/chain/ContractsABIUtils";
import { Modal, Fill } from "@/components/Modal";
import { useAccountData } from "@/context/accountData";
import { useGovernanceData } from "@/context/governancaData";
import { useOrganizationData } from "@/context/organizationData";
import { useWeb3 } from "@/context/web3Data";
import { ConvertNameToRoleID } from "@/util/StringUtils";
import { toNumber } from "ethers";
import { useState, useEffect, useRef } from "react";


type DecompiledCalldata = {
    parameters: any;
    address: string;
    function: string;
    failToDecompile?: boolean;
}

type Props = {
    proposal: Governance.ProposalDataStructOutput | undefined
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ViewComponent({proposal, setToggleModal}:Props){
    const { orgList } = useOrganizationData();
    const { governanceContract, onUpdate } = useGovernanceData();
    const {Web3} = useWeb3();
    const [toggleVotesView, setToggleVotesView] = useState(false);
    const [toggleCallsView, setToggleCallsView] = useState(false);
    const [toggleCancelView, setToggleCancelView] = useState(false);
    const [operatorVoted, setOperatorVoted] = useState(false);

    const { operatorData } = useAccountData();
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
                                proposal?.organizations.map((organization, index) => 
                                    <tr key={`${organization}`}>
                                        <td>
                                            {
                                            //    {orgList.find(org => org.id === toNumber(organization))}
                                                orgList.find(org => org.id === toNumber(organization))?.name
                                            }
                                        </td>
                                        <td>
                                            {
                                                convertVoteStatus(toNumber(proposal?.votes[index]))
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
            if(proposal == undefined || Web3 == undefined) return;
            // Pega os contratos e suas ABI conhecidos
            let contracts = getContracts();
            let calldatas: DecompiledCalldata[] = []
            // Passar por cada contrato e call data
            for(let i = 0 ; i < proposal.targets.length; i++){
                let calldata = proposal.calldatas[i];
                let address  = proposal.targets[i];
                let contractOnChain = undefined
                // Identificar o contrato com base no endereço
                for(var contract of contracts){
                    if(contract[1].address.toLowerCase() === address.toLowerCase()){
                        contractOnChain = contract;
                    }
                }

                if(!contractOnChain) {
                    calldatas.push({parameters: [calldata], address, function:"Desconhecida", failToDecompile:true})
                    continue
                }

                let abi = contractOnChain[1].abi;
                let selector = calldata.slice(0, 10);
                let paramsData = "0x" + calldata.slice(10);
        

                // Compilar cada função do contrato e comparar com a da calldata
                for (let func of abi) {
                    if (!func.name || !func.inputs) continue;
                    
                    let functionSignature = `${func.name}(${func.inputs.map(input => input.type).join(",")})`;
                    let functionSelector = Web3.utils.keccak256(functionSignature).slice(0, 10);
                    
                    if (functionSelector === selector) {
                        console.log(`Function Found: ${functionSignature}`);
                        
                        try {
                            let decodedParams = Web3.eth.abi.decodeParameters(func.inputs, paramsData);
                            calldatas.push({function:functionSignature, parameters:  decodedParams, address} );
                        } catch (error) {
                            calldatas.push({parameters: [calldata], address, function:"Falha ao decodificar", failToDecompile:true})
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

        
        console.log(calldatasDecompiled.length)
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
                                                calldata.failToDecompile ? calldata.parameters :
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
            governanceContract?.castVote(proposal?.id, status);
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
            governanceContract?.cancelProposal(proposal?.id, reasonRef.current.value)
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
        if(proposal == undefined) return undefined;
        for(let i = 0; i < proposal?.organizations.length; i++)
        {
            if(proposal?.organizations[i] == operatorData?.orgId){

                return i
            }
        }
        console.log("Não encontrado")
        return undefined
    }

    const verifyOperatorVote = () =>{
        if(proposal == undefined) return false;
        
        let index = operatorIsCreator()
        if(index == undefined) return false;

        if(toNumber(proposal?.votes[index]) == 0){
            return true
        }else{
            return false
        }
    }

    return (
        <>
            <Modal title={"Proposta"} setState={setToggleModal}>
                <div>
                    <label htmlFor="">ID</label>
                    <input type="text" readOnly defaultValue={`${proposal?.id}`} />   
                </div>
                <div>
                    <label htmlFor="">Autor</label>
                    <input type="text" readOnly defaultValue={`${proposal?.creator}`} />
                </div>
                <Fill>
                    <div>
                        <label htmlFor="">Descrição</label>
                        <textarea style={{height:"120px"}} defaultValue={`${proposal?.description}`} name="" id="" readOnly></textarea>
                    </div>
                </Fill>
                <div>
                    <label htmlFor="">Duração de blocos</label>
                    <input type="text" readOnly defaultValue={`${proposal?.blocksDuration}`} />
                </div>
                <div>
                    <label htmlFor="">Criado no bloco</label>
                    <input type="text" readOnly defaultValue={`${proposal?.creationBlock}`} />
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
                    operatorIsCreator() != undefined && proposal?.status == 1 && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE") ?
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