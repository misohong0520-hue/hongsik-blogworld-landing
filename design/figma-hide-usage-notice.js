// Figma MCP body: hide only the user-selected three-line usage notice.
const page=await figma.getNodeByIdAsync('115:2');await figma.setCurrentPageAsync(page);
const roots=await Promise.all(['115:6','123:5'].map(id=>figma.getNodeByIdAsync(id)));
const targets=await Promise.all(['115:386','123:480'].map(id=>figma.getNodeByIdAsync(id)));
for(const n of targets)if(!n||n.type!=='TEXT'||!n.characters.startsWith('AI 원고는 발행 전에'))throw Error('Unexpected target notice');
if(targets.every(n=>!n.visible))return{alreadyHidden:true,mutatedNodeIds:[],hiddenNodeIds:targets.map(n=>n.id)};
for(const n of targets)await Promise.all(n.getStyledTextSegments(['fontName']).map(s=>figma.loadFontAsync(s.fontName)));
const excluded=new Set(targets.map(n=>n.id)),ancestors=new Set();for(const n of targets){let p=n.parent;while(p&&p.type!=='PAGE'){ancestors.add(p.id);p=p.parent;}}
for(const id of [...ancestors,'123:481','123:490','123:506'])excluded.add(id);
const props=n=>({id:n.id,parent:n.parent?.id,x:n.x,y:n.y,width:n.width,height:n.height,rotation:n.rotation,relativeTransform:n.relativeTransform,visible:n.visible,opacity:n.opacity,...(Array.isArray(n.fills)?{fills:n.fills}:{}),...(n.type==='TEXT'?{characters:n.characters,fontNames:n.getStyledTextSegments(['fontName']).map(s=>s.fontName)}:{})});
function digest(v){const s=JSON.stringify(v);let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16);}
const fingerprint=root=>digest([root,...root.findAll(()=>true)].filter(n=>!excluded.has(n.id)).map(props));
const tracked=await Promise.all(['123:477','123:481','123:490','123:506'].map(id=>figma.getNodeByIdAsync(id)));
const before={roots:roots.map(props),targets:targets.map(props),tracked:tracked.map(props),fingerprints:roots.map(fingerprint)};
const reduction=targets[1].height+targets[1].parent.itemSpacing;for(const n of targets)n.visible=false;
const after={roots:roots.map(props),targets:targets.map(props),tracked:tracked.map(props),fingerprints:roots.map(fingerprint)};
const near=(a,b)=>Math.abs(a-b)<0.002;
const pass=targets.every(n=>!n.visible)&&before.fingerprints.every((h,i)=>h===after.fingerprints[i])&&near(before.roots[0].height,after.roots[0].height)&&near(before.roots[1].height-reduction,after.roots[1].height)&&after.tracked.slice(1).every((n,i)=>near(n.y,before.tracked[i+1].y-reduction));
return{pass,hiddenNodeIds:targets.map(n=>n.id),mutatedNodeIds:[...targets.map(n=>n.id),...ancestors,'123:481','123:490','123:506'],mobileReduction:reduction,before,after};
