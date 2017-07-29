/**
 * Created by debbieobrien on 29/07/2017.
 */
//const scrapeIt = require("./scrape-it");
const fs = require('fs');
const json2csv = require('json2csv');
const scrapeIt = require("scrape-it");

const shirtsURL = "http://www.shirts4mike.com/shirts.php";
const mainURL = "http://www.shirts4mike.com/";
let url;
let urls = [];
const fields = ['Title', 'Price', 'Image Url', 'Url', 'Time'];
let date = new Date();
let csvFileName = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

//looks to see if there is a specific directory and if there isn't it makes it
function isDirSync(aPath){
    try{
        return fs.statSync(aPath).isDirectory();
    }catch (error){
        if(error.code === 'ENOENT'){
            return false;
        }else {
            throw error;
        }
    }
}
if(!isDirSync('data')){
    fs.mkdirSync('data');
}
//scrapes info from website and prints to csv file
function scrapeData(site){
        scrapeIt(site, {
            tshirtLinks: {
                listItem: ".products li",
                data: {
                    links: {
                        selector: "a",
                        attr: "href"
                    }
                }
            }
        }).then(pageurls => {
            pageurls.tshirtLinks.forEach(function(element){
                urls.push(element.links);
            });
            for(url in urls){
                 url = mainURL + urls[url];
                scrapeIt(url, {
                    title: "title",
                    price: ".wrapper .price",
                    image: {
                        selector: ".shirt-picture img",
                        attr: "src"
                    }
                }).then(shirtDetails => {
                    let tshirts = [
                        {
                            "Title": shirtDetails.title,
                            "Price": shirtDetails.price,
                            "Image Url": mainURL + shirtDetails.image,
                            "Url": url,
                            "Time": date.getTime()
                        }
                    ];
                    //console.log(tshirts)
                    let csv = json2csv({data: tshirts, fields:fields});
                    console.log(csv);
                    fs.writeFile('data/'+ csvFileName +'.csv', csv, function(error){
                        if(error) throw error;
                    })

                });
            }
        }).catch(function(){
            let errorLog = 'scraper-error.log';
            let errorMessage= `${date.toString()} There’s been a 404 error. Cannot connect to ${mainURL}.\n`;
            console.log(errorMessage);
            if(!errorLog){
                fs.writeFile(errorLog, errorMessage);
            }else{
                fs.appendFile(errorLog, errorMessage);
            }
        });
    }

scrapeData(shirtsURL);

//TODO
//Edit your package.json file so that your program runs when the npm start command is run.