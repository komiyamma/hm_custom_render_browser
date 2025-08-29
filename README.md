# HmCustomRenderBrowser

[![CC0](https://img.shields.io/badge/license-CC0-blue.svg?style=flat)](LICENSE.txt)

秀丸のテキストエリア等(他でも何でも良いが) を個別ブラウザ枠へと伝達し、独自の形でレンダリングする汎用の形
(レンダリング枠も同じ)

[https://秀丸マクロ.net/?page=nobu_tool_hm_custom_render_browser](https://秀丸マクロ.net/?page=nobu_tool_hm_custom_render_browser)

## 概要

`HmCustomRenderBrowser` は、秀丸エディタのテキストコンテンツをリアルタイムでWebブラウザに表示し、独自のカスタムレンダリングを行うためのフレームワークです。秀丸エディタ内でHTTPサーバーを起動し、その内容をWebView2（またはIEコンポーネント）を利用したブラウザペインに表示します。

これにより、プレーンテキストだけでは表現が難しい、シンタックスハイライト、Markdownプレビュー、図の描画などを、Web技術（HTML, CSS, JavaScript）を用いて自由に実装できます。

