# HmCustomRenderBrowser

[![CC0](https://img.shields.io/badge/license-CC0-blue.svg?style=flat)](LICENSE.txt)

秀丸のテキストエリア等(他でも何でも良いが) を個別ブラウザ枠へと伝達し、独自の形でレンダリングする汎用の形
(レンダリング枠も同じ)

[https://秀丸マクロ.net/?page=nobu_tool_hm_custom_render_browser](https://秀丸マクロ.net/?page=nobu_tool_hm_custom_render_browser)

## 概要

`HmCustomRenderBrowser` は、秀丸エディタのテキストコンテンツをリアルタイムでWebブラウザに表示し、独自のカスタムレンダリングを行うためのフレームワークです。秀丸エディタ内でHTTPサーバーを起動し、その内容をWebView2（またはIEコンポーネント）を利用したブラウザペインに表示します。

これにより、プレーンテキストだけでは表現が難しい、シンタックスハイライト、Markdownプレビュー、図の描画などを、Web技術（HTML, CSS, JavaScript）を用いて自由に実装できます。

## 主な機能

- **リアルタイムプレビュー**: 秀丸エディタのテキストを編集すると、即座にブラウザペインの表示に反映されます。
- **双方向通信**: ブラウザペインから秀丸エディタ本体へ情報の送信が可能です。これにより、プレビュー画面上の操作を秀丸マクロに伝えるといったインタラクティブな機能を実現できます。
- **カスタマイズ性**: レンダリングロジックはすべて `HmCustomRenderBrowser.html` と `HmCustomRenderBrowser.js` で記述するため、Web技術の知識があれば自由に表示をカスタマイズできます。

## 使い方

1.  **マクロの実行**: `HmCustomRenderServer.mac` を秀丸エディタで実行します。
2.  **レンダリングの実装**: `HmCustomRenderBrowser.html` と `HmCustomRenderBrowser.js` を編集して、独自の表示処理を実装します。
    -   `HmCustomRenderBrowser.js` の `setInterval` または `setTimeout` のコールバック関数内で、サーバーから送られてくるテキストデータ (`obj.text`) を受け取り、DOM操作などで画面に反映させます。
3.  **(オプション) 秀丸へのデータ送信**:
    -   ブラウザ側: `HmCustomRenderBrowser.sendObject(data)` を呼び出して、任意のJSONオブジェクトを送信します。
    -   秀丸側: `HmCustomRenderServer.js` 内に `onReceiveObject(obj)` 関数を定義することで、ブラウザから送信されたデータを受け取って処理を記述できます。

## ファイル構成

-   `HmCustomRenderServer.mac`:
    -   メインとなる秀丸マクロです。このマクロを実行すると、HTTPサーバーが起動し、ブラウザペインが表示されます。
-   `HmCustomRenderServer.js`:
    -   秀丸側で動作するサーバーサイドスクリプトです。HTTPサーバーを構築し、秀丸のテキストをブラウザに提供します。
-   `HmCustomRenderBrowser.html`:
    -   ブラウザペインに表示されるHTMLの骨格です。
-   `HmCustomRenderBrowser.js`:
    -   ブラウザ側で動作するライブラリです。サーバーとの通信を抽象化し、簡単に利用できるようにします。
-   `HmCustomRenderServer.WebView2.js`:
    -   WebView2環境で、ブラウザから秀丸へより効率的に通信を行うためのスクリプトです。
