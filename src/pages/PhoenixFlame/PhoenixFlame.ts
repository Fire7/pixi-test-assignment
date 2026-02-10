import type { Ticker } from 'pixi.js'
import { Geometry, Mesh, Shader } from 'pixi.js'
import { Scene } from '@/shared/Scene'
import { Screen } from '@/shared/Screen'
import fragment from './lib/shaderToy.frag?raw'
import vertex from './lib/shaderToy.vert?raw'

export class PhoenixFlame extends Screen {
  private shader!: Shader
  private quad!: Mesh<Geometry, Shader>

  load() {
    this.setup()
    return Promise.resolve()
  }

  private setup() {
    const width = 1
    const height = 1

    const quadGeometry = new Geometry({
      attributes: {
        aPosition: [
          -1,
          -1, // x, y
          1,
          -1, // x, y
          1,
          1, // x, y,
          -1,
          1, // x, y,
        ],
        aUV: [0, 0, 1, 0, 1, 1, 0, 1],
      },
      indexBuffer: [0, 1, 2, 0, 2, 3],
    })

    this.shader = Shader.from({
      gl: {
        vertex,
        fragment,
      },
      resources: {
        shaderToyUniforms: {
          iResolution: { value: [width * window.devicePixelRatio, height * window.devicePixelRatio], type: 'vec3<f32>' },
          iTime: { value: 0, type: 'f32' },
        },
      },
    })

    this.quad = new Mesh({
      geometry: quadGeometry,
      shader: this.shader,
    })

    this.quad.width = width
    this.quad.height = height
    this.quad.x = width / 2
    this.quad.y = height / 2

    this.addChild(this.quad)
  }

  resize(width: number, height: number) {
    this.quad.width = width
    this.quad.height = height
    this.quad.x = width / 2
    this.quad.y = height / 2

    this.shader.resources.shaderToyUniforms.uniforms.iResolution = [
      width * window.devicePixelRatio,
      height * window.devicePixelRatio,
    ]
  }

  onShow() {
    Scene.app.ticker.add(this.update, this)
  }

  onHide() {
    Scene.app.ticker.remove(this.update, this)
  }

  private update(ticker: Ticker) {
    this.shader.resources.shaderToyUniforms.uniforms.iTime
      += ticker.elapsedMS / 1000
  }
}
