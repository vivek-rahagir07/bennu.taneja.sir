export default {
  name: 'expertisePage',
  title: 'Expertise Page Content',
  type: 'document',
  fields: [
    { 
      name: 'facultyRoles', 
      title: 'Visiting & Adjunct Faculty', 
      type: 'array', 
      of: [{ type: 'string' }] 
    },
    { 
      name: 'trainingCategories', 
      title: 'Signature Training Modules', 
      type: 'array', 
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Category Title', type: 'string' },
          { name: 'icon', title: 'Icon Class (e.g., fas fa-lightbulb)', type: 'string' },
          { name: 'badges', title: 'Subject Badges', type: 'array', of: [{ type: 'string' }] }
        ]
      }]
    },
    { 
      name: 'certifications', 
      title: 'Professional Certifications', 
      type: 'array', 
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Certification Name', type: 'string' },
          { name: 'subtitle', title: 'Issuer / Detail', type: 'string' }
        ]
      }]
    },
    { name: 'placementTitle', title: 'Placement Training Title', type: 'string' },
    { name: 'placementDesc', title: 'Placement Training Description', type: 'text' },
    { name: 'placementFooter', title: 'Placement Footer Text', type: 'string' }
  ]
}