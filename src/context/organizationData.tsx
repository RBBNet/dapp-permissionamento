import { BigNumberish, Contract } from 'ethers';
import React, { createContext, useEffect, useState, useMemo, useContext, ReactNode } from 'react';
import { useNetwork } from './network';
import { organizationFactory } from '../chain/factory/OrganizationFactory';
import { OrganizationImpl as OrganizationContract } from '../chain/@types';
import { configPromise } from '../util/configLoader';
import { Organization } from '../chain/@types/OrganizationImpl';

type OrganizationData = { id: number; name:string, canVote:boolean};

type Props = {
  children: ReactNode;
}

type ContextType =
| {
    organizationList: OrganizationData[];
    setOrganizationList: React.Dispatch<React.SetStateAction<OrganizationData[]>>;
    
    organizationContract?: OrganizationContract;
    setOrganizationContract: React.Dispatch<React.SetStateAction<OrganizationContract | undefined>>;
    }
    | undefined;

const OrganizationDataContext = createContext<ContextType>(undefined);
    
export const OrganizationDataProvider: React.FC<Props> = props => {
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

    const { signer } = useNetwork();

    const config = configPromise

    useEffect(() => {
        if (signer == undefined) {
            console.log("Nao encontrado")
            setOrganizationContract(undefined);
        } else {
            config.then(config =>
                organizationFactory(config, signer).then(contract =>{
                    // console.log(contract.getOrganization())
                    setOrganizationContract(contract)
                    // contract.getOrganizations()
                    //     .then(organizations => console.log(organizations[0]));
    
                })

            )
        }
      }, [signer]);
      return <OrganizationDataContext.Provider value={value} {...props} />;
}

const loadOrganizationData = (
    organizationContract:  OrganizationContract | undefined,
    setOrganizationList: (organization: Organization.OrganizationDataStructOutput[]) => void,
  ) => {
    
    if (organizationContract === undefined) {
      setOrganizationList([]);
    } else {
        
        organizationContract.getOrganizations().then((organizations) => {
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
    
    // TO DO 
    // Pode ser removido. Desnecessário
    const formattedOrganizationList = useMemo(() => {
      return organizationList
        .map(organization => ({
          id: Number(organization.id),
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