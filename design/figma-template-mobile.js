// Figma MCP body. Inject `state` (template-state.json) and `copy` (template-copy.json).
// Responsive adaptation of the native desktop clone; never edits the desktop or the source.
const page = await figma.getNodeByIdAsync(state.pageId); await figma.setCurrentPageAsync(page);
const desktop = await figma.getNodeByIdAsync(state.desktopId), name = 'HongSik BlogWorld / Mobile / Template faithful';
const previous = page.children.find(n => n.name === name);
if (previous) return { mobileId: previous.id, createdNodeIds: [], existingNodeIds: [previous.id, ...previous.findAll(() => true).map(n => n.id)], alreadyExists: true };
const fonts = new Map();
for (const n of desktop.findAllWithCriteria({ types: ['TEXT'] })) for (const s of n.getStyledTextSegments(['fontName'])) fonts.set(s.fontName.family + ':' + s.fontName.style, s.fontName);
await Promise.all([...fonts.values()].map(f => figma.loadFontAsync(f)));
const cache = new Map(), sections = [], sourceClones = [];
async function src(id) { if (!cache.has(id)) cache.set(id, await figma.getNodeByIdAsync(state.templateMap[id])); const n = cache.get(id); if (!n) throw new Error('Missing template node: ' + id); return n; }
const paint = value => JSON.parse(JSON.stringify(value));
function stack(parent, label, width = 342, gap = 24, horizontal = false) {
  const n = figma.createAutoLayout(horizontal ? 'HORIZONTAL' : 'VERTICAL'); n.name = label; n.fills = []; n.resize(width, 1);
  n.layoutSizingHorizontal = 'FIXED'; n.layoutSizingVertical = 'HUG'; n.itemSpacing = gap; n.clipsContent = false; parent.appendChild(n); return n;
}
const mobile = stack(page, name, 390, 0); mobile.x = 1600; mobile.y = desktop.y; mobile.fills = paint(desktop.fills); mobile.clipsContent = true;
function section(label, gap = 24, top = 48, bottom = 48, fills = null) {
  const n = stack(mobile, label, 390, gap); n.paddingLeft = n.paddingRight = 24; n.paddingTop = top; n.paddingBottom = bottom; if (fills) n.fills = paint(fills); sections.push({ name: label, id: n.id }); return n;
}
async function clone(id, parent, width = null) {
  const original = await src(id), n = original.clone(); parent.appendChild(n); n.layoutPositioning = 'AUTO';
  if (width !== null && Math.abs(width - n.width) > 0.01) n.rescale(width / n.width);
  sourceClones.push({ sourceId: id, nodeId: n.id }); return n;
}
async function text(id, parent, size = 16, width = 342, leading = 1.6, value = undefined) {
  const n = await clone(id, parent); n.name = 'Mobile text / ' + id; n.fontSize = size; n.lineHeight = { unit: 'PIXELS', value: Math.round(size * leading) };
  if (value !== undefined || Object.prototype.hasOwnProperty.call(copy, id)) n.characters = value === undefined ? copy[id] : value;
  n.textAutoResize = 'HEIGHT'; n.resize(width, 1); n.textAutoResize = 'HEIGHT'; return n;
}
function extraClone(label, parent) { const original = desktop.children.find(n => n.name === label); if (!original) throw new Error('Missing desktop replacement: ' + label); const n = original.clone(); parent.appendChild(n); n.layoutPositioning = 'AUTO'; return n; }
async function decoration(id, parent, width, x, y) { const n = await clone(id, parent, width); n.layoutPositioning = 'ABSOLUTE'; n.x = x; n.y = y; return n; }
const header = section('Header', 0, 24, 24), headerRow = stack(header, 'Header row', 342, 16, true);
headerRow.primaryAxisAlignItems = 'SPACE_BETWEEN'; headerRow.counterAxisAlignItems = 'CENTER'; extraClone('Brand replacement / 0:370', headerRow); await clone('0:379', headerRow);
const hero = section('Hero / original mint glow', 24, 28, 48); hero.clipsContent = true;
await decoration('0:9', hero, 390, -140, -80); await decoration('0:12', hero, 390, 180, 260);
await text('0:16', hero, 38, 342, 1.2); await clone('0:17', hero, 318); await text('0:23', hero, 16);
const heroActions = stack(hero, 'Hero actions', 342, 16, true); heroActions.counterAxisAlignItems = 'CENTER'; await clone('0:18', heroActions); await clone('0:20', heroActions);
await clone('0:24', hero, 342);
const flow = section('Five workflow marks / original company band', 28, 48, 56); await text('0:128', flow, 24, 342, 1.45);
const markRows = stack(flow, 'Workflow marks', 342, 24, true); markRows.layoutWrap = 'WRAP'; markRows.counterAxisSpacing = 18;
for (const id of ['0:132', '0:140', '0:146', '0:163', '0:169']) {
  const row = stack(markRows, 'Workflow / ' + id, 144, 10, true); row.counterAxisAlignItems = 'CENTER'; const icon = extraClone('Workflow mark / ' + id, row); icon.resize(24, 24); await text(id, row, 18, 110, 1.5);
}
const support = section('Support / original lavender', 28, 48, 48, (await src('0:81')).fills); await text('0:104', support, 28, 342, 1.45); await text('0:103', support, 16);
const summaries = stack(support, 'Original two workflow summaries', 342, 22, true);
for (const [starIds, titleId, captionId] of [[['0:108','0:109','0:110','0:111','0:112'],'0:114','0:115'], [['0:119','0:120','0:121','0:122','0:123'],'0:125','0:126']]) {
  const summary = stack(summaries, 'Workflow summary / '+titleId, 160, 12); const checks = stack(summary, 'Workflow check row', 160, 4, true);
  for (const id of starIds) { const check = extraClone('Workflow check / '+id, checks); check.rescale(20 / check.width); }
  await text(titleId, summary, 16, 160); await text(captionId, summary, 14, 160);
}
for (const [iconId, plateId, titleId, bodyId] of [['0:86', '0:85', '0:88', '0:84'], ['0:92', '0:91', '0:95', '0:90'], ['0:99', '0:98', '0:101', '0:97']]) {
  const row = stack(support, 'Support row / ' + titleId, 342, 16, true); row.counterAxisAlignItems = 'MIN'; const icon = stack(row, 'Original icon tile', 52, 0); icon.resize(52, 52); icon.primaryAxisSizingMode = 'FIXED'; icon.fills = paint((await src(plateId)).fills); icon.effects = paint((await src(plateId)).effects); icon.paddingLeft = icon.paddingRight = icon.paddingTop = icon.paddingBottom = 11; await clone(iconId, icon, 30);
  const content = stack(row, 'Support description', 274, 8); await text(titleId, content, 22, 274, 1.5); await text(bodyId, content, 16, 274);
}
const features = section('Features / three large original illustration cards', 28, 56, 56); await text('0:456', features, 30, 342, 1.4); await text('0:455', features, 16); await clone('0:457', features);
for (const id of ['0:553', '0:460', '0:498']) await clone(id, features, 342);
const benefits = section('Benefits / original checklist and photo', 28, 48, 56); await text('0:179', benefits, 30, 342, 1.4);
for (const [iconId, labelId] of [['0:182', '0:185'], ['0:187', '0:190'], ['0:192', '0:195'], ['0:197', '0:200'], ['0:202', '0:205']]) {
  const row = stack(benefits, 'Checklist / ' + labelId, 342, 12, true); row.counterAxisAlignItems = 'MIN'; await clone(iconId, row, 24); await text(labelId, row, 16, 306, 1.6);
}
const photo = stack(benefits, 'Original photo with floating native callouts', 342, 0); photo.resize(342, 418); photo.primaryAxisSizingMode = 'FIXED';
await decoration('0:177', photo, 342, 0, 0); await decoration('0:206', photo, 231, 0, 28); await decoration('0:217', photo, 105, 237, 93); await decoration('0:227', photo, 230, 0, 359);
await decoration('0:171', photo, 37, 8, 245);
const stages = section('Preparation / writing / publishing in original card positions', 28, 48, 64); await text('0:236', stages, 30, 342, 1.4); await text('0:237', stages, 16);
await clone('0:238', stages, 300); for (const id of ['0:285', '0:325', '0:244']) await clone(id, stages, 342);
const dark = section('Continuous dark usage guide / contact / footer', 32, 56, 40, (await src('0:79')).fills); await text('0:385', dark, 30, 342, 1.4); await text('0:384', dark, 16); await text('0:387', dark, 16); await text('0:388', dark, 16);
const usageMarks = stack(dark, 'Original round usage marks', 342, 3, true); for (const id of ['0:392','0:393','0:394','0:395','0:396']) await clone(id, usageMarks);
const contact = stack(dark, 'Contact / adapted original card', 342, 20); contact.paddingLeft = contact.paddingRight = 24; contact.paddingTop = contact.paddingBottom = 28; contact.cornerRadius = 20; contact.fills = paint((await src('0:399')).fills);
const contactLogoRow = stack(contact, 'Contact brand mark row', 294, 0, true); contactLogoRow.primaryAxisAlignItems = 'CENTER'; const contactLogo = extraClone('Contact brand mark / 0:416', contactLogoRow); contactLogo.rescale(58 / contactLogo.width); const contactTitle = await text('0:415', contact, 26, 294, 1.4); contactTitle.textAlignHorizontal = 'CENTER';
for (const [labelId, valueId, surfaceId, area] of [['0:410', '0:412', '0:411', false], ['0:403', '0:405', '0:404', true]]) {
  const field = stack(contact, 'Email guidance / ' + labelId, 294, 10); await text(labelId, field, 16, 294); const surface = stack(field, 'Original white field surface', 294, 0); surface.paddingLeft = surface.paddingRight = 16; surface.paddingTop = surface.paddingBottom = area ? 20 : 14; surface.cornerRadius = 10; surface.fills = paint((await src(surfaceId)).fills); await text(valueId, surface, 14, 262);
}
const emailButton = stack(contact, 'Email app CTA', 294, 0); emailButton.fills = paint((await src('0:407')).fills); emailButton.cornerRadius = 10; emailButton.paddingTop = emailButton.paddingBottom = 16; emailButton.counterAxisAlignItems = 'CENTER'; const buttonLabel = await text('0:408', emailButton, 18, 260, 1.5); buttonLabel.textAlignHorizontal = 'CENTER'; await emailButton.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'URL', url: 'mailto:support@hongsik.blog' }] }]); await text('0:413', contact, 14, 294);
const footer = stack(dark, 'Footer / same uninterrupted dark background', 342, 28); footer.paddingTop = 32; extraClone('Brand replacement / 0:420', footer); await text('0:419', footer, 16); await clone('0:421', footer, 342);
const footerLinks = stack(footer, 'Footer link columns', 342, 24, true); footerLinks.layoutWrap = 'WRAP'; footerLinks.counterAxisSpacing = 24; await clone('0:431', footerLinks, 159); await clone('0:437', footerLinks, 152); await clone('0:443', footerLinks, 132);
await text('0:429', footer, 13, 342, 1.7); const legal = stack(footer, 'Footer small links', 342, 24, true); await text('0:450', legal, 14, 140); await text('0:452', legal, 14, 140);
return { mobileId: mobile.id, createdNodeIds: [mobile.id, ...mobile.findAll(() => true).map(n => n.id)], mutatedNodeIds: [], sections, sourceClones, width: mobile.width, height: mobile.height, nativeDesktopUnchanged: true };
