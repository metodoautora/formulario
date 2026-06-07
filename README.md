# Método Autora — Formulário de Candidatura

Mini-site separado com o formulário de **prospecção de clientes** do Método Autora.

Formato de **candidatura**: uma pergunta por tela, barra de progresso, curtinho (5 perguntas)
e otimizado para celular. Ao final, abre o **WhatsApp** da professora com a candidatura já
preenchida — sem precisar de banco de dados nem servidor.

## O que editar (rápido)

Abra o arquivo `script.js`. No topo há um bloco `CONFIG`:

- `whatsapp`: o número que vai **receber** as candidaturas, no formato internacional só com
  dígitos (`55` + DDD + número). Ex.: `5511999999999`.

Para mudar perguntas ou textos, edite o `index.html` (cada `<section class="step">` é uma tela).

## Como visualizar no computador

Abra `index.html` com duplo clique, ou rode na pasta:

```bash
python3 -m http.server 8001
```

E acesse `http://localhost:8001`.

## Como publicar (grátis)

Arraste a pasta inteira para o **Netlify** (netlify.com → "Add new site" → "Deploy manually"),
ou suba num repositório e ative o **GitHub Pages**. Depois é só divulgar o link
(ex.: na bio do Instagram).

## Estrutura

```
metodo-autora-candidatura/
├── index.html   → as telas/perguntas do formulário
├── styles.css   → design (identidade visual do Método Autora)
├── script.js    → navegação, validação e envio (EDITE O CONFIG AQUI)
└── assets/      → imagens (se precisar)
```

## Perguntas atuais

1. Nome *(obrigatório)*
2. WhatsApp *(obrigatório)*
3. E-mail *(opcional)*
4. Momento da pesquisa *(escolha)*
5. Maior trava hoje *(escolha)*
6. O que fez procurar agora *(opcional)*
7. Consentimento de contato (LGPD)
