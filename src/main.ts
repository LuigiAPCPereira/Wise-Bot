/**
 * Ponto de entrada principal do bot Horácio
 * Configura o cliente Discord, container de DI e handlers
 */

import { setupContainer } from '@/core/container/index.js';
import { InteractionHandler } from '@/core/handlers/InteractionHandler.js';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';

import 'reflect-metadata';
import { container } from 'tsyringe';

// Carrega variáveis de ambiente
config();

/**
 * Logger principal da aplicação - Configuração simples para evitar problemas de codificação
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

/**
 * Cliente Discord configurado com intents necessários
 */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

/**
 * Inicializa o bot Horácio
 * @returns Promise<void>
 */
async function initializeBot(): Promise<void> {
  try {
    logger.info('[HORACIO] Inicializando Horácio - O Bardo dos Dados...');

    // Configura o container de injeção de dependência
    await setupContainer();
    logger.info('[HORACIO] Container de DI configurado com sucesso');

    // Obtém o handler de interações do container
    const interactionHandler = container.resolve(InteractionHandler);

    // Configura event listeners
    client.once('ready', () => {
      logger.info(
        `[HORACIO] ${client.user?.tag} está online e pronto para aventuras!`
      );
    });

    // Handler principal de interações
    client.on('interactionCreate', async interaction => {
      try {
        await interactionHandler.handle(interaction);
      } catch (error) {
        logger.error('Erro ao processar interação:', error);
      }
    });

    // Sistema anti-crash
    process.on('uncaughtException', error => {
      logger.error('Exceção não capturada:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Promise rejeitada não tratada:', { reason, promise });
    });

    // Faz login no Discord
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('DISCORD_TOKEN não encontrado nas variáveis de ambiente');
    }

    await client.login(token);
    logger.info('[HORACIO] Login realizado com sucesso');
  } catch (error) {
    logger.error('Erro fatal durante a inicialização:', error);
    process.exit(1);
  }
}

/**
 * Função de shutdown graceful
 */
async function shutdown(): Promise<void> {
  logger.info('[HORACIO] Iniciando shutdown graceful...');

  try {
    client.destroy();
    logger.info('[HORACIO] Cliente Discord desconectado');

    // Aqui você pode adicionar cleanup de outros recursos
    // como conexões de banco de dados, etc.

    process.exit(0);
  } catch (error) {
    logger.error('Erro durante shutdown:', error);
    process.exit(1);
  }
}

// Handlers de shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Inicializa o bot se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  initializeBot();
}

// Exporta dependências úteis para testes
export { client, logger };
