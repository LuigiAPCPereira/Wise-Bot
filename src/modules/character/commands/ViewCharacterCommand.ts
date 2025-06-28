/**
 * Comando para visualizar ficha de personagem
 * Exemplo de implementação de comando slash seguindo a arquitetura limpa
 */

import { getMessage } from '@/core/content/index.js';
import { AppError } from '@/core/errors/AppError.js';
import { CharacterNotFoundError } from '@/core/errors/CharacterNotFoundError.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

import { inject, singleton } from 'tsyringe';
import { CharacterService } from '../services/CharacterService.js';

/**
 * Comando para visualizar ficha de personagem
 * Demonstra como integrar serviços com comandos Discord
 */
@singleton()
export class ViewCharacterCommand {
  /**
   * Definição do comando slash
   */
  public static readonly data = new SlashCommandBuilder()
    .setName('ficha')
    .setDescription('🎭 Visualiza a ficha de um personagem')
    .addStringOption(option =>
      option
        .setName('personagem')
        .setDescription('Nome ou ID do personagem')
        .setRequired(false)
    );

  constructor(
    @inject('CharacterService')
    private readonly characterService: CharacterService,
    @inject('Logger') private readonly logger: any
  ) {}

  /**
   * Executa o comando de visualização de ficha
   * @param interaction - Interação do comando slash
   * @returns Promise<void>
   */
  public async execute(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const userId = interaction.user.id;
      const characterInput = interaction.options.getString('personagem');

      this.logger.info('Comando /ficha executado', {
        userId,
        characterInput,
        guild: interaction.guild?.name,
      });

      // Se não foi especificado um personagem, lista todos
      if (!characterInput) {
        await this.showCharacterList(interaction, userId);
        return;
      }

      // Tenta buscar por ID primeiro, depois por nome
      await this.showSpecificCharacter(interaction, userId, characterInput);
    } catch (error) {
      await this.handleError(interaction, error);
    }
  }

  /**
   * Mostra a lista de personagens do usuário
   * @param interaction - Interação do Discord
   * @param userId - ID do usuário
   * @returns Promise<void>
   */
  private async showCharacterList(
    interaction: ChatInputCommandInteraction,
    userId: string
  ): Promise<void> {
    const characters = await this.characterService.getUserCharacters(userId);

    if (characters.length === 0) {
      await interaction.editReply({
        content: getMessage('character.list_empty'),
      });
      return;
    }

    // Cria embed com lista de personagens
    const embed = new EmbedBuilder()
      .setTitle(getMessage('embed.character_list_title'))
      .setColor(0x9b59b6) // Cor roxa temática do bardo
      .setFooter({ text: getMessage('embed.footer') })
      .setTimestamp();

    // Adiciona cada personagem como um field
    for (const character of characters.slice(0, 10)) {
      // Limita a 10 personagens
      const attributes = character.attributes as any;
      const hp = attributes?.hitPoints || { current: 0, max: 0 };

      const characterInfo = [
        `**Sistema:** ${character.system}`,
        `**Nível:** ${character.level}`,
        `**HP:** ${hp.current}/${hp.max}`,
        `**XP:** ${character.experience}`,
      ].join('\n');

      embed.addFields({
        name: `🎭 ${character.name}`,
        value: characterInfo,
        inline: true,
      });
    }

    // Adiciona dica se houver muitos personagens
    if (characters.length > 10) {
      embed.setDescription(
        `Mostrando os primeiros 10 de ${characters.length} personagens.\n` +
          'Use `/ficha personagem:<nome>` para ver um específico.'
      );
    }

    // Botões de ação
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('character:create')
        .setLabel(getMessage('button.create_character'))
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎭'),
      new ButtonBuilder()
        .setCustomId('character:list:refresh')
        .setLabel('🔄 Atualizar')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({
      embeds: [embed],
      components: [actionRow],
    });
  }

  /**
   * Mostra um personagem específico
   * @param interaction - Interação do Discord
   * @param userId - ID do usuário
   * @param characterInput - Nome ou ID do personagem
   * @returns Promise<void>
   */
  private async showSpecificCharacter(
    interaction: ChatInputCommandInteraction,
    userId: string,
    characterInput: string
  ): Promise<void> {
    let character;

    try {
      // Tenta buscar por ID primeiro
      character = await this.characterService.getCharacterDetails(
        characterInput,
        userId
      );
    } catch (error) {
      if (error instanceof CharacterNotFoundError) {
        // Se não encontrou por ID, busca por nome
        // TODO: Implementar busca por nome no serviço
        throw error;
      }
      throw error;
    }

    // Cria embed detalhado do personagem
    const embed = new EmbedBuilder()
      .setTitle(
        getMessage('embed.character_sheet_title', { name: character.name })
      )
      .setColor(0x9b59b6)
      .setFooter({ text: getMessage('embed.footer') })
      .setTimestamp(character.updatedAt);

    // Informações básicas (adaptado para WiseBot)
    const attributes = character.attributes as any;
    const hp = attributes?.hitPoints || { current: 0, max: 0 };

    embed.addFields(
      {
        name: '📋 Informações Básicas',
        value: [
          `**Sistema:** ${character.system}`,
          `**Nível:** ${character.level}`,
          `**Experiência:** ${character.experience}`,
          `**Público:** ${character.isPublic ? 'Sim' : 'Não'}`,
        ].join('\n'),
        inline: true,
      },
      {
        name: '❤️ Pontos de Vida',
        value: [
          `**Atual:** ${hp.current}`,
          `**Máximo:** ${hp.max}`,
          `**Status:** ${this.getHealthStatus(hp.current, hp.max)}`,
        ].join('\n'),
        inline: true,
      },
      {
        name: '\u200B', // Campo vazio para quebra de linha
        value: '\u200B',
        inline: false,
      },
      {
        name: '💪 Atributos Físicos',
        value: [
          `**FOR:** ${attributes?.strength || 10} (${this.getModifier(attributes?.strength || 10)})`,
          `**DES:** ${attributes?.dexterity || 10} (${this.getModifier(attributes?.dexterity || 10)})`,
          `**CON:** ${attributes?.constitution || 10} (${this.getModifier(attributes?.constitution || 10)})`,
        ].join('\n'),
        inline: true,
      },
      {
        name: '🧠 Atributos Mentais',
        value: [
          `**INT:** ${attributes?.intelligence || 10} (${this.getModifier(attributes?.intelligence || 10)})`,
          `**SAB:** ${attributes?.wisdom || 10} (${this.getModifier(attributes?.wisdom || 10)})`,
          `**CAR:** ${attributes?.charisma || 10} (${this.getModifier(attributes?.charisma || 10)})`,
        ].join('\n'),
        inline: true,
      }
    );

    // Descrição se existir
    if (character.description) {
      embed.addFields({
        name: '📖 Descrição',
        value:
          character.description.length > 1024
            ? `${character.description.substring(0, 1021)}...`
            : character.description,
        inline: false,
      });
    }

    // Botões de ação
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`character:edit:${character.id}`)
        .setLabel(getMessage('button.edit_character'))
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✏️'),
      new ButtonBuilder()
        .setCustomId(`character:delete:${character.id}`)
        .setLabel(getMessage('button.delete_character'))
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️'),
      new ButtonBuilder()
        .setCustomId(`dice:roll:1d20`)
        .setLabel(getMessage('button.roll_dice'))
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎲')
    );

    await interaction.editReply({
      embeds: [embed],
      components: [actionRow],
    });

    // Adiciona uma dica do bardo
    setTimeout(async () => {
      try {
        await interaction.followUp({
          content: getMessage('tip.character_creation'),
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        // Ignora erros de follow-up (pode ter expirado)
        this.logger.debug('Erro ao enviar dica:', error);
      }
    }, 2000);
  }

  /**
   * Calcula o modificador de um atributo
   * @param attribute - Valor do atributo
   * @returns Modificador formatado
   */
  private getModifier(attribute: number): string {
    const modifier = Math.floor((attribute - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  /**
   * Obtém o status de saúde baseado no HP
   * @param current - HP atual
   * @param max - HP máximo
   * @returns Status de saúde
   */
  private getHealthStatus(current: number, max: number): string {
    const percentage = (current / max) * 100;

    if (percentage <= 0) return '💀 Morto';
    if (percentage <= 25) return '🩸 Crítico';
    if (percentage <= 50) return '🤕 Ferido';
    if (percentage <= 75) return '😐 Machucado';
    return '😊 Saudável';
  }

  /**
   * Trata erros do comando
   * @param interaction - Interação do Discord
   * @param error - Erro ocorrido
   * @returns Promise<void>
   */
  private async handleError(
    interaction: ChatInputCommandInteraction,
    error: unknown
  ): Promise<void> {
    this.logger.error('Erro no comando /ficha:', error);

    let errorMessage: string;

    if (error instanceof CharacterNotFoundError) {
      errorMessage = error.message;
    } else if (error instanceof AppError) {
      errorMessage = error.message;
    } else {
      errorMessage = getMessage('error.generic');
    }

    try {
      if (interaction.deferred) {
        await interaction.editReply({ content: errorMessage });
      } else {
        await interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (replyError) {
      this.logger.error('Erro ao responder com mensagem de erro:', replyError);
    }
  }
}
