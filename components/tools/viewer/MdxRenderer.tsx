import type { Root, RootContent, PhrasingContent } from 'mdast'
import { ComponentStub } from './ComponentStub'

/** Block javascript: and data: URIs to prevent XSS in rendered previews */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://example.com')
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) return '#'
  } catch {
    // relative URL — allow
  }
  return url
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute'
  name: string
  value: string | null
}

interface MdxJsxNode {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement'
  name: string | null
  attributes: MdxJsxAttribute[]
  children: RootContent[]
}

interface YamlNode {
  type: 'yaml'
  value: string
}

function getAttributes(node: MdxJsxNode): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const attr of node.attributes) {
    if (attr.type === 'mdxJsxAttribute' && attr.name) {
      attrs[attr.name] = attr.value ?? 'true'
    }
  }
  return attrs
}

function renderChildren(children: (RootContent | PhrasingContent)[]): React.ReactNode[] {
  return children.map((child, i) => <AstNode key={i} node={child} />)
}

function AstNode({ node }: { node: RootContent | PhrasingContent }) {
  switch (node.type) {
    case 'heading': {
      const Tag = `h${node.depth}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const sizes: Record<number, string> = {
        1: 'text-2xl',
        2: 'text-xl',
        3: 'text-lg',
        4: 'text-base',
        5: 'text-sm',
        6: 'text-xs',
      }
      return (
        <Tag className={`${sizes[node.depth] ?? 'text-base'} mt-4 mb-2 font-bold text-[#e0e0e4]`}>
          {renderChildren(node.children)}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <p className="my-2 leading-relaxed text-[#c0bdd0]">
          {renderChildren(node.children)}
        </p>
      )

    case 'list':
      if (node.ordered) {
        return (
          <ol className="my-2 list-decimal pl-6 text-[#c0bdd0]">
            {renderChildren(node.children)}
          </ol>
        )
      }
      return (
        <ul className="my-2 list-disc pl-6 text-[#c0bdd0]">
          {renderChildren(node.children)}
        </ul>
      )

    case 'listItem':
      return (
        <li className="my-0.5">
          {renderChildren(node.children)}
        </li>
      )

    case 'code':
      return (
        <pre className="my-3 overflow-x-auto rounded-md border border-[#2a2640] bg-[#0f0d17] p-3">
          <code className="text-sm text-[#c0bdd0]">
            {node.lang && (
              <span className="mb-2 block text-xs text-[#4a4858]">{node.lang}</span>
            )}
            {node.value}
          </code>
        </pre>
      )

    case 'inlineCode':
      return (
        <code className="rounded bg-[#2a2640] px-1.5 py-0.5 text-sm text-[#a78bfa]">
          {node.value}
        </code>
      )

    case 'strong':
      return (
        <strong className="font-bold text-[#e0e0e4]">
          {renderChildren(node.children)}
        </strong>
      )

    case 'emphasis':
      return (
        <em className="italic text-[#c0bdd0]">
          {renderChildren(node.children)}
        </em>
      )

    case 'link':
      return (
        <a
          href={sanitizeUrl(node.url)}
          className="text-[#a78bfa] underline decoration-[#a78bfa]/50 hover:decoration-[#a78bfa]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderChildren(node.children)}
        </a>
      )

    case 'image':
      return (
        <span className="my-2 block rounded border border-[#2a2640] bg-[#0f0d17] p-2 text-sm text-[#4a4858]">
          [Image: {node.alt || node.url}]
        </span>
      )

    case 'blockquote':
      return (
        <blockquote className="my-2 border-l-2 border-[#7c3aed] pl-4 text-[#6b6b78]">
          {renderChildren(node.children)}
        </blockquote>
      )

    case 'thematicBreak':
      return <hr className="my-4 border-[#2a2640]" />

    case 'text':
      return <>{node.value}</>

    case 'break':
      return <br />

    case 'html':
      return (
        <span className="text-xs text-[#4a4858]">{node.value}</span>
      )

    case 'yaml': {
      const yamlNode = node as unknown as YamlNode
      return (
        <div className="mb-4 rounded-md border border-[#2a2640] bg-[#0f0d17] p-3">
          <span className="mb-1 block text-xs font-medium text-[#a78bfa]">
            Frontmatter
          </span>
          <pre className="text-sm text-[#c0bdd0]">{yamlNode.value}</pre>
        </div>
      )
    }

    case 'mdxJsxFlowElement':
    case 'mdxJsxTextElement': {
      const jsxNode = node as unknown as MdxJsxNode
      const attrs = getAttributes(jsxNode)
      const name = jsxNode.name || 'Fragment'

      if (jsxNode.children && jsxNode.children.length > 0) {
        return (
          <ComponentStub name={name} attributes={attrs}>
            {renderChildren(jsxNode.children)}
          </ComponentStub>
        )
      }
      return <ComponentStub name={name} attributes={attrs} />
    }

    default: {
      // For unknown node types, try to render children if they exist
      const unknownNode = node as { children?: RootContent[] }
      if (unknownNode.children && Array.isArray(unknownNode.children)) {
        return <>{renderChildren(unknownNode.children)}</>
      }
      return null
    }
  }
}

interface MdxRendererProps {
  ast: Root
}

export function MdxRenderer({ ast }: MdxRendererProps) {
  return (
    <div className="prose-custom">
      {renderChildren(ast.children)}
    </div>
  )
}
