import { Html, Head, Main, NextScript } from 'next/document'

// Minimal custom Document to satisfy legacy page system lookups when mixing App Router-only project.
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
