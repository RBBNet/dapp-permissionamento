## Nodes
O componente nodes.tsx é responsável por exibir uma tabela com a listagem de nós da rede, mostrando informações como nome, organização, tipo e status.

export default NodesTable => (callback: (address: string) => void)

### NodesTable
Renderiza uma tabela com informações dos nós da rede.

**Hooks utilizados:**
- useNodeData - Obtém a lista de nós
- useAccountData - Contexto de dados da conta

**Configuração de Colunas:**
- Nome - Nome do nó
- Organização - ID da organização do nó
- Tipo - Tipo do nó (com conversão via ConvertNodeType)
- Status - Status de atividade do nó

**Retorno:**
- JSX.Element - Retorna um componente Table configurado com:
  - Colunas definidas para exibição dos dados dos nós
  - Dados obtidos do contexto nodeList
  - Formatação específica para o tipo de nó