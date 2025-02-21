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

    const { operatorData, accountRulesContract, operatorAddress } = useAccountData();
    const { organizationContract } = useOrganizationData()
    const [org, setOrg] = useState('');
    const [roleId, setRoleId] = useState('');

    // console.log(operatorData)
    useEffect(()=>{
        if(operatorData == undefined) return;
        operatorData.roleId 

        organizationContract?.getOrganization(operatorData.orgId).then(organization =>{
            setOrg(organization.name);
        })
  

    }, [accountRulesContract, organizationContract, operatorData])
    
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
                            org != '' && operatorData != undefined ?
                            <>
                                {org}
                                <div className={styles.pill}>
                                    { ConvertRoleID(operatorData.roleId, true) }
                                </div>
                            </>
                            : ""
                        }
                        
                    </div>
                    <span>
                        {
                            operatorData != undefined ?
                                operatorData?.account.substring(0, 12) + "..." + operatorData?.account.substring(operatorData?.account.length -4,operatorData?.account.length)
                            : 
                                operatorAddress != undefined ? operatorAddress.substring(0, 12) + "..." + operatorAddress.substring(operatorAddress.length -4,operatorAddress.length) : ""
                        }
                    </span>
                </div>
            </div>
        </div>
    )
}


export default Sidebar;