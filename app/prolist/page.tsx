'use client'

import { useState } from 'react'

type ProxyItem = {
  url: string
  ping: number | null
  success: boolean
}

const proxyList = [
  "https://t.me/proxy?server=weblog.forwarding-co.site&port=443&secret=eeNEgYdJvXrFGRMCIMJdCQRueWVrdGFuZXQuY29tZmFyYWthdi5jb212YW4ubmFqdmEuY29tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "https://t.me/proxy?server=i-love-femboys.top&port=853&secret=ee54ce330e4690cc297d2b031ff3f288b06d742e616b656e61692e636c69636b",
  
]

export default function ProList() {
  const [proxies, setProxies] = useState<ProxyItem[]>(
    proxyList.map((url) => ({
      url,
      ping: null,
      success: false,
    }))
  )

  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const testProxies = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/test-proxies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proxies: proxyList,
        }),
      })

      const data = await res.json()

      setProxies(data)
    } catch (err) {
      console.error('Proxy test failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)

      setCopiedIndex(index)

      setTimeout(() => {
        setCopiedIndex(null)
      }, 1500)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const getPingColor = (ping: number | null) => {
    if (ping === null) return 'text-red-400'
    if (ping < 300) return 'text-emerald-400'
    if (ping < 700) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-auto bg-zinc-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Proxy Latency Tester</h1>

          <button
            onClick={testProxies}
            disabled={loading}
            className="rounded-xl bg-white px-4 py-2 font-bold text-black transition hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Proxies'}
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {proxies.map((pro, index) => (
            <div
              key={`${pro.url}-${index}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              {/* Left */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-zinc-200">{pro.url}</div>

                <div className={`mt-1 text-sm font-bold ${getPingColor(pro.ping)}`}>
                  {pro.ping !== null ? `${pro.ping}ms` : 'Unavailable'}
                </div>
              </div>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(pro.url, index)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  copiedIndex === index ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {copiedIndex === index ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
