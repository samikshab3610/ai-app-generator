import { ComponentConfig } from '@/lib/types'

export default function FeaturesRenderer({ config }: { config: ComponentConfig }) {
  if (!config.items || config.items.length === 0) {
    return <p className="text-gray-400 text-sm">No features configured.</p>
  }

  return (
    <div className="w-full py-12 px-4">
      {config.title && (
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{config.title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition">
            {item.icon && <div className="text-4xl mb-3">{item.icon}</div>}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-gray-500 text-sm">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}