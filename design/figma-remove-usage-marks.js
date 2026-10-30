// Figma MCP body: remove decorative duplicate avatar/play marks only.
const page=await figma.getNodeByIdAsync('115:2');await figma.setCurrentPageAsync(page);
const roots=await Promise.all(['115:6','123:5'].map(id=>figma.getNodeByIdAsync(id)));
const targetIds=['115:391','115:392','115:393','115:394','115:395','123:482'];
const targets=await Promise.all(targetIds.map(id=>figma.getNodeByIdAsync(id)));
if(targets.every(n=>!n))return{alreadyRemoved:true,removedNodeIds:[],mutatedNodeIds:[]};
if(targets.some(n=>!n))throw Error('Partially removed row: inspect current canvas before continuing');
const fonts=new Map();for(const root of roots)for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const removedNodeIds=targets.flatMap(n=>[n.id,...('findAll'in n?n.findAll(()=>true).map(c=>c.id):[])]);
const excluded=new Set(removedNodeIds),ancestors=new Set();
for(const n of targets){let p=n.parent;while(p&&p.type!=='PAGE'){ancestors.add(p.id);p=p.parent;}}
for(const id of ancestors)excluded.add(id);
for(const id of ['123:490','123:506'])excluded.add(id);
const digest=value=>{const s=JSON.stringify(value);let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16);};
const geometry=n=>({id:n.id,parent:n.parent?.id,x:n.x,y:n.y,width:n.width,height:n.height,rotation:n.rotation,relativeTransform:n.relativeTransform,visible:n.visible,opacity:n.opacity,...(Array.isArray(n.fills)?{fills:n.fills}:{}),...(n.type==='TEXT'?{characters:n.characters,fontNames:n.getStyledTextSegments(['fontName']).map(s=>s.fontName)}:{})});
const snapshot=root=>[root,...root.findAll(()=>true)].filter(n=>!excluded.has(n.id)).map(geometry);
const before=roots.map(root=>({root:geometry(root),count:1+root.findAll(()=>true).length,fingerprint:digest(snapshot(root))}));
const tracked=await Promise.all(['115:381','123:477','123:490','123:506'].map(id=>figma.getNodeByIdAsync(id)));
const beforeTracked=tracked.map(geometry),row=targets[5],expectedReduction=row.height+row.parent.itemSpacing;
for(const n of targets)n.remove();
const after=roots.map(root=>({root:geometry(root),count:1+root.findAll(()=>true).length,fingerprint:digest(snapshot(root))}));
const afterTracked=tracked.map(geometry);
const near=(a,b)=>Math.abs(a-b)<0.002;
const pass=before.every((b,i)=>b.fingerprint===after[i].fingerprint)&&near(roots[0].height,before[0].root.height)&&near(roots[1].height,before[1].root.height-expectedReduction)&&near(afterTracked[2].y,beforeTracked[2].y-expectedReduction)&&near(afterTracked[3].y,beforeTracked[3].y-expectedReduction);
const labels=await Promise.all(['115:387','123:481'].map(async id=>{const n=await figma.getNodeByIdAsync(id);return{id:n.id,characters:n.characters};}));
return{pass,removedNodeIds,mutatedNodeIds:[...ancestors,'123:490','123:506'],expectedReduction,before,after,beforeTracked,afterTracked,labels};
