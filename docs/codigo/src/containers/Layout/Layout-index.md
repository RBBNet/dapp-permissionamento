## Layout
O componente layout.ts é responsável por gerenciar a estrutura principal da aplicação, incluindo navegação lateral e carregamento dinâmico de conteúdo.

export default Layout => (callback: (address: string) => void)

### Layout
Gerencia o estado da página atual e renderiza o conteúdo correspondente dinamicamente.

**Estados:**
- currentPage: string - Armazena o caminho da página atual
- content: JSX.Element - Armazena o componente da página atual

**Funções:**
- updateContent: (path: string) => Promise<void> - Atualiza o conteúdo baseado no caminho:
  - Busca o componente correspondente ao caminho
  - Trata casos de página não encontrada (404)
  - Carrega o componente dinamicamente
  - Atualiza os estados de página e conteúdo

**useEffect:**
- Inicializa a aplicação carregando a página de organizações

**Retorno:**
- JSX.Element - Retorna uma estrutura com:
  - Container principal com classe styles.view
  - Providers necessários (AccountDataProvider e OrganizationDataProvider)
  - Componente Sidebar com props de navegação
  - Container de conteúdo dinâmico