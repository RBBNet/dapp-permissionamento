import NodesTable from "../../../containers/Tables/Nodes";
import { NodeDataProvider } from "../../../context/nodesData";
import styles from "../page.module.css"
function Nos(){

    

    return (
        <div className={styles.content}>
            <div className={styles.items}>
                <h1>
                    Nós
                </h1>
                <NodeDataProvider>
                    <NodesTable/>
                </NodeDataProvider>
            </div>
        </div>
    )
}

export default Nos;