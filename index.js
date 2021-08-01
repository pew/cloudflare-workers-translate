import {
  TranslateClient,
  TranslateTextCommand,
} from '@aws-sdk/client-translate'

let client = new TranslateClient({
  region: 'us-east-1',
  credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
})

function simpleResponse(message) {
  return new Response(JSON.stringify(message), {
    headers: { 'content-type': 'application/json' },
  })
}

async function translate(params) {
  let translateParams = {
    SourceLanguageCode: params.srclang ? params.srclang : 'auto',
    TargetLanguageCode: params.dstlang ? params.dstlang : 'de',
    Text: params.text,
  }

  try {
    let command = new TranslateTextCommand(translateParams)
    let data = await client.send(command)
    return data
  } catch (error) {
    console.error(error)
  }
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  let { searchParams } = new URL(request.url)

  let providedToken = searchParams.get('token')
  if (providedToken !== token) {
    let msg = { success: false, message: 'provide token' }
    return simpleResponse(msg)
  }

  let text = searchParams.get('text')
  if (!text) {
    let msg = { success: false, message: 'provide text' }
    return simpleResponse(msg)
  }

  let params = {
    srclang: searchParams.get('from'),
    dstlang: searchParams.get('to'),
    text,
  }

  let output = await translate(params)
  output = {
    success: true,
    SourceLanguageCode: output.SourceLanguageCode,
    TargetLanguageCode: output.TargetLanguageCode,
    TranslatedText: output.TranslatedText,
  }

  return new Response(JSON.stringify(output), {
    headers: { 'content-type': 'application/json' },
  })
}
