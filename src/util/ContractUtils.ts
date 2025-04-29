import { ethers } from 'ethers';

export function GetError(abi: any, error: any) : ethers.ErrorDescription{
    const iface = ethers.Interface.from(abi);
    try {
        const parsed = iface.parseError(error.data);
        if(!parsed){
            alert("Falha ao decodificar mensagem de error. Confira o log para mais detalhes")
            throw new Error("Falha ao decodificar mensagem de error")
        }
        return parsed
      } catch (e) {
        alert("Falha ao decodificar mensagem de error. Confira o log para mais detalhes")
        throw e
      }
}

export function showErrorMessage(text: string, error: any, abi : any){
    let decError
    if(error.data)
    {
        decError = GetError(abi, error)
        alert(text + "\nError : '" + decError.args[0] + "'" + "\nConfirá o log para mais detalhes.")
    }
    else{
        console.log(error)
        alert(text +"Possível recusa do usuário. Confirá o log para mais detalhes.")
    }
}