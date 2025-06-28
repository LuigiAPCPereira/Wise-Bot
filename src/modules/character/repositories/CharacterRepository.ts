/**
 * Implementação do repositório de personagens usando Prisma
 * Esta é a ÚNICA camada que pode interagir diretamente com o PrismaClient
 * Implementa todas as operações CRUD para personagens
 */

import type { Character, PrismaClient } from '@prisma/client';
import { inject, singleton } from 'tsyringe';
import type {
  CharacterWithUser,
  CreateCharacterData,
  FindCharactersOptions,
  ICharacterRepository,
  UpdateCharacterData,
} from './ICharacterRepository.js';

/**
 * Implementação concreta do repositório de personagens
 * Usa Prisma para todas as operações de banco de dados
 */
@singleton()
export class CharacterRepository implements ICharacterRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  /**
   * Busca um personagem pelo ID
   * @param id - ID do personagem
   * @returns Promise<Character | null>
   */
  public async findById(id: string): Promise<Character | null> {
    return this.prisma.character.findUnique({
      where: { id },
    });
  }

  /**
   * Busca um personagem pelo ID incluindo dados do usuário
   * @param id - ID do personagem
   * @returns Promise<CharacterWithUser | null>
   */
  public async findByIdWithUser(id: string): Promise<CharacterWithUser | null> {
    return this.prisma.character.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  /**
   * Busca todos os personagens de um usuário
   * @param userId - ID do usuário
   * @param options - Opções de busca
   * @returns Promise<Character[]>
   */
  public async findByUserId(
    userId: string,
    options: FindCharactersOptions = {}
  ): Promise<Character[]> {
    const {
      includeInactive = false,
      limit,
      offset,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    return this.prisma.character.findMany({
      where: {
        userId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { [orderBy]: orderDirection },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  /**
   * Busca um personagem específico de um usuário pelo nome
   * @param userId - ID do usuário
   * @param name - Nome do personagem
   * @returns Promise<Character | null>
   */
  public async findByUserIdAndName(
    userId: string,
    name: string
  ): Promise<Character | null> {
    return this.prisma.character.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive search
        },
        isActive: true,
      },
    });
  }

  /**
   * Conta quantos personagens um usuário possui
   * @param userId - ID do usuário
   * @param includeInactive - Se deve incluir personagens inativos
   * @returns Promise<number>
   */
  public async countByUserId(
    userId: string,
    includeInactive = false
  ): Promise<number> {
    return this.prisma.character.count({
      where: {
        userId,
        ...(includeInactive ? {} : { isActive: true }),
      },
    });
  }

  /**
   * Cria um novo personagem
   * @param data - Dados do personagem
   * @returns Promise<Character>
   */
  public async create(data: CreateCharacterData): Promise<Character> {
    return this.prisma.character.create({
      data: {
        ...data,
        // Garante valores padrão se não fornecidos
        level: data.level ?? 1,
        currentHp: data.currentHp ?? 0,
        maxHp: data.maxHp ?? 0,
        strength: data.strength ?? 10,
        dexterity: data.dexterity ?? 10,
        constitution: data.constitution ?? 10,
        intelligence: data.intelligence ?? 10,
        wisdom: data.wisdom ?? 10,
        charisma: data.charisma ?? 10,
      },
    });
  }

  /**
   * Atualiza um personagem existente
   * @param id - ID do personagem
   * @param data - Dados para atualização
   * @returns Promise<Character | null>
   */
  public async update(
    id: string,
    data: UpdateCharacterData
  ): Promise<Character | null> {
    try {
      return await this.prisma.character.update({
        where: { id },
        data,
      });
    } catch (error) {
      // Se o personagem não existe, retorna null
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Marca um personagem como inativo (soft delete)
   * @param id - ID do personagem
   * @returns Promise<boolean>
   */
  public async deactivate(id: string): Promise<boolean> {
    try {
      await this.prisma.character.update({
        where: { id },
        data: { isActive: false },
      });
      return true;
    } catch (error) {
      // Se o personagem não existe, retorna false
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Remove um personagem permanentemente (hard delete)
   * @param id - ID do personagem
   * @returns Promise<boolean>
   */
  public async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.character.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Se o personagem não existe, retorna false
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Verifica se um personagem pertence a um usuário específico
   * @param characterId - ID do personagem
   * @param userId - ID do usuário
   * @returns Promise<boolean>
   */
  public async belongsToUser(
    characterId: string,
    userId: string
  ): Promise<boolean> {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      select: { userId: true },
    });

    return character?.userId === userId;
  }

  /**
   * Busca personagens por nível
   * @param level - Nível dos personagens
   * @param options - Opções de busca
   * @returns Promise<Character[]>
   */
  public async findByLevel(
    level: number,
    options: FindCharactersOptions = {}
  ): Promise<Character[]> {
    const {
      includeInactive = false,
      limit,
      offset,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    return this.prisma.character.findMany({
      where: {
        level,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { [orderBy]: orderDirection },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  /**
   * Busca personagens por classe
   * @param characterClass - Classe dos personagens
   * @param options - Opções de busca
   * @returns Promise<Character[]>
   */
  public async findByClass(
    characterClass: string,
    options: FindCharactersOptions = {}
  ): Promise<Character[]> {
    const {
      includeInactive = false,
      limit,
      offset,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    return this.prisma.character.findMany({
      where: {
        class: {
          equals: characterClass,
          mode: 'insensitive',
        },
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { [orderBy]: orderDirection },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  /**
   * Busca personagens ativos de um usuário
   * @param userId - ID do usuário
   * @returns Promise<Character[]>
   */
  public async findActiveByUserId(userId: string): Promise<Character[]> {
    return this.findByUserId(userId, { includeInactive: false });
  }
}
