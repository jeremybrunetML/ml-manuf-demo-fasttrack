import _ from 'lodash'

//DataGrid's template of configurations 
export const entityDataGridConfigTemplate = (fn) => {

  const gridConfig = {
    gridColumn: [
      {
        field: "index",
        title: "INDEX",
      },
      {
        field: "uri",
        title: "URI"
      },
      {
        field: "href",
        title: "HREF"
      },
      {
        field: "extracted.person.personId",
        title: "ID",
        cell: (props) => (<>{props.dataItem?.extracted?.organization?.organizationId ?
          (<td>{props.dataItem.extracted.organization?.organizationId}</td>) : (<td>{props?.dataItem?.extracted?.person?.personId}</td>)}</>)
      },
      {
        field: "",
        title: "ACTIONS",
        cell: (props) => (<>{props.dataItem ?
          (<td onClick={() => fn(props?.dataItem)} style={{ color: '#0d6efd', cursor: 'pointer' }}>{'Show more'}</td>) : (<td></td>)}</>),
      }
    ]
  }

  return gridConfig
}