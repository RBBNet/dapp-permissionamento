import styles from "../page.module.css"
import GovernancaTable from "../../../containers/Tables/Governanca";
import { GovernanceProvider } from "../../../context/governancaData";

function Governanca(){

    return (
        <>
            <div className={styles.content}>
                <div className={styles.items}>
                    <h1>
                        Governança
                    </h1>
                    <GovernanceProvider>

                        <GovernancaTable/>
                    </GovernanceProvider>
                </div>
            </div>
        
        </>
    )
}

export default Governanca;