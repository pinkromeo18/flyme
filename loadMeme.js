async function loadMeme(api) {
  fn.getData = q => {
    return fn.qa(q).map(d => d.textContent).
    map(d => d.trimEnd()) //end cut the \n
    .join('\n\n');
  };

  var $dde = document.documentElement;
  var bar = new Nanobar({ target: fn.q('#bar'), color: "#0aa" });
  var file = api.file;
  var dat = (await api.data(file)) || '＃';

  var makefig = setupImage('#image', dat, api, '#meme'); //return image func
  var $m = meme('#meme', dat, me => {
    bar.go(20);
    makefig(me.textContent);
  });

  var unsavecheck = ev => {
    if (bar.v == 0) return;
    var mes = "ページを離れようとしています。よろしいですか？";
    ev.returnValue = mes;
    return mes;
  };

  var save = async () => {
    var dat = fn.getData('#meme [data-ed]');
    //console.log(dat)
    bar.go(40);
    var res = await api.put(dat, file);
    //console.log(res)
    bar.go(100);
  };

  var cmdkey = ev => {
    if (ev.ctrlKey && ev.key == 's') {
      ev.preventDefault();
      save();
    }
    if (ev.ctrlKey && ev.key == ' ') {//space key
      //rebuild image
      //console.log('in ctrl + Space')
      var dat = fn.getData('#meme [data-ed]');
      setupImage('#image', dat, api, '#meme');
    }
  };

  ////////  
  $dde.onkeydown = cmdkey;
  window.onbeforeunload = unsavecheck;
  ////////
  return;
}


window.loadMeme = loadMeme;
