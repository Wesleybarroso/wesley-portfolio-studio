# Sincronização automática de projetos Vercel

O Vercel permite configurar webhooks de conta que enviam uma requisição HTTP `POST` a um endpoint público quando ocorrem eventos de deployment. Entre os eventos de interesse estão `deployment.created`, `deployment.ready`, `deployment.succeeded`, `deployment.promoted`, `deployment.error` e `deployment.canceled`.

Para atualizar uma vitrine de projetos assim que um deployment for concluído, o evento recomendado é `deployment.ready` ou `deployment.succeeded`. Os eventos carregam dados do projeto e do deployment, incluindo identificador, nome, URL, alvo de produção e timestamp. O endpoint receptor deve validar a assinatura `x-vercel-signature` usando o segredo fornecido ao criar o webhook; esse segredo só é mostrado uma vez e precisa ser guardado como credencial de servidor.

No plano Hobby atual, o acesso a webhooks de conta pode ser restrito, pois a documentação do Vercel indica essa funcionalidade como disponível para equipes Pro e Enterprise. Caso a criação do webhook não esteja disponível, a alternativa segura é uma atualização sob demanda no botão da vitrine ou uma sincronização periódica de baixa frequência com a API Vercel, ambos protegidos por credencial de servidor.

Fonte: https://vercel.com/docs/webhooks

## Referência de experiência: Altixdev

Na seção `#portfolio` da Altixdev, os projetos ativos são organizados em cartões e apresentados com controles de categoria: `Todos`, `Web`, `SaaS`, `Sistemas` e `Aplicativos`. A interface também inclui uma ação de expansão, `Ver portfólio completo`. A versão do portfólio pessoal manterá a mesma lógica de descoberta — card atualizado do projeto mais recente e uma ação explícita para revelar o catálogo completo — mas usará a linguagem Arquitetura de Luz, com um único card principal, sinalização WB e uma camada secundária de projetos carregada sob demanda.

## Implementação observada na Altixdev

A Altixdev protege o token do Vercel em uma função de servidor e mantém metadados de apresentação em uma tabela própria. A função recupera esses metadados, consulta o deployment de produção mais recente de cada projeto no Vercel e devolve a lista enriquecida com estado, URL e data de atualização. Para o portfólio, a mesma separação será preservada: a interface nunca receberá o token; uma rota de servidor retornará apenas projetos com deployment de produção pronto. Como o requisito agora é mostrar todos os projetos ativos da conta, a rota também deverá consultar a lista de deployments de produção e consolidar um item por projeto, ordenado pela atualização mais recente.

## Configuração de produção no Vercel

O Vercel disponibiliza o endpoint `POST /v10/projects/{idOrName}/env` para criar variáveis de ambiente no projeto, usando autenticação Bearer. O token de acesso deve ser cadastrado como variável do tipo `sensitive`, com os alvos `production` e `preview`, para que seu valor não possa ser consultado depois da criação. A API de deployments aceita `target=production`, `state=READY` e o parâmetro `slug` da equipe, permitindo que o servidor retorne somente um deployment ativo por projeto, em ordem de atualização.

Fontes: https://vercel.com/docs/rest-api/projects/create-one-or-more-environment-variables ; https://vercel.com/docs/rest-api/deployments/list-deployments ; https://vercel.com/docs/environment-variables/sensitive-environment-variables
