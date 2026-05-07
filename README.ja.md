<div align="center">
<img width="1200" height="475" alt="DeskTab Banner" src="https://github.com/user-attachments/assets/3d723454-9d81-465a-92e1-7ecd6814219a" />
</div>

# DeskTab

[中文](./README.md) · [English](./README.en.md) · **日本語**

Mac 風の Chrome 新しいタブ拡張機能です。新しいタブを開くたびに、フロストガラス調の検索バーとドラッグ可能なサイトショートカットが表示されます。ダーク／ライトテーマ、カスタム壁紙、ロゴのカスタマイズに対応し、すべての設定は `localStorage` でローカルに保存されます。

## 機能

- **Google 風検索バー** — Enter で Google 検索へ。比率は本家のホームページに近づけて調整されています。
- **ショートカットグリッド** — Gmail / YouTube / ChatGPT / Claude などのよく使うサイトをプリインストール。自由に追加・編集・削除できます。
- **ドラッグで並べ替え** — dnd-kit を採用。約 200ms 長押しでドラッグを開始します。
- **長押しで編集・削除** — タイルを約 600ms 長押しすると、左上に削除ボタン、右上に編集ボタンが現れます。Customize モードに入る必要はありません。
- **Customize モード** — 画面下部の Customize ボタンからコントロールパネルを開き、アイコンサイズ・ロゴ文字・ロゴカラースタイル・壁紙のアップロード／削除を変更できます。
- **ダーク / ライトテーマ** — ワンクリックで切り替え。テーマと全設定はローカルに自動保存されます。
- **アイコンのカスタマイズ** — 画像アイコン（favicon を自動取得、または URL 指定）、テキストアイコン、単色・グラデーション背景、複数のフォントと画像スケールをサポート。
- **スクロール対応** — ショートカットが 1 画面を超えると縦スクロール可能。検索バーと下部ボタンは固定表示のままです。

## Chrome へのインストール

DeskTab は Manifest V3 拡張機能のため、ローカルでビルドし「デベロッパーモード」で読み込む必要があります。

```bash
git clone https://github.com/Shinichi-Goo/DeskTab.git
cd DeskTab
npm install
npm run build
```

続いてブラウザで:

1. `chrome://extensions` を開く
2. 右上の「デベロッパーモード」をオン
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクト内の `dist/` ディレクトリを選択

これで新しいタブを開くたびに DeskTab が表示されます。コードを変更した後は再度 `npm run build` を実行し、拡張機能カードの更新ボタンを押せば反映されます。

> Chromium ベースのブラウザ（Edge、Brave、Arc、Vivaldi など）でも同様に動作します。

## ローカル開発

```bash
npm install
npm run dev
```

Vite が `http://localhost:3000` で開発サーバーを起動します。通常のタブで開いて UI をデバッグできます（新しいタブページは上書きされません）。

利用可能なスクリプト:

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動（HMR） |
| `npm run build` | `dist/` に本番ビルド（拡張機能で読み込む） |
| `npm run preview` | 本番ビルドのプレビュー |
| `npm run lint` | TypeScript の型チェック |
| `npm run clean` | `dist/` を削除 |

## プロジェクト構成

```
src/
├── App.tsx                    メインレイアウト、状態、Customize パネル
├── main.tsx                   React のエントリーポイント
├── index.css                  Tailwind v4 + テーマ用 CSS 変数
├── types.ts                   Shortcut 型定義
├── components/
│   ├── SearchBar.tsx          上部のロゴと検索バー
│   ├── ShortcutGrid.tsx       dnd-kit のソート可能グリッド
│   ├── ShortcutItem.tsx       個別のショートカットカード（長押し対応）
│   └── ShortcutModal.tsx      ショートカットの追加・編集ダイアログ
└── lib/utils.ts               cn() クラス名結合ユーティリティ
public/
└── manifest.json              Chrome 拡張マニフェスト (MV3)
```

## データの保存

すべての設定はブラウザの `localStorage` に保存されます。キーはすべて `chrome-` プレフィックス付きです:

- `chrome-shortcuts` — ショートカット一覧
- `chrome-bg` — カスタム壁紙（Base64）
- `chrome-icon-scale` — アイコンスケール
- `chrome-logo-text` / `chrome-logo-style` / `chrome-logo-font` — ロゴ設定
- `theme` — ダーク／ライト

サーバーへ送信されるデータは一切ありません。

## 技術スタック

- **React 19** + **TypeScript**
- **Vite 6**（ビルド）
- **Tailwind CSS v4**（スタイリング）
- **dnd-kit**（ドラッグ＆ドロップ）
- **lucide-react**（アイコン）
- **Chrome Extension Manifest V3**

## License

MIT
