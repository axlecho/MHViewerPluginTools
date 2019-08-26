var program = require('commander')
var cheerio = require('cheerio')
var requirejs = require('requirejs')
var request = require('sync-request')
var find = require('cheerio-eq');
var fs = require('fs')

program
  .option('-b, --base <type>', '插件路径')
  .option('-f, --function <type>','测试方法')

program.parse(process.argv)

if (program.base) {
	console.log('插件路径 --> ' + program.base)
} else {
	console.log('请输入插件路径')
}





var site = JSON.parse(fs.readFileSync(program.base + '/site.json'))
var testData = JSON.parse(fs.readFileSync(program.base + '/test.json'))
console.log(site)


//  console.log(testPage)
// var testPage = fs.readFileSync(program.base + '/test.html')
var api = require(program.base + '/parser.js')




function DomNode(node) {
    this.html = function(cssQuery) { return (cssQuery === undefined ? node.html() : find(node,cssQuery).first().html().trim())}
    this.text = function(cssQuery) { return (cssQuery === undefined ? node.text() : find(node,cssQuery).first().text().trim())}
    this.src  = function(cssQuery) { return (cssQuery === undefined ? node.src() : find(node,cssQuery).first().attr('src').trim())}
    this.href = function(cssQuery) { return (cssQuery === undefined ? node.href() : find(node,cssQuery).first().attr('href').trim())}
    this.attr = function(attr,cssQuery) { return (cssQuery ===undefined ? node.attr(attr) : find(node,cssQuery).attr(attr).trim())}
    // Warning this function return a java object
    this.list = function(cssQuery) { 
        var result = []
        var list = node(cssQuery)
        var length = list.length

        for (var i = 0; i < length ; i++) {
            result.push(new DomNode(cheerio.load(list.get(i))))
        }

        console.log(result.length)
        return result
    }
}

api.console = console



function test(f) {
	console.log('data : ' + testData[f])
	console.log('url :' + site[f])
	var url = site[f]

	for(var i in testData[f]) {
    	// console.log(i + ':' + testData[f][i])
    	url = url.replace('\$\{' + i + '\}',testData[f][i])
	}
	if(url.startsWith('http')) {

	} else {
		url = site.host + url
	}

	console.log('GET =====> ' + url)
	var result = request('GET',encodeURI(url))
	console.log('GET <===== ' + result.statusCode)
	var testPage = result.getBody('utf8')
	// console.log(testPage)
	var root = cheerio.load(testPage)
	// console.log(root('ul.new_hits_ul li'))
	api.doc = new DomNode(root)
	console.log(JSON.parse(api[f]()))
}

if(program.function) {
	test(program.function)
} else {
	console.log("请输入测试函数")
}


