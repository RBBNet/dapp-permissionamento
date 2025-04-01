## AccountIngress
O contrato AccountIngress.ts é responsável por gerenciar o acesso e a configuração das regras de conta na blockchain.

```typescript
export const accountIngressFactory = async (config: Config, provider: Provider | Signer) => {
  // Implementação da função
}
```

### accountIngressFactory
Configura e retorna uma instância do contrato AccountIngress.

**Parâmetros:**
- config: Config - Configurações do contrato
- provider: Provider | Signer - Provedor ou assinante Ethereum

**Retorno:**
- Promise<AccountIngress> - Instância do contrato AccountIngress
