import { useState, useRef, useEffect } from "react";

const PROJECT_CONTEXT = `東京証券取引所（TSE）全銘柄対象 深層学習株式取引最適化システム
モデル: TFT（Temporal Fusion Transformer）マルチタスク出力構造
取引戦略: 4択（買→売 / 買→保持 / 売→保持 / 売→買）
特徴量: テクニカル10 + ファンダメンタル5 + 市場構造5 = 計20個
統計フレームワーク: 3σ閾値 + Rolling Z-score + クロスセクション標準化
評価指標: RECALL ≥ 90% | Focal Loss γ=2 | F-β β=2
フェーズ構成: Phase 1（基盤）→ Phase 2（TFT実装）→ Phase 3（最適化）→ Phase 4（デプロイ）`;

const AGENTS = [
  {
    id: "julius",
    name: "Julius",
    role: "データサイエンティスト",
    specialty: "統計分析・特徴量エンジニアリング",
    color: "#14b8a6",
    dim: "#0a2825",
    badge: "Data Analytics",
    systemPrompt: `あなたはJulius AIを活用するデータサイエンティストです。深層学習株式取引最適化プロジェクトチームの統計・特徴量エンジニアリング担当。\n\nプロジェクト概要:\n${PROJECT_CONTEXT}\n\n専門領域: 3σ閾値・Rolling Z-score・クロスセクション標準化の実装設計、20個の特徴量（テクニカル・ファンダメンタル・市場構造）の品質検証、データリーク防止、外れ値・欠損値処理戦略。\n\n他エージェントの発言を踏まえ、データサイエンスの観点から200字以内で日本語・技術的に回答してください。具体的な数値・手法・実装上の注意点を含めてください。`,
  },
  {
    id: "continue",
    name: "Continue",
    role: "MLエンジニア",
    specialty: "TFTアーキテクチャ・損失関数",
    color: "#a78bfa",
    dim: "#1e1040",
    badge: "Software Dev / OSS",
    systemPrompt: `あなたはContinue（OSS）を活用するMLエンジニアです。深層学習株式取引最適化プロジェクトチームのモデルアーキテクチャ担当。\n\nプロジェクト概要:\n${PROJECT_CONTEXT}\n\n専門領域: TFT（Temporal Fusion Transformer）実装・チューニング、マルチタスク出力ヘッド設計（4クラス分類）、Focal Loss（γ=2）・F-β（β=2）実装、RECALL≥90%達成のための学習戦略、PyTorch Forecasting / PyTorch Lightning活用。\n\n他エージェントの発言を踏まえ、MLエンジニアリングの観点から200字以内で日本語・技術的に回答してください。`,
  },
  {
    id: "replit",
    name: "Replit",
    role: "バックエンドエンジニア",
    specialty: "実装・コードレビュー・CI/CD",
    color: "#fbbf24",
    dim: "#2a1a00",
    badge: "Software Dev",
    systemPrompt: `あなたはReplitを活用するバックエンドエンジニアです。深層学習株式取引最適化プロジェクトチームの実装・品質担当。\n\nプロジェクト概要:\n${PROJECT_CONTEXT}\n\n専門領域: Python実装（FastAPI / Celery）、コードレビュー・テスト設計（pytest）、CI/CDパイプライン（GitHub Actions）、パフォーマンスプロファイリング・メモリ最適化、Dockerコンテナ化。\n\n他エージェントの発言を踏まえ、実装品質・保守性の観点から200字以内で日本語・技術的に回答してください。`,
  },
  {
    id: "n8n",
    name: "n8n",
    role: "パイプラインエンジニア",
    specialty: "ワークフロー自動化・データ基盤",
    color: "#fb923c",
    dim: "#2a0e00",
    badge: "Workflow / OSS",
    systemPrompt: `あなたはn8n（OSS）を活用するパイプラインエンジニアです。深層学習株式取引最適化プロジェクトチームのデータ基盤・自動化担当。\n\nプロジェクト概要:\n${PROJECT_CONTEXT}\n\n専門領域: TSE全銘柄データ収集パイプライン（J-Quants API等）、特徴量計算の自動化ワークフロー、モデル推論パイプライン、TimescaleDB等時系列DBの設計、スケジューリング・監視・アラート体制。\n\n他エージェントの発言を踏まえ、インフラ・パイプラインの観点から200字以内で日本語・技術的に回答してください。`,
  },
  {
    id: "perplexity",
    name: "Perplexity",
    role: "クオンツリサーチャー",
    specialty: "市場調査・金融ドメイン・リスク",
    color: "#38bdf8",
    dim: "#042030",
    badge: "Productivity",
    systemPrompt: `あなたはPerplexityを活用するクオンツリサーチャーです。深層学習株式取引最適化プロジェクトチームの金融ドメイン・調査担当。\n\nプロジェクト概要:\n${PROJECT_CONTEXT}\n\n専門領域: TSE市場構造・取引ルール・流動性特性の知識、株式取引戦略・クオンツ手法の最新研究動向、TFTの金融時系列適用事例調査、マーケットインパクト・スリッページ分析、リスク管理・ドローダウン管理手法。\n\n他エージェントの発言を踏まえ、金融・クオンツの観点から200字以内で日本語・技術的に回答してください。`,
  },
  {
    id: "cline",
    name: "Cline",
    role: "QAエンジニア",
    specialty: "品質保証・バックテスト・リスク",
    color: "#f472b6",
    dim: "#2d0020",
    badge: "Software Dev / OSS",
    systemPrompt: `あなたはCline（OSS）を活用するQAエンジニアです。深層学習株式取引最適化プロジェクトチームの品質保証・リスク管理担当。\n\nプロジェクト概要:\n${PROJECT_CONTEXT}\n\n専門領域: バックテスト設計・ウォークフォワード検証、データリーク・ルックアヘッドバイアス検出、過学習検出・汎化性能評価、本番モデル監視・ドリフト検知、ドローダウン管理・ポジションサイジング。\n\n他エージェントの発言を踏まえ、品質・リスクの観点から潜在問題を指摘し200字以内で日本語・技術的に回答してください。`,
  },
];

const PHASES = [
  {
    id: "plan", label: "PLAN", jp: "計画", color: "#a78bfa",
    defaultTopic: "Phase 1（基盤構築）スプリントの最優先タスクと技術的アプローチを議論してください。データパイプライン設計とTFTアーキテクチャの初期実装方針に焦点を当てます。",
  },
  {
    id: "do", label: "DO", jp: "実行", color: "#14b8a6",
    defaultTopic: "担当フェーズの現在の実装状況・進捗・技術的ブロッカーを共有してください。特徴量エンジニアリングとTFTモデルの学習パイプラインの具体的な実装状況について。",
  },
  {
    id: "check", label: "CHECK", jp: "評価", color: "#fbbf24",
    defaultTopic: "バックテスト結果とモデル評価指標（RECALL≥90%達成状況、4クラス分類のF-βスコア、Precision-Recallバランス）を検証してください。",
  },
  {
    id: "act", label: "ACT", jp: "改善", color: "#fb923c",
    defaultTopic: "評価結果を踏まえ、次イテレーションに向けた具体的な改善策・ハイパーパラメータ調整・アーキテクチャ変更・特徴量追加削除の提案を行ってください。",
  },
];

// 合成価格データ生成関数
const generateSyntheticPriceData = (days = 252) => {
  const data = [];
  let price = 1000; // 初期価格
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5% daily change
    price *= (1 + change);
    data.push({
      date: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: price * (1 + Math.random() * 0.02),
      low: price * (1 - Math.random() * 0.02),
      close: price,
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }
  return data;
};

// 取引シグナル生成（簡易ロジック）
const generateSignals = (data, strategy) => {
  const signals = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i-1];
    const curr = data[i];
    let signal = null;
    if (strategy === 'buy_sell' && curr.close > prev.close * 1.02) signal = 'buy';
    else if (strategy === 'sell_buy' && curr.close < prev.close * 0.98) signal = 'sell';
    else if (strategy === 'hold_buy' && curr.close > prev.close) signal = 'hold_buy';
    else if (strategy === 'hold_sell' && curr.close < prev.close) signal = 'hold_sell';
    if (signal) signals.push({ date: curr.date, signal, price: curr.close });
  }
  return signals;
};

// メトリクス計算（シミュレート）
const calculateMetrics = (iteration) => {
  const baseRecall = 0.85;
  const baseFbeta = 0.75;
  const baseSharpe = 1.2;
  const baseDrawdown = 0.15;
  const baseWinRate = 0.55;
  const improvement = iteration * 0.02; // イテレーションごとに改善
  return {
    recall: Math.min(baseRecall + improvement, 0.95),
    fbeta: Math.min(baseFbeta + improvement, 0.85),
    sharpe: baseSharpe + improvement * 2,
    maxDrawdown: Math.max(baseDrawdown - improvement, 0.05),
    winRate: Math.min(baseWinRate + improvement, 0.75),
  };
};

export default function MultiAgentPDCA() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [topic, setTopic] = useState(PHASES[0].defaultTopic);
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [sprint, setSprint] = useState(1);
  const [autoMode, setAutoMode] = useState(false);
  const [maxSprints, setMaxSprints] = useState(3);
  const [currentSprint, setCurrentSprint] = useState(0);
  const [metrics, setMetrics] = useState(calculateMetrics(0));
  const [priceData, setPriceData] = useState(generateSyntheticPriceData());
  const [signals, setSignals] = useState([]);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, activeIdx]);

  const selectPhase = (i) => {
    setPhaseIdx(i);
    setTopic(PHASES[i].defaultTopic);
  };

  const callAgent = async (agent, prior) => {
    const prevText = prior.length > 0
      ? "\n\nこれまでのチームの発言:\n" + prior.map(m => `[${m.name} / ${m.role}]: ${m.content}`).join("\n\n")
      : "";
    const userContent = `PDCAフェーズ: ${PHASES[phaseIdx].label}（${PHASES[phaseIdx].jp}） | スプリント#${sprint}\n\n議題: ${topic}${prevText}\n\n上記を踏まえ、あなたの専門分野から発言してください。`;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: agent.systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.[0]?.text ?? "（応答を取得できませんでした）";
  };

  const runSingleDiscussion = async () => {
    setRunning(true);
    setMessages([]);
    const collected = [];

    for (let i = 0; i < AGENTS.length; i++) {
      setActiveIdx(i);
      const agent = AGENTS[i];
      try {
        const text = await callAgent(agent, collected);
        const msg = { id: i, name: agent.name, role: agent.role, color: agent.color, dim: agent.dim, content: text };
        collected.push(msg);
        setMessages([...collected]);
      } catch (e) {
        const msg = { id: i, name: agent.name, role: agent.role, color: agent.color, dim: agent.dim, content: `エラー: ${e.message}` };
        collected.push(msg);
        setMessages([...collected]);
      }
    }

    setActiveIdx(-1);
    setRunning(false);
    setSprint((n) => n + 1);
  };

  const runAutoPDCA = async () => {
    setAutoMode(true);
    setCurrentSprint(0);
    setMessages([]);
    setSprint(1);

    for (let sprintNum = 1; sprintNum <= maxSprints; sprintNum++) {
      setCurrentSprint(sprintNum);
      for (let phaseNum = 0; phaseNum < PHASES.length; phaseNum++) {
        setPhaseIdx(phaseNum);
        setTopic(PHASES[phaseNum].defaultTopic);
        await runSingleDiscussion();
        // フェーズ完了後にメトリクス更新（シミュレート）
        if (phaseNum === 2) { // CHECKフェーズ後
          setMetrics(calculateMetrics(sprintNum));
          // シグナル更新（戦略変更をシミュレート）
          const strategies = ['buy_sell', 'sell_buy', 'hold_buy', 'hold_sell'];
          const strategy = strategies[Math.floor(Math.random() * strategies.length)];
          setSignals(generateSignals(priceData, strategy));
        }
      }
    }

    setAutoMode(false);
    setCurrentSprint(0);
  };

  const clearAll = () => {
    if (!running && !autoMode) {
      setMessages([]);
      setSprint(1);
      setMetrics(calculateMetrics(0));
      setSignals([]);
    }
  };

  const phase = PHASES[phaseIdx];

  return (
    <div style={{ background: "#080c16", minHeight: "100vh", padding: "20px", fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace", color: "#c8d4e8" }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #151f30", paddingBottom: 14, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>TFT TRADING OPTIMIZATION SYSTEM // MULTI-AGENT OPERATIONS</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: "#e2e8f0", letterSpacing: "-0.01em" }}>Agent Operations Center</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.1em", marginBottom: 2 }}>SPRINT</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: phase.color }}>#{sprint.toString().padStart(2, "0")}</div>
        </div>
      </div>

      {/* Auto Mode Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button
          onClick={runAutoPDCA}
          disabled={running || autoMode}
          style={{
            flex: 1,
            padding: "11px 16px",
            background: autoMode ? "#0d1424" : "#14b8a6",
            border: `1px solid ${autoMode ? "#151f30" : "#14b8a6"}`,
            borderRadius: 6,
            cursor: autoMode ? "not-allowed" : "pointer",
            color: autoMode ? "#2a4060" : "#ffffff",
            fontSize: 11,
            fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace",
            fontWeight: 600,
            letterSpacing: "0.06em",
            transition: "all 0.15s",
          }}
        >
          {autoMode
            ? `自動PDCA実行中... Sprint ${currentSprint} / ${maxSprints}`
            : `自動PDCA実行 — ${maxSprints}スプリント × 4フェーズ`}
        </button>
        <input
          type="number"
          value={maxSprints}
          onChange={(e) => setMaxSprints(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={autoMode}
          style={{
            width: 60,
            padding: "11px 8px",
            background: "#0d1424",
            border: "1px solid #151f30",
            borderRadius: 6,
            color: "#9db0c8",
            fontSize: 11,
            fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace",
            textAlign: "center",
          }}
        />
      </div>

      {/* Metrics Dashboard */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.14em", marginBottom: 6 }}>MODEL METRICS // モデル評価指標</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} style={{ background: "#0d1424", border: "1px solid #151f30", borderRadius: 6, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.08em", marginBottom: 4 }}>{key.toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: value >= 0.9 ? "#14b8a6" : value >= 0.7 ? "#fbbf24" : "#f472b6" }}>
                {typeof value === 'number' ? (key === 'maxDrawdown' ? `${(value * 100).toFixed(1)}%` : value.toFixed(3)) : value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Simulation Chart */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.14em", marginBottom: 6 }}>TRADING SIMULATION // 取引シミュレーション</div>
        <div style={{ background: "#0d1424", border: "1px solid #151f30", borderRadius: 6, padding: "10px", height: 200, overflow: "hidden" }}>
          <svg width="100%" height="180" viewBox="0 0 800 180">
            {priceData.slice(-100).map((d, i) => {
              const x = (i / 99) * 800;
              const y = 180 - ((d.close - 800) / 400) * 180; // 簡易スケーリング
              return <circle key={i} cx={x} cy={y} r="1" fill="#38bdf8" />;
            })}
            {signals.slice(-20).map((s, i) => {
              const dataIndex = priceData.findIndex(d => d.date === s.date);
              if (dataIndex === -1) return null;
              const x = ((dataIndex - (priceData.length - 100)) / 99) * 800;
              const y = 180 - ((s.price - 800) / 400) * 180;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="3" fill={s.signal.includes('buy') ? "#14b8a6" : "#f472b6"} />
                  <text x={x + 5} y={y - 5} fontSize="8" fill="#c8d4e8">{s.signal}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* PDCA tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 18 }}>
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => selectPhase(i)}
            style={{
              padding: "10px 6px",
              background: phaseIdx === i ? p.color + "18" : "transparent",
              border: `1px solid ${phaseIdx === i ? p.color : "#151f30"}`,
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: phaseIdx === i ? p.color : "#3a5070", letterSpacing: "0.08em" }}>{p.label}</div>
            <div style={{ fontSize: 9, color: phaseIdx === i ? p.color + "aa" : "#1a2a40", marginTop: 3, letterSpacing: "0.06em" }}>{p.jp}</div>
          </button>
        ))}
      </div>

      {/* Agent roster */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7, marginBottom: 18 }}>
        {AGENTS.map((ag, i) => {
          const isActive = activeIdx === i;
          const isDone = messages.some((m) => m.name === ag.name);
          const lit = isActive || isDone;
          return (
            <div
              key={ag.id}
              style={{
                background: isActive ? ag.dim : "#0d1424",
                border: `1px solid ${lit ? ag.color + (isActive ? "cc" : "55") : "#111c2e"}`,
                borderRadius: 8,
                padding: "10px 11px",
                transition: "all 0.25s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <div
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: lit ? ag.color : "#1a2a40",
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 7px ${ag.color}` : "none",
                    transition: "all 0.25s",
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: lit ? ag.color : "#2a3a55", letterSpacing: "0.04em" }}>
                  {ag.name}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 8, padding: "2px 5px", borderRadius: 3, background: "#0a1820", color: "#1a5a40", border: "1px solid #0a2a18", whiteSpace: "nowrap" }}>
                  FREE
                </span>
              </div>
              <div style={{ fontSize: 10, color: isActive ? ag.color + "99" : "#2a3a55", marginBottom: 2 }}>{ag.role}</div>
              <div style={{ fontSize: 9, color: "#152030", lineHeight: 1.4 }}>{ag.specialty}</div>
              <div style={{ fontSize: 8, color: "#0a1830", marginTop: 3 }}>{ag.badge}</div>
            </div>
          );
        })}
      </div>

      {/* Agenda */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.14em" }}>AGENDA // 議題</div>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={running || autoMode}
          rows={3}
          style={{
            width: "100%",
            background: "#0d1424",
            border: "1px solid #151f30",
            borderRadius: 6,
            color: "#9db0c8",
            fontSize: 11,
            fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace",
            padding: "10px 12px",
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: 1.7,
            outline: "none",
          }}
        />
      </div>

      {/* Run / Clear buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={runSingleDiscussion}
          disabled={running || autoMode}
          style={{
            flex: 1,
            padding: "11px 16px",
            background: running ? "#0d1424" : phase.color + "18",
            border: `1px solid ${running ? "#151f30" : phase.color}`,
            borderRadius: 6,
            cursor: running ? "not-allowed" : "pointer",
            color: running ? "#2a4060" : phase.color,
            fontSize: 11,
            fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace",
            fontWeight: 600,
            letterSpacing: "0.06em",
            transition: "all 0.15s",
          }}
        >
          {running
            ? `▶  ディスカッション中... [${activeIdx + 1} / ${AGENTS.length}]`
            : `▶  ディスカッション開始  —  Sprint #${sprint}  [${phase.label}]`}
        </button>
        <button
          onClick={clearAll}
          disabled={running || autoMode}
          style={{
            padding: "11px 14px",
            background: "transparent",
            border: "1px solid #151f30",
            borderRadius: 6,
            cursor: running ? "not-allowed" : "pointer",
            color: "#2a4060",
            fontSize: 11,
            fontFamily: "'SF Mono','Menlo','Consolas','Courier New',monospace",
          }}
        >
          ✕ CLR
        </button>
      </div>

      {/* Discussion thread */}
      {(messages.length > 0 || running || autoMode) && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: "#2a4060", letterSpacing: "0.14em" }}>DISCUSSION THREAD // {phase.label} フェーズ</div>
            <div style={{ fontSize: 9, color: "#151f30" }}>{messages.length} / {AGENTS.length}</div>
          </div>
          <div
            ref={threadRef}
            style={{
              background: "#0a0f1e",
              border: "1px solid #0f1a2e",
              borderRadius: 8,
              maxHeight: 540,
              overflowY: "auto",
              padding: "16px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: i < messages.length - 1 ? 18 : 0,
                  paddingBottom: i < messages.length - 1 ? 18 : 0,
                  borderBottom: i < messages.length - 1 ? "1px solid #0f1a2e" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: msg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: msg.color, letterSpacing: "0.03em" }}>{msg.name}</span>
                  <span style={{ fontSize: 9, color: "#1e3050" }}>{msg.role}</span>
                  <span style={{ marginLeft: "auto", fontSize: 8, color: "#0f1e30", letterSpacing: "0.06em" }}>
                    [{phase.label}:{i.toString().padStart(2, "0")}]
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#9db8d0",
                    lineHeight: 1.85,
                    paddingLeft: 14,
                    borderLeft: `2px solid ${msg.color}30`,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {running && activeIdx >= 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: messages.length > 0 ? 18 : 0,
                  color: AGENTS[activeIdx]?.color,
                  fontSize: 11,
                }}
              >
                <span style={{ animation: "blink 0.9s step-end infinite", fontSize: 12 }}>▌</span>
                <span>{AGENTS[activeIdx]?.name} が応答を生成中...</span>
              </div>
            )}

            {autoMode && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: messages.length > 0 ? 18 : 0,
                  color: "#fbbf24",
                  fontSize: 11,
                }}
              >
                <span style={{ animation: "blink 0.9s step-end infinite", fontSize: 12 }}>▌</span>
                <span>自動PDCA実行中... Sprint {currentSprint} / {maxSprints} — {PHASES[phaseIdx].label}フェーズ</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complete banner */}
      {messages.length === AGENTS.length && !running && !autoMode && (
        <div
          style={{
            marginTop: 12,
            background: "#040e0a",
            border: "1px solid #0a2a1a",
            borderRadius: 6,
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 9, color: "#1a6a3a", letterSpacing: "0.14em" }}>✓ DISCUSSION COMPLETE</div>
            <div style={{ fontSize: 10, color: "#2a8a50", marginTop: 3 }}>
              Sprint #{sprint - 1} {phase.label}フェーズ完了 — 6エージェント全員が発言しました
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#0a4020", textAlign: "right" }}>
            <div>次: フェーズを変更するか</div>
            <div>議題を更新して再実行</div>
          </div>
        </div>
      )}

      {/* Auto Complete banner */}
      {autoMode === false && currentSprint > 0 && (
        <div
          style={{
            marginTop: 12,
            background: "#0a0e1a",
            border: "1px solid #1a2a40",
            borderRadius: 6,
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 9, color: "#38bdf8", letterSpacing: "0.14em" }}>✓ AUTO PDCA COMPLETE</div>
            <div style={{ fontSize: 10, color: "#5a8af0", marginTop: 3 }}>
              {maxSprints}スプリント完了 — 最適モデル生成済み (RECALL: {(metrics.recall * 100).toFixed(1)}%)
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#1a3040", textAlign: "right" }}>
            <div>モデルメトリクスを確認</div>
            <div>取引シミュレーションを検証</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && !running && !autoMode && (
        <div
          style={{
            border: "1px dashed #0f1a2e",
            borderRadius: 8,
            padding: "32px 20px",
            textAlign: "center",
            color: "#1a2a40",
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 8, color: "#1a3050" }}>◎</div>
          <div style={{ fontSize: 11, letterSpacing: "0.08em" }}>ディスカッション開始ボタンを押すと</div>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", marginTop: 4 }}>6名のAIエージェントが順番に議論を開始します</div>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", marginTop: 8, color: "#2a4060" }}>自動PDCAで最適モデルを生成</div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c16; }
        ::-webkit-scrollbar-thumb { background: #151f30; border-radius: 2px; }
      `}</style>
    </div>
  );
}