## Index
O arquivo index.ts é responsável por inicializar e renderizar a aplicação React, carregando as configurações necessárias.

### Imports
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { configPromise } from './util/configLoader.ts'
```

### Inicialização
Carrega as configurações de forma assíncrona e inicializa a aplicação.

**Configuração:**
- Aguarda a resolução da promise de configuração
- Utiliza StrictMode para desenvolvimento mais seguro
- Renderiza o componente App com as configurações carregadas

**Retorno:**
- Renderiza a aplicação no elemento root do DOM
- Passa as configurações carregadas como prop para o App