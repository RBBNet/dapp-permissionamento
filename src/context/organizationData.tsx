import { BigNumber, Contract } from 'ethers';
import React, { createContext, useEffect, useState, useMemo, useContext } from 'react';
import { useNetwork } from './network';
import { organizationFactory } from '../chain/contracts/Organization';
import { Organization as OrganizationContract } from '../chain/@types';

type OrganizationData = { id: BigNumber; name:string, canVote:boolean};

type ContextType =
| {
    organizationList: OrganizationData[];
    setOrganizationList: React.Dispatch<React.SetStateAction<OrganizationData[]>>;
    
    organizationContract?: OrganizationContract;
    setOrganizationContract: React.Dispatch<React.SetStateAction<OrganizationContract | undefined>>;
    }
    | undefined;

const OrganizationDataContext = createContext<ContextType>(undefined);
    
export const OrganizationDataProvider: React.FC<{}> = props => {
    const [organizationContract, setOrganizationContract] = useState<OrganizationContract | undefined>(undefined);
    const [organizationList, setOrganizationList] = useState<OrganizationData[]>([]);
    const value = useMemo(
        () => ({
            organizationList: organizationList,
            setOrganizationList: setOrganizationList,
            organizationContract,
            setOrganizationContract
        }),
        [organizationList, setOrganizationList, organizationContract, setOrganizationContract]
      );

    const { accountIngressContract } = useNetwork();

    useEffect(() => {
        if (accountIngressContract === undefined) {
            setOrganizationContract(undefined);
        } else {
          
            organizationFactory(accountIngressContract).then(contract =>{
                setOrganizationContract(contract)
                // contract.getOrganizations().then(organizations => console.log(organizations));

            })
        }
      }, [accountIngressContract]);
      return <OrganizationDataContext.Provider value={value} {...props} />;
}

const loadOrganizationData = (
    organizationContract:  OrganizationContract | undefined,
    setOrganizationList: (organization: OrganizationData[]) => void,
  ) => {
    
    if (organizationContract === undefined) {
      setOrganizationList([]);
    } else {
        
        organizationContract.getOrganizations().then((organizations : OrganizationData[]) => {
            // Promise.all(organizations).then(responses => {
                setOrganizationList(organizations);
            // });
            

        });

    }
  };

export const useOrganizationData = () => {
    const context = useContext(OrganizationDataContext);
    
    if (!context) {
      throw new Error('useOrganizationData must be used within an OrganizationDataProvider.');
    }
  
    const { organizationList, setOrganizationList, organizationContract } = context;
  
    useEffect(() => {
      loadOrganizationData(organizationContract, setOrganizationList);
    }, [organizationContract, setOrganizationList]);
    
    const formattedOrganizationList = useMemo(() => {
      return organizationList
        .map(organization => ({
          id: Number(organization.id._hex),
          name: organization.name,
          canVote: organization.canVote
        }))
    }, [organizationList]);

    const dataReady = useMemo(() => {
      return organizationContract !== undefined;
    }, [organizationContract, organizationList]);
  
    return {
      dataReady,
      orgList: formattedOrganizationList,
      organizationContract
    };
  };