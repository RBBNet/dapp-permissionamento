## Organization Factory
O contrato organizationFactory.ts é responsável por gerenciar as operações relacionadas à organização na blockchain, implementando a interface de contrato para operações organizacionais.

export const organizationFactory = async (config: Config, signer: Signer) => (callback: (address: string) => void)

### organizationFactory
Configura e retorna uma instância do contrato OrganizationImpl que implementa as funcionalidades de organização.

**Parâmetros:**
- config: Config - Configurações do contrato
- signer: Signer - Assinante Ethereum

**Retorno:**
- Promise<OrganizationContract> - Instância do contrato OrganizationImpl