import styles from "./index.module.css"


type Props = {
    children?: any | any[] | undefined;
}

function Fill({children} : Props){
    
    return (
        <div className={styles.fill}>
            {children}
        </div>
    )
}

export default Fill;
