# Identidade Visual e Temas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar ao site público uma identidade visual inspirada na logo e oferecer temas Sistema, Claro e Escuro com preferência persistente.

**Architecture:** Uma feature `theme` isolará preferência, resolução do tema efetivo e persistência. O cabeçalho consumirá essa API por um seletor acessível; a Home continuará recebendo apenas dados do controller e terá seus componentes de apresentação redesenhados com tokens CSS semânticos.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Vitest, Testing Library e assets WebP locais.

**Spec:** `docs/superpowers/specs/2026-09-29-identidade-visual-e-temas-design.md`

## Global Constraints

- A primeira visita usa a preferência `system`; escolhas manuais `light` e `dark` ficam no `localStorage`.
- Mudanças de `prefers-color-scheme` atualizam a página apenas quando a preferência é `system`.
- Falhas do armazenamento não impedem a renderização.
- Textos e controles devem atingir contraste WCAG AA, ter foco visível e funcionar por teclado.
- O conteúdo, os schemas e as consultas do Sanity não serão alterados.
- Imagens de eventos preservam proporção natural, skeleton e fallback de erro atuais.
- `prefers-reduced-motion` remove movimentos não essenciais.
- A marca “Dola AI” será removida da logo sem alterar a arte principal.
- Esta pasta não possui repositório Git; checkpoints substituem os passos de commit até que Git seja inicializado.

## Review Focus

- `localStorage` contendo texto inválido deve cair em `system` sem lançar erro; coberto na Task 1.
- `localStorage` indisponível deve manter o tema funcional durante a sessão; coberto na Task 1.
- Navegador sem a API moderna de eventos de `matchMedia` deve montar sem falhar; coberto na Task 1.
- Alteração rápida entre temas deve deixar apenas o atributo correspondente no elemento raiz; coberto na Task 1.
- Cabeçalho estreito com muitos links deve manter marca e controle acessíveis, com navegação rolável; coberto na Task 2.

---

### Task 1: Motor de tema

**Files:**
- Create: `src/features/theme/theme.types.ts`
- Create: `src/features/theme/theme.storage.ts`
- Create: `src/features/theme/theme.ts`
- Create: `src/features/theme/theme-provider.tsx`
- Create: `src/features/theme/use-theme.ts`
- Create: `src/features/theme/theme-provider.test.tsx`
- Modify: `src/main.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces: `type ThemePreference = 'system' | 'light' | 'dark'`
- Produces: `type ResolvedTheme = 'light' | 'dark'`
- Produces: `ThemeProvider({ children }: PropsWithChildren)`
- Produces: `useTheme(): { preference: ThemePreference; resolvedTheme: ResolvedTheme; setPreference(value: ThemePreference): void }`
- Produces: `readThemePreference(storage: Storage): ThemePreference` e `writeThemePreference(storage: Storage, value: ThemePreference): void`

- [ ] **Step 1: Escrever testes falhando do provider e armazenamento**

Cobrir: padrão `system`, valor salvo válido, valor inválido, exceções de leitura/escrita, mudança do sistema, preferência manual ignorando mudança do sistema, ausência de `addEventListener` e trocas repetidas sem classes ou atributos conflitantes.

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `npm test -- src/features/theme/theme-provider.test.tsx`

Expected: FAIL porque a feature ainda não existe.

- [ ] **Step 3: Implementar tipos, armazenamento e resolução pura**

Usar a chave `perdidos-no-caps-theme`. Aplicar `data-theme="light|dark"` e `color-scheme` ao `document.documentElement`.

- [ ] **Step 4: Implementar `ThemeProvider` e `useTheme`**

Escutar `matchMedia('(prefers-color-scheme: dark)')` somente em `system`; manter fallback compatível quando APIs de eventos não existirem.

- [ ] **Step 5: Adicionar inicialização pré-React**

Adicionar ao `index.html` um script inline curto que valida a mesma chave, resolve o sistema e define `data-theme` antes do CSS ser pintado. Envolver acesso ao armazenamento em `try/catch`.

- [ ] **Step 6: Montar o provider e verificar GREEN**

Envolver `<App />` em `ThemeProvider` no `src/main.tsx`.

Run: `npm test -- src/features/theme/theme-provider.test.tsx`

Expected: PASS.

- [ ] **Step 7: Executar checkpoint**

Run: `npm test && npm run build`

Expected: suíte e build aprovados.

### Task 2: Seletor de tema e cabeçalho responsivo

**Files:**
- Create: `src/features/theme/theme-switcher.tsx`
- Create: `src/features/theme/theme-switcher.test.tsx`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/pages/home/home.test.tsx`

**Interfaces:**
- Consumes: `useTheme()` da Task 1.
- Produces: `ThemeSwitcher()` com opções `system`, `light` e `dark` e rótulo “Aparência”.

- [ ] **Step 1: Escrever testes falhando do seletor**

Testar nome acessível, três opções textuais, estado selecionado, alteração por clique e persistência via provider. No teste da Home, verificar que marca, seletor e navegação continuam disponíveis em conjunto.

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `npm test -- src/features/theme/theme-switcher.test.tsx src/pages/home/home.test.tsx`

Expected: FAIL pela ausência do seletor.

- [ ] **Step 3: Implementar o seletor acessível**

Usar um grupo de três botões com `aria-label="Aparência"`, `aria-pressed` e texto Sistema, Claro e Escuro. Não depender apenas de ícones.

- [ ] **Step 4: Integrar ao cabeçalho**

Manter marca e seletor na primeira linha do celular; colocar a navegação na segunda linha com `overflow-x-auto`, foco visível e alvos mínimos de 44 px. No desktop, alinhar tudo em uma linha.

- [ ] **Step 5: Verificar GREEN e checkpoint**

Run: `npm test -- src/features/theme/theme-switcher.test.tsx src/pages/home/home.test.tsx && npm run build`

Expected: testes e build aprovados.

### Task 3: Logo tratada e fundação visual

**Files:**
- Create: `src/assets/perdidos-no-caps-logo.webp`
- Create: `src/components/brand/brand-logo.tsx`
- Create: `src/components/brand/brand-logo.test.tsx`
- Modify: `src/index.css`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/pages/home/components/hero-section.tsx`

**Interfaces:**
- Produces: `BrandLogo({ className, eager, compact }: { className?: string; eager?: boolean; compact?: boolean })`.
- Consumes: tokens definidos em `src/index.css` por todos os componentes visuais da Task 4.

- [ ] **Step 1: Editar e validar a logo**

Usar a imagem fornecida como referência, remover apenas “Dola AI”, reconstruir o fundo preto e exportar WebP. Inspecionar o resultado para confirmar que a borda amarela e a arte principal não foram cortadas ou alteradas.

- [ ] **Step 2: Escrever teste falhando do componente de marca**

Testar texto alternativo “Perdidos no CAPS”, dimensões explícitas e `loading="eager"` no hero versus carregamento comum no cabeçalho.

- [ ] **Step 3: Executar o teste e confirmar RED**

Run: `npm test -- src/components/brand/brand-logo.test.tsx`

Expected: FAIL porque o componente não existe.

- [ ] **Step 4: Implementar `BrandLogo`**

Usar a imagem local, dimensões intrínsecas e `decoding="async"`; a variante compacta deve manter o círculo reconhecível no cabeçalho.

- [ ] **Step 5: Definir tokens e estilos globais**

Criar tokens claros e escuros para background, foreground, surface, elevated, primary, primary-foreground, muted, border, ring e accent-blue. Definir as pilhas tipográficas aprovadas, seleção de texto, foco, transições e redução de movimento.

- [ ] **Step 6: Integrar logo ao cabeçalho e hero**

No hero, usar a composição em duas colunas com círculos, gradiente e estrelas CSS decorativas. No cabeçalho, usar a variante compacta ao lado do nome acessível.

- [ ] **Step 7: Verificar GREEN e checkpoint**

Run: `npm test -- src/components/brand/brand-logo.test.tsx src/pages/home/home.test.tsx && npm run build`

Expected: testes e build aprovados.

### Task 4: Redesenho das seções da Home

**Files:**
- Modify: `src/pages/home/home.view.tsx`
- Modify: `src/pages/home/components/about-section.tsx`
- Modify: `src/pages/home/components/events-section.tsx`
- Modify: `src/pages/home/components/events-section.test.tsx`
- Modify: `src/pages/home/components/rules-section.tsx`
- Modify: `src/pages/home/components/contact-section.tsx`
- Modify: `src/components/layout/site-footer.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/pages/home/home.test.tsx`

**Interfaces:**
- Consumes: tokens CSS e `BrandLogo` da Task 3; os tipos e props públicos atuais das seções permanecem iguais.
- Produces: Home responsiva com identidade completa nos dois temas, sem mudar o fluxo de dados.

- [ ] **Step 1: Escrever testes falhando das garantias de comportamento**

Preservar headings e landmarks, links sociais, regras na ordem original, eventos com imagem natural e fallback de erro. Acrescentar a identificação acessível das seções e garantir que elementos decorativos não recebam nomes acessíveis.

- [ ] **Step 2: Executar os testes e confirmar RED**

Run: `npm test -- src/pages/home/home.test.tsx src/pages/home/components/events-section.test.tsx`

Expected: FAIL nas novas garantias visuais e semânticas.

- [ ] **Step 3: Redesenhar Sobre e Eventos**

Aplicar superfícies calmas, etiquetas alinhadas à paleta e cards elevados. Preservar proporção, skeleton e tratamento de falha das imagens de evento.

- [ ] **Step 4: Redesenhar Regras, Contato e Rodapé**

Usar regras em uma coluna no celular e duas no desktop; criar bloco de contato com destaque controlado e manter o rodapé escuro com os textos e crédito existentes.

- [ ] **Step 5: Ajustar botões e acabamento da Home**

Aplicar variantes com contraste AA, foco visível, hover discreto e transições reduzíveis. Harmonizar espaçamento, divisores e fundos entre as seções.

- [ ] **Step 6: Verificar GREEN**

Run: `npm test -- src/pages/home/home.test.tsx src/pages/home/components/events-section.test.tsx`

Expected: PASS.

- [ ] **Step 7: Executar verificação completa**

Run: `npm test && npm run build && SANITY_CLI_TELEMETRY_DISABLED=1 npm run studio:build`

Expected: toda a suíte aprovada e ambos os builds concluídos.

- [ ] **Step 8: Fazer inspeção visual final**

Inspecionar claro e escuro em 375 px, 768 px e 1440 px. Confirmar ausência de overflow, contraste legível, navegação por teclado, troca de tema sem clarão, banner de evento sem corte e redução de movimento.
