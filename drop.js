;(function(root){

  function drop(caller){
    var uploadArea = document.documentElement;
    uploadArea.addEventListener("dragover",(event) => {
      event.preventDefault();
    });
    uploadArea.addEventListener("drop",(event) => {
      event.preventDefault();
      var files=event.dataTransfer.files;
      var url = event.dataTransfer.getData("text")
      caller(files,url);
    });
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
