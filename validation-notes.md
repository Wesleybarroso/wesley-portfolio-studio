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
