# Documentação do Sistema - DApp de Gestão de Permissões em Blockchain

## Introdução

Este documento descreve a arquitetura e as funcionalidades de um Aplicativo Descentralizado (DApp) de gestão de permissões em blockchain, desenvolvido em TypeScript e React. O sistema oferece um controle de acesso descentralizado, utilizando contratos inteligentes para assegurar a imutabilidade e a auditabilidade das regras de permissão.

---

## Sumário

1. Tecnologias Principais
2. Funcionalidades-Chave
3. Arquitetura do Sistema
4. Diretórios e Estruturas de Arquivo
5. Principais Contratos e Funções
6. Conclusão

---

## 1. Tecnologias Principais

- **TypeScript** : Linguagem de programação que adiciona tipagem estática ao JavaScript.
- **React** : Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite** : Ferramenta de build para aplicações web.
- **Web3/Ethereum** : Integração com a blockchain para execução de contratos inteligentes.

---

## 2. Funcionalidades-Chave

- **Gestão de Contas** : Controle de contas com diferentes níveis de permissão.
- **Governança** : Configuração de regras de governança através de contratos inteligentes.
- **Controle de Nós** : Gerenciamento dos nós participantes da rede.
- **Organizações** : Estruturas organizacionais hierárquicas.

---

## 3. Arquitetura do Sistema

- **Frontend** : Utiliza React, Vite e TypeScript para uma interface responsiva e dinâmica.
- **Integração com Contratos Inteligentes** : Utiliza ABIs para interação com contratos na blockchain.
- **Sistema de Permissões** : Baseado em blockchain, garantindo controle descentralizado.
- **UI Modular** : Composição de componentes reutilizáveis para facilitar a manutenção e expansão.
- **Gestão de Estado** : Utilização da Context API para gerenciamento eficiente do estado da aplicação.

---

## 4. Diretórios e Estruturas de Arquivo

### 4.1 Diretório Raiz (`./`)

- **Configurações do Projeto** : `.env`, `.gitignore`, `eslint.config.js`
- **Configurações TypeScript** : `tsconfig.*.json`
- **Configuração Vite** : `vite.config.ts`
- **Ponto de Entrada** : `index.html`
- **Gerenciamento de Dependências** : `package.json` e `package-lock.json`

### 4.2 Diretório `docs/`

- **Documentação do Sistema** : `Docs.txt`
- **Manual do Usuário** : `manual_usuario/`

### 4.3 Diretório `public/`

- **Assets Estáticos** :
    - Ícones: `public/icons/` (ex: `blocked.png`, `delete.png`)
    - Imagens: `user.png`, `vite.svg`

### 4.4 Diretório `src/` (Núcleo do Aplicativo)

- **chain/** : Integração Blockchain
    
    - `abis/*.json`: ABIs de contratos.
    - `factory/*.ts`: Fábricas para inst implementações de contratos.
    - `provider.ts`: Provedor Web3.
    - `@types/`: Definições de tipos para contratos.
- **components/** : Componentes UI Reutilizáveis
    
    - `Button/`: Botões personalizáveis.
    - `Modal/`: Implementações de janelas modais.
    - `Pages/`: Páginas principais (ex: `Contas`, `Governança`).
    - `Table/`: Componentes para tabelas.
- **containers/** : Componentes Complexos
    
    - `Layout/`: Estrutura principal.
    - `Tables/`: Implementações específicas de tabelas.
    - `Modal/`: Modais contextualizados.
- **context/** : Gestão de Estado
    
    - `network.tsx`: Dados da rede.
    - `governancaData.tsx`: Dados de governança.
    - `organizationData.tsx`: Dados de organizações.
- **util/** : Utilitários
    
    - `configLoader.ts`: Carregamento de configurações.
    - `Contracts.ts`: Helpers para contratos.
    - `StringUtils.ts`: Manipulação de strings.
    - `path/*.ts`: Gerenciamento de paths.

---

## 5. Principais Contratos e Funções

### 5.1 AccountRulesV2Impl (Contas)

- Gerencia permissões de usuários.
- Define regras de acesso hierárquico.
- Implementa CRUD para contas autorizadas.

### 5.2 NodeRulesV2Impl (Nós)

- Controla o registro de nós na rede.
- Gerencia status e autorizações.
- Implementa validação de conexões.

### 5.3 OrganizationImpl (Organizações)

- Define estrutura organizacional.
- Gerencia relações hierárquicas.
- Controla permissões entre unidades.

### 5.4 AccountIngress (Gateway)

- Atua como camada de entrada para acessar os contratos.
- Centraliza o gerenciamento de acesso.
- Implementa controle de versão das regras de acesso.

---

## 6. Conclusão

O DApp de Permissionamento da RBB visa proporcionar um ambiente corporativo eficiente para gestão de permissões e acessos com total transparência e audibilidade. Sua arquitetura modular, integração com blockchain e ênfase na reutilização de componentes oferecem uma solução robusta para organizações que buscam uma gestão de acesso descentralizada. # Documentação do Sistema - DApp de Gestão de Permissões em Blockchain

## Introdução

Este documento descreve a arquitetura e as funcionalidades de um Aplicativo Descentralizado (DApp) de gestão de permissões em blockchain, desenvolvido em TypeScript e React. O sistema oferece um controle de acesso descentralizado, utilizando contratos inteligentes para assegurar a imutabilidade e a auditabilidade das regras de permissão.

---

## Sumário

1. Tecnologias Principais
2. Funcionalidades-Chave
3. Arquitetura do Sistema
4. Diretórios e Estruturas de Arquivo
5. Principais Contratos e Funções
6. Conclusão

---

## 1. Tecnologias Principais

- **TypeScript** : Linguagem de programação que adiciona tipagem estática ao JavaScript.
- **React** : Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite** : Ferramenta de build para aplicações web.
- **Web3/Ethereum** : Integração com a blockchain para execução de contratos inteligentes.

---

## 2. Funcionalidades-Chave

- **Gestão de Contas** : Controle de contas com diferentes níveis de permissão.
- **Governança** : Configuração de regras de governança através de contratos inteligentes.
- **Controle de Nós** : Gerenciamento dos nós participantes da rede.
- **Organizações** : Estruturas organizacionais hierárquicas.

---

## 3. Arquitetura do Sistema

- **Frontend** : Utiliza React, Vite e TypeScript para uma interface responsiva e dinâmica.
- **Integração com Contratos Inteligentes** : Utiliza ABIs para interação com contratos na blockchain.
- **Sistema de Permissões** : Baseado em blockchain, garantindo controle descentralizado.
- **UI Modular** : Composição de componentes reutilizáveis para facilitar a manutenção e expansão.
- **Gestão de Estado** : Utilização da Context API para gerenciamento eficiente do estado da aplicação.

---

## 4. Diretórios e Estruturas de Arquivo

### 4.1 Diretório Raiz (`./`)

- **Configurações do Projeto** : `.env`, `.gitignore`, `eslint.config.js`
- **Configurações TypeScript** : `tsconfig.*.json`
- **Configuração Vite** : `vite.config.ts`
- **Ponto de Entrada** : `index.html`
- **Gerenciamento de Dependências** : `package.json` e `package-lock.json`

### 4.2 Diretório `docs/`

- **Documentação do Sistema** : `Docs.txt`
- **Manual do Usuário** : `manual_usuario/`

### 4.3 Diretório `public/`

- **Assets Estáticos** :
    - Ícones: `public/icons/` (ex: `blocked.png`, `delete.png`)
    - Imagens: `user.png`, `vite.svg`

### 4.4 Diretório `src/` (Núcleo do Aplicativo)

- **chain/** : Integração Blockchain
    
    - `abis/*.json`: ABIs de contratos.
    - `factory/*.ts`: Fábricas para inst implementações de contratos.
    - `provider.ts`: Provedor Web3.
    - `@types/`: Definições de tipos para contratos.
- **components/** : Componentes UI Reutilizáveis
    
    - `Button/`: Botões personalizáveis.
    - `Modal/`: Implementações de janelas modais.
    - `Pages/`: Páginas principais (ex: `Contas`, `Governança`).
    - `Table/`: Componentes para tabelas.
- **containers/** : Componentes Complexos
    
    - `Layout/`: Estrutura principal.
    - `Tables/`: Implementações específicas de tabelas.
    - `Modal/`: Modais contextualizados.
- **context/** : Gestão de Estado
    
    - `network.tsx`: Dados da rede.
    - `governancaData.tsx`: Dados de governança.
    - `organizationData.tsx`: Dados de organizações.
- **util/** : Utilitários
    
    - `configLoader.ts`: Carregamento de configurações.
    - `Contracts.ts`: Helpers para contratos.
    - `StringUtils.ts`: Manipulação de strings.
    - `path/*.ts`: Gerenciamento de paths.

---

## 5. Principais Contratos e Funções

### 5.1 AccountRulesV2Impl (Contas)

- Gerencia permissões de usuários.
- Define regras de acesso hierárquico.
- Implementa CRUD para contas autorizadas.

### 5.2 NodeRulesV2Impl (Nós)

- Controla o registro de nós na rede.
- Gerencia status e autorizações.
- Implementa validação de conexões.

### 5.3 OrganizationImpl (Organizações)

- Define estrutura organizacional.
- Gerencia relações hierárquicas.
- Controla permissões entre unidades.

### 5.4 AccountIngress (Gateway)

- Atua como camada de entrada para acessar os contratos.
- Centraliza o gerenciamento de acesso.
- Implementa controle de versão das regras de acesso.

---

## 6. Conclusão

O DApp de Permissionamento da RBB visa proporcionar um ambiente corporativo eficiente para gestão de permissões e acessos com total transparência e audibilidade. Sua arquitetura modular, integração com blockchain e ênfase na reutilização de componentes oferecem uma solução robusta para organizações que buscam uma gestão de acesso descentralizada. 
