# TFT Trading Optimization System

東京証券取引所全銘柄対象の深層学習株式取引最適化システム

## 概要

Temporal Fusion Transformer (TFT) をベースとしたマルチタスク深層学習モデルで、4つの取引戦略（買→売、買→保持、売→保持、売→買）を自動判断します。

## 特徴

- **マルチエージェントPDCA**: 6つのAIエージェントが自動でPDCAサイクルを実行
- **リアルタイムシミュレーション**: 合成価格データでの取引シグナル表示
- **モデルメトリクス**: RECALL、F-βスコア、Sharpe比などの評価指標

## ローカル実行

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` にアクセス。

## GitHub Pages

リポジトリのSettings > PagesでSourceを"GitHub Actions"に設定すると、自動デプロイされます。

## 設計計画書

詳細は[設計計画書](design-plan.md)を参照してください。

## 技術スタック

- React (CDN)
- Claude API (エージェント応答)
- Python HTTP Server (ローカル)
- GitHub Actions (CI/CD)