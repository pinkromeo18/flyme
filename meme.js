//meme
//need meme.css
;(function(root){

  fn.ismulti=(q,doc=document)=>{
    return fn.qa(q,doc).length > 1
  }
  fn.getTitle=(dat)=>{
    return dat.split('\n').slice(0,1).join('')
  }
  fn.getlines=(d)=> ( d.match(/\n/g)||[] ).length;
  
  fn.getinfo = (q)=>{
    var o ={ep:0,line:0}    
    var ary=fn.qa(q)
    var d=ary.map(d=>d.textContent)
      .map(d=>d.trimEnd()) //end cut the \n
      .join('\n')

    o.ep = ary.length
    o.line=fn.getlines(d)
    return o;
  }  

  function entry(q,dat,caller){
    dat = dat||'＃';
    var cep ='＃'
    var parent = fn.q(q)
    parent.dataset.meme="true";
    var tag_ed = `<div contenteditable="plaintext-only" data-ed="true" class="m4">${cep}</div>`  //<---------
    var tag_h1 = `<h1 data-title="true">${cep}</h1>`
    var title = fn.i3(tag_h1)
    title.textContent = fn.getTitle(dat)
    var q_parent ="[data-meme]"
    var q_ed="[data-ed]"
    var q_title="[data-title]"
    var upinfo=()=>{
        var obj = fn.getinfo(q+' '+q_ed);
        Object.assign(title.dataset,obj);      
    }
    //

    var keydown=(ev)=>{

      if(!ev.target.dataset.ed)return;
      if(ev.ctrlKey && ev.key =='s')return;
      var me = ev.target,len =me.textContent.length
      if(ev.ctrlKey && ev.key =='Enter'){
        var el=fn.as2(fn.i3(tag_ed),me);
        el.focus();
        return upinfo();
      }
      //console.log(fn.ismulti(q_ed,parent),len)
      if(ev.ctrlKey && ev.key =='Backspace' && 
         fn.ismulti(q_ed,parent) && len==0){
        me.remove();
        return upinfo();
      }
      if(me == fn.q(q_ed,parent) ){
        title.textContent = fn.getTitle(me.textContent)
      }
      if(ev.key =='Enter'){
        upinfo();
      }
      if(caller){
        caller(me);
      }
      return;
    }
    keydown =_.debounce(keydown,50);
    //
    var init=()=>{
      fn.a2(title,parent)
      dat.split(cep).slice(1).map(d=>{
        var el=fn.a2(fn.i3(tag_ed),parent)
        el.textContent = cep + d;
      })
    }
    //
    parent.onkeydown=keydown;    
    init();    
    return parent;
  }
  root.meme = entry;
}(window||this));


  var m = meme('#meme');


/*usage
  var m = meme('#meme',dat,(me)=>{ bar.go(20); });
*/
