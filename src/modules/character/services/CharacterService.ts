/**
 * Serviço de personagens - Lógica de negócio pura
 * Esta camada NÃO conhece Discord.js nem Prisma
 * Contém apenas regras de negócio e orquestração
 */

import { AppError } from '@/core/errors/AppError.js';
import { CharacterNotFoundError } from '@/core/errors/CharacterNotFoundError.js';
import type { Character } from '@prisma/client';
import { inject, singleton } from 'tsyringe';
import type {
  CharacterWithUser,
  CreateCharacterData,
  ICharacterRepository,
  UpdateCharacterData,
} from '../repositories/ICharacterRepository.js';

/**
 * Dados de entrada para criação de personagem (validados) - WiseBot
 */
export interface CreateCharacterInput {
  name: string;
  description?: string;
  imageUrl?: string;
  system?: string;
  level?: number;
  isPublic?: boolean;
  userId: string;
  guildId: string;
}

/**
 * Dados de entrada para atualização de personagem - WiseBot
 */
export interface UpdateCharacterInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  system?: string;
  level?: number;
  experience?: number;
  attributes?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  equipment?: Record<string, unknown>;
  isPublic?: boolean;
}

/**
 * Resultado de operações de personagem
 */
export interface CharacterOperationResult {
  success: boolean;
  character?: Character;
  message?: string;
}

/**
 * Serviço de personagens
 * Contém toda a lógica de negócio relacionada a personagens
 */
@singleton()
export class CharacterService {
  constructor(
    @inject('CharacterRepository')
    private readonly characterRepository: ICharacterRepository
  ) {}

  /**
   * Obtém detalhes de um personagem
   * @param characterId - ID do personagem
   * @param userId - ID do usuário (para verificação de propriedade)
   * @returns Promise<CharacterWithUser>
   * @throws CharacterNotFoundError se o personagem não for encontrado
   * @throws AppError se o personagem não pertencer ao usuário
   */
  public async getCharacterDetails(
    characterId: string,
    userId: string
  ): Promise<CharacterWithUser> {
    // Busca o personagem com dados do usuário
    const character =
      await this.characterRepository.findByIdWithUser(characterId);

    if (!character) {
      throw new CharacterNotFoundError(characterId, userId);
    }

    // Verifica se o personagem pertence ao usuário
    if (character.userId !== userId) {
      throw AppError.permissionDenied('visualizar personagem', characterId);
    }

    return character;
  }

  /**
   * Lista todos os personagens de um usuário
   * @param userId - ID do usuário
   * @param includeInactive - Se deve incluir personagens inativos
   * @returns Promise<Character[]>
   */
  public async getUserCharacters(
    userId: string,
    includeInactive = false
  ): Promise<Character[]> {
    return this.characterRepository.findByUserId(userId, { includeInactive });
  }

  /**
   * Cria um novo personagem
   * @param input - Dados do personagem
   * @returns Promise<CharacterOperationResult>
   * @throws AppError se os dados forem inválidos
   */
  public async createCharacter(
    input: CreateCharacterInput
  ): Promise<CharacterOperationResult> {
    // Validações de negócio
    this.validateCharacterInput(input);

    // Verifica se já existe um personagem com o mesmo nome para o usuário
    const existingCharacter =
      await this.characterRepository.findByUserIdAndName(
        input.userId,
        input.name
      );

    if (existingCharacter) {
      throw AppError.validation(
        `Você já possui um personagem chamado "${input.name}"`,
        'name',
        input.name
      );
    }

    // Prepara os dados para criação (WiseBot schema)
    const characterData: CreateCharacterData = {
      ...input,
      level: input.level ?? 1,
      experience: 0,
      system: input.system ?? 'd20',
      // Atributos padrão para D&D 5e
      attributes: this.getDefaultAttributes(input.system ?? 'd20'),
      skills: {},
      equipment: {},
      isPublic: input.isPublic ?? false,
    };

    // Cria o personagem
    const character = await this.characterRepository.create(characterData);

    return {
      success: true,
      character,
      message: `Personagem ${character.name} criado com sucesso!`,
    };
  }

  /**
   * Atualiza um personagem existente
   * @param characterId - ID do personagem
   * @param userId - ID do usuário
   * @param input - Dados para atualização
   * @returns Promise<CharacterOperationResult>
   * @throws CharacterNotFoundError se o personagem não for encontrado
   * @throws AppError se o usuário não tiver permissão
   */
  public async updateCharacter(
    characterId: string,
    userId: string,
    input: UpdateCharacterInput
  ): Promise<CharacterOperationResult> {
    // Verifica se o personagem existe e pertence ao usuário
    const existingCharacter =
      await this.characterRepository.findById(characterId);

    if (!existingCharacter) {
      throw new CharacterNotFoundError(characterId, userId);
    }

    if (existingCharacter.userId !== userId) {
      throw AppError.permissionDenied('editar personagem', characterId);
    }

    // Validações de negócio
    if (input.name) {
      this.validateCharacterName(input.name);
    }

    if (input.level) {
      this.validateLevel(input.level);
    }

    // Prepara dados para atualização (WiseBot schema)
    const updateData: UpdateCharacterData = { ...input };

    // Se o nível mudou, pode ajustar experiência
    if (input.level && input.level !== existingCharacter.level) {
      // Lógica de experiência baseada no nível (opcional)
      updateData.experience = this.calculateExperienceForLevel(input.level);
    }

    // Atualiza o personagem
    const updatedCharacter = await this.characterRepository.update(
      characterId,
      updateData
    );

    return {
      success: true,
      character: updatedCharacter!,
      message: `Personagem ${updatedCharacter!.name} atualizado com sucesso!`,
    };
  }

  /**
   * Remove um personagem (soft delete)
   * @param characterId - ID do personagem
   * @param userId - ID do usuário
   * @returns Promise<CharacterOperationResult>
   * @throws CharacterNotFoundError se o personagem não for encontrado
   * @throws AppError se o usuário não tiver permissão
   */
  public async deleteCharacter(
    characterId: string,
    userId: string
  ): Promise<CharacterOperationResult> {
    // Verifica se o personagem existe e pertence ao usuário
    const character = await this.characterRepository.findById(characterId);

    if (!character) {
      throw new CharacterNotFoundError(characterId, userId);
    }

    if (character.userId !== userId) {
      throw AppError.permissionDenied('excluir personagem', characterId);
    }

    // Marca como inativo (soft delete)
    const success = await this.characterRepository.deactivate(characterId);

    return {
      success,
      message: success
        ? `Personagem ${character.name} foi removido com sucesso!`
        : 'Erro ao remover personagem',
    };
  }

  /**
   * Valida os dados de entrada de um personagem
   * @param input - Dados do personagem
   * @throws AppError se os dados forem inválidos
   */
  private validateCharacterInput(input: CreateCharacterInput): void {
    this.validateCharacterName(input.name);

    if (input.level) {
      this.validateLevel(input.level);
    }
  }

  /**
   * Valida o nome do personagem
   * @param name - Nome do personagem
   * @throws AppError se o nome for inválido
   */
  private validateCharacterName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw AppError.validation('Nome do personagem é obrigatório', 'name');
    }

    if (name.length < 2) {
      throw AppError.validation(
        'Nome deve ter pelo menos 2 caracteres',
        'name'
      );
    }

    if (name.length > 50) {
      throw AppError.validation(
        'Nome não pode ter mais que 50 caracteres',
        'name'
      );
    }

    // Verifica caracteres válidos (letras, espaços, hífens, apostrofes)
    const validNameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!validNameRegex.test(name)) {
      throw AppError.validation(
        'Nome pode conter apenas letras, espaços, hífens e apostrofes',
        'name'
      );
    }
  }

  /**
   * Valida o nível do personagem
   * @param level - Nível do personagem
   * @throws AppError se o nível for inválido
   */
  private validateLevel(level: number): void {
    if (level < 1 || level > 20) {
      throw AppError.validation('Nível deve estar entre 1 e 20', 'level');
    }
  }

  /**
   * Obtém atributos padrão baseado no sistema de RPG
   * @param system - Sistema de RPG (d20, d100, etc.)
   * @returns Objeto com atributos padrão
   */
  private getDefaultAttributes(system: string): Record<string, unknown> {
    switch (system) {
      case 'd20':
        return {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
          hitPoints: { current: 8, max: 8 },
          armorClass: 10,
        };
      case 'd100':
        return {
          strength: 50,
          dexterity: 50,
          constitution: 50,
          intelligence: 50,
          power: 50,
          charisma: 50,
          hitPoints: 10,
          sanity: 50,
        };
      default:
        return {};
    }
  }

  /**
   * Calcula experiência necessária para um nível
   * @param level - Nível do personagem
   * @returns Experiência necessária
   */
  private calculateExperienceForLevel(level: number): number {
    // Tabela de experiência D&D 5e simplificada
    const expTable = [
      0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000,
    ];
    return expTable[Math.min(level, expTable.length - 1)] || 0;
  }
}
