import { isDark } from '@slidev/client/logic/dark.ts'
import { defineMermaidRendererSetup } from '@slidev/types'
import mermaid from 'mermaid/dist/mermaid.esm.mjs'

const mocha = {
  primaryColor:        '#313244', // surface0 — node fill
  primaryTextColor:    '#cdd6f4', // text
  primaryBorderColor:  '#89b4fa', // blue
  lineColor:           '#9399b2', // overlay2
  secondaryColor:      '#45475a', // surface1
  tertiaryColor:       '#585b70', // surface2
  background:          '#1e1e2e', // base
  mainBkg:             '#313244', // surface0
  nodeBorder:          '#89b4fa', // blue
  clusterBkg:          '#181825', // mantle
  clusterBorder:       '#45475a', // surface1
  titleColor:          '#cdd6f4', // text
  edgeLabelBackground: '#313244', // surface0
  attributeBackgroundColorEven: '#1e1e2e',
  attributeBackgroundColorOdd:  '#313244',
}

const latte = {
  primaryColor:        '#ccd0da', // surface0
  primaryTextColor:    '#4c4f69', // text
  primaryBorderColor:  '#1e66f5', // blue
  lineColor:           '#7c7f93', // overlay2
  secondaryColor:      '#bcc0cc', // surface1
  tertiaryColor:       '#acb0be', // surface2
  background:          '#eff1f5', // base
  mainBkg:             '#ccd0da', // surface0
  nodeBorder:          '#1e66f5', // blue
  clusterBkg:          '#e6e9ef', // mantle
  clusterBorder:       '#bcc0cc', // surface1
  titleColor:          '#4c4f69', // text
  edgeLabelBackground: '#ccd0da', // surface0
  attributeBackgroundColorEven: '#eff1f5',
  attributeBackgroundColorOdd:  '#ccd0da',
}

export default defineMermaidRendererSetup(() => {
  return async (code: string) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: isDark.value ? mocha : latte,
    })
    const container = document.getElementById('mermaid-rendering-container')
      ?? document.body
    const id = `mermaid-ctp-${Math.random().toString(36).slice(2)}`
    const { svg } = await mermaid.render(id, code, container)
    return svg
  }
})
