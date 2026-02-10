import type { AvatarPosition, DialogResponse } from './lib/types.ts'
import {
  Assets,
  Container,
  SplitBitmapText,
  Sprite,
  Texture,
} from 'pixi.js'
import { Screen } from '@/shared/Screen.ts'
import { DynamicEmojies } from './lib/dynamicEmojies'

const ENDPOINT = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords'
const AVATAR_SIZE = 32
const GAP = 10
const PANEL_GAP_X = 5
const PANEL_GAP_Y = 5

export class MagicWords extends Screen {
  private replicasContainer = new Container({ label: 'replics' })

  private dialog!: DialogResponse
  private replicas!: Array<{
    text: SplitBitmapText
    avatar: Sprite
    textBg: Sprite
    position: AvatarPosition
  }>

  private avatarPosition: Record<string, AvatarPosition> = {}

  async load() {
    const dialog = await fetch(ENDPOINT).then(res => res.json()) as DialogResponse

    Assets.addBundle('emojies', dialog.emojies.map(({ url, name }) => ({ alias: name, src: url, parser: 'texture' })))
    Assets.addBundle('avatars', dialog.avatars.map(({ url, name, position }) => {
      this.avatarPosition[name] = position
      return { alias: name, src: url, parser: 'texture' }
    }))

    await Promise.all([
      Assets.loadBundle('emojies'),
      Assets.loadBundle('avatars'),
    ])

    this.prepareEmojies(dialog.emojies)
    this.dialog = dialog
    this.setup()
  }

  resize(width: number) {
    let y = 0

    for (let i = 0; i < this.replicas.length; i++) {
      const { avatar, text, textBg, position } = this.replicas[i]

      text.style.wordWrapWidth = width - AVATAR_SIZE - GAP * 3
      text.styleChanged()

      const textWidth = text.width
      const textHeight = text.height

      textBg.height = textHeight + PANEL_GAP_Y * 2
      textBg.width = textWidth + PANEL_GAP_X * 2

      if (position === 'left') {
        avatar.x = GAP
        textBg.x = AVATAR_SIZE + GAP + GAP
        text.x = AVATAR_SIZE + GAP + GAP + PANEL_GAP_X
      }
      else {
        avatar.x = width - AVATAR_SIZE - GAP
        textBg.x = width - AVATAR_SIZE - GAP - GAP
        text.x = width - AVATAR_SIZE - GAP - GAP - PANEL_GAP_X - textWidth
      }

      text.y = avatar.y = textBg.y = y
      text.y += PANEL_GAP_Y
      y += textBg.height + GAP
    }

    DynamicEmojies.renderEmojies(this.replicas.map(({ text }) => text))
  }

  private setup() {
    this.addChild(
      this.replicasContainer,
      DynamicEmojies.emojiesContainer,
    )

    this.replicas = this.dialog.dialogue.map(({ text, name }) => {
      const avatar = new Sprite({
        texture: Assets.get(name),
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        anchor: { x: 0, y: 0.15 },
      })

      if (!Assets.get(name)) {
        avatar.texture = Texture.WHITE
        avatar.tint = 0x777777
        avatar.anchor.y = 0
      }

      const isLeft = this.avatarPosition[name] === 'left'

      const textObj = new SplitBitmapText({
        text: DynamicEmojies.normalizeText(text),
        style: { fontFamily: 'PixelFont', fontSize: 20, fill: 0, wordWrap: true, wordWrapWidth: Infinity },
        wordAnchor: 0.5,
      })

      const textBg = new Sprite({
        texture: Texture.WHITE,
        anchor: { x: isLeft ? 0 : 1, y: 0 },
      })

      this.replicasContainer.addChild(textBg, avatar, textObj)

      return {
        avatar,
        textBg,
        text: textObj,
        position: this.avatarPosition[name]!,
      }
    },
    )
  }

  private prepareEmojies(emojies: DialogResponse['emojies']) {
    emojies.forEach(({ name }) => {
      DynamicEmojies.registerSymbol(name, Assets.get(name))
    })
  }
}
