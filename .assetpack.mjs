import { pixiPipes } from '@assetpack/core/pixi'

export default {
  entry: './raw-assets',
  output: './public/assets',
  pipes: [
    ...pixiPipes({
      cacheBust: false,
      resolutions: { default: 1 },
      compression: { jpg: true, png: true, webp: true, avif: true },
      texturePacker: { texturePacker: { nameStyle: 'short', removeFileExtension: true } },
      audio: {},
      manifest: {
        output: './src/shared/manifest.json',
        createShortcuts: true,
        trimExtensions: true,
        nameStyle: 'short',
      },
    }),
  ],
}
