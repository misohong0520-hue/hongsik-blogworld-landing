// Figma MCP body: replace each play glyph visually; preserve the original layout slot.
const page=await figma.getNodeByIdAsync('115:2');await figma.setCurrentPageAsync(page);
const roots=await Promise.all(['115:6','123:5'].map(id=>figma.getNodeByIdAsync(id)));
const icons=await Promise.all(['115:20','123:22'].map(id=>figma.getNodeByIdAsync(id)));
for(const n of icons)if(!n||n.type!=='INSTANCE')throw Error('Unexpected original icon');
const fonts=new Map();for(const icon of icons)for(const t of icon.parent.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const excluded=new Set(icons.map(n=>n.id)),createdNodeIds=[],mutatedNodeIds=[],slots=[];
function digest(v){const s=JSON.stringify(v);let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16);}
const props=n=>({id:n.id,parent:n.parent?.id,x:n.x,y:n.y,width:n.width,height:n.height,rotation:n.rotation,relativeTransform:n.relativeTransform,visible:n.visible,opacity:n.opacity,...(Array.isArray(n.fills)?{fills:n.fills}:{}),...(n.type==='TEXT'?{characters:n.characters,fontNames:n.getStyledTextSegments(['fontName']).map(s=>s.fontName)}:{})});
const fingerprint=root=>digest([root,...root.findAll(()=>true)].filter(n=>!excluded.has(n.id)).map(props));
const before=roots.map(fingerprint);
const svg='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191A15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8 12 4 4 4-4"/></svg>';
for(const icon of icons){
 let arrow=icon.parent.children.find(n=>n.name==='Process anchor / arrow down / '+icon.id);
 if(!arrow){arrow=figma.createNodeFromSvg(svg);arrow.name='Process anchor / arrow down / '+icon.id;arrow.resize(icon.width,icon.height);icon.parent.appendChild(arrow);arrow.layoutPositioning='ABSOLUTE';arrow.x=icon.x;arrow.y=icon.y;createdNodeIds.push(arrow.id,...arrow.findAll(()=>true).map(n=>n.id));mutatedNodeIds.push(icon.parent.id);}
 for(const n of [arrow,...arrow.findAll(()=>true)])excluded.add(n.id);
 icon.opacity=0;mutatedNodeIds.push(icon.id);
 slots.push({oldIconId:icon.id,arrowId:arrow.id,parentId:icon.parent.id,x:arrow.x,y:arrow.y,width:arrow.width,height:arrow.height,oldOpacity:icon.opacity});
}
const after=roots.map(fingerprint);
return{pass:before.every((h,i)=>h===after[i])&&slots.every(s=>s.oldOpacity===0),createdNodeIds,mutatedNodeIds,slots,beforeFingerprints:before,afterFingerprints:after,fonts:[...fonts.values()]};
