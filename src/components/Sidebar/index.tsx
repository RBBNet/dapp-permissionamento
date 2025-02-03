import { useEffect, useState } from "react";
import { useAccountData } from "../../context/accountData";
import { useOrganizationData } from "../../context/organizationData";
import styles from "./index.module.css"
import SideBarData from "./menu.data";
import { ethers } from "ethers";
import { ConvertRoleID } from "../../util/StringUtils";
import { AccountRulesV2 } from "../../chain/@types/AccountRulesV2Impl"


type Props = {
    currentPage: string;
    updateContent: (path: string) => void;
}

function Sidebar({ currentPage, updateContent }: Props) {

    const { operatorAddress, accountRulesContract } = useAccountData();
    const { organizationContract } = useOrganizationData()
    const [org, setOrg] = useState('');
    const [roleId, setRoleId] = useState('');
    const [account, setAccount] = useState<AccountRulesV2.AccountDataStructOutput | undefined>(undefined)
    const hash = operatorAddress
    
    useEffect(()=>{
        if(operatorAddress == '') return;
        console.log(operatorAddress)

        accountRulesContract?.getAccount(operatorAddress).then(account=>{
            setRoleId(ConvertRoleID(account?.roleId));
            setAccount(account)
            organizationContract?.getOrganization(account.orgId).then(organization =>{
                setOrg(organization.name);
            })
        }).catch(exception =>{
            // Handle do erro de conta inexistente
            console.log(exception)
            console.log("Usuário não encontrado")
            setOrg('')
            setAccount(undefined)
        })

    }, [accountRulesContract, organizationContract, operatorAddress])
    
    const getImage = (name:string) =>{
        return "/user.png"
    }

    return (
        <div className={styles.menu}>
            <div className={styles.nav}>
                {Object.keys(SideBarData).map((element) => (
                    <button key={element} className={currentPage == SideBarData[element].path ? styles.active : ''} onClick={() => updateContent(SideBarData[element].path)}>
                        {element}
                    </button>
                ))}
            </div>

            <div className={styles.bottom}>
                <img src={getImage(org)} alt="" />
                <div className={styles.side}>
                    <div className={styles.details}>
                        {
                            org != '' && account != undefined ?
                            <>
                                {org}
                                <div className={styles.pill}>
                                    { roleId.substring(0, roleId.indexOf("_")) }
                                </div>
                            </>
                            : ""
                        }
                        
                    </div>
                    <span>
                        {hash.substring(0, 12) + "..." + hash.substring(hash.length -4, hash.length)}
                    </span>
                </div>
            </div>
        </div>
    )
}


export default Sidebar;