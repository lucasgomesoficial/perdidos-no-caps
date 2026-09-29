# MVP — Perdidos no CAPS

Vitrine pública, inclusiva e voltada a maiores de 18 anos. Uma página responsiva com apresentação, sobre o grupo, atividades, regras e links para Instagram e Facebook. Interação acontece fora do site. Não publicar telefone de administrador, link de WhatsApp, endereço de encontros, inscrições ou confirmação de presença.

## Base aprovada na conversa

Vite, React, TypeScript, Tailwind CSS, componentes shadcn/ui e Sanity. Identidade visual e logo serão definidas depois. Textos oficiais e perfis sociais serão enviados pelo responsável; a base contém apenas apresentação provisória derivada do escopo informado. Regras e contatos ficam ocultos enquanto não forem preenchidos.

## Implementação

1. Configurar aplicação, estilos e Vitest.
2. Criar página sem dependência de credenciais para desenvolvimento local.
3. Consumir um documento público do Sanity com validação dos dados e fallback local.
4. Disponibilizar schema e configuração do Studio para edição do conteúdo.
5. Verificar links, fallback, regras, tipos e build; documentar configuração.

A configuração do projeto externo Sanity depende da conta do responsável. Nenhuma conta ou publicação externa é criada automaticamente. A API só lê campos públicos do documento `groupPage`, ID `groupPage`; nenhum token secreto deve ir ao front.

## Verificação

Vitest cobre conteúdo básico, regras/redes fornecidas, dados incompletos e rejeição de links inválidos. Build verifica TypeScript e gera a distribuição. Revisão visual e conteúdo final ainda dependem da identidade e dos textos fornecidos pelo responsável.
