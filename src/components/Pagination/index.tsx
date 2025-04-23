import { useState } from "react"
import styles from "./index.module.css"
import { randomString } from "@/util/StringUtils";

type Props = {
    changePage: (page: number) => void;
    totalPages: number;
}

export default function Pagination ({changePage, totalPages} : Props){

    const [selected, setSelected] = useState(1);

    const onChange = (page: number) =>{
        setSelected(page);
        changePage(page)
    }

    return (
        <div className={styles.pagination}>
            {
                
                Array.from({ length: totalPages }).map((_, index) => (
                    <div key={randomString(3)} onClick={()=>onChange(index+1)} className={`${styles.page} ${selected == index+1 ? 
                                                    styles.selected : ""}`}>
                        {index+1}
                    </div>

                ))
            }

        </div>
    )
}