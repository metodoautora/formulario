# Método Autora — Formulário de Candidatura

Mini-site separado com o formulário de **prospecção de clientes** do Método Autora.

Formato de **candidatura**: uma pergunta por tela, barra de progresso, curtinho (5 perguntas)
e otimizado para celular. Ao enviar, as respostas vão **automaticamente para uma planilha do
Google Sheets** — sem servidor e de graça.

**No ar:** https://metodoautora.github.io/formulario/

---

## Passo a passo: ligar o formulário ao Google Sheets

Você faz isso **uma vez**. Leva ~5 minutos.

### 1. Crie a planilha
- Acesse [sheets.new](https://sheets.new) e dê um nome (ex.: "Candidaturas — Método Autora").

### 2. Abra o editor de script
- No menu: **Extensões → Apps Script**.
- Apague o conteúdo que aparecer e **cole o código abaixo**:

```javascript
// E-mail que recebe o aviso de nova candidatura.
var EMAIL_AVISO = "stephanie.hpr@gmail.com";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var cabecalho = [
      "ID", "Status", "Criado em", "Atualizado em", "Nome", "WhatsApp", "E-mail",
      "Momento da pesquisa", "Maior trava", "Prazo", "Prioridade", "Disposição a investir",
      "Por que agora", "Pontuação", "Temperatura",
      "Origem", "Campanha", "Dispositivo", "Tempo (seg)", "Página"
    ];
    if (sheet.getLastRow() === 0) sheet.appendRow(cabecalho);

    var p = e.parameter;
    var id = p.id || ("sem-id-" + new Date().getTime());
    var agora = new Date();
    var status = (p.status === "completo") ? "Completo" : "Parcial";

    // Procura uma linha já existente com este ID (coluna 1).
    var ultima = sheet.getLastRow();
    var linha = -1;
    if (ultima > 1) {
      var ids = sheet.getRange(2, 1, ultima - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === id) { linha = i + 2; break; }
      }
    }

    var novo = (linha === -1);
    var criadoEm = novo ? agora : (sheet.getRange(linha, 3).getValue() || agora);

    var dados = [
      id, status, criadoEm, agora,
      p.nome || "", p.whatsapp || "", p.email || "",
      p.momento || "", p.trava || "", p.prazo || "", p.prioridade || "", p.investir || "",
      p.motivo || "", p.score || "", p.temperatura || "",
      p.origem || "", p.campanha || "", p.dispositivo || "", p.tempo_seg || "", p.pagina || ""
    ];

    if (novo) {
      sheet.appendRow(dados);
    } else {
      sheet.getRange(linha, 1, 1, dados.length).setValues([dados]);
    }

    // E-mail de aviso quando a candidatura é CONCLUÍDA (dados e pontuação já completos).
    if (status === "Completo") avisarPorEmail(p);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, novo: novo }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function avisarPorEmail(p) {
  var assunto = (p.temperatura || "") + " Nova candidatura: " + (p.nome || "sem nome");
  var corpo =
    "Uma nova candidatura foi concluída no Método Autora.\n\n" +
    "Temperatura: " + (p.temperatura || "") + "  (pontuação " + (p.score || "0") + ")\n\n" +
    "Nome: " + (p.nome || "") + "\n" +
    "WhatsApp: " + (p.whatsapp || "") + "\n" +
    "E-mail: " + (p.email || "") + "\n" +
    "Momento da pesquisa: " + (p.momento || "") + "\n" +
    "Maior trava: " + (p.trava || "") + "\n" +
    "Prazo: " + (p.prazo || "") + "\n" +
    "Prioridade: " + (p.prioridade || "") + "\n" +
    "Disposição a investir: " + (p.investir || "") + "\n" +
    "Por que agora: " + (p.motivo || "") + "\n\n" +
    "Origem: " + (p.origem || "") + (p.campanha ? " (" + p.campanha + ")" : "") + "\n" +
    "Dispositivo: " + (p.dispositivo || "") + "\n\n" +
    "Veja a linha completa na planilha.";
  MailApp.sendEmail(EMAIL_AVISO, assunto, corpo);
}
```

> **Importante:** sempre que você **alterar este código**, é preciso **republicar**:
> em Apps Script vá em **Implantar → Gerenciar implantações → editar (lápis) →
> Versão: Nova versão → Implantar**. A URL `/exec` continua a mesma.
> Na primeira vez que rodar, o Google vai pedir uma **autorização extra para enviar e-mail** — aceite.

### 3. Publique como aplicativo da web
- Clique em **Implantar → Nova implantação**.
- Em "Tipo", escolha **App da Web**.
- Configure:
  - **Executar como:** Eu (sua conta)
  - **Quem pode acessar:** **Qualquer pessoa**
- Clique em **Implantar** e **autorize** o acesso (é normal o Google pedir confirmação).
- Copie a **URL do app da Web** (termina em `/exec`).

### 4. Cole a URL no formulário
- Abra o arquivo `script.js` e cole a URL em `CONFIG.endpoint`:

```javascript
const CONFIG = {
  endpoint: "https://script.google.com/macros/s/SUA_URL_AQUI/exec",
};
```

- Salve, faça o commit/push, e pronto: toda candidatura cai na planilha sozinha.

---

## Captura parcial (mesmo sem terminar)

Assim que a pessoa preenche o **nome**, a linha já é criada na planilha com **Status = Parcial**.
Conforme ela avança, a **mesma linha** vai sendo atualizada (não cria duplicatas) e, ao enviar,
o status vira **Completo**. Ou seja: você não perde nenhum lead, mesmo quem desistir no meio.

O **e-mail de aviso** para `stephanie.hpr@gmail.com` é enviado **quando a candidatura é concluída**
— assim ele já chega com todos os dados e a **temperatura do lead** (🔥/🟡/🔵) calculada, pra você
decidir na hora se vale a entrevista. (Quem desiste no meio fica salvo como "Parcial" na planilha.)

## Métricas que a planilha registra

Cada linha traz dados para você medir o que funciona:

| Coluna | Para que serve |
| --- | --- |
| **Status** | Parcial (começou) ou Completo (terminou). |
| **Criado em / Atualizado em** | Quando começou e quando foi a última atualização. |
| **Origem / Campanha** | De onde veio o lead (ex.: `utm_source=instagram`, anúncio, link na bio). |
| **Dispositivo** | Celular ou computador. |
| **Tempo (seg)** | Quanto a pessoa levou (engajamento). |
| **Página** | URL exata usada (útil com links UTM diferentes). |

**Dica de marketing:** divulgue links com UTM para saber a origem. Exemplos:
- Bio do Instagram: `.../formulario/?utm_source=instagram&utm_medium=bio`
- Stories: `.../formulario/?utm_source=instagram&utm_medium=stories`
- Anúncio: `.../formulario/?utm_source=meta_ads&utm_campaign=lancamento`

---

## Editar perguntas e textos

Cada `<section class="step">` no `index.html` é uma tela. As opções de escolha estão nos
botões `.choice` (atributo `data-value`).

## Visualizar no computador

```bash
python3 -m http.server 8001
```
Acesse `http://localhost:8001`.

## Estrutura

```
metodo-autora-candidatura/
├── index.html   → as telas/perguntas do formulário
├── styles.css   → design (identidade visual do Método Autora)
├── script.js    → navegação, validação, métricas e envio (EDITE O CONFIG AQUI)
└── assets/      → imagens (se precisar)
```

## Perguntas atuais

1. Nome *(obrigatório)*
2. WhatsApp *(obrigatório)*
3. E-mail *(opcional)*
4. Momento da pesquisa *(escolha)*
5. Maior trava hoje *(escolha)*
6. Prazo se aproximando *(escolha — qualificação)*
7. Prioridade em resolver *(escolha — qualificação)*
8. Disposição a investir *(escolha — qualificação)*
9. O que fez procurar agora *(opcional)*
10. Consentimento de contato (LGPD)

### Pontuação (lead scoring)

As perguntas 6, 7 e 8 geram uma nota (coluna **Pontuação**) e uma **Temperatura**:
🔥 **Quente** (≥ 7) · 🟡 **Morno** (3–6) · 🔵 **Frio** (< 3). Quem responde "só conteúdo gratuito"
cai automaticamente para frio. Priorize as entrevistas pelos quentes.
