## Network
O módulo network.tsx é responsável por gerenciar o estado global relacionado à rede blockchain e seus contratos através do Context API do React.

export const NetworkProvider: React.FC<Props> => (callback: (address: string) => void)

### Types
#### ContextType
Define a estrutura do contexto de rede.

**Propriedades:**
- networkId?: number - ID da rede atual
- setNetworkId: React.Dispatch - Função para atualizar ID da rede
- signer: Signer - Assinante de transações
- setSigner: React.Dispatch - Função para atualizar assinante
- contracts: Object - Contratos da aplicação
  - accountIngressContract?: AccountIngress
  - setAccountIngressContract: React.Dispatch
  - nodeIngressContract?: NodeIngress
  - setNodeIngressContract: React.Dispatch

### NetworkProvider
Componente provider que gerencia o estado global da rede.

**Estados:**
- accountIngressContract: Contrato de ingresso de contas
- nodeIngressContract: Contrato de ingresso de nós
- networkId: ID da rede
- signer: Assinante de transações

**Efeitos:**
- Inicializa provider e contratos ao montar componente

### useNetwork
Hook customizado para acessar o contexto de rede.

**Estados Calculados:**
- isCorrectNetwork: Verifica se rede atual é válida

**Retorno:**
- isCorrectNetwork: boolean - Indica se rede é válida
- networkId: number - ID da rede atual
- accountIngressContract: Contract - Contrato de ingresso de contas
- nodeIngressContract: Contract - Contrato de ingresso de nós
- signer: Signer - Assinante de transações