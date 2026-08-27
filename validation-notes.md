# Validação de prévia

## Navegação e carregamento

A prévia do portfólio carregou corretamente com título, marca WB/, conteúdo, retrato, CTAs e navegação lateral visíveis. A ação primária “Ver trabalho selecionado” foi testada e direcionou corretamente para a seção `#projeto`, preservando a linha de navegação ativa e o enquadramento do case.

## Layouts inspecionados

Foram conferidas capturas completas em desktop (1440 × 1000) e mobile (390 × 844). A hierarquia, o retrato, os cartões de capacidade, os blocos de stack e a chamada final se reorganizam sem transbordamento aparente nas larguras observadas.

## Produção no Vercel

A primeira publicação externa apresentava caminhos `/manus-storage/`, que existem somente na prévia do projeto e impediam o carregamento da foto e dos fundos no Vercel. Os ativos foram migrados para URLs públicas de CDN e a produção mais recente foi validada com o retrato, o símbolo WB, o fundo de hero e os elementos visuais carregando corretamente. A chamada principal para o case também foi testada na URL de produção e navegou para a seção `#projeto` conforme esperado.

## Vitrine dinâmica em desenvolvimento

Na prévia local, a consulta pública retornou projetos de produção da conta Vercel e o card principal apresentou `wesley-portfolio-studio` como projeto mais recente. O botão `Ver meus projetos` foi acionado durante a validação visual e a expansão visual ainda precisa de conferência adicional antes da publicação, pois o catálogo não ficou visível no primeiro clique automatizado.

Uma segunda verificação, aguardando a renderização assíncrona, confirmou a abertura do catálogo. A interface exibiu os cinco projetos ativos retornados pela conta: `wesley-portfolio-studio`, `altixdev`, `portifolio`, `espacoglamour` e `projetoverdeacao`.

## Correção da função Vercel

O primeiro deploy da vitrine dinâmica falhou em produção porque a função tRPC tentava importar módulos locais que não foram incluídos no pacote da função Vercel. A rota foi substituída por `/api/projects`, uma função autocontida que lê as variáveis sensíveis diretamente do ambiente Vercel. O endpoint de produção retornou com sucesso o projeto recente e os cinco projetos ativos da conta. A página em produção passou a mostrar `wesley-portfolio-studio` no card principal; a expansão do catálogo está sendo conferida após o carregamento assíncrono.

A validação visual em produção confirmou a abertura do catálogo, o carregamento dos cinco projetos ativos e seus respectivos links. Também foi identificado que a âncora de navegação podia permanecer no endereço depois de um clique, causando abertura direta na seção de projetos após uma atualização. A correção local usa rolagem programática e remove a âncora da URL imediatamente após a navegação interna.

## Carregamento inicial

A prévia foi aberta pela URL sem fragmento e iniciou corretamente no hero. Em seguida, a chamada `Ver trabalho selecionado` moveu a página até a vitrine sem adicionar `#projeto` ao endereço. Com isso, uma atualização do navegador volta ao início da página em vez de restaurar a seção de projetos.

A mesma verificação foi concluída na produção após o deploy `fix: abrir portfólio sempre no início`. A URL abriu no hero, sem fragmento, e o botão de trabalho selecionado conduziu à vitrine mantendo o endereço limpo. Portanto, atualizar a página volta ao início, como definido.

O cenário de acesso direto também foi validado na prévia: a URL foi aberta com `#projeto`, o fragmento foi removido antes da renderização do conteúdo e a página iniciou no hero, no topo.
