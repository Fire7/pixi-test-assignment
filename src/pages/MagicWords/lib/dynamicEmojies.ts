import type { AbstractSplitText, SplitableTextObject, Texture } from 'pixi.js'
import { Container, Sprite } from 'pixi.js'

const MOCK_SYMBOLS_MIN = 0x2700 // Dingbats symbols
// const MOCK_SYMBOLS_MAX = 0x27BF // End of dingbats symbols. Can be replaced with another utf-8 range

class DynamicEmojiesClass {
  constructor() {
    ;(window as any).$dynamicEmojies = this
  }

  private counter = MOCK_SYMBOLS_MIN

  private aliasToSymbol: Record<string, string> = {}
  private symbolToTexture: Record<string, Texture> = {}

  readonly emojiesContainer = new Container({ label: 'emojies' })

  // register new emoji with token (alias) and texture
  registerSymbol(alias: string, texture: Texture) {
    const symbol = String.fromCharCode(this.counter++)

    this.aliasToSymbol[alias] = symbol
    this.symbolToTexture[symbol] = texture
  }

  // replace tokens with mock symbols
  normalizeText(text: string) {
    return text.replace(/\{([a-z_]+)\}/gi, (_, alias) => {
      return this.aliasToSymbol[alias] ?? `{${alias}}`
    })
  }

  // render emojies as sprite at the mock symbols positions
  renderEmojies(texts: Array<AbstractSplitText<SplitableTextObject>>) {
    this.emojiesContainer.removeChildren()

    texts.forEach(text => text.lines.forEach(line => line.children.forEach((word) => {
      if (
        word.children.length === 1
        && (word.children[0] as SplitableTextObject).text.length === 1
        && this.symbolToTexture[(word.children[0] as SplitableTextObject).text]
      ) {
        const textObj = word.children[0] as SplitableTextObject

        this.emojiesContainer.addChild(
          new Sprite({
            texture: this.symbolToTexture[textObj.text],
            x: text.x + line.x + word.x,
            y: text.y + line.y + word.y,
            width: textObj.width,
            height: textObj.height,
          }),
        )
      }
    })))
  }
}

export const DynamicEmojies = new DynamicEmojiesClass()
