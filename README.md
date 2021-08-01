# Cloudflare Workers AWS Translate

- [Cloudflare Workers AWS Translate](#cloudflare-workers-aws-translate)
  - [prerequisites](#prerequisites)
  - [installation](#installation)
  - [usage](#usage)

Use [AWS Translate](https://aws.amazon.com/translate/faqs/) with Cloudflare Workers to translate words and sentences from one language to another. I mainly created this to use it in a workflow with [Alfred](https://www.alfredapp.com) so I can quickly translate a word without opening a web page.

Since you still can't expose Lambda functions via a public URL without using things like Load Balancers or API Gateway, let's just put a Cloudflare Worker in between.

## prerequisites

- Cloudflare Account
- [Cloudflare Wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
- AWS Access and Secret Key with IAM permissions to use AWS Translate and optionally AWS Comprehend to figure out which input language is being used if you don't specify one. You can do this easily with the IAM policy generator.

## installation

- Update `wrangler.toml` with your Cloudflare Account ID
- Install the packages

```shell
npm i
```

- Create the required secrets to access AWS Services and your very own token to access the Worker itself in order to prevent abusing your AWS Account resources for AWS Translate (they offer a nice free tier but it's not unlimited). This should probably be part of a header or used with Cloudflare Access in the future.

```
wrangler secret put accessKey
wrangler secret put secretKey
wrangler secret put token
```

- Run the development server locally

```
wrangler dev
```

- Publish it to Cloudflare Workers to you can use it publicly:

```
wrangler publish
```

## usage

These are the defaults:

- Input Language: Use Amazon Comprehend to detect language
- Output Language: German

These can be changed by adding/changing the URL parameters.

Some example requests:

**Translate text from English to German** (default):

```shell
curl 'http://localhost:8787/?text=banana%20pancakes&from=en&to=de&token=your-token'
```

The output will look like this then:

```json
{
  "success": true,
  "SourceLanguageCode": "en",
  "TargetLanguageCode": "de",
  "TranslatedText": "Bananenpfannkuchen"
}
```

**Translate from English to Italian**:

```shell
curl 'http://localhost:8787/?text=hello%20my%20dear&to=it&token=your-token'
```

**Translate from German to French**:

... by setting German as the input language instead of using auto mode

```shell
curl 'http://localhost:8787/?text=hallo%20was%20machen%20wir%20heute&from=de&to=fr&token=your-token'
```
