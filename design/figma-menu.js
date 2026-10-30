// Figma MCP use_figma source record. `state` includes the composition response.
const page=await figma.getNodeByIdAsync(state.pageId); await figma.setCurrentPageAsync(page);
if(page.children.some(n=>n.name==='Mobile menu / Open')) throw new Error('Menu exists; resume from saved ledger.');
await Promise.all(['Regular','Medium','Bold'].map(style=>figma.loadFontAsync({family:'Noto Sans KR',style})));
const variables=Object.fromEntries(await Promise.all(Object.entries(state.variables).map(async([k,id])=>[k,await figma.variables.getVariableByIdAsync(id)])));
function paint(k){return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',variables['color/'+k]);}
const menu=figma.createAutoLayout(); menu.name='Mobile menu / Open';menu.layoutMode='VERTICAL';menu.resize(390,10);menu.layoutSizingVertical='HUG';menu.fills=[paint('white')];menu.x=1560;menu.y=6100;
menu.paddingTop=24;menu.paddingBottom=40;menu.paddingLeft=24;menu.paddingRight=24;menu.itemSpacing=32;
const header=figma.createAutoLayout(); header.name='Menu header';header.layoutMode='HORIZONTAL';header.fills=[];header.resize(342,44);menu.appendChild(header);header.layoutSizingHorizontal='FILL';header.primaryAxisAlignItems='SPACE_BETWEEN';header.counterAxisAlignItems='CENTER';
const originalHeader=await figma.getNodeByIdAsync(state.composition.sections.mobile.header);
const brand=originalHeader.children[0].clone();header.appendChild(brand);brand.resize(270,32);
const close=figma.createAutoLayout(); close.name='Menu close / 44px';close.layoutMode='HORIZONTAL';close.resize(44,44);close.fills=[];close.primaryAxisAlignItems='CENTER';close.counterAxisAlignItems='CENTER';header.appendChild(close);
const glyph=figma.createNodeFromSvg('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 6 18" stroke="#162D28" stroke-width="2" stroke-linecap="round"/><path d="m6 6 12 12" stroke="#162D28" stroke-width="2" stroke-linecap="round"/></svg>');glyph.name='Lucide/x';close.appendChild(glyph);
await close.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'BACK'}]}]);
for(const [label,key] of [['주요 기능','features'],['사용 과정','workflow'],['자주 묻는 질문','faq']]){
 const row=figma.createAutoLayout(); row.layoutMode='HORIZONTAL';row.resize(342,52);menu.appendChild(row);row.layoutSizingHorizontal='FILL';row.fills=[];row.counterAxisAlignItems='CENTER';
 const t=figma.createText();t.fontName={family:'Noto Sans KR',style:'Regular'};t.textStyleId=state.textStyles.h3;t.characters=label;t.fills=[paint('ink')];row.appendChild(t);
 await row.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:state.composition.sections.mobile[key],navigation:'SCROLL_TO',transition:null}]}]);
}
const primary=await figma.getNodeByIdAsync(state.components.Primary.id);const cta=primary.createInstance();menu.appendChild(cta);cta.layoutSizingHorizontal='FILL';await cta.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'URL',url:'mailto:support@hongsik.blog'}]}]);
const label=figma.createText();label.fontName={family:'Noto Sans KR',style:'Regular'};label.textStyleId=state.textStyles.small;label.characters='support@hongsik.blog';label.fills=[paint('muted')];menu.appendChild(label);
const opener=originalHeader.findOne(n=>n.name==='Menu trigger / 44px');await opener.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:menu.id,navigation:'NAVIGATE',transition:null}]}]);
return {menuId:menu.id,width:menu.width,height:menu.height,createdNodeIds:[menu.id,...menu.findAll(()=>true).map(n=>n.id)],mutatedNodeIds:[opener.id]};
