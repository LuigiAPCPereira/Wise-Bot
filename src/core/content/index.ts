/**
 * Sistema de conteúdo centralizado
 * Fornece acesso às mensagens com suporte a interpolação de variáveis
 */

import { messages, type MessageKey } from './messages.js';

/**
 * Tipo para as variáveis que podem ser interpoladas nas mensagens
 */
export type MessageVariables = Record<string, string | number>;

/**
 * Obtém uma mensagem do sistema de conteúdo
 * Suporta interpolação de variáveis usando a sintaxe {{variavel}}
 *
 * @param key - Chave da mensagem
 * @param variables - Variáveis para interpolação (opcional)
 * @returns A mensagem formatada
 *
 * @example
 * ```typescript
 * // Mensagem simples
 * const welcome = getMessage('bot.welcome');
 *
 * // Mensagem com variáveis
 * const greeting = getMessage('character.created', { name: 'Aragorn' });
 * ```
 */
export function getMessage(
  key: MessageKey,
  variables?: MessageVariables
): string {
  const message = messages[key];

  if (!message) {
    // Fallback para chaves não encontradas
    return `[MENSAGEM NÃO ENCONTRADA: ${key}]`;
  }

  // Se não há variáveis, retorna a mensagem diretamente
  if (!variables || Object.keys(variables).length === 0) {
    return message;
  }

  // Interpola as variáveis na mensagem
  return interpolateVariables(message, variables);
}

/**
 * Interpola variáveis em uma string usando a sintaxe {{variavel}}
 *
 * @param template - String template com placeholders
 * @param variables - Objeto com as variáveis
 * @returns String com variáveis interpoladas
 *
 * @example
 * ```typescript
 * const result = interpolateVariables(
 *   'Olá {{name}}, você tem {{age}} anos!',
 *   { name: 'João', age: 25 }
 * );
 * // Resultado: "Olá João, você tem 25 anos!"
 * ```
 */
function interpolateVariables(
  template: string,
  variables: MessageVariables
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];

    if (value === undefined || value === null) {
      // Mantém o placeholder se a variável não foi fornecida
      return match;
    }

    return String(value);
  });
}

/**
 * Obtém múltiplas mensagens de uma vez
 * Útil para carregar mensagens relacionadas
 *
 * @param keys - Array de chaves de mensagens
 * @param variables - Variáveis para interpolação (aplicadas a todas as mensagens)
 * @returns Objeto com as mensagens formatadas
 *
 * @example
 * ```typescript
 * const confirmMessages = getMessages([
 *   'confirm.delete_character',
 *   'confirm.yes',
 *   'confirm.no'
 * ], { name: 'Aragorn' });
 * ```
 */
export function getMessages(
  keys: MessageKey[],
  variables?: MessageVariables
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const key of keys) {
    result[key] = getMessage(key, variables);
  }

  return result;
}

/**
 * Verifica se uma chave de mensagem existe
 *
 * @param key - Chave da mensagem
 * @returns true se a chave existe, false caso contrário
 */
export function hasMessage(key: string): key is MessageKey {
  return key in messages;
}

/**
 * Obtém todas as chaves de mensagens disponíveis
 * Útil para debugging e desenvolvimento
 *
 * @returns Array com todas as chaves de mensagens
 */
export function getAllMessageKeys(): MessageKey[] {
  return Object.keys(messages) as MessageKey[];
}

/**
 * Obtém uma mensagem de erro formatada
 * Conveniência para mensagens de erro comuns
 *
 * @param error - Tipo do erro ou mensagem customizada
 * @param variables - Variáveis para interpolação
 * @returns Mensagem de erro formatada
 */
export function getErrorMessage(
  error:
    | 'generic'
    | 'permission_denied'
    | 'user_not_found'
    | 'database'
    | 'timeout'
    | string,
  variables?: MessageVariables
): string {
  // Se é um tipo de erro conhecido, usa a chave correspondente
  const errorKey = `error.${error}` as MessageKey;

  if (hasMessage(errorKey)) {
    return getMessage(errorKey, variables);
  }

  // Se não é um tipo conhecido, trata como mensagem customizada
  if (variables) {
    return interpolateVariables(error, variables);
  }

  return error;
}

// Re-exporta os tipos para conveniência
export type { MessageKey, MessageVariables };
