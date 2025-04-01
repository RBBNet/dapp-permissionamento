## Sidebar
O componente sidebar.ts é responsável por renderizar a barra lateral de navegação da aplicação, exibindo o menu de navegação e informações do usuário conectado.

export const Sidebar = ({ currentPage, updateContent }: Props) => (callback: (address: string) => void)

### Sidebar
Renderiza uma barra lateral que inclui menu de navegação e detalhes do usuário, integrando com contratos de conta e organização.

**Parâmetros:**
- Props: 
  - currentPage: string - Página atual selecionada
  - updateContent: (path: string) => void - Função para atualizar o conteúdo baseado no caminho

**Estados:**
- org: string - Nome da organização do usuário
- roleId: string - ID da função do usuário
- account: AccountRulesV2.AccountDataStructOutput | undefined - Dados da conta do usuário

**Hooks:**
- useEffect - Carrega dados da conta e organização do usuário quando o endereço do operador está disponível

**Funções:**
- getImage: (name: string) => string - Retorna o caminho da imagem do usuário

**Retorno:**
- JSX.Element - Retorna um elemento estruturado com:
  - Menu de navegação com botões dinâmicos baseados em SideBarData
  - Seção inferior com informações do usuário incluindo:
    - Imagem do usuário
    - Nome da organização
    - Função do usuário
    - Endereço do usuário truncado