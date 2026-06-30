const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(),'server/src/controllers');
const messages = new Set();
function walk(dir){
  fs.readdirSync(dir,{withFileTypes:true}).forEach(d=>{
    const p = path.join(dir,d.name);
    if(d.isDirectory()) walk(p);
    else if(d.isFile() && p.endsWith('.js')){
      const txt = fs.readFileSync(p,'utf8');
      let re = /res\.respond\(\s*\d+\s*,\s*(["'`])([\s\S]*?)\1/g;
      let m;
      while((m = re.exec(txt))) messages.add(m[2]);
      re = /res\.status\(\s*\d+\s*\)\.json\(\s*\{[\s\S]*?message\s*:\s*(["'`])([\s\S]*?)\1/g;
      while((m = re.exec(txt))) messages.add(m[2]);
    }
  });
}
walk(root);
console.log([...messages].sort().join('\n'));
