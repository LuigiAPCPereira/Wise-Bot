/**
 * Classe base para todos os erros customizados da aplicação
 * Fornece estrutura consistente para tratamento de erros
 */

/**
 * Tipos de erro suportados pela aplicação
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  INTERNAL = 'INTERNAL',
}

/**
 * Severidade do erro
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Interface para contexto adicional do erro
 */
export interface ErrorContext {
  userId?: string;
  guildId?: string;
  commandName?: string;
  interactionId?: string;
  [key: string]: unknown;
}

/**
 * Classe base para erros customizados da aplicação
 * Estende Error nativo com informações adicionais para melhor debugging
 */
export class AppError extends Error {
  /**
   * Tipo do erro
   */
  public readonly type: ErrorType;

  /**
   * Código único do erro (para logging e debugging)
   */
  public readonly code: string;

  /**
   * Severidade do erro
   */
  public readonly severity: ErrorSeverity;

  /**
   * Se o erro deve ser mostrado ao usuário
   */
  public readonly isUserFacing: boolean;

  /**
   * Contexto adicional do erro
   */
  public readonly context: ErrorContext;

  /**
   * Timestamp de quando o erro ocorreu
   */
  public readonly timestamp: Date;

  /**
   * Cria uma nova instância de AppError
   *
   * @param message - Mensagem do erro
   * @param type - Tipo do erro
   * @param code - Código único do erro
   * @param severity - Severidade do erro
   * @param isUserFacing - Se deve ser mostrado ao usuário
   * @param context - Contexto adicional
   */
  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    code: string = 'UNKNOWN_ERROR',
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    isUserFacing: boolean = false,
    context: ErrorContext = {}
  ) {
    super(message);

    this.name = this.constructor.name;
    this.type = type;
    this.code = code;
    this.severity = severity;
    this.isUserFacing = isUserFacing;
    this.context = context;
    this.timestamp = new Date();

    // Mantém o stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converte o erro para um objeto JSON para logging
   * @returns Objeto com informações do erro
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      severity: this.severity,
      isUserFacing: this.isUserFacing,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  /**
   * Cria uma representação string do erro para logging
   * @returns String formatada do erro
   */
  public toString(): string {
    return `${this.name} [${this.code}]: ${this.message}`;
  }

  /**
   * Verifica se o erro é de um tipo específico
   * @param type - Tipo para verificar
   * @returns true se o erro é do tipo especificado
   */
  public isType(type: ErrorType): boolean {
    return this.type === type;
  }

  /**
   * Verifica se o erro tem severidade igual ou maior que a especificada
   * @param severity - Severidade mínima
   * @returns true se a severidade é igual ou maior
   */
  public hasSeverity(severity: ErrorSeverity): boolean {
    const severityOrder = {
      [ErrorSeverity.LOW]: 1,
      [ErrorSeverity.MEDIUM]: 2,
      [ErrorSeverity.HIGH]: 3,
      [ErrorSeverity.CRITICAL]: 4,
    };

    return severityOrder[this.severity] >= severityOrder[severity];
  }

  /**
   * Adiciona contexto ao erro
   * @param additionalContext - Contexto adicional
   * @returns Nova instância do erro com contexto atualizado
   */
  public withContext(additionalContext: ErrorContext): AppError {
    return new AppError(
      this.message,
      this.type,
      this.code,
      this.severity,
      this.isUserFacing,
      { ...this.context, ...additionalContext }
    );
  }

  /**
   * Cria um erro de validação
   * @param message - Mensagem do erro
   * @param field - Campo que falhou na validação
   * @param value - Valor que falhou
   * @returns Instância de AppError
   */
  public static validation(
    message: string,
    field?: string,
    value?: unknown
  ): AppError {
    return new AppError(
      message,
      ErrorType.VALIDATION,
      'VALIDATION_ERROR',
      ErrorSeverity.LOW,
      true,
      { field, value }
    );
  }

  /**
   * Cria um erro de recurso não encontrado
   * @param resource - Tipo do recurso
   * @param identifier - Identificador do recurso
   * @returns Instância de AppError
   */
  public static notFound(resource: string, identifier?: string): AppError {
    return new AppError(
      `${resource} não encontrado${identifier ? `: ${identifier}` : ''}`,
      ErrorType.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
      ErrorSeverity.LOW,
      true,
      { resource, identifier }
    );
  }

  /**
   * Cria um erro de permissão negada
   * @param action - Ação que foi negada
   * @param resource - Recurso relacionado
   * @returns Instância de AppError
   */
  public static permissionDenied(action: string, resource?: string): AppError {
    return new AppError(
      `Permissão negada para ${action}${resource ? ` em ${resource}` : ''}`,
      ErrorType.PERMISSION_DENIED,
      'PERMISSION_DENIED',
      ErrorSeverity.MEDIUM,
      true,
      { action, resource }
    );
  }
}
