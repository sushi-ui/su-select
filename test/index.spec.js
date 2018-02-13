/* global describe, it, before */
require('mocha-jsdom')()
import chai from 'chai'
import SuSelect from '../src/index.js'

chai.expect()

const expect = chai.expect

let lib = null
let el = null
let input = null
let list = null
let items = []

describe('su-Select', () => {
  before(() => {
    el = document.createElement('div')
    input = document.createElement('input')
    list = document.createElement('input')
    list.classList.add('su-Select-list')
    el.classList.add('su-Select')
    items = [{ name: 'item 1', value: 100 }, { name: 'item 2' }, { name: 'item 2', value: 'lol' }]
    el.appendChild(input)
    el.appendChild(list)

    lib = new SuSelect(el, { options: items })
    document.body.appendChild(el)
  })

  describe('Given an instance of select', () => {
    it('is created', () => {
      expect(el.nodeName).eql('DIV')
    })

    it('has class', () => {
      expect(el.className).eql('su-Select')
    })

    it('has an input tag', () => {
      expect(el.querySelector('input')).to.not.be.null
    })

    it('input is readonly', () => {
      expect(input.hasAttribute('readonly')).to.be.true
    })

    it('has an .su-Select-list', () => {
      const selectList = el.querySelector('.su-Select-list')
      expect(selectList).to.not.be.null
    })
  })

  describe('when I need the component name', () => {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('su-Select')
    })
  })

  describe('when I focus input field', () => {
    it('should emit show event', () => {
      let show = false
      el.addEventListener('show', () => (show = true))
      input.dispatchEvent(new Event('focus'))
      expect(show).to.be.true
    })

    it('instance should have _showList true', () => {
      input.dispatchEvent(new Event('focus'))
      expect(lib._showList).to.be.true
    })
  })

  describe('when I select 1 item', () => {
    it('selected array should include the value 100', () => {
      Array.from(list.children)[0].dispatchEvent(new Event('click'))
      expect(lib.selected).to.include(100)
    })
    it('selected array should include the value item 2 no data-value', () => {
      Array.from(list.children)[1].dispatchEvent(new Event('click'))
      expect(lib.selected).to.include('item 2')
    })
  })
})
