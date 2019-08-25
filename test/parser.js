
 // var api.console = {   log : function(msg) { log.println(msg)} }

var api = api || {
    console : {},
    doc : {},
    info : function(gid) {return info(gid)},
    top : function() {return _top()},
    data : function() {return data()},
    search : function() {return search()}
}



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
    api.doc.list('ul#ConmmandComicTab1_Content0 li').forEach(function(v,i){
        var item = {};
        item.gid = v.href('a').replace(/[^0-9]/ig,'');
        item.title = v.text('a');
        item.thumb = v.src('img');
        api.console.log(item);
        result.datas.push(item);
    });
    result.pages = 1;
    result.currentPage = 1;
    
    //api.console.log(result);
    return JSON.stringify(result); 
}

function _top() {
    var result = {};
    result.datas = [];
    api.doc.list('ul#ConmmandComicTab1_Content0 li').forEach(function(v,i){
        var item = {};
        item.gid = v.href('a').replace(/[^0-9]/ig,'');
        item.title = v.text('i');
        item.thumb = v.src('img');
        result.datas.push(item);
    });
    result.pages = 1;
    result.currentPage = 1;
    return JSON.stringify(result);
};

function search() {
    var result = {};
    result.datas = [];
    api.doc.list('ul.mh-list li').forEach(function(v,i){
        var item = {};
        item.gid = v.href('a').replace(/\//g,'');
        item.title = v.text('h2 ');
        // item.thumb = v.attr('p','style').replace('background-image: url(',"").replace(')','');
        item.uploader = v.text('p.author a')
        result.datas.push(item);
    })
    var pages = 1;
    result.currentPage = api.doc.text('div.page-pagination a.active')
    api.doc.list('div.page-pagination a').forEach(function(v,i) {
        // console.log(i)
        var index = parseInt(v.text().trim())
        if(!isNaN(index)) {
            if(pages < index) {
                pages = index
            }
        }
    })
    result.pages = pages;
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