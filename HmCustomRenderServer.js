var currentMacroDirectory = currentmacrodirectory();

if (typeof (server) != "undefined") {
    server.close();
}

var server = hidemaru.createHttpServer({ makeKey: 1 }, function (req, res) {

    if (req.url == "/" + server.key) {
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
    var htmlFullPath = htmlFullPath.replace(/\\/g, "/");
    var absoluteUrl = sprintf("file://%s?port=%d&key=%s", encodeURI(htmlFullPath), port, key);
    return absoluteUrl;
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
