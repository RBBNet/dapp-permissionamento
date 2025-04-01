## NodeIngress
O contrato nodeIngress.ts é responsável por gerenciar o acesso e a configuração dos nós na blockchain. Atua como ponto de entrada para as operações relacionadas aos nós da rede.

export const nodeIngressFactory = async (config: Config, provider: Signer) => (callback: (address: string) => void)

### nodeIngressFactory
Configura e retorna uma instância do contrato NodeIngress.

**Parâmetros:**
- config: Config - Configurações do contrato
- provider: Signer - Assinante Ethereum

**Retorno:**
- Promise<NodeIngress> - Instância do contrato NodeIngress