import { ShaderMaterial, Vector2, Color } from 'three'
import { extend } from '@react-three/fiber'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

class TransitionBlobMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_color: { value: new Color() },
        u_color2: { value: new Color(0x00ff00) },
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_speed: { value: 1 },
        u_res: { value: new Vector2() },
        u_startPosition: { value: new Vector2() },
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
    })
    this.speed = 1
  }

  set color(value) {
    this.uniforms.u_color.value.setStyle(value)
  }
  get color() {
    return this.uniforms.u_color.value.getStyle()
  }

  set color2(value) {
    this.uniforms.u_color2.value.setStyle(value)
  }
  get color2() {
    return this.uniforms.u_color2.value.getStyle()
  }

  set speed(value) {
    this.uniforms.u_speed.value = value
  }
  get speed() {
    return this.uniforms.u_speed.value
  }

  get time() {
    return this.uniforms.u_time.value
  }
  set time(value) {
    this.uniforms.u_time.value = value
  }
  set addTime(value) {
    this.uniforms.u_time.value += value * this.speed
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

  get progress() {
    return this.uniforms.u_progress.value
  }
  set progress(value) {
    this.uniforms.u_progress.value = value
  }
}

extend({ TransitionBlobMaterial })
