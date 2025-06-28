
O objetivo é desenvolver o "Horácio", um bot temático para Discord, utilizando Node.js e TypeScript. O bot funcionará como um assistente de RPG, com foco principal em um sistema robusto de rolagem de dados e um gerenciamento de fichas de personagem interativo e seguro. A arquitetura será modular, escalável e intuitiva, seguindo os princípios de Arquitetura Limpa (Clean Architecture) e as melhores práticas detalhadas no documento `project.md`. A personalidade do bot, "Horácio", conforme definida em `.bardopersonality.md`, deve ser rigorosamente implementada em todas as suas interações.

2. Funcionalidades Essenciais (Exemplos Iniciais)
Nota: As funcionalidades descritas a seguir são apenas exemplos para ilustrar o tipo de interatividade desejada e para guiar a construção da arquitetura inicial. O escopo, as regras e o funcionamento detalhado de cada sistema (rolagem, fichas, etc.) serão especificados em uma fase posterior, após a estrutura base do projeto estar completa e aprovada.

Exemplo de Rolagem de Dados Avançada (/rolar):

Permitir rolagens simples e complexas (ex: 1d20+5, 4d6kh3 - 4 dados de 6 lados, mantendo os 3 maiores).

As respostas devem ser formatadas em embeds temáticos, mostrando os resultados individuais e o total.

Deve usar mensagens efêmeras para evitar poluir o chat, a menos que o usuário solicite uma rolagem pública.

Exemplo de Sistema de Fichas de Personagem (/ficha):

Criação e Edição: Utilizar modals do Discord para uma experiência de criação e edição de ficha guiada e amigável.

Visualização: Exibir a ficha do personagem através de embeds bem estruturados, com campos dinâmicos (fields), cores e timestamps para indicar a última atualização.

Interatividade: Usar botões e select menus para navegar entre seções da ficha (ex: Atributos, Inventário, Habilidades) ou para realizar ações rápidas.

Privacidade: As informações da ficha devem ser, por padrão, visíveis apenas para o usuário que as solicitou, utilizando respostas efêmeras (ephemeral).

### **3. Stack Tecnológico**

  * **Linguagem:** TypeScript
  * **Ambiente/Build:** Node.js com Vite e `vite-plugin-node` para Hot Module Replacement (HMR).
  * **Biblioteca Discord:** Discord.js v14+
  * **ORM:** Prisma
  * **Banco de Dados:** PostgreSQL (via Supabase)
  * **Injeção de Dependência:** tsyringe

### **4. Arquitetura e Padrões de Design**

O projeto seguirá um modelo de **Arquitetura Limpa (Clean Architecture)** para garantir o desacoplamento e a testabilidade.

  * **Fluxo de Dados Unidirecional Obrigatório:**

    ```mermaid
    graph TD
        A[Interação Discord] --> B(Handler);
        B --> C(Comando/Componente);
        C --> D{Serviço};
        D --> E[Repositório];
        E --> F((Banco de Dados));
    ```

  * **Princípios SOLID:** A aplicação dos cinco princípios SOLID é mandatória para garantir um código flexível e de fácil manutenção.

  * **Separação Estrita de Responsabilidades (SoC):**

      * **Handlers (`/handlers`):** Ponto de entrada das interações. Valida e delega para os comandos/componentes. Responsável pelo tratamento de erros centralizado.
      * **Serviços (`/services`):** Contêm a lógica de negócio pura. **NÃO DEVEM** conhecer a API do Discord nem o `PrismaClient`. Orquestram as regras do RPG.
      * **Repositórios (`/repositories`):** A **ÚNICA** camada com permissão para interagir diretamente com o `PrismaClient`. Realiza operações de CRUD (Create, Read, Update, Delete).

### **5. Diretrizes de Implementação**

1.  **Handlers Dinâmicos e Padrão "Component V2":**

      * O uso de **Componentes de Mensagem** (`botões`, `select menus`, `modals`) é obrigatório para todas as interações que não sejam simples comandos de entrada.
      * Toda a lógica de resposta a componentes deve residir em handlers dedicados na pasta `/components`. **É PROIBIDO o uso de `collectors`** (`awaitMessageComponent`).
      * O `customId` dos componentes deve seguir um formato estratégico (`acao:parametro1:parametro2`) para roteamento e processamento eficientes.
      * **CRÍTICO:** Toda interação deve ser respondida (com `reply`, `deferReply`, `update`, etc.) em **menos de 3 segundos** para evitar que a interação expire.

2.  **Injeção de Dependência com `tsyringe`:**

      * Todas as classes de serviço e repositório devem ser gerenciadas pelo container do `tsyringe`, anotadas com `@singleton()`.
      * As dependências **DEVEM** ser injetadas exclusivamente via construtor da classe.

3.  **Segurança com Supabase RLS (Row Level Security):**

      * A segurança a nível de linha (RLS) **DEVE** ser habilitada e configurada no Supabase. O objetivo é garantir que um usuário autenticado no Discord só possa ler, criar, atualizar ou deletar os dados (ex: fichas de personagem) que pertencem a ele.

4.  **Sistema de Conteúdo Desacoplado:**

      * Todos os textos visíveis para o usuário (mensagens, labels de botões, etc.) devem ser centralizados em arquivos na pasta `/content`.
      * Uma função utilitária `getMessage(key, variables)` deve ser usada para buscar esses textos, evitando strings "hardcoded" no código.

5.  **Tratamento de Erros Robusto:**

      * Deve haver um bloco `try-catch` no handler principal de interações para capturar erros não tratados.
      * Devem ser criadas classes de erro customizadas (ex: `FichaNaoEncontradaError`, `PermissaoInsuficienteError`) na pasta `/errors` para lidar com cenários de falha específicos.

### **6. Documentação Mandatória**

A documentação é um entregável essencial.

  * **Documentação de Código (TSDoc):** TODA função, método, classe e tipo exportado **DEVE** ter um bloco de comentário TSDoc (`/** ... */`) explicando seu propósito, parâmetros (`@param`), valor de retorno (`@returns`) e erros que pode lançar (`@throws`).
  * **Documentação de Projeto (`.docs/`):** Uma pasta `.docs/` deve ser criada na raiz do projeto contendo:
      * `ARCHITECTURE.md`: Uma explicação da arquitetura geral, decisões de design e o fluxo de dados.
      * `SETUP.md`: Instruções claras para configurar o ambiente de desenvolvimento.
      * `CHANGELOG.md`: Um registro de todas as alterações significativas no projeto.

### **7. Fluxo de Trabalho e Entregas**

O desenvolvimento deve ser incremental.

1.  **Fase 1 (Fundação):** Comece criando a estrutura de pastas, arquivos de configuração (Vite, TypeScript, Prisma, ESLint/Prettier), e a base para os handlers e injeção de dependência.
2.  **Aprovação:** Apresente a estrutura base para minha aprovação antes de prosseguir.
3.  **Fase 2 (Implementação):** Após a aprovação, inicie a implementação das funcionalidades essenciais, começando pela ficha de personagem.