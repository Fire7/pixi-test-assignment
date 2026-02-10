// General (high-level) game logic :
import type { Screen } from '@/shared/Screen'
import { Assets, Container, TilingSprite } from 'pixi.js'
import { AceOfShadows } from '@/pages/AceOfShadows'
import { MagicWords } from '@/pages/MagicWords'
import { PhoenixFlame } from '@/pages/PhoenixFlame'
import { Scene } from '@/shared/Scene'
import { Menu } from '@/widgets/menu'

const GAP = 20
const SCREEN_TOP_GAP = 50 + GAP

class AppControllerClass {
  constructor() {
    ;(window as any).$app = this
  }

  private menu!: Menu

  private activeScreen!: 'AceOfShadows' | 'MagicWords' | 'PhoenixFlame'
  private screens!: Record<'AceOfShadows' | 'MagicWords' | 'PhoenixFlame', Screen>
  private screenContainer = new Container({ label: 'screen', y: SCREEN_TOP_GAP, x: GAP })

  private bgSprite!: TilingSprite

  get canvas() {
    return Scene.app.canvas
  }

  async setup() {
    await Scene.setup() // init application, load shared resources

    this.menu = new Menu({
      label: 'menu',
      items: [
        { value: 'AceOfShadows', label: 'Ace of Shadows' },
        { value: 'MagicWords', label: 'Magic Words' },
        { value: 'PhoenixFlame', label: 'Phoenix Flame' },
      ],
      x: GAP,
      y: GAP,
    })

    // init screens
    this.screens = {
      AceOfShadows: new AceOfShadows({ visible: false }),
      MagicWords: new MagicWords({ visible: false }),
      PhoenixFlame: new PhoenixFlame({ visible: false }),
    }

    const screens = Object.values(this.screens)

    // load screens assets
    await Promise.all(screens.map(screen => screen.load()))

    this.attachEvents()

    // add objects to the scene
    this.screenContainer.addChild(...screens)
    this.bgSprite = new TilingSprite({ texture: Assets.get('bgPattern'), tileScale: { x: 0.5, y: 0.5 } })

    Scene.app.stage.addChild(
      this.bgSprite,
      this.menu,
      this.screenContainer,
    )

    this.resize()
    this.showScreen('AceOfShadows')
  }

  resize() {
    const { width, height } = Scene.app.screen
    this.bgSprite.width = width
    this.bgSprite.height = height
    this.menu.resize(width - GAP * 2)

    this.menu.y = GAP * this.menu.scale.y
    this.screenContainer.y = SCREEN_TOP_GAP * this.menu.scale.y

    Object.values(this.screens).forEach(screen => screen.resize(width - this.screenContainer.x * 2, height - this.screenContainer.y - GAP))
  }

  private attachEvents() {
    this.menu.on('select', this.showScreen, this)
    Scene.app.renderer.on('resize', this.resize, this)
  }

  // change screen method
  private showScreen(screen: typeof this.activeScreen) {
    if (screen === this.activeScreen)
      return

    const oldScreen = this.screens[this.activeScreen]
    const newScreen = this.screens[screen]

    newScreen.onShow()

    if (oldScreen) {
      oldScreen.visible = false
      oldScreen.onHide()
    }

    newScreen.visible = true

    this.activeScreen = screen
  }
}

export const AppController = new AppControllerClass()
