/**
 * Configuração do container de injeção de dependência
 * Registra todas as dependências do sistema usando tsyringe
 */

import { PrismaClient } from '@prisma/client';

import 'reflect-metadata';
import { container } from 'tsyringe';

// Importações dos repositórios e serviços
import { CharacterRepository } from '@/modules/character/repositories/CharacterRepository.js';
import { ICharacterRepository } from '@/modules/character/repositories/ICharacterRepository.js';
import { CharacterService } from '@/modules/character/services/CharacterService.js';

/**
 * Configura e registra todas as dependências no container
 * @returns Promise<void>
 */
export async function setupContainer(): Promise<void> {
  // ============================================================================
  // DEPENDÊNCIAS CORE
  // ============================================================================

  /**
   * Cliente Prisma para acesso ao banco de dados
   */
  const prismaClient = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  // Conecta ao banco de dados (com tratamento de erro)
  try {
    await prismaClient.$connect();
    console.log('[DATABASE] Conectado ao banco de dados Supabase WiseBot');
  } catch (error) {
    console.warn('[DATABASE] Erro ao conectar ao banco de dados:', error);
    console.log('[DATABASE] Continuando sem conexão de banco para desenvolvimento...');
  }

  // Registra o PrismaClient como singleton
  container.registerInstance('PrismaClient', prismaClient);

  /**
   * Logger da aplicação - Configuração simples
   */
  const logger = {
    info: (message: string, ...args: any[]) => {
      const timestamp = new Date().toLocaleString('pt-BR');
      console.log(`[${timestamp}] INFO: ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      const timestamp = new Date().toLocaleString('pt-BR');
      console.warn(`[${timestamp}] WARN: ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      const timestamp = new Date().toLocaleString('pt-BR');
      console.error(`[${timestamp}] ERROR: ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      if (process.env.LOG_LEVEL === 'debug') {
        const timestamp = new Date().toLocaleString('pt-BR');
        console.debug(`[${timestamp}] DEBUG: ${message}`, ...args);
      }
    },
  };

  container.registerInstance('Logger', logger);

  // ============================================================================
  // REPOSITÓRIOS
  // ============================================================================

  // Registra o repositório de personagens
  container.register<ICharacterRepository>('CharacterRepository', {
    useClass: CharacterRepository,
  });

  // ============================================================================
  // SERVIÇOS
  // ============================================================================

  // Os serviços são registrados automaticamente via decorator @singleton()
  // Mas podemos forçar o registro aqui se necessário
  container.register('CharacterService', {
    useClass: CharacterService,
  });

  // ============================================================================
  // HANDLERS E COMANDOS
  // ============================================================================

  // Os handlers e comandos também são registrados automaticamente
  // via decorators, mas podem ser registrados explicitamente aqui

  // ============================================================================
  // CONFIGURAÇÕES ADICIONAIS
  // ============================================================================

  // Configura listeners para logs do Prisma
  prismaClient.$on('query', e => {
    logger.debug('Query executada:', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });

  prismaClient.$on('error', e => {
    logger.error('Erro no Prisma:', e);
  });

  prismaClient.$on('info', e => {
    logger.info('Info do Prisma:', e.message);
  });

  prismaClient.$on('warn', e => {
    logger.warn('Warning do Prisma:', e.message);
  });

  logger.info('[CONTAINER] Container de DI configurado com sucesso');
}

/**
 * Limpa recursos do container (útil para testes e shutdown)
 * @returns Promise<void>
 */
export async function cleanupContainer(): Promise<void> {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient');
  await prismaClient.$disconnect();

  // Limpa o container
  container.clearInstances();
}

/**
 * Obtém uma instância do container (útil para testes)
 * @returns Container
 */
export function getContainer() {
  return container;
}
