import { useEffect, useState } from "react";

import { ComponentPathUtil } from "../../util/path/component-path";
import styles from './index.module.css'
import Sidebar from "../../components/Sidebar";

import { OrganizationDataProvider } from "../../context/organizationData";
import { AccountDataProvider } from "../../context/accountData";

function Layout(){

  const [currentPage, setCurrentPage] = useState('');
  const [content, setContent] = useState<JSX.Element>();

  async function updateContent(path: string){
    let componentData = ComponentPathUtil.ComponentPath.find(item => item.path == path);

    if(!componentData){
      // Pagina 404
      console.error("Pagina '" + path + "' não encontrada")
      componentData = ComponentPathUtil.ComponentPath.find(item => item.path == '404');
      if(!componentData){
        throw new Error("404 não encontrado")
      }
    }

    componentData.loadComponent().then(component =>{
      setCurrentPage(componentData.path)
      setContent(component)
    })
  }

  useEffect(()=>{
    updateContent('organizacao')
  }, [])
  
  return (
      <div className={styles.view}>
        <AccountDataProvider>
          <OrganizationDataProvider>
            <Sidebar currentPage={currentPage} updateContent={updateContent}/>
            <div className={styles.content} style={{color:'black'}} > 
              {/* <Governanca/> */}
              {content}
            </div>
          </OrganizationDataProvider>
        </AccountDataProvider>
      </div>
  )
}

export default Layout;