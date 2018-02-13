import './style.css'
import { throttle, observer } from './utils'

export default class SuSelect {
  constructor(node, options = {}) {
    this.name = 'su-Select'
    this.el = node
    this.elInput = this.el.querySelector('input')
    this.elList = this.el.querySelector(`.${this.name}-list`)
    this.elTags = null
    this.selected = options.multiple ? [] : {}
    this._focusedItem = 0
    this._showList = false
    this._filter = true
    this.tags = options.tags || false
    this._multiple = options.multiple || false
    this._inputValue = ''
    this.template = item => `${item.text}`
    this.templateTags = item => `<span>${item.name}</span>`
    if (options.template) this.template = options.template
    // Bind events
    this._onInputFocus = this._onInputFocus.bind(this)
    this._onItemClick = this._onItemClick.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._filterItems = this._filterItems.bind(this)
    this._filterItems = throttle(this._filterItems, 200)

    this.elInput.addEventListener('focus', this._onInputFocus)
    this.elInput.addEventListener('keydown', this._onKeyDown)

    this._created()

    observer('items', '_initItems', this)
    this.items = options.items || []
  }

  _created() {
    if (this._filter) this.elInput.addEventListener('input', this._filterItems)
    else this.elInput.setAttribute('readonly', true)

    if (this._multiple && this.tags) {
      const elTags = document.createElement('div')

      elTags.classList.add(`${this.name}-tags`)
      this.el.insertBefore(elTags, this.elInput)
      this.elTags = elTags
    }
  }

  update(items) {
    this.items = items
  }

  _filterItems({ target }) {
    this._inputValue = target.value

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]

      item.text = this._highlightText(item.name)
      item.el.innerHTML = this.template(item)

      item.el.classList.remove('is-hidden')

      if (!item.name.includes(this._inputValue)) {
        item.el.classList.add('is-hidden')
      } else {
        this._focusItem(item.el)
      }
    }
  }

  _onKeyDown({ keyCode }) {
    const UP = keyCode === 38
    const DOWN = keyCode === 40
    const SPACE = keyCode === 32 && !this._filter
    const ENTER = keyCode === 13

    if (SPACE || ENTER) this._selectItem(this.items[this._focusedItem].el)

    this.items[this._focusedItem].el.classList.remove('is-focused')
    if (UP) {
      this._focusedItem--
      if (this._focusedItem < 0) this._focusedItem = this.items.length - 1
    }

    if (DOWN) {
      this._focusedItem++
      if (this._focusedItem >= this.items.length) this._focusedItem = 0
    }

    this.items[this._focusedItem].el.classList.add('is-focused')
  }

  _focusItem(item) {
    this._focusedItem = item._id

    for (let i = 0; i < this.items.length; i++) {
      const itemEl = this.items[i].el

      itemEl.classList.remove('is-focused')
    }
    item.classList.add('is-focused')
  }

  _initItems() {
    this.elList.innerHTML = ''
    this._focusedItem = 0
    this._renderTags()
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const itemEl = document.createElement('div')

      item.text = this._highlightText(item.name)

      itemEl.classList.add(`${this.name}-item`)
      itemEl._value = item.value || item.name || null
      itemEl._id = i

      if (this.multiple) {
        itemEl._selected = this.selected.some(v => v.id === itemEl._id)
      } else {
        itemEl._selected = this.selected.id === itemEl._id
      }

      if (itemEl._selected) itemEl.classList.add('is-selected')
      itemEl.innerHTML = this.template(item)
      itemEl.addEventListener('click', this._onItemClick)
      this.elList.appendChild(itemEl)
      item.el = itemEl
    }
  }

  _onItemClick(e) {
    this._selectItem(e.currentTarget)
  }

  _highlightText(name) {
    if (!this._inputValue.length) return name

    const re = new RegExp('(' + this._inputValue + ')', 'gi')

    return name.replace(re, `<span class="is-highlighted">$1</span>`)
  }

  _selectItem(item) {
    const detail = this
    const itemValue = item._value
    const itemId = item._id

    this._focusItem(item)

    if (this._multiple) {
      const indexOfValue = this.selected.findIndex(v => v.id === itemId)

      if (indexOfValue > -1) {
        this.selected.splice(indexOfValue, 1)
        item.classList.remove('is-selected')
        item._selected = false
      } else {
        this.selected.push({ value: itemValue, id: itemId })
        item.classList.add('is-selected')
        item._selected = true
      }
      this._renderTags()
    } else {
      this._removeAllSelectedClass()
      this.selected = { value: itemValue, id: itemId }
      item.classList.add('is-selected')
    }

    this.el.dispatchEvent(new CustomEvent('change', { detail }))
  }

  _renderTags() {
    if (!this.tags && !this.multiple) return
    let template = ''

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]

      if (item.el._selected) template += this.templateTags(item)
    }

    this.elTags.innerHTML = template
  }

  _removeAllSelectedClass() {
    const items = [...this.elList.children]

    for (let i = 0; i < items.length; i++) {
      items[i]._selected = false
      items[i].classList.remove('is-selected')
    }
  }

  _onInputFocus() {
    this._showList = true
    const detail = this

    this.el.dispatchEvent(new CustomEvent('show', { detail }))
  }

  destroy() {}
}
