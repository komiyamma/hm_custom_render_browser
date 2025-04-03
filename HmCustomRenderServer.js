// HmCustomRenderServer.js ver 2.2.0.1
var _currentMacroDirectory = currentmacrodirectory();

if (typeof (_httpServer) != "undefined") {
    _httpServer.close();
}

var _httpServer = hidemaru.createHttpServer({ makeKey: 1 }, function (req, res) {
    if (req.url == "/" + _httpServer.key) {
        res.writeHead(200); // OK
        var obj = onRequestObject();
        res.write(JSON.stringify(obj));
        res.end("");
    } else if (req.url.indexOf("/" + _httpServer.key + "?sendObject=") == 0) {
        res.writeHead(200); // OK
        var json_text = decodeURIComponent(req.url);
        json_text = json_text.replace("/" + _httpServer.key + "?sendObject=", "");
        _proxyOnReceiveObjectFromRenderPane(json_text);
        res.write("{}");
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

function _proxyOnReceiveObjectFromRenderPane(json_text) {
    try {
        if (typeof(onReceiveObject) == "function") {
            var json = JSON.parse(json_text);
            onReceiveObject(json);
        }
    } catch(e) {
    }
}

function _makeUrl(htmlFullPath, port, key, funcid) {
    var htmlFullPath = htmlFullPath.replace(/\\/g, "/");
    var absoluteUrl = sprintf("file://%s?port=%s&key=%s&funcid=%s", encodeURI(htmlFullPath), port.toString(), key.toString(), funcid.toString());
    return absoluteUrl;
}

function _outputAlert(msg) {
    var dll = loaddll("HmOutputPane.dll");
    dll.dllFuncW.OutputW(hidemaru.getCurrentWindowHandle(), msg + "\r\n");
}


// メインの処理
function _showCustomRenderBrowser() {

    _httpServer.listen(0); //ランダムなポート

    if (_httpServer.port == 0) {
        _outputAlert("サーバー構築失敗");
        return;
    }

    var funcid = hidemaru.getFunctionId(_proxyOnReceiveObjectFromRenderPane);
    var url = _makeUrl(_currentMacroDirectory + "\\HmCustomRenderBrowser.html", _httpServer.port, _httpServer.key, funcid);

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
        initialize: "async",
    });
}


// 同期で処理せず、非同期で処理することで、マクロ実行で一瞬固まるのを回避する。
var _timerHandleShow;

if (typeof(_timerHandleShow) != "undefined") {
    hidemaru.clearTimeout(_timerHandleShow);
}

_timerHandleShow = hidemaru.setTimeout(_showCustomRenderBrowser, 0);
