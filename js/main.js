// メインJavaScriptファイル: 作業療法士魅力ポータル
document.addEventListener('DOMContentLoaded', () => {
  // 1. モバイルナビゲーション
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. ナビゲーションのスクロールエフェクト
  const navbar = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-md', 'bg-white/95');
      navbar.classList.remove('bg-white/80');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('bg-white/80');
    }
  });

  // 3. リハビリ3職種比較レーダーチャート（Chart.js）
  const ctx = document.getElementById('rehabRadarChart');
  if (ctx && typeof Chart !== 'undefined') {
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          '身体機能・歩行 (Body)',
          '生活応用・手先 (Life/Hand)',
          'こころ・精神ケア (Mind)',
          'ものづくり・環境調整 (Tools/Tech)',
          '会話・ことば (Speech)',
          '食事・嚥下 (Swallow)'
        ],
        datasets: [
          {
            label: '作業療法士 (OT)',
            data: [60, 100, 95, 95, 60, 70],
            backgroundColor: 'rgba(13, 148, 136, 0.25)',
            borderColor: '#0d9488',
            borderWidth: 3,
            pointBackgroundColor: '#0d9488',
            pointRadius: 4,
          },
          {
            label: '理学療法士 (PT)',
            data: [100, 70, 40, 65, 20, 20],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 3,
          },
          {
            label: '言語聴覚士 (ST)',
            data: [25, 30, 85, 40, 100, 100],
            backgroundColor: 'rgba(234, 88, 12, 0.2)',
            borderColor: '#ea580c',
            borderWidth: 2,
            pointBackgroundColor: '#ea580c',
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(0, 0, 0, 0.08)' },
            grid: { color: 'rgba(0, 0, 0, 0.08)' },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              display: false
            },
            pointLabels: {
              font: {
                family: "'Noto Sans JP', sans-serif",
                size: 11,
                weight: '600'
              },
              color: '#334155'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 14,
              font: {
                family: "'Noto Sans JP', sans-serif",
                size: 12,
                weight: 'bold'
              },
              padding: 16
            }
          }
        }
      }
    });
  }

  // 4. シチュエーション別アプローチの切り替え
  const caseButtons = document.querySelectorAll('.case-tab-btn');
  const casePanels = document.querySelectorAll('.case-panel');

  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCase = btn.dataset.case;
      caseButtons.forEach(b => {
        b.classList.remove('bg-teal-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      });
      btn.classList.add('bg-teal-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');

      casePanels.forEach(panel => {
        if (panel.id === `case-${targetCase}`) {
          panel.classList.remove('hidden');
          panel.classList.add('animate-fadeIn');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // 5. 適職診断シミュレーター
  const diagnosticForm = document.getElementById('diagnosticForm');
  const diagResultModal = document.getElementById('diagResult');
  const diagScoreOT = document.getElementById('diagScoreOT');
  const diagScorePT = document.getElementById('diagScorePT');
  const diagScoreST = document.getElementById('diagScoreST');
  const diagTitle = document.getElementById('diagTitle');
  const diagDesc = document.getElementById('diagDesc');
  const diagOtMatchBar = document.getElementById('diagOtMatchBar');
  const diagPtMatchBar = document.getElementById('diagPtMatchBar');
  const diagStMatchBar = document.getElementById('diagStMatchBar');
  const closeDiagModal = document.getElementById('closeDiagModal');

  if (diagnosticForm) {
    diagnosticForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(diagnosticForm);
      let otPoints = 0;
      let ptPoints = 0;
      let stPoints = 0;

      for (let [key, val] of formData.entries()) {
        if (val === 'ot') {
          otPoints += 22;
        } else if (val === 'pt') {
          ptPoints += 22;
        } else if (val === 'st') {
          stPoints += 22;
        } else if (val === 'ot_pt') {
          otPoints += 15;
          ptPoints += 15;
        } else if (val === 'ot_st') {
          otPoints += 15;
          stPoints += 15;
        }
      }

      // ベースポイントとスケーリング（0〜100%の自然なグラデーション）
      otPoints = Math.min(100, Math.max(35, otPoints + 15));
      ptPoints = Math.min(100, Math.max(30, ptPoints + 12));
      stPoints = Math.min(100, Math.max(25, stPoints + 10));

      // パーセンテージ数値とプログレスバーの幅を完全一致させる
      if (diagScoreOT) diagScoreOT.textContent = `${otPoints}%`;
      if (diagScorePT) diagScorePT.textContent = `${ptPoints}%`;
      if (diagScoreST) diagScoreST.textContent = `${stPoints}%`;

      if (diagOtMatchBar) diagOtMatchBar.style.width = `${otPoints}%`;
      if (diagPtMatchBar) diagPtMatchBar.style.width = `${ptPoints}%`;
      if (diagStMatchBar) diagStMatchBar.style.width = `${stPoints}%`;

      if (diagTitle && diagDesc) {
        if (otPoints >= ptPoints && otPoints >= stPoints) {
          diagTitle.innerHTML = `<span class="text-teal-600">作業療法士 (OT)</span> に超ぴったり！✨`;
          diagDesc.textContent = `あなたは「人の心に寄り添うこと」や「工夫やアイデアで生活を面白くすること」「人と環境と作業をつなぐ支援」に強い適性があります！患者さん一人ひとりの『人生や生きがい』を再設計するOTは、あなたのクリエイティビティと共感力を最大限に活かせる最高の天職です。`;
        } else if (ptPoints > otPoints && ptPoints >= stPoints) {
          diagTitle.innerHTML = `<span class="text-blue-600">理学療法士 (PT)</span> ＆ 作業療法士の素質アリ！🏃‍♂️`;
          diagDesc.textContent = `運動やスポーツ、身体の力強いメカニズムに興味があるあなた。立ち上がりや歩行を支えるPTはもちろん、手先の運動やスポーツ・職場復帰をサポートするOT（作業療法士）も非常にマッチします！身体を動かす面白さと生活の工夫を両立できる医療職を探求してみましょう。`;
        } else {
          diagTitle.innerHTML = `<span class="text-amber-600">言語聴覚士 (ST)</span> ＆ 作業療法士の素質アリ！🗣️`;
          diagDesc.textContent = `言葉のコミュニケーションや心理、きめ細やかな対話に強みがあるあなた。話す・聴く・食べるを支えるST、そして心と生活リズムを整える精神科領域や就労支援領域のOT（作業療法士）にも非常に強い素質があります！`;
        }
      }

      if (diagResultModal) {
        diagResultModal.classList.remove('hidden');
        diagResultModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // もう一度診断するボタンクリック時：Q1へ画面遷移＆リセット
  if (closeDiagModal && diagResultModal) {
    closeDiagModal.addEventListener('click', () => {
      // フォーム入力をリセット
      if (diagnosticForm) {
        diagnosticForm.reset();
      }
      // 結果モーダルを非表示
      diagResultModal.classList.add('hidden');

      // Q1へスムーズスクロール
      const q1Element = document.getElementById('diagQ1');
      if (q1Element) {
        q1Element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 最初のラジオボタンにフォーカス
        const firstRadio = q1Element.querySelector('input[type="radio"]');
        if (firstRadio) {
          firstRadio.focus();
        }
      } else if (diagnosticForm) {
        diagnosticForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // 6. Lucide アイコン初期化
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
