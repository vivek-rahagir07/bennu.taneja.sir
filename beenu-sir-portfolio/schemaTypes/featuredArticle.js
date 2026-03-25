export default {
  name: 'featuredArticle',
  title: 'Featured Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Headline Title',
      type: 'string',
    },
    {
      name: 'alt',
      title: 'Publisher / Source (e.g. IANS Wire)',
      type: 'string',
    },
    {
      name: 'link',
      title: 'Link URL',
      type: 'url',
    },
    {
      name: 'image',
      title: 'Article Image/Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
