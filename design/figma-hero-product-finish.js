// Figma MCP body: reuse the uploaded original bitmap and suppress duplicate legacy hero art.
const page=await figma.getNodeByIdAsync('115:2');await figma.setCurrentPageAsync(page);
const image=await figma.getNodeByIdAsync('127:9'),mobileImage=await figma.getNodeByIdAsync('127:11');
if(!Array.isArray(image.fills)||!image.fills.some(f=>f.type==='IMAGE'&&f.imageHash))throw Error('Original hero bitmap has not been uploaded');
mobileImage.fills=JSON.parse(JSON.stringify(image.fills));
for(const id of ['115:23','123:24']){const n=await figma.getNodeByIdAsync(id);const fonts=new Map();for(const t of n.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));n.opacity=0;}
return{mutatedNodeIds:['127:11','115:23','123:24'],createdNodeIds:[],imageHash:image.fills.find(f=>f.type==='IMAGE').imageHash};
