"use strict";
(self.webpackChunkexcalidraw = self.webpackChunkexcalidraw || []).push([
    [2967], {
        7974: function() {
            ! function() {
                if ("onload" in XMLHttpRequest.prototype && !navigator.standalone) {
                    var e, t, n = !1,
                        r = ["standalone", "fullscreen", "minimal-ui"],
                        a = "#f8f9fa",
                        i = 24,
                        o = "HelveticaNeue-CondensedBold",
                        l = 128,
                        c = 48,
                        s = 20,
                        u = 120,
                        f = navigator.userAgent || "",
                        p = navigator.vendor && -1 !== navigator.vendor.indexOf("Apple") && (-1 !== f.indexOf("Mobile/") || "standalone" in navigator) || n,
                        d = Boolean(f.match(/(MSIE |Edge\/|Trident\/)/)),
                        h = "undefined" !== typeof Windows;
                    try {
                        t = sessionStorage
                    } catch (_) {}
                    t = t || {}, "complete" === document.readyState ? g() : window.addEventListener("load", g)
                }

                function m(e) {
                    try {
                        return document.head.querySelector(e)
                    } catch (_) {
                        return null
                    }
                }

                function v(e, n) {
                    var r = "__pwacompat_" + e;
                    return void 0 !== n && (t[r] = n), t[r]
                }

                function g() {
                    var t = (e = m('link[rel="manifest"]')) ? e.href : "";
                    if (!t) throw 'can\'t find <link rel="manifest" href=".." />\'';
                    var n = function(e) {
                            for (var t = function() {
                                    var t = e[n];
                                    try {
                                        return new URL("", t), {
                                            v: function(e) {
                                                return new URL(e || "", t).toString()
                                            }
                                        }
                                    } catch (_) {}
                                }, n = 0; n < e.length; ++n) {
                                var r = t();
                                if ("object" === typeof r) return r.v
                            }
                            return function(e) {
                                return e || ""
                            }
                        }([t, location]),
                        r = v("manifest");
                    if (r) try {
                        x(JSON.parse(r), n)
                    } catch (i) {
                        console.warn("PWACompat error", i)
                    } else {
                        var a = new XMLHttpRequest;
                        a.open("GET", t), a.withCredentials = "use-credentials" === e.getAttribute("crossorigin"), a.onload = function() {
                            try {
                                var e = JSON.parse(a.responseText);
                                v("manifest", a.responseText), x(e, n)
                            } catch (i) {
                                console.warn("PWACompat error", i)
                            }
                        }, a.send(null)
                    }
                }

                function w(e, t, n) {
                    if (!m(e + n)) {
                        var r = document.createElement(e);
                        for (var a in t) r.setAttribute(a, t[a]);
                        return document.head.appendChild(r), r
                    }
                }

                function b(e, t) {
                    t && (!0 === t && (t = "yes"), w("meta", {
                        name: e,
                        content: t
                    }, '[name="'.concat(e, '"]')))
                }

                function y(e) {
                    var t = e.sizes.split(/\s+/g).map((function(e) {
                        return "any" === e ? 1 / 0 : parseInt(e, 10) || 0
                    }));
                    return {
                        src: e.src,
                        type: e.type,
                        sizes: e.sizes,
                        largestSize: Math.max.apply(null, t),
                        purpose: e.purpose ? e.purpose.split(/\s+/g) : ["any"]
                    }
                }

                function x(t, f) {
                    var g, x = (t.icons || []).map(y).sort((function(e, t) {
                            return t.largestSize - e.largestSize
                        })),
                        T = x.filter((function(e) {
                            return e.purpose.indexOf("any") > -1
                        })),
                        z = x.filter((function(e) {
                            return e.purpose.indexOf("maskable") > -1
                        })),
                        A = (z.length > 0 ? z : T).map((function(e) {
                            var t = {
                                    rel: "icon",
                                    href: f(e.src),
                                    sizes: e.sizes
                                },
                                n = '[sizes="'.concat(e.sizes, '"]');
                            if (w("link", t, '[rel="icon"]' + n), p && !(e.largestSize < u)) return t.rel = "apple-touch-icon", w("link", t, '[rel="apple-touch-icon"]' + n)
                        })).filter(Boolean),
                        E = m('meta[name="viewport"]'),
                        I = E && E.content || "",
                        R = Boolean(I.match(/\bviewport-fit\s*=\s*cover\b/)),
                        M = t.display,
                        B = -1 !== r.indexOf(M);
                    if (b("mobile-web-app-capable", B), function(e, t) {
                            if (!p && !h) return;
                            var n = k(e);
                            if (p) {
                                b("apple-mobile-web-app-status-bar-style", t ? "black-translucent" : n ? "black" : "default")
                            } else {
                                var r = function() {
                                    try {
                                        return Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar
                                    } catch (_) {}
                                }();
                                if (!r) return;
                                var a = n ? 255 : 0;
                                r.foregroundColor = {
                                    r: a,
                                    g: a,
                                    b: a,
                                    a: 255
                                }, r.backgroundColor = function(e) {
                                    var t = S(e);
                                    return {
                                        r: t[0],
                                        g: t[1],
                                        b: t[2],
                                        a: t[3]
                                    }
                                }(e)
                            }
                        }(t.theme_color || "black", R), d) {
                        b("application-name", t.short_name), b("msapplication-tooltip", t.description), b("msapplication-starturl", f(t.start_url || ".")), b("msapplication-navbutton-color", t.theme_color);
                        var L = T[0];
                        L && b("msapplication-TileImage", f(L.src)), b("msapplication-TileColor", t.background_color)
                    }
                    if (b("theme-color", t.theme_color), !p) {
                        var N = (g = t.orientation, {
                            por: "portrait",
                            lan: "landscape"
                        }[String(g || "").substr(0, 3)] || "");
                        return b("x5-orientation", N), b("screen-orientation", N), void("fullscreen" === M ? (b("x5-fullscreen", "true"), b("full-screen", "yes")) : B && (b("x5-page-mode", "app"), b("browsermode", "application")))
                    }
                    var U = t.background_color || a,
                        D = k(U),
                        J = function(e) {
                            var t;
                            return (e || []).filter((function(e) {
                                return "itunes" === e.platform
                            })).forEach((function(e) {
                                if (e.id) t = e.id;
                                else {
                                    var n = e.url.match(/id(\d+)/);
                                    n && (t = n[1])
                                }
                            })), t
                        }(t.related_applications);

                    function P(r, a, u, f) {
                        var p = window.devicePixelRatio,
                            d = O({
                                width: r * p,
                                height: a * p
                            });
                        if (d.scale(p, p), d.fillStyle = U, d.fillRect(0, 0, r, a), d.translate(r / 2, (a - s) / 2), f) {
                            var h = f.width / p,
                                m = f.height / p;
                            m > l && (h /= m / l, m = l), h >= c && m >= c && (d.drawImage(f, h / -2, m / -2, h, m), d.translate(0, m / 2 + s))
                        }
                        d.fillStyle = D ? "white" : "black", d.font = "".concat(i, "px ").concat(o);
                        var v = getComputedStyle(e);
                        d.font = v.getPropertyValue("--pwacompat-splash-font");
                        var g = t.name || t.short_name || document.title,
                            w = d.measureText(g),
                            b = w.actualBoundingBoxAscent || i;
                        if (d.translate(0, b), w.width < .8 * r) d.fillText(g, w.width / -2, 0);
                        else
                            for (var y = g.split(/\s+/g), x = 1; x <= y.length; ++x) {
                                var S = y.slice(0, x).join(" "),
                                    k = d.measureText(S).width;
                                (x === y.length || k > .6 * r) && (d.fillText(S, k / -2, 0), d.translate(0, 1.2 * b), y.splice(0, x), x = 0)
                            }
                        return function() {
                            var e = d.canvas.toDataURL();
                            if (n) {
                                var t = document.createElement("img");
                                t.src = e, document.body.append(t)
                            }
                            return V(u, e), e
                        }
                    }

                    function V(e, t) {
                        var n = document.createElement("link");
                        n.setAttribute("rel", "apple-touch-startup-image"), n.setAttribute("media", "(orientation: ".concat(e, ")")), n.setAttribute("href", t), document.head.appendChild(n)
                    }
                    J && b("apple-itunes-app", "app-id=".concat(J)), b("apple-mobile-web-app-capable", B), b("apple-mobile-web-app-title", t.short_name || t.name);
                    var W = v("iOS");
                    if (!n && W) try {
                        var q = JSON.parse(W);
                        return V("portrait", q.p), V("landscape", q.l), void A.forEach((function(e) {
                            var t = q.i[e.href];
                            t && (e.href = t)
                        }))
                    } catch (_) {}
                    var H = {
                        i: {}
                    };

                    function j(e, t) {
                        var n = window.screen,
                            r = P(n.width, n.height, "portrait", e),
                            a = P(n.height, n.width, "landscape", e);
                        setTimeout((function() {
                            H.p = r(), setTimeout((function() {
                                H.l = a(), t()
                            }), 10)
                        }), 10)
                    }

                    function X() {
                        v("iOS", JSON.stringify(H))
                    }! function e() {
                        var n = A.shift();
                        if (n) {
                            var r = new Image;
                            r.crossOrigin = "anonymous", r.onerror = function() {
                                e()
                            }, r.onload = function() {
                                r.onload = null, j(r, (function() {
                                    var e = t.background_color && C(r, U);
                                    e ? (n.href = e, H.i[r.src] = e, function(e) {
                                        var t = A.length + 1,
                                            n = function() {
                                                --t || e()
                                            };
                                        n(), A.forEach((function(e) {
                                            var t = new Image;
                                            t.crossOrigin = "anonymous", t.onerror = n, t.onload = function() {
                                                t.onload = null, e.href = C(t, U, !0), H.i[t.src] = e.href, n()
                                            }, t.src = e.href
                                        }))
                                    }(X)) : X()
                                }))
                            }, r.src = n.href
                        } else j(null, X)
                    }()
                }

                function S(e) {
                    var t = O();
                    return t.fillStyle = e, t.fillRect(0, 0, 1, 1), t.getImageData(0, 0, 1, 1).data || []
                }

                function k(e) {
                    var t = S(e).map((function(e) {
                            var t = e / 255;
                            return t < .03928 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
                        })),
                        n = .2126 * t[0] + .7152 * t[1] + .0722 * t[2];
                    return Math.abs(1.05 / (n + .05)) > 3
                }

                function C(e, t) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                        r = O(e);
                    if ((r.drawImage(e, 0, 0), !n) && 255 === r.getImageData(0, 0, 1, 1).data[3]) return;
                    return r.globalCompositeOperation = "destination-over", r.fillStyle = t, r.fillRect(0, 0, e.width, e.height), r.canvas.toDataURL()
                }

                function O() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                            width: 1,
                            height: 1
                        },
                        t = e.width,
                        n = e.height,
                        r = document.createElement("canvas");
                    return r.width = t, r.height = n, r.getContext("2d")
                }
            }()
        }
    }
]);
//# sourceMappingURL=pwacompat.4c701050.chunk.js.map