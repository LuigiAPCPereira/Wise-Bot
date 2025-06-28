/**
 * Interface do repositório de personagens
 * Define o contrato para acesso aos dados de personagens
 * Segue o padrão Repository para abstrair a camada de persistência
 */

import type { Character, User } from '@prisma/client';

/**
 * Dados para criação de um novo personagem (adaptado para WiseBot)
 */
export interface CreateCharacterData {
  name: string;
  description?: string;
  imageUrl?: string;
  system?: string;
  level?: number;
  experience?: number;
  attributes?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  equipment?: Record<string, unknown>;
  isPublic?: boolean;
  userId: string;
  guildId: string;
}

/**
 * Dados para atualização de um personagem existente (adaptado para WiseBot)
 */
export interface UpdateCharacterData {
  name?: string;
  description?: string;
  imageUrl?: string;
  system?: string;
  level?: number;
  experience?: number;
  attributes?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  equipment?: Record<string, unknown>;
  isActive?: boolean;
  isPublic?: boolean;
}

/**
 * Personagem com informações do usuário incluídas
 */
export interface CharacterWithUser extends Character {
  user: User;
}

/**
 * Opções para busca de personagens
 */
export interface FindCharactersOptions {
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'name' | 'level' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interface do repositório de personagens
 * Define todas as operações de acesso a dados relacionadas a personagens
 */
export interface ICharacterRepository {
  /**
   * Busca um personagem pelo ID
   * @param id - ID do personagem
   * @returns Promise<Character | null> - Personagem encontrado ou null
   */
  findById(id: string): Promise<Character | null>;

  /**
   * Busca um personagem pelo ID incluindo dados do usuário
   * @param id - ID do personagem
   * @returns Promise<CharacterWithUser | null> - Personagem com usuário ou null
   */
  findByIdWithUser(id: string): Promise<CharacterWithUser | null>;

  /**
   * Busca todos os personagens de um usuário
   * @param userId - ID do usuário
   * @param options - Opções de busca
   * @returns Promise<Character[]> - Lista de personagens
   */
  findByUserId(
    userId: string,
    options?: FindCharactersOptions
  ): Promise<Character[]>;

  /**
   * Busca um personagem específico de um usuário pelo nome
   * @param userId - ID do usuário
   * @param name - Nome do personagem
   * @returns Promise<Character | null> - Personagem encontrado ou null
   */
  findByUserIdAndName(userId: string, name: string): Promise<Character | null>;

  /**
   * Conta quantos personagens um usuário possui
   * @param userId - ID do usuário
   * @param includeInactive - Se deve incluir personagens inativos
   * @returns Promise<number> - Número de personagens
   */
  countByUserId(userId: string, includeInactive?: boolean): Promise<number>;

  /**
   * Cria um novo personagem
   * @param data - Dados do personagem
   * @returns Promise<Character> - Personagem criado
   */
  create(data: CreateCharacterData): Promise<Character>;

  /**
   * Atualiza um personagem existente
   * @param id - ID do personagem
   * @param data - Dados para atualização
   * @returns Promise<Character | null> - Personagem atualizado ou null se não encontrado
   */
  update(id: string, data: UpdateCharacterData): Promise<Character | null>;

  /**
   * Marca um personagem como inativo (soft delete)
   * @param id - ID do personagem
   * @returns Promise<boolean> - true se foi marcado como inativo, false se não encontrado
   */
  deactivate(id: string): Promise<boolean>;

  /**
   * Remove um personagem permanentemente (hard delete)
   * @param id - ID do personagem
   * @returns Promise<boolean> - true se foi removido, false se não encontrado
   */
  delete(id: string): Promise<boolean>;

  /**
   * Verifica se um personagem pertence a um usuário específico
   * @param characterId - ID do personagem
   * @param userId - ID do usuário
   * @returns Promise<boolean> - true se o personagem pertence ao usuário
   */
  belongsToUser(characterId: string, userId: string): Promise<boolean>;

  /**
   * Busca personagens por nível
   * @param level - Nível dos personagens
   * @param options - Opções de busca
   * @returns Promise<Character[]> - Lista de personagens
   */
  findByLevel(
    level: number,
    options?: FindCharactersOptions
  ): Promise<Character[]>;

  /**
   * Busca personagens por classe
   * @param characterClass - Classe dos personagens
   * @param options - Opções de busca
   * @returns Promise<Character[]> - Lista de personagens
   */
  findByClass(
    characterClass: string,
    options?: FindCharactersOptions
  ): Promise<Character[]>;

  /**
   * Busca personagens ativos de um usuário
   * @param userId - ID do usuário
   * @returns Promise<Character[]> - Lista de personagens ativos
   */
  findActiveByUserId(userId: string): Promise<Character[]>;
}
