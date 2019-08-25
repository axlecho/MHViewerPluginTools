var program = require('commander')
var cheerio = require('cheerio')
var requirejs = require('requirejs')
var request = require('sync-request')
var find = require('cheerio-eq');
var fs = require('fs')

program
  .option('-b, --base <type>', '插件路径')

program.parse(process.argv)

if (program.base) {
	console.log('插件路径 --> ' + program.base)
} else {
	console.log('请输入插件路径')
}




function checkSite() {
	var site = JSON.parse(fs.readFileSync(program.base + '/site.json'))
	console.log(site)
}


var testPage = request('GET','https://so.177mh.net/k.php?k=%E8%BE%89%E5%A4%9C').getBody('utf8')
// console.log(testPage)
// var testPage = fs.readFileSync(program.base + '/test.html')
var api = require(program.base + '/parser.js')
var root = cheerio.load(testPage)


// console.log(root('ul.new_hits_ul li'))


function DomNode(node) {
    this.html = function(cssQuery) { return (cssQuery === undefined ? node.html() : find(node,cssQuery).html())}
    this.text = function(cssQuery) { return (cssQuery === undefined ? node.text() : find(node,cssQuery).text())}
    this.src  = function(cssQuery) { return (cssQuery === undefined ? node.src() : find(node,cssQuery).attr('src'))}
    this.href = function(cssQuery) { return (cssQuery === undefined ? node.href() : find(node,cssQuery).attr('href'))}
    this.attr = function(attr,cssQuery) { return (cssQuery ===undefined ? node.attr(attr) : find(node,cssQuery).attr(attr)) }
    // Warning this function return a java object
    this.list = function(cssQuery) { 
        var result = []
        for (var i = 0; i < node(cssQuery).length ; i++) {
            result.push(new DomNode(cheerio.load(node(cssQuery).get(i))))
        }
        return result
    }
}

api.console = console
api.doc = new DomNode(root)

// console.log(JSON.parse(api.data()))
// console.log(JSON.parse(api.top()))
console.log(JSON.parse(api.search()))
// console.log(JSON.parse(api.info('237146')))


