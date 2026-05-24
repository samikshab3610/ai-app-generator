export default function TableRenderer({ data }: any) {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-yellow-100">
        No data available
      </div>
    )
  }

  const keys = Object.keys(data[0])

  return (
    <div className="p-4 border mt-4">
      <h2 className="font-bold mb-2">Dynamic Table</h2>

      <table className="table-auto border w-full">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key} className="border px-2 py-1">
                {key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i}>
              {keys.map((key) => (
                <td key={key} className="border px-2 py-1">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}