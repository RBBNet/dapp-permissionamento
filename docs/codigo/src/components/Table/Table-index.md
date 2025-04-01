## Table
O componente table.ts é responsável por renderizar uma tabela de dados genérica e customizável, com suporte a diferentes tipos de dados e componentes personalizados.

export default Table: ({ columns, data }: TableProps) => (callback: (address: string) => void)

### Types
#### TableColumn
Define a estrutura de uma coluna da tabela.

**Propriedades:**
- name: string - Nome da coluna para exibição
- value: string - Chave do valor no objeto de dados
- call?: (data_row: any) => any - Função opcional para transformar o dado
- component?: React.FC - Componente React opcional para renderização personalizada

#### TableProps
Define as propriedades necessárias para o componente Table.

**Propriedades:**
- columns: TableColumn[] - Array de definições das colunas
- data: any[] - Array de dados a serem exibidos

### createElement
Função interna que determina como renderizar cada célula da tabela.

**Comportamentos:**
- Renderiza componentes personalizados se definidos
- Trata valores booleanos com pills verde/vermelho
- Aplica transformações de dados através da função call
- Converte outros tipos para string

**Retorno:**
- JSX.Element - Retorna uma tabela estruturada com:
  - Cabeçalho baseado nas definições das colunas
  - Corpo da tabela com dados formatados
  - Mensagem "Não há dados" quando não existem registros