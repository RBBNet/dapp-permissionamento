import { BigNumberish, toNumber } from "ethers"

const ROLE_IDS: Record<string, string> = {
    'd6e7d8560c69c7c18c2b8f3b45430215d788f128f0c04bc4a3607fe05eb5399f':'GLOBAL_ADMIN_ROLE',
    'b7f8beecafe1ad662cec1153812612581a86b9460f21b876f3ee163141203dcb':'LOCAL_ADMIN_ROLE', 
    'fc425f2263d0df187444b70e47283d622c70181c5baebb1306a01edba1ce184c':'DEPLOYER_ROLE',
    '14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8':'USER_ROLE'
}

export function randomString(length: number){
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function ConvertNodeType(type: BigNumberish ){
    switch(toNumber(type)){
        case 0:

            return "Boot"
        case 1:

            return "Validator"
        case 2:

            return "Writer"
        case 3:

            return "Writer Partner"
        case 4:

            return "Observer Boot"
        case 5:

            return "Observer";
        default:

            return "Other"
    }
}

export function ConvertNameToRoleID(name:string){
    for(let object of Object.keys(ROLE_IDS)){
        if(ROLE_IDS[object] == name){
            return object
        }
    }
    return undefined
}

export function ConvertRoleID(hash: string | undefined){
    if(hash == undefined) return "null";
    if(hash.startsWith("0x"))
        hash = hash.slice(2, hash.length)

    if(!ROLE_IDS.hasOwnProperty(hash)){
        throw new Error(`'${hash}' doesn't have a role ID defined`)
    }

    return ROLE_IDS[hash];
}