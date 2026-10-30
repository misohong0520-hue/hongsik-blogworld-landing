// Figma MCP body: compare every existing non-hero node against its pre-change fingerprint.
const page=await figma.getNodeByIdAsync('115:2');await figma.setCurrentPageAsync(page);
function digest(v){const s=JSON.stringify(v);let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16);}
const result=[];
for(const [rootId,heroId,viewportId,expected] of [['115:6','115:23','127:8','4ac7999d'],['123:5','123:24','127:10','12f8cbb2']]){
 const root=await figma.getNodeByIdAsync(rootId),hero=await figma.getNodeByIdAsync(heroId),viewport=await figma.getNodeByIdAsync(viewportId);
 const excluded=new Set([hero.id,...hero.findAll(()=>true).map(n=>n.id),viewport.id,...viewport.findAll(()=>true).map(n=>n.id)]);
 const nodes=[root,...root.findAll(()=>true)];
 const props=n=>({id:n.id,parent:n.parent?.id,type:n.type,x:n.x,y:n.y,width:n.width,height:n.height,rotation:n.rotation,visible:n.visible,opacity:n.opacity,relativeTransform:n.relativeTransform,...(n.type==='TEXT'?{characters:n.characters,fontName:n.getStyledTextSegments(['fontName']).map(s=>s.fontName)}:{})});
 const unaffected=nodes.filter(n=>!excluded.has(n.id)).map(props),fingerprint=digest(unaffected);
 const types={};for(const n of nodes)types[n.type]=(types[n.type]||0)+1;
 const imageNodes=nodes.filter(n=>Array.isArray(n.fills)&&n.fills.some(f=>f.type==='IMAGE')).map(n=>({id:n.id,name:n.name,type:n.type,width:n.width,height:n.height,visible:n.visible,imageHash:n.fills.find(f=>f.type==='IMAGE').imageHash}));
 const fonts=[...new Set(root.findAllWithCriteria({types:['TEXT']}).flatMap(n=>n.getStyledTextSegments(['fontName']).map(s=>s.fontName.family)))];
 result.push({root:props(root),originalHero:props(hero),viewport:props(viewport),image:props(viewport.children[0]),unaffectedCount:unaffected.length,expectedFingerprint:expected,actualFingerprint:fingerprint,pass:fingerprint===expected&&hero.opacity===0&&viewport.width===hero.width&&viewport.height===hero.height,nodeCount:nodes.length,nodeTypes:types,imageNodes,fonts,missingFontCount:root.findAllWithCriteria({types:['TEXT']}).filter(n=>n.hasMissingFont).length});
}
return{pass:result.every(r=>r.pass&&r.missingFontCount===0),frames:result};
