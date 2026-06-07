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
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data/Hora", "Nome", "WhatsApp", "E-mail", "Momento da pesquisa",
        "Maior trava", "Por que agora", "Origem", "Campanha",
        "Dispositivo", "Tempo (seg)", "Página"
      ]);
    }
    var p = e.parameter;
    sheet.appendRow([
      new Date(), p.nome || "", p.whatsapp || "", p.email || "",
      p.momento || "", p.trava || "", p.motivo || "",
      p.origem || "", p.campanha || "", p.dispositivo || "",
      p.tempo_seg || "", p.pagina || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

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

## Métricas que a planilha registra

Além das respostas, cada linha traz dados para você medir o que funciona:

| Coluna | Para que serve |
| --- | --- |
| **Data/Hora** | Quando a candidatura chegou. |
| **Origem / Campanha** | De onde veio o lead (ex.: `utm_source=instagram`, anúncio, link na bio). |
| **Dispositivo** | Celular ou computador. |
| **Tempo (seg)** | Quanto a pessoa levou para responder (engajamento). |
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
6. O que fez procurar agora *(opcional)*
7. Consentimento de contato (LGPD)
