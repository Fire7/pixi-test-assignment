import type { Button } from '@pixi/ui'
import type { ContainerOptions } from 'pixi.js'
import { FancyButton } from '@pixi/ui'
import { BitmapText, Container } from 'pixi.js'

const FONT_SIZE = 30
const BTN_HEIGHT = 40
const OFF_TINT = 0
const ON_TINT = 0xFFFFFF
const MIN_GAP = 5

export interface MenuOptions {
  items: Array<{ label: string, value: string }>
}

interface MenuItem {
  text: BitmapText
  button: FancyButton
  value: string
}

export class Menu extends Container {
  private items: Map<FancyButton, MenuItem> = new Map()
  private activeItem!: FancyButton

  private minWidth = 0
  private itemWidth = 0

  constructor(options: ContainerOptions & MenuOptions) {
    super(options)

    this.setup(options.items)
  }

  private setup(items: MenuOptions['items']) {
    const texts = items.map((item) => {
      const text = new BitmapText({
        text: item.label,
        style: {
          fontFamily: 'PixelFont',
          fontSize: FONT_SIZE,
        },
      })

      text.tint = OFF_TINT
      return text
    })

    this.itemWidth = Math.max(...texts.map(text => text.width)) + 10

    for (let i = 0; i < items.length; i++) {
      const value = items[i].value
      const text = texts[i]

      const button = new FancyButton({
        defaultView: 'button-normal',
        pressedView: 'button-clicked',
        text,
        padding: 0,
        nineSliceSprite: [5, 9, 5, 6], // left, top, right, bottom
      })

      button.width = this.itemWidth
      button.height = BTN_HEIGHT

      // @ts-expect-error types mismatch
      button.onPress.connect(this.handlePress)
      // @ts-expect-error types mismatch
      button.onHover.connect(this.handleHover)
      // @ts-expect-error types mismatch
      button.onOut.connect(this.handleOut)

      this.items.set(button, {
        button,
        text,
        value,
      })

      this.addChild(button)

      if (i === 0) {
        button.setState('pressed')
        this.activeItem = button
        this.textOn(text)
      }
    }

    this.minWidth = this.itemWidth * items.length + MIN_GAP * items.length - 1
  }

  resize(width: number) {
    let gap = MIN_GAP

    const buttons = Array.from(this.items.keys())

    if (width < this.minWidth) {
      this.scale = width / this.minWidth
    }
    else {
      this.scale = 1
      const count = buttons.length
      gap = (width - this.itemWidth * count) / (count - 1)
    }

    let x = 0
    for (const btn of buttons) {
      btn.x = x
      x += btn.width + gap
    }
  }

  private handlePress = (button: Button) => {
    const btn = button.view as FancyButton

    if (btn === this.activeItem) {
      btn.setState('pressed')
      return
    }

    this.textOff(this.activeItem!.textView as BitmapText)
    this.activeItem.setState('default')

    btn.setState('pressed')
    this.textOn(btn.textView as BitmapText)
    this.activeItem = btn
    this.emit('select', this.items.get(btn)!.value)
  }

  private handleHover = (button: Button) => {
    const btn = button.view as FancyButton
    if (btn === this.activeItem) {
      btn.setState('pressed')
      return
    }

    this.textOn(btn.textView as BitmapText)
  }

  private handleOut = (button: Button) => {
    const btn = button.view as FancyButton
    if (btn === this.activeItem) {
      btn.setState('pressed')
      return
    }

    this.textOff(btn.textView as BitmapText)
  }

  private textOn(text: BitmapText) {
    text.tint = ON_TINT
  }

  private textOff(text: BitmapText) {
    text.tint = OFF_TINT
  }
}
