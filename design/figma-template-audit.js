// Read-only Figma MCP use_figma body. Inject `state`; never writes to the file.
// Only the root frame's canvas translation is ignored; inner geometry is strict.
const source = await figma.getNodeByIdAsync(state.sourceId);
const desktop = await figma.getNodeByIdAsync(state.desktopId);
if (!source || !desktop || source.id === desktop.id) throw new Error('Distinct source and clone roots are required.');
const entries = state.templateMap instanceof Map ? [...state.templateMap] : Object.entries(state.templateMap || {});
const mapping = new Map(entries), typography = new Set(state.allowedTypographyNodeIds || []);
const content = new Set(state.allowedContentNodeIds || []), approvedExtras = new Set(state.allowedExtraNodeIds || []);
const epsilon = 0.001, issues = new Map(), exceptions = [], imageReplacements = [];
function descendants(root) {
  const result = [], pending = [root];
  while (pending.length) { const n = pending.pop(); result.push(n); if ('children' in n) pending.push(...n.children); }
  return result;
}
const originals = descendants(source), clones = descendants(desktop);
const originalById = new Map(originals.map(n => [n.id, n])), cloneById = new Map(clones.map(n => [n.id, n]));
function bad(sourceId, cloneId, field) {
  if (!issues.has(sourceId)) issues.set(sourceId, { sourceId, cloneId: cloneId || null, fields: [] });
  issues.get(sourceId).fields.push(field);
}
function plain(value) {
  if (typeof value === 'symbol') return String(value);
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
    .filter(key => !(value.type === 'IMAGE' && key === 'imageHash')).map(key => [key, plain(value[key])]));
  return value;
}
function same(a, b) {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= epsilon;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  return ak.length === bk.length && ak.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
}
const geometry = ['x','y','width','height','rotation','relativeTransform','layoutMode','layoutPositioning',
  'layoutSizingHorizontal','layoutSizingVertical','primaryAxisSizingMode','counterAxisSizingMode',
  'primaryAxisAlignItems','counterAxisAlignItems','layoutWrap','itemSpacing','counterAxisSpacing',
  'paddingLeft','paddingRight','paddingTop','paddingBottom','layoutGrow','layoutAlign','cornerRadius',
  'topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius','cornerSmoothing',
  'clipsContent','opacity','blendMode','visible','fills','strokes','strokeWeight','strokeAlign',
  'strokeCap','strokeJoin','dashPattern','effects'];
const textFields = ['fontSize','fontWeight','lineHeight','letterSpacing','paragraphSpacing','paragraphIndent',
  'listSpacing','textAutoResize','textAlignHorizontal','textAlignVertical','textCase','textDecoration'];
if (mapping.get(source.id) !== desktop.id) bad(source.id, desktop.id, 'rootMapping');
if (new Set(entries.map(([, id]) => id)).size !== entries.length) bad(source.id, desktop.id, 'duplicateCloneMapping');
for (const [id, cloneId] of entries) if (!originalById.has(id)) bad(id, cloneId, 'sourceOutsideRoot');
for (const a of originals) {
  const cloneId = mapping.get(a.id), b = cloneById.get(cloneId);
  if (!b) { bad(a.id, cloneId, cloneId ? 'cloneMissingOrOutsideRoot' : 'missingMapping'); continue; }
  if (a.type !== b.type) { bad(a.id, b.id, 'type'); continue; }
  if (a !== source && mapping.get(a.parent?.id) !== b.parent?.id) bad(a.id, b.id, 'parent');
  if ('children' in a && 'children' in b) {
    const wanted = a.children.map(n => mapping.get(n.id)), known = new Set(wanted);
    if (!same(wanted, b.children.filter(n => known.has(n.id)).map(n => n.id))) bad(a.id, b.id, 'childOrder');
  }
  for (const field of geometry.concat(a.type === 'TEXT' ? textFields.concat('fontName') : [])) {
    if (a === source && (field === 'x' || field === 'y')) continue;
    if (!(field in a) && !(field in b)) continue;
    if (!(field in a) || !(field in b)) { bad(a.id, b.id, field + '.availability'); continue; }
    try {
      let av = a[field], bv = b[field];
      if (field === 'fontName') { av = typeof av === 'object' ? { style: av.style } : av; bv = typeof bv === 'object' ? { style: bv.style } : bv; }
      if (a === source && field === 'relativeTransform') { av = av.map(row => [row[0], row[1], 0]); bv = bv.map(row => [row[0], row[1], 0]); }
      if ((field === 'fills' || field === 'strokes') && Array.isArray(av) && Array.isArray(bv))
        av.forEach((p, i) => { if (p.type === 'IMAGE' && bv[i]?.type === 'IMAGE' && p.imageHash !== bv[i].imageHash) imageReplacements.push({ sourceId: a.id, cloneId: b.id, field, index: i }); });
      if (same(plain(av), plain(bv))) continue;
      const frozenTextSizing = a.type === 'TEXT' && state.freezeTextBounds &&
        ((field === 'textAutoResize' && b.textAutoResize === 'NONE') ||
         (['layoutSizingHorizontal','layoutSizingVertical'].includes(field) && b[field] === 'FIXED'));
      const koreanWeight = a.type === 'TEXT' && ['fontWeight','fontName'].includes(field) &&
        a.fontName.family === 'Inter' && a.fontName.style === 'Semi Bold' &&
        b.fontName.family === 'Noto Sans KR' && b.fontName.style === 'Bold';
      const allowed = frozenTextSizing || koreanWeight ||
        (a.type === 'TEXT' && field === 'fontSize' && typography.has(a.id)) ||
        (['fills','strokes','visible'].includes(field) && content.has(a.id));
      if (allowed) exceptions.push({ sourceId: a.id, cloneId: b.id, field });
      else bad(a.id, b.id, field);
    } catch (error) { bad(a.id, b.id, field + '.read: ' + String(error.message)); }
  }
}
const mappedIds = new Set(entries.map(([, id]) => id));
const extras = clones.filter(n => !mappedIds.has(n.id)).map(n => {
  let p = n, approved = false;
  while (p && p !== desktop) { if (approvedExtras.has(p.id)) approved = true; p = p.parent; }
  return { id: n.id, name: n.name, type: n.type, approved };
});
const offendingFields = [...issues.values()], needsReview = extras.filter(n => !n.approved);
const result = { pass: !offendingFields.length && !needsReview.length, sourceId: source.id, desktopId: desktop.id,
  sourceNodeCount: originals.length, cloneNodeCount: clones.length, mappingCount: entries.length,
  offendingNodeCount: offendingFields.length, offendingFieldCount: offendingFields.reduce((sum, n) => sum + n.fields.length, 0),
  offendingFields, permittedExceptions: exceptions, imageReplacements, extraNodes: extras, needsReview,
  rootCanvasTranslationIgnored: { source: { x: source.x, y: source.y }, clone: { x: desktop.x, y: desktop.y } },
  epsilon, ignoredTextProperties: ['characters', 'fontName.family'], mutatedNodeIds: [] };
if (JSON.stringify(result).length > 200000) throw new Error('Audit report exceeds 200KB; inspect the changed node groups separately. No file changes made.');
return result;
