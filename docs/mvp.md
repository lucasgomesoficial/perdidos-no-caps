# MVP — Perdidos no CAPS

## Objetivo

Criar uma vitrine pública, inclusiva e voltada a maiores de 18 anos para apresentar o grupo, suas regras, atividades, eventos e redes sociais. A interação e o ingresso no grupo acontecem fora do aplicativo.

## Tecnologia

Vite, React, TypeScript, Tailwind CSS, componentes no padrão shadcn/ui e Contentful como CMS. O site é estático e pode ser hospedado na Vercel.

## Escopo

1. Apresentar nome, chamada, descrição e informações do grupo.
2. Exibir atividades, regras e eventos publicados.
3. Exibir imagem opcional nos eventos.
4. Direcionar para Instagram e Facebook quando cadastrados.
5. Oferecer temas claro, escuro e preferência do sistema.
6. Usar skeleton durante o carregamento e conteúdo local básico se a API falhar.
7. Permitir que editores convidados atualizem e publiquem conteúdo pelo painel do Contentful.

## Fora do escopo

- Link direto para o grupo;
- endereço ou localização dos encontros;
- contato pessoal de administradores;
- confirmação de presença;
- contas de visitantes;
- mensagens ou interação dentro do site.

## Conteúdo

A aplicação lê a entrada publicada `perdidos-no-caps` no Space Contentful `nofz0vh5p7s4`. O frontend usa somente uma chave da Content Delivery API, sem permissão de edição. Tokens de gerenciamento são usados apenas pela migração local e não fazem parte do aplicativo ou da hospedagem.
