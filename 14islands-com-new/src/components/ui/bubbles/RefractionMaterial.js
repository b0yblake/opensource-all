import { ShaderMaterial, Vector2, Color } from 'three'
import { extend } from '@react-three/fiber'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

export default class RefractionMaterial extends ShaderMaterial {
  constructor(options) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_texture: { value: null },
        envMap: { value: options?.envMap },
        resolution: { value: options?.resolution || new Vector2() },
        u_time: { value: 0 },
        u_index: { value: 0 },
        u_opacity: { value: 1 },
        u_scroll: { value: 0 },
        u_freq: { value: 1.0 },
        u_speed: { value: 1.0 },
        u_startOffset: { value: 0.0 },
        u_edgeColor: { value: new Color('#ddd') },
        u_edgeOpacity: { value: 0.6 },
        u_edgeSize: { value: 3 },
        u_textureOpacity: { value: 0.6 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
  }

  set edgeColor(hex) {
    this.uniforms.u_edgeColor.value.setStyle(hex)
  }
  get edgeColor() {
    return this.uniforms.u_edgeColor.value
  }

  set edgeSize(val) {
    this.uniforms.u_edgeSize.value = val
  }
  get edgeSize() {
    return this.uniforms.u_edgeSize.value
  }

  set textureOpacity(val) {
    this.uniforms.u_textureOpacity.value = val
  }
  get textureOpacity() {
    return this.uniforms.u_textureOpacity.value
  }

  set frequency(map) {
    this.uniforms.u_freq.value = map
  }
  get frequency() {
    return this.uniforms.u_freq.value
  }

  set speed(val) {
    this.uniforms.u_speed.value = val
  }
  get speed() {
    return this.uniforms.u_speed.value
  }

  set startOffset(val) {
    this.uniforms.u_startOffset.value = val
  }
  get startOffset() {
    return this.uniforms.u_startOffset.value
  }

  set map(map) {
    this.uniforms.u_texture.value = map
  }
  get map() {
    return this.uniforms.u_texture.value
  }

  set envMap(map) {
    this.uniforms.envMap.value = map
  }
  set resolution([x, y]) {
    this.uniforms.resolution.value.set(x, y)
  }

  get time() {
    return this.uniforms.u_time.value
  }
  set time(value) {
    this.uniforms.u_time.value = value
  }

  get index() {
    return this.uniforms.u_index.value
  }
  set index(value) {
    this.uniforms.u_index.value = value
  }

  set fade(value) {
    this.uniforms.u_opacity.value = value
  }
  get fade() {
    return this.uniforms.u_opacity.value
  }

  set scroll(value) {
    this.uniforms.u_scroll.value = value
  }
  get scroll() {
    return this.uniforms.u_scroll.value
  }
}

extend({ RefractionMaterial })
