// human
// Option 1: Update _app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI-powered UX Audit Tool</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

