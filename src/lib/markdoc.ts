import * as Markdoc from '@markdoc/markdoc'
import React from 'react'
import { DownloadCard } from '@/components/docs/downloadCard'

const markdocConfig: Markdoc.Config = {
  tags: {
    download: {
      render: 'DownloadCard',
      selfClosing: true,
      attributes: {
        title: { type: String, required: true },
        file: { type: String, required: true },
        size: { type: String },
      },
    },
  },
}

export function renderMarkdoc(content: string) {
  const ast = Markdoc.parse(content)
  const transformed = Markdoc.transform(ast, markdocConfig)
  return Markdoc.renderers.react(transformed, React, {
    components: {
      DownloadCard,
    },
  })
}
