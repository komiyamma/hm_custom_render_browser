var currentMacroDirectory = currentmacrodirectory();

if (typeof (server) != "undefined") {
    server.close();
}

var server = hidemaru.createHttpServer({ makeKey: 1 }, async (req, res) => {

    var url = req.url;

    // ここはパッチだと思って!!
    if (typeof (url) != "string") {
        url = await req.url;
    }

    if (url == "/" + server.key) {
        res.writeHead(200); // OK

        var obj = onRequestObject();
        res.write(JSON.stringify(obj));
        res.end("");
    } else {
        res.writeHead(404); // Not found
        res.end("");
    }
});

// 非同期関数なので非同期中に使える関数で構築する必要あり
function onRequestObject() {
    var obj = {
        text: gettotaltext(),
    };

    return obj;
}


function makeUrl(htmlFullPath, port, key) {
    var absoluteUrl = new URL(htmlFullPath);
    var params = new URLSearchParams();
    params.set("port", String(port));
    params.set("key", String(key));
    absoluteUrl.search = new URLSearchParams(params).toString();
    return absoluteUrl.href;
}

function outputAlert(msg) {
    var dll = loaddll("HmOutputPane.dll");
    dll.dllFuncW.OutputW(hidemaru.getCurrentWindowHandle(), msg + "\r\n");
}


// メインの処理
function showCustomRenderBrowser() {

    server.listen(0); //ランダムなポート

    if (server.port == 0) {
        outputAlert("サーバー構築失敗");
        return;
    }

    var url = makeUrl(currentMacroDirectory + "\\HmCustomRenderBrowser.html", server.port, server.key);

    if (showCustomRenderPane) { 
        showCustomRenderPane(url);
    }
}

function showCustomRenderPane(url) {

    browserpanecommand({
        target: "_each",
        url: url,
        show: 1,
        size: 500,
    });
}


// 同期で処理せず、非同期で処理することで、マクロ実行で一瞬固まるのを回避する。
var timerHandle;

if (typeof(timerHandle) != "undefined") {
    hidemaru.clearTimeout(timerHandle);
}

timerHandle = hidemaru.setTimeout(showCustomRenderBrowser, 0);
