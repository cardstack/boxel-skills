import { modifier } from "ember-modifier";
//#region dist/coordinate-debugger-DMx2ibI_.js
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: true,
		configurable: true,
		writable: true
	}) : e[r] = t, e;
}
function _initializerDefineProperty(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _toPrimitive(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r);
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
var SCOPED_CSS_ATTRIBUTE = /^data-scopedcss-[0-9a-f]{10}-[0-9a-f]{10}$/;
var SurfaceScopeContextName = "boxel-surface:scope";
var SurfaceScopeRelay = class {
	constructor(parent) {
		_defineProperty(this, "local", /* @__PURE__ */ new Map());
		this.parent = parent;
	}
	get attributes() {
		return mergeSurfaceScopeAttributes(this.parent?.attributes ?? [], [...this.local].map(([name, value]) => ({
			name,
			value
		})));
	}
	adopt(attributes) {
		for (const attribute of attributes) this.local.set(attribute.name, attribute.value);
	}
	stamp(root) {
		stampSurfaceScope(root, this.attributes);
	}
};
function createSurfaceScopeRelay(parent) {
	return new SurfaceScopeRelay(parent);
}
function isSurfaceScopeAttribute(name) {
	return SCOPED_CSS_ATTRIBUTE.test(name);
}
function surfaceScopeAttributesForElement(element) {
	return [...element.attributes].filter((attribute) => isSurfaceScopeAttribute(attribute.name)).map((attribute) => ({
		name: attribute.name,
		value: attribute.value
	}));
}
function surfaceScopeAttributesForTree(element) {
	const scopes = [];
	let current = element;
	while (current) {
		scopes.push(...surfaceScopeAttributesForElement(current));
		current = current.parentElement;
	}
	return mergeSurfaceScopeAttributes(scopes.reverse());
}
function mergeSurfaceScopeAttributes(...attributeSets) {
	const merged = /* @__PURE__ */ new Map();
	for (const attributes of attributeSets) for (const attribute of attributes) merged.set(attribute.name, attribute.value);
	return [...merged].map(([name, value]) => ({
		name,
		value
	}));
}
function stampSurfaceScope(root, attributes) {
	if (!root || attributes.length === 0) return;
	if (isElement(root)) stampElement(root, attributes);
	for (const element of root.querySelectorAll?.("*") ?? []) stampElement(element, attributes);
}
function isElement(value) {
	return !!(value && typeof value === "object" && "nodeType" in value && value.nodeType === 1);
}
function stampElement(element, attributes) {
	for (const attribute of attributes) if (element.getAttribute(attribute.name) !== attribute.value) element.setAttribute(attribute.name, attribute.value);
}
var roots = /* @__PURE__ */ new WeakMap();
var runtimeRoots = /* @__PURE__ */ new WeakMap();
var liftRoots = /* @__PURE__ */ new WeakMap();
var surfaceElements = /* @__PURE__ */ new WeakMap();
function registerSurfaceDomRoot(element, ladder, runtime) {
	roots.set(element, ladder);
	if (runtime) runtimeRoots.set(element, runtime);
	return () => {
		roots.delete(element);
		runtimeRoots.delete(element);
	};
}
function ladderForSurfaceElement(element) {
	let current = element;
	while (current) {
		const ladder = roots.get(current);
		if (ladder) return ladder;
		current = current.parentElement;
	}
}
function surfaceRuntimeForElement(element) {
	let current = element;
	while (current) {
		const runtime = runtimeRoots.get(current);
		if (runtime) return runtime;
		current = current.parentElement;
	}
}
function registerSurfaceDomNode(runtime, id, element) {
	let elementsById = surfaceElements.get(runtime);
	if (!elementsById) {
		elementsById = /* @__PURE__ */ new Map();
		surfaceElements.set(runtime, elementsById);
	}
	let elements = elementsById.get(id);
	if (!elements) {
		elements = /* @__PURE__ */ new Set();
		elementsById.set(id, elements);
	}
	elements.add(element);
	return () => {
		elements?.delete(element);
		if (elements?.size === 0) elementsById?.delete(id);
	};
}
function surfaceElementsForIds(root, ids, runtime) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const activeRuntime = runtime ?? surfaceRuntimeForElement(root);
	const elementsById = activeRuntime ? surfaceElements.get(activeRuntime) : void 0;
	for (const id of ids) {
		const registered = elementsById?.get(id);
		if (registered) {
			let addedRegisteredElement = false;
			for (const element of registered) {
				const inRoot = root.contains(element);
				const inSameRuntimeLift = !inRoot && activeRuntime !== void 0 && element.closest("[data-bx-lift]") !== null && surfaceRuntimeForElement(element) === activeRuntime;
				if (!element.isConnected || !inRoot && !inSameRuntimeLift || seen.has(element)) continue;
				out.push(element);
				seen.add(element);
				addedRegisteredElement = true;
			}
			if (addedRegisteredElement) continue;
		}
		const fallback = findSurfaceElementById(root, id);
		if (fallback && !seen.has(fallback)) {
			out.push(fallback);
			seen.add(fallback);
		}
	}
	return out;
}
function surfaceElementForId(root, id, runtime) {
	return surfaceElementsForIds(root, [id], runtime)[0] ?? null;
}
function registerSurfaceLiftDomRoot(element, manager) {
	liftRoots.set(element, manager);
	return () => liftRoots.delete(element);
}
function liftManagerForSurfaceElement(element) {
	let current = element;
	while (current) {
		const manager = liftRoots.get(current);
		if (manager) return manager;
		current = current.parentElement;
	}
}
function parentSurfaceIdForElement(element) {
	const parent = element.parentElement?.closest("[data-ladder-id], [data-surface-component][id]");
	return parent?.getAttribute("data-ladder-id") ?? parent?.id ?? null;
}
function findSurfaceElementById(root, id) {
	if (surfaceElementMatchesId(root, id)) return root;
	for (const element of root.querySelectorAll("[data-ladder-id], [data-id], [data-bx-grid-traversal-id], [id]")) if (surfaceElementMatchesId(element, id)) return element;
	return null;
}
function surfaceElementMatchesId(element, id) {
	return element.getAttribute("data-ladder-id") === id || element.getAttribute("data-id") === id || element.dataset["bxGridTraversalId"] === id || element.id === id;
}
var textInputTypes = new Set([
	"",
	"date",
	"datetime-local",
	"email",
	"month",
	"number",
	"password",
	"search",
	"tel",
	"text",
	"time",
	"url",
	"week"
]);
var keyboardOwnerSelector = ["[data-surface-keyboard-owner]", "[data-surface-key-scope]"].join(", ");
var nativeInteractiveSelector = [
	"input",
	"textarea",
	"select",
	"button",
	"a[href]",
	"[contenteditable]:not([contenteditable=false])",
	"[role=\"button\"]",
	"[role=\"checkbox\"]",
	"[role=\"link\"]",
	"[role=\"listbox\"]",
	"[role=\"menu\"]",
	"[role=\"menuitem\"]",
	"[role=\"menuitemcheckbox\"]",
	"[role=\"menuitemradio\"]",
	"[role=\"option\"]",
	"[role=\"radio\"]",
	"[role=\"slider\"]",
	"[role=\"switch\"]",
	"[role=\"textbox\"]"
].join(", ");
var focusRetainingSelectionTargetSelector = [
	"[data-bx-lift]",
	"[data-surface-key-scope]",
	"[data-surface-preserve-focus]",
	"select",
	"textarea",
	"[contenteditable]:not([contenteditable=false])",
	"[role=\"listbox\"]",
	"[role=\"menu\"]",
	"[role=\"menuitem\"]",
	"[role=\"menuitemcheckbox\"]",
	"[role=\"menuitemradio\"]",
	"[role=\"option\"]",
	"[role=\"textbox\"]"
].join(", ");
var pointerOwnedControlSelector = [
	"[data-surface-atom-editor]",
	"[data-surface-keyboard-owner]",
	"[data-surface-key-scope]",
	"[data-surface-preserve-focus]",
	"input",
	"textarea",
	"select",
	"[contenteditable]:not([contenteditable=false])",
	"[role=\"listbox\"]",
	"[role=\"menu\"]",
	"[role=\"menuitem\"]",
	"[role=\"menuitemcheckbox\"]",
	"[role=\"menuitemradio\"]",
	"[role=\"option\"]",
	"[role=\"slider\"]",
	"[role=\"textbox\"]"
].join(", ");
var activationKeys = new Set(["Enter", " "]);
var inputOwnedRoles = new Set([
	"listbox",
	"menu",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"slider",
	"textbox"
]);
function isSurfaceTextEntryTarget(target) {
	const control = (target instanceof Element ? target : null)?.closest("input, textarea, [contenteditable]:not([contenteditable=false]), [role=\"textbox\"]");
	if (!control) return false;
	if (control instanceof HTMLTextAreaElement) return true;
	if (control instanceof HTMLInputElement) return textInputTypes.has(control.type.toLowerCase());
	return true;
}
function surfaceTargetOwnsKeyboardEvent(event) {
	return surfaceElementOwnsKeyboardEvent(event.target instanceof Element ? event.target : null, event.key);
}
function surfaceTargetOwnsPointerEvent(target) {
	const element = target instanceof Element ? target : null;
	return Boolean(element?.closest(pointerOwnedControlSelector));
}
function surfaceElementOwnsKeyboardEvent(target, key) {
	if (!target) return false;
	if (target.closest(keyboardOwnerSelector)) return true;
	const control = target.closest(nativeInteractiveSelector);
	if (!control) return false;
	if (isSurfaceTextEntryTarget(control)) return true;
	if (control instanceof HTMLSelectElement) return true;
	if (control instanceof HTMLInputElement) {
		const type = control.type.toLowerCase();
		if (type === "range") return true;
		if (type === "checkbox" || type === "radio") return activationKeys.has(key);
		return false;
	}
	const role = control.getAttribute("role");
	if (role && inputOwnedRoles.has(role)) return true;
	if (control instanceof HTMLButtonElement || control instanceof HTMLAnchorElement || role === "button" || role === "checkbox" || role === "radio" || role === "switch") return activationKeys.has(key);
	return false;
}
function surfaceTargetRetainsBrowserFocusAfterSelection(target) {
	const element = target instanceof Element ? target : null;
	if (!element) return false;
	if (surfaceTargetOwnsPointerEvent(element)) return true;
	if (element.closest(focusRetainingSelectionTargetSelector)) return true;
	const input = element.closest("input");
	return input ? isSurfaceTextEntryTarget(input) : false;
}
var actionRoles = new Set([
	"button",
	"link",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"switch",
	"tab"
]);
var fieldRoles = new Set([
	"checkbox",
	"combobox",
	"radio",
	"searchbox",
	"slider",
	"spinbutton",
	"textbox"
]);
var rangeItemRoles = new Set([
	"cell",
	"columnheader",
	"gridcell",
	"listitem",
	"row",
	"rowheader",
	"treeitem"
]);
var objectRoles = new Set([
	"article",
	"document",
	"figure",
	"img",
	"region"
]);
var chromeRoles = new Set([
	"banner",
	"complementary",
	"contentinfo",
	"navigation",
	"search",
	"status",
	"toolbar"
]);
var backgroundDeselectSurfaces$1 = new Set([
	"space",
	"layout",
	"canvas",
	"scene",
	"grid",
	"scroll",
	"flow",
	"outline",
	"frame",
	"pane",
	"plane"
]);
function isNativeFocusable(element) {
	return element.matches("button, a[href], input, textarea, select, [contenteditable]:not([contenteditable=false])");
}
function ariaDerivedTarget(element) {
	const role = element.getAttribute("role")?.trim().toLowerCase();
	if (role) {
		if (actionRoles.has(role)) return "action";
		if (fieldRoles.has(role)) return "field";
		if (rangeItemRoles.has(role)) return "range-item";
		if (objectRoles.has(role)) return "object";
		if (chromeRoles.has(role)) return "chrome";
		if (role === "group" || role === "presentation" || role === "none") return "structure";
	}
	switch (element.localName) {
		case "a":
		case "button": return "action";
		case "input":
		case "select":
		case "textarea": return "field";
		case "article":
		case "figure":
		case "img": return "object";
		case "aside":
		case "footer":
		case "header":
		case "nav": return "chrome";
		case "td":
		case "th":
		case "li": return "range-item";
		case "section": return element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby") ? "object" : "structure";
		default: return;
	}
}
function isTextEntryElement(element) {
	if (!element) return false;
	return isSurfaceTextEntryTarget(element) || surfaceTargetRetainsBrowserFocusAfterSelection(element) || element.matches("select");
}
function shouldDeselectBareSurfaceBackground$1(surface, element, target) {
	if (target !== element) return false;
	const override = element.getAttribute("data-surface-background");
	if (override === "select") return false;
	if (override === "deselect") return true;
	return surface !== void 0 && backgroundDeselectSurfaces$1.has(surface);
}
function shouldPreserveSurfaceFocus(target) {
	return surfaceTargetRetainsBrowserFocusAfterSelection(target);
}
function textEntryElements(element) {
	return Array.from(element.querySelectorAll("input, textarea, select, [contenteditable]:not([contenteditable=false])")).filter(isTextEntryElement);
}
function isMagneticSelectionUnit(opts) {
	return opts.surface === "cell" && opts.policy?.pointer !== "content-interactive";
}
function snapFocusToMagneticSelectionUnit(element, target, opts) {
	if (!isMagneticSelectionUnit(opts)) return;
	if (target === element) return;
	if (surfaceTargetRetainsBrowserFocusAfterSelection(target)) return;
	if (target?.closest("[data-ladder-id]") !== element) return;
	const focusElement = () => {
		if (!element.isConnected) return;
		if (element.ownerDocument.activeElement === element) return;
		element.focus({ preventScroll: true });
	};
	requestAnimationFrame(focusElement);
	setTimeout(focusElement, 0);
}
function shouldDelegateToEditor(surface, element, target) {
	if (isTextEntryElement(target)) return true;
	let editorCount = textEntryElements(element).length;
	if (surface === "cell") return editorCount > 0;
	return editorCount === 1;
}
function focusSurfaceEditor(element, target, requireSingleEditor) {
	const editor = isTextEntryElement(target) ? target : (() => {
		let editors = textEntryElements(element);
		if (requireSingleEditor && editors.length !== 1) return null;
		return editors[0] ?? null;
	})();
	if (!editor) return;
	editor.focus({ preventScroll: true });
	requestAnimationFrame(() => {
		if (!editor.isConnected) return;
		editor.focus({ preventScroll: true });
	});
	setTimeout(() => {
		if (!editor.isConnected) return;
		editor.focus({ preventScroll: true });
	}, 0);
}
function isSurfaceNodeMode(value) {
	return value === "use" || value === "change" || value === "inspect";
}
function isEnabledDataAttribute$2(value) {
	return value === "" || value === "true";
}
function modeForElement(element, mode) {
	if (mode) return mode;
	const inherited = element.closest("[data-surface-mode]")?.getAttribute("data-surface-mode") ?? null;
	return isSurfaceNodeMode(inherited) ? inherited : "use";
}
function inspectForElement(element, inspect) {
	if (inspect !== void 0) return inspect;
	const inherited = element.closest("[data-surface-inspect]")?.getAttribute("data-surface-inspect") ?? null;
	if (isEnabledDataAttribute$2(inherited)) return true;
	if (inherited === "false") return false;
	return modeForElement(element, void 0) === "inspect";
}
function selectionModeForElement(element, opts) {
	const mode = modeForElement(element, opts.mode);
	if (mode === "use" && inspectForElement(element, opts.inspect)) return "inspect";
	return mode;
}
function runtimeForNode(element, opts) {
	return opts.runtime ?? surfaceRuntimeForElement(element);
}
function runtimeClickOptionsForElement(element, opts) {
	return {
		mode: selectionModeForElement(element, opts),
		inspect: inspectForElement(element, opts.inspect)
	};
}
function semanticPathForEvent(event) {
	const ids = [];
	const seen = /* @__PURE__ */ new Set();
	for (const target of event.composedPath()) {
		if (!(target instanceof Element)) continue;
		const id = target.getAttribute("data-ladder-id");
		if (!id || seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}
function projectedClickTargetId(owningLadder, element, opts, rawTargetId, pointerPath) {
	if (!rawTargetId) return null;
	const runtime = runtimeForNode(element, opts);
	if (runtime) {
		const traversalIds = new Set(runtime.traversalSet(runtimeClickOptionsForElement(element, opts)).ids);
		for (const id of pointerPath) if (traversalIds.has(id)) return id;
		return runtime.node(rawTargetId) ? rawTargetId : null;
	}
	return owningLadder.targetIdFor(rawTargetId, selectionModeForElement(element, opts));
}
function resolvedClickTargetId(owningLadder, element, opts, rawTargetId, event, pointerPath) {
	if (!rawTargetId) return {
		targetId: null,
		handledByRuntime: false
	};
	const runtime = runtimeForNode(element, opts);
	if (runtime) {
		const result = runtime.dispatch({
			type: "click",
			targetId: rawTargetId,
			detail: event.detail,
			additive: event.metaKey || event.ctrlKey,
			range: event.shiftKey,
			pointerPath,
			...runtimeClickOptionsForElement(element, opts)
		});
		return {
			targetId: result.ownerId,
			handledByRuntime: result.handled
		};
	}
	return {
		targetId: owningLadder.targetIdFor(rawTargetId, selectionModeForElement(element, opts)),
		handledByRuntime: false
	};
}
function isUseInteractiveTarget(target, opts) {
	return target === "action" || opts.onActivate !== void 0 || opts.onExpand !== void 0 || opts.onCollapse !== void 0 || opts.scrollOnSelect === true || opts.hoverSignal !== void 0;
}
function encodePathPart(part) {
	return encodeURIComponent(String(part));
}
function parentSurfaceForElement(element) {
	return element.parentElement?.closest("[data-surface-component]") ?? null;
}
function parentSurfaceCoordinateForElement(element) {
	const parentSurface = parentSurfaceForElement(element);
	if (!parentSurface) return { state: "none" };
	if (parentSurface.getAttribute("data-surface-coordinate-ready") !== "true") return { state: "pending" };
	const path = parentSurface.getAttribute("data-surface-coordinate") ?? parentSurface.getAttribute("data-surface-path") ?? null;
	return path ? {
		state: "ready",
		path
	} : { state: "none" };
}
function parentSurfacePathForElement(element) {
	const parentSurface = element.parentElement?.closest("[data-surface-coordinate], [data-surface-path]");
	return parentSurface?.getAttribute("data-surface-coordinate") ?? parentSurface?.getAttribute("data-surface-path") ?? null;
}
function appendPath(parentPath, keyParts) {
	const suffix = keyParts.map(encodePathPart).join(":");
	return suffix ? `${parentPath}:${suffix}` : parentPath;
}
function nearestCoordinateSpaceElement(element) {
	return element.parentElement?.closest("[data-surface-coordinate-space][data-surface-coordinate-space-id]") ?? null;
}
function coordinateSpaceForElement(element, opts, parentCoordinate = parentSurfaceCoordinateForElement(element)) {
	const local = opts.localCoordinate;
	if (opts.coordinateSpace) {
		const spaceId = opts.focusKey ?? opts.id;
		if (!spaceId) return void 0;
		const parentSpace = local ? nearestCoordinateSpaceElement(element) : null;
		const parentSpaceId = parentSpace?.getAttribute("data-surface-coordinate-space-id");
		const parentSchema = parentSpace?.getAttribute("data-surface-coordinate-space");
		return {
			coordinate: local && parentSpaceId && parentSchema ? `${parentSpaceId}[${parentSchema}]:${local}` : opts.coordinate ?? (local ? `${spaceId}[${opts.coordinateSpace}]:${local}` : `${spaceId}[${opts.coordinateSpace}]`),
			id: spaceId,
			schema: opts.coordinateSpace
		};
	}
	if (!local) return void 0;
	const parentSpace = nearestCoordinateSpaceElement(element);
	const parentSpaceId = parentSpace?.getAttribute("data-surface-coordinate-space-id");
	const parentSchema = parentSpace?.getAttribute("data-surface-coordinate-space");
	if (!parentSpaceId || !parentSchema) return void 0;
	if (parentCoordinate.path) return {
		coordinate: appendPath(parentCoordinate.path, [local]),
		id: parentSpaceId,
		schema: parentSchema
	};
	return {
		coordinate: `${parentSpaceId}[${parentSchema}]:${local}`,
		id: parentSpaceId,
		schema: parentSchema
	};
}
function shouldRefineCoordinateFromDom(source) {
	return source === "context" || source === "generated";
}
function surfaceCoordinateForElement(element, opts, parentCoordinate = parentSurfaceCoordinateForElement(element)) {
	const inheritedPath = parentCoordinate.path ?? parentSurfacePathForElement(element);
	const domCoordinate = inheritedPath ? appendPath(inheritedPath, opts.keyParts ?? []) : void 0;
	if (shouldRefineCoordinateFromDom(opts.coordinateSource) && domCoordinate) return domCoordinate;
	return opts.coordinate ?? opts.focusKey ?? (opts.generatedId ? domCoordinate : void 0);
}
var hoveredSurface = null;
var hoverSignalByRoot = /* @__PURE__ */ new WeakMap();
function clearHoveredSurface() {
	hoveredSurface?.classList.remove("is-surface-hovered");
	hoveredSurface = null;
}
function setHoveredSurface(surface) {
	if (surface === hoveredSurface) return;
	clearHoveredSurface();
	hoveredSurface = surface;
	hoveredSurface?.classList.add("is-surface-hovered");
}
function rootForSurfaceElement(element) {
	return element.closest("[data-surface-component=\"environment\"]") ?? document.body;
}
function clearRootHoverSignal(root, signal) {
	const currentSignal = hoverSignalByRoot.get(root);
	if (signal && currentSignal && currentSignal !== signal) return;
	for (const target of root.querySelectorAll(".is-surface-correspondence-hovered")) target.classList.remove("is-surface-correspondence-hovered");
	hoverSignalByRoot.delete(root);
}
function setRootHoverSignal(root, signal) {
	if (hoverSignalByRoot.get(root) === signal) return;
	clearRootHoverSignal(root);
	for (const target of root.querySelectorAll("[data-surface-hover-anchor]")) if (target.getAttribute("data-surface-hover-anchor") === signal) target.classList.add("is-surface-correspondence-hovered");
	hoverSignalByRoot.set(root, signal);
}
function surfaceIdForElement(element) {
	return element?.getAttribute("data-ladder-id") ?? null;
}
function surfaceElementById$2(root, id) {
	if (!id) return null;
	if (root.getAttribute("data-ladder-id") === id) return root;
	for (const element of root.querySelectorAll("[data-ladder-id]")) if (element.getAttribute("data-ladder-id") === id) return element;
	return null;
}
function nearestSurfaceAtPoint(root, event) {
	for (const element of document.elementsFromPoint(event.clientX, event.clientY)) {
		const surface = element.closest("[data-ladder-id]");
		if (surface && root.contains(surface)) return surface;
	}
	const fallback = event.target?.closest("[data-ladder-id]") ?? null;
	return fallback && root.contains(fallback) ? fallback : null;
}
function nearestLiftSourceForTarget(root, target) {
	const source = target?.closest("[data-surface-lift-source]") ?? null;
	return source && root.contains(source) ? source : null;
}
function nearestLiftSourceAtPoint(root, event) {
	for (const element of document.elementsFromPoint(event.clientX, event.clientY)) {
		const source = element.closest("[data-surface-lift-source]");
		if (source && root.contains(source)) return source;
	}
	return nearestLiftSourceForTarget(root, event.target);
}
function hasLiftEdges(edges) {
	return edges !== void 0 && Object.values(edges).some(Boolean);
}
var surfaceNode = modifier((element, [ladder], opts = {}) => {
	const priorLadderId = element.getAttribute("data-ladder-id");
	const priorFocusKey = element.getAttribute("data-surface-focus-key");
	const priorSurfacePath = element.getAttribute("data-surface-path");
	const priorSurfaceCoordinate = element.getAttribute("data-surface-coordinate");
	const priorSurfaceCoordinateReady = element.getAttribute("data-surface-coordinate-ready");
	const priorSurface = element.getAttribute("data-surface");
	const priorSurfaceTarget = element.getAttribute("data-surface-target");
	const priorSurfaceTargetScope = element.getAttribute("data-surface-target-scope");
	const priorTabindex = element.getAttribute("tabindex");
	const priorId = element.getAttribute("id");
	const priorAriaExpanded = element.getAttribute("aria-expanded");
	const priorAriaControls = element.getAttribute("aria-controls");
	const priorAriaDescribedBy = element.getAttribute("aria-describedby");
	const priorAriaHasPopup = element.getAttribute("aria-haspopup");
	const priorLiftSource = element.getAttribute("data-surface-lift-source");
	const priorScrollAnchor = element.getAttribute("data-surface-scroll-anchor");
	const priorScrollTarget = element.getAttribute("data-surface-scroll-target");
	const priorHoverAnchor = element.getAttribute("data-surface-hover-anchor");
	const priorHoverSignal = element.getAttribute("data-surface-hover-signal");
	const priorSurfaceActivatable = element.getAttribute("data-surface-activatable");
	const priorSurfaceExpandable = element.getAttribute("data-surface-expandable");
	const priorSurfaceExpanded = element.getAttribute("data-surface-expanded");
	const priorSurfaceDecalShape = element.getAttribute("data-surface-decal-shape");
	let cleanup = () => {};
	let didInstall = false;
	let isDestroying = false;
	let restoreFocusTimer;
	let installRetryFrame;
	let installRetryCount = 0;
	const install = () => {
		if (isDestroying || didInstall) return didInstall;
		const owningLadder = ladder ?? ladderForSurfaceElement(element);
		if (!owningLadder || !opts.id || !opts.surface) return false;
		const parentCoordinate = parentSurfaceCoordinateForElement(element);
		if (parentCoordinate.state === "pending") return false;
		const ownLiftManager = () => opts.liftManager ?? liftManagerForSurfaceElement(element);
		const runtimeCoordinateSpace = coordinateSpaceForElement(element, opts, parentCoordinate);
		const runtimeCoordinate = runtimeCoordinateSpace?.coordinate ?? surfaceCoordinateForElement(element, opts, parentCoordinate);
		const nodeId = runtimeCoordinate ? `${opts.surface}:${runtimeCoordinate}` : opts.id;
		if (!nodeId) return false;
		const unregisterLiftRoot = opts.liftManager ? registerSurfaceLiftDomRoot(element, opts.liftManager) : void 0;
		element.setAttribute("id", nodeId);
		element.setAttribute("data-ladder-id", nodeId);
		if (runtimeCoordinate) {
			element.setAttribute("data-surface-coordinate", runtimeCoordinate);
			element.setAttribute("data-surface-focus-key", runtimeCoordinate);
			element.setAttribute("data-surface-path", runtimeCoordinate);
		}
		if (runtimeCoordinateSpace) {
			element.setAttribute("data-surface-coordinate-space", runtimeCoordinateSpace.schema);
			element.setAttribute("data-surface-coordinate-space-id", runtimeCoordinateSpace.id);
			if (opts.localCoordinate) element.setAttribute("data-surface-local-coordinate", opts.localCoordinate);
		}
		element.setAttribute("data-surface-coordinate-ready", "true");
		element.setAttribute("data-surface", opts.surface);
		const target = opts.target ?? ariaDerivedTarget(element);
		if (target) element.setAttribute("data-surface-target", target);
		else element.removeAttribute("data-surface-target");
		if (opts.targetScope) element.setAttribute("data-surface-target-scope", opts.targetScope);
		else element.removeAttribute("data-surface-target-scope");
		if (hasLiftEdges(opts.lift)) element.setAttribute("data-surface-lift-source", nodeId);
		else element.removeAttribute("data-surface-lift-source");
		if (opts.policy?.decalShape) element.setAttribute("data-surface-decal-shape", opts.policy.decalShape);
		else element.removeAttribute("data-surface-decal-shape");
		const scrollAnchor = opts.scrollAnchor ?? runtimeCoordinate;
		if (scrollAnchor) element.setAttribute("data-surface-scroll-anchor", scrollAnchor);
		else element.removeAttribute("data-surface-scroll-anchor");
		const scrollTarget = opts.scrollTarget ?? runtimeCoordinate;
		if (opts.scrollOnSelect && scrollTarget) element.setAttribute("data-surface-scroll-target", scrollTarget);
		else element.removeAttribute("data-surface-scroll-target");
		const hoverAnchor = opts.hoverAnchor ?? runtimeCoordinate;
		if (hoverAnchor) element.setAttribute("data-surface-hover-anchor", hoverAnchor);
		else element.removeAttribute("data-surface-hover-anchor");
		if (opts.hoverSignal) element.setAttribute("data-surface-hover-signal", opts.hoverSignal);
		else element.removeAttribute("data-surface-hover-signal");
		if (opts.onActivate) element.setAttribute("data-surface-activatable", "true");
		else element.removeAttribute("data-surface-activatable");
		const hasDisclosure = opts.expanded !== void 0;
		if (hasDisclosure) {
			element.setAttribute("data-surface-expandable", "true");
			element.setAttribute("data-surface-expanded", String(opts.expanded ?? false));
		} else {
			element.removeAttribute("data-surface-expandable");
			element.removeAttribute("data-surface-expanded");
		}
		const parentId = parentSurfaceIdForElement(element) ?? opts.parentId ?? null;
		const sourceForLift = () => ({
			id: nodeId,
			path: runtimeCoordinate ?? opts.focusKey,
			surface: opts.surface,
			element,
			data: opts.liftData
		});
		const unregisterLiftSource = hasLiftEdges(opts.lift) ? ownLiftManager()?.registerSource(sourceForLift(), opts.lift) : void 0;
		const syncLiftAria = () => {
			if (!(opts.liftActiveSourceId !== void 0 && opts.liftActiveSourceId === nodeId && opts.liftActiveTargetId !== void 0)) {
				if (hasDisclosure) element.setAttribute("aria-expanded", String(opts.expanded ?? false));
				else element.removeAttribute("aria-expanded");
				element.removeAttribute("aria-controls");
				element.removeAttribute("aria-describedby");
				element.removeAttribute("aria-haspopup");
				return;
			}
			const kind = opts.liftActiveKind;
			const targetId = opts.liftActiveTargetId;
			if (kind === "details") {
				element.setAttribute("aria-describedby", targetId);
				element.removeAttribute("aria-haspopup");
				element.removeAttribute("aria-controls");
			} else {
				element.setAttribute("aria-controls", targetId);
				element.removeAttribute("aria-describedby");
				if (kind === "edit" || kind === "preview") element.setAttribute("aria-haspopup", "dialog");
				else if (kind === "tools") element.setAttribute("aria-haspopup", "menu");
			}
			element.setAttribute("aria-expanded", "true");
		};
		syncLiftAria();
		ownLiftManager()?.updateSourceData(nodeId, opts.liftData);
		const registration = {
			id: nodeId,
			focusKey: runtimeCoordinate,
			surface: opts.surface,
			target,
			targetScope: opts.targetScope,
			scopeId: opts.scopeId,
			scopeKind: opts.scopeKind,
			policy: opts.policy,
			grid: opts.grid,
			coordinateSpaceId: runtimeCoordinateSpace?.id,
			localCoordinate: opts.localCoordinate,
			parentId
		};
		const owningRuntime = runtimeForNode(element, opts);
		const unregister = owningLadder.register(registration);
		const unregisterDomNode = owningRuntime ? registerSurfaceDomNode(owningRuntime, nodeId, element) : void 0;
		const unregisterRuntime = owningRuntime?.register(registration);
		const invokeSelect = (event) => {
			opts.onSelect?.(event);
			if (!opts.scrollOnSelect) return;
			const targetKey = opts.scrollTarget ?? runtimeCoordinate;
			if (!targetKey) return;
			const root = element.closest("[data-surface-component=\"environment\"]") ?? document.body;
			Array.from(root.querySelectorAll("[data-surface-scroll-anchor]")).find((candidate) => candidate.getAttribute("data-surface-scroll-anchor") === targetKey)?.scrollIntoView({
				block: "center",
				inline: "nearest",
				behavior: "auto"
			});
		};
		const invokeActivate = (event) => {
			if (!opts.onActivate) return false;
			event.preventDefault();
			event.stopPropagation();
			opts.onActivate(event);
			return true;
		};
		const invokeExpand = (event) => {
			if (!opts.onExpand) return false;
			event.preventDefault();
			event.stopPropagation();
			opts.onExpand(event);
			return true;
		};
		const invokeCollapse = (event) => {
			if (!opts.onCollapse) return false;
			event.preventDefault();
			event.stopPropagation();
			opts.onCollapse(event);
			return true;
		};
		const onSurfaceActivate = (event) => {
			invokeActivate(event);
		};
		const onSurfaceExpand = (event) => {
			invokeExpand(event);
		};
		const onSurfaceCollapse = (event) => {
			invokeCollapse(event);
		};
		const onFocus = (event) => {
			if (event.target !== element) return;
			invokeSelect(event);
		};
		const scheduleHoverId = (id) => {
			setTimeout(() => {
				if (!isDestroying) owningLadder.hoverId(id);
			}, 0);
		};
		const applyHoverSignal = (active) => {
			if (!opts.hoverSignal) return;
			const root = rootForSurfaceElement(element);
			if (active) setRootHoverSignal(root, opts.hoverSignal);
			else clearRootHoverSignal(root, opts.hoverSignal);
		};
		const clearInspectHover = () => {
			const root = rootForSurfaceElement(element);
			clearRootHoverSignal(root);
			if (hoveredSurface && root.contains(hoveredSurface)) clearHoveredSurface();
			scheduleHoverId(null);
		};
		const onClick = (event) => {
			if (opts.skipClick) return;
			const target = event.target;
			if (shouldPreserveSurfaceFocus(target)) return;
			const pointerPath = semanticPathForEvent(event);
			const rawTargetId = pointerPath[0] ?? null;
			const hit = target?.closest("[data-ladder-id]");
			const liftHit = nearestLiftSourceForTarget(element, target);
			const hitTargetId = hit instanceof HTMLElement ? projectedClickTargetId(owningLadder, element, opts, rawTargetId ?? surfaceIdForElement(hit), pointerPath) : null;
			const isDirectSurfaceHit = hit === element;
			const isLiftSourceHit = liftHit === element;
			const isResolvedSurfaceHit = hitTargetId === nodeId;
			if (isDirectSurfaceHit && shouldDeselectBareSurfaceBackground$1(opts.surface, element, target)) return;
			if (isLiftSourceHit && !isDirectSurfaceHit && hit instanceof HTMLElement) {
				if (hitTargetId && hitTargetId !== nodeId) return;
			}
			if (!isDirectSurfaceHit && !isLiftSourceHit && !isResolvedSurfaceHit) return;
			const resolved = resolvedClickTargetId(owningLadder, element, opts, rawTargetId ?? nodeId, event, pointerPath);
			const targetId = resolved.targetId;
			if (targetId && !resolved.handledByRuntime) owningLadder.focusId(targetId);
			if (!isNativeFocusable(element)) invokeSelect(event);
			if (isDirectSurfaceHit && modeForElement(element, opts.mode) === "change" && shouldDelegateToEditor(opts.surface, element, target)) focusSurfaceEditor(element, target, opts.surface !== "cell");
			else snapFocusToMagneticSelectionUnit(element, target, opts);
		};
		const onPointerDown = (event) => {
			const target = event.target;
			if (shouldPreserveSurfaceFocus(target)) return;
			if (target?.closest("[data-ladder-id]") !== element) return;
			if (modeForElement(element, opts.mode) === "change" && shouldDelegateToEditor(opts.surface, element, target)) focusSurfaceEditor(element, target, opts.surface !== "cell");
		};
		const onDoubleClick = (event) => {
			const target = event.target;
			if (shouldPreserveSurfaceFocus(target)) return;
			if (isTextEntryElement(target)) return;
			const hit = target?.closest("[data-ladder-id]");
			const liftHit = nearestLiftSourceForTarget(element, target);
			const activationHit = target?.closest("[data-surface-activatable=\"true\"]");
			const isDirectSurfaceHit = hit === element;
			const isLiftSourceHit = liftHit === element;
			const isActivationHit = activationHit === element;
			if (isLiftSourceHit && !isDirectSurfaceHit && hit instanceof HTMLElement) {
				const hitTargetId = owningLadder.targetIdFor(surfaceIdForElement(hit), selectionModeForElement(element, opts));
				if (hitTargetId && hitTargetId !== nodeId) return;
			}
			if (!isDirectSurfaceHit && !isLiftSourceHit && !isActivationHit) return;
			if (isLiftSourceHit || isActivationHit) {
				const targetId = owningLadder.targetIdFor(nodeId, selectionModeForElement(element, opts));
				if (targetId) owningLadder.focusId(targetId);
			}
			if (isActivationHit && invokeActivate(event)) return;
			if (isDirectSurfaceHit && modeForElement(element, opts.mode) === "change" && shouldDelegateToEditor(opts.surface, element, target)) {
				focusSurfaceEditor(element, target, opts.surface !== "cell");
				return;
			}
			ownLiftManager()?.openForMode(sourceForLift(), opts.lift, modeForElement(element, opts.mode), "change-activate");
		};
		const onInspectHover = (event) => {
			const target = event.target;
			if (isTextEntryElement(target) || isTextEntryElement(document.activeElement)) {
				clearInspectHover();
				return;
			}
			applyHoverSignal(true);
			if (!inspectForElement(element, opts.inspect)) {
				const root = rootForSurfaceElement(element);
				if (hoveredSurface && root.contains(hoveredSurface)) clearHoveredSurface();
				scheduleHoverId(null);
				ownLiftManager()?.scheduleDismissDetails();
				return;
			}
			const liftSource = nearestLiftSourceAtPoint(element, event);
			const surface = liftSource ?? nearestSurfaceAtPoint(element, event);
			const targetId = owningLadder.targetIdFor(surfaceIdForElement(surface), "inspect");
			setHoveredSurface(surfaceElementById$2(element, targetId));
			scheduleHoverId(targetId);
			if (liftSource === element) ownLiftManager()?.scheduleHover(sourceForLift(), opts.lift, "inspect");
		};
		const onInspectLeave = (event) => {
			const relatedTarget = event.relatedTarget;
			if (relatedTarget && element.contains(relatedTarget)) return;
			requestAnimationFrame(() => {
				if (isDestroying || element.matches(":hover")) return;
				applyHoverSignal(false);
				if (hoveredSurface && element.contains(hoveredSurface)) clearHoveredSurface();
				scheduleHoverId(null);
				ownLiftManager()?.scheduleDismissDetails();
			});
		};
		let didInstallClick = false;
		let didInstallPointerDown = false;
		let didInstallHover = false;
		const updateInteractivity = () => {
			const nextMode = modeForElement(element, opts.mode);
			const inspectEnabled = inspectForElement(element, opts.inspect);
			const useInteractive = isUseInteractiveTarget(target, opts);
			if (priorTabindex === null && !isNativeFocusable(element)) if (nextMode === "use" && !inspectEnabled && !useInteractive) element.removeAttribute("tabindex");
			else element.setAttribute("tabindex", "0");
			if (nextMode === "use" && !inspectEnabled && !useInteractive) {
				if (didInstallClick) {
					element.removeEventListener("click", onClick);
					element.removeEventListener("dblclick", onDoubleClick);
					didInstallClick = false;
				}
				if (didInstallPointerDown) {
					element.removeEventListener("pointerdown", onPointerDown);
					didInstallPointerDown = false;
				}
			} else if (!didInstallClick) {
				element.addEventListener("click", onClick);
				element.addEventListener("dblclick", onDoubleClick);
				didInstallClick = true;
			}
			if (nextMode === "change" && !didInstallPointerDown) {
				element.addEventListener("pointerdown", onPointerDown);
				didInstallPointerDown = true;
			} else if (nextMode !== "change" && didInstallPointerDown) {
				element.removeEventListener("pointerdown", onPointerDown);
				didInstallPointerDown = false;
			}
			if ((inspectEnabled || opts.hoverSignal) && !didInstallHover) {
				element.addEventListener("pointerover", onInspectHover);
				element.addEventListener("pointermove", onInspectHover);
				element.addEventListener("mouseover", onInspectHover);
				element.addEventListener("mousemove", onInspectHover);
				element.addEventListener("pointerleave", onInspectLeave);
				element.addEventListener("mouseleave", onInspectLeave);
				didInstallHover = true;
			} else if (!inspectEnabled && !opts.hoverSignal && didInstallHover) {
				clearInspectHover();
				element.removeEventListener("pointerover", onInspectHover);
				element.removeEventListener("pointermove", onInspectHover);
				element.removeEventListener("mouseover", onInspectHover);
				element.removeEventListener("mousemove", onInspectHover);
				element.removeEventListener("pointerleave", onInspectLeave);
				element.removeEventListener("mouseleave", onInspectLeave);
				didInstallHover = false;
			}
		};
		updateInteractivity();
		element.addEventListener("surface-activate", onSurfaceActivate);
		element.addEventListener("surface-expand", onSurfaceExpand);
		element.addEventListener("surface-collapse", onSurfaceCollapse);
		element.addEventListener("focus", onFocus);
		const modeRoot = opts.mode ? null : element.closest("[data-surface-mode]");
		const inspectRoot = opts.inspect !== void 0 ? null : element.closest("[data-surface-inspect]");
		const modeObserver = modeRoot ? new MutationObserver(() => updateInteractivity()) : null;
		modeObserver?.observe(modeRoot, {
			attributes: true,
			attributeFilter: ["data-surface-mode"]
		});
		const inspectObserver = inspectRoot && inspectRoot !== modeRoot ? new MutationObserver(() => updateInteractivity()) : null;
		inspectObserver?.observe(inspectRoot, {
			attributes: true,
			attributeFilter: ["data-surface-inspect"]
		});
		const paint = () => {
			const projected = (runtimeForNode(element, opts)?.projection({ mode: selectionModeForElement(element, opts) }))?.nodeMap.get(nodeId);
			const surfaceAdornments = new Set(projected?.surfaceAdornments ?? projected?.visualAdornments ?? []);
			const isFocused = projected ? surfaceAdornments.has("focus") : owningLadder.isFocused(nodeId);
			const isSelected = projected ? surfaceAdornments.has("selection") : owningLadder.isFocused(nodeId);
			const isOnFocusPath = projected ? projected.focusPath && !projected.focused && !isFocused : owningLadder.isOnFocusPath(nodeId);
			element.classList.toggle("is-surface-focused", isFocused);
			element.classList.toggle("is-surface-selected", isSelected);
			element.classList.toggle("is-surface-focus-path", isOnFocusPath && !isFocused);
			element.classList.toggle("is-surface-edit-anchor", surfaceAdornments.has("edit-anchor"));
			setDatasetValue(element, "surfaceVisualAdornments", projected?.visualAdornments.join(" ") ?? "");
			setDatasetValue(element, "surfaceAdornments", projected?.surfaceAdornments.join(" ") ?? "");
			setDatasetValue(element, "surfaceDecalAdornments", projected?.decalAdornments.join(" ") ?? "");
			setDatasetValue(element, "surfaceSuppressedAdornments", projected?.suppressedAdornments.join(" ") ?? "");
			setDatasetValue(element, "surfaceDecalShape", projected?.decalShape ?? opts.policy?.decalShape ?? "");
			element.classList.toggle("is-ladder-focused", isFocused);
			element.classList.toggle("is-ladder-selected", isSelected);
		};
		const unsubscribe = owningLadder.subscribe(() => paint());
		const unsubscribeRuntime = owningRuntime?.subscribeSelection(() => paint());
		const shouldRestoreFocus = owningLadder.consumeRestoredFocusId(nodeId);
		const restoreFocus = () => {
			if (!isDestroying && element.isConnected) element.focus({ preventScroll: true });
		};
		queueMicrotask(() => {
			if (shouldRestoreFocus) restoreFocus();
			paint();
		});
		if (shouldRestoreFocus) restoreFocusTimer = setTimeout(restoreFocus, 0);
		cleanup = () => {
			if (restoreFocusTimer !== void 0) clearTimeout(restoreFocusTimer);
			unregisterLiftSource?.();
			unregisterLiftRoot?.();
			modeObserver?.disconnect();
			inspectObserver?.disconnect();
			element.removeEventListener("click", onClick);
			element.removeEventListener("dblclick", onDoubleClick);
			element.removeEventListener("pointerdown", onPointerDown);
			element.removeEventListener("surface-activate", onSurfaceActivate);
			element.removeEventListener("surface-expand", onSurfaceExpand);
			element.removeEventListener("surface-collapse", onSurfaceCollapse);
			element.removeEventListener("focus", onFocus);
			element.removeEventListener("pointerover", onInspectHover);
			element.removeEventListener("pointermove", onInspectHover);
			element.removeEventListener("mouseover", onInspectHover);
			element.removeEventListener("mousemove", onInspectHover);
			element.removeEventListener("pointerleave", onInspectLeave);
			element.removeEventListener("mouseleave", onInspectLeave);
			clearInspectHover();
			if (owningLadder.hoveredId === nodeId) setTimeout(() => owningLadder.hoverId(null), 0);
			unsubscribe();
			unsubscribeRuntime?.();
			unregister();
			unregisterDomNode?.();
			unregisterRuntime?.();
			element.classList.remove("is-ladder-focused", "is-ladder-selected", "is-surface-focused", "is-surface-selected", "is-surface-focus-path", "is-surface-edit-anchor");
			delete element.dataset["surfaceVisualAdornments"];
			delete element.dataset["surfaceAdornments"];
			delete element.dataset["surfaceDecalAdornments"];
			delete element.dataset["surfaceDecalShape"];
			delete element.dataset["surfaceSuppressedAdornments"];
			if (priorLadderId === null) element.removeAttribute("data-ladder-id");
			else element.setAttribute("data-ladder-id", priorLadderId);
			if (priorFocusKey === null) element.removeAttribute("data-surface-focus-key");
			else element.setAttribute("data-surface-focus-key", priorFocusKey);
			if (priorSurfacePath === null) element.removeAttribute("data-surface-path");
			else element.setAttribute("data-surface-path", priorSurfacePath);
			if (priorSurfaceCoordinate === null) element.removeAttribute("data-surface-coordinate");
			else element.setAttribute("data-surface-coordinate", priorSurfaceCoordinate);
			if (priorSurfaceCoordinateReady === null) element.removeAttribute("data-surface-coordinate-ready");
			else element.setAttribute("data-surface-coordinate-ready", priorSurfaceCoordinateReady);
			if (priorSurface === null) element.removeAttribute("data-surface");
			else element.setAttribute("data-surface", priorSurface);
			if (priorSurfaceTarget === null) element.removeAttribute("data-surface-target");
			else element.setAttribute("data-surface-target", priorSurfaceTarget);
			if (priorSurfaceTargetScope === null) element.removeAttribute("data-surface-target-scope");
			else element.setAttribute("data-surface-target-scope", priorSurfaceTargetScope);
			if (priorTabindex === null) element.removeAttribute("tabindex");
			else element.setAttribute("tabindex", priorTabindex);
			if (priorId === null) element.removeAttribute("id");
			else element.setAttribute("id", priorId);
			if (priorAriaExpanded === null) element.removeAttribute("aria-expanded");
			else element.setAttribute("aria-expanded", priorAriaExpanded);
			if (priorAriaControls === null) element.removeAttribute("aria-controls");
			else element.setAttribute("aria-controls", priorAriaControls);
			if (priorAriaDescribedBy === null) element.removeAttribute("aria-describedby");
			else element.setAttribute("aria-describedby", priorAriaDescribedBy);
			if (priorAriaHasPopup === null) element.removeAttribute("aria-haspopup");
			else element.setAttribute("aria-haspopup", priorAriaHasPopup);
			if (priorLiftSource === null) element.removeAttribute("data-surface-lift-source");
			else element.setAttribute("data-surface-lift-source", priorLiftSource);
			if (priorScrollAnchor === null) element.removeAttribute("data-surface-scroll-anchor");
			else element.setAttribute("data-surface-scroll-anchor", priorScrollAnchor);
			if (priorScrollTarget === null) element.removeAttribute("data-surface-scroll-target");
			else element.setAttribute("data-surface-scroll-target", priorScrollTarget);
			if (priorHoverAnchor === null) element.removeAttribute("data-surface-hover-anchor");
			else element.setAttribute("data-surface-hover-anchor", priorHoverAnchor);
			if (priorHoverSignal === null) element.removeAttribute("data-surface-hover-signal");
			else element.setAttribute("data-surface-hover-signal", priorHoverSignal);
			if (priorSurfaceActivatable === null) element.removeAttribute("data-surface-activatable");
			else element.setAttribute("data-surface-activatable", priorSurfaceActivatable);
			if (priorSurfaceExpandable === null) element.removeAttribute("data-surface-expandable");
			else element.setAttribute("data-surface-expandable", priorSurfaceExpandable);
			if (priorSurfaceExpanded === null) element.removeAttribute("data-surface-expanded");
			else element.setAttribute("data-surface-expanded", priorSurfaceExpanded);
			if (priorSurfaceDecalShape === null) element.removeAttribute("data-surface-decal-shape");
			else element.setAttribute("data-surface-decal-shape", priorSurfaceDecalShape);
		};
		didInstall = true;
		return true;
	};
	const scheduleInstallRetry = () => {
		queueMicrotask(() => {
			if (install()) return;
			const retry = () => {
				installRetryFrame = void 0;
				if (isDestroying || install()) return;
				installRetryCount += 1;
				if (installRetryCount < 30) installRetryFrame = requestAnimationFrame(retry);
			};
			installRetryFrame = requestAnimationFrame(retry);
		});
	};
	scheduleInstallRetry();
	return () => {
		isDestroying = true;
		if (installRetryFrame !== void 0) cancelAnimationFrame(installRetryFrame);
		queueMicrotask(cleanup);
	};
});
function setDatasetValue(element, key, value) {
	if (element.dataset[key] !== value) element.dataset[key] = value;
}
var backgroundDeselectSurfaces = new Set([
	"space",
	"layout",
	"canvas",
	"scene",
	"grid",
	"scroll",
	"flow",
	"outline",
	"frame",
	"pane",
	"plane"
]);
function pathContainsPreserveFocus(event) {
	return event.composedPath().some((entry) => entry instanceof Element && (entry.hasAttribute("data-surface-preserve-focus") || entry.hasAttribute("data-surface-key-scope") || entry.closest("[data-surface-preserve-focus]") !== null || entry.closest("[data-surface-key-scope]") !== null));
}
function isEnabledDataAttribute$1(value) {
	return value === "" || value === "true";
}
function shouldDeselectBareSurfaceBackground(hit, target) {
	if (target !== hit) return false;
	const override = hit.getAttribute("data-surface-background");
	if (override === "select") return false;
	if (override === "deselect") return true;
	const surface = hit.getAttribute("data-surface");
	return surface !== null && backgroundDeselectSurfaces.has(surface);
}
function editableElements(element) {
	return Array.from(element.querySelectorAll("[data-surface-inline-edit=\"true\"], input, textarea, select, [contenteditable]:not([contenteditable=false])")).filter((candidate, index, candidates) => candidate.isConnected && candidates.indexOf(candidate) === index);
}
function isEditorElement(element) {
	return Boolean(element?.matches("[data-surface-inline-edit=\"true\"], input, textarea, select, [contenteditable]:not([contenteditable=false])"));
}
function changeEditorForSurface(surface) {
	if (isEditorElement(surface)) return surface;
	const inlineEditors = editableElements(surface).filter((candidate) => candidate.getAttribute("data-surface-inline-edit") === "true");
	if (inlineEditors.length === 1) return inlineEditors[0];
	if (inlineEditors.length > 1) return null;
	const editors = editableElements(surface);
	return editors.length === 1 ? editors[0] : null;
}
function focusChangeEditor(surface) {
	const editor = changeEditorForSurface(surface);
	if (!editor) return false;
	editor.focus({ preventScroll: true });
	requestAnimationFrame(() => {
		if (!editor.isConnected) return;
		editor.focus({ preventScroll: true });
	});
	setTimeout(() => {
		if (!editor.isConnected) return;
		editor.focus({ preventScroll: true });
	}, 0);
	return true;
}
function shouldFocusRootOnPointerDown(root, target) {
	if (!target || !(target instanceof Element)) return false;
	if (!root.contains(target)) return false;
	if (isSurfaceTextEntryTarget(target)) return false;
	const interactive = target.closest("button, a[href], input, textarea, select, [contenteditable=true], [role=\"button\"], [role=\"menuitem\"], [role=\"option\"], [tabindex]");
	return interactive === null || interactive === root;
}
/** Predicate: should this ladder LEAVE ITSELF ALONE (not clear)
*  given a click on `target`?
*
*  Two yes-answers:
*
*    (a) Target is inside `root` AND walked up to a [data-ladder-id]
*        ancestor that's also inside root. The cell's own click
*        handler will / has set focus.
*
*    (b) Target is OUTSIDE `root` (typical for a popover portaled
*        to body / a canvas renderer / a top-layer dialog) but the
*        nearest [data-ladder-id] ancestor's id is registered in
*        OUR ladder. The lift belongs to us — the user is editing
*        a cell we own, just in a portaled lift surface. Clearing
*        here would close the editing context the user is actively
*        working in.
*
*  Detached targets (target.isConnected === false) also return true.
*  Rationale: a cell's pointerdown handler can call ladder.select(),
*  which mutates tracked state and (in some Glimmer setups) flushes
*  a re-render synchronously, which destroys the cell DOM, which
*  detaches the original click target. Treating detached targets as
*  ladder targets is the safer default: a real background click
*  never has a detached target at this point.
*
*  Returns false to mean "this was a background click — clear". */
function clickedOnLadderTarget(root, target, ladder) {
	if (!target || !(target instanceof Element)) return false;
	if (!target.isConnected) return true;
	if (target.closest("[data-surface-preserve-focus]")) return true;
	const hit = target.closest("[data-ladder-id]");
	if (!hit) return false;
	const id = hit.getAttribute("data-ladder-id");
	if (!id) return false;
	if (root.contains(hit)) return !shouldDeselectBareSurfaceBackground(hit, target);
	return ladder.getNode(id) !== null;
}
function surfaceElementFromTarget(root, target) {
	if (!target || !(target instanceof Element)) return null;
	const hit = target.closest("[data-ladder-id]");
	if (!hit || !root.contains(hit)) return null;
	return hit;
}
function magneticSelectionSurfaceFromTarget(root, target) {
	if (!target || !(target instanceof Element)) return null;
	if (!root.contains(target)) return null;
	if (surfaceTargetRetainsBrowserFocusAfterSelection(target)) return null;
	const hit = target.closest("[data-ladder-id][data-surface=\"cell\"], [data-ladder-id][data-surface-component=\"cell\"]");
	if (!hit || !root.contains(hit) || hit === target) return null;
	if (hit.getAttribute("data-surface-pointer") === "content-interactive") return null;
	return hit;
}
function focusMagneticSelectionSurface(surface) {
	const focusSurfaceElement = () => {
		if (!surface.isConnected) return;
		if (surface.ownerDocument.activeElement === surface) return;
		surface.focus({ preventScroll: true });
	};
	requestAnimationFrame(focusSurfaceElement);
	setTimeout(focusSurfaceElement, 0);
}
function surfaceIdFromTarget(root, target, ladder) {
	const id = surfaceElementFromTarget(root, target)?.getAttribute("data-ladder-id") ?? null;
	if (!id || !ladder.getNode(id)) return null;
	return id;
}
function surfaceElementById$1(root, id) {
	if (root.getAttribute("data-ladder-id") === id) return root;
	for (const element of root.querySelectorAll("[data-ladder-id]")) if (element.getAttribute("data-ladder-id") === id) return element;
	return null;
}
function runtimeHasSplitFocus(runtime) {
	if (!runtime) return false;
	const snapshot = runtime.snapshot();
	if (snapshot.input !== null) return true;
	const transfer = snapshot.transfer;
	if (!transfer) return false;
	if (transfer.kind === "copy" && !transfer.destination) return false;
	if (transfer.kind === "drag") return transfer.movedPastThreshold === true;
	return transfer.destination !== void 0;
}
function runtimeSelectionAlreadyOwnsFocus(runtime, id) {
	const snapshot = runtime.snapshot();
	if (snapshot.focusedId !== id) return false;
	if (runtime.node(id)?.policy?.selection === "none") return true;
	return Object.values(snapshot.selections).some((selection) => selection.headId === id && selection.ids.includes(id));
}
function runtimeHasActiveRangeHead(runtime, id) {
	return Object.values(runtime.snapshot().selections).some((selection) => selection.headId === id && selection.ids.length > 1);
}
function syncRuntimeToNavigationFocus(runtime, id) {
	if (!runtime || runtimeHasSplitFocus(runtime)) return;
	if (!runtime.node(id)) return;
	if (runtimeSelectionAlreadyOwnsFocus(runtime, id)) return;
	if (runtimeHasActiveRangeHead(runtime, id)) return;
	runtime.select(id);
}
function activeRuntimeFocusId(runtime) {
	if (!runtime || runtimeHasSplitFocus(runtime)) return null;
	return runtime.snapshot().focusedId;
}
function focusSurface(root, ladder, id, options = {}) {
	const { runtime, syncRuntime = true, ...focusOptions } = options;
	const target = surfaceElementById$1(root, id);
	if (!target) return false;
	if (syncRuntime) syncRuntimeToNavigationFocus(runtime, id);
	if (ladder.focusedId !== id) ladder.focusId(id);
	target.focus(focusOptions);
	return true;
}
function revealSurface(root, reveal) {
	if (!reveal || reveal.block === "none" && reveal.inline === "none") return;
	surfaceElementById$1(root, reveal.targetId)?.scrollIntoView({
		block: reveal.block === "none" ? "nearest" : reveal.block,
		inline: reveal.inline === "none" ? "nearest" : reveal.inline
	});
}
function targetModeForRoot$1(root) {
	const mode = root.getAttribute("data-surface-mode");
	const inspect = isEnabledDataAttribute$1(root.getAttribute("data-surface-inspect"));
	if (mode === "use" && inspect) return "inspect";
	if (mode === "use" || mode === "change" || mode === "inspect") return mode;
	return "use";
}
function runtimeModeForTargetMode$1(mode) {
	return mode === "debug" ? "debug" : mode;
}
function runtimeTraversalOptionsForRoot(root, mode) {
	return {
		mode: runtimeModeForTargetMode$1(mode),
		inspect: isEnabledDataAttribute$1(root.getAttribute("data-surface-inspect"))
	};
}
function runtimeTraversalIds(root, runtime, mode, view) {
	if (!runtime || view === "all") return null;
	return runtime.traversalSet(runtimeTraversalOptionsForRoot(root, mode)).ids;
}
function runtimeNavigationIdFor(root, runtime, id, mode, view) {
	if (!runtime || view === "all" || !id) return null;
	const ids = runtimeTraversalIds(root, runtime, mode, view);
	if (!ids) return null;
	const traversalIds = new Set(ids);
	let cursor = runtime.node(id);
	while (cursor) {
		if (traversalIds.has(cursor.id)) return cursor.id;
		if (cursor.parentId === null) return null;
		cursor = runtime.node(cursor.parentId);
	}
	return null;
}
function runtimeStepNavigationId(root, runtime, id, mode, view, delta) {
	const ids = runtimeTraversalIds(root, runtime, mode, view);
	if (!ids || ids.length === 0) return null;
	if (!id) return delta > 0 ? ids[0] : ids[ids.length - 1];
	const current = runtimeNavigationIdFor(root, runtime, id, mode, view);
	if (!current) return delta > 0 ? ids[0] : ids[ids.length - 1];
	const index = ids.indexOf(current);
	return index >= 0 ? ids[index + delta] ?? null : null;
}
function runtimeFirstChildNavigationId(root, runtime, id, mode, view) {
	const ids = runtimeTraversalIds(root, runtime, mode, view);
	if (!runtime || !ids) return null;
	const traversalIds = new Set(ids);
	const visit = (parentId) => {
		for (const node of runtime.registrations()) {
			if (node.parentId !== parentId) continue;
			if (traversalIds.has(node.id)) return node.id;
			const descendant = visit(node.id);
			if (descendant) return descendant;
		}
		return null;
	};
	return visit(id);
}
function runtimeParentNavigationId(root, runtime, id, mode, view) {
	if (!runtime || view === "all") return null;
	const ids = runtimeTraversalIds(root, runtime, mode, view);
	if (!ids) return null;
	const traversalIds = new Set(ids);
	let cursor = runtime.node(id);
	while (cursor?.parentId) {
		cursor = runtime.node(cursor.parentId);
		if (cursor && traversalIds.has(cursor.id)) return cursor.id;
	}
	return null;
}
function directionForArrowKey(key) {
	switch (key) {
		case "ArrowLeft": return "left";
		case "ArrowRight": return "right";
		case "ArrowUp": return "up";
		case "ArrowDown": return "down";
		default: throw new Error(`Unsupported arrow key: ${key}`);
	}
}
function changeRouteForRoot(root) {
	const route = root.getAttribute("data-surface-change-route");
	if (route === "inline" || route === "lifted" || route === "auto") return route;
	return "auto";
}
function activeLiftOwnsDomFocus(root) {
	const manager = liftManagerForSurfaceElement(root);
	if (!manager?.isOpen) return false;
	return manager.kind === "edit" || manager.kind === "tools";
}
function liftSourceIdForSurface(surface) {
	return surface.getAttribute("data-surface-lift-source");
}
function singleDescendantLiftSourceId(surface) {
	const ids = /* @__PURE__ */ new Set();
	for (const descendant of surface.querySelectorAll("[data-surface-lift-source]")) {
		const id = descendant.getAttribute("data-surface-lift-source");
		if (id) ids.add(id);
		if (ids.size > 1) return null;
	}
	return [...ids][0] ?? null;
}
function surfaceKindForElement(surface) {
	return surface.getAttribute("data-surface");
}
function openChangeLiftForSurface(root, surface) {
	const manager = liftManagerForSurfaceElement(root);
	if (!manager) return false;
	const sourceId = liftSourceIdForSurface(surface);
	if (sourceId) {
		if (manager.openForModeBySourceId(sourceId, "change", "change-activate")) return true;
	}
	const descendantSourceId = singleDescendantLiftSourceId(surface);
	if (!descendantSourceId) return false;
	const sourceOverride = {
		id: surface.getAttribute("data-ladder-id") ?? descendantSourceId,
		path: surface.getAttribute("data-surface-coordinate") ?? void 0,
		element: surface
	};
	const surfaceKind = surfaceKindForElement(surface);
	if (surfaceKind) sourceOverride.surface = surfaceKind;
	return manager.openForModeBySourceId(descendantSourceId, "change", "change-activate", sourceOverride);
}
function activateChangeTarget(root, surface) {
	const route = changeRouteForRoot(root);
	if (route !== "lifted" && focusChangeEditor(surface)) return true;
	if (route !== "inline" && openChangeLiftForSurface(root, surface)) return true;
	return route === "inline" ? focusChangeEditor(surface) : false;
}
function navigationViewForOptions(opts) {
	return opts.navigationView ?? "targets";
}
function navigationIdFor(ladder, id, mode, view) {
	if (view === "all") return id && ladder.getNode(id) ? id : null;
	return ladder.targetIdFor(id, mode);
}
function firstNavigationId(ladder, mode, view) {
	return view === "all" ? ladder.firstId() : ladder.firstTargetId(mode);
}
function lastNavigationId(ladder, mode, view) {
	return view === "all" ? ladder.lastId() : ladder.lastTargetId(mode);
}
function nextNavigationId(ladder, id, mode, view) {
	return view === "all" ? ladder.nextInTree(id) : ladder.nextTargetInTree(id, mode);
}
function prevNavigationId(ladder, id, mode, view) {
	return view === "all" ? ladder.prevInTree(id) : ladder.prevTargetInTree(id, mode);
}
function firstChildNavigationId(ladder, id, mode, view) {
	if (view === "targets") return ladder.firstChildTargetId(id, mode);
	return ladder.childrenOf(id)[0] ?? null;
}
function parentNavigationId(ladder, id, mode, view) {
	return view === "all" ? ladder.parentOf(id) : ladder.parentTargetId(id, mode);
}
function dispatchSurfaceCommand(surface, command, originalEvent) {
	const event = new CustomEvent(command, {
		bubbles: false,
		cancelable: true,
		detail: { originalEvent }
	});
	if (surface.dispatchEvent(event)) return false;
	originalEvent.preventDefault();
	originalEvent.stopPropagation();
	return true;
}
function scopedPatternElement(root, currentId, pattern) {
	return surfaceElementById$1(root, currentId)?.closest(`[data-surface-pattern="${pattern}"]`) ?? null;
}
function navigationIdsWithin(scope, ladder, mode, view) {
	const ids = [];
	for (const surface of scope.querySelectorAll("[data-ladder-id]")) {
		const id = surface.getAttribute("data-ladder-id");
		if (!id || ids.includes(id)) continue;
		if (view === "all" || ladder.isEligibleTarget(id, mode)) ids.push(id);
	}
	return ids;
}
function scopedNavigationId(root, ladder, currentId, mode, view, delta) {
	const scope = scopedPatternElement(root, currentId, "disclosure-tree");
	if (!scope) return null;
	const ids = navigationIdsWithin(scope, ladder, mode, view);
	const currentNavigationId = navigationIdFor(ladder, currentId, mode, view);
	if (!currentNavigationId) return ids[0] ?? null;
	const index = ids.indexOf(currentNavigationId);
	if (index < 0) return ids[0] ?? null;
	return ids[index + delta] ?? null;
}
function handleDisclosureTreeKey(root, ladder, runtime, currentId, mode, view, event) {
	const scope = scopedPatternElement(root, currentId, "disclosure-tree");
	if (!scope) return false;
	const surface = surfaceElementById$1(root, currentId);
	if (!surface || !scope.contains(surface)) return false;
	if (event.key === "Enter") return dispatchSurfaceCommand(surface, "surface-activate", event);
	if (event.key === "ArrowRight") {
		if (surface.getAttribute("data-surface-expandable") === "true" && surface.getAttribute("data-surface-expanded") !== "true" && dispatchSurfaceCommand(surface, "surface-expand", event)) return true;
	}
	if (event.key === "ArrowLeft") {
		if (surface.getAttribute("data-surface-expandable") === "true" && surface.getAttribute("data-surface-expanded") === "true" && dispatchSurfaceCommand(surface, "surface-collapse", event)) return true;
		const parentId = parentNavigationId(ladder, currentId, mode, view);
		const parentSurface = parentId ? surfaceElementById$1(root, parentId) : null;
		if (parentId && parentSurface && scope.contains(parentSurface)) {
			event.preventDefault();
			return focusSurface(root, ladder, parentId, { runtime });
		}
	}
	return false;
}
function closestActivatableSurface(root, surface) {
	const activatable = surface?.closest("[data-surface-activatable=\"true\"]") ?? null;
	return activatable && root.contains(activatable) ? activatable : null;
}
/**
* The modifier. Public API:
*
*   <main {{surfaceRoot this.ladder}}>
*
* The modifier accepts a single positional arg: the FocusLadder it
* coordinates. Hosts that want to skip one of the two effects
* (e.g., they own keyboard handling themselves) can pass options:
*
*   <main {{surfaceRoot this.ladder skipKeyboard=true}}>
*
* Both effects default ON.
*/
var surfaceRoot = modifier((element, [ladder], opts = {}) => {
	const didAddTabindex = element.getAttribute("tabindex") === null && !opts.skipKeyboard;
	if (didAddTabindex) element.setAttribute("tabindex", "0");
	const unregisterDomRoot = registerSurfaceDomRoot(element, ladder, opts.runtime);
	let syncFocusTimer;
	const shouldDeselectOnEscape = () => opts.skipEscapeDeselect !== true;
	const canRootOwnDeselectForEvent = (event) => {
		const target = event.target;
		if (!target || !(target instanceof Element)) return true;
		if (pathContainsPreserveFocus(event)) return false;
		if (activeLiftOwnsDomFocus(element)) return false;
		return true;
	};
	const clearSurfaceSelection = (reason, focusRoot, event) => {
		const runtimeSnapshot = opts.runtime?.snapshot();
		const runtimeHasInteraction = Boolean(runtimeSnapshot?.focusedId || runtimeSnapshot?.hoveredId || Object.keys(runtimeSnapshot?.selections ?? {}).length > 0);
		if (ladder.focusedId === null && ladder.hoveredId === null && !runtimeHasInteraction) return false;
		ladder.clear();
		ladder.hoverId(null);
		if (!runtimeHasSplitFocus(opts.runtime)) opts.runtime?.clearInteractionState();
		event?.preventDefault();
		event?.stopPropagation();
		element.dispatchEvent(new CustomEvent("surface-deselect", {
			bubbles: true,
			detail: { reason }
		}));
		if (focusRoot) element.focus({ preventScroll: true });
		return true;
	};
	let lastNavAt = 0;
	const markNav = () => {
		lastNavAt = Date.now();
	};
	const isNavRecent = () => Date.now() - lastNavAt < 2e3;
	const onFocusin = (event) => {
		if (event.target instanceof Element && event.target.closest("[data-surface-preserve-focus]")) return;
		const id = surfaceIdFromTarget(element, event.target, ladder);
		const mode = targetModeForRoot$1(element);
		const navigationView = navigationViewForOptions(opts);
		const runtime = opts.runtime;
		const nextId = runtimeNavigationIdFor(element, runtime, id, mode, navigationView) ?? navigationIdFor(ladder, id, mode, navigationView);
		if (nextId) {
			syncRuntimeToNavigationFocus(runtime, nextId);
			ladder.focusId(nextId);
		}
		const magneticSurface = magneticSelectionSurfaceFromTarget(element, event.target);
		if (magneticSurface && magneticSurface.getAttribute("data-ladder-id") === nextId) focusMagneticSelectionSurface(magneticSurface);
	};
	const handlePolymorphKey = (event) => {
		const runtime = opts.runtime;
		const rawCurrentId = surfaceIdFromTarget(element, event.target, ladder);
		const mode = targetModeForRoot$1(element);
		const navigationView = navigationViewForOptions(opts);
		const activeNavigationId = runtimeNavigationIdFor(element, runtime, rawCurrentId, mode, navigationView) ?? navigationIdFor(ladder, rawCurrentId, mode, navigationView);
		const currentId = runtimeNavigationIdFor(element, runtime, ladder.focusedId, mode, navigationView) ?? ladder.focusedId ?? activeNavigationId;
		if (event.key === "Escape") {
			if (isNavRecent()) {
				markNav();
				const parentId = currentId ? runtimeParentNavigationId(element, runtime, currentId, mode, navigationView) ?? parentNavigationId(ladder, currentId, mode, navigationView) : null;
				if (parentId && focusSurface(element, ladder, parentId, { runtime })) {
					event.preventDefault();
					event.stopPropagation();
					return true;
				}
			}
			return shouldDeselectOnEscape() ? clearSurfaceSelection("escape", true, event) : false;
		}
		if (event.key === "Tab") {
			markNav();
			let nextId = null;
			if (currentId) nextId = event.shiftKey ? runtimeStepNavigationId(element, runtime, currentId, mode, navigationView, -1) ?? prevNavigationId(ladder, currentId, mode, navigationView) : runtimeStepNavigationId(element, runtime, currentId, mode, navigationView, 1) ?? nextNavigationId(ladder, currentId, mode, navigationView);
			nextId ??= event.shiftKey ? runtimeStepNavigationId(element, runtime, null, mode, navigationView, -1) ?? lastNavigationId(ladder, mode, navigationView) : runtimeStepNavigationId(element, runtime, null, mode, navigationView, 1) ?? firstNavigationId(ladder, mode, navigationView);
			if (!nextId) return false;
			event.preventDefault();
			return focusSurface(element, ladder, nextId, { runtime });
		}
		if (!currentId) return false;
		if (handleDisclosureTreeKey(element, ladder, runtime, currentId, mode, navigationView, event)) {
			markNav();
			return true;
		}
		const currentSurface = surfaceElementById$1(element, currentId);
		if (mode === "change" && (event.key === "Enter" || event.key === "F2")) {
			const surface = currentSurface;
			if (surface && activateChangeTarget(element, surface)) {
				event.preventDefault();
				event.stopPropagation();
				markNav();
				return true;
			}
			if (event.key === "F2") return false;
		}
		if (event.key === "Enter") {
			const activationSurface = closestActivatableSurface(element, currentSurface);
			if (activationSurface && dispatchSurfaceCommand(activationSurface, "surface-activate", event)) {
				markNav();
				return true;
			}
			const firstChildId = firstChildNavigationId(ladder, currentId, mode, navigationView);
			const targetChildId = runtimeFirstChildNavigationId(element, runtime, currentId, mode, navigationView) ?? firstChildId;
			if (!targetChildId) return false;
			event.preventDefault();
			markNav();
			return focusSurface(element, ladder, targetChildId, { runtime });
		}
		if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
			if (runtime) {
				const result = runtime.dispatch({
					type: "move",
					direction: directionForArrowKey(event.key),
					shift: event.shiftKey,
					mode: runtimeModeForTargetMode$1(mode)
				});
				const targetId = result.intent?.type === "move-selection" ? result.intent.targetId : runtime.snapshot().focusedId;
				if (targetId && focusSurface(element, ladder, targetId, {
					runtime,
					syncRuntime: false
				})) {
					revealSurface(element, result.reveal);
					event.preventDefault();
					event.stopPropagation();
					markNav();
					return true;
				}
				if (result.handled || result.reason === "edge") {
					event.preventDefault();
					event.stopPropagation();
					markNav();
					return true;
				}
			}
			const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
			const nextId = (event.key === "ArrowUp" || event.key === "ArrowDown" ? scopedNavigationId(element, ladder, currentId, mode, navigationView, delta) : null) ?? (delta < 0 ? runtimeStepNavigationId(element, runtime, currentId, mode, navigationView, -1) ?? prevNavigationId(ladder, currentId, mode, navigationView) : runtimeStepNavigationId(element, runtime, currentId, mode, navigationView, 1) ?? nextNavigationId(ladder, currentId, mode, navigationView));
			if (!nextId) {
				event.preventDefault();
				event.stopPropagation();
				return true;
			}
			event.preventDefault();
			markNav();
			return focusSurface(element, ladder, nextId, { runtime });
		}
		return false;
	};
	const onKeydown = (event) => {
		if (opts.skipKeyboard) return;
		if (event.defaultPrevented) {
			opts.onKey?.(event, ladder, false);
			return;
		}
		if (pathContainsPreserveFocus(event)) {
			opts.onKey?.(event, ladder, false);
			return;
		}
		if (event.key === "Escape" && shouldDeselectOnEscape() && canRootOwnDeselectForEvent(event) && isSurfaceTextEntryTarget(event.target)) {
			const handled = clearSurfaceSelection("escape", true, event);
			opts.onKey?.(event, ladder, handled);
			return;
		}
		if (surfaceTargetOwnsKeyboardEvent(event)) return;
		if (opts.shouldRouteKey?.(event, ladder) === false) {
			opts.onKey?.(event, ladder, false);
			return;
		}
		const handled = handlePolymorphKey(event);
		opts.onKey?.(event, ladder, handled);
	};
	const onDocPointerDown = (event) => {
		if (opts.skipBackgroundClick) return;
		if (shouldFocusRootOnPointerDown(element, event.target)) element.focus({ preventScroll: true });
		if (clickedOnLadderTarget(element, event.target, ladder)) return;
		clearSurfaceSelection("background", event.target instanceof Node && element.contains(event.target));
	};
	const clearPendingFocusSync = () => {
		if (syncFocusTimer === void 0) return;
		clearTimeout(syncFocusTimer);
		syncFocusTimer = void 0;
	};
	const syncDomFocusToLadder = () => {
		const runtime = opts.runtime;
		if (runtimeHasSplitFocus(runtime) || activeLiftOwnsDomFocus(element) || surfaceTargetRetainsBrowserFocusAfterSelection(document.activeElement)) {
			clearPendingFocusSync();
			return;
		}
		const focusedId = activeRuntimeFocusId(runtime) ?? ladder.focusedId;
		if (!focusedId) {
			clearPendingFocusSync();
			return;
		}
		const magneticSurface = magneticSelectionSurfaceFromTarget(element, document.activeElement);
		if (magneticSurface && magneticSurface.getAttribute("data-ladder-id") === focusedId) {
			focusMagneticSelectionSurface(magneticSurface);
			return;
		}
		const activeId = surfaceIdFromTarget(element, document.activeElement, ladder);
		const mode = targetModeForRoot$1(element);
		const navigationView = navigationViewForOptions(opts);
		if ((runtimeNavigationIdFor(element, runtime, activeId, mode, navigationView) ?? navigationIdFor(ladder, activeId, mode, navigationView)) === focusedId) {
			clearPendingFocusSync();
			return;
		}
		clearPendingFocusSync();
		syncFocusTimer = setTimeout(() => {
			syncFocusTimer = void 0;
			if (runtimeHasSplitFocus(opts.runtime)) return;
			if (activeLiftOwnsDomFocus(element)) return;
			if (surfaceTargetRetainsBrowserFocusAfterSelection(document.activeElement)) return;
			const nextFocusedId = activeRuntimeFocusId(opts.runtime) ?? ladder.focusedId;
			if (!nextFocusedId) return;
			const nextActiveId = surfaceIdFromTarget(element, document.activeElement, ladder);
			if ((runtimeNavigationIdFor(element, opts.runtime, nextActiveId, targetModeForRoot$1(element), navigationViewForOptions(opts)) ?? navigationIdFor(ladder, nextActiveId, targetModeForRoot$1(element), navigationViewForOptions(opts))) === nextFocusedId) return;
			focusSurface(element, ladder, nextFocusedId, {
				runtime: opts.runtime,
				syncRuntime: false,
				preventScroll: true
			});
		}, 0);
	};
	const unsubscribeFocusSync = ladder.subscribe(syncDomFocusToLadder);
	const unsubscribeRuntimeFocusSync = opts.runtime?.subscribeSelection(syncDomFocusToLadder);
	element.addEventListener("keydown", onKeydown);
	element.addEventListener("focusin", onFocusin);
	document.addEventListener("pointerdown", onDocPointerDown, true);
	return () => {
		element.removeEventListener("keydown", onKeydown);
		element.removeEventListener("focusin", onFocusin);
		document.removeEventListener("pointerdown", onDocPointerDown, true);
		unsubscribeFocusSync();
		unsubscribeRuntimeFocusSync?.();
		if (syncFocusTimer !== void 0) clearTimeout(syncFocusTimer);
		unregisterDomRoot();
		if (didAddTabindex) element.removeAttribute("tabindex");
	};
});
var CommitInlineEditEvent = "boxel-surface:inline-edit-commit";
var InlineEditTextDisplayAttribute = "data-surface-inline-text-display";
function commitInlineEdits(root = document) {
	for (const element of root.querySelectorAll("[data-surface-inline-edit=\"true\"]")) element.dispatchEvent(new Event(CommitInlineEditEvent));
}
function restoreAttribute(element, name, value) {
	if (value === null) element.removeAttribute(name);
	else element.setAttribute(name, value);
}
function surfaceModeForElement(element) {
	return element.closest("[data-surface-mode]")?.getAttribute("data-surface-mode") ?? "inspect";
}
function changeRouteForElement(element) {
	return element.closest("[data-surface-change-route]")?.getAttribute("data-surface-change-route") ?? "auto";
}
function shouldActivateInlineEdit(element, opts) {
	if (!opts.enabled) return false;
	if (opts.activation !== "change-inline") return true;
	return surfaceModeForElement(element) === "change" && changeRouteForElement(element) !== "lifted";
}
var surfaceInlineEdit = modifier((element, _, opts = {}) => {
	const syncTextDisplay = () => {
		if (element.getAttribute(InlineEditTextDisplayAttribute) === "true" && opts.value !== void 0 && document.activeElement !== element && element.textContent !== opts.value) element.textContent = opts.value;
	};
	if (!opts.enabled) {
		syncTextDisplay();
		if (element.getAttribute("data-surface-inline-edit") === "true") {
			element.removeAttribute("contenteditable");
			element.removeAttribute("role");
			element.removeAttribute("aria-label");
			element.removeAttribute("aria-multiline");
			element.removeAttribute("spellcheck");
			element.removeAttribute("data-surface-inline-edit");
			element.removeAttribute("data-surface-inline-multiline");
			element.removeAttribute("data-surface-inline-dirty");
		}
		return;
	}
	const priorContentEditable = element.getAttribute("contenteditable");
	const priorRole = element.getAttribute("role");
	const priorAriaLabel = element.getAttribute("aria-label");
	const priorAriaMultiline = element.getAttribute("aria-multiline");
	const priorSpellcheck = element.getAttribute("spellcheck");
	const priorInlineEdit = element.getAttribute("data-surface-inline-edit");
	const priorInlineMultiline = element.getAttribute("data-surface-inline-multiline");
	const previousInlineEdit = priorInlineEdit === "true";
	let isActive = false;
	const activate = () => {
		if (isActive) return;
		element.setAttribute("contenteditable", "plaintext-only");
		element.setAttribute("role", "textbox");
		element.setAttribute("spellcheck", "false");
		element.setAttribute("data-surface-inline-edit", "true");
		element.setAttribute(InlineEditTextDisplayAttribute, "true");
		if (opts.label) element.setAttribute("aria-label", opts.label);
		if (opts.multiline) {
			element.setAttribute("aria-multiline", "true");
			element.setAttribute("data-surface-inline-multiline", "true");
		} else {
			element.removeAttribute("aria-multiline");
			element.removeAttribute("data-surface-inline-multiline");
		}
		isActive = true;
	};
	const deactivate = () => {
		if (!isActive && element.getAttribute("data-surface-inline-edit") !== "true") {
			syncTextDisplay();
			return;
		}
		restoreAttribute(element, "contenteditable", previousInlineEdit ? null : priorContentEditable);
		restoreAttribute(element, "role", previousInlineEdit ? null : priorRole);
		restoreAttribute(element, "aria-label", previousInlineEdit ? null : priorAriaLabel);
		restoreAttribute(element, "aria-multiline", previousInlineEdit ? null : priorAriaMultiline);
		restoreAttribute(element, "spellcheck", previousInlineEdit ? null : priorSpellcheck);
		restoreAttribute(element, "data-surface-inline-edit", previousInlineEdit ? null : priorInlineEdit);
		restoreAttribute(element, "data-surface-inline-multiline", previousInlineEdit ? null : priorInlineMultiline);
		element.removeAttribute("data-surface-inline-dirty");
		isActive = false;
		syncTextDisplay();
	};
	let lastCommittedValue = opts.value;
	const commit = (event) => {
		const value = element.textContent ?? "";
		const isDirty = element.getAttribute("data-surface-inline-dirty") === "true";
		if (value === lastCommittedValue) {
			element.removeAttribute("data-surface-inline-dirty");
			return;
		}
		if (!isDirty) return;
		lastCommittedValue = value;
		element.removeAttribute("data-surface-inline-dirty");
		opts.onInput?.(value, event);
	};
	const onInput = (event) => {
		const value = element.textContent ?? "";
		lastCommittedValue = value;
		element.setAttribute("data-surface-inline-dirty", "true");
		opts.onInput?.(value, event);
	};
	const onKeydown = (event) => {
		if (!opts.multiline && event.key === "Enter") {
			event.preventDefault();
			commit(event);
			element.blur();
		}
	};
	const onCommitRequest = (event) => {
		commit(event);
		element.blur();
	};
	const sync = () => {
		if (shouldActivateInlineEdit(element, opts)) activate();
		else deactivate();
	};
	element.addEventListener("input", onInput);
	element.addEventListener("blur", commit);
	element.addEventListener("keydown", onKeydown);
	element.addEventListener(CommitInlineEditEvent, onCommitRequest);
	sync();
	const modeRoot = element.closest("[data-surface-mode]");
	const routeRoot = element.closest("[data-surface-change-route]");
	const observer = new MutationObserver(sync);
	if (modeRoot && routeRoot === modeRoot) observer.observe(modeRoot, {
		attributes: true,
		attributeFilter: ["data-surface-mode", "data-surface-change-route"]
	});
	else {
		if (modeRoot) observer.observe(modeRoot, {
			attributes: true,
			attributeFilter: ["data-surface-mode"]
		});
		if (routeRoot) observer.observe(routeRoot, {
			attributes: true,
			attributeFilter: ["data-surface-change-route"]
		});
	}
	return () => {
		observer.disconnect();
		element.removeEventListener("input", onInput);
		element.removeEventListener("blur", commit);
		element.removeEventListener("keydown", onKeydown);
		element.removeEventListener(CommitInlineEditEvent, onCommitRequest);
		deactivate();
	};
});
var surfaceScopeRelay = modifier((element, positional, options = {}) => {
	const relay = options.relay ?? positional[0] ?? createSurfaceScopeRelay();
	relay.adopt(surfaceScopeAttributesForTree(element));
	relay.stamp(element);
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) for (const node of mutation.addedNodes) if (node instanceof Element) relay.stamp(node);
	});
	observer.observe(element, {
		childList: true,
		subtree: true
	});
	return () => observer.disconnect();
});
var StyleId = "boxel-surface-coordinate-debugger-styles";
function ensureStyles(document) {
	if (document.getElementById(StyleId)) return;
	const style = document.createElement("style");
	style.id = StyleId;
	style.textContent = `
    .boxel-surface-coordinate-debugger {
      --surface-debug-accent: #5645d4;
      --surface-debug-hover: #0f766e;
      position: fixed;
      right: var(--boxel-surface-coordinate-debugger-right, 16px);
      top: var(--boxel-surface-coordinate-debugger-top, 16px);
      z-index: 100000;
      color: #111827;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 11px;
      line-height: 1.35;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .boxel-surface-coordinate-debugger__toggle,
    .boxel-surface-coordinate-debugger__row {
      pointer-events: auto;
      font: inherit;
    }

    .boxel-surface-coordinate-debugger__toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      padding: 6px 10px;
      border: 1px solid rgba(17, 24, 39, 0.18);
      border-radius: 7px;
      background: rgba(255, 255, 255, 0.94);
      color: #111827;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.16);
      cursor: pointer;
    }

    .boxel-surface-coordinate-debugger__panel {
      width: min(620px, calc(100vw - 32px));
      max-height: calc(100vh - var(--boxel-surface-coordinate-debugger-top, 16px) - 32px);
      margin-top: 8px;
      overflow: hidden;
      border: 1px solid rgba(17, 24, 39, 0.16);
      border-radius: 9px;
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 18px 48px rgba(15, 23, 42, 0.22);
      pointer-events: auto;
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
    }

    .boxel-surface-coordinate-debugger__panel[hidden] {
      display: none;
    }

    .boxel-surface-coordinate-debugger__header {
      display: grid;
      gap: 4px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(17, 24, 39, 0.1);
      background: #fafaf9;
      flex: 0 0 auto;
    }

    .boxel-surface-coordinate-debugger__title {
      font-weight: 700;
      font-size: 12px;
    }

    .boxel-surface-coordinate-debugger__stat {
      display: grid;
      grid-template-columns: 66px minmax(0, 1fr);
      gap: 8px;
      color: #4b5563;
      align-items: start;
    }

    .boxel-surface-coordinate-debugger__stat strong {
      color: #111827;
      font-weight: 700;
    }

    .boxel-surface-coordinate-debugger__value {
      min-width: 0;
      overflow-wrap: anywhere;
      white-space: normal;
    }

    .boxel-surface-coordinate-debugger__tree {
      min-height: 0;
      flex: 1 1 auto;
      overflow: auto;
      padding: 6px;
      overscroll-behavior: contain;
    }

    .boxel-surface-coordinate-debugger__row {
      width: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: start;
      padding-top: 4px;
      padding-bottom: 4px;
      border: 0;
      border-radius: 5px;
      background: transparent;
      color: #111827;
      text-align: left;
      cursor: pointer;
    }

    .boxel-surface-coordinate-debugger__row:hover {
      background: rgba(86, 69, 212, 0.08);
    }

    .boxel-surface-coordinate-debugger__row[data-focus-path='true'] {
      background: rgba(86, 69, 212, 0.05);
    }

    .boxel-surface-coordinate-debugger__row[data-selected='true'] {
      background: rgba(86, 69, 212, 0.14);
      color: #24185f;
    }

    .boxel-surface-coordinate-debugger__row[data-hovered='true'] {
      box-shadow: inset 0 0 0 1px rgba(0, 117, 222, 0.36);
    }

    .boxel-surface-coordinate-debugger__row[data-editing='true'] {
      background: rgba(245, 215, 94, 0.4);
      box-shadow: inset 0 0 0 1px rgba(221, 91, 0, 0.3);
    }

    .boxel-surface-coordinate-debugger__coordinate {
      min-width: 0;
      overflow-wrap: anywhere;
      white-space: normal;
    }

    .boxel-surface-coordinate-debugger__surface {
      color: #6b7280;
      font-weight: 700;
    }

    .boxel-surface-coordinate-debugger__badge {
      color: #6b7280;
      font-size: 10px;
      white-space: nowrap;
      padding-top: 1px;
    }

    .boxel-surface-coordinate-decal {
      position: fixed;
      pointer-events: none;
      box-sizing: border-box;
      border: 2px solid transparent;
      border-radius: 5px;
      z-index: 99990;
      transform: translateZ(0);
    }

    .boxel-surface-coordinate-decal[hidden] {
      display: none;
    }

    .boxel-surface-coordinate-decal--selected {
      background: rgba(86, 69, 212, 0.055);
      box-shadow:
        inset 0 0 0 2px rgba(86, 69, 212, 0.58),
        0 0 0 1px rgba(255, 255, 255, 0.74),
        0 8px 22px rgba(86, 69, 212, 0.16);
    }

    .boxel-surface-coordinate-decal--hovered {
      border-color: rgba(13, 148, 136, 0.92);
      background: rgba(20, 184, 166, 0.075);
      box-shadow:
        0 0 0 1px rgba(240, 253, 250, 0.95),
        0 0 0 6px rgba(20, 184, 166, 0.2),
        0 12px 30px rgba(15, 118, 110, 0.24);
    }

    .boxel-surface-coordinate-decal--editing {
      background: rgba(245, 215, 94, 0.18);
      box-shadow:
        inset 0 0 0 2px rgba(221, 91, 0, 0.58),
        0 0 0 1px rgba(255, 255, 255, 0.74),
        0 8px 22px rgba(221, 91, 0, 0.14);
    }
  `;
	document.head.append(style);
}
function surfaceElementById(root, id) {
	if (!id) return null;
	if (root.getAttribute("data-ladder-id") === id) return root;
	for (const element of root.querySelectorAll("[data-ladder-id]")) if (element.getAttribute("data-ladder-id") === id) return element;
	return null;
}
function coordinateFor(node) {
	return node?.focusKey ?? node?.id ?? "none";
}
function isEnabledDataAttribute(value) {
	return value === "" || value === "true";
}
function targetModeForRoot(root) {
	const mode = root.getAttribute("data-surface-mode");
	const inspect = isEnabledDataAttribute(root.getAttribute("data-surface-inspect"));
	if (mode === "use" && inspect) return "inspect";
	if (mode === "use" || mode === "change" || mode === "inspect") return mode;
	return "inspect";
}
function runtimeModeForTargetMode(mode) {
	return mode === "debug" ? "debug" : mode;
}
function text(value) {
	return document.createTextNode(value);
}
function appendStat(parent, label, value) {
	const row = document.createElement("div");
	row.className = "boxel-surface-coordinate-debugger__stat";
	const strong = document.createElement("strong");
	strong.textContent = label;
	const content = document.createElement("span");
	content.className = "boxel-surface-coordinate-debugger__value";
	content.textContent = value || "none";
	content.title = value || "none";
	row.append(strong, content);
	parent.append(row);
}
function applyDecal(decal, root, id) {
	const target = surfaceElementById(root, id);
	if (!target || !target.isConnected) {
		decal.hidden = true;
		decal.removeAttribute("data-surface-coordinate-decal-id");
		decal.removeAttribute("data-surface-coordinate");
		return;
	}
	const rect = target.getBoundingClientRect();
	if (rect.width <= 0 || rect.height <= 0) {
		decal.hidden = true;
		decal.removeAttribute("data-surface-coordinate-decal-id");
		decal.removeAttribute("data-surface-coordinate");
		return;
	}
	decal.hidden = false;
	decal.setAttribute("data-surface-coordinate-decal-id", id ?? "");
	decal.setAttribute("data-surface-coordinate", target.getAttribute("data-surface-coordinate") ?? "");
	decal.style.left = `${Math.round(rect.left)}px`;
	decal.style.top = `${Math.round(rect.top)}px`;
	decal.style.width = `${Math.round(rect.width)}px`;
	decal.style.height = `${Math.round(rect.height)}px`;
}
var surfaceCoordinateDebugger = modifier((element, [ladder], opts = {}) => {
	if (!ladder) return;
	const showPanel = opts.enabled ?? false;
	const showDecals = opts.decals ?? true;
	if (!showPanel && !showDecals) return;
	ensureStyles(document);
	let open = opts.open ?? false;
	let frame;
	let disposed = false;
	const host = showPanel ? document.createElement("div") : void 0;
	if (host) {
		host.className = "boxel-surface-coordinate-debugger";
		host.setAttribute("data-surface-preserve-focus", "");
	}
	const toggle = showPanel ? document.createElement("button") : void 0;
	if (toggle) {
		toggle.type = "button";
		toggle.className = "boxel-surface-coordinate-debugger__toggle";
	}
	const panel = showPanel ? document.createElement("section") : void 0;
	if (panel) {
		panel.className = "boxel-surface-coordinate-debugger__panel";
		panel.hidden = !open;
	}
	const selectedDecal = showDecals ? document.createElement("div") : void 0;
	if (selectedDecal) {
		selectedDecal.className = "boxel-surface-coordinate-decal boxel-surface-coordinate-decal--selected";
		selectedDecal.setAttribute("data-surface-coordinate-decal", "selected");
	}
	const hoveredDecal = showDecals ? document.createElement("div") : void 0;
	if (hoveredDecal) {
		hoveredDecal.className = "boxel-surface-coordinate-decal boxel-surface-coordinate-decal--hovered";
		hoveredDecal.setAttribute("data-surface-coordinate-decal", "hovered");
	}
	const editingDecal = showDecals ? document.createElement("div") : void 0;
	if (editingDecal) {
		editingDecal.className = "boxel-surface-coordinate-decal boxel-surface-coordinate-decal--editing";
		editingDecal.setAttribute("data-surface-coordinate-decal", "editing");
	}
	if (host && toggle && panel) {
		host.append(toggle, panel);
		document.body.append(host);
	}
	if (selectedDecal && hoveredDecal && editingDecal) document.body.append(selectedDecal, hoveredDecal, editingDecal);
	const focusSurface = (id) => {
		ladder.focusId(id);
		const target = surfaceElementById(element, id);
		target?.scrollIntoView({
			block: "nearest",
			inline: "nearest"
		});
		target?.focus({ preventScroll: true });
	};
	const renderTree = (tree) => {
		const treeElement = document.createElement("div");
		treeElement.className = "boxel-surface-coordinate-debugger__tree";
		for (const node of tree) {
			const isEditing = surfaceElementById(element, node.id)?.getAttribute("data-surface-editing") === "true";
			const row = document.createElement("button");
			row.type = "button";
			row.className = "boxel-surface-coordinate-debugger__row";
			row.style.paddingLeft = `${8 + node.depth * 14}px`;
			row.setAttribute("data-selected", String(node.selected || node.focused));
			row.setAttribute("data-hovered", String(node.hovered));
			row.setAttribute("data-editing", String(isEditing));
			row.setAttribute("data-focus-path", String(node.onFocusPath));
			row.title = node.id;
			const coordinate = document.createElement("span");
			coordinate.className = "boxel-surface-coordinate-debugger__coordinate";
			const surface = document.createElement("span");
			surface.className = "boxel-surface-coordinate-debugger__surface";
			surface.textContent = node.surface;
			coordinate.append(surface, text(" "), text(coordinateFor(node)));
			const badges = document.createElement("span");
			badges.className = "boxel-surface-coordinate-debugger__badge";
			badges.textContent = [
				node.target ?? "",
				node.targetScope ? `scope:${node.targetScope}` : "",
				node.focused ? "focus" : "",
				node.selected ? "select" : "",
				node.hovered ? "hover" : "",
				isEditing ? "edit" : ""
			].filter(Boolean).join(" ");
			row.append(coordinate, badges);
			row.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				focusSurface(node.id);
			});
			treeElement.append(row);
		}
		return treeElement;
	};
	const render = () => {
		if (disposed) return;
		frame = void 0;
		const runtime = opts.runtime;
		const targetMode = targetModeForRoot(element);
		const projection = runtime?.projection({
			mode: runtimeModeForTargetMode(targetMode),
			inspect: isEnabledDataAttribute(element.getAttribute("data-surface-inspect"))
		});
		const allTree = ladder.treeSnapshot();
		const view = opts.view ?? "all";
		const traversalIds = projection ? new Set(projection.traversal.ids) : void 0;
		const tree = view === "targets" ? allTree.filter((node) => traversalIds ? traversalIds.has(node.id) : ladder.isEligibleTarget(node.id, targetMode)) : allTree;
		const focused = ladder.focusedId ? ladder.getNode(ladder.focusedId) : null;
		const hovered = ladder.hoveredId ? ladder.getNode(ladder.hoveredId) : null;
		const selectedIds = ladder.selectedIds();
		const primary = projection?.visualPrimary;
		const selectedId = primary?.sourceId ?? primary?.id ?? ladder.focusedId ?? selectedIds[selectedIds.length - 1] ?? null;
		const hoveredId = projection?.visualDecals.find((decal) => decal.kind === "inspect" || decal.kind === "hover")?.ids[0] ?? ladder.hoveredId;
		const editingId = (primary?.kind === "input" ? primary.sourceId ?? primary.id : void 0) ?? allTree.find((node) => surfaceElementById(element, node.id)?.getAttribute("data-surface-editing") === "true")?.id ?? null;
		if (showPanel && toggle && panel) {
			toggle.textContent = open ? "Coordinates - hide" : "Coordinates";
			toggle.setAttribute("aria-expanded", String(open));
			panel.hidden = !open;
			const header = document.createElement("div");
			header.className = "boxel-surface-coordinate-debugger__header";
			const title = document.createElement("div");
			title.className = "boxel-surface-coordinate-debugger__title";
			title.textContent = view === "targets" ? `Surface targets (${tree.length}/${allTree.length})` : `Surface coordinates (${allTree.length})`;
			header.append(title);
			appendStat(header, "view", view === "targets" ? `targeting:${targetMode}` : "all");
			appendStat(header, "runtime", runtime ? "projection" : "ladder");
			appendStat(header, "focus", focused ? focused.focusKey ?? focused.id : "none");
			appendStat(header, "hover", hovered ? hovered.focusKey ?? hovered.id : "none");
			appendStat(header, "select", selectedIds.join(", ") || "none");
			appendStat(header, "edit", editingId ?? "none");
			appendStat(header, "path", ladder.focusPath.join(" -> ") || "none");
			panel.replaceChildren(header, renderTree(tree));
		}
		if (selectedDecal && hoveredDecal && editingDecal) {
			applyDecal(selectedDecal, element, selectedId);
			applyDecal(hoveredDecal, element, hoveredId);
			applyDecal(editingDecal, element, editingId);
		}
	};
	const schedule = () => {
		if (frame !== void 0) return;
		frame = requestAnimationFrame(render);
	};
	const unsubscribe = ladder.subscribe(schedule);
	const unsubscribeRuntimeTopology = opts.runtime?.subscribeTopology(schedule);
	const unsubscribeRuntimeViewport = opts.runtime?.subscribeViewport(schedule);
	const observer = new MutationObserver(schedule);
	observer.observe(element, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: [
			"data-ladder-id",
			"data-surface-coordinate",
			"data-surface-coordinate-ready",
			"data-surface-editing",
			"class",
			"style"
		]
	});
	const onToggle = (event) => {
		event.preventDefault();
		event.stopPropagation();
		open = !open;
		render();
	};
	const onViewportChange = () => schedule();
	toggle?.addEventListener("click", onToggle);
	window.addEventListener("resize", onViewportChange);
	window.addEventListener("scroll", onViewportChange, true);
	render();
	return () => {
		disposed = true;
		if (frame !== void 0) cancelAnimationFrame(frame);
		unsubscribe();
		unsubscribeRuntimeTopology?.();
		unsubscribeRuntimeViewport?.();
		observer.disconnect();
		toggle?.removeEventListener("click", onToggle);
		window.removeEventListener("resize", onViewportChange);
		window.removeEventListener("scroll", onViewportChange, true);
		selectedDecal?.remove();
		hoveredDecal?.remove();
		editingDecal?.remove();
		host?.remove();
	};
});
//#endregion
export { surfaceTargetOwnsPointerEvent as A, surfaceNode as C, surfaceScopeAttributesForTree as D, surfaceScopeAttributesForElement as E, surfaceScopeRelay as O, surfaceInlineEdit as S, surfaceRuntimeForElement as T, stampSurfaceScope as _, _initializerDefineProperty as a, surfaceElementOwnsKeyboardEvent as b, isSurfaceScopeAttribute as c, liftManagerForSurfaceElement as d, mergeSurfaceScopeAttributes as f, registerSurfaceLiftDomRoot as g, registerSurfaceDomRoot as h, _defineProperty as i, surfaceTargetRetainsBrowserFocusAfterSelection as j, surfaceTargetOwnsKeyboardEvent as k, isSurfaceTextEntryTarget as l, registerSurfaceDomNode as m, SurfaceScopeRelay as n, commitInlineEdits as o, parentSurfaceIdForElement as p, _applyDecoratedDescriptor as r, createSurfaceScopeRelay as s, SurfaceScopeContextName as t, ladderForSurfaceElement as u, surfaceCoordinateDebugger as v, surfaceRoot as w, surfaceElementsForIds as x, surfaceElementForId as y };
