import { Application, Assets, BitmapFont } from 'pixi.js'
import manifest from '@/shared/manifest.json'

class SceneClass {
  readonly app = new Application()

  async setup() {
    await Promise.all([
      this.setupApp(),
      this.setupAssets(),
    ])

    await this.loadAssets()

    this.setupFont()
  }

  private async setupApp() {
    await this.app.init({
      hello: true,
      resizeTo: window,
      resolution: window.devicePixelRatio,
      preference: 'webgl',
      webgl: {
        antialias: true,
        roundPixels: true,
      },
    })

    this.app.canvas.style.maxWidth = '100vw'
    this.app.canvas.style.maxHeight = '100vh'

    // @ts-expect-error pixi devTools setup
    globalThis.__PIXI_APP__ = this.app
  }

  private async setupAssets() {
    return Assets.init({
      manifest,
      basePath: 'assets',
    })
  }

  private async loadAssets() {
    return Promise.all([
      Assets.loadBundle('shared'),
    ])
  }

  private setupFont() {
    const font: FontFace = Assets.get('PixelifySans.ttf')

    BitmapFont.install({
      name: 'PixelFont',
      style: {
        fontFamily: font.family,
        fontSize: 60,
        fill: '#ffffff',
      },
    })
  }
}

export const Scene = new SceneClass()
