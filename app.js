// NEXO Sports — navegação entre telas, gráfico e interações simples (sem build, sem bibliotecas)
(function () {
  'use strict';

  // ---------- Navegação ----------
  var nav = document.getElementById('nav');
  var mobileNav = document.getElementById('mobileNav');

  // Clona os itens da sidebar para a navegação móvel
  if (nav && mobileNav) {
    Array.prototype.forEach.call(nav.querySelectorAll('.nav-item'), function (btn) {
      var clone = btn.cloneNode(true);
      mobileNav.appendChild(clone);
    });
  }

  function show(view) {
    Array.prototype.forEach.call(document.querySelectorAll('.view'), function (s) {
      s.classList.toggle('active', s.id === 'view-' + view);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.nav-item'), function (b) {
      b.classList.toggle('active', b.getAttribute('data-view') === view);
    });
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-view],[data-goto]');
    if (!t) return;
    var v = t.getAttribute('data-view') || t.getAttribute('data-goto');
    if (v) show(v);
  });

  // ---------- Dados reais: série diária nov/2026 ----------
  // [dia, green, red, resultado do dia em unidades]
  var daily = [
    ['04/11', 7, 5, 1.59], ['05/11', 3, 5, -1.81], ['06/11', 3, 7, -4.26],
    ['07/11', 4, 8, -3.72], ['08/11', 6, 5, 1.01], ['09/11', 2, 4, -1.70],
    ['10/11', 3, 3, 0.15], ['11/11', 5, 1, 8.50], ['12/11', 2, 4, -1.60],
    ['13/11', 3, 4, -0.77], ['14/11', 9, 3, 6.92], ['15/11', 5, 3, 1.62],
    ['16/11', 3, 3, 0.23], ['17/11', 2, 3, -0.82], ['18/11', 0, 0, 0.00]
  ];
  var fmt = function (x) {
    return (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace('.', ',') + 'u';
  };

  // Tabela do Histórico + acumulado
  var tbody = document.getElementById('dailyTable');
  var cum = 0;
  if (tbody) {
    daily.forEach(function (d) {
      cum += d[3];
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + d[0] + '</td><td class="green">' + d[1] + '</td><td class="red">' + d[2] + '</td>' +
        '<td class="' + (d[3] > 0 ? 'green' : d[3] < 0 ? 'red' : '') + '">' + fmt(d[3]) + '</td>' +
        '<td><b>' + fmt(Math.round(cum * 100) / 100) + '</b></td>';
      tbody.appendChild(tr);
    });
  }

  // ---------- Gráfico SVG: barras diárias + linha acumulada ----------
  var chart = document.getElementById('chart');
  if (chart) {
    var W = 720, H = 260, padL = 44, padR = 14, padT = 16, padB = 30;
    var iw = W - padL - padR, ih = H - padT - padB;
    var maxV = 9, minV = -5; // faixa do eixo (resultado diário e acumulado cabem aqui)
    var y = function (v) { return padT + (maxV - v) / (maxV - minV) * ih; };
    var step = iw / daily.length;
    var bw = Math.min(26, step * 0.58);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="min-width:560px" xmlns="http://www.w3.org/2000/svg">';
    // grade + eixo zero
    for (var g = minV; g <= maxV; g += 2) {
      svg += '<line x1="' + padL + '" y1="' + y(g) + '" x2="' + (W - padR) + '" y2="' + y(g) + '" stroke="#1c2a44" stroke-width="1"/>' +
        '<text x="' + (padL - 6) + '" y="' + (y(g) + 4) + '" fill="#93a3ba" font-size="10" text-anchor="end">' + (g > 0 ? '+' + g : g) + '</text>';
    }
    svg += '<line x1="' + padL + '" y1="' + y(0) + '" x2="' + (W - padR) + '" y2="' + y(0) + '" stroke="#37507a" stroke-width="1.5"/>';
    // barras
    var cum2 = 0, pts = [];
    daily.forEach(function (d, i) {
      var cx = padL + step * i + step / 2;
      var v = d[3];
      var yTop = y(Math.max(0, v)), yBot = y(Math.min(0, v));
      svg += '<rect x="' + (cx - bw / 2) + '" y="' + yTop + '" width="' + bw + '" height="' + Math.max(2, yBot - yTop) + '" rx="3" fill="' + (v >= 0 ? '#22c55e' : '#ef4444') + '"><title>' + d[0] + ': ' + fmt(v) + '</title></rect>';
      svg += '<text x="' + cx + '" y="' + (H - 10) + '" fill="#93a3ba" font-size="9.5" text-anchor="middle">' + d[0].slice(0, 2) + '</text>';
      cum2 += v;
      pts.push([cx, y(Math.round(cum2 * 100) / 100)]);
    });
    // linha acumulada
    svg += '<polyline fill="none" stroke="#2f7bff" stroke-width="2.5" points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/>';
    pts.forEach(function (p) { svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#2f7bff"/>'; });
    var last = pts[pts.length - 1];
    svg += '<text x="' + Math.min(last[0] + 4, W - 66) + '" y="' + (last[1] - 8) + '" fill="#6ea8ff" font-size="12" font-weight="700">+5,34u</text>';
    svg += '</svg>';
    chart.innerHTML = svg;
  }

  // ---------- Gerador de Odd Alta (matemática demonstrativa) ----------
  // Pernas de demonstração por mercado protetor: [rótulo, odd típica, prob. estimada]
  var pool = {
    seguro: [
      ['Dupla chance 1X', 1.30, 0.77], ['Under 4,5 gols', 1.28, 0.78], ['Handicap +1,5', 1.32, 0.76],
      ['Dupla chance X2', 1.31, 0.76], ['Under 3,5 gols (time forte)', 1.36, 0.75], ['Total por equipe Under 2,5', 1.29, 0.77]
    ],
    equilibrado: [
      ['Dupla chance 1X', 1.42, 0.70], ['Under 3,5 gols', 1.48, 0.68], ['Handicap +1,0', 1.52, 0.66],
      ['BTTS Não (jogo fechado)', 1.55, 0.65], ['Favorito moneyline', 1.60, 0.66], ['Under 5,5 escanteios (equipe)', 1.50, 0.67]
    ],
    arrojado: [
      ['Moneyline favorito fora', 1.75, 0.57], ['Over 2,5 gols', 1.85, 0.56], ['BTTS Sim', 1.80, 0.58],
      ['Handicap −1,0', 1.95, 0.55], ['Spread basquete −3,5', 1.85, 0.57], ['Total basquete Over', 1.90, 0.56]
    ]
  };
  var genBtn = document.getElementById('genBtn');
  if (genBtn) {
    genBtn.addEventListener('click', function () {
      var mode = document.getElementById('genMode').value;
      var target = parseFloat(document.getElementById('genTarget').value);
      var legs = pool[mode].slice();
      var out = document.getElementById('genOut');
      var html = '';
      // 3 opções: quantidades de pernas crescentes a partir do mínimo que atinge o alvo
      var made = 0;
      for (var start = 0; start < legs.length && made < 3; start++) {
        var odd = 1, prob = 1, used = [];
        for (var i = start; i < legs.length && odd < target; i++) {
          odd *= legs[i][1]; prob *= legs[i][2]; used.push(legs[i]);
        }
        if (odd < target) continue;
        made++;
        var ev = prob * odd - 1;
        html += '<div class="gen-card"><h4>Opção ' + made + ' — ' + used.length + ' pernas · Odd total @ ' + odd.toFixed(2) + '</h4>' +
          used.map(function (l) { return '• ' + l[0] + ' @ ' + l[1].toFixed(2) + ' (prob. ' + Math.round(l[2] * 100) + '%)'; }).join('<br>') +
          '<br><b>Probabilidade conjunta: ' + (prob * 100).toFixed(1).replace('.', ',') + '%</b> · EV estimado: ' + (ev >= 0 ? '+' : '') + (ev * 100).toFixed(1).replace('.', ',') + '%' +
          '<br>Stake sugerida: 0,25u a 0,5u · <span class="amber">Chance real de bater: a probabilidade conjunta acima — sem garantia.</span></div>';
      }
      if (!made) {
        html = '<div class="gen-card"><b>Sem combinação responsável para esse alvo neste modo.</b><br>Com pernas deste modo, o alvo ' + target + ' exigiria pernas demais e derrubaria a probabilidade conjunta. Baixe o alvo ou mude o modo — o gerador não força combinação ruim.</div>';
      }
      html += '<p class="note">Pernas de demonstração da estrutura. Na versão com servidor e The Odds API conectada, entram jogos e odds reais do dia, com 1 mercado por jogo.</p>';
      out.innerHTML = html;
    });
  }

  // ---------- Banca ----------
  var bankInput = document.getElementById('bankInput');
  if (bankInput) {
    bankInput.addEventListener('input', function () {
      var b = parseFloat(bankInput.value) || 0;
      var cells = document.querySelectorAll('#bankOut b');
      var money = function (x) { return b > 0 ? 'R$ ' + x.toFixed(2).replace('.', ',') : '—'; };
      if (cells.length === 3) {
        cells[0].textContent = money(b * 0.01);
        cells[1].textContent = money(b * 0.03);
        cells[2].textContent = money(b * 0.005);
      }
    });
  }

  // ---------- Copiar fechamento ----------
  var copyBtn = document.getElementById('copyClosing');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var txt = document.getElementById('closingText').textContent;
      var ok = document.getElementById('copyOk');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { ok.textContent = 'Copiado ✓'; }, function () { ok.textContent = 'Não foi possível copiar automaticamente — selecione o texto.'; });
      } else {
        ok.textContent = 'Selecione o texto acima e copie manualmente.';
      }
    });
  }
})();
