import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const srcRoot=resolve(root,'src');
// The app intentionally uses only local named ES-module imports and exports.
// Compile that restricted grammar into isolated factories; fail on unsupported syntax.
export async function buildStandalone(output=resolve(root,'dist/demo.html')) {
  const factories=new Map();
  async function visit(file) {
    if(factories.has(file))return;
    if(!file.startsWith(srcRoot+sep))throw new Error('Only application modules may be bundled');
    factories.set(file,'');
    let code=await readFile(file,'utf8');
    const dependencies=[];
    code=code.replace(/^import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?\s*$/gm,(_,names,specifier)=>{
      if(!specifier.startsWith('./'))throw new Error('Standalone build forbids external imports: '+specifier);
      const dependency=resolve(dirname(file),specifier);dependencies.push(dependency);
      const bindings=names.trim().replace(/\s+as\s+/g,': ');
      return 'const {'+bindings+'} = __load('+JSON.stringify(relative(srcRoot,dependency).split(sep).join('/'))+');';
    });
    const exports=[];
    code=code.replace(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/gm,(match,name)=>{exports.push(name);return match.replace(/^export\s+/,'');});
    code=code.replace(/^export\s*\{([^}]+)\};?\s*$/gm,(_,names)=>{
      for(const item of names.split(',').map(s=>s.trim()).filter(Boolean)){
        if(!/^\w+$/.test(item))throw new Error('Unsupported re-export: '+item);
        exports.push(item);
      }
      return '';
    });
    if(/^\s*(?:import|export)\s/m.test(code)||/import\s*\(|import\.meta/.test(code))throw new Error('Unsupported module syntax in '+relative(root,file));
    for(const dependency of dependencies)await visit(dependency);
    factories.set(file,code+'\nObject.assign(exports,{'+exports.join(',')+'});');
  }
  const entry=resolve(srcRoot,'theatre.mjs');await visit(entry);
  const bundle='(()=>{\n"use strict";\nconst factories={\n'+[...factories].map(([file,code])=>JSON.stringify(relative(srcRoot,file).split(sep).join('/'))+':function(exports,__load){\n'+code+'\n}').join(',\n')+'\n};\nconst cache=Object.create(null);\nfunction __load(id){if(Object.hasOwn(cache,id))return cache[id];if(!factories[id])throw new Error("Missing embedded module: "+id);const exports=cache[id]={};factories[id](exports,__load);return exports;}\n__load("theatre.mjs");\n})();';
  const css=await readFile(resolve(root,'styles.css'),'utf8');
  let html=await readFile(resolve(root,'index.html'),'utf8');
  html=html.replace('<link rel="stylesheet" href="/styles.css">',()=>'<style>\n'+css.replace(/<\/style/gi,'<\\/style')+'\n</style>');
  html=html.replace('<script type="module" src="/src/theatre.mjs"></script>',()=>'<script>\n'+bundle.replace(/<\/script/gi,'<\\/script')+'\n</script>');
  if(/<script[^>]+src=|<link[^>]+rel=["']stylesheet/i.test(html))throw new Error('Standalone output still contains external application assets');
  await mkdir(dirname(output),{recursive:true});await writeFile(output,html);
  return {file:output,modules:factories.size,bytes:Buffer.byteLength(html)};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const result=await buildStandalone();process.stdout.write('Standalone browser demo: '+result.file+' ('+result.bytes+' bytes; '+result.modules+' embedded modules)\n');
}
