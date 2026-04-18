# Claude Code 仕様書 2026年4月18日

スマートフォン特化 UI で読む、**Claude Opus 4.7** の非公式・日本語まとめサイト。
2026 年 4 月 18 日時点で集まっている公式発表・プラットフォームブログ・独立系ベンチ・
開発者レビュー・コミュニティ議論を横断して、1 つの仕様書に再編したもの。

- **想定端末**: スマートフォン（ポートレート・最大幅 520px の片手操作前提）
- **言語**: 日本語
- **テーマ**: ダーク基調（ライトモード対応、ドロワーから切替）
- **依存**: CDN 経由で Inter / JetBrains Mono / Noto Sans JP / Font Awesome 6 / Google Fonts のみ。JS フレームワーク不使用、純粋な HTML/CSS/JS。
- **画像**: 一切使用していない（ユーザー指示に従い、画像挿入なし）。

## プロジェクトの目的

- Opus 4.7 のスペック・価格・コンテキスト・推論設計・視覚・ベンチ・安全性・配信・移行・性格・最終評価までを、**スマホで縦スクロール 1 本で読み通せる**粒度で提供する。
- 元 TXT 2 ファイル（スペック文と出典リスト）を深く吸収し、「何が変わった」「何に気をつければよいか」を実装エンジニア視点で並べ替える。
- スマホならではの「底タブ」「上部アプリバー」「右ドロワー」「アコーディオン」「セグメントタブ」「アニメ付きプログレスバー」「KPI カード」を組み合わせ、ネイティブアプリに近い読書体験を作る。

## 完成した機能

### ページ（計 16 章）

| # | パス | 内容 |
|---|------|------|
| 1 | `index.html` | トップ（ヒーロー、ワンミニットサマリ、KPI、WHAT'S NEW、TOC、結論） |
| 2 | `pages/overview.html` | 概要とポジション（Mythos / 4.6 / 4.7 の三者関係） |
| 3 | `pages/pricing.html` | 価格 & FinOps（公称価格、Copilot 倍率、トークナイザ膨張、割引スタック） |
| 4 | `pages/context.html` | コンテキスト（1M / 128k / 長ctx retrieval の退行、新トークナイザ） |
| 5 | `pages/reasoning.html` | Adaptive Reasoning（5 段階 effort、xhigh 新設、Breaking changes、コードサンプル） |
| 6 | `pages/vision.html` | マルチモーダル（解像度 3 倍、XBOW、ユースケース） |
| 7 | `pages/benchmarks.html` | ベンチマーク総覧（コーディング/知識/視覚/長ctx/サイバー、セグメントタブ） |
| 8 | `pages/safety.html` | 安全性 & Mythos（honesty ゲージ、Cyber Safeguards、Cyber Verification Program） |
| 9 | `pages/channels.html` | 配信チャネル（Bedrock/Vertex/Foundry/Cortex/Copilot/OpenRouter） |
| 10 | `pages/migration.html` | 移行ガイド（10 ステップのタイムライン、Before/After diff、静かに壊れるポイント） |
| 11 | `pages/personality.html` | 性格 & 挙動（Before/After 6 軸、歓迎派 vs 批判派、プロンプト方針） |
| 12 | `pages/versus.html` | 競合比較（vs GPT-5.4 Pro / Gemini 3.1 Pro、SVG レーダー） |
| 13 | `pages/verdict.html` | 最終評価（Pros/Cons、用途別推奨、マーケティング重心の転換） |
| 14 | `pages/faq.html` | FAQ（20 問） |
| 15 | `pages/timeline.html` | タイムライン（2026-02 〜 将来の論点） |
| 16 | `pages/glossary.html` | 用語集（22 項目） |
| 付 | `pages/sources.html` | 出典 43 件（検索・9 カテゴリフィルタ対応） |

### UI コンポーネント / インタラクション

- **上部 App Bar**（戻るボタン + タイトル + メニュー）
- **下部 Tab Bar**（ホーム / ベンチ / 推論 / 安全 / 出典）
- **右ドロワー**（全 16 章 + 付録 + テーマ切替）
- **アコーディオン**、**セグメントタブ**、**タイムライン**、**バーチャート**、**ゲージ**、**カード**、**バッジ**、**コールアウト**、**タグ**、**KPI ステータス**、**ページャー**、**コードブロック（コピー対応）**、**データテーブル**、**SVG レーダー**
- **スクロールインアニメーション**（Intersection Observer）
- **プログレスバーアニメーション**（データから動的計算）
- **出典ページの検索 & カテゴリフィルタ**（リアルタイム）
- **ライト / ダークのテーマ切替**（localStorage 永続化）

## URI（ローカル・相対パス）

| パス | 役割 |
|------|------|
| `/` または `/index.html` | トップ / ダッシュボード |
| `/pages/{section}.html` | 各章（上表参照） |
| `/pages/sources.html` | 出典一覧（パラメータ不要、ページ内検索あり） |

いずれも引数なしの静的ルーティング。

## データモデル

すべて `js/data.js` の `window.OPUS47` に集約：

```
OPUS47
├── model           // モデルの基本メタデータ
├── pricing         // 公称価格 / 割引 / Copilot 倍率 / トークナイザ膨張範囲
├── benchCoding     // コーディング/エージェント系ベンチ
├── benchKnowledge  // 知識/科学/ウェブ
├── benchVision     // ビジョン
├── benchLongCtx    // 長ctx retrieval
├── benchCyber      // サイバー（Mythos 参照値付き）
├── safety          // honesty, リスクノート, System Card メタ
├── effortLevels    // low / medium / high / xhigh / max の定義
├── breakingChanges // API 破壊的変更
├── channels        // 配信チャネル（7 つ）
├── personality     // 性格変化の 6 軸
├── migrationChecklist // 10 ステップ
├── compete         // vs GPT-5.4 の勝ち負けカテゴリ
└── sources         // 43 件の出典（cat / title / url）
```

サーバーは使用せず、ブラウザ側で静的読み込み→レンダリング。

## 未実装 / 将来の改良候補

- **検索はページ内のみ**。全文検索は未実装（静的インデックスを事前生成する方式で対応可能）。
- **PWA 化**（manifest.json / Service Worker）は未対応。オフラインキャッシュしたい場合に検討。
- **ECharts / Chart.js 連携**は現状不要と判断し純粋 CSS チャートに留めたが、将来複雑なデータ（時系列推移、複数競合のマルチ系列）を追加するなら導入余地あり。
- **言語切替**（英語版）は未実装。
- **アンカー URL 共有**（セクション ID を hash で共有）は部分的にしか対応していない。

## 推奨する次のステップ

1. Mythos 一般公開やバージョン 4.8 が出た場合の差分追記（`js/data.js` を起点に数値を差し替え可能）。
2. FAQ を 40 問程度に拡張。
3. `pages/sources.html` に「このページで引用」機能（各章と出典を相互リンク）。
4. PWA 化してオフラインで読めるようにする（仕様書用途との相性が良い）。
5. アクセシビリティ（スクリーンリーダー、フォーカス順序）の更なる検証。

## 配布

このサイトは静的ファイルのみで構成されているため、**Publish タブ**から 1 クリックで公開可能。
ビルドステップは不要。

---

**情報源**: 元 TXT 2 ファイル（`source/spec.txt`, `source/sources.txt`）をサイト内 `source/` に保管。本仕様書本文の定量データ（SWE-bench Verified 87.6%、長 ctx retrieval 91.9% → 59.2%、視覚解像度 2,576px、honesty rate 92%、トークナイザ 1.00〜1.35×、新 xhigh effort 段階の挙動など）はすべて、これら一次情報とクロスチェックした値のみ採用しています。
