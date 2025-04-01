## NodeRules
O contrato nodeRules.ts é responsável por implementar e gerenciar as regras de funcionamento dos nós na blockchain através da versão 2 do contrato de regras.

export const nodeRulesFactory = async (config: Config, signer: Signer) => (callback: (address: string) => void)

### nodeRulesFactory
Configura e retorna uma instância do contrato NodeRulesV2Impl que implementa as regras para os nós.

**Parâmetros:**
- config: Config - Configurações do contrato
- signer: Signer - Assinante Ethereum 

**Retorno:**
- Promise<NodeRulesV2Impl> - Instância do contrato NodeRulesV2Impl