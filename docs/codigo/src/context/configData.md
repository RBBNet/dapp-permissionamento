## ConfigData
O módulo configData.tsx é responsável por prover acesso global às configurações da aplicação através do Context API do React.

export const ConfigDataProvider: React.FC<Props> => (callback: (address: string) => void)

### Types
#### ContextType
Define a estrutura do contexto de configuração.

**Propriedades:**
- config: Config - Objeto de configuração da aplicação

### ConfigDataProvider
Componente provider que disponibiliza as configurações globalmente.

**Parâmetros:**
- Props:
  - children: ReactNode - Componentes filhos
  - config: Config - Configurações da aplicação

### useConfig
Hook customizado para acessar as configurações globais.

**Retorno:**
- Config - Objeto de configuração da aplicação

**Erro:**
- Lança erro se usado fora do ConfigDataProvider