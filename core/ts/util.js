"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = /** @class */ (function () {
    function Util() {
    }
    /**
     * 字符串转regexp
     * @param str       待处理字符串
     * @param side      两端匹配 1前端 2后端 3两端
     */
    Util.toReg = function (str, side) {
        // 转字符串为正则表达式并加入到数组
        //替换/为\/
        str = str.replace(/\//g, '\\/');
        //替换.为\.
        str = str.replace(/\./g, '\\.');
        //替换*为.*
        str = str.replace(/\*/g, '.*');
        if (side !== undefined) {
            switch (side) {
                case 1:
                    str = '^' + str;
                    break;
                case 2:
                    str = str + '$';
                    break;
                case 3:
                    str = '^' + str + '$';
            }
        }
        return new RegExp(str);
    };
    return Util;
}());
exports.Util = Util;
