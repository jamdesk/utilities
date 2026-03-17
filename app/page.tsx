import { tools } from '@/lib/tools'

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-[#e0e0e4]">
        MDX Utilities
      </h1>
      <p className="mb-12 text-lg text-[#6b6b78]">
        Free, open-source tools for working with MDX files.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <a
            key={tool.slug}
            href={`/utilities/${tool.slug}`}
            className="rounded-xl border border-[#2a2640] bg-[#1a1725] p-6 transition-colors hover:border-[#7c3aed]/50"
          >
            <span className="mb-3 block text-2xl">{tool.icon}</span>
            <h2 className="mb-1 text-lg font-semibold text-[#e0e0e4]">
              {tool.name}
            </h2>
            <p className="text-sm text-[#6b6b78]">{tool.description}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
