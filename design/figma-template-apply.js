// Figma MCP body. Inject `state` (direct-clone ledger) and `copy` (source TEXT ID -> copy).
const page=await figma.getNodeByIdAsync(state.pageId);await figma.setCurrentPageAsync(page);
const desktop=await figma.getNodeByIdAsync(state.desktopId);
const pairs=await Promise.all(Object.entries(copy).map(async([id,value])=>({id,value,original:await figma.getNodeByIdAsync(id),node:await figma.getNodeByIdAsync(state.templateMap[id])})));
const fontMap=new Map();
for(const p of pairs)for(const s of p.node.getStyledTextSegments(['fontName']))fontMap.set(s.fontName.family+'::'+s.fontName.style,{family:s.fontName.family,style:s.fontName.style});
for(const style of ['Regular','Medium','Bold'])fontMap.set('Noto Sans KR::'+style,{family:'Noto Sans KR',style});
await Promise.all([...fontMap.values()].map(f=>figma.loadFontAsync(f)));
const changed=[],fit=[],temporaryIds=[],extras=[],content=[];
for(const p of pairs){
 const n=p.node,o=p.original,w=o.width,h=o.height,transform=n.relativeTransform;
 n.textAutoResize='NONE';
 if(/[가-힣]/.test(p.value)){const f=typeof o.fontName==='symbol'?o.getStyledTextSegments(['fontName'])[0].fontName:o.fontName;const style=f.style==='Semi Bold'?'Bold':f.style;n.fontName={family:'Noto Sans KR',style};}
 n.characters=['0:370','0:420'].includes(p.id)?' ':p.value;
 if(['0:114','0:125'].includes(p.id)){n.fontName={family:'Noto Sans KR',style:'Medium'};n.setRangeFontName(0,2,{family:'Noto Sans KR',style:'Bold'});n.setRangeFontName(2,3,{family:'Noto Sans KR',style:'Regular'});}
 n.resizeWithoutConstraints(w,h);n.relativeTransform=transform;changed.push(n.id);
 if(!n.characters)continue;
 const measure=figma.createText();temporaryIds.push(measure.id);measure.fontName=typeof n.fontName==='symbol'?{family:'Noto Sans KR',style:'Bold'}:n.fontName;measure.fontSize=n.fontSize;measure.lineHeight=n.lineHeight;measure.letterSpacing=n.letterSpacing;measure.paragraphSpacing=n.paragraphSpacing;measure.characters=n.characters;measure.resize(w,1);measure.textAutoResize='HEIGHT';measure.x=2400;
 if(measure.height>h+1)fit.push({sourceId:p.id,cloneId:n.id,text:n.characters,width:w,availableHeight:h,naturalHeight:measure.height});measure.remove();
}
const logo=await figma.getNodeByIdAsync('104:44');const hPaint=logo.fills.find(p=>p.type==='IMAGE');
function absoluteSlot(n){const a=n.absoluteTransform,b=desktop.absoluteTransform;return {x:a[0][2]-b[0][2],y:a[1][2]-b[1][2],w:n.width,h:n.height};}
function existing(name){return desktop.children.find(n=>n.name===name);}
function hImage(name,slot){let n=existing(name);if(n)return n; n=figma.createRectangle();n.name=name;desktop.appendChild(n);n.resize(slot.w,slot.h);n.x=slot.x;n.y=slot.y;n.fills=[{...hPaint,scaleMode:'FIT'}];extras.push(n.id);return n;}
for(const sourceId of ['0:370','0:420']){
 const n=await figma.getNodeByIdAsync(state.templateMap[sourceId]),slot=absoluteSlot(n);const name='Brand replacement / '+sourceId;
 if(existing(name))continue;
 const row=figma.createAutoLayout();row.name=name;row.layoutMode='HORIZONTAL';row.resize(slot.w,slot.h);row.fills=[];row.itemSpacing=8;row.counterAxisAlignItems='CENTER';desktop.appendChild(row);row.x=slot.x;row.y=slot.y;
 const mark=figma.createRectangle();row.appendChild(mark);mark.resize(24,24);mark.fills=[{...hPaint,scaleMode:'FIT'}];
 const label=figma.createText();label.fontName={family:'Inter',style:'Medium'};label.fontSize=13;label.lineHeight={unit:'PIXELS',value:30};label.characters='HongSik BlogWorld';label.fills=n.fills;row.appendChild(label);label.resize(128,30);label.textAutoResize='NONE';extras.push(row.id,mark.id,label.id);
}
// Replace illustrative avatars with the user's mark, keeping ellipse geometry and image placement.
for(const sourceId of ['0:209','0:392','0:393','0:394','0:395']){
 const n=await figma.getNodeByIdAsync(state.templateMap[sourceId]);n.fills=[{...hPaint,scaleMode:'FIT'}];changed.push(n.id);content.push(sourceId);
}
// Stars become workflow checks in the same 26px slots; no invented ratings.
const src=await figma.getNodeByIdAsync(state.sourceId);
for(const original of src.findAllWithCriteria({types:['STAR']})){
 const n=await figma.getNodeByIdAsync(state.templateMap[original.id]);const slot=absoluteSlot(n);n.visible=original.visible;n.fills=[];n.strokes=[];content.push(original.id);changed.push(n.id);const name='Workflow check / '+original.id;if(existing(name))continue;
 const svg=figma.createNodeFromSvg('<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.667 6.5 9.75 18.417 4.333 13" stroke="#54BD95" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');svg.name=name;desktop.appendChild(svg);svg.resize(slot.w,slot.h);svg.x=slot.x;svg.y=slot.y;extras.push(svg.id,...svg.findAll(()=>true).map(n=>n.id));
}
// Replace recognizable customer-brand glyphs without moving their source nodes or text labels.
for(const sourceId of ['0:132','0:140','0:146','0:163','0:169']){
 const label=await figma.getNodeByIdAsync(state.templateMap[sourceId]);const parent=label.parent;
 const graphics=parent.findAll(n=>['RECTANGLE','ELLIPSE','VECTOR','BOOLEAN_OPERATION'].includes(n.type));
 if(!graphics.length)continue;
 const boxes=graphics.map(absoluteSlot);const slot={x:Math.min(...boxes.map(b=>b.x)),y:Math.min(...boxes.map(b=>b.y)),w:Math.max(...boxes.map(b=>b.x+b.w))-Math.min(...boxes.map(b=>b.x)),h:Math.max(...boxes.map(b=>b.y+b.h))-Math.min(...boxes.map(b=>b.y))};
 for(const n of graphics){n.visible=true;n.fills=[];n.strokes=[];changed.push(n.id);const source=Object.keys(state.templateMap).find(id=>state.templateMap[id]===n.id);if(source)content.push(source);}
 hImage('Workflow mark / '+sourceId,slot);
}
for(const sourceId of ['0:19','0:381','0:408','0:459']){const n=await figma.getNodeByIdAsync(state.templateMap[sourceId]);await n.parent.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'mailto:support@hongsik.blog'}]}]);changed.push(n.parent.id);}
const contact=await figma.getNodeByIdAsync(state.templateMap['0:416']);
for(const n of contact.findAll(n=>['VECTOR','BOOLEAN_OPERATION','ELLIPSE','RECTANGLE'].includes(n.type))){n.fills=[];n.strokes=[];changed.push(n.id);const source=Object.keys(state.templateMap).find(id=>state.templateMap[id]===n.id);if(source)content.push(source);}
hImage('Contact brand mark / 0:416',absoluteSlot(contact));content.push('0:413');
return {mutatedNodeIds:[...new Set(changed)],createdNodeIds:extras,removedTemporaryNodeIds:temporaryIds,fitIssues:fit,allowedContentNodeIds:[...new Set(content)],allowedExtraNodeIds:extras.filter(id=>desktop.children.some(n=>n.id===id)),width:desktop.width,height:desktop.height};
