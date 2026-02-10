import type { Ticker } from 'pixi.js'
import { Assets, Container, Sprite, TilingSprite } from 'pixi.js'
import { Scene } from '@/shared/Scene'
import { Screen } from '@/shared/Screen.ts'
import { easeInOut, normalizeClamp } from '@/shared/utils'

const CARD_AMOUNT = 144
const CARD_OFFSET = 5
const DURATION = 2
const DELAY = 1
const CARD_WIDTH = 949 // base sprite width
const CARD_HEIGHT = 1261 // base sprite height

export class AceOfShadows extends Screen {
  private bgSprite = new TilingSprite({ label: 'bg', tileScale: { x: 0.1, y: 0.1 } })
  private cardsContainer = new Container({ label: 'cards', y: 25 })
  private cards: Array<Sprite> = []

  private animationTime = 0
  private animationDuration = (CARD_AMOUNT - 1) * DELAY + DURATION
  private animationDirection: 1 | -1 = 1

  private deckGap = 1

  async load() {
    await Assets.loadBundle('AceOfShadows')
    this.setup()
  }

  resize(width: number, height: number) {
    this.bgSprite.width = width
    this.bgSprite.height = height

    const scaleX = width * 0.2 / CARD_WIDTH
    const scaleY = height * 0.4 / CARD_HEIGHT

    const scale = Math.min(scaleX, scaleY)

    this.cardsContainer.scale.set(scale)
    this.cardsContainer.x = width * 0.1
    this.cardsContainer.y = height * 0.3
    this.deckGap = 1 / scale * width * 0.6
  }

  onShow() {
    this.animationTime = 0
    this.updateAnimation(0)
    this.animationDirection = 1

    Scene.app.ticker.add(this.update, this)
  }

  onHide() {
    Scene.app.ticker.remove(this.update, this)
  }

  private setup() {
    this.bgSprite.texture = Assets.get('AceOfShadowsBg')

    for (let i = 1; i <= CARD_AMOUNT; i++) {
      const card = new Sprite({
        texture: Assets.get(`Jokers${i}`),
        y: i * CARD_OFFSET,
        anchor: { x: 0, y: 0.5 },
      })

      this.cards.push(card)
      this.cardsContainer.addChild(card)
    }

    this.addChild(
      this.bgSprite,
      this.cardsContainer,
    )
  }

  private update(ticker: Ticker) {
    if (this.cardsContainer.children?.length) {
      this.updateAnimation(ticker.deltaMS / 1000)
    }
  }

  private updateAnimation(dt: number) {
    this.animationTime += dt * this.animationDirection

    // clamp animation time
    if (this.animationTime >= this.animationDuration) {
      this.animationTime = this.animationDuration
      this.animationDirection *= -1
    }
    else if (this.animationTime <= 0) {
      this.animationTime = 0
      this.animationDirection *= -1
    }

    // update cards positions
    for (let i = 0; i < this.cards.length; i++) {
      const index = this.cards.length - i - 1
      const card = this.cards[index] as Sprite // start from the last card
      const min = i * DELAY
      const max = min + DURATION
      const progress = easeInOut(
        normalizeClamp(this.animationTime, min, max),
      )
      card.x = this.deckGap * progress
      card.y = CARD_OFFSET * (index + (i - index) * progress)
      card.zIndex = progress > 0.5 ? i : index
    }

    this.cardsContainer.sortChildren()
  }
}
