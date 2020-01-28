<p align="center"><a href="https://www.verygoodsecurity.com/"><img src="https://avatars0.githubusercontent.com/u/17788525" width="128" alt="VGS Logo"></a></p>
<p align="center"><b>Browser bot with VGS proxy</b></p>
<p align="center"><i>Sample of using Puppeteer with VGS alias to auto fill web forms</i></p>

# Instructions for using this App
This demo app demonstrates a use case using users' redacted credentials or credit card information to autofill web forms.

![demo-form-bot](https://github.com/vgs-samples/headless-form-demo/blob/master/images/sample_form_demo.gif?raw=true)

## Requirements
- Installed [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
- Account on [verygoodsecurity.com](https://www.verygoodsecurity.com/)
- Sample website https://browserbot-demoform.herokuapp.com/

## VGS base setup
1. Go to VGS dashboard, create a new vault in your organization
2. Setup a new outbound route with wildcard `.*` as upstream to allow all traffic
3. Setup a default inbound route and use it to create aliases for your test credentials 
4. Copy the sandbox TLS certificate in `Code snippets` to your app folder

## Run the app
1. Clone this repository and go to the folder
2. Install all dependencies `npm install`
3. Replace the code below with your TLS cert path, vault id and proxy user credentials:
```js
    page.on('request', interceptedRequest => {
            const tunnelingAgent = tunnel.httpsOverHttp({
                ca: [ fs.readFileSync('sandbox-cert.pem')],
                proxy: {
                    host: '<vault it>.sandbox.verygoodproxy.com',
                    port: 8080,
                    proxyAuth: '<username>:<password>'
                }
            });
            const options = {
                uri: interceptedRequest.url(),
                method: interceptedRequest.method(),
                headers: interceptedRequest.headers(),
                agent: tunnelingAgent,
                body: interceptedRequest.postData()
            };
```
4. Replace the code below with your VGS aliases for test personal credentials
```js
    await page.type('input[name=username]', 'tok_sandbox_8rVSERS1WKtC2H3a2mJABY');
    await page.type('input[name=email]', 'la.luo@verygoodsecurity.com');
    await page.type('input[name=password]', 'tok_sandbox_t3TqVDEgkkhofo8BA6xraz');
```
5. Replace the code below with your 2Captcha token
```js
    puppeteer.use(recaptchaPlugin({
        provider:{
            id: '2captcha',
            token: '<2Captcha token>'
        },
        visualFeedback:true
    }));
```
6. Turn on logger in VGS dashboard
7. Run `node puppeteer-demoform.js`

## VGS reveal route setup 
1. Go to logger and filter requests by method `post` to find the request to submit that form

<img src="https://github.com/vgs-samples/headless-form-demo/blob/master/images/request_submit_form.png?raw=true">

2. Use `Secure this payload` in logger and establish filters for sensitive fields in payload

<img src="https://github.com/vgs-samples/headless-form-demo/blob/master/images/select_fields.png?raw=true">

<img src="https://github.com/vgs-samples/headless-form-demo/blob/master/images/setup_routes.png?raw=true">

3. Run the app again and find the corresponding request to submit the form in logger, you will find the VGS aliases have been revealed to the original credentials

<img src="https://github.com/vgs-samples/headless-form-demo/blob/master/images/token_revealed.png?raw=true">



