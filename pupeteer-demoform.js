const puppeteer = require('puppeteer-extra');
const request = require('request');
const fs = require('fs');
const tunnel = require('tunnel');
const recaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

(async () => {
    puppeteer.use(recaptchaPlugin({
        provider:{
            id: '2captcha',
            token: '72fd7ebda90588d56abb09f840d21f28'
        },
        visualFeedback:true
    }));

    const browser = await puppeteer.launch({slowMo:20, args: ['--enable-features=NetworkService', '--disable-setuid-sandbox', '--no-sandbox'], headless: false});
    let page = await browser.newPage();

    const cert = fs.readFileSync('sandbox-cert.pem');

    await page.goto('https://browserbot-demoform.herokuapp.com/');
    await page.waitForSelector('input[name=username]'); 
    await page.type('input[name=username]', 'tok_sandbox_8rVSERS1WKtC2H3a2mJABY');
    await page.type('input[name=email]', 'la.luo@verygoodsecurity.com');
    await page.type('input[name=password]', 'tok_sandbox_t3TqVDEgkkhofo8BA6xraz');
    await page.click('#agreement');
    await page.solveRecaptchas();

    await page.setRequestInterception(true);

    page.on('request', interceptedRequest => {
            const tunnelingAgent = tunnel.httpsOverHttp({
                ca: [ fs.readFileSync('sandbox-cert.pem')],
                proxy: {
                    host: 'tntsbgzydwl.sandbox.verygoodproxy.com',
                    port: 8080,
                    proxyAuth: 'USc5UMsySENn57aBUuSVpKCs:9544a4ec-9c57-48a3-9159-81f0eee8eb81'
                }
            });
            const options = {
                uri: interceptedRequest.url(),
                method: interceptedRequest.method(),
                headers: interceptedRequest.headers(),
                agent: tunnelingAgent,
                body: interceptedRequest.postData()
            };

            request(options, function(err, resp, body) {
                if (err) {
                    console.log(err);
                }
                interceptedRequest.respond({
                    status: resp.statusCode,
                    contentType: resp.headers['content-type'],
                    headers: resp.headers,
                    body: body
                });
            });
    });
    await page.click('#register');

    await page.waitForNavigation();
    await page.waitFor(2000);
    await browser.close();
})();