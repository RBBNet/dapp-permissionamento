import Table from "../../components/Table";
import { useOrganizationData } from "../../context/organizationData";



function OrganizationTable(){
    const { orgList } = useOrganizationData();
    console.log(orgList)
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