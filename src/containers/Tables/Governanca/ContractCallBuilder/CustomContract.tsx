import Fill from "@/components/Modal/fill"
import { useEffect, useImperativeHandle, useRef } from "react"

type Props = {
    ref : any;
    extra?: CustomContractParameter;
}

export type CustomContractParameter = {
    address: string;
    hash   : string;
}

export default function CustomContract({ref, extra}: Props) {

    const addressRef = useRef<HTMLInputElement>(null);
    const hashRef    = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(!extra) return;

        if(addressRef.current)
            addressRef.current.value = extra?.address
        if(hashRef.current)
            hashRef.current.value = extra!.hash
    }, [])

    const getData = () : CustomContractParameter =>{
        return {
            address: addressRef.current!.value,
            hash: hashRef.current!.value
        }
    }

    useImperativeHandle(ref, ()=>
        ({getData})
    ,[])

    return (
        <>
            <Fill>
                <div>
                    <label htmlFor="">Endereço do contrato</label>
                    <input type="text" ref={addressRef}/>
                </div>
            </Fill>
            <Fill>
                <div>
                    <label htmlFor="">Hash</label>
                    <input type="text" ref={hashRef} />
                </div>
            </Fill>
        </>
    )
}