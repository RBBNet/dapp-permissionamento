## Provider
O arquivo provider.ts é responsável por fornecer a configuração e a conexão com a rede blockchain.

```typescript
export const createProvider = async (config: Config) => {
  // Implementação da função
}
```

### createProvider
Configura e retorna uma instância do provedor Ethereum.

**Parâmetros:**
- config: Config - Configurações do provedor

**Retorno:**
- Promise<Provider> - Instância do provedor configurado
