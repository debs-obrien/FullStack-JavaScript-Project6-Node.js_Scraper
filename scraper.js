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

scrapeIt("http://www.shirts4mike.com/shirt.php", {
    //title: "title",
    //price: ".wrapper .price",
         url: {
            selector: ".products a",
            attr: "href"
        }
    /*image: {
        selector: ".shirt-picture img",
        attr: "src"
    }*/

}).then(page => {
    console.log(page);
});