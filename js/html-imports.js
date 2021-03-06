/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';
(function (u) {
    function z(a, b) {
        if ('function' === typeof window.CustomEvent) return new CustomEvent(a, b);
        var c = document.createEvent('CustomEvent');
        c.initCustomEvent(a, !!b.bubbles, !!b.cancelable, b.detail);
        return c
    }

    function l(a) {
        if (v) return a.ownerDocument !== document ? a.ownerDocument : null;
        var b = a.__importDoc;
        if (!b && a.parentNode) {
            b = a.parentNode;
            if ('function' === typeof b.closest) b = b.closest('link[rel=import]'); else for (; !p(b) && (b = b.parentNode);) ;
            a.__importDoc = b
        }
        return b
    }

    function D(a) {
        var b = document.querySelectorAll('link[rel=import]:not(import-dependency)'),
            c = b.length;
        if (c) for (var d = 0, e = b.length, h; d < e && (h = b[d]); d++) q(h, function () {
            --c || a()
        }); else a()
    }

    function A(a) {
        function b() {
            'loading' !== document.readyState && document.body && (document.removeEventListener('readystatechange', b), a())
        }

        document.addEventListener('readystatechange', b);
        b()
    }

    function B(a) {
        A(function () {
            return D(function () {
                return a && a()
            })
        })
    }

    function q(a, b) {
        if (a.__loaded) b && b(); else if ('script' !== a.localName || a.src) {
            var c = function (d) {
                a.removeEventListener(d.type, c);
                a.__loaded = !0;
                b && b()
            };
            a.addEventListener('load',
                c);
            w && 'style' === a.localName || a.addEventListener('error', c)
        } else a.__loaded = !0, b && b()
    }

    function p(a) {
        return a.nodeType === Node.ELEMENT_NODE && 'link' === a.localName && 'import' === a.rel
    }

    function k() {
        var a = this;
        this.b = {};
        this.c = 0;
        this.h = new MutationObserver(function (b) {
            return a.C(b)
        });
        this.h.observe(document.head, {childList: !0, subtree: !0});
        this.f(document)
    }

    var v = 'import' in document.createElement('link'), x = null;
    !1 === 'currentScript' in document && Object.defineProperty(document, 'currentScript', {
        get: function () {
            return x ||
                ('complete' !== document.readyState ? document.scripts[document.scripts.length - 1] : null)
        }, configurable: !0
    });
    var E = /(^\/)|(^#)|(^[\w-\d]*:)/, F = /(url\()([^)]*)(\))/g, G = /(@import[\s]+(?!url\())([^;]*)(;)/g,
        H = /(<link[^>]*)(rel=['|"]?stylesheet['|"]?[^>]*>)/g, f = {
            A: function (a, b) {
                a.href && a.setAttribute('href', f.i(a.getAttribute('href'), b));
                a.src && a.setAttribute('src', f.i(a.getAttribute('src'), b));
                if ('style' === a.localName) {
                    var c = f.u(a.textContent, b, F);
                    a.textContent = f.u(c, b, G)
                }
            }, u: function (a, b, c) {
                return a.replace(c,
                    function (a, c, h, g) {
                        a = h.replace(/["']/g, '');
                        b && (a = f.v(a, b));
                        return c + '\'' + a + '\'' + g
                    })
            }, i: function (a, b) {
                return a && E.test(a) ? a : f.v(a, b)
            }, v: function (a, b) {
                if (void 0 === f.g) {
                    f.g = !1;
                    try {
                        var c = new URL('b', 'http://a');
                        c.pathname = 'c%20d';
                        f.g = 'http://a/c%20d' === c.href
                    } catch (d) {
                    }
                }
                if (f.g) return (new URL(a, b)).href;
                c = f.w;
                c || (c = document.implementation.createHTMLDocument('temp'), f.w = c, c.l = c.createElement('base'), c.head.appendChild(c.l), c.j = c.createElement('a'));
                c.l.href = b;
                c.j.href = a;
                return c.j.href || a
            }
        }, C = {
            async: !0, load: function (a,
                                       b, c) {
                if (a) if (a.match(/^data:/)) {
                    a = a.split(',');
                    var d = a[1], d = -1 < a[0].indexOf(';base64') ? atob(d) : decodeURIComponent(d);
                    b(d)
                } else {
                    var e = new XMLHttpRequest;
                    e.open('GET', a, C.async);
                    e.onload = function () {
                        var a = e.getResponseHeader('Location');
                        a && !a.indexOf('/') && (a = (location.origin || location.protocol + '//' + location.host) + a);
                        var d = e.response || e.responseText;
                        304 === e.status || !e.status || 200 <= e.status && 300 > e.status ? b(d, a) : c(d)
                    };
                    e.send()
                } else c('error: href must be specified')
            }
        }, w = /Trident/.test(navigator.userAgent) ||
        /Edge\/\d./i.test(navigator.userAgent);
    k.prototype.f = function (a) {
        a = a.querySelectorAll('link[rel=import]');
        for (var b = 0, c = a.length; b < c; b++) this.o(a[b])
    };
    k.prototype.o = function (a) {
        var b = this, c = a.href;
        if (void 0 !== this.b[c]) {
            var d = this.b[c];
            d && d.__loaded && (a.import = d, this.m(a))
        } else this.c++, this.b[c] = 'pending', C.load(c, function (a, d) {
            a = b.D(a, d || c);
            b.b[c] = a;
            b.c--;
            b.f(a);
            b.s()
        }, function () {
            b.b[c] = null;
            b.c--;
            b.s()
        })
    };
    k.prototype.D = function (a, b) {
        if (!a) return document.createDocumentFragment();
        w && (a = a.replace(H,
            function (a, b, c) {
                return -1 === a.indexOf('type=') ? b + ' type=import-disable ' + c : a
            }));
        var c = document.createElement('template');
        c.innerHTML = a;
        if (c.content) a = c.content; else for (a = document.createDocumentFragment(); c.firstChild;) a.appendChild(c.firstChild);
        if (c = a.querySelector('base')) b = f.i(c.getAttribute('href'), b), c.removeAttribute('href');
        for (var c = a.querySelectorAll('link[rel=import], link[rel=stylesheet][href][type=import-disable],\n    style:not([type]), link[rel=stylesheet][href]:not([type]),\n    script:not([type]), script[type="application/javascript"],\n    script[type="text/javascript"]'),
                 d = 0, e = 0, h = c.length, g; e < h && (g = c[e]); e++) q(g), f.A(g, b), g.setAttribute('import-dependency', ''), 'script' === g.localName && !g.src && g.textContent && (g.setAttribute('src', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(g.textContent + ('\n//# sourceURL=' + b + (d ? '-' + d : '') + '.js\n'))), g.textContent = '', d++);
        return a
    };
    k.prototype.s = function () {
        var a = this;
        if (!this.c) {
            this.h.disconnect();
            this.flatten(document);
            var b = !1, c = !1, d = function () {
                c && b && (a.f(document), a.c || (a.h.observe(document.head, {childList: !0, subtree: !0}),
                    a.B()))
            };
            this.G(function () {
                c = !0;
                d()
            });
            this.F(function () {
                b = !0;
                d()
            })
        }
    };
    k.prototype.flatten = function (a) {
        a = a.querySelectorAll('link[rel=import]');
        for (var b = 0, c = a.length, d; b < c && (d = a[b]); b++) {
            var e = this.b[d.href];
            (d.import = e) && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && (this.b[d.href] = d, d.readyState = 'loading', d.import = d, this.flatten(e), d.appendChild(e))
        }
    };
    k.prototype.F = function (a) {
        function b(e) {
            if (e < d) {
                var h = c[e], g = document.createElement('script');
                h.removeAttribute('import-dependency');
                for (var r = 0, f = h.attributes.length; r <
                f; r++) g.setAttribute(h.attributes[r].name, h.attributes[r].value);
                x = g;
                h.parentNode.replaceChild(g, h);
                q(g, function () {
                    x = null;
                    b(e + 1)
                })
            } else a()
        }

        var c = document.querySelectorAll('script[import-dependency]'), d = c.length;
        b(0)
    };
    k.prototype.G = function (a) {
        var b = document.querySelectorAll('style[import-dependency],\n    link[rel=stylesheet][import-dependency]'),
            c = b.length;
        if (c) for (var d = w && !!document.querySelector('link[rel=stylesheet][href][type=import-disable]'), e = {}, h = 0, g = b.length; h < g && (e.a = b[h]); e = {a: e.a},
            h++) {
            if (q(e.a, function (b) {
                    return function () {
                        b.a.removeAttribute('import-dependency');
                        --c || a()
                    }
                }(e)), d && e.a.parentNode !== document.head) {
                var f = document.createElement(e.a.localName);
                f.__appliedElement = e.a;
                f.setAttribute('type', 'import-placeholder');
                e.a.parentNode.insertBefore(f, e.a.nextSibling);
                for (f = l(e.a); f && l(f);) f = l(f);
                f.parentNode !== document.head && (f = null);
                document.head.insertBefore(e.a, f);
                e.a.removeAttribute('type')
            }
        } else a()
    };
    k.prototype.B = function () {
        for (var a = document.querySelectorAll('link[rel=import]'),
                 b = a.length - 1, c; 0 <= b && (c = a[b]); b--) this.m(c)
    };
    k.prototype.m = function (a) {
        a.__loaded || (a.__loaded = !0, a.import && (a.import.readyState = 'complete'), a.dispatchEvent(z(a.import ? 'load' : 'error', {
            bubbles: !1,
            cancelable: !1,
            detail: void 0
        })))
    };
    k.prototype.C = function (a) {
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            if (c.addedNodes) for (var d = 0; d < c.addedNodes.length; d++) {
                var e = c.addedNodes[d];
                e && e.nodeType === Node.ELEMENT_NODE && (p(e) ? this.o(e) : this.f(e))
            }
        }
    };
    if (v) {
        for (var m = document.querySelectorAll('link[rel=import]'), y = 0,
                 I = m.length, t; y < I && (t = m[y]); y++) t.import && 'loading' === t.import.readyState || (t.__loaded = !0);
        m = function (a) {
            a = a.target;
            p(a) && (a.__loaded = !0)
        };
        document.addEventListener('load', m, !0);
        document.addEventListener('error', m, !0)
    } else {
        var n = Object.getOwnPropertyDescriptor(Node.prototype, 'baseURI');
        Object.defineProperty((!n || n.configurable ? Node : Element).prototype, 'baseURI', {
            get: function () {
                var a = p(this) ? this : l(this);
                return a ? a.href : n && n.get ? n.get.call(this) : (document.querySelector('base') || window.location).href
            },
            configurable: !0, enumerable: !0
        });
        A(function () {
            return new k
        })
    }
    B(function () {
        return document.dispatchEvent(z('HTMLImportsLoaded', {cancelable: !0, bubbles: !0, detail: void 0}))
    });
    u.useNative = v;
    u.whenReady = B;
    u.importForElement = l
})(window.HTMLImports = window.HTMLImports || {});

//# sourceMappingURL=html-custom.js.min.js.map