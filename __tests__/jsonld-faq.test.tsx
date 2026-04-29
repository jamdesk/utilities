import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { JsonLdScript, buildFaqSchema } from '@/components/seo/JsonLdScript'
import { tools } from '@/lib/tools'

describe('buildFaqSchema', () => {
  it('emits a FAQPage with one Question per FAQ entry', () => {
    const schema = buildFaqSchema([
      { question: 'Is it free?', answer: 'Yes.' },
      { question: 'Where is the source?', answer: 'On GitHub.' },
    ])
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(2)
    expect(schema.mainEntity[0]['@type']).toBe('Question')
    expect(schema.mainEntity[0].name).toBe('Is it free?')
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Yes.')
  })
})

describe('JsonLdScript integration with FAQ', () => {
  it('emits FAQPage schema when faqs prop is provided', () => {
    const html = renderToString(
      <JsonLdScript
        type="tool"
        tool={tools[0]}
        faqs={[
          { question: 'Q1?', answer: 'A1.' },
          { question: 'Q2?', answer: 'A2.' },
        ]}
      />
    )
    expect(html).toContain('"@type":"FAQPage"')
    expect(html).toContain('"name":"Q1?"')
  })

  it('does NOT emit FAQPage schema when faqs prop is omitted', () => {
    const html = renderToString(
      <JsonLdScript type="tool" tool={tools[0]} />
    )
    expect(html).not.toContain('"@type":"FAQPage"')
  })
})
