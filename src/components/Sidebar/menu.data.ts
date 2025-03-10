import { PathUtil } from "../../util/path/path"

type SideBarItem = {
    path: string;
    icon: string;
};

const SideBarData: Record<string, SideBarItem> = {
    'Organizações': {
        path: PathUtil.Organizacao.DEFAULT,
        icon: '',
    },
    'Contas': {
        path: PathUtil.Contas.DEFAULT,
        icon: '',
    },
    'Nós': {
        path: PathUtil.Nodes.DEFAULT,
        icon: '',
    },
    'Governança': {
        path: PathUtil.Governanca.DEFAULT,
        icon: '',
    },
    // 'Configurações': {
    //     path: PathUtil.Configuracoes.DEFAULT,
    //     icon: '',
    // },
    // 'Está pagina não existe': {
    //     path: 'opa',
    //     icon: '',
    // },
};

export default SideBarData;