# Refatoração da Home

Objetivo: separar controller e view da página existente, mantendo interface, conteúdo, links e fallback. Pedido do responsável: pages/home com controller e view, hooks para chamadas e reutilização onde houver responsabilidade compartilhada.

## Estrutura e contratos

- `App.tsx`: composição da Home, sem conhecimento do CMS.
- `pages/home/index.tsx`: liga `useHomeController()` a `HomeView`.
- `pages/home/home.controller.ts`: prepara conteúdo, links sociais e itens de navegação.
- `pages/home/home.view.tsx`: compõe layout e seções com props, sem efeitos ou chamadas.
- `pages/home/components/`: hero, sobre, regras e contato.
- `components/layout/`: cabeçalho e rodapé; cabeçalho recebe nome, destino da marca e navegação, sem regras de negócio da Home.
- `features/group/`: tipos `GroupContent`, defaults, normalização de dados desconhecidos, serviço `loadGroupContent(signal)` e hook `useGroupContent()` para estado e ciclo de vida da requisição.
- `services/sanity/client.ts`: cria o cliente e retorna null para configuração ausente ou inválida.

## Execução

1. Verificar os nove testes existentes e o build antes de alterar código.
2. Mover tipos, defaults e normalização para arquivos próprios; extrair cliente e serviço, atualizar testes de validação/configuração.
3. Extrair hook da lógica existente, controller para regras de exibição e view para composição; separar seções e layout sem alterar HTML/classes/textos.
4. Separar testes por responsabilidade; preservar cobertura de carregamento, falha e cancelamento. Acrescentar verificação de navegação sem seções vazias e respostas após desmontagem.
5. Atualizar README com fluxo e convenções. Rodar suíte completa, build e revisão independente.

## Restrições

Nenhuma nova dependência, nova página, roteador, tela de erro, alteração visual ou cadastro adicional no CMS. Continuar omitindo contatos/regras ausentes. Somente Instagram/Facebook válidos. Não publicar WhatsApp, telefone ou endereço. Não há repositório git utilizável neste ambiente, portanto alterações são feitas na pasta solicitada, sem commit/worktree.
