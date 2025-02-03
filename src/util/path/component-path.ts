import { PathUtil } from './path'
export namespace ComponentPathUtil{
    export const ComponentPath = [
        // Organização
        {
            path: PathUtil.Organizacao.DEFAULT,
            loadComponent: () => import('../../components/Pages/Organizacao').then((r) => r.default)
        },
        // Contas
        {
            path: PathUtil.Contas.DEFAULT,
            loadComponent: () => import('../../components/Pages/Contas').then((r) => r.default)
        },
        // Nodes
        {
            path: PathUtil.Nodes.DEFAULT,
            loadComponent: () => import('../../components/Pages/Nos').then((r) => r.default)
        },
        // Governança
        {
            path: PathUtil.Governanca.DEFAULT,
            loadComponent: () => import('../../components/Pages/Governanca').then((r) => r.default)
        },
        // Comum
        {
            path: PathUtil.NOT_FOUND,
            loadComponent: () => import('../../components/Pages/404').then((r) => r.default)
        }
    ]
}