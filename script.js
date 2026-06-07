/* =========================================================
   MÉTODO AUTORA — Candidatura
   ▼▼▼ EDITE APENAS ESTA PARTE ▼▼▼
   ========================================================= */
const CONFIG = {
  // WhatsApp que vai RECEBER as candidaturas (o seu / da professora).
  // Formato internacional, só dígitos: 55 + DDD + número.
  whatsapp: "5511999999999",
};
/* ▲▲▲ EDITE APENAS ESTA PARTE ▲▲▲ */


const form = document.getElementById("form");
const steps = Array.from(document.querySelectorAll(".step"));
const progressBar = document.getElementById("progressBar");
const stepCount = document.getElementById("stepCount");

// Passos que contam como "pergunta" (fora a intro e a tela final).
const questionSteps = steps.filter(
  (s) => !["intro", "done"].includes(s.dataset.step)
);

let current = 0;
const answers = {};

function showStep(index) {
  current = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((s, i) => s.classList.toggle("is-active", i === current));

  const step = steps[current];
  const qIndex = questionSteps.indexOf(step);

  // Barra de progresso
  let pct = 0;
  if (step.dataset.step === "done") pct = 100;
  else if (qIndex >= 0) pct = ((qIndex + 1) / (questionSteps.length + 1)) * 100;
  progressBar.style.width = pct + "%";

  // Contador de perguntas
  if (qIndex >= 0) {
    stepCount.textContent = `Pergunta ${qIndex + 1} de ${questionSteps.length}`;
  } else {
    stepCount.textContent = "";
  }

  // Foco no primeiro campo
  const input = step.querySelector(".input");
  if (input) setTimeout(() => input.focus(), 80);
}

function showError(step, show) {
  const err = step.querySelector("[data-error]");
  if (err) err.classList.toggle("is-visible", show);
}

function validate(step) {
  const type = step.dataset.step;

  // E-mail é opcional, mas se preenchido precisa ser válido.
  if (type === "field") {
    const input = step.querySelector(".input");
    if (input.id === "email") {
      const val = (input.value || "").trim();
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false;
      return true;
    }
  }

  if (!step.hasAttribute("data-required")) return true;

  if (type === "field") {
    const input = step.querySelector(".input");
    const val = (input.value || "").trim();
    if (input.id === "whatsapp") {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10;
    }
    return val.length >= 2;
  }
  if (type === "choice") {
    const group = step.querySelector(".choices");
    return !!answers[group.dataset.name];
  }
  if (type === "consent") {
    return step.querySelector("#consent").checked;
  }
  return true;
}

function next() {
  const step = steps[current];
  if (!validate(step)) {
    showError(step, true);
    return;
  }
  showError(step, false);
  showStep(current + 1);
}

function back() {
  showStep(current - 1);
}

// ----- Botões avançar / voltar -----
document.querySelectorAll("[data-next]").forEach((b) =>
  b.addEventListener("click", next)
);
document.querySelectorAll("[data-back]").forEach((b) =>
  b.addEventListener("click", back)
);

// ----- Escolhas (seleção + avanço automático) -----
document.querySelectorAll(".choices").forEach((group) => {
  group.querySelectorAll(".choice").forEach((choice) => {
    choice.addEventListener("click", () => {
      group.querySelectorAll(".choice").forEach((c) => c.classList.remove("is-selected"));
      choice.classList.add("is-selected");
      answers[group.dataset.name] = choice.dataset.value;
      showError(choice.closest(".step"), false);
      setTimeout(next, 280);
    });
  });
});

// ----- Enter avança nos campos de texto (menos textarea) -----
form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]').forEach((inp) => {
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }
  });
});

// ----- Envio -----
function montarMensagem() {
  const v = (id) => (document.getElementById(id).value || "").trim();
  const linhas = [
    "Olá! Quero me candidatar ao Método Autora. ✨",
    "",
    `*Nome:* ${v("nome")}`,
    `*WhatsApp:* ${v("whatsapp")}`,
  ];
  if (v("email")) linhas.push(`*E-mail:* ${v("email")}`);
  if (answers.momento) linhas.push(`*Momento da pesquisa:* ${answers.momento}`);
  if (answers.trava) linhas.push(`*Maior trava:* ${answers.trava}`);
  if (v("motivo")) linhas.push(`*Por que agora:* ${v("motivo")}`);
  return linhas.join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const step = steps[current];
  if (!validate(step)) {
    showError(step, true);
    return;
  }
  const waUrl =
    "https://wa.me/" +
    CONFIG.whatsapp.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(montarMensagem());

  document.getElementById("waLink").setAttribute("href", waUrl);
  showStep(steps.findIndex((s) => s.dataset.step === "done"));
  setTimeout(() => { window.location.href = waUrl; }, 1200);
});

// Início
showStep(0);
