import { Container } from 'pixi.js'

// Base class for all screens
export abstract class Screen extends Container {
  abstract load(): Promise<void>
  abstract resize(width: number, height: number): void
  onShow() {}
  onHide() {}
}
