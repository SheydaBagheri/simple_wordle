'use client'

import { useState } from 'react'

type ProxyItem = {
  url: string
  ping: number | null
  success: boolean
}

const proxyList = [
  'https://t.me/proxy?server=germany.tgproxysokol.pro&port=8443&secret=ee4215d16e455242e9b5ffb6349df285d06164732e78352e7275',
  'https://t.me/proxy?server=i-love-cu.top&port=853&secret=ee54ce330e4690cc297d2b031ff3f288b06d742e616b656e61692e636c69636b',
  'https://t.me/proxy?server=vfast.proxytg.space&port=443&secret=ee4b3ce8c172e8a23ff5f953069ef6c38a64726976652e676f6f676c652e636f6d',
  'https://t.me/proxy?server=vfast.proxytg.space&port=443&secret=ee4b3ce8c172e8a23ff5f953069ef6c38a64726976652e676f6f676c652e636f6d',
  'https://t.me/proxy?server=194.120.230.106&port=433&secret=3XnnAQIAAQAH8AMDhuJMOt0',
  'https://t.me/proxy?server=vaslshid.co.uk.&port=85&secret=FgMBAgABAAH8AxOG4kw63Q%3D%3D',
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const getPingColor = (ping: number | null) => {
    if (ping === null) {
      return 'text-red-400'
    }

    if (ping < 300) {
      return 'text-emerald-400'
    }

    if (ping < 700) {
      return 'text-yellow-400'
    }

    return 'text-red-400'
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Proxy Latency Tester</h1>

        <button onClick={testProxies} disabled={loading} className="rounded-xl bg-white px-4 py-2 font-bold text-black">
          {loading ? 'Testing...' : 'Test Proxies'}
        </button>
      </div>

      {proxies.map((proxy) => (
        <div
          key={proxy.url}
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
        >
          <div>
            <code className="text-sm text-zinc-200">{proxy.url}</code>

            <div className={`mt-1 text-sm font-bold ${getPingColor(proxy.ping)}`}>
              {proxy.ping ? `${proxy.ping}ms` : 'Unavailable'}
            </div>
          </div>

          <button
            onClick={() => handleCopy(proxy.url)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
          >
            Copy
          </button>
        </div>
      ))}
    </div>
  )
}
