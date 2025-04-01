## OrganizationData

O arquivo `OrganizationData.tsx` é um componente de contexto React que gerencia o estado e fornece dados de organizações em uma aplicação blockchain. Fornece funcionalidades para carregar e atualizar informações das organizações.

export const OrganizationDataProvider: React.FC<Props> = props => React.ReactElement
export const useOrganizationData = () => { dataReady: boolean, orgList: OrganizationData[], organizationContract: OrganizationContract | undefined }

### Tipos
- `OrganizationData`: Define a estrutura de dados de uma organização
- `Props`: Propriedades do provedor de contexto
- `ContextType`: Tipo do contexto com dados e funções de organizações

### Exports

#### `OrganizationDataProvider`
Componente provedor que:
- Gerencia o estado do contrato de organização
- Inicializa o contrato de organização usando `organizationFactory`
- Fornece contexto para componentes filhos

**Parâmetros:**
- `children`: ReactNode - Componentes filhos

#### `useOrganizationData`
Hook personalizado que:
- Carrega dados de organizações
- Formata a lista de organizações
- Verifica se os dados estão prontos

**Retorno:**
- `dataReady`: Booleano indicando se os dados estão carregados
- `orgList`: Lista formatada de organizações
- `organizationContract`: Contrato de organização

### Funcionalidades Principais
- Carregamento dinâmico de contrato de organização
- Gerenciamento de estado de organizações
- Formatação de dados de organizações
- Provimento de contexto para componentes React

### Dependências
- ethers
- React Hooks
- Contrato de Organização
- Configuração de rede
