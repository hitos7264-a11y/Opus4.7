/* ================================================================
   data.js — Claude Opus 4.7 関連のデータセット（ベンチ/価格/
   モデルカード/配信チャネルなど）
   ファイル冒頭から底まで、本サイトで使う定量情報の一次ソース。
   数値はすべて spec.txt および sources.txt からの抽出。
   ================================================================ */

window.OPUS47 = (function() {
  "use strict";

  /* --------- モデル基本情報 ---------------------------------- */
  const model = {
    id: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    vendor: "Anthropic",
    series: "Opus 4 系列",
    releasedAt: "2026-04-16",
    releaseDay: "米時間 木曜日",
    docDate: "2026-04-18",
    predecessor: { id: "claude-opus-4-6", name: "Claude Opus 4.6", releasedAt: "2026-02" },
    siblingPreview: { id: "claude-mythos-preview", name: "Claude Mythos Preview", via: "Project Glasswing" },
    position: "Opus 4 系列の成熟を完成させる「絞り込みとセーフガード強化」バージョン",
    contextWindow: 1_000_000,
    maxOutputTokens: 128_000,
    attention: "マルチヘッドアテンション + 絶対位置埋め込み",
    modality: ["text", "vision", "tool-use", "code"],
    imageMaxLongSide: 2576,
    imageMaxMegapixels: 3.75
  };

  /* --------- 価格 -------------------------------------------- */
  const pricing = {
    inputUSDPerMTok: 5,
    outputUSDPerMTok: 25,
    cacheDiscountMax: 0.90,   /* 入力最大90%OFF */
    batchDiscount: 0.50,
    copilotPremiumMultiplier: 7.5, /* 4/30までのプロモ */
    tokenizerInflation: { min: 1.00, typical: 1.17, max: 1.35 },
    platformsSameRate: ["Anthropic API", "Amazon Bedrock", "Google Cloud Vertex AI",
                        "Microsoft Foundry", "Snowflake Cortex AI"],
    note: "ステッカー価格は 4.6/4.5/4.1 と同額。ただし新トークナイザで実請求は静かに上がる。"
  };

  /* --------- ベンチマーク：コーディング/エージェント -------- */
  const benchCoding = [
    { key: "swe-bench-verified", name: "SWE-bench Verified",  opus46: 80.8, opus47: 87.6, unit: "%", higherIsBetter: true, family: "coding" },
    { key: "swe-bench-pro",      name: "SWE-bench Pro",       opus46: 53.4, opus47: 64.3, unit: "%", higherIsBetter: true, family: "coding" },
    { key: "terminal-bench-2",   name: "Terminal-Bench 2.0",  opus46: 65.4, opus47: 69.4, unit: "%", higherIsBetter: true, family: "coding" },
    { key: "osworld-verified",   name: "OSWorld-Verified",    opus46: 72.7, opus47: 78.0, unit: "%", higherIsBetter: true, family: "agent" },
    { key: "mcp-atlas",          name: "MCP-Atlas",           opus46: 75.8, opus47: 77.3, unit: "%", higherIsBetter: true, family: "agent" },
    { key: "cursorbench",        name: "CursorBench",         opus46: 58,   opus47: 70,   unit: "%", higherIsBetter: true, family: "coding" },
    { key: "finance-agent",      name: "Finance Agent v1.1",  opus46: null, opus47: 64.4, unit: "%", higherIsBetter: true, family: "agent",
      competitors: { "GPT-5.4 Pro": 61.5, "Gemini 3.1 Pro": 59.7 } },
    { key: "biglaw-bench",       name: "BigLaw Bench (high)", opus46: null, opus47: 90.9, unit: "%", higherIsBetter: true, family: "knowledge" }
  ];

  /* --------- ベンチマーク：知識労働・科学・ウェブ ---------- */
  const benchKnowledge = [
    { key: "gdpval-aa",          name: "GDPVal-AA (Elo)",     opus46: null, opus47: 1753, unit: "Elo", higherIsBetter: true,
      competitors: { "GPT-5.4": 1674, "Gemini 3.1 Pro": 1314 } },
    { key: "gpqa-diamond",       name: "GPQA Diamond",        opus46: 91.3, opus47: 94.2, unit: "%", higherIsBetter: true,
      competitors: { "GPT-5.4 Pro": 94.4, "Gemini 3.1 Pro": 94.3 } },
    { key: "arxiv-tool",         name: "arXiv 論文推論 (tool)", opus46: 84.7, opus47: 91.0, unit: "%", higherIsBetter: true },
    { key: "browsecomp",         name: "BrowseComp",          opus46: 83.7, opus47: 79.3, unit: "%", higherIsBetter: true,
      competitors: { "GPT-5.4 Pro": 89.3, "Gemini 3.1 Pro": 85.9 } },
    { key: "tgb",                name: "Thematic Generalization (high)", opus46: 80.6, opus47: 72.8, unit: "", higherIsBetter: true },
    { key: "intelligence-idx",   name: "Intelligence Index v4.0 (max)", opus46: null, opus47: 57, unit: "", higherIsBetter: true }
  ];

  /* --------- ビジョン ---------------------------------------- */
  const benchVision = [
    { key: "xbow",               name: "XBOW（社内視覚精度）", opus46: 54.5, opus47: 98.5, unit: "%" },
    { key: "internal-coding93",  name: "社内コーディング93タスク（視覚寄与）", opus46: null, opus47: null, delta: "+13pt", note: "視覚解像度向上単独での押し上げ" }
  ];

  /* --------- 長コンテキスト retrieval ----------------------- */
  const benchLongCtx = [
    { band: "全域 (総合)",           opus46: 91.9, opus47: 59.2 },
    { band: "524k〜1024k tokens",  opus46: 78.3, opus47: 32.2 }
  ];

  /* --------- 安全性 ----------------------------------------- */
  const safety = {
    honestyRate: { opus47: 92, mythos: 95.4, label: "Anthropic 内部 honesty rate" },
    realtimeCyberSafeguards: true,
    cyberVerificationProgram: true,
    alignmentSummary: "おおむねよく整合し信頼に足るが、完璧ではない。",
    riskNotes: [
      "規制薬物の害軽減アドバイスは Opus 4.6 より若干詳細化の傾向",
      "プロンプトインジェクション耐性は向上",
      "sycophancy / 欺瞞の発生率は低水準",
      "訓練の 7.8% のエピソードが『意図せざる CoT スーパバイズ』の影響を受けた記載がシステムカードにある"
    ],
    systemCardPages: 232
  };

  /* --------- サイバー系ベンチ（Mythos 参照） ---------------- */
  const benchCyber = [
    { key: "cybergym",    name: "CyberGym（攻撃再現性）", opus46: 66.6, opus47: null, mythos: 83.1, unit: "%" },
    { key: "swe-verified-mythos", name: "SWE-bench Verified（Mythos 参考）", opus46: 80.8, opus47: 87.6, mythos: 93.9, unit: "%" }
  ];

  /* --------- effort（xhigh 新設） --------------------------- */
  const effortLevels = [
    { id: "low",    label: "low",    desc: "軽い質問・短文応答向け。トークン消費は最小。" },
    { id: "medium", label: "medium", desc: "標準的な一問一答・要約・分類に適したデフォルト候補。" },
    { id: "high",   label: "high",   desc: "深めの推論と複数ステップを許す。旧来の“しっかり考える”層。" },
    { id: "xhigh",  label: "xhigh",  desc: "【新設】high と max の中間。長時間エージェント/Claude Code の既定。",
      isNew: true, defaults: ["Claude Code（全プラン）"] },
    { id: "max",    label: "max",    desc: "最も深く思考。研究用途・ボトムライン評価向け。" }
  ];

  const breakingChanges = [
    { title: "thinking.budget_tokens が廃止",        body: "思考配分は adaptive thinking に一本化。effort で総量だけを決める。" },
    { title: "temperature / top_p / top_k を固定化", body: "既定以外の値は 400 エラーを返す。サンプリングはモデル側で最適化。" },
    { title: "思考テキストが既定で非表示",             body: "display:\"summarized\" 相当のオプトインなしに chain-of-thought は出ない。" },
    { title: "Claude Code 既定が xhigh に昇格",       body: "全プラン、既定で xhigh。long-running エージェント向け挙動が標準に。" },
    { title: "新トークナイザ採用",                     body: "同一ペイロードでも 1.00〜1.35 倍トークンが増える。max_tokens ヘッドルームと compaction 閾値の再調整が必要。" }
  ];

  /* --------- 配信チャネル ----------------------------------- */
  const channels = [
    { name: "Anthropic Claude / API", detail: "モデル ID: claude-opus-4-7",
      tags: ["first-party"], icon: "fa-brands fa-bitbucket" },
    { name: "Amazon Bedrock", detail: "US East (N. Virginia) / AP (Tokyo) / EU (Ireland, Stockholm)。次世代推論エンジンへ基盤刷新、ゼロオペレータアクセス。",
      tags: ["enterprise", "multi-region"], icon: "fa-brands fa-aws" },
    { name: "Google Cloud Vertex AI", detail: "Vertex AI Model Garden より利用可能。同日ローンチ。",
      tags: ["enterprise"], icon: "fa-brands fa-google" },
    { name: "Microsoft Foundry", detail: "AI Model Catalog に同日追加。",
      tags: ["enterprise"], icon: "fa-brands fa-microsoft" },
    { name: "Snowflake Cortex AI", detail: "Public Preview（US / EU）。Cortex Code / AI_COMPLETE / REST API。",
      tags: ["data-platform"], icon: "fa-solid fa-snowflake" },
    { name: "GitHub Copilot", detail: "Pro+ / Business / Enterprise。VS Code / VS / CLI / Cloud Agent / github.com / iOS・Android / JetBrains / Xcode / Eclipse。4/30 までプレミアム倍率 7.5x プロモ。",
      tags: ["dev-tools", "ide"], icon: "fa-brands fa-github" },
    { name: "OpenRouter", detail: "API Pricing & Providers リスティング。",
      tags: ["proxy"], icon: "fa-solid fa-route" }
  ];

  /* --------- 性格・挙動の変化 ------------------------------- */
  const personality = [
    { k: "指示解釈", before: "行間を読み、意図を汲んで補正する傾向", after: "書かれていないことは基本やらない（明示的であるほど精密）" },
    { k: "ツール呼び出し", before: "積極的に外部ツール・サブエージェント生成", after: "自前で完結させようとする頻度が増える" },
    { k: "自己検証", before: "推論のみ", after: "報告前に自分の成果を検証する方法を自ら編み出す" },
    { k: "ファイルシステム記憶", before: "セッション内中心", after: ".md ノートの保存・再読解で長期記憶が強化" },
    { k: "Office 文書", before: "レイアウト崩れを出しがち", after: ".docx 赤入れ / .pptx レイアウト自己点検が実用域" },
    { k: "出力冗長性", before: "問題あたり多めのトークン", after: "全 effort で同問題を少ないトークンで解く傾向" }
  ];

  /* --------- 移行チェックリスト ----------------------------- */
  const migrationChecklist = [
    { step: 1, title: "サンプリングパラメータ削除",
      detail: "temperature / top_p / top_k 非デフォルト値を削除。残すと 400 エラー。" },
    { step: 2, title: "budget_tokens を削除し adaptive thinking へ",
      detail: "effort を medium からテストし、必要に応じて high/xhigh に段階移行。" },
    { step: 3, title: "思考表示方針の決定",
      detail: "display:\"summarized\" オプトインの要否を UI/ログ基盤と合わせて判断。" },
    { step: 4, title: "新トークナイザ向けのヘッドルーム再計算",
      detail: "max_tokens / compaction 閾値を 1.17〜1.35x を見込んで再ベースライン化。" },
    { step: 5, title: "プロンプト再チューニング",
      detail: "暗黙の期待を明示化。『気配り』前提は通らないので、要件・受け入れ基準を書き下す。" },
    { step: 6, title: "破壊的操作に確認ゲート",
      detail: "force-push / rm -rf / prod テーブル DROP などは必ず確認ステップ挟む。" },
    { step: 7, title: "長コンテキスト retrieval の用途別再検証",
      detail: "524k+ 帯の想起は 78.3%→32.2% に落ちる。RAG / chunking を再検討。" },
    { step: 8, title: "コスト計測ハーネスの再ベースライン",
      detail: "count_tokens の見積もりは 4.6 と同じにならない。請求の A/B を用意。" },
    { step: 9, title: "アーキテクチャの二層化",
      detail: "Opus 4.7 は上流（計画/検証）、下流（抽出/整形）は安価な Haiku / Sonnet 系へ。" },
    { step: 10, title: "Cyber Verification Program 申請（該当者のみ）",
      detail: "脆弱性研究・ペネトレ・レッドチーム用途は審査登録でブロック解除。" }
  ];

  /* --------- 競合比較（抜粋） ------------------------------- */
  const compete = {
    overallRecord: "直接比較可能なベンチ上での Opus 4.7 vs GPT-5.4 は 7 勝 4 敗（VentureBeat）",
    winningGrounds: ["SWE-bench Pro", "Finance Agent", "MCP-Atlas", "GDPVal-AA", "長尺エージェント / 知識労働 / ツール駆動"],
    losingGrounds:  ["Terminal-Bench 2.0（69.4 vs 75.1）", "BrowseComp（79.3 vs 89.3）", "純粋ターミナルコーディング", "多言語 QA の一部"]
  };

  /* --------- 出典（43 件） ---------------------------------- */
  const sources = [
    /* Anthropic 公式 */
    { cat: "anthropic", title: "Introducing Claude Opus 4.7 — Anthropic 公式アナウンスメント", url: "https://www.anthropic.com/news/claude-opus-4-7" },
    { cat: "anthropic", title: "Claude Opus 4.7 — Anthropic 公式モデルページ", url: "https://www.anthropic.com/claude/opus" },
    { cat: "anthropic", title: "What's new in Claude Opus 4.7 — Anthropic Platform Docs", url: "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7" },
    { cat: "anthropic", title: "Adaptive thinking — Claude API Docs", url: "https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking" },
    { cat: "anthropic", title: "Pricing — Claude API Docs", url: "https://platform.claude.com/docs/en/about-claude/pricing" },
    { cat: "anthropic", title: "Project Glasswing: Securing critical software for the AI era", url: "https://www.anthropic.com/glasswing" },
    { cat: "anthropic", title: "Real-time cyber safeguards on Claude — Anthropic サポート", url: "https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude" },
    { cat: "anthropic", title: "Claude Opus 4.7 System Card（232 ページ PDF）", url: "https://cdn.sanity.io/files/4zrzovbb/website/037f06850df7fbe871e206dad004c3db5fd50340.pdf" },
    /* プラットフォーム */
    { cat: "cloud", title: "Introducing Anthropic's Claude Opus 4.7 in Amazon Bedrock — AWS News Blog", url: "https://aws.amazon.com/blogs/aws/introducing-anthropics-claude-opus-4-7-model-in-amazon-bedrock/" },
    { cat: "cloud", title: "Claude Opus 4.7 — Microsoft Foundry Models Catalog", url: "https://ai.azure.com/catalog/models/claude-opus-4-7" },
    { cat: "cloud", title: "Announcing Claude Opus 4.7 on Snowflake Cortex AI", url: "https://www.snowflake.com/en/blog/claude-opus-4-7-snowflake-cortex-ai/" },
    { cat: "cloud", title: "Claude Opus 4.7 is generally available — GitHub Changelog", url: "https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available/" },
    { cat: "cloud", title: "Claude Opus 4.7 — API Pricing & Providers — OpenRouter", url: "https://openrouter.ai/anthropic/claude-opus-4.7" },
    /* 報道 */
    { cat: "media", title: "Anthropic releases Claude Opus 4.7, a less risky model than Mythos — CNBC", url: "https://www.cnbc.com/2026/04/16/anthropic-claude-opus-4-7-model-mythos.html" },
    { cat: "media", title: "Anthropic releases Claude Opus 4.7, narrowly retaking lead — VentureBeat", url: "https://venturebeat.com/technology/anthropic-releases-claude-opus-4-7-narrowly-retaking-lead-for-most-powerful-generally-available-llm" },
    { cat: "media", title: "Anthropic launches Opus 4.7 with better coding and 13% vision gain — Interesting Engineering", url: "https://interestingengineering.com/ai-robotics/claude-opus-4-7-coding-vision-upgrade" },
    { cat: "media", title: "Anthropic releases Claude Opus 4.7 with automated cybersecurity safeguards — Help Net Security", url: "https://www.helpnetsecurity.com/2026/04/16/claude-opus-4-7-released/" },
    { cat: "media", title: "Claude Opus 4.7 hits 92% honesty rate — The Economic Times", url: "https://m.economictimes.com/news/international/us/claude-opus-4-7-hits-92-honesty-rate-are-we-closer-than-ever-to-human-like-ai-with-less-hallucination-heres-what-anthropics-new-ai-model-is-capable-of/articleshow/130341842.cms" },
    { cat: "media", title: "Claude Opus 4.7 launched: Smarter, safer AI — The Economic Times", url: "https://m.economictimes.com/news/international/us/claude-opus-4-7-launched-smarter-safer-ai-but-why-isnt-it-more-powerful-than-anthropics-claude-mythos-explained/articleshow/130311408.cms" },
    { cat: "media", title: "Is Claude Mythos and Project Glasswing a PR stunt? — Mashable", url: "https://mashable.com/article/claude-mythos-preview-project-glasswing-pr-stunt-cybersecurity-experts" },
    /* ベンチ */
    { cat: "bench", title: "Claude Opus 4.7 Benchmarks Explained — Vellum AI", url: "https://www.vellum.ai/blog/claude-opus-4-7-benchmarks-explained" },
    { cat: "bench", title: "Claude Opus 4.7: Pricing, Benchmarks & Performance — LLM Stats", url: "https://llm-stats.com/models/claude-opus-4-7" },
    { cat: "bench", title: "Claude Opus 4.7 Benchmarks 2026 — BenchLM.ai", url: "https://benchlm.ai/models/claude-opus-4-7" },
    { cat: "bench", title: "Claude Opus 4.7 (max) — Artificial Analysis", url: "https://artificialanalysis.ai/models/claude-opus-4-7" },
    { cat: "bench", title: "Claude Opus 4.7: Model Specifications and Details — apxml.com", url: "https://apxml.com/models/claude-opus-47" },
    /* FinOps */
    { cat: "finops", title: "Claude Opus 4.7 Pricing: The Real Cost Story — Finout", url: "https://www.finout.io/blog/claude-opus-4.7-pricing-the-real-cost-story-behind-the-unchanged-price-tag" },
    /* 技術解説 */
    { cat: "guide", title: "Claude Opus 4.7 Deep Dive — Caylent", url: "https://caylent.com/blog/claude-opus-4-7-deep-dive-capabilities-migration-and-the-new-economics-of-long-running-agents" },
    { cat: "guide", title: "Detailed explanation of Claude Opus 4.7 xhigh mode — APIYI Help Center", url: "https://help.apiyi.com/en/claude-opus-4-7-xhigh-effort-mode-explained-en.html" },
    { cat: "guide", title: "Claude Opus 4.7 Is Here and It Changes the Coding Model Race — HackerNoon", url: "https://hackernoon.com/claude-opus-47-is-here-and-it-changes-the-coding-model-race" },
    /* 開発者レビュー */
    { cat: "review", title: "Claude Opus 4.7 Review — Karo Zieminski (Substack)", url: "https://karozieminski.substack.com/p/claude-opus-4-7-review-tutorial-builders" },
    { cat: "review", title: "Opus 4.7 Is The Worst Release Anthropic Has Ever Shipped — Medium/Vibe Coding", url: "https://medium.com/vibe-coding/opus-4-7-is-the-worst-release-anthropic-has-ever-shipped-12772c21ca1e" },
    { cat: "review", title: "Claude Opus 4.7 vs Claude Mythos — Medium/Data Science in Your Pocket", url: "https://medium.com/data-science-in-your-pocket/claude-opus-4-7-vs-claude-mythos-f70a98643c00" },
    { cat: "review", title: "[AINews] Anthropic Claude Opus 4.7 — Latent Space", url: "https://www.latent.space/p/ainews-anthropic-claude-opus-47-literally" },
    { cat: "review", title: "Claude Mythos #2: Cybersecurity and Project Glasswing — The Zvi", url: "https://thezvi.substack.com/p/claude-mythos-2-cybersecurity-and" },
    /* Mythos 背景 */
    { cat: "mythos", title: "Claude Mythos and Project Glasswing — The Conversation", url: "https://theconversation.com/claude-mythos-and-project-glasswing-why-an-ai-superhacker-has-the-tech-world-on-alert-280374" },
    { cat: "mythos", title: "Claude Mythos & Project Glasswing — Till Freitag Blog", url: "https://till-freitag.com/en/blog/anthropic-mythos-glasswing-analysis" },
    { cat: "mythos", title: "Project Glasswing, Claude Mythos and what “Secure AI” really means — Version 1", url: "https://www.version1.com/en-us/blog/project-glasswing-claude-mythos-and-what-secure-ai-really-means-for-organisations/" },
    /* コミュニティ */
    { cat: "community", title: "Claude Opus 4.7 Model Card — Hacker News", url: "https://news.ycombinator.com/item?id=47793546" },
    { cat: "community", title: "Opus 4.7 (high) performs worse than 4.6 (high) on TGB — r/singularity", url: "https://www.reddit.com/r/singularity/comments/1snlp29/claude_opus_47_high_unexpectedly_performs/" },
    { cat: "community", title: "Opus 4.7 is 50% more expensive with context regression?! — r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI/comments/1sn8ovi/opus_47_is_50_more_expensive_with_context/" },
    { cat: "community", title: "Claude Opus 4.7 is a serious regression, not an upgrade — r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI/comments/1snhfzd/claude_opus_47_is_a_serious_regression_not_an/" },
    { cat: "community", title: "Introducing Claude Opus 4.7 — r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI/comments/1sn57af/introducing_claude_opus_47_our_most_capable_opus/" },
    { cat: "community", title: "Ethan Mollick on Opus 4.7 adaptive reasoning — LinkedIn", url: "https://www.linkedin.com/posts/emollick_the-new-claude-opus-47-now-only-has-an-activity-7450636076924338177-Wsyl" }
  ];

  return {
    model, pricing,
    benchCoding, benchKnowledge, benchVision, benchLongCtx, benchCyber,
    safety, effortLevels, breakingChanges,
    channels, personality, migrationChecklist, compete, sources
  };
})();
