;(function(root){

  function drop(caller){
    var uploadArea = document.documentElement;
    uploadArea.addEventListener("dragover",(event) => {
      event.preventDefault();
    });
    uploadArea.addEventListener("drop",(event) => {
      event.preventDefault();
      var files=event.dataTransfer.files;
      var file = files[0]; //<--------------------slice the only one
      var url = event.dataTransfer.getData("text")
      caller(file,url);
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
