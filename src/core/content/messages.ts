/**
 * Sistema de conteúdo centralizado
 * Todas as mensagens visíveis ao usuário devem estar aqui
 * Implementa a personalidade de Bardo do Horácio
 */

/**
 * Tipo para as chaves de mensagens
 */
export type MessageKey = keyof typeof messages;

/**
 * Objeto contendo todas as mensagens do bot
 * Organizado por categorias para facilitar a manutenção
 */
export const messages = {
  // ============================================================================
  // MENSAGENS GERAIS
  // ============================================================================
  'bot.welcome': '🎭 Olá, aventureiro! Eu sou Horácio, seu Bardo pessoal! ✨',
  'bot.ready': '🎵 Horácio está afinando sua lira e pronto para a aventura! 🎵',

  // ============================================================================
  // COMANDOS
  // ============================================================================
  'command.not_implemented':
    '🎭 Ah, meu caro! O comando `{{command}}` ainda está sendo composto... 🎵 Volte em breve para esta melodia! ✨',
  'command.success': '✨ Comando executado com sucesso! 🎭',
  'command.invalid':
    '🎵 Hmm, essa nota não existe na minha partitura... Tente outro comando! 🎭',

  // ============================================================================
  // COMPONENTES (BOTÕES, MENUS, MODALS)
  // ============================================================================
  'button.not_implemented':
    '🎭 Este botão `{{action}}` ainda está sendo afinado... 🎵 Em breve estará pronto! ✨',
  'select.not_implemented':
    '🎵 Este menu `{{menu}}` ainda não tem sua melodia completa... 🎭 Aguarde a próxima apresentação! ✨',
  'modal.not_implemented':
    '🎭 Este formulário `{{modal}}` ainda está sendo escrito... 📜 Volte em breve! ✨',

  // ============================================================================
  // SISTEMA DE PERSONAGENS
  // ============================================================================
  'character.not_found':
    '🎭 Ora, ora! Parece que este personagem se perdeu na taverna... 🍻 Que tal criar um novo? ✨',
  'character.created':
    '🎵 Magnífico! Um novo herói nasceu! {{name}} está pronto para grandes aventuras! 🎭✨',
  'character.updated':
    '✨ {{name}} evoluiu! As mudanças foram registradas nos pergaminhos! 📜🎭',
  'character.deleted':
    '🎵 Farewell, {{name}}! Que suas aventuras sejam lembradas nas canções... 🎭💫',
  'character.list_empty':
    '🎭 Sua taverna está vazia, aventureiro! Que tal criar seu primeiro personagem? ✨🍻',

  // ============================================================================
  // SISTEMA DE DADOS
  // ============================================================================
  'dice.roll_success': '🎲 {{user}} rolou {{dice}}: **{{result}}** 🎭✨',
  'dice.roll_critical':
    '🎲💥 CRÍTICO! {{user}} rolou {{dice}}: **{{result}}** - Os deuses sorriem! 🎭⚡',
  'dice.roll_fumble':
    '🎲💀 FALHA CRÍTICA! {{user}} rolou {{dice}}: **{{result}}** - Até os bardos erram... 🎭😅',
  'dice.invalid_format':
    '🎵 Hmm, essa notação de dados não está na minha partitura... Tente algo como `1d20+5`! 🎭',

  // ============================================================================
  // ERROS
  // ============================================================================
  'error.generic':
    '🎭 Ops! Minha lira desafinou... Algo deu errado! Tente novamente em um momento. ✨',
  'error.permission_denied':
    '🎵 Ah, meu caro! Você não tem permissão para esta melodia... 🎭🚫',
  'error.user_not_found':
    '🎭 Parece que você ainda não se registrou na taverna! Use um comando primeiro. ✨',
  'error.database':
    '📜 Os pergaminhos estão temporariamente indisponíveis... Tente novamente! 🎭',
  'error.timeout':
    '⏰ A música parou... A interação expirou! Tente novamente. 🎵',

  // ============================================================================
  // VALIDAÇÕES
  // ============================================================================
  'validation.required_field':
    '📜 O campo {{field}} é obrigatório, meu caro aventureiro! ✨',
  'validation.invalid_number': '🎵 {{field}} deve ser um número válido! 🎭',
  'validation.min_length':
    '📜 {{field}} deve ter pelo menos {{min}} caracteres! ✨',
  'validation.max_length':
    '📜 {{field}} não pode ter mais que {{max}} caracteres! ✨',
  'validation.invalid_level':
    '🎭 O nível deve estar entre 1 e 20, jovem aventureiro! ✨',

  // ============================================================================
  // CONFIRMAÇÕES
  // ============================================================================
  'confirm.delete_character':
    '🎭 Tem certeza que deseja despedir {{name}}? Esta ação não pode ser desfeita! 💫',
  'confirm.yes': '✅ Sim',
  'confirm.no': '❌ Não',
  'confirm.cancel': '🎵 Ação cancelada! Nada foi alterado. 🎭',

  // ============================================================================
  // LABELS DE BOTÕES E COMPONENTES
  // ============================================================================
  'button.create_character': '🎭 Criar Personagem',
  'button.view_character': '👁️ Ver Ficha',
  'button.edit_character': '✏️ Editar',
  'button.delete_character': '🗑️ Excluir',
  'button.roll_dice': '🎲 Rolar Dados',
  'button.next_page': '➡️ Próxima',
  'button.prev_page': '⬅️ Anterior',

  // ============================================================================
  // EMBEDS E FORMATAÇÃO
  // ============================================================================
  'embed.character_sheet_title': '📜 Ficha de {{name}}',
  'embed.character_list_title': '🎭 Seus Personagens',
  'embed.dice_result_title': '🎲 Resultado da Rolagem',
  'embed.footer': '🎵 Horácio, o Bardo dos Dados ✨',

  // ============================================================================
  // DICAS DO BARDO
  // ============================================================================
  'tip.character_creation':
    '💡 **Dica do Bardo**: Use uma biografia interessante para dar vida ao seu personagem! 🎭',
  'tip.dice_rolling':
    '💡 **Dica do Bardo**: Experimente rolagens complexas como `4d6kh3` (4 dados de 6, mantendo os 3 maiores)! 🎲',
  'tip.equipment':
    '💡 **Dica do Bardo**: Não esqueça de equipar seu personagem adequadamente! ⚔️',

  // ============================================================================
  // RIMAS E CONCLUSÕES TEMÁTICAS
  // ============================================================================
  'outro.adventure_awaits':
    '🎵 *A aventura te espera, herói destemido,* 🎵\n🎵 *Com dados na mão e sonhos cumpridos!* 🎵 🎭✨',
  'outro.character_ready':
    '🎵 *Seu personagem está pronto para brilhar,* 🎵\n🎵 *Nas tavernas e masmorras vai se destacar!* 🎵 🎭⚔️',
  'outro.dice_blessing':
    '🎵 *Que os dados sejam gentis em sua jornada,* 🎵\n🎵 *E a sorte seja sua fiel companhada!* 🎵 🎲✨',
} as const;
