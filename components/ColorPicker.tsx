'use client'

interface Preset {
  name: string
  value: string
  label: string
}

interface Props {
  presets: Preset[]
  selected: string
  custom: string
  onChange: (color: string) => void
}

export default function ColorPicker({ presets, selected, custom, onChange }: Props) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {presets.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value)}
          title={preset.name}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition font-medium text-sm
            ${selected === preset.value
              ? 'border-blue-500 shadow-sm'
              : 'border-transparent hover:border-gray-300'
            }`}
        >
          <span
            className="w-5 h-5 rounded-full inline-block border border-gray-200"
            style={{ backgroundColor: preset.value }}
          />
          {preset.name}
        </button>
      ))}

      {/* 自定义颜色 */}
      <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition text-sm font-medium
        ${!presets.some(p => p.value === selected) ? 'border-blue-500 shadow-sm' : 'border-transparent hover:border-gray-300'}`}>
        <span
          className="w-5 h-5 rounded-full inline-block border border-gray-300 relative overflow-hidden"
          style={{ backgroundColor: custom }}
        />
        自定义
        <input
          type="color"
          value={custom}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </label>
    </div>
  )
}
