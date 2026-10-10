// 次世代作業療法テクノロジーラボ JavaScript (js/tech-lab.js)

document.addEventListener('DOMContentLoaded', () => {
  // 1. パーティクル背景キャンバスの初期化
  const canvas = document.getElementById('techCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(50, Math.floor(width / 30));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, '
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 線で繋ぐ
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 点を描画
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.7)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // 2. 3Dプリンター自助具ギャラリーの切り替えインタラクション
  const deviceItems = {
    controller: {
      title: "片手専用 ユニバーサルeスポーツアダプタ",
      category: "3Dプリント自助具 × 趣味の再建",
      desc: "脳卒中や事故で片腕が不自由になった若者が、大好きなFPSや対戦アクションゲームを諦めずに友達と対等に競い合えるよう設計されたカスタムアダプタ。親指・手のひら・膝などの複合入力で、通常の両手コントローラー操作を完全に代替します。",
      materials: "PLA / PETG (耐衝撃・軽量樹脂)",
      printTime: "約3時間40分",
      cost: "材料費 約180円（既製品専用コントローラーなら数万円）",
      patientStory: "「もう二度と友達とオンラインで遊べないと思っていた。この道具のおかげで、またボイスチャットで大笑いしながらゲームができるようになりました！」"
    },
    spoon: {
      title: "パーソナライズド・エルゴノミック スプーングリップ",
      category: "3Dプリント自助具 × 生活の自立",
      desc: "リウマチや指の拘縮（関節が固まる症状）がある患者さんの手の開き具合・握力に合わせて3Dスキャンし、ミリ単位で角度と厚みを最適化したスプーンハンドル。手首をひねる動作が苦手でも、自然に口元へ食べ物を運べます。",
      materials: "抗菌食品グレード樹脂 (Food-Safe PLA)",
      printTime: "約1時間50分",
      cost: "材料費 約65円",
      patientStory: "「人に食べさせてもらうしかなかった私が、自分の手で大好きなカレーを最後の一口まで食べられた。その瞬間、涙が止まりませんでした。」"
    },
    splint: {
      title: "パラメトリック通気性 手首装具（スプリント）",
      category: "3Dプリント医療装具 × 快適性の革新",
      desc: "従来の石膏ギプスや熱可塑性プラスチック装具は『蒸れる・重い・服が着にくい』という課題がありました。幾何学的なボロノイ格子（Voronoi Mesh）構造で設計することで、従来の30%の軽さと抜群の通気性・水洗いを両立した次世代スプリント。",
      materials: "高弾性TPU / Carbon-PETG",
      printTime: "約4時間20分",
      cost: "材料費 約350円",
      patientStory: "「つけたままお風呂にも入れるし、見た目がサイバーでカッコいい！友達から『それどこで買ったの？』と羨ましがられました。」"
    },
    opener: {
      title: "マルチてこ式 ボトル＆パウチオープナー",
      category: "3Dプリント自助具 × キッチン支援",
      desc: "握力が弱い高齢者や片麻痺の方が、ペットボトルのキャップ、缶詰のプルタブ、レトルトパウチの開封まで、最小限の力でこなせるユニバーサルデザインオープナー。冷蔵庫にマグネットで固定可能。",
      materials: "高強度ABS樹脂",
      printTime: "約1時間15分",
      cost: "材料費 約45円",
      patientStory: "「家族に『開けて』と頼むのが申し訳なかったけれど、これがあれば自分ひとりで好きな時に水分補給ができます。」"
    }
  };

  const deviceButtons = document.querySelectorAll('.device-tab-btn');
  const devTitle = document.getElementById('devTitle');
  const devCategory = document.getElementById('devCategory');
  const devDesc = document.getElementById('devDesc');
  const devMaterials = document.getElementById('devMaterials');
  const devPrintTime = document.getElementById('devPrintTime');
  const devCost = document.getElementById('devCost');
  const devStory = document.getElementById('devStory');

  deviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.device;
      const data = deviceItems[key];
      if (!data) return;

      deviceButtons.forEach(b => {
        b.classList.remove('border-cyan-400', 'bg-cyan-500/20', 'text-cyan-300');
        b.classList.add('border-slate-800', 'bg-slate-900/60', 'text-slate-400');
      });
      btn.classList.add('border-cyan-400', 'bg-cyan-500/20', 'text-cyan-300');
      btn.classList.remove('border-slate-800', 'bg-slate-900/60', 'text-slate-400');

      if (devTitle) devTitle.textContent = data.title;
      if (devCategory) devCategory.textContent = data.category;
      if (devDesc) devDesc.textContent = data.desc;
      if (devMaterials) devMaterials.textContent = data.materials;
      if (devPrintTime) devPrintTime.textContent = data.printTime;
      if (devCost) devCost.textContent = data.cost;
      if (devStory) devStory.textContent = data.patientStory;
    });
  });

  // 3. 【体験型】未来のOTアイデア・インキュベーター（シミュレーター）
  const generateIdeaBtn = document.getElementById('generateIdeaBtn');
  const ideaNeedsSelect = document.getElementById('ideaNeeds');
  const ideaTechSelect = document.getElementById('ideaTech');
  const ideaResultCard = document.getElementById('ideaResultCard');
  const ideaOutputTitle = document.getElementById('ideaOutputTitle');
  const ideaOutputRole = document.getElementById('ideaOutputRole');
  const ideaOutputDesc = document.getElementById('ideaOutputDesc');
  const ideaOutputTechTag = document.getElementById('ideaOutputTechTag');
  const ideaOutputOtRole = document.getElementById('ideaOutputOtRole');

  const ideaDatabase = {
    "game_3d": {
      title: "パーソナル・キネティック コントローラー",
      tech: "3Dプリンター × 生体力学",
      role: "「友達と肩を並べてオンライン対戦で勝ちたい！」を諦めない",
      desc: "患者さんの残存筋力（わずかに動く親指や顎、足先）に合わせてCADで骨格をモデリング。指1本の微小なストロークでトリガーを引けるメカニカルリンク機構を即日3Dプリントして組み上げます。",
      otRole: "ただの工作員ではなく、『どの関節角度なら疲れずに長時間ゲームを楽しめるか』を医学的解剖学に基づいて設計するのが作業療法士のプロたる所以です。"
    },
    "game_ai": {
      title: "AIスマート感度適応型 アシストインターフェース",
      tech: "AI動作予測 × 神経インターフェース",
      role: "麻痺による手先の震え（不随意運動）をAIが自動フィルタリング",
      desc: "患者さんの手の震え（トレマー）の周波数をAIが学習し、意図した入力だけを抽出してゲーム操作に変換。リハビリの進捗に合わせてアシスト量を徐々に減らすことで、自立的な手先制御の回復を促します。",
      otRole: "AIのアルゴリズム調整と患者のモチベーション（楽しさの維持）を両立させるリハビリ計画をOTが監修します。"
    },
    "cook_3d": {
      title: "片手調理専用 モジュラーカッティングステーション",
      tech: "3Dプリンター × 磁力固定モジュール",
      role: "片麻痺でも安全に野菜の皮むき・千切りができる特製キッチンツール",
      desc: "まな板の上に食材をワンタッチで挟み込める3Dプリント製クランプや、ピーラーを固定して食材をこすりつけるだけで皮が剥けるアタッチメントを設計。水洗い可能で食洗機対応素材を使用。",
      otRole: "退院前に実際の自宅キッチン寸法を計測し、キッチンの導線設計と道具のカスタマイズをワンストップでプロデュースします。"
    },
    "cook_vr": {
      title: "VRスマートキッチン・セーフトレーニング",
      tech: "VR仮想空間 × 認知リハビリテーション",
      role: "火や包丁を使わずに『料理の手順』と『危険予測』を安全に特訓",
      desc: "高次脳機能障害（注意障害や遂行機能障害）で火の消し忘れなどが心配な患者さんが、VRヘッドセット内でバーチャルに煮物や炒め物を調理。マルチタスク処理能力を安全に測定・訓練します。",
      otRole: "バーチャル訓練の達成度と、実際のリアルキッチンでの安全確認テストを連動させ、自信を持って台所に立てるよう導きます。"
    },
    "music_3d": {
      title: "バイオニック・ピックホルダー＆カスタム弦押さえ具",
      tech: "3Dプリンター × エルゴノミクス",
      role: "指先の感覚が麻痺したギタリストが、再びコードを押さえられる道具",
      desc: "指の屈曲角度に合わせて指サック型スプリントを造形。ピックを落とさずに手首のストロークだけで弦を弾ける特殊グリップを共同開発。",
      otRole: "「音楽は命そのもの」と語る患者さんの情熱を最優先にし、医学の力で生きがいを復権させるクリエイティブな作業療法です。"
    },
    "music_bmi": {
      title: "ニューロ・バイオニック 楽器演奏アシストハンド",
      tech: "ブレイン・マシン・インターフェース (BMI) × 筋電外骨格",
      role: "「指を動かしたい」という脳の運動指令を読み取り、ロボット指がアシスト",
      desc: "皮膚表面から微弱な筋電位・脳波をキャッチし、0.01秒で外骨格ロボットが連動。失われた指の素早い動きを補助し、大好きな鍵盤や弦楽器の演奏を実現します。",
      otRole: "ロボット技術と人間の神経回路の再結合（神経可塑性）を促すための専門トレーニングを組み立てます。"
    },
    "outing_vr": {
      title: "メタバース・シティストリート外出シミュレーター",
      tech: "VR / メタバース × 不安階層化療法",
      role: "パニック障害やうつ病で電車に乗れない若者のための段階的脱感作",
      desc: "駅の改札、混雑した満員電車、カフェでの注文などをVR空間で段階的に体験。心拍数や発汗センサーをモニタリングしながら、不安を感じないレベルから少しずつ慣らしていきます。",
      otRole: "精神障害領域の専門知識を活かし、患者さんのペースに合わせて不安を解消する『心のリハビリ』を展開します。"
    },
    "outing_iot": {
      title: "スマートシティ連携 自律走行型モビリティナビ",
      tech: "IoTスマート環境 × 視線入力センサー",
      role: "重度四肢麻痺でも、視線と音声だけで街へ自由に飛び出せる社会へ",
      desc: "電動車椅子にLiDARセンサーとスマートホーム連携モジュールを搭載。視線の動きだけで交差点の安全確認やエレベーター呼び出し、店舗の自動ドアを遠隔操作。",
      otRole: "地域のバリアフリー環境を調査し、行政や店舗と連携しながら『障害があっても自由に外出できる街』をデザインします。"
    }
  };

  if (generateIdeaBtn) {
    generateIdeaBtn.addEventListener('click', () => {
      const need = ideaNeedsSelect ? ideaNeedsSelect.value : 'game';
      const tech = ideaTechSelect ? ideaTechSelect.value : '3d';
      const comboKey = `${need}_${tech}`;

      // デフォルトフォールバック
      const idea = ideaDatabase[comboKey] || {
        title: "パーソナル・アダプティブ テクノロジーソリューション",
        tech: "次世代デジタル支援 × 生体力学",
        role: "患者さんの「やってみたい！」を最新技術でオーダーメイド具現化",
        desc: "選んだテクノロジーを駆使して、患者さんの生活空間と身体能力を最適化。既製品では絶対に届かない『あなただけの解決策』を創り出します。",
        otRole: "テクノロジーをただ使うのではなく、患者さんの心に寄り添い、本当に必要な生活のカタチを導き出すのが作業療法士の使命です。"
      };

      if (ideaOutputTitle) ideaOutputTitle.textContent = idea.title;
      if (ideaOutputTechTag) ideaOutputTechTag.textContent = idea.tech;
      if (ideaOutputRole) ideaOutputRole.textContent = idea.role;
      if (ideaOutputDesc) ideaOutputDesc.textContent = idea.desc;
      if (ideaOutputOtRole) ideaOutputOtRole.textContent = idea.otRole;

      if (ideaResultCard) {
        ideaResultCard.classList.remove('hidden');
        ideaResultCard.classList.add('animate-fadeIn');
        ideaResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 4. AIモーション解析シミュレーターの簡易アニメーション
  const aiSimulateBtn = document.getElementById('aiSimulateBtn');
  const aiAnalysisStatus = document.getElementById('aiAnalysisStatus');
  const aiJointAngle = document.getElementById('aiJointAngle');
  const aiProgressRate = document.getElementById('aiProgressRate');
  const aiTargetAngle = document.getElementById('aiTargetAngle');

  if (aiSimulateBtn) {
    let simulating = false;
    aiSimulateBtn.addEventListener('click', () => {
      if (simulating) return;
      simulating = true;
      aiSimulateBtn.textContent = "AI骨格追跡中...";
      aiSimulateBtn.classList.add('opacity-75');

      let currentAngle = 42;
      let progress = 68;
      const interval = setInterval(() => {
        currentAngle += (Math.random() * 4 - 1.5);
        currentAngle = Math.min(85, Math.max(30, currentAngle));
        if (aiJointAngle) aiJointAngle.textContent = `${Math.round(currentAngle)}°`;
        if (aiProgressRate) aiProgressRate.textContent = `${Math.min(100, Math.round(progress += 2))}%`;
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        simulating = false;
        aiSimulateBtn.textContent = "解析完了：再測定する";
        aiSimulateBtn.classList.remove('opacity-75');
        if (aiAnalysisStatus) {
          aiAnalysisStatus.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>解析完了：指先屈曲角 +18% 向上！神経回復スコア良好`;
        }
      }, 2500);
    });
  }

  // Lucide アイコン初期化
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
