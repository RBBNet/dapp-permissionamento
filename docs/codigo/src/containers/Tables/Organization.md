## Organization
O componente organization.tsx é responsável por exibir uma tabela com a listagem de organizações, mostrando informações como ID, nome e permissões de votação.

export default OrganizationTable => (callback: (address: string) => void)

### OrganizationTable
Renderiza uma tabela com informações das organizações registradas.

**Hooks utilizados:**
- useOrganizationData - Obtém a lista de organizações

**Configuração de Colunas:**
- ID - Identificador único da organização
- Nome - Nome da organização
- Pode votar - Indica se a organização tem permissão para votar (convertido para "Sim/Não")

**Retorno:**
- JSX.Element - Retorna um componente Table configurado com:
  - Colunas definidas para exibição dos dados das organizações
  - Dados obtidos do contexto orgList
  - Formatação específica para o campo de permissão de voto