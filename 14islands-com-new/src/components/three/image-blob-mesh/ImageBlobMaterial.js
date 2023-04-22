import { ShaderMaterial, Color, Vector2 } from 'three'
import { extend } from '@react-three/fiber'

import vertexShader from './shader.vert'
import fragmentShader from './shader.frag'

class ImageBlobMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_pixelRatio: { value: 1 },
        u_texture: { value: null },
        u_hasTexture: { value: 0 },
        u_color: { value: new Color('#000') },
        u_time: { value: 0 },
        u_transitionTime: { value: 0 },
        u_blobEffect: { value: 0 },
        u_edgeEffect: { value: 0 },
        u_imgZoom: { value: 0 },
        u_imgOpacity: { value: 1 },
        u_res: { value: new Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new Vector2() },
        u_vmouse: { value: new Vector2() },
        u_planeSize: { value: new Vector2(1, 1) },
        u_imageSize: { value: new Vector2(1, 1) },
        u_inViewport: { value: 0 },
      },
    })
  }

  set pixelRatio(value) {
    this.uniforms.u_pixelRatio.value = value.toFixed(1)
  }
  get pixelRatio() {
    return this.uniforms.u_pixelRatio.value
  }

  set inViewport(value) {
    this.uniforms.u_inViewport.value = value
  }
  get inViewport() {
    return this.uniforms.u_inViewport.value
  }

  set map(value) {
    this.uniforms.u_hasTexture.value = !!value
    this.uniforms.u_texture.value = value
  }
  get map() {
    return this.uniforms.u_texture.value
  }

  set imageSize({ width, height }) {
    this.uniforms.u_imageSize.value.x = width
    this.uniforms.u_imageSize.value.y = height
  }
  get imageSize() {
    return this.uniforms.u_texture.value
  }

  get color() {
    return this.uniforms.u_color.value
  }
  set colorHex(hexValue) {
    this.uniforms.u_color.value = new Color(hexValue)
  }

  get time() {
    return this.uniforms.u_time.value
  }
  set time(value) {
    this.uniforms.u_time.value = value
  }

  get transitionTime() {
    return this.uniforms.u_transitionTime.value
  }
  set transitionTime(value) {
    this.uniforms.u_transitionTime.value = value
  }

  get blobEffect() {
    return this.uniforms.u_blobEffect.value
  }
  set blobEffect(value) {
    this.uniforms.u_blobEffect.value = value
  }

  get imgZoom() {
    return this.uniforms.u_imgZoom.value
  }
  set imgZoom(value) {
    this.uniforms.u_imgZoom.value = value
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

  get edgeEffect() {
    return this.uniforms.u_edgeEffect.value
  }
  set edgeEffect(value) {
    this.uniforms.u_edgeEffect.value = value
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

  get vmouse() {
    return this.uniforms.u_vmouse.value
  }
  set vmouse({ x, y }) {
    x && (this.uniforms.u_vmouse.value.x = x)
    y && (this.uniforms.u_vmouse.value.y = y)
  }

  set = function(uniform, value) {
    this.uniforms[uniform].value = value
  }
  get = function(uniform) {
    return this.uniforms[uniform].value
  }
}

extend({ ImageBlobMaterial })
