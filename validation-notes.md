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

## Prévia e interação do card

Após adicionar a moldura `LIVE / PREVIEW`, a estrutura do card passou a reservar uma área exclusiva para a miniatura do site e os controles ficaram em camadas superiores. Na primeira captura, a moldura apareceu, mas a imagem remota ainda não havia sido desenhada dentro dela; o carregamento e a disponibilidade da miniatura precisam ser verificados separadamente antes da publicação. Os dois controles ficaram visíveis no DOM, com áreas independentes acima da camada visual.

A verificação no navegador confirmou que a imagem de miniatura possui dimensões válidas, mas não conclui a requisição mesmo depois de aguardar. Por ser uma dependência externa com resposta pendente, essa abordagem não é adequada para garantir a visualização do card. A prévia será substituída por uma solução direta e interativa que não dependa de um serviço externo de captura.

A prévia foi substituída por um quadro incorporado do site mais recente. Na validação visual, o conteúdo real do portfólio passou a aparecer dentro da moldura `LIVE / PREVIEW`, sem depender de uma imagem de serviço externo. Os controles `Visitar projeto` e `Ver meus projetos` continuam em uma camada acima da prévia.

O botão `Ver meus projetos` foi acionado com sucesso e abriu o catálogo com todos os projetos ativos. O link `Visitar projeto` também foi acionado e abriu o site mais recente, confirmando que o quadro incorporado não intercepta os cliques dos controles do card.

A prévia incorporada foi revalidada após a inclusão do fallback. O card exibiu o conteúdo visual real do projeto recente no quadro `LIVE / PREVIEW`; enquanto um projeto for carregado, a camada textual de fallback permanece atrás da incorporação e não prejudica a apresentação. Caso uma incorporação seja bloqueada em outro projeto, o card continuará exibindo título e orientação de acesso por meio do botão de visita.

Na publicação Vercel associada ao commit `07ecfae`, a vitrine foi aberta no navegador e apresentou a página real do projeto recente dentro da moldura `LIVE / PREVIEW`. O quadro permaneceu visualmente separado do bloco de dados e os dois controles do card ficaram expostos na parte inferior direita, sem sobreposição da prévia.

Ainda no deployment publicado, o botão `Ver meus projetos` abriu o catálogo com os cinco projetos ativos retornados pela conta. Em seguida, o link `Visitar projeto` foi acionado e navegou para o deployment ativo do projeto recente, confirmando a interatividade dos dois controles em produção.

## Catálogo com prévias ao vivo

A implementação local passou a criar uma prévia independente para cada card do catálogo. Cada quadro tenta carregar o deployment ativo correspondente e mantém um fallback legível com link direto caso a incorporação seja bloqueada ou não finalize no prazo. A expansão e o carregamento assíncrono do catálogo seguem em validação visual antes da publicação.

Na validação local, o controle do catálogo abriu a lista com cinco cards. Cada card recebeu uma área própria de prévia `LIVE / PREVIEW`, sem camada interativa sobre o link principal. O primeiro projeto já apresentou seu conteúdo ao vivo; os demais permaneceram inicialmente no estado de carregamento enquanto suas páginas eram requisitadas.

Na publicação com seleção de aliases públicos, o endpoint passou a devolver `altixdev-chi.vercel.app` para a Altixdev e os domínios estáveis equivalentes para os demais projetos. O botão principal de visita já passou a apontar para o domínio público do portfólio, em vez da URL temporária e protegida do deployment. A barra nativa de rolagem também deixou de ser exibida, mantendo a página rolável.

No teste visual em produção, a página carregou sem a faixa de rolagem lateral visível. O botão do catálogo percorre uma consulta assíncrona; a lista é exibida após a atualização de estado seguinte ao clique, preservando o conteúdo e a interação do restante da página.

Na validação final do catálogo publicado, os cinco cards abriram com URLs públicas estáveis. A Altixdev carregou pela prévia de `altixdev-chi.vercel.app`, mostrando seu design real no próprio card; o portfólio e os demais projetos também exibiram seus conteúdos publicados. Os links dos cards passaram a direcionar para essas mesmas URLs públicas, sem depender dos domínios temporários de deployment que exigem autenticação.

O fallback foi acionado manualmente na publicação pelo parâmetro de validação e apresentou uma composição legível de `LINK DIRETO`, título do projeto e orientação de visita. Nessa condição, o botão `Ver meus projetos` continuou exposto e recebeu o clique, comprovando que a camada de preview não bloqueia os controles.
