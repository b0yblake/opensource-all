"use strict";
(self.webpackChunkexcalidraw = self.webpackChunkexcalidraw || []).push([
    [528], {
        528: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return c
                }
            });
            var r = n(4165),
                a = n(531),
                c = function() {
                    var e = (0, a.Z)((0, r.Z)().mark((function e(t) {
                        var n, a, c, s, i, u, l, p, o, d = arguments;
                        return (0, r.Z)().wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (n = d.length > 1 && void 0 !== d[1] ? d[1] : [{}], a = d.length > 2 && void 0 !== d[2] ? d[2] : null, c = d.length > 3 && void 0 !== d[3] && d[3], s = d.length > 4 && void 0 !== d[4] ? d[4] : null, Array.isArray(n) || (n = [n]), n[0].fileName = n[0].fileName || "Untitled", i = [], u = null, t instanceof Blob && t.type ? u = t.type : t.headers && t.headers.get("content-type") && (u = t.headers.get("content-type")), n.forEach((function(e, t) {
                                            i[t] = {
                                                description: e.description || "",
                                                accept: {}
                                            }, e.mimeTypes ? (0 === t && u && e.mimeTypes.push(u), e.mimeTypes.map((function(n) {
                                                i[t].accept[n] = e.extensions || []
                                            }))) : u && (i[t].accept[u] = e.extensions || [])
                                        })), !a) {
                                        e.next = 17;
                                        break
                                    }
                                    return e.prev = 8, e.next = 11, a.getFile();
                                case 11:
                                    e.next = 17;
                                    break;
                                case 13:
                                    if (e.prev = 13, e.t0 = e.catch(8), a = null, !c) {
                                        e.next = 17;
                                        break
                                    }
                                    throw e.t0;
                                case 17:
                                    if (e.t1 = a, e.t1) {
                                        e.next = 22;
                                        break
                                    }
                                    return e.next = 21, window.showSaveFilePicker({
                                        suggestedName: n[0].fileName,
                                        id: n[0].id,
                                        startIn: n[0].startIn,
                                        types: i,
                                        excludeAcceptAllOption: n[0].excludeAcceptAllOption || !1
                                    });
                                case 21:
                                    e.t1 = e.sent;
                                case 22:
                                    return l = e.t1, !a && s && s(), e.next = 26, l.createWritable();
                                case 26:
                                    if (p = e.sent, !("stream" in t)) {
                                        e.next = 32;
                                        break
                                    }
                                    return o = t.stream(), e.next = 31, o.pipeTo(p);
                                case 31:
                                    return e.abrupt("return", l);
                                case 32:
                                    if (!("body" in t)) {
                                        e.next = 38;
                                        break
                                    }
                                    return e.next = 35, t.body.pipeTo(p);
                                case 35:
                                    e.t2 = l, e.next = 47;
                                    break;
                                case 38:
                                    return e.t3 = p, e.next = 41, t;
                                case 41:
                                    return e.t4 = e.sent, e.next = 44, e.t3.write.call(e.t3, e.t4);
                                case 44:
                                    return e.next = 46, p.close();
                                case 46:
                                    e.t2 = l;
                                case 47:
                                    return e.abrupt("return", e.t2);
                                case 48:
                                case "end":
                                    return e.stop()
                            }
                        }), e, null, [
                            [8, 13]
                        ])
                    })));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }()
        }
    }
]);
//# sourceMappingURL=528.e83531d5.chunk.js.map