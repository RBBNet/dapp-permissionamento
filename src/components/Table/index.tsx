import React from "react";
import { randomString } from "../../util/StringUtils";
import styles from "./index.module.css"

export type TableColumn = {
    name: string;
    value: string
    call?: (data_row: any) => any
    component?: React.FC<any>;
}

export type TableProps = {
    columns: TableColumn[]
    data: any[]
}

function Table({ columns, data }: TableProps){
    // if(data == undefined || data.length == 0) return (
    //     <>
    //         Não há dados
    //     </>
    // )
    // console.log("Tabela")

    let createElement = (data:any, column: TableColumn, entireData: any) =>{
        
        if(column.component){
            
            return (
                <>
                    {column.component(entireData)}
                </>
            )
        }

        switch(typeof data){    
            case "boolean":

                return (
                    <div style={{textAlign:"center", justifyItems:"center", alignItems:'center'}}>
                        <div className={data == true ? styles.greenpill : styles.redpill}>
                            {
                                !column.call ? 
                                    data == true ? "Ativo" : "Inativo"
                                : column.call(data)
                            }
                        </div>
                    </div>
                )
            default:
                return (
                    <>
                        {
                            column.call ?
                            <>
                                {column.call(data)}
                            </>
                            :
                            data.toString()
                        }
                    </>
                )

        }
    }
    
    return (    
        <div className={styles.tablecontainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {
                            columns.map((element) =>
                                <th key={`column_${element.name}`}>
                                    {element.name}
                                </th>
                            )
                        }

                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((element) =>
   
                            (<tr key={`row_${randomString(5)}`}>
                                {
                                    columns.map((column)=>
                                        <td key={`row_${randomString(5)}_${column.name}`}>
                                            {createElement(element[column.value], column, element)}
                                        </td>
                                    )
                                }
                            </tr>)
                            
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table;