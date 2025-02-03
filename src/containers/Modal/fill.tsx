import styles from "./index.module.css"


function Fill({children}){
    
    return (
        <div className={styles.fill}>
            {children}
        </div>
    )
}

export default Fill;