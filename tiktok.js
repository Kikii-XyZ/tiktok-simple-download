
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
    
})
}
let body = process.argv.slice(2)
async function tiktok(link) {
    try {
		if ( body[0] == undefined) {
            console.log("ERROR: missing URL parameter");
			process.exit()
            return;
        } else {
        const URL = 'https://id.savefrom.net/62/download-from-tiktok'
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(URL, {delay: 500});
        await page.type("#sf_url", `${link}`);
        await page.waitForSelector("#sf_submit");
        await page.click('#sf_submit', {
            delay: 500
        });
        await page.waitForSelector('#sf_result > div > div.result-box.video > div.info-box > div.link-box > div.def-btn-box > a');
        let title = await page.$eval("#sf_result > div > div.result-box.video > div.info-box > div.meta > div.row.title", async (element) => {
            return element.getAttribute("title")
        });
		let videoUrl = await page.$eval("#sf_result > div > div.result-box.video > div.info-box > div.link-box > div.def-btn-box > a", async (element) => {
            return element.getAttribute("href")
        });
		const shorts = await shorten(videoUrl)
		const res ={
            title: title,
            url: shorts
        } 
		download(videoUrl)
		console.log(res)
        
		}
    } catch (e) {
        console.log(e)
		process.exit()
    }
}

tiktok(body[0])
