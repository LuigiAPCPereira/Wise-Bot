/**
 * Erro específico para quando um personagem não é encontrado
 * Exemplo de como criar erros customizados específicos do domínio
 */

import { getMessage } from '@/core/content/index.js';
import {
  AppError,
  ErrorSeverity,
  ErrorType,
  type ErrorContext,
} from './AppError.js';

/**
 * Erro lançado quando um personagem não é encontrado no sistema
 * Fornece mensagem amigável ao usuário com a personalidade do Bardo
 */
export class CharacterNotFoundError extends AppError {
  /**
   * ID do personagem que não foi encontrado
   */
  public readonly characterId: string;

  /**
   * ID do usuário que tentou acessar o personagem
   */
  public readonly userId: string;

  /**
   * Cria uma nova instância de CharacterNotFoundError
   *
   * @param characterId - ID do personagem não encontrado
   * @param userId - ID do usuário que tentou acessar
   * @param context - Contexto adicional do erro
   */
  constructor(characterId: string, userId: string, context: ErrorContext = {}) {
    // Usa a mensagem do sistema de conteúdo para manter a personalidade
    const message = getMessage('character.not_found');

    super(
      message,
      ErrorType.NOT_FOUND,
      'CHARACTER_NOT_FOUND',
      ErrorSeverity.LOW,
      true, // É um erro que deve ser mostrado ao usuário
      {
        ...context,
        characterId,
        userId,
        resource: 'character',
      }
    );

    this.characterId = characterId;
    this.userId = userId;
  }

  /**
   * Cria um CharacterNotFoundError com contexto de comando
   *
   * @param characterId - ID do personagem
   * @param userId - ID do usuário
   * @param commandName - Nome do comando que causou o erro
   * @param interactionId - ID da interação
   * @returns Nova instância do erro
   */
  public static fromCommand(
    characterId: string,
    userId: string,
    commandName: string,
    interactionId?: string
  ): CharacterNotFoundError {
    return new CharacterNotFoundError(characterId, userId, {
      commandName,
      interactionId,
      source: 'command',
    });
  }

  /**
   * Cria um CharacterNotFoundError com contexto de componente
   *
   * @param characterId - ID do personagem
   * @param userId - ID do usuário
   * @param componentType - Tipo do componente (button, select, modal)
   * @param customId - Custom ID do componente
   * @returns Nova instância do erro
   */
  public static fromComponent(
    characterId: string,
    userId: string,
    componentType: 'button' | 'select' | 'modal',
    customId: string
  ): CharacterNotFoundError {
    return new CharacterNotFoundError(characterId, userId, {
      componentType,
      customId,
      source: 'component',
    });
  }

  /**
   * Converte o erro para JSON incluindo informações específicas
   * @returns Objeto JSON com informações do erro
   */
  public override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      characterId: this.characterId,
      userId: this.userId,
    };
  }

  /**
   * Cria uma representação string específica para este erro
   * @returns String formatada
   */
  public override toString(): string {
    return `${this.name} [${this.code}]: Character ${this.characterId} not found for user ${this.userId}`;
  }
}
