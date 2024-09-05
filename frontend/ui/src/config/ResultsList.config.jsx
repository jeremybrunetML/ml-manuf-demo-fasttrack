export const resultsList = {
  entityTypeConfig: {
    "path": "extracted.content[0].*~" // child key of extracted
  },
  entities: [
    {
      entityType: 'Part',
      title: {
        path: 'PieceNom'
      },
      items: [
        { path: 'IDPI' },
        { path: 'PieceNom' },
        { label: 'Materiau', path: 'Materiau' }
      ]
    },
    {
      entityType: 'Organization',
      title: {
        path: 'extracted.Organization.names.name.value'
      },
      items: [
        { label: 'ID', path: 'extracted.Organization.organizationId' },
        { label: 'Type', path: 'extracted.Organization.types.type' },
        { label: 'City', path: 'extracted.Organization.addresses.address.city' },
        { label: 'State', path: 'extracted.Organization.addresses.address.state' }
      ]
    }
  ]
};

export default resultsList;