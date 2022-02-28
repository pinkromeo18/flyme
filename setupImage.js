function setupImage(q,dat,api,q_drop){

  var $image =fn.q(q);
  var $m =fn.q(q_drop);
  
  $image.innerHTML='';
  var q_fig ='[data-fig]';
  var has_stick_cls='has-fig-sticky'
  
  $image.classList.remove(has_stick_cls); //<------------- reload clear
  
  var stick_cls = 'fig-sticky'
  var stick =(ev)=>{
    if(!ev.target.dataset.img) return;
    var el = ev.target.parentElement;
    //console.log(el,ev.target)
    if(el.classList.contains(stick_cls)){
      el.classList.remove(stick_cls)
      $image.classList.remove(has_stick_cls);
      return;
    }
    var old=fn.q(stick_cls);
    if(old) old.classList.remove(stick_cls);
    ;
    el.classList.add(stick_cls)
    $image.classList.add(has_stick_cls);    
  }

  var isimage =(str)=>{
    return /\.gif|\.jpg|\.jpeg|\.png|\.webp/i.test(str)
  }
  var getsrc =(strline)=>{
    if(!/http/.test(strline))return;
    if(!isimage(strline))return;
    var ary = strline.split('http');
    var alt =ary[0]
    var src ='http' + ary[1];
    return {src,alt};
  }

  var makefigure = (strline,order)=>{
    if(!/http/.test(strline))return;
    var ary = strline.split('http');
    var alt =ary[0]
    var src ='http' + ary[1];
    var tag =`
  <img src="${src}" alt="${alt}" data-img="true">
  <figcaption>${alt}</figcaption>`;
    var fig =document.createElement('figure');
    fig.innerHTML =tag;
    fig.dataset.fig ='true'; //[data-fig]
    fig.style.order = order||1;
    var fra =document.createDocumentFragment();
    fra.appendChild(fig)
    //console.log(fra)
    return fra;
  }

  var makefigure_dat =(dat,order)=>{
    var f=(str)=>{
      var obj = getsrc(str);
      var old;
      var err;
      try{
        old=fn.q(`[src="${obj.src}"]`,$image);
      }catch(e){err=true}
      if(err) return;
      if(old){
        if(old.alt == obj.alt)return;
        old.alt = obj.alt;
        var pa=old.parentElement;
        var cap = fn.q('figcaption',pa);
        cap.textContent = obj.alt;
        return;
      }
      var el = makefigure(str);
      $image.appendChild(el);
    }
    var ary = dat.split('\n').filter(d=>getsrc(d))
    ary.map(f)
  }
  //var str=`＊繁華街：繁華街はサイバーブルーに彩られているhttps://bit.ly/3vlr7Mq`
  //var dat=[str,str,str,str].join('\n')
  $image.onclick= stick;
  if(dat) makefigure_dat(dat);  
  ///
  drop(async (file,url)=>{
    //console.log(file,url)
    if(!url){
      var name = newname(file.name);
      var download_url = await api.upimage(file, 'img/'+name )
      //var {download_url} =res.data.content
      //console.log(res,download_url)
      return f(download_url);      
    }
    return f(url)
    ;      
    function f(url){
      var el = document.activeElement;
      if(!el.dataset.ed) el=fn.q('[data-ed]',$m);
      el.textContent +='\n'+url;
      var dat = el.textContent;
      makefigure_dat(dat); // drop and update image <-----------------
    }
    function newname(d,exe){
      d = d||''
      var n=d.lastIndexOf('.')
      if(n!=-1) exe = d.slice(n);
      exe = exe||''
      var name = fn.rkana(8)
      return name + exe;
    }  

  })  
  
  ///
  return makefigure_dat
}
