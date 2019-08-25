
 // var api.console = {   log : function(msg) { log.println(msg)} }

var api = {
    console : {},
    doc : {},
    info : function(gid) {return info(gid)},
    top : function() {return _top()},
    data : function() {return data()},
    search : function() {return search()}
}


function DomNode(node) {
    this.html = function(cssQuery) { return (cssQuery === undefined ? node.html() : node.html(cssQuery)) + ''};
    this.text = function(cssQuery) { return (cssQuery === undefined ? node.text() : node.text(cssQuery)) + ''};
    this.src  = function(cssQuery) { return (cssQuery === undefined ? node.src() : node.src(cssQuery)) + ''};
    this.href = function(cssQuery) { return (cssQuery === undefined ? node.href() : node.href(cssQuery)) + ''};
    this.attr = function(attr,cssQuery) { return (cssQuery ===undefined ? node.attr(attr) : node.attr(cssQuery,attr)) + ''};
    // Warning this function return a java object
    this.list = function(cssQuery) { 
        var result = [];
        for (var i = 0; i < node.list(cssQuery).size(); i++) {
            result.push(new DomNode(node.list(cssQuery).get(i)));
        }
        return result;
    };
}

// var api.doc = new DomNode(jsoup)

function parseTitle() {
    return jsoup.text('ul.ar_list_coc li:eq(0)') + '';
};


function info(gid) {
    var result = {};
    result.info = {};
    result.info.gid = gid + '';
    result.info.title =  api.doc.text('ul.ar_list_coc li:eq(0)');
    result.info.titleJpn = '';
    result.info.posted = api.doc.text('ul.ar_list_coc li:eq(4)').replace(/[^0-9]/ig,'');
    result.info.thumb = api.doc.src('div.ar_list_coc img');
    result.info.uploader =  api.doc.text('ul.ar_list_coc li:eq(1) a'); 
    result.intro = api.doc.text('i#det') + '';
    result.chapterCount = api.doc.text('ul.ar_list_coc li:eq(3)').replace(/[^0-9]/ig,'');
    result.favoriteCount = 0;
    result.chapters = [];

    api.doc.list('ul.ar_rlos_bor li').forEach(function(v,i) {
        var chapter = {};
        chapter.title = v.text('a');
        chapter.url = v.href('a');
        result.chapters.push(chapter);
    });
    
    result.comments = [];
    updateTime = 0;
    return JSON.stringify(result);
};

function recent() {
    var result = {};
    result.datas = [];
    api.doc.list('ul.new_hits_ul li').forEach(function(v,i){
        var item = {};
        item.gid = v.href('a').replace(/[^0-9]/ig,'');
        item.title = v.text('a');
        item.thumb = v.src('img');
        api.console.log(item);
        result.datas.push(item);
    });
    result.pages = 1;
    result.currentPage = 1;
    
    api.console.log(result);
    return JSON.stringify(result); 
}

function _top() {
    var result = {};
    result.datas = [];
    api.doc.list('ul.new_hits_ul li').forEach(function(v,i){
        var item = {};
        item.gid = v.href('a').replace(/[^0-9]/ig,'');
        item.title = v.text('a');
        item.thumb = v.src('img');
        api.console.log(item);
        result.datas.push(item);
    });
    result.pages = 1;
    result.currentPage = 1;
    return JSON.stringify(result);
};

function search() {
    var result = {};
    result.datas = [];
    api.doc.list('div.ar_list_co ul dl').forEach(function(v,i){
        var item = {};
        item.gid = v.href('a').replace('https://www.177mh.net','').replace(/[^0-9]/ig,'');
        item.title = v.text('h1');
        item.thumb = v.src('img');
        item.uploader = v.text('i.author a:eq(1)')
        result.datas.push(item);
    });
    result.pages = api.doc.text('div.pages_s').split('/')[1].replace(/[^0-9]/ig,'');
    result.currentPage = api.doc.text('div.pages_s').split('/')[0].replace(/[^0-9]/ig,'');
    return JSON.stringify(result);   
};

function data() {
    var result = {};
    result.data = [];
    var script = api.doc.html('script')
    eval(script);
    var paths = msg.split('|');
    for (var i = 0; i < paths.length; i++) {
        result.data.push('https://hws.readingbox.net/h' + img_s + '/' + paths[i] + '.webp')
    }
    return JSON.stringify(result);
};

module.exports = api