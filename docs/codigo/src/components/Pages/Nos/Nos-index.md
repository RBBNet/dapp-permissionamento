## Nos
Um componente React que renderiza a página de listagem de nós, utilizando provider de contexto para gerenciar dados dos nós.

export default Nos

### Nos
Renderiza a estrutura da página de nós, incluindo título e tabela de nós, envolvida pelo provider necessário.

**Parâmetros:**
- Nenhum parâmetro necessário

**Retorno:**
- JSX.Element - Retorna um elemento estruturado com:
  - Container principal com classe styles.content
  - Container interno com classe styles.items
  - Título "Nós"
  - NodeDataProvider encapsulando o componente NodesTable