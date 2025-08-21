/* ===== ДАННЫЕ ===== */
const vocabulary = [
  {
    term: "Треугольник",
    definition: "Многоугольник с тремя сторонами и тремя углами",
    color: "bg-red-500",
  },
  {
    term: "Окружность",
    definition: "Набор точек на одинаковом расстоянии от центра",
    color: "bg-blue-500",
  },
  {
    term: "Перпендикуляр",
    definition: "Линии, пересекающиеся под углом 90°",
    color: "bg-green-500",
  },
  {
    term: "Диаметр",
    definition: "Отрезок через центр окружности, соединяющий точки на ней",
    color: "bg-purple-500",
  },
  {
    term: "Параллель",
    definition: "Линии, не пересекающиеся и на одинаковом расстоянии",
    color: "bg-orange-500",
  },
  {
    term: "Вершина",
    definition: "Точка, где встречаются две стороны фигуры",
    color: "bg-pink-500",
  },
];

/* ===== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ===== */
let score = 0,
  matches = new Set(),
  hintsUsed = 0;
let mathScore = 0,
  mathWrong = 0,
  currentAnswer = 0,
  currentProblem = { num1: 2, num2: 3 };
let equationScore = 0,
  equationWrong = 0,
  currentEquation = { a: 5, b: 12, x: 7, formula: "x + 5 = 12" };
let calcScore = 0,
  calcWrong = 0,
  currentCalc = { expression: "3 + 4 × 2", answer: 11 };
let cmpScore = 0,
  cmpWrong = 0,
  currentCmp = { a: 7, b: 12 };

/* ===== УТИЛИТЫ ===== */
const $ = (id) => document.getElementById(id);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showPage(pageId) {
  // секции
  ["vocabPage", "mathPage", "equaPage", "calcPage", "comparePage"].forEach(
    (id) => {
      $(id).classList.toggle("hidden", id !== pageId);
    }
  );
  // подсветка навигации
  const active = {
    vocabPage: ["vocabBtn"],
    mathPage: ["mathBtn"],
    equaPage: ["equaBtn"],
    calcPage: ["calcBtn"],
    comparePage: ["compareBtn"],
  }[pageId];

  ["vocabBtn", "mathBtn", "equaBtn", "calcBtn", "compareBtn"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    if (active.includes(id)) el.classList.add("ring-2", "ring-white/70");
    else el.classList.remove("ring-2", "ring-white/70");
  });
}

/* ===== СЛОВАРЬ ===== */
function initVocab() {
  const terms = $("termsContainer");
  const defs = $("definitionsContainer");
  score = 0;
  matches.clear();
  hintsUsed = 0;
  $("score").textContent = "0";
  terms.innerHTML = "";
  defs.innerHTML = "";

  const t = shuffle(vocabulary),
    d = shuffle(vocabulary);

  t.forEach((item) => {
    const el = document.createElement("div");
    el.className = `${item.color} text-white p-4 rounded-lg cursor-move font-semibold text-center transition hover:scale-105 shadow-lg`;
    el.textContent = item.term;
    el.draggable = true;
    el.dataset.term = item.term;
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.term);
      el.classList.add("opacity-70");
    });
    el.addEventListener("dragend", () => el.classList.remove("opacity-70"));
    terms.appendChild(el);
  });

  d.forEach((item) => {
    const el = document.createElement("div");
    el.className =
      "bg-white/20 backdrop-blur-sm text-white p-4 rounded-lg border-2 border-dashed border-white/30 drop-zone transition hover:bg-white/30";
    el.innerHTML = `<div class="font-medium">${item.definition}</div>`;
    el.dataset.term = item.term;

    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.classList.add("scale-[1.02]", "bg-white/30");
    });
    el.addEventListener("dragleave", () =>
      el.classList.remove("scale-[1.02]", "bg-white/30")
    );
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.classList.remove("scale-[1.02]", "bg-white/30");
      const dragged = e.dataTransfer.getData("text/plain");
      if (dragged === item.term && !matches.has(dragged)) {
        matches.add(dragged);
        score++;
        $("score").textContent = String(score);
        el.classList.add("bg-emerald-600", "text-white");
        document
          .querySelector(`[data-term="${dragged}"]`)
          .classList.add("bg-emerald-600", "text-white");
        document.querySelector(`[data-term="${dragged}"]`).draggable = false;
        celebrate(el);
        if (score === vocabulary.length) setTimeout(gameComplete, 400);
      } else {
        el.classList.add("animate-pulse");
        setTimeout(() => el.classList.remove("animate-pulse"), 300);
      }
    });
    defs.appendChild(el);
  });
}

function hint() {
  hintsUsed++;
  const left = vocabulary.filter((v) => !matches.has(v.term));
  if (!left.length) return;
  const pick = left[Math.floor(Math.random() * left.length)].term;
  const t = document.querySelector(`[data-term="${pick}"]`);
  const d = document.querySelector(`[data-term="${pick}"].drop-zone`);
  [t, d].forEach((el) => el && el.classList.add("ring-4", "ring-blue-400"));
  setTimeout(
    () =>
      [t, d].forEach(
        (el) => el && el.classList.remove("ring-4", "ring-blue-400")
      ),
    1500
  );
}

function resetVocab() {
  initVocab();
}

function celebrate(target) {
  const rect = target.getBoundingClientRect();
  const layer = $("celebration");
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.style.cssText = `position:absolute;width:12px;height:12px;border-radius:2px;left:${
      rect.left + rect.width / 2
    }px;top:${rect.top + rect.height / 2}px;`;
    p.style.background = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
    ][Math.floor(Math.random() * 5)];
    p.animate(
      [
        { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${
            (Math.random() - 0.5) * 160
          }px, -120px) rotate(360deg)`,
          opacity: 0,
        },
      ],
      { duration: 900, easing: "ease-out", fill: "forwards" }
    );
    layer.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

function gameComplete() {
  const layer = $("celebration");
  layer.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Отлично!</h2>
        <p class="text-gray-600 mb-4">Все термины сопоставлены.</p>
        <p class="text-sm text-gray-500">Подсказок использовано: ${hintsUsed}</p>
        <button id="againBtn" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg">Играть снова</button>
      </div>
    </div>`;
  layer.classList.remove("pointer-events-none");
  $("againBtn").onclick = () => {
    layer.innerHTML = "";
    layer.classList.add("pointer-events-none");
    resetVocab();
  };
  setTimeout(() => {
    layer.innerHTML = "";
    layer.classList.add("pointer-events-none");
  }, 5000);
}

/* ===== УМНОЖЕНИЕ ===== */
function newMathProblem() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  currentProblem = { num1: a, num2: b };
  currentAnswer = a * b;
  $("mathProblem").textContent = `${a} × ${b} = ?`;
  $("mathFeedback").textContent = "";
  const opts = new Set([currentAnswer]);
  while (opts.size < 4) {
    const v = currentAnswer + (Math.floor(Math.random() * 21) - 10);
    if (v > 0) opts.add(v);
  }
  const container = $("answerOptions");
  container.innerHTML = "";
  shuffle([...opts]).forEach((v) => {
    const btn = document.createElement("button");
    btn.className =
      "bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-2xl transition";
    btn.textContent = v;
    btn.onclick = () => checkMath(v, btn);
    container.appendChild(btn);
  });
}

function checkMath(v, btn) {
  const feedback = $("mathFeedback");
  [...document.querySelectorAll("#answerOptions button")].forEach((b) => {
    b.disabled = true;
    b.classList.add("opacity-60");
  });
  if (v === currentAnswer) {
    mathScore++;
    $("mathScore").textContent = mathScore;
    feedback.textContent = "🎉 Правильно!";
    feedback.className = "text-2xl font-bold mb-4 h-8 text-green-400";
    btn.classList.replace("bg-blue-500", "bg-green-500");
    setTimeout(newMathProblem, 1200);
  } else {
    mathWrong++;
    $("mathWrong").textContent = mathWrong;
    feedback.textContent = `❌ Неправильно! Ответ: ${currentAnswer}`;
    feedback.className = "text-2xl font-bold mb-4 h-8 text-red-400";
    btn.classList.replace("bg-blue-500", "bg-red-500");
    setTimeout(newMathProblem, 1800);
  }
}

/* ===== УРАВНЕНИЯ ===== */
function newEquation() {
  const a = Math.floor(Math.random() * 19) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const forms = ["x + a = b", "a + x = b"];
  const pick = forms[Math.floor(Math.random() * forms.length)];
  let x, formula;
  if (pick === "x + a = b") {
    x = Math.max(1, b - a);
    formula = `x + ${a} = ${b}`;
  } else {
    x = Math.max(1, b - a);
    formula = `${a} + x = ${b}`;
  }
  currentEquation = { a, b, x, formula };
  $("equationProblem").textContent = formula;
  $("equationInput").value = "";
  $("equationFeedback").textContent = "";
  $("equationInput").focus();
}
function checkEquation() {
  const val = parseInt($("equationInput").value, 10);
  const fb = $("equationFeedback");
  if (Number.isNaN(val)) {
    fb.textContent = "⚠️ Введите число";
    fb.className = "text-2xl font-bold mb-4 h-8 text-yellow-400";
    return;
  }
  if (val === currentEquation.x) {
    equationScore++;
    $("equationScore").textContent = equationScore;
    fb.textContent = "🎉 Правильно!";
    fb.className = "text-2xl font-bold mb-4 h-8 text-green-400";
    setTimeout(newEquation, 1200);
  } else {
    equationWrong++;
    $("equationWrong").textContent = equationWrong;
    fb.textContent = `❌ Неправильно! x = ${currentEquation.x}`;
    fb.className = "text-2xl font-bold mb-4 h-8 text-red-400";
    setTimeout(newEquation, 1800);
  }
}

/* ===== ВЫЧИСЛЕНИЯ ===== */
function newCalc() {
  let a, b, c, expr, ans;
  do {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 9) + 2;
    c = Math.floor(Math.random() * 9) + 2;
    const ops = ["a + b × c", "a × b + c", "a × b - c"];
    const pick = ops[Math.floor(Math.random() * ops.length)];
    if (pick === "a + b × c") {
      expr = `${a} + ${b} × ${c}`;
      ans = a + b * c;
    } else if (pick === "a × b + c") {
      expr = `${a} × ${b} + ${c}`;
      ans = a * b + c;
    } else {
      expr = `${a} × ${b} - ${c}`;
      ans = a * b - c;
    }
  } while (ans <= 0);
  currentCalc = { expression: expr, answer: ans };
  $("calcProblem").textContent = `${expr} = ?`;
  $("calcInput").value = "";
  $("calcFeedback").textContent = "";
  $("calcInput").focus();
}
function checkCalc() {
  const val = parseInt($("calcInput").value, 10);
  const fb = $("calcFeedback");
  if (Number.isNaN(val)) {
    fb.textContent = "⚠️ Введите число";
    fb.className = "text-2xl font-bold mb-4 h-8 text-yellow-400";
    return;
  }
  if (val === currentCalc.answer) {
    calcScore++;
    $("calcScore").textContent = calcScore;
    fb.textContent = "🎉 Правильно!";
    fb.className = "text-2xl font-bold mb-4 h-8 text-green-400";
    setTimeout(newCalc, 1200);
  } else {
    calcWrong++;
    $("calcWrong").textContent = calcWrong;
    fb.textContent = `❌ Неправильно! Ответ: ${currentCalc.answer}`;
    fb.className = "text-2xl font-bold mb-4 h-8 text-red-400";
    setTimeout(newCalc, 1800);
  }
}

/* ===== СРАВНЕНИЯ ===== */
function newCompare() {
  const a = Math.floor(Math.random() * 99) + 1;
  const b = Math.floor(Math.random() * 99) + 1;
  currentCmp = { a, b };
  $("cmpProblem").textContent = `${a} ? ${b}`;
  $("cmpFeedback").textContent = "";
}
function checkCompare(sign) {
  let correct;
  if (currentCmp.a < currentCmp.b) correct = "<";
  else if (currentCmp.a > currentCmp.b) correct = ">";
  else correct = "=";

  const fb = $("cmpFeedback");
  if (sign === correct) {
    cmpScore++;
    $("cmpScore").textContent = cmpScore;
    fb.textContent = "🎉 Верно!";
    fb.className = "text-2xl font-bold h-8 text-green-400";
    setTimeout(newCompare, 900);
  } else {
    cmpWrong++;
    $("cmpWrong").textContent = cmpWrong;
    fb.textContent = `❌ Неверно! Правильно: ${correct}`;
    fb.className = "text-2xl font-bold h-8 text-red-400";
    setTimeout(newCompare, 1200);
  }
}

/* ===== Навигация + события ===== */
$("vocabBtn").onclick = () => {
  showPage("vocabPage");
};
$("mathBtn").onclick = () => {
  showPage("mathPage");
  newMathProblem();
};
$("equaBtn").onclick = () => {
  showPage("equaPage");
  newEquation();
};
$("calcBtn").onclick = () => {
  showPage("calcPage");
  newCalc();
};
$("compareBtn").onclick = () => {
  showPage("comparePage");
  newCompare();
};

// словарь
$("hintBtn").onclick = hint;
$("resetBtn").onclick = resetVocab;

// умножение
$("newProblemBtn").onclick = newMathProblem;

// уравнения
$("newEquationBtn").onclick = newEquation;
$("checkEquationBtn").onclick = checkEquation;
$("equationInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkEquation();
});

// вычисления
$("newCalcBtn").onclick = newCalc;
$("checkCalcBtn").onclick = checkCalc;
$("calcInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkCalc();
});

// сравнения
document.querySelectorAll(".cmpBtn").forEach((btn) => {
  btn.addEventListener("click", () => checkCompare(btn.textContent.trim()));
});

// старт
initVocab();
showPage("vocabPage");
