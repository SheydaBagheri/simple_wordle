import { NextResponse } from 'next/server'
import { ProxyAgent } from 'proxy-agent'

type ProxyResult = {
  url: string
  ping: number | null
  success: boolean
}

async function testProxy(url: string): Promise<ProxyResult> {
  const start = performance.now()

  try {
    const agent = new ProxyAgent({
      uri: url,
    })

    await fetch('https://example.com', {
      dispatcher: agent as any,
      signal: AbortSignal.timeout(5000),
    })
    const ping = Math.floor(performance.now() - start)

    return {
      url,
      ping,
      success: true,
    }
  } catch {
    return {
      url,
      ping: null,
      success: false,
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const proxies: string[] = body.proxies || []

    const results = await Promise.all(proxies.map(testProxy))

    results.sort((a, b) => {
      if (a.ping === null) return 1
      if (b.ping === null) return -1

      return a.ping - b.ping
    })

    return NextResponse.json(results)
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Failed testing proxies',
      },
      {
        status: 500,
      }
    )
  }
}
