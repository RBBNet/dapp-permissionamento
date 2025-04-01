## Account
O componente account.tsx é responsável por gerenciar e exibir uma tabela de contas de usuários, permitindo operações CRUD (Criar, Ler, Atualizar, Deletar) quando o usuário tem permissões adequadas.

export default AccountTable => (callback: (address: string) => void)

### AccountTable
Renderiza uma tabela interativa de contas com funcionalidades de gerenciamento.

**Estados:**
- toggleModalAdd: boolean - Controla visibilidade do modal de adição
- toggleModalRemove: boolean - Controla visibilidade do modal de remoção
- toggleModalUpdate: boolean - Controla visibilidade do modal de atualização
- accountData: AccountRulesV2.AccountDataStructOutput - Dados da conta atual
- organization: Organization.OrganizationDataStructOutput - Dados da organização
- updateData: AccountRulesV2.AccountDataStructOutput - Dados para atualização

**Funções Principais:**
- _updateAccount: Atualiza dados de uma conta existente
- updateAccount: Prepara dados para atualização
- _deleteAccount: Remove uma conta
- deleteAccount: Executa a remoção da conta
- createAccount: Cria uma nova conta
- formatRoleId: Formata o ID da função
- formatOrganization: Formata o ID da organização

**Componentes Internos:**
- UpdateAccountComponent: Renderiza formulário de atualização de conta
- actionsComponent: Renderiza botões de ação na tabela

**Retorno:**
- JSX.Element - Retorna uma estrutura com:
  - Modais para criar, atualizar e remover contas
  - Botões de ação condicionais baseados em permissões
  - Tabela de contas com colunas configuradas
  - Funcionalidades de gerenciamento baseadas em permissões do usuário