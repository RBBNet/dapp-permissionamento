## Contas
Um componente React que renderiza a página de listagem de contas, utilizando providers de contexto para gerenciar dados de contas e organizações.

export default Contas

### Contas
Renderiza a estrutura da página de contas, incluindo título e tabela de contas, envolvida pelos providers necessários.

**Parâmetros:**
- Nenhum parâmetro necessário

**Retorno:**
- JSX.Element - Retorna um elemento estruturado com:
  - Container principal com classe styles.content
  - Container interno com classe styles.items
  - Título "Contas"
  - OrganizationDataProvider e AccountDataProvider encapsulando o componente AccountTable