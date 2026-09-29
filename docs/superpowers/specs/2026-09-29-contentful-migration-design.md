# Migração do Sanity para Contentful

## Objetivo

Substituir completamente o Sanity pelo Contentful como CMS do Perdidos no CAPS, preservando a interface atual, o conteúdo publicado, os estados de carregamento, o fallback local e a separação entre controller, view, hook, serviço e normalização.

O Contentful será usado somente para conteúdo público. O site continuará sendo uma aplicação estática Vite hospedada na Vercel, sem autenticação de visitantes, inscrições ou interação dentro do aplicativo.

## Decisões principais

- Usar o SDK oficial `contentful` e a Content Delivery API no navegador.
- Manter `GroupContent` como contrato interno independente do CMS.
- Não expor objetos do SDK para hooks, controllers ou componentes.
- Manter o conteúdo atual no Sanity até a versão Contentful ser validada.
- Remover código, dependências, scripts e documentação do Sanity somente depois que os testes da nova integração passarem.
- Não incluir tokens de gerenciamento em arquivos `VITE_*`, no repositório ou no bundle do navegador.
- Usar o Space ID `nofz0vh5p7s4` e o ambiente `master` por padrão.

## Modelo de conteúdo

### `groupPage`

Entrada única que representa a página pública do grupo.

| Campo | API ID | Tipo | Regras |
| --- | --- | --- | --- |
| Nome | `name` | Short text | obrigatório |
| Chamada | `tagline` | Short text | obrigatório |
| Descrição | `description` | Long text | obrigatório |
| Sobre | `about` | Long text | obrigatório |
| Atividades | `activities` | Short text, lista | opcional |
| Regras | `rules` | References, lista de `groupRule` | opcional e ordenada |
| Eventos | `events` | References, lista de `groupEvent` | opcional e ordenada |
| Instagram | `instagram` | Short text | opcional |
| Facebook | `facebook` | Short text | opcional |

A aplicação buscará uma única entrada publicada do tipo `groupPage`. O identificador da entrada será configurável por `VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID`. Isso evita depender da ordem das entradas e impede ambiguidade caso outra entrada seja criada por engano.

### `groupRule`

| Campo | API ID | Tipo | Regras |
| --- | --- | --- | --- |
| Título | `title` | Short text | obrigatório |
| Descrição | `description` | Long text | obrigatório |

### `groupEvent`

| Campo | API ID | Tipo | Regras |
| --- | --- | --- | --- |
| Título | `title` | Short text | obrigatório |
| Descrição | `description` | Long text | obrigatório |
| Imagem | `image` | Media, uma imagem | opcional |
| Texto alternativo | `imageAlt` | Short text | opcional |

A ordem visual de regras e eventos será a ordem das referências dentro de `groupPage`. Não haverá campo de data nesta migração porque o modelo atual não o possui e a vitrine já funciona sem ele.

## Fluxo da aplicação

```text
Home -> controller -> useGroupContent -> group.service
                                      -> Contentful client
                                      -> group.mapper
                                      -> GroupContent
```

`src/services/contentful/client.ts` validará as variáveis públicas e criará o cliente somente quando a configuração estiver completa. `group.service.ts` buscará a entrada configurada incluindo regras, eventos e assets referenciados, repassará o retorno desconhecido ao mapper e retornará apenas `GroupContent`.

O mapper aceitará dados desconhecidos, validará cada campo e converterá assets do Contentful para `GroupImage`. Imagens somente serão aceitas por HTTPS e a URL receberá parâmetros de largura e formato compatíveis com a Images API. Dimensões inválidas ou ausentes removerão apenas a imagem, sem remover o evento.

## Configuração pública

O frontend utilizará:

```env
VITE_CONTENTFUL_SPACE_ID=nofz0vh5p7s4
VITE_CONTENTFUL_ENVIRONMENT=master
VITE_CONTENTFUL_DELIVERY_TOKEN=
VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID=
```

O Delivery token é somente leitura e será colocado no `.env.local` e nas variáveis da Vercel. Mesmo sendo entregue ao navegador por ser uma variável Vite, ele não permite editar conteúdo. Tokens pessoais ou da Content Management API nunca serão usados pelo frontend.

## Criação do modelo e migração do conteúdo

Um script local criará ou atualizará os três Content Types e importará o conteúdo atual. Ele usará um Contentful Personal Access Token somente durante a migração, recebido por variável de ambiente fora dos arquivos versionados.

O conteúdo publicado no Sanity será exportado antes da remoção da dependência. A migração criará as regras, fará upload da imagem dos eventos quando disponível, publicará os assets e entradas e, por último, criará e publicará a entrada única `groupPage`. O script exibirá o Entry ID que deve ser usado em `VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID`.

O processo será idempotente por identificadores estáveis: uma nova execução atualizará as entradas criadas pela migração em vez de duplicá-las. O Sanity continuará intacto como fonte de recuperação até a validação manual do Contentful e da aplicação publicada.

## Carregamento, erro e fallback

- O skeleton atual continuará visível durante a primeira busca.
- O serviço continuará aceitando `AbortSignal`. Como o SDK JavaScript do Contentful não oferece cancelamento por chamada em `getEntry`, o serviço encerrará logicamente a espera com `AbortError`, e o hook impedirá qualquer atualização tardia quando o componente desmontar.
- Configuração ausente ou inválida retornará o conteúdo local padrão sem tentar acessar a rede.
- Falhas de rede, limite da API ou conteúdo não publicado não quebrarão a página; o hook manterá o fallback local e encerrará o estado de carregamento.
- Mensagens técnicas permanecerão restritas ao console de desenvolvimento.
- Regras, eventos e links sociais inválidos serão descartados individualmente.

## Arquivos e dependências

Serão criados:

- `src/services/contentful/client.ts`
- testes específicos do cliente, serviço e mapeamento Contentful quando agregarem comportamento observável
- script local de configuração e migração do Contentful

Serão adaptados:

- `src/features/group/group.service.ts`
- `src/features/group/group.mapper.ts`
- testes da feature de grupo
- `.env.example`
- `README.md`
- `package.json` e `package-lock.json`

Serão removidos depois da validação automatizada:

- `src/services/sanity/`
- `sanity.config.ts`
- `sanity.cli.ts`
- `sanity/schemaTypes/`
- migrações exclusivas do Sanity
- scripts `studio` e `studio:build`
- pacotes `sanity`, `@sanity/client` e dependências/overrides que existam apenas por causa do Studio

## Testes e critérios de aceite

- O mapper converte a estrutura do Contentful para o mesmo `GroupContent` usado hoje.
- Regras incompletas são descartadas e eventos válidos sobrevivem sem imagem.
- Assets válidos geram URL HTTPS otimizada, largura, altura e texto alternativo.
- URLs sociais continuam restritas aos domínios oficiais.
- Configuração ausente ou inválida usa o fallback sem chamada remota.
- O serviço busca exatamente o Entry ID configurado e respeita cancelamento.
- O hook encerra o skeleton em sucesso e falha sem atualizar estado após abortar.
- A Home mantém o comportamento visual existente.
- `npm test` e `npm run build` passam sem referências ao Sanity.
- O site publicado lê o conteúdo publicado no Contentful.
- Um editor convidado consegue alterar e publicar uma regra ou evento pelo painel do Contentful sem acesso ao repositório.

## Fora do escopo

- Alterações visuais ou de navegação.
- Preview de rascunhos dentro do site.
- Atualização em tempo real enquanto a página está aberta.
- Inscrições, confirmação de presença, localização ou contato de administradores.
- Painel administrativo próprio.
