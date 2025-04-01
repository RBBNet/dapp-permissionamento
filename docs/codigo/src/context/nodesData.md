## NodeData

O arquivo `NodeData.tsx` é um componente de contexto React que gerencia o estado e fornece dados de nós em uma aplicação blockchain.

export const NodeDataProvider: React.FC<{}> = props => React.ReactElement
export const useNodeData = () => { dataReady: boolean, nodeList: Enode[], nodeRulesContract: NodeRulesV2Impl | undefined }
export enum EnodeType { Boot = 0, Validator = 1, Writer = 2, WriterPartner = 3, ObserverBoot = 4, Observer = 5, Other }

### Tipos e Enums
- `EnodeType`: Enum que define os tipos de nós na rede
- `Enode`: Interface que representa a estrutura de um nó
- `ContextType`: Tipo do contexto com dados e funções de nós

### Exports

#### `NodeDataProvider`
Componente provedor que:
- Gerencia o estado do contrato de regras de nós
- Inicializa o contrato de regras de nós usando `nodeRulesFactory`
- Carrega lista de nós ao inicializar
- Fornece contexto para componentes filhos

**Parâmetros:**
- Nenhum parâmetro específico

#### `useNodeData`
Hook personalizado que:
- Carrega dados de nós
- Verifica se os dados estão prontos

**Retorno:**
- `dataReady`: Booleano indicando se os dados estão carregados
- `nodeList`: Lista de nós
- `nodeRulesContract`: Contrato de regras de nós

### Funcionalidades Principais
- Carregamento dinâmico de contrato de regras de nós
- Gerenciamento de estado de nós
- Provimento de contexto para componentes React

### Dependências
- React Hooks
- Contrato de Regras de Nós
- Configuração de rede

### EnodeType
Enumeração que define os tipos possíveis de nós:
- Boot = 0
- Validator = 1
- Writer = 2
- WriterPartner = 3
- ObserverBoot = 4
- Observer = 5
- Other
