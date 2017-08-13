
// function waterfall(){
//     let col = parseInt($('.pic').width()/$('.pic li').width())

//     console.log($('.pic li').width())
//     let arr = []
//     for(var i = 0;i < col;i++){
//         arr[i] = 0
//     }
//     $('.pic li').each(function(){
//         let minValue = Math.min.apply(null,arr)
//         let minIndex = arr.indexOf(minValue)
//         $(this).css({
//             top: arr[minIndex],
//             left: $(this).outerWidth(true)*minIndex
//         })
//         arr[minIndex] += $(this).outerHeight(true)
//     })
    

// }
// var waterFall = (function(){
//     function init(){
//         waterfall()
//         $(window).resize(function(){
//             waterfall()
//         })
//     }
//     return {
//         init: init
//     }

    
// })()

// 1. 获取数据
// 2. 把数据变为DOM，通过瀑布流的方式添加到页面上
// 3. 当load按钮可见的时候，重复1
let perPageCount = 10
let currentPage = 1
let arr = []
let col = parseInt($('.pic').width()/$('.pic li').outerWidth(true))
for(let i=0;i<col;i++){
    arr[i] = 0
}
let isDataArrive = null
start()
function start(){
    
    getData(function(newsList){  
        
       // console.log(0)
        $(newsList).each(function(index,news){
            let $node = getNodes(news)
            $node.find('img').load(function(){
                $('.pic').append($node)
                waterFallPlace($node)
            })
        })
        isDataArrive = true 
        
    })
    isDataArrive = false   //搞不懂
}
$(window).scroll(function(){ 
    console.log(isDataArrive)
    if(!isDataArrive) return  // 防止重复触发
    if(isVisible($('#load'))){
        start()
    }
})


function isVisible(element){
    let windowHeight = $(window).height()
    let elementTop = element.offset().top
    let scrollTop = $(window).scrollTop()
    if(elementTop < scrollTop + windowHeight){
        return true
    }else{
        return false
    }
}

function getData(callback){
    
    $.ajax({
        url: '//platform.sina.com.cn/slide/album_tech',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: {
            app_key: '1271687855',
            num: perPageCount,
            page: currentPage
        }
    }).done(function(ret){
        if(ret && ret.status && ret.status.code === '0'){
            callback(ret.data)
            currentPage++
            
        }else{
            console.log('error！')
        }
    })
}

function getNodes(item){
    let html = ''
    html += '<li class="item"><a href='+ item.url +' class="link">\
    <img src='+ item.img_url +'></a><h4>'+ item.short_name +'</h4><p>'+ item.short_intro +'</p>'
    return $(html)
}

function waterFallPlace($node){
    let minValue = Math.min.apply(null,arr)
    let minIndex = arr.indexOf(minValue)
    $node.css({
        top: minValue,
        left: $('.pic li').outerWidth(true)*minIndex
    })
    arr[minIndex] += $node.outerHeight(true)
    $('.pic').height(Math.max.apply(null,arr))

}