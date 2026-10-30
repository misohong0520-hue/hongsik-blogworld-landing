// Executed through Figma MCP use_figma; preserves both original template pages.
const pageName = 'HongSik · Landing / Stage 2';
if (figma.root.children.some(p => p.name === pageName)) throw new Error('Page already exists; resume from the saved node ledger.');
const createdNodeIds = [];
const page = figma.createPage(); page.name = pageName; createdNodeIds.push(page.id);
await figma.setCurrentPageAsync(page);
const fonts = ['Regular', 'Medium', 'Bold'].map(style => ({ family: 'Noto Sans KR', style }));
await Promise.all(fonts.map(font => figma.loadFontAsync(font)));
// Adapted from figma-generate-library/scripts/createVariableCollection.js.
async function createVariableCollection(name, modeNames) {
  const collection = figma.variables.createVariableCollection(name);
  const modeIds = {}; collection.renameMode(collection.modes[0].modeId, modeNames[0]);
  modeIds[modeNames[0]] = collection.modes[0].modeId;
  for (let i = 1; i < modeNames.length; i++) modeIds[modeNames[i]] = collection.addMode(modeNames[i]);
  return { collection, modeIds };
}
const { collection, modeIds } = await createVariableCollection('HongSik / Landing', ['Default']);
const variables = {};
const colors = { ink:'#162D28', muted:'#526B64', green:'#007B50', accent:'#00C765', mint:'#EAF7EE', pale:'#F5F9F6', line:'#D6E5DC', white:'#FFFFFF', dark:'#102F26' };
function rgb(hex) { return { r:parseInt(hex.slice(1,3),16)/255, g:parseInt(hex.slice(3,5),16)/255, b:parseInt(hex.slice(5,7),16)/255 }; }
for (const [key,value] of Object.entries(colors)) {
  const v = figma.variables.createVariable('color/'+key, collection, 'COLOR');
  v.scopes=['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR']; v.setValueForMode(modeIds.Default,rgb(value));
  v.setVariableCodeSyntax('WEB','--color-'+key); variables['color/'+key]=v;
}
for (const [key,value] of Object.entries({4:4,8:8,12:12,16:16,24:24,32:32,40:40,48:48,64:64,80:80,96:96,120:120})) {
  const v=figma.variables.createVariable('space/'+key,collection,'FLOAT'); v.scopes=['GAP']; v.setValueForMode(modeIds.Default,value); variables['space/'+key]=v;
}
for (const [key,value] of Object.entries({card:24,panel:32,pill:999})) {
  const v=figma.variables.createVariable('radius/'+key,collection,'FLOAT'); v.scopes=['CORNER_RADIUS']; v.setValueForMode(modeIds.Default,value); variables['radius/'+key]=v;
}
function paint(key) { return figma.variables.setBoundVariableForPaint({type:'SOLID',color:rgb(colors[key])},'color',variables['color/'+key]); }
const textStyles={};
for (const [name,size,line,weight] of [['display',64,82,'Bold'],['h1-mobile',38,52,'Bold'],['h2',40,56,'Bold'],['h2-mobile',28,40,'Bold'],['h3',22,34,'Bold'],['body-large',18,30,'Regular'],['body',16,28,'Regular'],['label',14,22,'Medium'],['small',12,20,'Regular']]) {
 const s=figma.createTextStyle(); s.name='HongSik/'+name; s.fontName={family:'Noto Sans KR',style:weight}; s.fontSize=size; s.lineHeight={unit:'PIXELS',value:line}; textStyles[name]=s.id;
}
function text(value,style='body',color='ink') { const n=figma.createText(); createdNodeIds.push(n.id); n.fontName=fonts[0]; n.textStyleId=textStyles[style]; n.characters=value; n.fills=[paint(color)]; n.textAutoResize='WIDTH_AND_HEIGHT'; return n; }
const componentMap={};
for (const variant of ['Primary','Secondary','Inverse']) {
 const c=figma.createComponent(); c.name='HongSik/Button/'+variant; page.appendChild(c); createdNodeIds.push(c.id);
 c.x=2200; c.y=variant==='Primary'?100:variant==='Secondary'?190:280; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='AUTO'; c.primaryAxisAlignItems='CENTER'; c.counterAxisAlignItems='CENTER';
 c.paddingLeft=24; c.paddingRight=24; c.paddingTop=16; c.paddingBottom=16; c.setBoundVariable('cornerRadius',variables['radius/pill']);
 c.fills=[paint(variant==='Primary'?'green':variant==='Inverse'?'accent':'white')];
 if(variant==='Secondary'){ c.strokes=[paint('line')]; c.strokeWeight=1; }
 const label=text('사용 문의','label',variant==='Primary'?'white':'ink'); c.appendChild(label);
 const labelProp=c.addComponentProperty('Label','TEXT','사용 문의'); label.componentPropertyReferences={characters:labelProp};
 c.description='Landing CTA. Primary/Inverse: mailto:support@hongsik.blog. Secondary: workflow anchor.';
 componentMap[variant]={id:c.id,labelProp};
}
const logo=figma.createComponent(); logo.name='HongSik/Brand mark'; logo.resize(48,48); logo.fills=[]; logo.x=2200; logo.y=400; createdNodeIds.push(logo.id);
const logoImage=figma.createRectangle(); logoImage.name='User supplied H artwork'; logoImage.resize(48,48); logoImage.fills=[]; logoImage.constraints={horizontal:'SCALE',vertical:'SCALE'}; logo.appendChild(logoImage); createdNodeIds.push(logoImage.id);
const desktop=figma.createAutoLayout(); desktop.name='HongSik BlogWorld · Desktop / 1440'; desktop.layoutMode='VERTICAL'; desktop.resize(1440,100); desktop.layoutSizingHorizontal='FIXED'; desktop.layoutSizingVertical='HUG'; desktop.fills=[paint('white')]; desktop.x=0; desktop.y=0; createdNodeIds.push(desktop.id);
const mobile=figma.createAutoLayout(); mobile.name='HongSik BlogWorld · Mobile / 390'; mobile.layoutMode='VERTICAL'; mobile.resize(390,100); mobile.layoutSizingHorizontal='FIXED'; mobile.layoutSizingVertical='HUG'; mobile.fills=[paint('white')]; mobile.x=1560; mobile.y=0; createdNodeIds.push(mobile.id);
return {pageId:page.id,desktopId:desktop.id,mobileId:mobile.id,logoId:logo.id,logoImageId:logoImage.id,collectionId:collection.id,variables:Object.fromEntries(Object.entries(variables).map(([k,v])=>[k,v.id])),textStyles,components:componentMap,createdNodeIds};
