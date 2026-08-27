# Direção de design — Portfólio Wesley Barroso

## Três caminhos explorados

### 1. Terminal Editorial
**Muito breve:** Um portfólio de engenharia tratado como uma publicação técnica premium: tipografia editorial, fundos claros e diagramas precisos. A sensação seria de método, clareza e credibilidade.

**Probabilidade:** 0,07

### 2. Arquitetura de Luz
**Muito breve:** Uma presença pessoal sofisticada construída sobre azul noite, vidro fumê, reflexos de cobre e volumes flutuantes. A linguagem visual converte a foto do desenvolvedor em um ponto de confiança dentro de um ambiente digital com profundidade.

**Probabilidade:** 0,03

### 3. Oficina Cinética
**Muito breve:** Uma estética industrial de estúdio, com superfícies de aço escuro, sinalização verde e movimento mecânico. Ela priorizaria energia operacional e automação visível.

**Probabilidade:** 0,09

## Abordagem escolhida: Arquitetura de Luz

### Movimento de design

O projeto seguirá uma leitura contemporânea de **neo-noir editorial com glassmorphism arquitetônico**. Em vez de repetir o padrão de gradientes roxos e cartões genéricos, a interface será construída como um espaço digital profundo: painéis translúcidos, luz azul de monitor, reflexos de cobre e uma hierarquia tipográfica inspirada em publicações de tecnologia premium.

### Princípios centrais

1. **Presença antes de ornamento:** a fotografia de Wesley será o elemento humano principal e assumirá papel de assinatura profissional, nunca como imagem decorativa pequena.
2. **Profundidade com propósito:** camadas, sombras, blur e perspectiva guiam o olhar para decisões importantes, sem comprometer o contraste ou a velocidade.
3. **Narrativa de engenharia:** cada seção deve responder como Wesley pensa, constrói e entrega — não apenas listar ferramentas.
4. **Movimento informativo:** parallax, revelações por scroll e resposta ao cursor devem enriquecer a orientação espacial, sempre com alternativa para redução de movimento.

### Filosofia de cor

O azul elétrico **#2F7BFF** será a cor de assinatura: ele conecta a iluminação presente nas fotos do estúdio à ideia de sistemas em operação. O azul é equilibrado por um fundo de grafite quase preto, superfícies azul-petróleo e um cobre discreto para sinalizar resultados, disponibilidade e detalhes premium. A paleta evita roxo predominante para ganhar distinção em relação ao portfólio anterior.

### Paradigma de layout

O layout terá uma **coluna de comando vertical** no desktop: marca e navegação à esquerda, enquanto o conteúdo usa uma composição assimétrica de amplas faixas e painéis deslocados. O hero funcionará como uma cena em camadas: manifesto profissional à esquerda e retrato em portal luminoso à direita. No mobile, a coluna se transforma em barra superior compacta e as seções mantêm a narrativa vertical.

### Elementos de assinatura

1. **Portal de retrato:** moldura oval recortada em perspectiva, com a foto de perfil, borda de luz azul e anéis orbitais discretos.
2. **Linha de sinal:** traço azul de estado que acompanha a navegação e aparece nos títulos, conectando cada momento da página.
3. **Cartões de material:** superfícies de vidro fumê com bordas de uma linha, brilho interno e reflexo em movimento ao passar o cursor.

### Filosofia de interação

A navegação deve parecer uma console precisa: links mudam de estado sem espetáculo exagerado e a seção ativa fica inequívoca. Os cartões respondem ao cursor com inclinação sutil em três dimensões. Os botões possuem peso físico: pressionam levemente, iluminam a borda e deixam claro o próximo passo.

### Animação

O hero usa parallax em camadas no ponteiro e no scroll: fundo, anéis, moldura e foto se movem com amplitudes diferentes. Elementos de conteúdo entram por scroll em sequências curtas, com opacidade e deslocamento vertical modestos. Um grid de partículas/nós se move lentamente no fundo do hero; este é o quinto efeito de assinatura além de parallax, profundidade, scroll reveal e motion. Toda animação não essencial será reduzida para usuários com `prefers-reduced-motion`.

### Sistema tipográfico

**Space Grotesk** será usada nos títulos por sua geometria contemporânea e técnica; **Manrope** será usada nos textos e controles por sua legibilidade. O nome terá peso 700–800, títulos de seção usarão peso 600–700, e pequenos rótulos serão em caixa alta com espaçamento generoso. A tipografia substitui deliberadamente o uso genérico de Inter.

### Essência da marca

**Wesley Barroso cria produtos digitais e automações robustas para negócios que precisam transformar operação complexa em tecnologia clara, escalável e mensurável.**

Personalidade: **preciso, acessível e visionário**.

### Voz da marca

Os títulos devem ser diretos, humanos e orientados à transformação; os CTAs devem indicar um próximo passo concreto, não usar promessas vazias. A linguagem alterna domínio técnico e benefício de negócio, sem jargão gratuito.

Exemplos: “Da complexidade operacional a sistemas que avançam o negócio.”

“Vamos mapear o que sua operação precisa para ganhar escala.”

### Wordmark e logotipo

O wordmark usará o monograma **WB/** em uma construção modular, com a barra como “linha de sinal” azul. O símbolo será um bloco quadrado azul de cantos mínimos, composto por W e B em traços cortados; a marca por extenso aparece como `WESLEY.BARROSO` em letras espaçadas. O símbolo também será usado como favicon e marca de navegação em tamanho perceptível.

### Cor de assinatura

**Sinal Altitude — #2F7BFF.**

## Style Decisions

As recomendações de refinamento foram aceitas. O monograma **WB/** e o wordmark `WESLEY.BARROSO` assumem uma presença explícita no primeiro enquadramento, dentro de uma coluna de comando reforçada. A linha azul Sinal Altitude passa a atuar como eixo estrutural contínuo: indica a navegação ativa, acompanha rótulos de seção, cruza painéis e conecta ações importantes. O cobre permanece reservado a disponibilidade, índices, status e momentos de resultado.

As seções posteriores deixam de seguir a mesma cadência de títulos e cartões: os painéis de visão, case e stack passam a usar deslocamentos, planos recortados e assimetria graduada. A hierarquia dos títulos também varia entre ênfase azul, branco técnico e cobre de resultado, preservando coerência sem repetir a mesma fórmula visual.
