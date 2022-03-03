//for repo_api.js
/////////////////////////////////
async function loadIndex(api){
  var $index = fn.q('#index')
  $index.innerHTML=''
  var tag_css=`<style>
#index nav.ul{display: flex;flex-direction: column-reverse;}  
  </style>`
  var tag_h1 =`<h1>Index  <a>update</a></h1>`
  var tag_nav=`<nav class="ul"></nav>`
  var tag_li=`<li><a>?</a></li>`
  var $h1 =fn.i3(tag_h1)
  var $nav=fn.i3(tag_nav)
  var $upd=fn.q('a',$h1)
  var $css=fn.i3(tag_css)
  ;
  var addnew =()=>{
    var li = fn.a2(fn.i3(tag_li),$nav)
    var el = fn.q('a',li)
    var name = fn.rkana(8) + '.txt'
    el.textContent = `＃新規 | ${name}`
    el.href=`?file=${name}`
    el.parentElement.style.order = ~~( Date.now()/(60*1000) )  
  }
  var update =async ()=>{
    $nav.innerHTML=''
    var res = await api.get()//api.isfile();
    var list = res/*.data*/.map(d=>d.name).filter(d=>/\.txt/.test(d))
    for(const d of list){
      var li = fn.a2(fn.i3(tag_li),$nav)
      var el = fn.q('a',li)
      el.textContent = d;
      el.dataset.name = d;
      //api.isfile(d,'summary')
      api.summary(d).then(d=>{
        var s =d//d.summary;
        var name = s.name
        var el = fn.q(`[data-name="${name}"]`,$nav)
        Object.assign(el.dataset,s)
        el.textContent =`${s.title} | ${s.time} | ${s.lines} | ${s.name}`;
        el.parentElement.style.order = ~~( s.timestamp/(60*1000) )
        el.href=`?file=${name}`
      })
    }
    addnew();

  }

  ;
  fn.a2($css,$index)
  fn.a2($h1,$index)
  fn.a2($nav,$index)
  $upd.onclick=update
}

window.loadIndex = loadIndex;

////////////////////////////////////////////////////////////////////
