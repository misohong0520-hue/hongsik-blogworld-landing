// Figma MCP body: create image viewports without changing existing layout.
const page=await figma.getNodeByIdAsync('115:2'); await figma.setCurrentPageAsync(page);
const roots=await Promise.all(['115:6','123:5'].map(id=>figma.getNodeByIdAsync(id)));
const fonts=new Map(); for(const root of roots)for(const n of root.findAllWithCriteria({types:['TEXT']}))for(const s of n.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const createdNodeIds=[],mutatedNodeIds=[],slots=[];
for(const id of ['115:23','123:24']){
 const hero=await figma.getNodeByIdAsync(id);const parent=hero.parent;
 const name='Approved product hero / '+id;
 let viewport=parent.children.find(n=>n.name===name);
 if(!viewport){
  viewport=figma.createAutoLayout('VERTICAL');viewport.name=name;viewport.fills=[];
  viewport.resize(hero.width,hero.height);viewport.primaryAxisSizingMode='FIXED';viewport.counterAxisSizingMode='FIXED';viewport.clipsContent=true;
  parent.appendChild(viewport);if(parent.type==='FRAME'&&parent.layoutMode!=='NONE')viewport.layoutPositioning='ABSOLUTE';
  viewport.x=hero.x;viewport.y=hero.y;
  const image=figma.createRectangle();image.name='HongSik BlogWorld / user supplied laptop graphic';image.fills=[];
  viewport.appendChild(image);image.layoutPositioning='ABSOLUTE';
  const s=Math.min(hero.width/1457,hero.height/1133);
  image.resize(1600*s,1600*s);image.x=(hero.width-1457*s)/2-73*s;image.y=(hero.height-1133*s)/2-228*s;
  createdNodeIds.push(viewport.id,image.id);mutatedNodeIds.push(parent.id);
 }
 slots.push({heroId:id,parentId:parent.id,viewportId:viewport.id,imageId:viewport.children[0].id,viewport:{x:viewport.x,y:viewport.y,width:viewport.width,height:viewport.height},image:{x:viewport.children[0].x,y:viewport.children[0].y,width:viewport.children[0].width,height:viewport.children[0].height}});
}
return{createdNodeIds,mutatedNodeIds,slots};
