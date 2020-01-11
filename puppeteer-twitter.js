const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();

    await page.setRequestInterception(true);

    const cert = fs.readFileSync('sandbox-cert.pem');

    page.on('request', interceptedRequest => {
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
    });
    await page.goto('https://twitter.com/login');
    await page.waitForSelector('input.js-username-field'); 
    await page.type('input.js-username-field', 'tok_sandbox_ckYbNN2VibZfDtmRkfMvP3');
    await page.type('input.js-password-field', 'tok_sandbox_8PGi9Kaq4kCYe5Hy9chvU2');
    await page.click('button.submit');
    await page.waitForNavigation({'waitUntil': 'networkidle2'});
    await browser.close();
})();