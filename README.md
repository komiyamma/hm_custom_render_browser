# HmCustomRenderBrowser

[![CC0](https://img.shields.io/badge/license-CC0-blue.svg?style=flat)](LICENSE.txt)
[![HmCustomRenderBrowser latest release](https://img.shields.io/github/v/release/komiyamma/hm_custom_render_browser?style=flat)](https://github.com/komiyamma/hm_custom_render_browser/releases)

秀丸エディタのコンテンツをブラウザペインに表示し、Web技術（HTML/CSS/JS）で自由にレンダリングするためのフレームワークです。

[https://秀丸マクロ.net/?page=nobu_tool_hm_custom_render_browser](https://秀丸マクロ.net/?page=nobu_tool_hm_custom_render_browser)

## 概要

`HmCustomRenderBrowser` は、秀丸エディタのテキストやカーソル位置などの情報を、リアルタイムでブラウザペインに表示するための基盤を提供します。

秀丸マクロからJScriptでローカルHTTPサーバーを起動し、そのサーバーと連携するHTMLファイルをブラウザペインで開きます。これにより、プレーンテキストだけでは表現が難しい、シンタックスハイライト、Markdownプレビュー、図の描画などを、Web技術を用いて自由に実装できます。

## 特徴

- **リアルタイムプレビュー**: 秀丸エディタの内容を、指定した間隔で自動的にブラウザペインに反映します。
- **自由なカスタマイズ**: レンダリング部分はただのHTMLファイルなので、CSSやJavaScriptライブラリ（React, Vue, D3.jsなど）を自由に利用して、見た目や機能をリッチにすることができます。
- **双方向通信**: エディタからブラウザへの情報提供だけでなく、ブラウザペイン上の操作を検知して秀丸マクロ側に情報を送ることも可能です。
- **非同期動作**: サーバーの起動や通信は非同期で行われるため、秀丸エディタのUIをブロックせず、快適な操作性を保ちます。
- **モダンな環境対応**: 従来のIEコンポーネントだけでなく、より高機能なWebView2ブラウザコントロールにも対応したスクリプトを同梱しています。

## 仕組み

本フレームワークは、以下のコンポーネント間の連携によって動作します。

1.  **秀丸マクロ (`.mac`)**:
    - 全体の処理を開始するエントリーポイントです。
    - `HmCustomRenderServer.js` (または `HmCustomRenderServer.WebView2.js`) を読み込んで実行します。
    - `onRequestObject` 関数をオーバーライドすることで、ブラウザ側に渡す情報（テキスト全体、カーソル位置など）をカスタマイズできます。

2.  **サーバーサイドJScript (`HmCustomRenderServer.js`)**:
    - 秀丸エディタ内で動作するJScriptです。
    - 2つのローカルHTTPサーバーを起動します。
        - **サーバー1**: 秀丸エディタの情報をJSON形式で提供します。
        - **サーバー2**: ブラウザペインからの情報を受信します。
    - `HmCustomRenderBrowser.html` を適切なパラメータ付きで開くよう、ブラウザペインに指示します。

3.  **クライアントサイドHTML/JS (`HmCustomRenderBrowser.html`, `HmCustomRenderBrowser.js`)**:
    - ブラウザペインで動作するフロントエンド部分です。
    - `HmCustomRenderBrowser.js` が、サーバー1に定期的に問い合わせを行い、エディタの情報を取得します。
    - `HmCustomRenderBrowser.html` 内のJavaScriptで、取得した情報を好きなようにDOMにレンダリングします。
    - `sendObject` 関数を使うことで、サーバー2経由で秀丸マクロに情報を送り返すことができます。

## 使い方・カスタマイズ方法

このフレームワークを利用して独自のレンダリングを作成するには、主にクライアントサイドのファイルを変更します。

### 1. レンダリング内容の変更

`HmCustomRenderBrowser.html` を開き、body内のJavaScriptを編集します。

**例：受け取ったテキストをそのまま表示する**
```html
<script>
document.addEventListener('DOMContentLoaded', ()=>{
    // 1秒に一度データを受け取る
    HmCustomRenderBrowser.setInterval(onReceiveObject, 1000);
})

function onReceiveObject(obj, error) {
    if (obj) {
        // obj.text に秀丸のテキスト全体が入っている
        document.getElementById("output").innerText = obj.text;
    }
}
</script>
```
`onReceiveObject` 関数が、サーバーからデータを受け取るたびに呼ばれます。引数 `obj` には、`.mac` ファイルの `onRequestObject` で定義されたオブジェクトが格納されています。この `obj` を使ってDOMを自由に操作してください。

### 2. エディタから渡す情報を変更する

`HmCustomRenderServer.mac` を開き、`onRequestObject` 関数を編集します。

**例：テキスト全体に加えて、カーソル位置（行・列）も渡す**
```javascript
// ... (マクロファイルの上部) ...

js {

// オーバーライド。
function onRequestObject() {
    var obj = {
        text: gettotaltext(),
        line: lineno(),       // カーソル行番号
        column: column()      // カーソル列番号
    };

    return obj;
}

// ... (以下略) ...
```
こうして追加した `line` や `column` の情報は、`onReceiveObject` の `obj.line`, `obj.column` として参照できます。

### 3. ブラウザから秀丸マクロへ情報を送る

`HmCustomRenderBrowser.js` の `sendObject` 関数を利用します。

**例：HTML内のボタンがクリックされたら、その情報を秀丸側に送る**
```html
<button id="myButton">Click me</button>
<script>
// ... (onReceiveObjectなど) ...

document.getElementById("myButton").addEventListener('click', ()=>{
    const dataToSend = {
        message: "Button was clicked!",
        timestamp: new Date().toISOString()
    };
    // データを秀丸マクロに送信
    HmCustomRenderBrowser.sendObject(dataToSend);
});
</script>
```
送信されたデータは、`.mac` ファイル側で `onReceiveObject` 関数を定義することで受け取ることができます。（サーバーサイドとクライアントサイドで関数名が同じですが、役割が違う点に注意してください）
