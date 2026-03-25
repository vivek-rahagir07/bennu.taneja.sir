export default {
  name: 'experienceMilestone',
  title: 'Experience Milestone',
  type: 'document',
  fields: [
    { name: 'title', title: 'Job Title / Role', type: 'string' },
    { name: 'company', title: 'Company / Organization', type: 'string' },
    { name: 'dateRange', title: 'Date Range or Type (e.g., 2012 - Present, or Academic)', type: 'string' },
    { name: 'icon', title: 'FontAwesome Icon Class (e.g., fas fa-star)', type: 'string' },
    { name: 'isGold', title: 'Is Gold Milestone? (Highlights the item)', type: 'boolean' },
    { name: 'order', title: 'Timeline Order (1 to 12)', type: 'number' }
  ],
  orderings: [
    { title: 'Timeline Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ]
}