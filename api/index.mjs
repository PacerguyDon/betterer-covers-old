import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import express from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadEnvFile(filename) {
  const filePath = path.join(__dirname, filename)

  if (!fs.existsSync(filePath)) {
    return
  }

  const contents = fs.readFileSync(filePath, 'utf8')

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

    if (!key || process.env[key] !== undefined) {
      continue
    }

    process.env[key] = value
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT ?? (isProduction ? 4173 : 8787))

const TRAKT_BASE_URL = 'https://api.trakt.tv'
const TRAKT_DEFAULT_USER =
  process.env.TRAKT_DEFAULT_USER ?? process.env.TRAKT_USER ?? 'snoak'
const TRAKT_CLIENT_ID = process.env.TRAKT_CLIENT_ID?.trim() ?? ''
const execFileAsync = promisify(execFile)

function createHttpError(message, status = 500) {
  const error = new Error(message)
  error.status = status
  return error
}

function getErrorStatus(error, fallback = 500) {
  return typeof error?.status === 'number' ? error.status : fallback
}

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback
}

function ensureTraktClientId() {
  if (!TRAKT_CLIENT_ID) {
    throw createHttpError(
      'TRAKT_CLIENT_ID is not configured on the server.',
      500,
    )
  }
}

function traktHeaders() {
  ensureTraktClientId()

  return {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': TRAKT_CLIENT_ID,
  }
}

async function curlJsonRequest(url, options = {}) {
  const {
    body,
    headers = {},
    method = 'GET',
  } = options

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'betterer-covers-'))
  const headersPath = path.join(tempDir, 'headers.txt')
  const bodyPath = path.join(tempDir, 'body.txt')
  const args = [
    '--silent',
    '--show-error',
    '--compressed',
    '--dump-header',
    headersPath,
    '--output',
    bodyPath,
    '--request',
    method,
  ]

  for (const [key, value] of Object.entries(headers)) {
    args.push('--header', `${key}: ${value}`)
  }

  if (body) {
    args.push('--data', JSON.stringify(body))
  }

  args.push(url)

  try {
    await execFileAsync('curl', args, {
      maxBuffer: 16 * 1024 * 1024,
    })

    const rawHeaders = fs.readFileSync(headersPath, 'utf8')
    const rawBody = fs.readFileSync(bodyPath, 'utf8')
    const headerBlocks = rawHeaders.trim().split(/\r?\n\r?\n+/).filter(Boolean)
    const headerLines = (headerBlocks.at(-1) ?? '').split(/\r?\n/).filter(Boolean)
    const statusLine = headerLines.shift() ?? ''
    const statusMatch = statusLine.match(/HTTP\/\S+\s+(\d{3})/)
    const status = Number(statusMatch?.[1] ?? '0')
    const responseHeaders = new Headers()

    for (const line of headerLines) {
      const separatorIndex = line.indexOf(':')

      if (separatorIndex === -1) {
        continue
      }

      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      responseHeaders.append(key, value)
    }

    const contentType = responseHeaders.get('content-type') ?? ''
    const payload =
      rawBody.length === 0
        ? null
        : contentType.includes('application/json')
          ? JSON.parse(rawBody)
          : rawBody

    return {
      body: payload,
      headers: responseHeaders,
      status,
    }
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true })
  }
}

async function traktRequest(endpoint, options = {}) {
  const {
    body,
    method = 'GET',
  } = options

  const response = await curlJsonRequest(`${TRAKT_BASE_URL}${endpoint}`, {
    body,
    headers: {
      ...traktHeaders(),
      Accept: 'application/json',
    },
    method,
  })
  const payload = response.body

  if (response.status < 200 || response.status >= 300) {
    const fallbackMessage = `Trakt request failed with ${response.status}`
    const message =
      typeof payload === 'string'
        ? payload.trim() || fallbackMessage
        : payload && typeof payload === 'object' && 'message' in payload
          ? payload.message
          : fallbackMessage

    throw createHttpError(message, response.status)
  }

  return {
    body: payload,
    headers: response.headers,
  }
}

function normalizeUserId(value) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

async function fetchAllLists(userId) {
  const safeUserId = encodeURIComponent(userId)
  const firstPage = await traktRequest(
    `/users/${safeUserId}/lists?extended=images&page=1&limit=50`,
  )
  const pageCount = Number(firstPage.headers.get('x-pagination-page-count') ?? '1')
  const firstPayload = firstPage.body

  if (pageCount <= 1) {
    return firstPayload
  }

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      traktRequest(
        `/users/${safeUserId}/lists?extended=images&page=${index + 2}&limit=50`,
      ).then((response) => response.body),
    ),
  )

  return [firstPayload, ...remainingPages].flat()
}

function normalizeRemoteUrl(value) {
  if (!value) {
    return null
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `https://${value.replace(/^\/+/, '')}`
}

function isAllowedRemoteHost(urlString) {
  const url = new URL(urlString)

  return ['media.trakt.tv', 'walter-r2.trakt.tv', 'images.trakt.tv'].some(
    (host) => url.hostname === host,
  )
}

const app = express()

app.disable('x-powered-by')

app.get('/api/trakt/context', (_request, response) => {
  response.json({
    defaultUser: TRAKT_DEFAULT_USER,
  })
})

app.get('/api/trakt/users/:user/lists', async (request, response) => {
  const userId = normalizeUserId(request.params.user) ?? TRAKT_DEFAULT_USER

  try {
    const payload = await fetchAllLists(userId)
    response.setHeader('Cache-Control', 'public, max-age=600')
    response.json(payload)
  } catch (error) {
    response.status(getErrorStatus(error, 502)).json({
      message: getErrorMessage(error, 'Failed to load Trakt lists.'),
    })
  }
})

app.get('/api/trakt/users/:user/lists/:slug/items', async (request, response) => {
  const userId = normalizeUserId(request.params.user) ?? TRAKT_DEFAULT_USER
  const listSlug = normalizeUserId(request.params.slug)

  if (!listSlug) {
    response.status(400).json({ message: 'A list slug is required.' })
    return
  }

  try {
    const payload = await traktRequest(
      `/users/${encodeURIComponent(userId)}/lists/${encodeURIComponent(listSlug)}/items?extended=full,images&page=1&limit=1000`,
    )
    response.setHeader('Cache-Control', 'public, max-age=600')
    response.json(payload.body)
  } catch (error) {
    response.status(getErrorStatus(error, 502)).json({
      message: getErrorMessage(error, 'Failed to load Trakt list items.'),
    })
  }
})

app.get('/api/trakt/lists', async (request, response) => {
  try {
    const payload = await fetchAllLists(TRAKT_DEFAULT_USER)
    response.setHeader('Cache-Control', 'public, max-age=600')
    response.json(payload)
  } catch (error) {
    response.status(getErrorStatus(error, 502)).json({
      message: getErrorMessage(error, 'Failed to load Trakt lists.'),
    })
  }
})

app.get('/api/trakt/lists/:slug/items', async (request, response) => {
  const listSlug = normalizeUserId(request.params.slug)

  if (!listSlug) {
    response.status(400).json({ message: 'A list slug is required.' })
    return
  }

  try {
    const payload = await traktRequest(
      `/users/${encodeURIComponent(TRAKT_DEFAULT_USER)}/lists/${encodeURIComponent(listSlug)}/items?extended=full,images&page=1&limit=1000`,
    )
    response.setHeader('Cache-Control', 'public, max-age=600')
    response.json(payload.body)
  } catch (error) {
    response.status(getErrorStatus(error, 502)).json({
      message: getErrorMessage(error, 'Failed to load Trakt list items.'),
    })
  }
})

app.get('/api/poster', async (request, response) => {
  const src =
    typeof request.query.src === 'string'
      ? normalizeRemoteUrl(request.query.src)
      : null

  if (!src) {
    response.status(400).json({ message: 'A poster source URL is required.' })
    return
  }

  if (!isAllowedRemoteHost(src)) {
    response.status(400).json({ message: 'That poster host is not allowed.' })
    return
  }

  try {
    const remoteResponse = await fetch(src)

    if (!remoteResponse.ok) {
      response
        .status(remoteResponse.status)
        .json({ message: 'Remote poster request failed.' })
      return
    }

    response.setHeader(
      'Cache-Control',
      remoteResponse.headers.get('cache-control') ?? 'public, max-age=86400',
    )
    response.setHeader(
      'Content-Type',
      remoteResponse.headers.get('content-type') ?? 'image/webp',
    )

    if (!remoteResponse.body) {
      response.status(502).end()
      return
    }

    Readable.fromWeb(remoteResponse.body).pipe(response)
  } catch (error) {
    response.status(502).json({
      message:
        error instanceof Error ? error.message : 'Poster proxy request failed.',
    })
  }
})

export default app;

