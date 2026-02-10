// application entry point
(async () => {
  // lazy load game code
  const { AppController } = await import('./appController')
  // preloading phase: api connection, asset loading, etc.
  await AppController.setup()

  // show game screen
  const appContainer = document.getElementById('pixi-container')!
  appContainer.removeChild(appContainer.firstElementChild!) // preloader screen prerendered
  appContainer.appendChild(AppController.canvas)

  // add stats.js to the page
  // @ts-expect-error stats.js snippet
  ;(function () { const script = document.createElement('script'); script.onload = function () { const stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }) }; script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script) })() // eslint-disable-line style/max-statements-per-line
})()
