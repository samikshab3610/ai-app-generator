import FormRenderer from "./FormRenderer"
import TableRenderer from "./TableRenderer"

export default function ComponentMapper({ component, data, setData }: any) {
  const map: any = {
    form: FormRenderer,
    table: TableRenderer
  }

  const Selected = map[component.type]

  if (!Selected) {
    return (
      <div className="p-4 bg-red-100 text-red-600">
        Unsupported component: {component.type}
      </div>
    )
  }

  return <Selected component={component} data={data} setData={setData} />
}
