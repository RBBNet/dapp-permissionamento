# DApp de Permissionamento da Rede Blockchain Brasil (RBB)

Passo a passo para instalação do DApp:

1. Instale as dependências (execute na raiz do projeto):
```bash
npm install
```

2. Gere tipos dos contratos inteligentes:
```bash
npm run build:contract
```

3. Configure variáveis de ambiente (.env):
```ini
VITE_INFURA_ID=seu_id_infura
VITE_CONTRACT_ADDRESS=endereço_do_contrato
VITE_NETWORK_ID=id_da_rede
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Principais dependências:

🛠️ Core:
- react@19 + vite: Frontend moderno
- ethers@6.13.5: Biblioteca Web3 principal
- web3@4.16.0: Client Ethereum alternativo

🔗 Blockchain:
- @typechain/ethers-v6: Tipos para Ethers v6
- typechain: Gerador de tipos de contratos

⚙️ Dev:
- eslint: Linter JavaScript/TypeScript
- typescript@5.6: Tipagem estática
- @vitejs/plugin-react: Integração React com Vite
