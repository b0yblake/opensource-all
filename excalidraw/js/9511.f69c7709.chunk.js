"use strict";
(self.webpackChunkexcalidraw = self.webpackChunkexcalidraw || []).push([
    [9511], {
        9511: function(e, t, r) {
            r.r(t), r.d(t, {
                default: function() {
                    return s
                }
            });
            var n = r(2982),
                a = r(4165),
                i = r(531);

            function u(e) {
                function t(e) {
                    if (Object(e) !== e) return Promise.reject(new TypeError(e + " is not an object."));
                    var t = e.done;
                    return Promise.resolve(e.value).then((function(e) {
                        return {
                            value: e,
                            done: t
                        }
                    }))
                }
                return (u = function(e) {
                    this.s = e, this.n = e.next
                }).prototype = {
                    s: null,
                    n: null,
                    next: function() {
                        return t(this.n.apply(this.s, arguments))
                    },
                    return: function(e) {
                        var r = this.s.return;
                        return void 0 === r ? Promise.resolve({
                            value: e,
                            done: !0
                        }) : t(r.apply(this.s, arguments))
                    },
                    throw: function(e) {
                        var r = this.s.return;
                        return void 0 === r ? Promise.reject(e) : t(r.apply(this.s, arguments))
                    }
                }, new u(e)
            }
            var c = function() {
                    var e = (0, i.Z)((0, a.Z)().mark((function e(t, r) {
                        var i, s, o, l, f, p, v, h, d, w, b = arguments;
                        return (0, a.Z)().wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    i = b.length > 2 && void 0 !== b[2] ? b[2] : t.name, s = b.length > 3 ? b[3] : void 0, o = [], l = [], p = !1, v = !1, e.prev = 4, h = (0, a.Z)().mark((function e() {
                                        var n, u;
                                        return (0, a.Z)().wrap((function(e) {
                                            for (;;) switch (e.prev = e.next) {
                                                case 0:
                                                    n = d.value, u = "".concat(i, "/").concat(n.name), "file" === n.kind ? l.push(n.getFile().then((function(e) {
                                                        return e.directoryHandle = t, e.handle = n, Object.defineProperty(e, "webkitRelativePath", {
                                                            configurable: !0,
                                                            enumerable: !0,
                                                            get: function() {
                                                                return u
                                                            }
                                                        })
                                                    }))) : "directory" !== n.kind || !r || s && s(n) || o.push(c(n, r, u, s));
                                                case 2:
                                                case "end":
                                                    return e.stop()
                                            }
                                        }), e)
                                    })), w = function(e) {
                                        var t, r, n, a = 2;
                                        for ("undefined" != typeof Symbol && (r = Symbol.asyncIterator, n = Symbol.iterator); a--;) {
                                            if (r && null != (t = e[r])) return t.call(e);
                                            if (n && null != (t = e[n])) return new u(t.call(e));
                                            r = "@@asyncIterator", n = "@@iterator"
                                        }
                                        throw new TypeError("Object is not async iterable")
                                    }(t.values());
                                case 7:
                                    return e.next = 9, w.next();
                                case 9:
                                    if (!(p = !(d = e.sent).done)) {
                                        e.next = 14;
                                        break
                                    }
                                    return e.delegateYield(h(), "t0", 11);
                                case 11:
                                    p = !1, e.next = 7;
                                    break;
                                case 14:
                                    e.next = 19;
                                    break;
                                case 16:
                                    e.prev = 16, e.t1 = e.catch(4), v = !0, f = e.t1;
                                case 19:
                                    if (e.prev = 19, e.prev = 20, e.t2 = p && null != w.return, !e.t2) {
                                        e.next = 25;
                                        break
                                    }
                                    return e.next = 25, w.return();
                                case 25:
                                    if (e.prev = 25, !v) {
                                        e.next = 28;
                                        break
                                    }
                                    throw f;
                                case 28:
                                    return e.finish(25);
                                case 29:
                                    return e.finish(19);
                                case 30:
                                    return e.t3 = [], e.t4 = n.Z, e.next = 34, Promise.all(o);
                                case 34:
                                    return e.t5 = e.sent.flat(), e.t6 = (0, e.t4)(e.t5), e.t7 = n.Z, e.next = 39, Promise.all(l);
                                case 39:
                                    return e.t8 = e.sent, e.t9 = (0, e.t7)(e.t8), e.abrupt("return", e.t3.concat.call(e.t3, e.t6, e.t9));
                                case 42:
                                case "end":
                                    return e.stop()
                            }
                        }), e, null, [
                            [4, 16, 19, 30],
                            [20, , 25, 29]
                        ])
                    })));
                    return function(t, r) {
                        return e.apply(this, arguments)
                    }
                }(),
                s = function() {
                    var e = (0, i.Z)((0, a.Z)().mark((function e() {
                        var t, r, n = arguments;
                        return (0, a.Z)().wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return (t = n.length > 0 && void 0 !== n[0] ? n[0] : {}).recursive = t.recursive || !1, e.next = 4, window.showDirectoryPicker({
                                        id: t.id,
                                        startIn: t.startIn
                                    });
                                case 4:
                                    return r = e.sent, e.abrupt("return", c(r, t.recursive, void 0, t.skipDirectory));
                                case 6:
                                case "end":
                                    return e.stop()
                            }
                        }), e)
                    })));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }()
        }
    }
]);
//# sourceMappingURL=9511.f69c7709.chunk.js.map