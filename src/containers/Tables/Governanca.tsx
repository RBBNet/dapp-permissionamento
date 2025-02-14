import { useEffect, useState } from "react";
import Table, { TableColumn } from "../../components/Table";
import { ProposalResult, ProposalStatus, useGovernanceData } from "../../context/governancaData";
import { Governance } from "../../chain/@types";
import { ethers, toNumber } from "ethers";
import { BigNumberish } from "ethers";
import Web3, { AbiFunctionFragment } from "web3";
import AccountABI from "../../chain/abis/AccountRulesV2Impl.json"
import { ConvertNameToRoleID, formatTimeDifference } from "../../util/StringUtils";
import { useAccountData } from "../../context/accountData";
import { useNetwork } from "../../context/network";
import { Block } from "ethers";
import { Fill, Modal } from "../Modal";

function findCallData(name: string) : AbiFunctionFragment | null{

    for(let data of AccountABI.abi){
        if(data.name == name){
            return data
        }
    }
    return null;
}

export default function GovernancaTable(){
    const { governanceContract } = useGovernanceData();
    const [proposalList, setProposalList] = useState<Governance.ProposalDataStructOutput[]>([])
    const { signer} = useNetwork();
    const { operatorData } = useAccountData();
    const [lastblock, setLastBlock] = useState<Block | null>(null)
    const [penultimateBlock, setPenultimateBlock] = useState<Block | null>(null);

    const [toggleModalAdd, setToggleModalAdd] = useState(false);


    useEffect(()=>{
        const Web = new Web3(window.ethereum);
        if(signer != undefined){
            signer?.provider?.getBlock("latest").then(_lastBlock => {
                setLastBlock(_lastBlock)
                signer.provider?.getBlock(toNumber(_lastBlock?.number) - 1).then(_penultimateBlock => setPenultimateBlock(_penultimateBlock))
            })

        }

        // const abi = findCallData("updateLocalAccount");
        // if(abi != null){
        //     const encodedData = Web.eth.abi.encodeFunctionCall(abi, [
        //         "0x6Ec59e9aD092Ad5DC9c451B1CE7e6BcdBd1eD492",
        //         "0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8",
        //         "0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8"
        //     ]);
        // }
        
        // MOCK 
        // Implementando a consulta de propostas através do idSeed e ir consultando um por um
        let fetchProposals = async (): Promise<Governance.ProposalDataStructOutput[]> =>{
            return new Promise(resolve =>{
                governanceContract?.idSeed().then(async quantity =>{
                    let proposals: Governance.ProposalDataStructOutput[] = []
                    for(let i = 1; i <= toNumber(quantity); i++){
                        let proposal = await governanceContract?.getProposal(i)

                        if(proposal == undefined) break;
                        proposals.push(proposal)
                    }

                    resolve(proposals)
                   
                });
            });
        }

        fetchProposals().then(proposals => setProposalList(proposals))

    }, [governanceContract, operatorData])

    
    const ActionsComponent = (data: any) =>{
        return (
            <>

                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                    <img width={"16px"} src="/icons/up-arrow.png"/>
                    {/* <img width={"16px"} src="/icons/delete.png" /> */}
                    <img width={"16px"} src="/icons/view.png" />
                </div>

                
            </>
        )
    }

    const AddComponent = () =>{


        return (
            <Modal title={"Criar nova proposta"} state={toggleModalAdd} setState={setToggleModalAdd}>
                <Fill>
                    <div>
                        <label htmlFor="name">Nome</label>
                        <input id="name" type="text" />
                    </div>
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="">eNode High</label>
                        <textarea />
                    </div>
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="">eNode Low</label>
                        <textarea/>
                    </div>
                </Fill>
                <Fill>
                    <div>
                        <label htmlFor="">Tipo de Nó</label>
                        <select  name="" id="">
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
                    
                    <button>
                        Criar
                    </button>
                </Fill>
            </Modal>
        )
    }

    const statusConvert = (status: bigint): string =>{
        let proposalStatus = toNumber(status) as ProposalStatus
        switch(proposalStatus){
            case ProposalStatus.Active:
                return 'Ativo'
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

    const calculateRemainingTime = (block: Governance.ProposalDataStructOutput) : string =>{
        if(!lastblock || !penultimateBlock ) return "Indisponível"
        let mediumTimeBlock = 4;// lastblock.timestamp - penultimateBlock.timestamp;
        
        console.log("Tempo médio entre blocos: " + mediumTimeBlock)
        console.log(lastblock.timestamp)
        console.log(penultimateBlock.timestamp)

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
            'name':'Ações',
            'value':"_",
            'component':ActionsComponent
        }
    ]
    
    return (
        <>
            { toggleModalAdd ? <AddComponent/> : ""}

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