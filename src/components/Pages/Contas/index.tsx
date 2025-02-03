import AccountTable from "../../../containers/Tables/Account";
import { AccountDataProvider } from "../../../context/accountData";
import { OrganizationDataProvider } from "../../../context/organizationData";
import styles from "../page.module.css"

function Contas(){

    return (
        <div className={styles.content}>
            <div className={styles.items}>
                <h1>
                    Contas
                </h1>
                
                <OrganizationDataProvider>
                    <AccountDataProvider>
                        
                        <AccountTable/>
                    </AccountDataProvider>

                </OrganizationDataProvider>

            </div>
        </div>
    )
}

export default Contas;