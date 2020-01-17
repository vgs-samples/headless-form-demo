const puppeteer = require('puppeteer-extra');
const recaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs');
const request = require('request');


(async () => {
    puppeteer.use(recaptchaPlugin({
        provider:{
            id: '2captcha',
            token: '72fd7ebda90588d56abb09f840d21f28'
        },
        visualFeedback:true
    }));

    const cert = fs.readFileSync('sandbox-cert.pem');
    const browser = await puppeteer.launch({headless: false, slowMo:20, args: ['--enable-features=NetworkService']});
    let page = await browser.newPage();
    
    await page.goto('https://old.reddit.com/login');
    await page.type('#user_reg', 'VGS-reddit');
    await page.type('#passwd_reg', 'tok_sandbox_rtAWLQwjhhY3L2ytYBkkkW');
    await page.focus('#passwd2_reg');
    await page.waitFor(2000);
    await page.type('#passwd2_reg', 'tok_sandbox_rtAWLQwjhhY3L2ytYBkkkW');
    await page.type('#email_reg', 'vgs.reddit@verygoodsecurity.com');
    await page.waitForSelector('div.g-recaptcha');
    await page.solveRecaptchas();

    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().endsWith('.gif'))
            interceptedRequest.abort();
        else {
            const options = {
                uri: interceptedRequest.url(),
                method: interceptedRequest.method(),
                headers: interceptedRequest.headers(),
                body: interceptedRequest.postData(),
                ca: cert,
                proxy: 'http://USc5UMsySENn57aBUuSVpKCs:9544a4ec-9c57-48a3-9159-81f0eee8eb81@tntsbgzydwl.sandbox.verygoodproxy.com:8080'
            };
    
            request(options, function(err, resp, body) {
                if (err) {
                    console.error(`Unable to call ${options.uri}`, err);
                    return interceptedRequest.abort('connectionrefused');
                }
                interceptedRequest.respond({
                    status: resp.statusCode,
                    contentType: resp.headers['content-type'],
                    headers: resp.headers,
                    body: body
                });
            });
        }
    });
    await page.click('button[tabindex="2"]');
    await page.setRequestInterception(false);

    await page.waitForNavigation();
    await page.waitFor(2000);

    await page.screenshot({path:'result.png'});
    await browser.close();
})();