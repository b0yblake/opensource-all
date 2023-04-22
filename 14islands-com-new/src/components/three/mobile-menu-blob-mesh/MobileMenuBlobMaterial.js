import { ShaderMaterial, Vector2, Color } from 'three'
import { extend } from '@react-three/fiber'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

class MobileMenuBlobMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_coverColor: { value: new Color(0x000000) },
        u_waveColor: { value: new Color(0xffffff) },
        u_time: { value: 0 },
        u_waveTime: { value: 0 },
        u_coverProgress: { value: 0 },
        u_waveProgress: { value: 0 },
        u_waveRest: { value: 0.5 },
        u_res: { value: new Vector2() },
        u_startPosition: { value: new Vector2() },
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
    })
    this.speed = 1
  }

  set coverColor(value) {
    this.uniforms.u_coverColor.value.setStyle(value)
  }
  get coverColor() {
    return this.uniforms.u_coverColor.value.getStyle()
  }

  set waveColor(value) {
    this.uniforms.u_waveColor.value.setStyle(value)
  }
  get waveColor() {
    return this.uniforms.u_waveColor.value.getStyle()
  }

  set waveRest(value) {
    this.uniforms.u_waveRest.value = value
  }
  get waveRest() {
    return this.uniforms.u_waveRest.value
  }

  get time() {
    return this.uniforms.u_time.value
  }
  set time(value) {
    this.uniforms.u_time.value = value
  }

  get waveTime() {
    return this.uniforms.u_waveTime.value
  }
  set waveTime(value) {
    this.uniforms.u_waveTime.value = value
  }

  get resolution() {
    return this.uniforms.u_res.value
  }
  set resolution({ width, height }) {
    this.uniforms.u_res.value.x = width
    this.uniforms.u_res.value.y = height
  }

  get startPosition() {
    return this.uniforms.u_startPosition.value
  }
  set startPosition({ x, y }) {
    this.uniforms.u_startPosition.value.x = x
    this.uniforms.u_startPosition.value.y = y
  }

  get coverProgress() {
    return this.uniforms.u_coverProgress.value
  }
  set coverProgress(value) {
    this.uniforms.u_coverProgress.value = value
  }

  get waveProgress() {
    return this.uniforms.u_waveProgress.value
  }
  set waveProgress(value) {
    this.uniforms.u_waveProgress.value = value
  }
}

extend({ MobileMenuBlobMaterial })
