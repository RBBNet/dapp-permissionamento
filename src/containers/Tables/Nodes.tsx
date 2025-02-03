
import Table from "../../components/Table";
import { useAccountData } from "../../context/accountData";
import { useNodeData } from "../../context/nodesData";
import { ConvertNodeType } from "../../util/StringUtils"

function NodesTable(){
    const { nodeList } = useNodeData();
    console.log(nodeList)

    const columns = [
        {
            'name': 'Nome',
            'value':'name'
        },
        {
            'name':'Organização',
            'value':'orgId'
        },
        {
            'name':'Tipo',
            'value':'nodeType',
            'call': ConvertNodeType
        },
        {
            'name':'Status',
            'value':'active'
        }
    ]

    return (
    <>
        <Table columns={columns} data={nodeList}/>
    </>
    )
}

export default NodesTable;