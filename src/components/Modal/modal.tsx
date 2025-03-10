import styles from "./index.module.css"

type Props = {
    children?: any[];
    state?:boolean;
    setState: (state:boolean) => void;
    title: string;
}

function Modal({children, state, setState, title} : Props){

    return (
        <>
            { (state == undefined ? true :  state) ?
                <>
                    <div className={styles.modal}>
                        <div className={styles.menu}>
                            <div className={styles.close} onClick={()=>{setState(false)}} />
                            <h1>
                                {title}
                            </h1>
                            <div className={styles.content}>
                                {children}
                            </div>

                        </div>
                    </div>
                </>
            : ""}
        </>
    )
}

export default Modal;