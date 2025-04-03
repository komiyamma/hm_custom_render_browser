// HmCustomRenderBrowser.js ver 2.1.0.1
(function() {
    // ファイルURLからポート番号を取得
    let urlLocationParams = new URLSearchParams(window.location.search);
    let urlLocationPort = Number(urlLocationParams.get('port'));
    let urlLocationKey = urlLocationParams.get('key');
    let urlFuncID = Number(urlLocationParams.get('funcid'));

    async function updateTick(callBackFunc) {

        fetch(`http://localhost:${urlLocationPort}/${urlLocationKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // テキストとして来るが、JSONもテキストなので、JSONオブジェクト解釈。
            })
            .then(obj => {
                if (typeof(callBackFunc) == "function") {
                    callBackFunc(obj, null);
                }
            })
            .catch(error => {
                if (typeof(callBackFunc) == "function") {
                    callBackFunc(null, error);
                }
            }
            );
    }

    HmCustomRenderBrowser = {
        setInterval: function(callBackFunc, timeout) {
            updateTick(callBackFunc);
            return window.setInterval(updateTick, timeout, callBackFunc);
        },

        clearInterval: function(timerHandle) {
             window.clearInterval(timerHandle);
        },

        setTimeout: function(callBackFunc, timeout) {
            return window.setTimeout(updateTick, timeout, callBackFunc);
        },

        clearTimeout: function(timerHandle) {
             window.clearTimeout(timerHandle);
        },

        sendObjectFromRenderPane(obj) {
            var json = JSON.stringify(obj);
            window.chrome.webview.postMessage({ funcid: urlFuncID, message: json });
        },

        sendObject(obj) {
            let text = JSON.stringify(obj);
            fetch(`http://localhost:${urlLocationPort}/${urlLocationKey}/sendObject/${encodeURIComponent(text)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })
                .catch(error => {
                }
            );
        }
    }
})();


