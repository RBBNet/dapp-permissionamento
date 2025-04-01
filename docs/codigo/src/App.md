## App
O componente app.ts é responsável por configurar a estrutura principal da aplicação, fornecendo os providers necessários para o funcionamento global.

export const App: React.FC<{config: Config}> => (callback: (address: string) => void)

### App
Configura a estrutura base da aplicação com os providers de contexto necessários.

**Parâmetros:**
- config: Config - Configurações globais da aplicação

**Retorno:**
- JSX.Element - Retorna uma estrutura hierárquica com:
  - ConfigDataProvider para gerenciamento de configurações
  - NetworkProvider para gerenciamento de rede
  - Layout como componente principal da aplicação