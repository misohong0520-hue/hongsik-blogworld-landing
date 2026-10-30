// Figma MCP use_figma source. The original is cloned, never redrawn or resized.
const source=await figma.getNodeByIdAsync('0:7');
if(figma.root.children.some(p=>p.name==='HongSik · Original layout'))throw new Error('Page exists: resume its node ledger.');
const fonts=new Map();
for(const t of source.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(s.fontName.family+'::'+s.fontName.style,{family:s.fontName.family,style:s.fontName.style});
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const page=figma.createPage();page.name='HongSik · Original layout';await figma.setCurrentPageAsync(page);
const desktop=source.clone();page.appendChild(desktop);desktop.name='HongSik BlogWorld · Original layout / Desktop';desktop.x=0;desktop.y=0;
const templateMap={};
function pair(a,b){if(a.type!==b.type)throw new Error('Clone type mismatch');templateMap[a.id]=b.id;if('children'in a){if(a.children.length!==b.children.length)throw new Error('Clone child-count mismatch');for(let i=0;i<a.children.length;i++)pair(a.children[i],b.children[i]);}}
pair(source,desktop);
// Re-read linked instance descendants after commit if the service normalizes IDs.
const old=await figma.getNodeByIdAsync('104:2');if(old)old.name='Archive · Superseded layout';
return {sourceId:source.id,pageId:page.id,desktopId:desktop.id,templateMap,width:desktop.width,height:desktop.height,createdNodeIds:[page.id,...Object.values(templateMap)],mutatedNodeIds:old?[old.id]:[]};
