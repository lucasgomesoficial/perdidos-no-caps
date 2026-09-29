# Identidade visual e temas do Perdidos no CAPS

## Objetivo

Transformar a vitrine atual em uma experiência visual própria, inspirada na nova logo do Perdidos no CAPS. A interface deve transmitir acolhimento, encontro e personalidade sem prejudicar a leitura ou parecer excessivamente decorada. O conteúdo continuará vindo do Sanity e a estrutura de controller e view da Home será preservada.

## Direção visual

A identidade combina o amarelo vivo da logo com azul lunar, preto azulado e branco frio. O amarelo funciona como ação e acento, sem ocupar grandes áreas de texto. O azul cria profundidade e remete ao céu da ilustração. Superfícies de conteúdo permanecem calmas e com contraste alto.

Formas circulares fazem referência à lua e ao contorno da logo. Marcas inspiradas em pinceladas aparecem apenas no hero, em pequenos divisores e em detalhes de títulos. Brilhos, estrelas e texturas devem ser discretos, sem ruído atrás de textos longos. A tipografia usa uma família expressiva apenas nos títulos e uma família neutra e legível no corpo.

## Logo e arquivos de imagem

A imagem fornecida será editada para remover a marca “Dola AI” no canto inferior direito, reconstruindo o fundo preto nessa região sem alterar a arte principal. A versão tratada será exportada para uso na interface em formato WebP, mantendo uma versão de boa resolução. O componente de logo terá texto alternativo apropriado e dimensões explícitas para evitar deslocamento do layout.

A logo será usada no cabeçalho e como elemento principal da composição visual do hero. Em telas pequenas, seu tamanho será reduzido sem esconder o nome ou a chamada do grupo.

## Sistema de cores

Os estilos serão definidos por tokens semânticos no CSS para que os componentes não dependam diretamente de cores específicas. Os tokens incluem fundo da página, texto, superfície, superfície elevada, cor principal, texto sobre a cor principal, texto secundário, borda, foco e acentos azulados.

O modo claro terá fundo branco frio ou cinza lunar, texto azul muito escuro, superfícies brancas, bordas azul acinzentadas e amarelo mais fechado nos elementos que precisam de contraste. O modo escuro terá fundo preto azulado, superfícies azul-escuras, texto branco frio, bordas claras discretas e amarelo luminoso nos destaques.

Estados de foco devem ter contraste claro nos dois temas. Seleção de texto, hover, skeletons e elementos desabilitados também usarão os tokens semânticos.

## Tipografia

Os títulos usarão uma pilha de fontes locais pesadas, com `Arial Black`, `Arial Narrow Bold` e `sans-serif` como fallbacks. O corpo usará a pilha de fontes do sistema já adotada pelo projeto. Isso evita uma requisição externa e mantém o carregamento imediato. O corpo manterá altura de linha confortável; títulos terão espaçamento mais compacto. Caixa alta com espaçamento entre letras ficará restrita a rótulos curtos de seção.

## Estrutura da página

### Cabeçalho

O cabeçalho será compacto, com uma versão pequena da logo, navegação e seletor de tema. No celular, marca e seletor ocuparão a primeira linha e a navegação ficará em uma segunda linha horizontal rolável, sem sobreposição. O cabeçalho usará uma superfície translúcida com desfoque e uma borda inferior para manter o contraste sobre o conteúdo.

### Hero

O hero será o ponto mais expressivo da página. Ele combinará a chamada do grupo, a descrição, o botão para conhecer o grupo e a logo em destaque. Círculos, gradientes e estrelas discretas criarão o clima noturno. A decoração será marcada como não semântica e não bloqueará interação ou leitura.

### Sobre

A seção usará uma superfície calma e uma composição em duas colunas no desktop. As atividades continuarão como etiquetas, agora alinhadas à nova paleta. No celular, o conteúdo seguirá uma única coluna.

### Eventos

Os eventos permanecerão em uma coluna no celular e duas no desktop. Os cards terão superfície elevada, borda discreta e destaque amarelo ou azul nos detalhes. Imagens manterão sua proporção natural, sem corte, com skeleton durante o carregamento e texto preservado caso a imagem falhe.

### Regras

As regras serão apresentadas em cards numerados com hierarquia clara entre título e descrição. A disposição usará uma coluna no celular e duas colunas a partir do desktop, mantendo a ordem do conteúdo e a leitura linear por tecnologias assistivas.

### Contato e rodapé

O contato terá uma composição de alto destaque controlado, com os links sociais como ações claras. O rodapé será mais escuro e discreto, mantendo as informações do grupo e o crédito existente.

## Tema claro, escuro e sistema

O tema aceitará três preferências: `system`, `light` e `dark`. Quando não existir preferência salva, o valor será `system`. A escolha será armazenada no `localStorage`.

Um provider de tema será responsável por:

- Ler e validar a preferência armazenada.
- Resolver o tema efetivo a partir de `prefers-color-scheme` quando a opção for `system`.
- Aplicar o tema ao elemento raiz do documento.
- Escutar mudanças do sistema apenas enquanto a preferência for `system`.
- Expor a preferência atual e uma função de alteração aos componentes.

Um script curto executado antes da montagem do React aplicará o tema inicial para evitar a exibição momentânea do tema incorreto. Falhas de acesso ao armazenamento não impedirão a renderização; nesse caso, a aplicação usará a preferência do sistema durante a sessão.

O controle de tema será acessível por teclado e terá rótulo compreensível. Em vez de depender apenas de ícones, ele indicará claramente as opções Sistema, Claro e Escuro. A seleção atual será exposta semanticamente.

## Arquitetura e responsabilidades

O provider, hook e funções puras do tema ficarão em uma feature própria. O cabeçalho apenas consumirá a API do tema e renderizará o controle. Tokens e estilos globais ficarão no CSS; componentes usarão classes semânticas.

A Home continuará recebendo o conteúdo pronto do controller. O redesenho alterará componentes de apresentação sem adicionar regras de CMS à view. A imagem da logo será um asset local, independente do Sanity.

## Acessibilidade e movimento

Todos os textos devem atingir contraste WCAG AA. Controles terão foco visível, áreas de toque adequadas e nomes acessíveis. A ordem visual não poderá alterar a ordem de leitura. Elementos decorativos serão ignorados por leitores de tela.

Transições de cor e pequenos movimentos serão breves. `prefers-reduced-motion` continuará removendo animações e transições não essenciais.

## Testes e validação

Serão criados testes para:

- Usar `system` quando não houver preferência salva.
- Restaurar uma preferência válida do `localStorage`.
- Alternar entre Sistema, Claro e Escuro.
- Atualizar o tema efetivo quando o sistema mudar e a preferência for `system`.
- Ignorar valores armazenados inválidos e lidar com indisponibilidade do armazenamento.
- Garantir o nome acessível e o estado do seletor.
- Preservar os comportamentos atuais da Home, eventos e carregamento.

A verificação final incluirá toda a suíte do Vitest, checagem de TypeScript, build de produção e inspeção da página nas larguras de celular, tablet e desktop nos dois temas.

## Fora do escopo

O trabalho não altera schemas, consultas ou conteúdo cadastrado no Sanity. Não adiciona autenticação, formulário de contato, entrada direta no grupo ou novas páginas. O tema será aplicado ao site público; o Sanity Studio conservará sua aparência própria.
