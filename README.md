# Perdidos no CAPS

Vitrine pública de um grupo inclusivo para maiores de 18 anos. O projeto usa React, TypeScript, Vite, Tailwind CSS, componentes no padrão shadcn/ui e conteúdo publicado no Contentful.

## Rodar localmente

Requer Node.js 24 LTS e npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Preencha no `.env.local` o token somente leitura da Content Delivery API. Sem configuração completa, o site utiliza os textos básicos de `src/features/group/group.defaults.ts`; regras, eventos e redes sociais não são inventados pelo fallback.

```env
VITE_CONTENTFUL_DELIVERY_TOKEN=
```

Comandos de verificação:

```sh
npm test
npm run build
npm run preview
```

`npm run test:watch` inicia o Vitest em modo contínuo. O build verifica os tipos e gera `dist/`, que pode ser hospedado como site estático.

## Editar o conteúdo

O painel editorial fica no Contentful. No Space do projeto, abra **Content** e edite a entrada **Perdidos no CAPS** do tipo **Página do grupo**.

O conteúdo usa três modelos:

- **Página do grupo (`groupPage`)**: textos gerais, atividades, redes sociais e listas ordenadas de regras e eventos;
- **Regra do grupo (`groupRule`)**: título e descrição;
- **Evento do grupo (`groupEvent`)**: título, descrição, imagem opcional e texto alternativo.

Salvar cria ou atualiza um rascunho. O site público só recebe alterações depois de clicar em **Publish**. Regras e eventos aparecem na ordem das referências dentro da Página do grupo.

Para permitir que outra pessoa edite, convide-a nas configurações de usuários do Space. Ela acessa o painel do Contentful com a própria conta e não precisa de acesso ao repositório ou à Vercel.

## API e segurança

O frontend usa apenas a Content Delivery API, que é somente leitura. O token em `VITE_CONTENTFUL_DELIVERY_TOKEN` fica disponível no bundle do navegador por funcionamento do Vite, mas não permite criar, editar ou apagar conteúdo.

Nunca coloque um Personal Access Token ou token da Content Management API em variável `VITE_*`, no repositório ou na Vercel. A aplicação publicada precisa somente do token de entrega mostrado acima. O Space ID `nofz0vh5p7s4`, o ambiente `master` e a entrada `perdidos-no-caps` são padrões públicos do projeto e podem ser sobrescritos pelas variáveis correspondentes quando necessário.

No painel do Contentful, o token de entrega fica em **Settings → API keys**. A chave criada para este projeto se chama **Perdidos no CAPS - Vite** e está limitada ao ambiente `master`.

## Recriar os modelos e importar o conteúdo inicial

O repositório possui uma migração idempotente. Ela cria ou atualiza os três modelos, publica as 11 regras, o evento e sua imagem, e mantém os mesmos IDs quando executada novamente.

Crie temporariamente um Personal Access Token no Contentful e coloque-o no `.env.local`:

```env
CONTENTFUL_MANAGEMENT_TOKEN=
```

Execute:

```sh
npm run contentful:migrate
```

Remova `CONTENTFUL_MANAGEMENT_TOKEN` do `.env.local` assim que o comando terminar. O script usa `scripts/contentful/source-content.json` como cópia pública do conteúdo original e imprime o Entry ID que deve ficar em `VITE_CONTENTFUL_GROUP_PAGE_ENTRY_ID`.

## Configurar a Vercel

Cadastre estas variáveis no projeto da Vercel e faça um novo deploy:

```text
VITE_CONTENTFUL_DELIVERY_TOKEN
```

Marque a variável para **Production**. Não cadastre `CONTENTFUL_MANAGEMENT_TOKEN`. O build falha com uma mensagem explícita se o token de entrega estiver ausente ou inválido; o diretório de saída continua sendo `dist`.

## Carregamento e fallback

O site exibe um skeleton enquanto busca o conteúdo pela primeira vez. A camada de serviço lê exatamente a entrada configurada, resolve regras, eventos e imagens e converte a resposta para o modelo interno `GroupContent`.

Se a configuração estiver ausente, a API falhar ou a entrada ainda não estiver publicada, a página permanece disponível com o conteúdo local básico. O hook encerra o carregamento, ignora respostas antigas quando a página desmonta e mostra detalhes técnicos apenas no console de desenvolvimento.

## Estrutura e responsabilidades

```text
src/
  App.tsx                              # Composição das páginas
  pages/home/
    index.tsx                          # Conecta controller e view
    home.controller.ts                 # Regras de exibição e navegação
    home.view.tsx                      # Renderização sem chamadas ou efeitos
    home.types.ts                      # Contrato entre controller e view
    components/                        # Seções exclusivas da Home
  features/group/
    group.types.ts                     # Modelo interno independente do CMS
    group.defaults.ts                  # Apresentação local básica
    group.mapper.ts                    # Validação e normalização do Contentful
    group.service.ts                   # Busca da entrada publicada
    hooks/use-group-content.ts         # Estado, loading, fallback e cancelamento
  services/contentful/client.ts        # Cliente público da Delivery API
  components/
    layout/                            # Cabeçalho e rodapé compartilháveis
    ui/                                # Componentes básicos
  test/setup.ts                        # Configuração comum dos testes
scripts/contentful/
  migrate.mjs                          # Executor da migração administrativa
  migration-core.mjs                   # Modelos e payloads determinísticos
  source-content.json                  # Cópia pública usada na importação
```

Fluxo: **página → controller → hook → serviço → cliente Contentful → mapper**. A view apenas renderiza e nenhuma seção depende de objetos do SDK.
