# Padrões Discord.js v14+ - Bot Horácio 🎭

Este documento define os padrões obrigatórios para desenvolvimento com Discord.js v14+ no projeto Horácio.

## 📋 Índice

- [Respostas Efêmeras](#respostas-efêmeras)
- [Interações e Comandos](#interações-e-comandos)
- [Embeds e Componentes](#embeds-e-componentes)
- [Tratamento de Erros](#tratamento-de-erros)

## 🔒 Respostas Efêmeras

### ✅ **PADRÃO OBRIGATÓRIO: MessageFlags.Ephemeral**

**TODAS** as respostas efêmeras DEVEM usar `MessageFlags.Ephemeral` em vez de `ephemeral: true`.

#### ❌ **PROIBIDO:**
```typescript
// NÃO FAÇA ISSO - Deprecated e gerará warnings
await interaction.reply({
  content: 'Mensagem',
  ephemeral: true, // ❌ PROIBIDO
});

await interaction.deferReply({ ephemeral: true }); // ❌ PROIBIDO
```

#### ✅ **CORRETO:**
```typescript
import { MessageFlags } from 'discord.js';

// ✅ PADRÃO OBRIGATÓRIO
await interaction.reply({
  content: 'Mensagem',
  flags: MessageFlags.Ephemeral,
});

await interaction.deferReply({ flags: MessageFlags.Ephemeral });

await interaction.followUp({
  content: 'Follow-up',
  flags: MessageFlags.Ephemeral,
});
```

### 📝 **Justificativa**

- **Longevidade**: `MessageFlags.Ephemeral` é o padrão futuro do Discord.js
- **Performance**: Evita warnings desnecessários
- **Manutenibilidade**: Código preparado para futuras versões
- **Consistência**: Padrão único em todo o projeto

## 🎯 **Quando Usar Respostas Efêmeras**

### ✅ **SEMPRE Efêmeras:**
- Mensagens de erro
- Comandos de configuração
- Informações pessoais (fichas de personagem)
- Confirmações de ações
- Mensagens de ajuda
- Dicas e tutoriais

### ❌ **NUNCA Efêmeras:**
- Resultados de rolagem de dados (devem ser públicos)
- Anúncios do bot
- Mensagens de entretenimento compartilhadas
- Resultados de comandos públicos

## 🎭 **Exemplos Práticos**

### Comando de Ficha (Efêmera)
```typescript
export class ViewCharacterCommand {
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // ✅ Defer efêmero para comandos pessoais
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    // Lógica do comando...
    
    await interaction.editReply({
      embeds: [characterEmbed],
      components: [actionRow],
    });
  }
}
```

### Comando de Rolagem (Pública)
```typescript
export class RollDiceCommand {
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // ✅ Defer público para rolagens compartilhadas
    await interaction.deferReply(); // Sem flags = público
    
    // Lógica de rolagem...
    
    await interaction.editReply({
      embeds: [rollResultEmbed],
    });
  }
}
```

### Tratamento de Erros (Sempre Efêmero)
```typescript
private async handleError(interaction: Interaction, error: unknown): Promise<void> {
  const errorMessage = this.getErrorMessage(error);
  
  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: errorMessage,
        flags: MessageFlags.Ephemeral, // ✅ Erros sempre efêmeros
      });
    } else {
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral, // ✅ Erros sempre efêmeros
      });
    }
  } catch (replyError) {
    this.logger.error('Erro ao enviar mensagem de erro:', replyError);
  }
}
```

## 🔧 **Configuração de Imports**

### Import Obrigatório
```typescript
import { 
  ChatInputCommandInteraction,
  MessageFlags, // ✅ SEMPRE importar
  // outros imports...
} from 'discord.js';
```

## 🚨 **Checklist de Revisão**

Antes de fazer commit, verifique:

- [ ] ✅ Todos os `ephemeral: true` foram substituídos por `flags: MessageFlags.Ephemeral`
- [ ] ✅ `MessageFlags` está importado em todos os arquivos que usam respostas efêmeras
- [ ] ✅ Comandos pessoais usam respostas efêmeras
- [ ] ✅ Comandos públicos (rolagens) NÃO usam respostas efêmeras
- [ ] ✅ Tratamento de erros sempre usa respostas efêmeras
- [ ] ✅ Não há warnings relacionados a `ephemeral` no console

## 📚 **Referências**

- [Discord.js v14 Guide - Message Flags](https://discordjs.guide/additional-info/changes-in-v14.html)
- [Discord API - Message Flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags)
- [Discord.js Documentation - MessageFlags](https://discord.js.org/#/docs/discord.js/main/class/MessageFlags)

---

**🎭 Lembre-se:** Horácio é um Bardo elegante que segue sempre as melhores práticas! ✨
