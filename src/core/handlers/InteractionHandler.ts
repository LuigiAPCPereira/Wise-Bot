/**
 * Handler principal para todas as interações do Discord
 * Responsável por rotear comandos, botões, modals e outros componentes
 */

import { getMessage } from '@/core/content/index.js';
import { AppError } from '@/core/errors/AppError.js';
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Interaction,
  InteractionType,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';

import { inject, singleton } from 'tsyringe';

/**
 * Handler principal de interações do Discord
 * Implementa o padrão Strategy para diferentes tipos de interação
 */
@singleton()
export class InteractionHandler {
  constructor(@inject('Logger') private readonly logger: any) {}

  /**
   * Processa uma interação do Discord
   * @param interaction - A interação recebida
   * @returns Promise<void>
   */
  public async handle(interaction: Interaction): Promise<void> {
    try {
      // Log da interação recebida
      this.logger.info('Interação recebida:', {
        type: interaction.type,
        user: interaction.user.tag,
        guild: interaction.guild?.name || 'DM',
      });

      // Roteamento baseado no tipo de interação
      switch (interaction.type) {
        case InteractionType.ApplicationCommand:
          await this.handleSlashCommand(
            interaction as ChatInputCommandInteraction
          );
          break;

        case InteractionType.MessageComponent:
          if (interaction.isButton()) {
            await this.handleButton(interaction);
          } else if (interaction.isStringSelectMenu()) {
            await this.handleSelectMenu(interaction);
          }
          break;

        case InteractionType.ModalSubmit:
          await this.handleModal(interaction);
          break;

        default:
          this.logger.warn(
            'Tipo de interação não suportado:',
            interaction.type
          );
      }
    } catch (error) {
      await this.handleError(interaction, error);
    }
  }

  /**
   * Processa comandos slash
   * @param interaction - Interação de comando slash
   * @returns Promise<void>
   */
  private async handleSlashCommand(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const commandName = interaction.commandName;

    this.logger.info(`Comando executado: /${commandName}`, {
      user: interaction.user.tag,
      options: interaction.options.data,
    });

    // TODO: Implementar carregamento dinâmico de comandos
    // Por enquanto, resposta de placeholder
    await interaction.reply({
      content: getMessage('command.not_implemented', { command: commandName }),
      flags: MessageFlags.Ephemeral,
    });
  }

  /**
   * Processa interações de botão
   * @param interaction - Interação de botão
   * @returns Promise<void>
   */
  private async handleButton(interaction: ButtonInteraction): Promise<void> {
    const customId = interaction.customId;

    this.logger.info(`Botão clicado: ${customId}`, {
      user: interaction.user.tag,
    });

    // Parse do customId para extrair ação e parâmetros
    const [action] = customId.split(':');

    // TODO: Implementar roteamento de botões baseado na ação
    // Por enquanto, resposta de placeholder
    await interaction.reply({
      content: getMessage('button.not_implemented', { action }),
      flags: MessageFlags.Ephemeral,
    });
  }

  /**
   * Processa menus de seleção
   * @param interaction - Interação de menu de seleção
   * @returns Promise<void>
   */
  private async handleSelectMenu(
    interaction: StringSelectMenuInteraction
  ): Promise<void> {
    const customId = interaction.customId;
    const selectedValues = interaction.values;

    this.logger.info(`Menu selecionado: ${customId}`, {
      user: interaction.user.tag,
      values: selectedValues,
    });

    // TODO: Implementar roteamento de menus de seleção
    // Por enquanto, resposta de placeholder
    await interaction.reply({
      content: getMessage('select.not_implemented', { menu: customId }),
      flags: MessageFlags.Ephemeral,
    });
  }

  /**
   * Processa submissões de modal
   * @param interaction - Interação de modal
   * @returns Promise<void>
   */
  private async handleModal(
    interaction: ModalSubmitInteraction
  ): Promise<void> {
    const customId = interaction.customId;

    this.logger.info(`Modal submetido: ${customId}`, {
      user: interaction.user.tag,
    });

    // TODO: Implementar roteamento de modals
    // Por enquanto, resposta de placeholder
    await interaction.reply({
      content: getMessage('modal.not_implemented', { modal: customId }),
      flags: MessageFlags.Ephemeral,
    });
  }

  /**
   * Trata erros de forma centralizada
   * @param interaction - A interação que causou o erro
   * @param error - O erro ocorrido
   * @returns Promise<void>
   */
  private async handleError(
    interaction: Interaction,
    error: unknown
  ): Promise<void> {
    this.logger.error('Erro ao processar interação:', {
      error,
      interaction: {
        type: interaction.type,
        user: interaction.user.tag,
        guild: interaction.guild?.name || 'DM',
      },
    });

    // Determina a mensagem de erro baseada no tipo
    let errorMessage: string;

    if (error instanceof AppError) {
      errorMessage = error.message;
    } else {
      errorMessage = getMessage('error.generic');
    }

    // Tenta responder ao usuário
    try {
      if (interaction.isRepliable()) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: errorMessage,
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: errorMessage,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    } catch (replyError) {
      this.logger.error('Erro ao enviar mensagem de erro:', replyError);
    }
  }
}
