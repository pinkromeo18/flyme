//no-cache header

import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
;(function(root){

  function base64Decode(text, charset) {
    charset=charset||'utf-8';
    return fetch(`data:text/plain;charset=${charset};base64,` + text)
      .then(response => response.text());
  }  
  function base64Encode(...parts) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const offset = reader.result.indexOf(",") + 1;
        resolve(reader.result.slice(offset));
      };
      reader.readAsDataURL(new Blob(parts));
    });
  }

  async function summary(res){
    if(!res.data.download_url) return res;
    //res.headers
    //res.data
    var getlines=(d)=> ( d.match(/\n/g)||[] ).length
    var gettitle=(d)=> d.split('\n').slice(0,1).join('')
    var gettimestamp=(d)=>Date.parse(d)||Date.now();
    var getjptime=(d,cap)=>{
      cap = cap|| 'YYYY-MM-DDThh:mm:ss';
      var timestamp = Date.parse(d)||Date.now();
      return new Date(timestamp+1000*60*60*9).toISOString()
        .replace('T',' ')
        .slice(0,cap.length)
    } 

    var o={};
    //o.last_modified = res.headers["last-modified"];
    o.date = res.summary.date
    o.sha =  res.data.sha //res.summary.sha
    ;
    o.timestamp =gettimestamp(o.date)
    o.time = getjptime(o.date)
    o.download_url = res.data.download_url
    o.name = res.data.name
    o.content = await base64Decode(res.data.content) //api.decode(res.data.content)   
    o.lines = getlines(o.content)
    o.title = gettitle(o.content)
    //console.log(o)
    return Object.assign({},res,{summary:o})
  }  


  function entry(opt){
    /*
    opt.u ='/repos/pinkromeo18/meme/contents/'
    opt.t1= ''
    opt.t2= ''
    */
    
   //{cache: "no-cache"}    
    
    var o=new Octokit({auth:opt.t1 + opt.t2})
    Object.assign(o,opt);
    o.req = o.request;
    o.encode =base64Encode;
    o.decode =base64Decode;
    o.summary=summary;
    
    o.commits =async (file)=>{
//https://api.github.com/repos/pinkromeo18/meme/commits?path=JiTeMoBe.txt&page=1&per_page=1
      var u = o.u.replace('contents/','commits')
      var opt ={
        path:file,
        page:1,
        per_page:1,        
      }
      opt = Object.assign(opt,{cache: "no-cache"}) //<----------------
      var res = await o.req('GET '+u,opt)
      .catch(e=>void 0)
      if(!res) return res;
      
      var s={}
      //s.sha=res.data[0].sha
      s.date=res.data[0].commit.author.date
      //console.log(s)
      /*return Object.assign({},res,{summary:s})*/
      return s;
    } 
    o.isfile=async (file,issummary)=>{
      file =file||'';//
      //sha
      var res = await o.req('GET '+o.u+file, {cache: "no-cache"} )//<----------------

      .catch(e=>void 0)
      if(!issummary) return res;
      if(!res) return res;
      
      var c = await o.commits(file)
      return await summary( Object.assign({},res,{summary:c}))
      //return res; //res.data.sha
    }
    o.getfile=async (file)=>{
      //data
      var res = await o.isfile(file);
      if(!res) return res;
      var {download_url} =res.data;
      var dat = await fetch(download_url,   {cache: "no-cache"}  ).then(d=>d.text())  //<-------------
      return dat;
    }
    o.setfile=async (dat,file)=>{
      //isfile
      var _o={}
      
      var res = await o.isfile(file);      
      if(res) _o.sha = res.data.sha
      
      /*
      var res = await o.commits(file)
      if(res) _o.sha =res.sha;
      */
      var content = await o.encode(dat);
      _o.content = content;
      _o.message = dat.split('\n').slice(0,1).join('')

      //set
      res = await o.req('PUT '+o.u+file,_o)
        .catch(e=>e)
      //console.log(res);
      return res;
    }
    return o;
  }

  root.gitapi = entry;
}(window||this));

/*
var opt={}
opt.u ='/repos/pinkromeo18/meme/contents/'
opt.t1 ="ghp_WjFtZHMWbe2u3v4"
opt.t2 ="Dhr5ziHCR2ufMNi37mp3f"
opt.file = 'YoGaCuVo.txt' //fn.getFile()
;
var api = gitapi(opt);

*/
