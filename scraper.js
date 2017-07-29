/**
 * Created by debbieobrien on 29/07/2017.
 */
//const scrapeIt = require("./scrape-it");
const fs = require('fs');

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

tshirts = {

}
let urls = [];
//this only gives me one url need to find a way to get all foreach/for in/for ??
    scrapeIt("http://www.shirts4mike.com/shirts.php", {
        pageLinks: {
            listItem: ".products li",
            data: {
                links: {
                    selector: "a",
                    attr: "href"
                }
            }
            }
    }).then(pageurl => {
        console.log(pageurl);
        pageurl.pageLinks.forEach(function(element){
            urls.push(element.links);
        })
        //urls.push(pageurl); // pushes this to array{ pages: 'shirt.php?id=101' }
        console.log(urls);
        return urls;
    });
//this should be dynamic
urls = ["shirt.php?id=101",
    "shirt.php?id=102",
    "shirt.php?id=103"];

//this is working great
for(url in urls){
    var url = 'http://www.shirts4mike.com/' + urls[url];

scrapeIt(url, {
    title: "title",
    price: ".wrapper .price",
    image: {
        selector: ".shirt-picture img",
        attr: "src"
    }

}).then(page => {
    console.log(page);
});
}