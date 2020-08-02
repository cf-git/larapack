import { tools } from "../libs/tools";
import dynamicImports from "./dynamic-imports";
import '../libs/proto'
import mainScript from "./main";

const global = global || self || window || this || {};
const _token = (document.querySelector('[name="csrf-token"]') || {}).content;

const libLangs = (() => {
    const lang = document.documentElement.lang;
    const lMap = {
        default: {
        }
    };
    return (lib) => {
        return (lMap[lang] && lMap[lang][lib] && lMap[lang][lib]()) || (lMap.default[lib] && lMap.default[lib]());
    };
})();


import (/* webpackChunkName: "jquery" */"jquery").then((module) => {
    global.$ = global.jQuery = module.default;

    (($) => {
        $.ajaxSetup({
            headers: {
                "ACCEPT": "application/json",
                "X-CSRF-TOKEN": _token,
                "X-Requested-With": "XMLHttpRequest",
            }
        });

        $.extend($.fn, {
            rOn(...args) {
                console.log("=== Event reinit: "+args[0]);
                return this.off(args[0]).on.apply(this, args);
            },
            contextFind(selector) {
                // "+" is => current + sibling || "~" is => current ~ sibling || ":" is => current sibling || "-" is => parent find
                const $this = this,
                    pattern = /^[~\+:-]/;
                if (!(selector.trim().match(pattern))) {
                    return $(selector);
                } else {
                    switch (selector[0]) {
                        case ':':
                            $this.find(selector.replace(pattern, '').trim());
                            break;
                        default:
                            return $this.parent().find(selector.replace(pattern, '').trim())
                    }
                    return (selector[0] === ':' ? $this : $this.parent()).find(selector.replace(pattern, '').trim());
                }
            },
        });
    })($);

    dynamicImports(global, libLangs);

    import(/* webpackChunkName: "common" */"../libs/common").then((module) => {
        mainScript({
            tools,
            $,
            global
        })
    });

});
