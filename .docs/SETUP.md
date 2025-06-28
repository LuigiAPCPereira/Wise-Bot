# Guia de Configuração - Bot Horácio 🎭

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento e produção do bot Horácio.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração do Discord Bot](#configuração-do-discord-bot)
- [Configuração do Supabase](#configuração-do-supabase)
- [Instalação Local](#instalação-local)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Desenvolvimento](#desenvolvimento)
- [Deploy em Produção](#deploy-em-produção)
- [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Software Necessário

- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn** (recomendado: npm)
- **Git** para controle de versão
- **Editor de código** (recomendado: VS Code)

### Contas e Serviços

- **Discord Developer Account** - Para criar o bot
- **Supabase Account** - Para banco de dados PostgreSQL
- **GitHub Account** - Para versionamento (opcional)

## 🤖 Configuração do Discord Bot

### 1. Criar Aplicação no Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **"New Application"**
3. Digite o nome: **"Horácio"**
4. Clique em **"Create"**

### 2. Configurar Bot

1. Na aba **"Bot"**, clique em **"Add Bot"**
2. Configure as seguintes opções:
   - **Username**: `Horácio`
   - **Public Bot**: ❌ (desabilitado para testes)
   - **Requires OAuth2 Code Grant**: ❌ (desabilitado)

### 3. Configurar Intents

Na seção **"Privileged Gateway Intents"**:
- ✅ **Message Content Intent** (habilitado)
- ❌ **Presence Intent** (desabilitado)
- ❌ **Server Members Intent** (desabilitado)

### 4. Obter Token

1. Na seção **"Token"**, clique em **"Reset Token"**
2. **⚠️ IMPORTANTE**: Copie e guarde o token em local seguro
3. **NUNCA** compartilhe este token publicamente

### 5. Configurar OAuth2

1. Vá para a aba **"OAuth2" > "URL Generator"**
2. Selecione os **Scopes**:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Selecione as **Bot Permissions**:
   - ✅ `Send Messages`
   - ✅ `Use Slash Commands`
   - ✅ `Embed Links`
   - ✅ `Add Reactions`
   - ✅ `Use External Emojis`

4. Copie a URL gerada e use para adicionar o bot ao seu servidor de testes

## 🗄️ Configuração do Supabase

### 1. Criar Projeto

1. Acesse [Supabase](https://supabase.com)
2. Clique em **"New Project"**
3. Configure:
   - **Name**: `horacio-bot`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a mais próxima

### 2. Obter Credenciais

Após a criação, vá para **Settings > API**:
- **Project URL**: `https://xxx.supabase.co`
- **anon/public key**: Chave pública
- **service_role key**: Chave privada (⚠️ mantenha segura)

### 3. Configurar Database URL

Vá para **Settings > Database** e copie a **Connection String**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

## 💻 Instalação Local

### 1. Clonar Repositório

```bash
git clone <repository-url>
cd horacio-discord-bot
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Discord Bot Configuration
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=id_do_cliente_discord

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_privada_aqui

# Environment
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Bot Configuration
BOT_PREFIX=!
GUILD_ID=id_do_seu_servidor_de_testes
```

## 🗃️ Configuração do Banco de Dados

### 1. Gerar Cliente Prisma

```bash
npm run db:generate
```

### 2. Aplicar Schema ao Banco

```bash
npm run db:push
```

### 3. Verificar Conexão

```bash
npm run db:studio
```

Isso abrirá o Prisma Studio no navegador para visualizar os dados.

### 4. Configurar Row Level Security (RLS)

Execute os seguintes comandos SQL no Supabase SQL Editor:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Políticas para tabela characters
CREATE POLICY "Users can view own characters" ON characters
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own characters" ON characters
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own characters" ON characters
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own characters" ON characters
  FOR DELETE USING (auth.uid()::text = "userId");
```

## 🚀 Desenvolvimento

### 1. Iniciar em Modo de Desenvolvimento

```bash
npm run dev
```

Isso iniciará o bot com Hot Module Replacement (HMR) ativo.

### 2. Scripts Disponíveis

```bash
# Desenvolvimento com HMR
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm run start

# Linting
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check

# Testes
npm run test
npm run test:watch
npm run test:coverage

# Banco de dados
npm run db:generate    # Gerar cliente Prisma
npm run db:push       # Aplicar schema
npm run db:migrate    # Criar migração
npm run db:studio     # Abrir Prisma Studio
```

### 3. Estrutura de Desenvolvimento

```
src/
├── core/              # Lógica central
├── modules/           # Módulos de funcionalidade
│   ├── character/     # Sistema de personagens
│   └── dice-roller/   # Sistema de dados
└── main.ts           # Ponto de entrada
```

### 4. Adicionando Novos Comandos

1. Crie o arquivo em `src/modules/{modulo}/commands/`
2. Implemente a interface de comando
3. Registre no container de DI
4. Adicione ao handler de interações

## 🌐 Deploy em Produção

### 1. Preparação

```bash
# Build do projeto
npm run build

# Verificar se não há erros
npm run lint
npm run test
```

### 2. Variáveis de Ambiente de Produção

```env
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_URL="sua_url_de_producao"
DISCORD_TOKEN="token_do_bot_de_producao"
```

### 3. Deploy Options

#### Opção A: VPS/Servidor Próprio

```bash
# No servidor
git clone <repository-url>
cd horacio-discord-bot
npm install --production
npm run build
npm start
```

#### Opção B: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

#### Opção C: Plataformas Cloud

- **Railway**: Deploy automático via Git
- **Heroku**: Usando buildpack Node.js
- **DigitalOcean App Platform**: Deploy via Git
- **AWS/GCP/Azure**: Usando containers

### 4. Monitoramento

Configure logs e monitoramento:
- **Logs**: Pino com transporte para arquivo
- **Métricas**: CPU, memória, latência
- **Alertas**: Erros críticos, downtime

## 🔧 Troubleshooting

### Problemas Comuns

#### Bot não responde a comandos

1. **Verificar token**: Token correto no `.env`
2. **Verificar intents**: Message Content Intent habilitado
3. **Verificar permissões**: Bot tem permissões no servidor
4. **Verificar logs**: `npm run dev` e observar erros

#### Erro de conexão com banco

1. **Verificar URL**: DATABASE_URL correto
2. **Verificar rede**: Firewall/proxy bloqueando
3. **Verificar credenciais**: Senha e usuário corretos
4. **Testar conexão**: `npm run db:studio`

#### Comandos não aparecem no Discord

1. **Registrar comandos**: Implementar registro automático
2. **Verificar escopo**: Global vs Guild commands
3. **Aguardar**: Comandos globais demoram até 1 hora

#### Erro de dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Logs Úteis

```bash
# Ver logs em tempo real
npm run dev | grep ERROR

# Verificar status do banco
npm run db:studio

# Testar conexão Discord
node -e "console.log(require('discord.js').version)"
```

### Suporte

- **Documentação**: Consulte `ARCHITECTURE.md`
- **Issues**: Abra issue no repositório
- **Discord.js**: [Documentação oficial](https://discord.js.org/)
- **Prisma**: [Documentação oficial](https://www.prisma.io/docs/)
- **Supabase**: [Documentação oficial](https://supabase.com/docs)

---

🎭 **Parabéns!** Horácio está pronto para suas aventuras! Que os dados sejam gentis em sua jornada! ✨
