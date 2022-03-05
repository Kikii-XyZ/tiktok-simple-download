const cors = require("cors")
const puppeteer = require("puppeteer")
const fetch = require('node-fetch')
const request = require('request')
const fs = require('fs')
const shorten = (url, options) => {
    return new Promise((resolve, reject) => {
        return fetch(`https://tinyurl.com/api-create.php?url=${url}`, options)
            .then((response) => response.text())
            .then((text) => resolve(text))
            .catch((err) => reject(err))
    })
}

function download(url) {
    var names = Date.now() / 10000;
    var download = function(uri, filename, callback) {
        request.head(uri, function(err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    download(url, './media/' + names + '.mp4', async function() {
        let filess = './media/' + names + '.mp4'
        console.log('video downloaded to ' + filess)
        process.exit()
    });
}
let body = process.argv.slice(2)
async function tiktok(link) {
    try {
        if (body[0] == undefined) {
            console.log("ERROR: missing URL parameter");
            process.exit()
            return;
        } else {
            const URL = 'https://tikmate.online'
            const browser = await puppeteer.launch({
                headless: true
            });
            const page = await browser.newPage();
            await page.goto(URL + '/?lang=id#google_vignette');
            await page.type("#url", `${link}`);
            await page.waitForSelector("#send");
            await page.click('#send', {
                delay: 300
            });
            await page.waitForSelector('#download-block > div > a');
            let videoUrl = await page.$eval("#download-block > div > a", async (element) => {
                return element.getAttribute("href")
            });
            let source = await page.$eval("#download-section > div > div:nth-child(1) > div.videotikmate.mb-10 > div.videotikmate-middle.center > div > h1 > div", async (element) => {
                return element.getAttribute("title")
            });
            let titles = await page.$eval("#download-section > div > div:nth-child(1) > div.videotikmate.mb-10 > div.videotikmate-middle.center > p", async (element) => {
                return element.querySelector('span').textContent
            });
            const shorts = await shorten(URL + videoUrl)
            console.log({
                Username: source,
                title: titles,
                videoUrl: shorts
            })
            download(shorts)
        }
    } catch (e) {
        console.log(e)
    }
}

tiktok(body[0])
