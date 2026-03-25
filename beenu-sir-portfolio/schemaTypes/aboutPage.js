export default {
  name: 'aboutPage',
  title: 'About Page Content',
  type: 'document',
  fields: [
    { name: 'bioParagraph1', title: 'Bio Paragraph 1 (HTML allowed)', type: 'text' },
    { name: 'bioParagraph2', title: 'Bio Paragraph 2 (HTML allowed)', type: 'text' },
    { name: 'bioParagraph3', title: 'Bio Paragraph 3 (HTML allowed)', type: 'text' },
    { name: 'quoteLine1', title: 'Quote Line 1 (HTML allowed)', type: 'string' },
    { name: 'quoteLine2', title: 'Quote Line 2 (HTML allowed)', type: 'string' },
    { name: 'visionStatement', title: 'Vision Statement (HTML allowed)', type: 'text' },
    { name: 'missionPoints', title: 'Mission Points (HTML allowed)', type: 'array', of: [{ type: 'string' }] },
    { name: 'policies', title: 'Policies (HTML allowed)', type: 'array', of: [{ type: 'string' }] }
  ]
}