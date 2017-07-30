/**
 * Created by debbieobrien on 29/07/2017.
 */
const fs = require('fs');
const json2csv = require('json2csv');
const scrapeIt = require("scrape-it");
const shirtsURL = "http://www.shirts4mike.com/shirts.php";
const mainURL = "http://www.shirts4mike.com/";
let urls = [];
let csvData = [];
let date = new Date();
/*
 this function looks to see if there is a specific directory and if there isn't it makes it
 */
function isDirSync(aPath) {
    try {
        return fs.statSync(aPath).isDirectory();
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        } else {
            throw error;
        }
    }
}
if (!isDirSync('data')) {
    fs.mkdirSync('data');
}

function error(error) {
    if (error) throw error;
}
/*
 This function first scrapes the page with the 8 t-shirts and gets the href of each t-shirt
 then it pushes the hrefs/links into an array or uls.
 then it scrapes each of these new links to gets the required t-shirt data
 then it iterates over this data and stores it into an array called csvData and prints the details to a csv file
 the csv file is saved with using today's date
 finally if the site is offline it prints an error and stores it in an error-log file
 which it creates if it is not there and appends to it if it is
 */
function scrapeData() {
    scrapeIt(shirtsURL, {
        tshirtLinks: {
            listItem: ".products li",
            data: {
                links: {
                    selector: "a",
                    attr: "href"
                }
            }
        }
    }).then(pageUrls => {
        pageUrls.tshirtLinks.forEach(function(element) {
            urls.push(mainURL + element.links);
        });
    }).then(() => {
        urls.forEach(function(element) {
            scrapeIt(element, {
                title: "title",
                price: ".wrapper .price",
                image: {
                    selector: ".shirt-picture img",
                    attr: "src"
                }
            }).then(shirtDetails => {
                let tshirts = {
                    "Title": shirtDetails.title,
                    "Price": shirtDetails.price,
                    "Image Url": mainURL + shirtDetails.image,
                    "Url": element,
                    "Time": date.getTime()
                };
                csvData.push(tshirts);
            }).then(() => {
                const fields = ['Title', 'Price', 'Image Url', 'Url', 'Time'];
                let csvFileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                let csvFile = `data/${csvFileName}.csv`;
                let csv = json2csv({
                    data: csvData
                }, {
                    fields: fields
                });
                fs.writeFile(csvFile, csv, error());
            });
        });
    }).catch(function() {
        let errorLog = 'scraper-error.log';
        let errorMessage = `${date.toString()} There’s been a 404 error. Cannot connect to ${mainURL}.\n`;
        console.log(errorMessage);
        if (!errorLog) {
            fs.writeFile(errorLog, errorMessage);
        } else {
            fs.appendFile(errorLog, errorMessage);
        }
    });
}
scrapeData();