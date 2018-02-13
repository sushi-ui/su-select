const el = document.querySelector('.su-Select')

const items = [{ name: 'lol 1', value: 100 }, { name: 'mur 2' }, { name: 'löv 2', value: 'hm' }]

const template = o => {
  return `
    <strong>${o.value || o.name}</strong>: <span>${o.text}</span>
  `
}

const select = new SuSelect(el, { items, multiple: true, template, tags: false })
el.addEventListener('show', () => {
  console.log('show')
})

el.addEventListener('change', ({ detail }) => {
  console.log(detail.selected)
})

function addItem() {
  items.push({ name: 'item 4', value: 'yea' })
  select.update(items)
}
