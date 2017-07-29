/**
 * Created by debbieobrien on 29/07/2017.
 */
//const scrapeIt = require("./scrape-it");
const fs = require('fs');
const json2csv = require('json2csv');
const fields = ['Title', 'Price', 'Image Url', 'Url', 'Time'];

//looks to see if there is a specific directoy and if there isnt it makes it
function isDirSync(aPath){
    try{
        return fs.statSync(aPath).isDirectory();
    }catch (e){
        if(e.code === 'ENOENT'){
            return false;
        }else {
            throw e;
        }
    }
}
if(!isDirSync('data')){
    fs.mkdirSync('data');
}
//scrapes info from website and prints to console
const scrapeIt = require("scrape-it");
const mainURL = "http://www.shirts4mike.com/";
let url;
let urls = [];
//this only gives me one url need to find a way to get all foreach/for in/for ??
    scrapeIt("http://www.shirts4mike.com/shirts.php", {
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
        //console.log(pageurl);
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
                var tshirts = [
                    {
                        "Title": shirtDetails.title,
                        "Price": shirtDetails.price,
                        "Image Url": mainURL + shirtDetails.image,
                        "Url": url,
                        "Time": 'date here'
                    }
                ];
            
                console.log(tshirts)
                var csv = json2csv({data: tshirts, fields:fields});
                console.log(csv);
                fs.writeFile('data/file.csv', csv, function(error){
                    if(error) throw error;
                    console.log('file saved');
                })

                //console.log(shirtDetails)
                //console.log(shirtDetails.title)
                //console.log(shirtDetails.price)
                //console.log(mainURL+shirtDetails.image)
                //console.log(shirtDetails);
            });
        }


        //urls.push(pageurl); // pushes this to array{ pages: 'shirt.php?id=101' }
        //console.log(urls);
        //return urls;
    });
/*//this should be dynamic
urls = ["shirt.php?id=101",
    "shirt.php?id=102",
    "shirt.php?id=103"];*/

