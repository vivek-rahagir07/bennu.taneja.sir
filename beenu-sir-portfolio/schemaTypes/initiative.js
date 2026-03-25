export default {
  name: 'initiative',
  title: 'Initiative (Home Page)',
  type: 'document',
  fields: [
    { name: 'name', title: 'Initiative Name', type: 'string' },
    { name: 'role', title: 'Your Role (e.g. Director)', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'linkUrl', title: 'Website Link', type: 'url' },
    { name: 'image', title: 'Project Image', type: 'image', options: { hotspot: true } },
    { name: 'order', title: 'Order', type: 'number' }
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ]
}
