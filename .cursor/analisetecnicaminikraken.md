# Análise Técnica e Blueprint do Mini Kraken Bot



Este documento apresenta uma análise técnica aprofundada e um blueprint de implementação para os principais comandos do bot de Discord "Mini Kraken". O objetivo é detalhar como esses comandos são construídos, focando na estrutura da interface (Embeds, Componentes) e na lógica de programação subjacente, com base em engenharia reversa das funcionalidades observadas e no conhecimento da API do Discord.



## Papel (Persona)



Esta análise é realizada sob a perspectiva de um Engenheiro de Software Sênior especializado em bots de Discord, com o intuito de criar um guia de desenvolvimento para um projeto similar ao Mini Kraken.



## Metodologia



- **Análise Visual**: Utilização das imagens fornecidas para dissecar a estrutura visual dos Embeds e o layout dos Componentes.

- **Pesquisa Externa Dirigida**: Busca por informações na documentação oficial do Mini Kraken (se disponível), guias da comunidade e discussões em fóruns.

- **Inferência Técnica (API do Discord)**: Dedução da implementação técnica mais provável com base no conhecimento da API do Discord (limites de Embeds, tipos de Componentes, Modals, respostas efêmeras, múltiplos Embeds por mensagem).









## Comando: `/ficha`



### Funcionalidade para o Usuário



Permite que o jogador visualize uma ficha de personagem, seja a sua própria ou a de outro jogador. As imagens fornecidas mostram a ficha de personagem com seções de Status e Atributos, e a capacidade de navegar entre diferentes seções (Atributos, Perícias).



### Análise da Interface (Front-End)



- **Uso de Embeds**: O comando `/ficha` utiliza uma única embed principal para exibir as informações da ficha. Esta embed é rica em conteúdo e bem estruturada:

    - **Título**: `Ficha de teste` (dinâmico, provavelmente o nome do personagem).

    - **Campos**: Utiliza múltiplos campos para organizar as informações em seções claras como `Status` e `Atributos`. Os campos são formatados com negrito para os títulos (`Força:`, `Destreza:`, etc.) e valores dinâmicos.

    - **Thumbnail/Imagem**: Há um espaço reservado para uma imagem no canto superior direito da embed, indicando que pode ser uma imagem de perfil do personagem ou um ícone.

    - **Cores e Ícones**: A embed principal parece ter uma cor de barra lateral padrão do Discord (cinza escuro), e utiliza emojis ou ícones Unicode para representar visualmente os itens de status (e.g., escudo para `Classe de armadura`, coração para `Vida`).

    - **Footer**: O footer da embed contém `(editado)` e `Só você pode ver esta - Ignorar mensagem`, indicando que a mensagem pode ser editada e é efêmera ou tem visibilidade restrita.



- **Uso de Componentes**: O comando `/ficha` faz uso extensivo de componentes de mensagem para navegação e interatividade:

    - **Select Menus (String Select)**: Há um menu de seleção no topo da embed (`Nexus do Herói`) que provavelmente permite ao usuário escolher entre diferentes personagens ou perfis. Abaixo das seções de conteúdo, há outros menus de seleção (`Atributos`, `de Força a Carisma`, `Perícias`, `de Acrobacia a Sobrevivência`) que permitem navegar entre as diferentes seções da ficha (e.g., Atributos, Perícias).

    - **Botões**: Não são visíveis botões diretos nas imagens fornecidas para o comando `/ficha`, mas os menus de seleção indicam que a interação é baseada em componentes.



- **Mensagens Efêmeras**: A presença de `Só você pode ver esta - Ignorar mensagem` no footer sugere que a resposta inicial do comando `/ficha` é uma mensagem efêmera, visível apenas para o usuário que a invocou. Isso é ideal para informações de personagem que podem ser consideradas privadas ou para evitar poluir o canal.



### Hipótese da Lógica (Back-End)



- **Interação com Banco de Dados**: 

    - **Busca de Personagens**: Quando o comando `/ficha` é invocado, o bot provavelmente realiza uma busca no banco de dados (Supabase/Prisma) para encontrar todos os personagens associados ao `discordId` do usuário. 

    - **Busca de Dados da Ficha**: Após a seleção de um personagem (se houver múltiplos), o bot busca os dados completos da ficha do personagem (status, atributos, perícias, etc.) no banco de dados.

    - **Atualização de Dados**: Se houver funcionalidades de edição (não mostradas diretamente nas imagens, mas implícitas em um bot de RPG), o bot realizaria operações de `update` no banco de dados.



- **Cálculos e Lógica de Negócio**: 

    - **Cálculo de Atributos/Status**: O bot pode realizar cálculos simples, como bônus de proficiência, modificadores de atributos (e.g., Força 0 -> Modificador +0), e vida atual/máxima, com base nos dados brutos armazenados no banco de dados.

    - **Formatação de Dados**: A lógica de backend é responsável por formatar os dados brutos do banco de dados em strings legíveis e organizadas para exibição nos campos da embed.



- **Manipulação de Estado**: Para fluxos de múltiplos passos (como a navegação entre seções da ficha), o bot pode armazenar o estado da interação (e.g., qual personagem está sendo visualizado, qual seção está ativa) para responder corretamente às interações subsequentes dos componentes.



### Fluxo de Interação (Passo a Passo) para `/ficha ver`



1.  **Usuário executa o comando**: O usuário digita `/ficha` (ou `/ficha ver`) no Discord.

2.  **Bot busca personagens**: O bot busca no banco de dados todos os personagens associados ao `discordId` do usuário.

3.  **Verificação de múltiplos personagens**: 

    - **SE o resultado for > 1**: O bot responde com uma mensagem efêmera contendo um `StringSelectMenu` para o usuário escolher qual personagem deseja visualizar. Este menu de seleção seria o `Nexus do Herói` ou similar.

    - **SENÃO (apenas um personagem ou nenhum)**: 

        - **Se um personagem**: O bot prossegue diretamente para o passo 6 com os dados desse personagem.

        - **Se nenhum personagem**: O bot responde com uma mensagem efêmera informando que o usuário não possui fichas e talvez sugira um comando para criar uma nova ficha.

4.  **Usuário seleciona personagem**: Se um `StringSelectMenu` foi apresentado, o usuário seleciona uma opção no menu. O bot recebe a nova interação (`interactionCreate` event).

5.  **Bot busca dados completos**: O bot busca os dados completos do personagem escolhido no banco de dados.

6.  **Bot constrói Embed**: O bot constrói uma `Embed` complexa com todos os dados formatados (Status, Atributos, etc.) e os menus de seleção para navegação entre as seções (Atributos, Perícias).

7.  **Bot responde à interação**: O bot responde à interação (usando `interaction.reply()` ou `interaction.update()` com a flag `ephemeral`) enviando a `Embed` finalizada. As interações subsequentes de navegação (e.g., selecionar `Perícias` no menu) acionariam `interaction.update()` para editar a mensagem existente com o novo conteúdo da seção.







## Comando: `/d` (Rolagem de Dados)



### Funcionalidade para o Usuário



Permite que o usuário realize rolagens de dados com diferentes expressões (e.g., `1d20`, `2d6+5`). O bot exibe o resultado da rolagem, e pode haver opções para rolagens ocultas (`/dh`) ou rolagens inteligentes (`/di`) que interagem com a ficha do personagem.



### Análise da Interface (Front-End)



- **Uso de Embeds**: Embora as imagens fornecidas não mostrem diretamente o comando `/d` ou `/di`, a maioria dos bots de RPG utiliza embeds para exibir os resultados das rolagens de dados de forma clara e organizada. Uma embed típica para rolagem de dados incluiria:

    - **Título**: Indicando o tipo de rolagem (e.g., "Rolagem de Dados", "Teste de Força").

    - **Descrição**: A expressão da rolagem (e.g., `1d20 + 5`) e o resultado individual de cada dado.

    - **Campos**: Campos para o resultado total, modificadores aplicados, e talvez o nome do personagem que realizou a rolagem.

    - **Cores**: Cores podem ser usadas para indicar sucesso/falha crítica ou resultados especiais.

    - **Thumbnail/Imagem**: Pode haver um ícone de dado ou do bot.



- **Uso de Componentes**: Para rolagens de dados, componentes podem ser usados para:

    - **Botões**: Para refazer a rolagem, aplicar bônus/penalidades, ou para rolagens contextuais (e.g., "Atacar", "Testar Perícia").

    - **Menus de Seleção**: Para escolher o tipo de dado ou a perícia a ser testada (como visto no `/di` na imagem da ficha).



- **Mensagens Efêmeras**: O comando `/dh` (hidden dice roll) explicitamente indica uma mensagem efêmera, visível apenas para o usuário que rolou os dados. Para rolagens públicas (`/d`), a mensagem seria visível para todos no canal. O `/di` (smart dice) provavelmente seria efêmero ou público dependendo do contexto (e.g., teste de perícia pessoal vs. rolagem de ataque em combate).



### Hipótese da Lógica (Back-End)



- **Processamento da Expressão de Dados**: O bot precisa de um parser para interpretar expressões de dados como `1d20`, `2d6+5`, `1d10-2`, etc. Isso envolve identificar o número de dados, o tipo de dado e quaisquer modificadores.



- **Geração de Números Aleatórios**: Utiliza uma função de geração de números aleatórios para simular a rolagem de cada dado.



- **Cálculo do Resultado**: Soma os resultados dos dados e aplica os modificadores para obter o resultado final.



- **Interação com Banco de Dados (para `/di`)**: Para o comando `/di` (Smart Dices System), o bot provavelmente busca os atributos ou perícias do personagem do usuário no banco de dados (Supabase/Prisma) para aplicar bônus de proficiência ou outros modificadores relevantes automaticamente.



- **Formatação da Saída**: A lógica de backend formata o resultado da rolagem e os detalhes (dados individuais, total, modificadores) em uma estrutura de embed para ser enviada ao Discord.



### Fluxo de Interação (Passo a Passo) para `/d` (Exemplo: `1d20+5`)



1.  **Usuário executa o comando**: O usuário digita `/d 1d20+5` no Discord.

2.  **Bot recebe a expressão**: O bot recebe a expressão `1d20+5`.

3.  **Parsing da expressão**: O bot analisa a string `1d20+5` para identificar: 1 dado, tipo d20, modificador +5.

4.  **Rolagem dos dados**: O bot gera um número aleatório entre 1 e 20 (para o d20).

5.  **Cálculo do resultado**: O bot soma o resultado do dado com o modificador (e.g., se rolou 15, o resultado é 15 + 5 = 20).

6.  **Construção da Embed**: O bot constrói uma embed com:

    - Título: "Rolagem de Dados"

    - Descrição: "Expressão: `1d20+5`"

    - Campo: "Resultado: 20 (15 + 5)"

7.  **Bot responde à interação**: O bot envia a embed para o canal (resposta pública).



### Fluxo de Interação (Passo a Passo) para `/di` (Exemplo: Teste de Força)



1.  **Usuário executa o comando**: O usuário digita `/di força` ou seleciona "Força" em um menu de seleção de perícias/atributos.

2.  **Bot busca dados do personagem**: O bot busca no banco de dados o personagem ativo do usuário e seu valor de Força e bônus de proficiência.

3.  **Cálculo do modificador**: O bot calcula o modificador de Força e o bônus de proficiência total.

4.  **Rolagem do dado**: O bot rola 1d20.

5.  **Cálculo do resultado final**: O bot soma o resultado do d20 com o modificador de Força e o bônus de proficiência.

6.  **Construção da Embed**: O bot constrói uma embed com:

    - Título: "Teste de Força"

    - Descrição: "Rolagem: 1d20 + Modificador de Força + Bônus de Proficiência"

    - Campo: "Resultado: [Resultado Final] ([Resultado d20] + [Modificador] + [Bônus])"

7.  **Bot responde à interação**: O bot envia a embed (provavelmente efêmera, para testes pessoais) para o usuário.