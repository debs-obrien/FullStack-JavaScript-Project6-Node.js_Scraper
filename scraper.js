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

/*
this function looks to see if there is a specific directory and if there isn't it makes it
*/
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
/*
 This function first scrapes the page with the 8 t-shirts and gets the href of each t-shirt
 then it pushes the hrefs/links into an array or uls.
 then it scrapes each of these new links to gets the required t-shirt data
 then it stores this data into an array called t-shirts and prints the details to a csv file
 the csv file is saved with using today's date
 finally if the site is offline it prints an error and stores it in an error-log file
 which it creates if it is not there and appends to it if it is
 */
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
        }).then(pageurls => { //end scrapeIt then call promise
            pageurls.tshirtLinks.forEach(function(element){
                urls.push(element.links);
            });//end of forEach
            for(url in urls){
                url = mainURL + urls[url];
                scrapeIt(url, {
                    title: "title",
                    price: ".wrapper .price",
                    image: {
                        selector: ".shirt-picture img",
                        attr: "src"
                    }
                }).then(shirtDetails => {  //end scrapeIt then call promise
                    let tshirts = [
                        {
                            "Title": shirtDetails.title,
                            "Price": shirtDetails.price,
                            "Image Url": mainURL + shirtDetails.image,
                            "Url": url,
                            "Time": date.getTime()
                        }
                    ];
                    let csv = json2csv({data: tshirts, fields:fields});
                    console.log(csv);
                        fs.writeFile('data/'+ csvFileName +'.csv', csv, function(error){
                            if(error) throw error;
                        });
                });//end of promise shirtDetails
            }//end of for
        }).catch(function(){  //end of promise pageurls then it catches
            let errorLog = 'scraper-error.log';
            let errorMessage= `${date.toString()} There’s been a 404 error. Cannot connect to ${mainURL}.\n`;
            console.log(errorMessage);
            if(!errorLog){
                fs.writeFile(errorLog, errorMessage);
            }else{
                fs.appendFile(errorLog, errorMessage);
            }
        });//end of catch
    }//end of function

scrapeData(shirtsURL);
