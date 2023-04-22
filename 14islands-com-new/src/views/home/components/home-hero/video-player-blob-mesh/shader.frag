export default "#define GLSLIFY 1\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0_0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0_0,p0_0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0_0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0_0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\nfloat circle(in vec2 _st, in float _radius, in float blurriness){\n  vec2 dist = _st;\n  return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);\n}\n\n// signed distance to a 2D triangle\nfloat sdTriangle( in vec2 p0, in vec2 p1, in vec2 p2, in vec2 p )\n{\n\tvec2 e0 = p1 - p0;\n\tvec2 e1 = p2 - p1;\n\tvec2 e2 = p0 - p2;\n\n\tvec2 v0 = p - p0;\n\tvec2 v1 = p - p1;\n\tvec2 v2 = p - p2;\n\n\tvec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );\n\tvec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );\n\tvec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );\n\n    float s = sign( e0.x*e2.y - e0.y*e2.x );\n    vec2 d = min( min( vec2( dot( pq0, pq0 ), s*(v0.x*e0.y-v0.y*e0.x) ),\n                       vec2( dot( pq1, pq1 ), s*(v1.x*e1.y-v1.y*e1.x) )),\n                       vec2( dot( pq2, pq2 ), s*(v2.x*e2.y-v2.y*e2.x) ));\n\n\treturn -sqrt(d.x)*sign(d.y);\n}\n\n// with four individual corner sizes\nfloat sdRoundBox( in vec2 p, in vec2 b, in vec4 r )\n{\n    r.xy = (p.x>0.0)?r.xy : r.zw;\n    r.x  = (p.y>0.0)?r.x  : r.y;\n\n    vec2 q = abs(p)-b+r.x;\n    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;\n}\n\n// Manual antialias of the Plane geometry.... *sigh*\n\n// Must be a more smart way :)\nfloat antialiasPlane(vec2 uv) {\n\n  uv = (2.0 * uv - 1.0); // -1.0 .. 1.0\n\n  // mask each side\n  float topMask = 1.0 - uv.y;\n  float bottomMask = uv.y + 1.0;\n  float leftMask = uv.x + 1.0;\n  float rightMask = 1.0 - uv.x;\n\n  // combine masks\n  float squareMask = topMask * bottomMask * leftMask * rightMask;\n\n  // calc antialias\n  #if __VERSION__ == 300\n    float delta = fwidth(squareMask) * 1.14;\n    return smoothstep(0.0, 0. + delta, squareMask);\n  #else\n    return 1.0;\n  #endif\n}\n\nuniform float u_pixelRatio;\nuniform float u_time;\nuniform float u_imgOpacity;\nuniform vec3 u_color;\nuniform vec2 u_res;\nuniform vec2 u_mouse;\nuniform vec2 u_planeSize;\nuniform vec2 u_imageSize;\nuniform sampler2D u_texture;\nuniform float u_hasTexture;\nuniform float u_transition;\nuniform float u_blobSize;\nuniform float u_blobVisible;\n\nvarying vec2 v_uv;\nvarying float v_n;\nvarying float v_cursorNoise;\nvarying float v_frameEdgeEffect;\n\nfloat roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness)\n{\n  float d = length(max(abs(uv - pos), size) - size) - radius;\n  return smoothstep(0.66, 0.33, d / thickness * 5.0);\n}\n\nvoid main() {\n  // Get pixel coordinate\n  vec2 res = u_res * u_pixelRatio;\n  float ratio = u_res.y / u_res.x;\n\n  // Fragment position\n  vec2 pos = gl_FragCoord.xy / res.xy - vec2(0.5);\n  vec2 st = vec2(pos.xy);\n  st.y *= ratio; // adjust to screen aspect ratio\n\n  // CSS-style `background-size: cover` for an image texture in a GLSL shader\n  // https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44\n  vec2 s = u_planeSize; // Screen\n  vec2 i = u_imageSize; // Image\n  float rs = s.x / s.y;\n  float ri = i.x / i.y;\n  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);\n  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;\n  vec2 uv = v_uv * s / new + offset;\n\n  // sample image color\n  vec4 image = texture2D(u_texture, uv);\n\n  // calculate position and adjust for plane aspect ratio\n  float planeRatio = u_planeSize.y / u_planeSize.x;\n  vec2 uvPos = (2.0 * v_uv - 1.0); // -1.0 .. 1.0\n  uvPos.y *= planeRatio;\n\n  // float time = 1. - (cos(u_time) + 1.) * 0.5; // debug\n  float transition = u_transition;\n        transition = mix(transition, 0.8, v_frameEdgeEffect);\n\n  // create rounded rectangle mask\n  vec2 startSize = vec2(0.0);\n  vec2 endSize = vec2(1.0, planeRatio);\n  vec2 size = mix(startSize, endSize, smoothstep(0.45, 1.0, transition));\n\n  float startBlur = .00001;\n  float midBlur = 3.0;\n  float endBlur = .000001;\n  float blur = mix(startBlur, midBlur, smoothstep(0.2, 0.5, transition));\n  blur = mix(blur, endBlur, smoothstep(0.5, 1.0, transition));\n\n  float r = roundedRectangle(uvPos, vec2(0.), size, .0, blur) * 2.6;\n\n  // create noise mask with noise from vertex shader\n  float n = v_n - 1.0; // MUCH FASTER to do noise in vertex shader instead\n\n  ////////////////////////////////\n  // BLOB CURSOR\n  ////////////////////////////////\n\n  // We readjust the mouse coordinates\n  vec2 mouse = u_mouse * -.5;\n  mouse.y *= ratio; // adjust to screen aspect ratio\n  vec2 mousePos = st + mouse;\n\n  float blobSize = clamp(mix(0.0, .005, u_blobSize * u_blobVisible), 0.0, 1.0);\n\n  float blobEffect = 0.6;\n\n  // create circular mask\n  float blobCircle = circle(mousePos, blobSize, blobEffect) * 2.5;\n\n  // Noise mask\n  float blobNoise = v_cursorNoise - 1.0; // MUCH FASTER to do noise in vertex shader instead\n\n  // ANTIALIAS BLOB\n  float cursorMask = blobNoise + blobCircle;\n  #if __VERSION__ == 300\n    float cursorAA = fwidth(cursorMask) * 1.5;\n    cursorMask = smoothstep(.5 - cursorAA, 0.5, cursorMask);\n  #else\n    cursorMask = smoothstep(0.4, 0.5, cursorMask);\n  #endif\n\n  ////////////////////////////////\n\n  vec3 videoColor = mix(image.rgb, u_color, cursorMask);\n\n  // anti-alias blob frame\n  float finalMask;\n  float mask = n + r;\n  #if __VERSION__ == 300\n    float delta = fwidth(mask) * 1.0;\n    finalMask = smoothstep(.5 - delta, 0.5, mask);\n  #else\n    finalMask = smoothstep(0.4, 0.5, mask);\n  #endif\n\n  // ANTIALIAS plane geometry\n  float squareMask = antialiasPlane(v_uv);\n\n  // fade from black to texture towards end of animation\n  vec3 color = mix(vec3(0.), videoColor, smoothstep(0.7, 1.0, transition));\n\n  gl_FragColor = vec4(color, squareMask * finalMask);\n}\n";