## AccountData
O módulo accountData.tsx é responsável por gerenciar o estado global relacionado às contas de usuários através do Context API do React.

export const AccountDataProvider: React.FC<Props> => (callback: (address: string) => void)

### Types
#### ContextType
Define a estrutura do contexto de dados de conta.

**Propriedades:**
- operatorAddress: string - Endereço do operador atual
- setOperatorAddress: React.Dispatch - Função para atualizar endereço do operador
- accountList: AccountRulesV2.AccountDataStruct[] - Lista de contas
- setAccountList: React.Dispatch - Função para atualizar lista de contas
- accountRulesContract?: AccountRulesV2Impl - Contrato de regras de conta
- setAccountRulesContract: React.Dispatch - Função para atualizar contrato

### Functions
#### loadAccountData
Carrega dados das contas do contrato.

**Parâmetros:**
- accountRulesContract: AccountRulesV2Impl - Contrato de regras
- setAccountList: Function - Função para atualizar lista

### AccountDataProvider
Componente provider que gerencia o estado global das contas.

**Estados:**
- accountList: Lista de contas
- operatorAddress: Endereço do operador
- accountRulesContract: Instância do contrato

**Efeitos:**
- Inicializa contrato quando signer está disponível
- Configura listeners para eventos de conta
- Atualiza dados quando eventos são disparados

### useAccountData
Hook customizado para acessar o contexto de dados de conta.

**Retorno:**
- dataReady: boolean - Indica se dados estão prontos
- accountList: Array - Lista formatada de contas
- accountRulesContract: Contract - Contrato de regras
- operatorAddress: string - Endereço do operador