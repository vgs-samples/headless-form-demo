<p align="center"><a href="https://www.verygoodsecurity.com/"><img src="https://avatars0.githubusercontent.com/u/17788525" width="128" alt="VGS Logo"></a></p>
<p align="center"><b>Browser bot with VGS proxy</b></p>
<p align="center"><i>Sample of using Puppteer with VGS alias to auto fill web forms</i></p>

# Instructions for using this App
This demo app demonstrates a use case using users' redacted credentials or credit card information to autofill web forms.

## Requirements
- Installed [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
- Account on [twitter.com](https://twitter.com/)
- Account on [verygoodsecurity.com](https://www.verygoodsecurity.com/)

## VGS base setup
1. Go to VGS dashboard, create a new vault in your organization
2. Setup a new outbound route with wildcard `.*` as upstream to allow all traffic
3. Setup a default inbound route and use it to create aliases for your twitter credentials 
4. Copy the sandbox TLS certificate in `Code snippets` to your app folder

## Run the app
1. Clone this repository and go to the folder
2. Install all dependencies `npm install`
3. Replace the code below with your TLS cert, proxy id, user credentials:
```js
    const cert = fs.readFileSync('sandbox-cert.pem');

    page.on('request', interceptedRequest => {
        const options = {
            uri: interceptedRequest.url(),
            method: interceptedRequest.method(),
            headers: interceptedRequest.headers(),
            body: interceptedRequest.postData(),
            ca: cert,
            proxy: 'http://<username>:<password>@<vault id>.sandbox.verygoodproxy.com:8080'
        };
```
4. Replace the code below with your VGS aliases for twitter
```js
    await page.type('input.js-username-field', 'tok_sandbox_ckYbNN2VibZfDtmRkfMvP3');
    await page.type('input.js-password-field', 'tok_sandbox_8PGi9Kaq4kCYe5Hy9chvU2');
```
4. Turn on logger in VGS dashboard
5. Run `node chrome-bot-twitter.js`

## VGS reveal route setup 
1. Go to logger and filter requests by method `post` to find the request for login
2. Use `Secure this payload` in logger and establish filters for sensitive fields in payload
3. Run the app again and find the corresponding login request in logger, you will find the VGS aliases have been revealed to the original credentials
 


