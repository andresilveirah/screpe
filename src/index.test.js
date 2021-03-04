const path = require('path')
const DOMParser = require('./DOMParser')

const scrap = require('./')

describe('scraper', () => {
  it('should work', async () => {
    const dom = await DOMParser.fromFile(path.resolve(__dirname, 'scraper.html'))

    const recipe = {
      rules: [
        {
          id: 'items',
          type: 'elements',
          selector: '.item',
          children: [
            {
              id: 'itemId',
              type: 'attribute',
              selector: '__self',
              attribute: 'data-item-id',
              multiple: false
            },
            {
              id: 'title',
              type: 'text',
              selector: '.item-title'
            },
            {
              id: 'price',
              type: 'text',
              selector: '.item-price'
            },
            {
              id: 'description',
              type: 'element',
              selector: '.item-description',
              children: [
                { id: 'location', selector: '__self', type: 'text', regex: /DE-\d{5}/ },
                { id: 'sellerType', selector: '__self', type: 'text', regex: /private|professional/ }
              ]
            },
            {
              id: 'url',
              type: 'attribute',
              selector: 'a',
              attribute: 'href'
            },
            {
              id: 'pictureUrl',
              type: 'attribute',
              selector: 'img',
              attribute: 'src'
            }
          ]
        }
      ]
    }

    const data = scrap(dom.window.document)(recipe)
    expect(data).toEqual({
      items: [
        {
          title: 'Item 1',
          price: '100.00 €',
          itemId: '1',
          description: {
            location: 'DE-99999',
            sellerType: 'private'
          },
          url: 'https://example.com/item-1',
          pictureUrl: 'https://via.placeholder.com/150'
        },
        {
          title: 'Item 2',
          price: '200 €',
          itemId: '2',
          description: {
            location: 'DE-00000',
            sellerType: 'professional'
          },
          url: 'https://example.com/item-2',
          pictureUrl: 'https://via.placeholder.com/150'
        },
        {
          title: 'Item 3',
          price: '300 €',
          itemId: '3',
          description: {
            location: '',
            sellerType: ''
          },
          url: 'https://example.com/item-3',
          pictureUrl: ''
        }
      ]
    })
  })
})
