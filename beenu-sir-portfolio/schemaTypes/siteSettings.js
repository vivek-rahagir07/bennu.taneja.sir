export default {
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  fields: [
    { name: 'phone', title: 'Phone Number', type: 'string' },
    { name: 'email', title: 'Email Address', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { 
      name: 'socialLinks', 
      title: 'Social Links', 
      type: 'object', 
      fields: [
        { name: 'instagram', type: 'url' },
        { name: 'facebook', type: 'url' },
        { name: 'twitter', type: 'url' },
        { name: 'linkedin', type: 'url' },
        { name: 'imdb', type: 'url' }
      ]
    },
    { name: 'footerText', title: 'Footer Brand Description', type: 'text' },
    { name: 'ctaHeading', title: 'Footer CTA Heading', type: 'string' },
    { name: 'ctaSubtext', title: 'Footer CTA Subtext', type: 'string' }
  ]
}
