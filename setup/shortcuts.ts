import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'

export default defineShortcutsSetup((nav: NavOperations, base: ShortcutOptions[]) => {
  return [
    ...base,
    { name: 'vim_next',      key: 'l', fn: nav.next,      autoRepeat: true },
    { name: 'vim_prev',      key: 'h', fn: nav.prev,      autoRepeat: true },
    { name: 'vim_nextslide', key: 'j', fn: nav.nextSlide, autoRepeat: true },
    { name: 'vim_prevslide', key: 'k', fn: nav.prevSlide, autoRepeat: true },
  ]
})
