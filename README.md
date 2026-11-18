# NEXO Sports — Sports Intelligence

Versão de produção **estática** (zero build) do NEXO Sports, pronta para a Vercel servir como está:
`index.html` + `styles.css` + `app.js` + `assets/logo.svg`. Sem dependências de build, sem CDN de bibliotecas — apenas a fonte Inter (Google Fonts).

> Esta é a **primeira versão publicada (front-end)**. A automação ao vivo — The Odds API com chaves no
> servidor, rodadas agendadas, conferência automática e publicação automática de palpites — conecta
> na **versão com servidor**, no mesmo endereço. Chaves de API **nunca** são digitadas/guardadas
> nesta versão estática (os campos em Fontes de Dados ficam desabilitados de propósito).

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | App de página única (pt-BR): sidebar no desktop, barra superior + navegação horizontal no celular. 15 telas por abas: Dashboard, Simples Futebol, Simples Basquete, Múltipla Inteligente, Gerador de Odd Alta, Ao Vivo, Melhores Mercados, Desempenho, Histórico, Fechamento, Banca, Área VIP, Fontes de Dados, Automação (dono) e Ajuda. |
| `styles.css` | Tema escuro profissional (azul-marinho, degradê verde-esmeralda → azul-elétrico). |
| `app.js` | Navegação entre telas, gráfico SVG da série diária (sem biblioteca), tabela do histórico, gerador de odd alta (matemática demonstrativa), calculadora de banca e copiar fechamento. |
| `assets/logo.svg` | Logo oficial do NEXO Sports (N em hexágono verde/azul), usada na sidebar, no topo mobile, no rodapé e como favicon. |
| `vercel.json` | Cabeçalhos de segurança (CSP compatível com os scripts/estilos do site + Google Fonts, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`) e cache de assets. |

## Dados exibidos

O Dashboard, o Desempenho, o Histórico e o Fechamento usam os dados reais do fechamento de
**novembro/2026 (até 18/11)** do dono:

- Simples Futebol: 40 palpites, 58,8% de acerto, **+4,09u**, ROI **+12,0%**
- Simples NBA: 67 palpites, 56,5% de acerto, **+4,27u**, ROI **+6,9%**
- Bingos antigos (modelo aposentado): 21 bilhetes, 10,5% de acerto, **−3,02u**, ROI **−23,2%** — exibidos como alerta vermelho permanente, explicando a troca pela Múltipla Inteligente
- **Total: +5,34u, ROI +4,9%** (57 GREEN / 58 RED / 1 VOID / 12 pendentes)

Regras visíveis no app: simples máx. 3 por esporte/dia (dia sem valor = **SEM ENTRADA**);
Múltipla Inteligente com máx. 3 pernas, prob. mínima de 68%/perna e prob. conjunta ≥ 25%;
Gerador de Odd Alta (Seguro/Equilibrado/Arrojado, alvos 5/8/10/15/20) sempre com a probabilidade
conjunta à mostra e aviso honesto de que odd alta nunca é garantida; stake com teto de 3u.

## Como publicar na Vercel

1. Envie esta pasta para um repositório no GitHub (ex.: `DUDUZINK070/nexosports`).
2. Na Vercel: **Add New → Project → Import** do repositório.
3. Nome do projeto: **`nexosports`** (endereço esperado: `nexosports.vercel.app`, sujeito à disponibilidade global do subdomínio).
4. Framework Preset: **Other**. Build Command: deixar vazio. Output Directory: deixar vazio (raiz).
5. Deploy. Nenhuma variável de ambiente é necessária nesta versão estática.

## Cron / automação (versão com servidor — ainda não nesta versão)

<!-- Cron placeholder: na versão com servidor (Next.js/API routes), a grade prevista é
     rodadas a cada 2h das 11h às 07h (America/Sao_Paulo) chamando a rota de automação,
     mais a conferência pós-jogo. Exemplo de vercel.json daquela versão:
     "crons": [{ "path": "/api/cron/run?job=all", "schedule": "0 11,13,15,17,19,21,23,1,3,5,7 * * *" }]
     Não há cron nesta versão estática: sem servidor, não há o que agendar. -->

Quando a versão com servidor entrar, ela reaproveita este mesmo front-end e endereço; as chaves
da The Odds API serão configuradas **no servidor** (criptografadas), nunca neste site estático.

## Aviso de risco

Análise esportiva envolve risco e nenhum resultado é garantido. Desempenho passado não garante
desempenho futuro.
