# Horácio - Bot de RPG para Discord 🎭

Horácio é um bot de Discord com personalidade de Bardo, especializado em sistemas de RPG, rolagem de dados e gerenciamento de fichas de personagem. Construído com TypeScript, Discord.js v14+, Prisma e Supabase, seguindo os princípios de Arquitetura Limpa.

**🔗 Conectado ao banco WiseBot (PrismLabs)** - Utiliza a infraestrutura existente com tabelas otimizadas para RPG.

## ✨ Funcionalidades

- 🎲 **Sistema de Rolagem de Dados**: Rolagens simples e complexas com formatação temática
- 📜 **Gerenciamento de Fichas**: Criação, edição e visualização de personagens
- 🎭 **Personalidade Carismática**: Interações divertidas com a personalidade de Bardo
- 🔒 **Segurança Robusta**: Row Level Security (RLS) e validação de dados
- ⚡ **Performance Otimizada**: Arquitetura em camadas desacopladas

## 🛠️ Stack Tecnológico

- **Linguagem**: TypeScript
- **Runtime**: Node.js 18+
- **Framework Discord**: Discord.js v14+ (com padrões modernos)
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL (Supabase)
- **Injeção de Dependência**: tsyringe
- **Build Tool**: tsx com hot reload
- **Testes**: Vitest
- **Linting**: ESLint + Prettier

### 🔒 **Padrões Discord.js v14+**
- ✅ **MessageFlags.Ephemeral** para respostas efêmeras
- ❌ **Proibido:** `ephemeral: true` (deprecated)
- 📚 Consulte [Discord Patterns](.docs/DISCORD-PATTERNS.md) para detalhes

## 🏗️ Arquitetura

O projeto segue os princípios de **Arquitetura Limpa** com fluxo de dados unidirecional:

```
Interação Discord → Handler → Comando/Componente → Serviço → Repositório → Banco de Dados
```

### Estrutura de Pastas

```
src/
├── core/             # Lógica central do bot
│   ├── container/    # Container de injeção de dependência
│   ├── content/      # Sistema de conteúdo (mensagens)
│   ├── errors/       # Classes de erro customizadas
│   └── handlers/     # Handlers principais de interação
└── modules/          # Módulos de negócio
    ├── character/    # Sistema de personagens
    │   ├── commands/
    │   ├── repositories/
    │   └── services/
    └── dice-roller/  # Sistema de rolagem de dados
        ├── commands/
        └── services/
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL (recomendado: Supabase)
- Discord Bot Token

### Passos de Instalação

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd horacio-discord-bot
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Configure o banco de dados**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Inicie o bot em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o bot em modo de desenvolvimento com HMR
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o bot em modo de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código
- `npm run test` - Executa os testes
- `npm run db:studio` - Abre o Prisma Studio

## 📚 Documentação

- [Arquitetura](.docs/ARCHITECTURE.md) - Detalhes da arquitetura e padrões de design
- [Setup](.docs/SETUP.md) - Guia completo de configuração
- [Changelog](CHANGELOG.md) - Histórico de alterações

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia a documentação de arquitetura antes de contribuir.

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
