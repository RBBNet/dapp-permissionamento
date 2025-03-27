import { formatCNPJ } from "@/util/StringUtils";
import Table from "../../components/Table";
import { useOrganizationData } from "../../context/organizationData";



function OrganizationTable(){
    const { orgList } = useOrganizationData();

    const columns = [
        {
            'name': 'ID',
            'value':'id'
        },
        {
            'name':'Nome',
            'value':'name'
        },
        {
            'name':'CNPJ',
            'value':'cnpj',
            'call': (data:string) => formatCNPJ(data)
        },
        {
            'name':'Papel',
            'value':'orgType'
        },
        {
            'name':'Pode votar',
            'value':'canVote',
            'call':(data:boolean)=> data ? "Sim" : "Não" 
        }
    ]

    return (
    <>
        <Table columns={columns} data={orgList}/>
    </>
    )
}

export default OrganizationTable;