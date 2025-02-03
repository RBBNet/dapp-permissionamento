import { OrganizationDataProvider } from "../../../context/organizationData";
import styles from "../page.module.css"
import OrganizationTable from "../../../containers/Tables/Organization";

function Organizacao(){

    

    return (
        <div className={styles.content}>
            <div className={styles.items}>
                <h1>
                    Organizações
                </h1>
                <OrganizationDataProvider>

                    <OrganizationTable/>
                </OrganizationDataProvider>

            </div>
        </div>
    )
}

export default Organizacao;