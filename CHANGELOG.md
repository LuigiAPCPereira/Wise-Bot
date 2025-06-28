# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### Adicionado
- **🏗️ Arquitetura Limpa Completa**: Estrutura de projeto seguindo Clean Architecture
- **🔧 Ambiente de Desenvolvimento**: Hot reload com tsx watch em vez de Vite
- **💉 Injeção de Dependência**: Sistema completo com tsyringe e decorators
- **🗄️ Integração Supabase WiseBot**: Conexão com banco PostgreSQL existente
- **📊 Schema Prisma Adaptado**: Modelos User, Character, DiceRoll, GuildConfig compatíveis
- **🎭 Sistema de Conteúdo**: Mensagens centralizadas com personalidade de Bardo
- **🚨 Sistema de Erros**: Classes customizadas (AppError, CharacterNotFoundError)
- **📝 Padrões Discord.js v14+**: MessageFlags.Ephemeral obrigatório
- **🔍 Qualidade de Código**: ESLint com regras customizadas anti-ephemeral
- **📚 Documentação Técnica**: ARCHITECTURE.md, SETUP.md, DISCORD-PATTERNS.md
- **🎵 Logger Customizado**: Sistema de logs sem problemas de codificação UTF-8

### Alterado
- **⚡ Build System**: Migrado de Vite para tsx watch para melhor compatibilidade
- **📦 Dependências**: Removido vite-plugin-node, adicionado tsx
- **🎨 Formatação de Logs**: Substituído pino por logger customizado
- **🔤 Codificação**: Configurado chcp 65001 para UTF-8 no Windows

### Corrigido
- **🔧 Problemas de Codificação**: Caracteres corrompidos nos logs (­ƒÄ¡ → texto limpo)
- **⚠️ Warnings Discord.js**: Eliminado uso de ephemeral: true deprecated
- **🏗️ Estrutura de Pastas**: Organização completa seguindo padrões estabelecidos
- **📋 Imports**: Correção de todas as importações para ESM

### Segurança
- **🛡️ Row Level Security**: Documentação e configuração para RLS no Supabase
- **🔐 Validação de Dados**: Sistema robusto com Zod (preparado)
- **🚫 Regras ESLint**: Detecção automática de padrões deprecated

## [0.2.0] - 2025-06-27 (Fase 1 - Fundação Completa)

### Adicionado
- **🎭 Bot Online**: Horácio#1026 funcionando e conectado ao Discord
- **🗄️ Banco Conectado**: Integração completa com Supabase WiseBot
- **📋 Comando de Exemplo**: /ficha com estrutura completa (ViewCharacterCommand)
- **🔄 Hot Reload**: Desenvolvimento com tsx watch funcionando
- **📝 Logs Limpos**: Sistema de logging sem problemas de codificação

### Técnico
- **✅ Container DI**: tsyringe configurado e funcionando
- **✅ Prisma Client**: Gerado e conectado ao banco
- **✅ InteractionHandler**: Roteamento básico implementado
- **✅ Arquitetura**: Camadas Handler → Service → Repository → Database
- **✅ Padrões**: MessageFlags.Ephemeral implementado em todo código

## [0.1.0] - 2025-06-27 (Estrutura Inicial)

### Adicionado
- **📁 Estrutura de Pastas**: Organização completa seguindo Clean Architecture
- **⚙️ Configurações**: package.json, tsconfig.json, ESLint, Prettier
- **📊 Schema Prisma**: Modelos adaptados para banco WiseBot existente
- **📚 Documentação**: Guias completos de arquitetura e setup

## [1.0.0] - TBD (Fase 2 - Funcionalidades)

### Planejado
- **🎲 Sistema de Rolagem**: Comandos completos de dados com múltiplos sistemas
- **🎭 Fichas de Personagem**: CRUD completo com interface Discord
- **⚙️ Comandos de Configuração**: Sistema de configuração por servidor
- **🎵 Personalidade Completa**: Interações temáticas do Bardo
- **🧪 Testes**: Cobertura completa de testes unitários
- **🚀 Deploy**: Configuração para produção

---

## 📋 Stack Tecnológico Atual

### Core
- **TypeScript** 5.3.3 - Linguagem principal
- **Node.js** 18+ - Runtime
- **Discord.js** 14.14.1 - Framework Discord
- **tsx** 4.7.0 - Executor TypeScript com hot reload

### Banco de Dados
- **Prisma** 5.7.1 - ORM
- **PostgreSQL** - Banco de dados (Supabase)
- **Supabase** - Backend as a Service

### Arquitetura
- **tsyringe** 4.8.0 - Injeção de dependência
- **reflect-metadata** 0.1.13 - Decorators support

### Qualidade
- **ESLint** 8.56.0 - Linting
- **Prettier** 3.1.1 - Formatação
- **Vitest** 1.1.0 - Testes (configurado)

### Desenvolvimento
- **Hot Reload** - tsx watch
- **Path Mapping** - @/ aliases
- **UTF-8 Support** - chcp 65001

---

## 🎯 Marcos do Projeto

- **✅ 2025-06-27**: Fase 1 (Fundação) - Arquitetura e estrutura completas
- **🔄 Em Progresso**: Fase 2 (Funcionalidades) - Comandos e lógica de negócio
- **📅 Planejado**: Fase 3 (Deploy) - Produção e monitoramento

## ⚠️ Limitações Atuais (v0.2.0)

### Funcionalidades
- **🎲 Rolagem de Dados**: Apenas estrutura, sem implementação
- **🎭 Fichas**: Comando /ficha retorna placeholder
- **⚙️ Configuração**: Sistema não implementado
- **🧪 Testes**: Configurados mas sem cobertura

### Técnicas
- **🔄 Comando Registration**: Comandos não registrados automaticamente
- **🎵 Personalidade**: Mensagens implementadas mas não todas as interações
- **📊 Validação**: Zod configurado mas não utilizado
- **🛡️ RLS**: Documentado mas não aplicado

### Próximas Prioridades
1. **Registro de Comandos**: Sistema automático de registro slash commands
2. **Comando /rolar**: Implementação completa do sistema de dados
3. **CRUD Fichas**: Comandos create, edit, delete para personagens
4. **Validação**: Implementar Zod em todos os inputs
5. **Testes**: Cobertura mínima de 80%

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Alterado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas em breve
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas
- `Técnico` para melhorias de infraestrutura e arquitetura
