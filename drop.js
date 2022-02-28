//always overwrite
;(function(root){

  function drop(caller){
    var dde = document.documentElement;
    dde.ondragover=(ev) => {ev.preventDefault() };
    dde.ondrop=(ev)=>{
      ev.preventDefault();
      var file= ev.dataTransfer.files[0];
      var url = ev.dataTransfer.getData("text")
      caller(file,url);
    };
  }
  root.drop =drop;
})(window||this);

/*
drop((file,url)=>{
  //console.log(file,url)
  var el =document.activeElement;
  if(!url)return;
  if(!el.dataset.ed) el=ed1.querySelector('[data-ed]');
  el.textContent +='\n'+url;  
})
*/
