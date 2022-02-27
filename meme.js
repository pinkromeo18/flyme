//meme
;(function(root){

  fn.ismulti=(q,doc=document)=>{
    return fn.qa(q,doc).length > 1
  }
  fn.getTitle=(dat)=>{
    return dat.split('\n').slice(0,1).join('')
  }

  function entry(q,dat,caller){
    dat = dat||'＃';
    var cep ='＃'
    var parent = fn.q(q)
    parent.dataset.meme="true";
    var tag_ed = `<div contenteditable="plaintext-only" data-ed="true">${cep}</div>`
    var tag_h1 = `<h1 data-title="true">${cep}</h1>`
    var title = fn.i3(tag_h1)
    title.textContent = fn.getTitle(dat)
    var q_parent ="[data-meme]"
    var q_ed="[data-ed]"
    var q_title="[data-title]"
    //

    var keydown=(ev)=>{

      if(!ev.target.dataset.ed)return;
      if(ev.ctrlKey && ev.key =='s')return;
      var me = ev.target,len =me.textContent.length
      if(ev.ctrlKey && ev.key =='Enter'){
        var el=fn.as2(fn.i3(tag_ed),me);
        el.focus();
        return;
      }
      //console.log(fn.ismulti(q_ed,parent),len)
      if(ev.ctrlKey && ev.key =='Backspace' && 
         fn.ismulti(q_ed,parent) && len==0){
        me.remove();
        return;
      }
      if(me == fn.q(q_ed,parent) ){
        title.textContent = fn.getTitle(me.textContent)
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


/*usage
  var m = meme('#meme',dat,(me)=>{ bar.go(20); });
*/
