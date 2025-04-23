import { useEffect, useState } from "react";
import Table, { TableColumn } from "@components/Table";
import { ProposalResult, ProposalStatus, useGovernanceData, PAGE_SIZE } from "@/context/governancaData";
import { Governance } from "@chain/@types";

import { ConvertNameToRoleID, formatTimeDifference } from "@util/StringUtils";
import { useAccountData } from "@/context/accountData";
import { useNetwork } from "@/context/network";
import { Block, toNumber } from "ethers";

import AddComponent from "./AddComponent";
import { Web3Provider } from "@/context/web3Data";
import ViewComponent from "./ViewComponent";
import { useOrganizationData } from "@/context/organizationData";

import Pagination from "@/components/Pagination";

export default function GovernancaTable(){
    const { governanceContract, onUpdate, getPage, proposalsCount } = useGovernanceData();
    const { orgList } = useOrganizationData()
    
    const [ proposalList, setProposalList ] = useState<Governance.ProposalDataStructOutput[]>([])
    const { signer } = useNetwork();
    const { operatorData } = useAccountData();
    const [ lastblock, setLastBlock ] = useState<Block | null>(null)
    const [ penultimateBlock, setPenultimateBlock ] = useState<Block | null>(null);

    const [ toggleModalAdd, setToggleModalAdd]   = useState(false);
    const [ toggleModalView, setToggleModalView] = useState(false);

    const [ currentProposal, setCurrentProposal] = useState<Governance.ProposalDataStructOutput>();

    const [ currentPage, setCurrentPage ] = useState(1)

    useEffect(()=>{
        
        if(governanceContract){
            console.log(proposalsCount)
            getPage(currentPage).then(proposals => {
                if(!proposals) return;
                setProposalList(proposals)
                if(currentProposal != undefined){
                    for(let proposal of proposals){
                        if(proposal.id == currentProposal.id) setCurrentProposal(proposal); break;
                    }
                }
            })

        }
    }, [currentPage])

    useEffect(()=>{

        if(signer != undefined){
            signer?.provider?.getBlock("latest").then(_lastBlock => {
                if(lastblock == null || lastblock == undefined) return;
                setLastBlock(_lastBlock)
                signer.provider?.getBlock(lastblock.number - 1).then(_penultimateBlock => setPenultimateBlock(_penultimateBlock))
            })

        }

        if(governanceContract)
            getPage(currentPage).then(proposals => {
                if(!proposals) return;
                setProposalList(proposals)
                if(currentProposal != undefined){
                    for(let proposal of proposals){
                        if(proposal.id == currentProposal.id) setCurrentProposal(proposal); break;
                        
                    }
                }
            })

    }, [governanceContract, operatorData, onUpdate])

    const executeProposal = (data: Governance.ProposalDataStructOutput) =>{
        governanceContract?.executeProposal(data.id)
    }
    
    const ActionsComponent = (data: Governance.ProposalDataStructOutput) =>{

        const selectProposal = () =>{
            setCurrentProposal(data)
            setToggleModalView(true)
        }

        return (
            <>

                <div style={{display:"flex", flexDirection:"row",gap:"4px", justifyContent:"center"}}>
                    {
                        toNumber(data.status) == 2 && operatorData?.roleId == "0x"+ConvertNameToRoleID("GLOBAL_ADMIN_ROLE") ?
                        <img width={"16px"} src="/icons/up-arrow.png" onClick={()=>executeProposal(data)}/>
                        : ""
                    }
                    {/* <img width={"16px"} src="/icons/delete.png" /> */}
                    <img width={"16px"} src="/icons/view.png" onClick={selectProposal} />
                </div>

                
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

    const orgConvert = (orgId: number) =>{
        return orgList.find(org => orgId == org.id)?.name
    }

    const calculateRemainingTime = (block: Governance.ProposalDataStructOutput) : string =>{
        if(!lastblock || !penultimateBlock ) return "Indisponível"
        let mediumTimeBlock = 4;// lastblock.timestamp - penultimateBlock.timestamp;

        let lastBlockToVote = toNumber(block.creationBlock + block.blocksDuration);
        if(lastBlockToVote < lastblock.number){
            return "Encerrado";
        }

        let remainingBlocks = lastBlockToVote - lastblock.number;

        return "~"+formatTimeDifference(remainingBlocks * mediumTimeBlock);
    }

    const sliceDescription = (desc: string) =>{
        let text = desc.slice(0, 20);
        if(text.length < 20){
            return text
        }else{
            return text + "...";
        }

    }

    const columns : TableColumn[] = [
        {
            'name': 'ID',
            'value':'id',
        },
        {
            'name':'Autor',
            'value':'proponentOrgId',
            'call':orgConvert
        },
        {
            'name':'Descrição',
            'value':'description',
            'call':sliceDescription,
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
            { toggleModalAdd ? <AddComponent toggleModal={toggleModalAdd} setToggleModal={setToggleModalAdd}/> : ""}
            { toggleModalView ? <Web3Provider>
                <ViewComponent setToggleModal={setToggleModalView} proposal={currentProposal}/>
            </Web3Provider> : ""}

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

            {
                proposalsCount > PAGE_SIZE ?
                    <Pagination changePage={setCurrentPage} totalPages={Math.ceil(proposalsCount / PAGE_SIZE)}/>
                : ""
            }
        </>
    )
}