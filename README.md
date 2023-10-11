# Dapp de Permissionamento

Esta aplicação contém o *frontend* para os contratos de permissionamento.

## Preparação

- Edite o arquivo .env com os valores para as variáveis **NODE_INGRESS_CONTRACT_ADDRESS**, **ACCOUNT_INGRESS_CONTRACT_ADDRESS** e **CHAIN_ID**. 
Exemplo:
```
NODE_INGRESS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000009999
ACCOUNT_INGRESS_CONTRACT_ADDRESS=0x0000000000000000000000000000000000008888
CHAIN_ID=648629
```

- O *frontend* precisa das ABIs _(Application Binary Interface)_ dos contratos de permissionamento para construir o projeto. Estas ABIs serão baixadas automaticamente do repositório de contratos nas etapas de execução do projeto. Se necessário, altere a versão de ABIs na chave *abirelease* no arquivo package.json.

- Escolha uma das opções para executar o projeto:
1. [Execução via ambiente Linux]().
2. [Execução via Docker]() (automatiza a preparação do ambiente). Recomendado!

## 1. Execução via ambiente Linux

### Pré-requisitos

- Node.js versão 14
- Python versão 3

> [!NOTE]
> O projeto é compatível apenas com a versão 14 do Node.js. Se necessário, use um gerenciador de versão do Node como o [NVM](https://github.com/nvm-sh/nvm). Uma vez instalado, baixe a versão 14 e execute `nvm use 14`. O projeto foi testado com a versão de Node v14.21.3.

### Inicialização de dependências ###
Execute `yarn install` para inicializar as dependências do projeto. Esta etapa é necessária apenas quando for executar o projeto pela primeira vez.

### Execução do Dapp ####
1. Execute `yarn run build` para construir o Dapp.
2. Execute `yarn run start` para inicializar o servidor web que servirá o Dapp.
3. No navegagor, conecte o Metamask com a rede do Besu através de um nó (exemplo `http://<ip validador>:<porta rpc>/`)
4. Importe no Metamask a conta de administrador de sua organização ou outra conta.
5. Navegue para `http://localhost:3000` para acessar o Dapp de Permissionamento.


## 2. Execução via Docker

### Pré-requisitos

- Docker
- Docker compose

### Execução do Dapp ####
1. Execute `docker-compose up -d`. Na primeira vez, essa ação demorará algum tempo, pois serão baixadas as dependências e o projeto será construído.
2. No navegagor, conecte o Metamask com a rede do Besu através de um nó (exemplo `http://<ip validador>:<porta rpc>/`)
3. Importe no Metamask a conta de administrador de sua organização ou outra conta.
4. Navegue para `http://localhost:3000` para acessar o Dapp de Permissionamento.
