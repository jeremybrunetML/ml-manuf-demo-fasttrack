//Only for facets
export const selectedFacetConfig = {
  'string': {
    color: 'red',
    closable: true,
  },
  'date': {
    color: 'blue',
    closable: true,
    iconLabel: <i className='fas fa-calendar' style={{ marginRight: 3 }}></i>,
  },
  'number': {
    color: 'green',
    dashed: false,
    closable: true,
    iconLabel: <i className='fas fa-dollar-sign' style={{ marginRight: 3 }}></i>,
  },
}

export default selectedFacetConfig;