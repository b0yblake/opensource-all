import { ShaderMaterial, Vector2 } from 'three'
import { extend } from '@react-three/fiber'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

class HomeHeroMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_pixelRatio: { value: 1 },
        u_texture: { value: null },
        u_hasTexture: { value: 0 },
        u_time: { value: 0 },
        u_edgeEffect: { value: 0 },
        u_blobVisible: { value: 0 },
        u_imgOpacity: { value: 0 },
        u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new Vector2() },
        u_vmouse: { value: new Vector2(0, 0) },
        u_planeSize: { value: new Vector2(1, 1) },
        u_imageSize: { value: new Vector2(1, 1) },
        u_transition: { value: 0 },
        u_isPlayingShowreel: { value: 0 },
        u_blobSize: { value: 1 },
        u_cinemaTransition: { value: 0 },
      },
    })
  }

  get isPlayingShowreel() {
    return this.uniforms.u_isPlayingShowreel.value
  }
  set isPlayingShowreel(value) {
    this.uniforms.u_isPlayingShowreel.value = value
  }

  get blobSize() {
    return this.uniforms.u_blobSize.value
  }
  set blobSize(value) {
    this.uniforms.u_blobSize.value = value
  }

  get edgeEffect() {
    return this.uniforms.u_edgeEffect.value
  }
  set edgeEffect(value) {
    this.uniforms.u_edgeEffect.value = value
  }

  set pixelRatio(value) {
    this.uniforms.u_pixelRatio.value = value.toFixed(1)
  }
  get pixelRatio() {
    return this.uniforms.u_pixelRatio.value
  }

  set video(value) {
    this.uniforms.u_hasTexture.value = !!value
    this.uniforms.u_texture.value = value
    if (value) {
      this.uniforms.u_imageSize.value.x = value.image.width || value.image.videoWidth
      this.uniforms.u_imageSize.value.y = value.image.height || value.image.videoHeight
    }
  }
  get video() {
    return this.uniforms.u_texture.value
  }

  get time() {
    return this.uniforms.u_time.value
  }
  set time(value) {
    this.uniforms.u_time.value = value
  }

  get cursorVisible() {
    return this.uniforms.u_blobVisible.value
  }
  set cursorVisible(value) {
    this.uniforms.u_blobVisible.value = value
  }

  get planeSize() {
    return this.uniforms.u_planeSize.value
  }
  set planeSize({ width, height }) {
    this.uniforms.u_planeSize.value.x = width
    this.uniforms.u_planeSize.value.y = height
  }

  get resolution() {
    return this.uniforms.u_res.value
  }
  set resolution({ width, height }) {
    this.uniforms.u_res.value.x = width
    this.uniforms.u_res.value.y = height
  }

  get imgOpacity() {
    return this.uniforms.u_imgOpacity.value
  }
  set imgOpacity(value) {
    this.uniforms.u_imgOpacity.value = value
  }

  get mouse() {
    return this.uniforms.u_mouse.value
  }
  set mouse({ x, y }) {
    x && (this.uniforms.u_mouse.value.x = x)
    y && (this.uniforms.u_mouse.value.y = y)
  }

  get transition() {
    return this.uniforms.u_transition.value
  }
  set transition(value) {
    this.uniforms.u_transition.value = value
  }

  get cinemaTransition() {
    return this.uniforms.u_cinemaTransition.value
  }
  set cinemaTransition(value) {
    this.uniforms.u_cinemaTransition.value = value
  }

  get vmouse() {
    return this.uniforms.u_vmouse.value
  }
  set vmouse({ x, y }) {
    x && (this.uniforms.u_vmouse.value.x = x)
    y && (this.uniforms.u_vmouse.value.y = y)
  }

  // set = function (uniform, value) {
  //   this.uniforms[uniform].value = value
  // }
  // get = function (uniform) {
  //   return this.uniforms[uniform].value
  // }
}

extend({ HomeHeroMaterial })
