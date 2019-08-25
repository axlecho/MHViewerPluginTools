var program = require('commander')
var cheerio = require('cheerio')
var requirejs = require('requirejs');
var fs = require('fs')

program
  .option('-b, --base <type>', '插件路径')

program.parse(process.argv);

if (program.base) {
	console.log('插件路径 --> ' + program.base);
} else {
	console.log('请输入插件路径')
}




function checkSite() {
	var site = JSON.parse(fs.readFileSync(program.base + '/site.json'))
	console.log(site)
}


function testApi() {
	var jsoup = {}
	var log = {}

	requirejs.config({
		paths:{
        	"parse": program.base + '/parser'
    	},
	    //Pass the top-level main.js/index.js require
	    //function to requirejs so that node modules
	    //are loaded relative to the top-level JS file.
	    nodeRequire: require
	});

	requirejs(['parse'], function   () {
		// console.log(jsoup)
	});
}

testApi()
var a = requirejs('parse')
console.log('--------------------')
console.log(a)