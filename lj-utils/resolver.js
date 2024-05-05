(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ljResolver = {}));
})(this, (function (exports) { 'use strict';

    /**
     * @description resolver for unplugin-auto-import
     */
    const fnList = ["arrayToObj","autoPlayAudio","blobToBase64","blobToFile","blobUrlToFile","dataURLtoBlob","debounce","decodeHtml","deepCopy","delCookie","delay","dlFile","encodeHtml","formatNumber","formatSize","formatTime","friendlyTime","getCookie","getCookieObj","getDuration","getEnv","getInfo","getNetworkStatus","getObj","getRandomColor","getRegexp","getStorage","getUrlParam","getUrlParamObj","getUuid","hideInfo","isBlob","isFile","isIdCard","isJson","isPrime","loadFile","objToArray","objToObj","off","on","px2vw","randomInt","remInit","replaceUrlParam","requestDeviceMotionPermission","rmbPrice","safe","safeData","secondToTime","setCookie","setEnv","setLog","setObj","setStorage","setTitle","setUrlParams","sleep","string10to62","string62to10","throttle","toFixed","toHump","toLine"];
    const ljResolver = () => {
        const hooks = fnList;
        return (name) => {
            if (!hooks.includes(name))
                return;
            return {
                name,
                from: 'lj-utils',
            };
        };
    };

    exports.ljResolver = ljResolver;

}));
