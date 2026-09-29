# Perdidos no CAPS

Vitrine pública de um grupo inclusivo para maiores de 18 anos. React + TypeScript + Vite, Tailwind CSS, padrão de componentes shadcn/ui e conteúdo no Sanity.

## Rodar localmente

Requer Node.js 22.12+ (ou 24 LTS) e npm.

```sh
npm install
npm run dev
```

Sem variáveis de ambiente, o site usa os textos provisórios em `src/features/group/group.defaults.ts`. Nenhuma conta é necessária para visualizar essa versão. As regras e redes sociais ficam ocultas até serem cadastradas; não há URLs fictícias.

```sh
npm test
npm run build
npm run preview
```

`npm run test:watch` inicia o Vitest em modo contínuo. O build verifica os tipos e gera `dist/`, que pode ser hospedada como site estático.

## Como funciona o Sanity

O Sanity guarda os textos em documentos. O Studio é o painel em que você edita esses documentos. O site lê somente o documento publicado, pela API pública; salvar um rascunho não altera o site até clicar em **Publish**.

1. Crie sua conta em https://www.sanity.io/manage e crie um projeto com dataset **público** chamado `production`. Escolha o plano gratuito disponível na sua conta.
2. Copie `.env.example` para `.env.local` e preencha `VITE_SANITY_PROJECT_ID` e `SANITY_STUDIO_PROJECT_ID` com o mesmo ID do projeto. Mantenha os dois datasets iguais.
3. Na gestão do projeto Sanity, adicione `http://localhost:5173` e `http://localhost:3333` em **API → CORS origins**. Para a origem do site (`http://localhost:5173`), não habilite credenciais. Para a origem do Studio (`http://localhost:3333`), habilite **Allow credentials**, pois o painel exige login. Ao publicar o site, adicione também a origem HTTPS definitiva.
4. Execute `npm run studio`. Faça login quando solicitado e abra o endereço exibido, normalmente `http://localhost:3333`.
5. Abra **Página do grupo**, preencha os textos e publique. O painel utiliza o ID fixo `groupPage`, esperado pelo front.
6. Execute ou reinicie `npm run dev` após mudar as variáveis. Recarregue o site para buscar o conteúdo publicado. O CDN do Sanity pode levar um breve período para refletir a alteração.

O Studio roda separado do front, neste mesmo projeto. Não é necessário publicar o Studio para editar localmente. `npm run studio:build` gera o painel em `dist/studio`, separado do site.

**Nunca coloque tokens de edição em variáveis `VITE_*`: elas ficam visíveis no navegador.** Esta implementação não precisa de token. O dataset é público: publique apenas informações que qualquer visitante possa ler. Não há campos de telefone, WhatsApp ou local dos encontros.

Se o Sanity estiver indisponível, o site apresenta os textos locais básicos. Um documento inexistente também usa essa base. Regras e contatos não são inventados no fallback. As requisições têm tempo limite e são canceladas ao desmontar a página.

## Estrutura e responsabilidades

```text
src/
  App.tsx                         # Composição das páginas
  pages/home/
    index.tsx                     # Conecta controller e view
    home.controller.ts            # Regras de exibição e navegação da Home
    home.view.tsx                 # Renderização, sem chamadas ou efeitos
    home.types.ts                 # Contrato entre controller e view
    components/                   # Hero, sobre, regras e contato
  features/group/
    group.types.ts                # Modelo de conteúdo do grupo
    group.defaults.ts             # Apresentação local provisória
    group.mapper.ts               # Normalização e validação do retorno externo
    group.service.ts              # Consulta do documento e mapeamento
    hooks/use-group-content.ts    # Estado, carregamento, fallback e cancelamento
  services/sanity/client.ts       # Configuração do cliente público do CMS
  components/
    layout/                       # Cabeçalho e rodapé compartilháveis
    ui/                           # Componentes básicos no padrão shadcn/ui
  lib/utils.ts                    # Utilitário de classes CSS
  test/setup.ts                   # Configuração comum dos testes
```

Fluxo: **página → controller → hook → serviço → cliente Sanity**. O serviço normaliza a resposta antes de entregá-la ao hook; a controller transforma esse conteúdo em props para a view. A view apenas compõe as seções. Hooks e serviços não conhecem navegação, botões ou detalhes da página.

A controller é um hook React (`useHomeController`) para poder consumir o hook de conteúdo. Ela decide quais seções e links aparecem. O hook `useGroupContent` pode ser consumido por outras páginas e aceita conteúdo inicial opcional para quando os dados já estiverem disponíveis; esse parâmetro inicializa a instância, não é uma prop controlada. Cada instância gerencia sua própria requisição; não há cache global.

Componentes exclusivos da Home ficam em `pages/home/components`. Promova um componente para `components` quando ele tiver uso compartilhado, com props independentes da página. Para novas páginas, siga o padrão `index.tsx`, controller, view e componentes locais. O roteamento pode ser adicionado quando a segunda página existir.

Os testes ficam próximos da responsabilidade testada: normalização e serviço em `features/group`, ciclo de vida do hook na pasta `hooks` e comportamento integrado da Home em `pages/home`. A configuração do Studio continua em `sanity.config.ts`, e os campos editáveis em `sanity/schemaTypes/groupPage.ts`. O tema está em `src/index.css`; `components.json` configura o CLI shadcn.

## Antes da publicação

Substituir os textos provisórios por conteúdo aprovado, cadastrar regras e redes oficiais, revisar a identidade visual e configurar o projeto Sanity e a hospedagem. A logo está pendente; o nome aparece como texto. A indicação de 18+ informa o público, não verifica idade. Esta entrega não cria contas nem publica o site.

## Dependências indiretas

`package.json` fixa correções via `overrides` para `adm-zip`, `js-yaml`, `smol-toml` e `uuid`, usados por ferramentas do Sanity. Isso evita versões sinalizadas pelo npm audit sem rebaixar o Sanity. Ao atualizar o Studio, reavalie esses overrides e rode testes, build do site e build do Studio.
