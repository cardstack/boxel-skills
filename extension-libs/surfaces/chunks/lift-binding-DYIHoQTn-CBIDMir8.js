import { A as surfaceTargetOwnsPointerEvent, T as surfaceRuntimeForElement, b as surfaceElementOwnsKeyboardEvent, k as surfaceTargetOwnsKeyboardEvent, l as isSurfaceTextEntryTarget, y as surfaceElementForId } from "./coordinate-debugger-DMx2ibI_-DPMsHvI1.js";
import { modifier } from "ember-modifier";
//#region dist/lift-binding-DYIHoQTn.js
function finiteNumber(value) {
	if (value === null || value === void 0 || value === "") return null;
	const parsed = typeof value === "number" ? value : Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}
function trimNumericString(value) {
	return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(8)));
}
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
var surfaceContinuousInput = modifier((element, _positional, opts) => {
	let previewFrame = null;
	let commitFrame = null;
	let latestInputEvent = null;
	let activeRangePointer = null;
	const priorKeyboardOwner = element.getAttribute("data-surface-keyboard-owner");
	if (opts.keyboardStep !== void 0) element.setAttribute("data-surface-keyboard-owner", "value");
	const stopSurfacePointerRouting = (event) => {
		event.stopPropagation();
	};
	const cancelPreview = () => {
		if (previewFrame !== null) cancelAnimationFrame(previewFrame);
		previewFrame = null;
	};
	const cancelCommit = () => {
		if (commitFrame !== null) cancelAnimationFrame(commitFrame);
		commitFrame = null;
	};
	const flushPreview = () => {
		previewFrame = null;
		if (!latestInputEvent) return;
		opts.onPreview?.(element.value, latestInputEvent, element);
	};
	const flushCommit = () => {
		commitFrame = null;
		if (!latestInputEvent) return;
		opts.onCommit?.(element.value, latestInputEvent, element);
	};
	const schedulePreview = (event) => {
		latestInputEvent = event;
		if (opts.onPreview && previewFrame === null) previewFrame = requestAnimationFrame(flushPreview);
	};
	const scheduleFrameCommit = (event) => {
		latestInputEvent = event;
		if (opts.commitMode === "frame" && opts.onCommit && commitFrame === null) commitFrame = requestAnimationFrame(flushCommit);
	};
	const setRangeValueFromPointer = (event) => {
		const rect = element.getBoundingClientRect();
		if (rect.width <= 0) return;
		const min = finiteNumber(opts.keyboardMin) ?? finiteNumber(element.min) ?? 0;
		const max = finiteNumber(opts.keyboardMax) ?? finiteNumber(element.max) ?? 100;
		const step = element.step === "any" ? null : finiteNumber(element.step) ?? finiteNumber(element.getAttribute("step")) ?? 1;
		const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
		let next = min + (max - min) * ratio;
		if (step !== null && step > 0) next = Math.round((next - min) / step) * step + min;
		element.value = trimNumericString(clamp(next, min, max));
	};
	const beginRangePointer = (event) => {
		if (element.type !== "range" || event.button !== 0) return;
		activeRangePointer = event.pointerId;
		element.focus({ preventScroll: true });
		element.setPointerCapture?.(event.pointerId);
		event.preventDefault();
		event.stopPropagation();
		setRangeValueFromPointer(event);
		schedulePreview(event);
		scheduleFrameCommit(event);
	};
	const updateRangePointer = (event) => {
		if (activeRangePointer !== event.pointerId) return;
		event.preventDefault();
		event.stopPropagation();
		setRangeValueFromPointer(event);
		schedulePreview(event);
		scheduleFrameCommit(event);
	};
	const endRangePointer = (event) => {
		if (activeRangePointer !== event.pointerId) return;
		activeRangePointer = null;
		element.releasePointerCapture?.(event.pointerId);
		event.preventDefault();
		event.stopPropagation();
		setRangeValueFromPointer(event);
		latestInputEvent = event;
		cancelPreview();
		if (opts.onPreview) flushPreview();
		if (opts.commitMode !== "frame") {
			cancelCommit();
			opts.onCommit?.(element.value, event, element);
		}
	};
	const onInput = (event) => {
		schedulePreview(event);
		scheduleFrameCommit(event);
	};
	const onChange = (event) => {
		latestInputEvent = event;
		cancelPreview();
		if (opts.onPreview) flushPreview();
		if (opts.commitMode !== "frame") {
			cancelCommit();
			opts.onCommit?.(element.value, event, element);
		}
	};
	const onKeydown = (event) => {
		const step = opts.keyboardStep;
		if (step === void 0) return;
		const direction = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 0;
		if (direction === 0) return;
		const base = finiteNumber(element.value) ?? finiteNumber(element.getAttribute("value")) ?? 0;
		const amount = event.shiftKey ? opts.keyboardShiftStep ?? step * 10 : step;
		const min = finiteNumber(opts.keyboardMin) ?? finiteNumber(element.min);
		const max = finiteNumber(opts.keyboardMax) ?? finiteNumber(element.max);
		let next = base + amount * direction;
		if (min !== null) next = Math.max(min, next);
		if (max !== null) next = Math.min(max, next);
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		element.value = trimNumericString(next);
		latestInputEvent = event;
		opts.onPreview?.(element.value, event, element);
		opts.onCommit?.(element.value, event, element);
	};
	element.addEventListener("input", onInput);
	element.addEventListener("change", onChange);
	element.addEventListener("keydown", onKeydown);
	element.addEventListener("pointerdown", beginRangePointer, true);
	element.addEventListener("pointermove", updateRangePointer, true);
	element.addEventListener("pointerup", endRangePointer, true);
	element.addEventListener("pointercancel", endRangePointer, true);
	element.addEventListener("click", stopSurfacePointerRouting, true);
	element.addEventListener("dblclick", stopSurfacePointerRouting, true);
	return () => {
		element.removeEventListener("input", onInput);
		element.removeEventListener("change", onChange);
		element.removeEventListener("keydown", onKeydown);
		element.removeEventListener("pointerdown", beginRangePointer, true);
		element.removeEventListener("pointermove", updateRangePointer, true);
		element.removeEventListener("pointerup", endRangePointer, true);
		element.removeEventListener("pointercancel", endRangePointer, true);
		element.removeEventListener("click", stopSurfacePointerRouting, true);
		element.removeEventListener("dblclick", stopSurfacePointerRouting, true);
		if (priorKeyboardOwner === null) element.removeAttribute("data-surface-keyboard-owner");
		else element.setAttribute("data-surface-keyboard-owner", priorKeyboardOwner);
		cancelPreview();
		cancelCommit();
	};
});
var SURFACE_GEOMETRY_CHANGE_EVENT = "surface:geometrychange";
function dispatchSurfaceGeometryChange(element) {
	element.dispatchEvent(new CustomEvent(SURFACE_GEOMETRY_CHANGE_EVENT, {
		bubbles: true,
		composed: true
	}));
}
function restoreSurfaceGridSelection(id, options = {}) {
	const target = surfaceGridElementForId(id, options.root);
	const runtime = target ? surfaceRuntimeForElement(target) : void 0;
	if (!target || !runtime) return false;
	runtime.select(id, { restoreSource: options.restoreSource ?? true });
	if (options.focusDom) focusSurfaceGridCell(target, options.reveal ?? false);
	return runtimeOwnsSelection$1(runtime, id);
}
function commitSurfaceGridInput(sourceId, options = {}) {
	const target = surfaceGridElementForId(sourceId, options.root);
	const runtime = target ? surfaceRuntimeForElement(target) : void 0;
	if (!target || !runtime) return false;
	const input = runtime.snapshot().input;
	if (input && (input.sourceId === sourceId || input.targetId === sourceId || input.liftedTargetId === sourceId)) runtime.dispatch({
		type: "commitInput",
		trigger: options.trigger ?? "explicit",
		advance: options.advance ?? "none",
		restoreSource: options.restoreSource ?? true
	});
	return restoreSurfaceGridSelection(sourceId, {
		...options,
		restoreSource: true
	});
}
function cancelSurfaceGridInput(sourceId, options = {}) {
	const target = surfaceGridElementForId(sourceId, options.root);
	const runtime = target ? surfaceRuntimeForElement(target) : void 0;
	if (!target || !runtime) return false;
	const input = runtime.snapshot().input;
	if (input && (input.sourceId === sourceId || input.targetId === sourceId || input.liftedTargetId === sourceId)) runtime.cancel(options.trigger ?? "programmatic", { restoreSource: options.restoreSource ?? true });
	return restoreSurfaceGridSelection(sourceId, {
		...options,
		restoreSource: true
	});
}
function clearSurfaceGridSelection(root) {
	const rootElement = rootElementFor$1(root);
	const runtime = rootElement ? surfaceRuntimeForElement(rootElement) : void 0;
	if (!rootElement || !runtime) return false;
	rootElement.dataset["surfaceGridSelectionCleared"] = "true";
	runtime.clearInteractionState();
	releaseSurfaceGridDomFocus(rootElement);
	return true;
}
function releaseSurfaceGridDomFocus(root) {
	const rootElement = rootElementFor$1(root);
	const active = rootElement?.ownerDocument.activeElement;
	if (!rootElement || !(active instanceof HTMLElement)) return false;
	if (!rootElement.contains(active)) return false;
	const activeGridCell = active.closest("[data-surface-component=\"cell\"][role=\"gridcell\"], [role=\"gridcell\"]");
	if (!activeGridCell || !rootElement.contains(activeGridCell)) return false;
	if (surfaceTargetRetainsFocus$3(active, activeGridCell)) return false;
	active.blur();
	return rootElement.ownerDocument.activeElement !== active;
}
function surfaceGridElementForId(id, root) {
	const rootElement = rootElementFor$1(root);
	if (!rootElement) return null;
	return surfaceElementForId(rootElement, id) ?? rootElement.ownerDocument.getElementById(id);
}
function rootElementFor$1(root) {
	if (root && "nodeType" in root && root.nodeType === 1) return root;
	if (root && "documentElement" in root) return root.querySelector("[data-surface-grid-binding=\"active\"]") ?? root.documentElement;
	if (typeof document !== "undefined") return document.querySelector("[data-surface-grid-binding=\"active\"]") ?? document.documentElement;
	return null;
}
function focusSurfaceGridCell(cell, reveal) {
	if (!surfaceTargetRetainsFocus$3(cell.ownerDocument.activeElement, cell)) cell.focus({ preventScroll: true });
	if (reveal) cell.scrollIntoView({
		block: "nearest",
		inline: "nearest"
	});
}
function surfaceTargetRetainsFocus$3(target, selectedCell) {
	if (!target) return false;
	if (selectedCell?.contains(target) && isSurfaceTextEntryTarget(target)) return true;
	if (target.closest("[data-bx-lift]")) return true;
	const keyboardOwner = target.closest("[data-surface-keyboard-owner]");
	return Boolean(keyboardOwner && selectedCell?.contains(keyboardOwner));
}
function runtimeOwnsSelection$1(runtime, id) {
	const snapshot = runtime.snapshot();
	if (snapshot.focusedId !== id) return false;
	return Object.values(snapshot.selections).some((selection) => selection.headId === id && selection.ids.length === 1 && selection.ids[0] === id);
}
function createSurfaceDomBindingCache(revision = 0) {
	return {
		revision,
		elementLists: /* @__PURE__ */ new WeakMap(),
		rects: /* @__PURE__ */ new WeakMap()
	};
}
function cachedElementList(cache, owner, key, collect) {
	if (!cache) return collect();
	let lists = cache.elementLists.get(owner);
	if (!lists) {
		lists = /* @__PURE__ */ new Map();
		cache.elementLists.set(owner, lists);
	}
	const cached = lists.get(key);
	if (cached) return cached;
	const collected = collect();
	lists.set(key, collected);
	return collected;
}
function cachedRectForElement(element, cache) {
	const cached = cache?.rects.get(element);
	if (cached) return cached;
	const rect = element.getBoundingClientRect();
	cache?.rects.set(element, rect);
	return rect;
}
var DEFAULT_CELL_SELECTOR = "[data-surface-component=\"cell\"][role=\"gridcell\"], [role=\"gridcell\"]";
var DEFAULT_ROW_SELECTOR = "[data-surface-component=\"row\"][role=\"row\"], [role=\"row\"]";
var GRID_KEYS = new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown",
	"Tab",
	"Enter",
	"F2",
	"Escape",
	" ",
	"Spacebar"
]);
var surfaceGridBinding = modifier((element, _positional, options) => {
	const view = element.ownerDocument.defaultView ?? window;
	let frame = 0;
	let runtime;
	let unsubscribe;
	let retryCount = 0;
	let hasHydratedSelection = false;
	let localActiveCellId = null;
	let cache = createSurfaceDomBindingCache();
	const schedule = () => {
		if (frame !== 0) return;
		frame = view.requestAnimationFrame(paint);
	};
	const invalidate = () => {
		cache = createSurfaceDomBindingCache(cache.revision + 1);
	};
	const invalidateAndSchedule = () => {
		invalidate();
		schedule();
	};
	const syncRuntime = () => {
		const next = surfaceRuntimeForElement(element);
		if (next !== runtime) {
			unsubscribe?.();
			runtime = next;
			unsubscribe = runtime?.subscribeSelection(schedule);
		}
		return runtime;
	};
	const paint = () => {
		frame = 0;
		const active = options.active !== false;
		element.dataset["surfaceGridBinding"] = active ? "active" : "inactive";
		const currentRuntime = syncRuntime();
		if (!active) return;
		if (!currentRuntime) {
			if (retryCount < 120) {
				retryCount += 1;
				schedule();
			}
			return;
		}
		retryCount = 0;
		const projection = currentRuntime.projection({ mode: gridModeFor(element) });
		const runtimeActiveId = activeSelectionId$1(currentRuntime);
		let activeId = localActiveCellId ?? element.dataset["surfaceGridActiveId"] ?? runtimeActiveId;
		if (runtimeActiveId && !localActiveCellId && !element.dataset["surfaceGridActiveId"]) {
			delete element.dataset["surfaceGridSelectionCleared"];
			hasHydratedSelection = true;
			localActiveCellId = runtimeActiveId;
		}
		if (element.dataset["surfaceGridSelectionCleared"] === "true") {
			hasHydratedSelection = true;
			localActiveCellId = null;
			activeId = null;
		}
		if (!activeId && !hasHydratedSelection) {
			const seededCell = cells(element, options, cache).find((cell) => cell.dataset["selected"] === "true" || cell.classList.contains("is-selected") || cell.classList.contains("is-runtime-selected"));
			const seededId = seededCell ? surfaceIdFor$1(seededCell) : null;
			if (seededId) {
				currentRuntime.select(seededId, { restoreSource: true });
				localActiveCellId = seededId;
				activeId = seededId;
			}
			hasHydratedSelection = true;
		}
		let activeCell = activeId ? cellById(element, activeId, options, cache) : null;
		if (!activeCell) {
			activeId = runtimeActiveId;
			activeCell = activeId ? cellById(element, activeId, options, cache) : null;
		}
		const activePosition = activeCell ? selectionForCell(element, activeCell, options, cache) : null;
		for (const cell of cells(element, options, cache)) {
			const id = surfaceIdFor$1(cell);
			const projected = id ? projection.nodeMap.get(id) : void 0;
			const selected = Boolean(id && (projected?.selected || projected?.focused || id === activeId));
			cell.dataset["runtimeSelected"] = selected ? "true" : "false";
			cell.dataset["selected"] = selected ? "true" : "false";
			cell.classList.toggle("is-runtime-selected", selected);
			if (projected?.tabIndex === null) cell.removeAttribute("tabindex");
			else if (projected?.tabIndex !== void 0) cell.tabIndex = projected.tabIndex;
			else cell.tabIndex = selected ? 0 : -1;
		}
		for (const [rowIndex, row] of rows(element, options, cache).entries()) {
			const selected = activePosition?.rowIndex === rowIndex;
			row.dataset["runtimeSelectedRow"] = selected ? "true" : "false";
			row.classList.toggle("is-runtime-selected-row", selected);
		}
		for (const header of columnHeaders(element, cache)) {
			const selected = activePosition?.colKey !== void 0 && header.dataset["colKey"] === activePosition.colKey;
			header.dataset["runtimeSelectedCol"] = selected ? "true" : "false";
			header.classList.toggle("is-runtime-selected-col", selected);
		}
	};
	const selectCell = (cell, event, opts = {}) => {
		if (options.active === false) return false;
		const currentRuntime = syncRuntime();
		const id = surfaceIdFor$1(cell);
		if (!currentRuntime || !id) return false;
		delete element.dataset["surfaceGridSelectionCleared"];
		hasHydratedSelection = true;
		localActiveCellId = id;
		element.dataset["surfaceGridActiveId"] = id;
		currentRuntime.select(id, {
			range: opts.range,
			restoreSource: true
		});
		focusCell(cell, opts.reveal ?? true);
		const selection = selectionForCell(element, cell, options, cache);
		options.onSelect?.(selection, event);
		const syncLocalSelection = () => {
			if (element.dataset["surfaceGridActiveId"] !== id) return;
			const selectedCell = cellById(element, id, options) ?? cellAtPosition(element, selection, options) ?? cell;
			if (!element.contains(selectedCell)) return;
			paintLocalSelection(element, id, selectedCell, options);
			focusCell(selectedCell, opts.reveal ?? true);
		};
		syncLocalSelection();
		view.requestAnimationFrame(() => {
			syncLocalSelection();
			view.requestAnimationFrame(syncLocalSelection);
			view.setTimeout(syncLocalSelection, 0);
		});
		schedule();
		return true;
	};
	const clearSelection = (event) => {
		const currentRuntime = syncRuntime();
		if (!(currentRuntime ? activeSelectionId$1(currentRuntime) ?? localActiveCellId : localActiveCellId)) return false;
		element.dataset["surfaceGridSelectionCleared"] = "true";
		hasHydratedSelection = true;
		localActiveCellId = null;
		delete element.dataset["surfaceGridActiveId"];
		currentRuntime?.clearInteractionState();
		releaseSurfaceGridDomFocus(element);
		options.onClear?.(event);
		schedule();
		return true;
	};
	const activateCell = (cell, event) => {
		selectCell(cell, event, { reveal: true });
		const activeRuntime = syncRuntime();
		const id = surfaceIdFor$1(cell);
		if (activeRuntime && id && activeSelectionId$1(activeRuntime) === id) activeRuntime.dispatch({ type: "activate" });
		options.onActivate?.(selectionForCell(element, cell, options, cache), event);
	};
	const onClick = (event) => {
		if (options.active === false) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest("[data-bx-lift]")) return;
		if (surfaceTargetOwnsPointerEvent(target)) return;
		const cell = closestCell(element, target, options);
		if (!cell) return;
		if (target.closest("[data-surface-activate-cell]")) {
			activateCell(cell, event);
			return;
		}
		selectCell(cell, event, {
			range: event.shiftKey,
			reveal: false
		});
	};
	const onClickBoundary = (event) => {
		if (options.active === false) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (!element.contains(target)) return;
		if (target.closest("[data-bx-lift]")) return;
		event.stopPropagation();
	};
	const onDblClick = (event) => {
		if (options.active === false) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (surfaceTargetOwnsPointerEvent(target)) return;
		const cell = closestCell(element, target, options);
		if (!cell) return;
		activateCell(cell, event);
		event.stopPropagation();
	};
	const onKeydown = (event) => {
		if (options.active === false) return;
		if (!GRID_KEYS.has(event.key)) return;
		if (event.defaultPrevented) return;
		if (event.target instanceof Element && event.target.closest("[data-bx-lift]")) return;
		if (surfaceTargetOwnsKeyboardEvent(event) || surfaceElementOwnsKeyboardEvent(element.ownerDocument.activeElement, event.key)) return;
		const currentRuntime = syncRuntime();
		if (!currentRuntime) return;
		const current = activeCellElement(element, currentRuntime, options, cache, localActiveCellId ?? element.dataset["surfaceGridActiveId"] ?? null) ?? closestCell(element, element.ownerDocument.activeElement, options);
		if (!current && !isGridEntryKey(event.key)) return;
		if (event.key === "Escape") {
			if (clearSelection(event)) consume$1(event);
			return;
		}
		if (event.key === "Enter" || event.key === "F2") {
			const cell = current ?? cells(element, options, cache)[0];
			if (!cell) return;
			consume$1(event);
			activateCell(cell, event);
			return;
		}
		if ((event.key === " " || event.key === "Spacebar") && current) {
			const atom = current.querySelector("button[role=\"checkbox\"], button[role=\"switch\"], .ss-star, [data-surface-atom-editor]");
			if (atom) {
				consume$1(event);
				atom.click();
				selectCell(current, event, { reveal: false });
				return;
			}
		}
		const next = current ? nextCellForKey(element, current, event, options, cache) : cells(element, options, cache)[0] ?? null;
		if (!next) return;
		consume$1(event);
		selectCell(next, event, {
			range: event.shiftKey && event.key !== "Tab",
			reveal: true
		});
	};
	const mutationObserver = new MutationObserver(invalidateAndSchedule);
	mutationObserver.observe(element, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: [
			"data-ladder-id",
			"data-selected",
			"data-surface-component",
			"role",
			"data-surface-grid-selection-cleared"
		]
	});
	element.addEventListener("click", onClick, true);
	element.addEventListener("click", onClickBoundary);
	element.addEventListener("dblclick", onDblClick);
	element.addEventListener("keydown", onKeydown);
	view.addEventListener("keydown", onKeydown, true);
	syncRuntime();
	schedule();
	return () => {
		if (frame !== 0) view.cancelAnimationFrame(frame);
		unsubscribe?.();
		mutationObserver.disconnect();
		element.removeEventListener("click", onClick, true);
		element.removeEventListener("click", onClickBoundary);
		element.removeEventListener("dblclick", onDblClick);
		element.removeEventListener("keydown", onKeydown);
		view.removeEventListener("keydown", onKeydown, true);
	};
});
function consume$1(event) {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
}
function gridModeFor(element) {
	const mode = element.closest("[data-surface-mode]")?.getAttribute("data-surface-mode");
	return mode === "change" || mode === "inspect" ? mode : "use";
}
function isGridEntryKey(key) {
	return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight" || key === "Home" || key === "End" || key === "PageUp" || key === "PageDown" || key === "Tab";
}
function activeSelectionId$1(runtime) {
	const snapshot = runtime.snapshot();
	const activeScopeId = snapshot.activeScopeId;
	if (activeScopeId && snapshot.selections[activeScopeId]) return snapshot.selections[activeScopeId].headId;
	return snapshot.focusedId;
}
function activeCellElement(root, runtime, options, cache, fallbackId) {
	const fallbackCell = fallbackId ? cellById(root, fallbackId, options, cache) : null;
	if (fallbackCell) return fallbackCell;
	const activeId = activeSelectionId$1(runtime);
	return activeId ? cellById(root, activeId, options, cache) : null;
}
function cellById(root, id, options, cache) {
	return cells(root, options, cache).find((cell) => surfaceIdFor$1(cell) === id) ?? null;
}
function closestCell(root, target, options) {
	if (!target) return null;
	const selector = options.cellSelector ?? DEFAULT_CELL_SELECTOR;
	const cell = target.closest(selector);
	if (!cell || !root.contains(cell)) return null;
	if (cell.closest("[data-bx-lift]")) return null;
	return cell;
}
function cells(root, options, cache) {
	const selector = options.cellSelector ?? DEFAULT_CELL_SELECTOR;
	return cachedElementList(cache, root, `grid:cells:${selector}`, () => Array.from(root.querySelectorAll(selector)).filter((cell) => root.contains(cell) && isVisible$1(cell)));
}
function rows(root, options, cache) {
	const selector = options.rowSelector ?? DEFAULT_ROW_SELECTOR;
	return cachedElementList(cache, root, `grid:rows:${selector}`, () => Array.from(root.querySelectorAll(selector)).filter((row) => root.contains(row) && isVisible$1(row)));
}
function columnHeaders(root, cache) {
	return cachedElementList(cache, root, "grid:column-headers", () => Array.from(root.querySelectorAll("[data-col-key]")));
}
function rowCellsFor(row, allCells, options, cache) {
	const selector = options.cellSelector ?? DEFAULT_CELL_SELECTOR;
	return cachedElementList(cache, row, `grid:row-cells:${selector}`, () => Array.from(row.querySelectorAll(selector)).filter((candidate) => allCells.includes(candidate)));
}
function surfaceIdFor$1(element) {
	return element.getAttribute("data-ladder-id") ?? element.id ?? null;
}
function selectionForCell(root, cell, options, cache) {
	const allCells = cells(root, options, cache);
	const row = cell.closest(options.rowSelector ?? DEFAULT_ROW_SELECTOR);
	const allRows = rows(root, options, cache);
	const rowCells = row ? rowCellsFor(row, allCells, options, cache) : allCells;
	const id = surfaceIdFor$1(cell) ?? cell.id;
	return {
		id,
		focusKey: cell.dataset["surfaceFocusKey"],
		rowIndex: row ? allRows.indexOf(row) : Math.floor(allCells.indexOf(cell) / Math.max(1, rowCells.length)),
		colIndex: rowCells.indexOf(cell),
		rowKey: row?.dataset["rowKey"] ?? row?.id,
		colKey: cell.dataset["colKey"] ?? colKeyFromId(id)
	};
}
function cellAtPosition(root, selection, options) {
	const row = rows(root, options)[selection.rowIndex];
	if (!row) return null;
	return rowCellsFor(row, cells(root, options), options)[selection.colIndex] ?? null;
}
function paintLocalSelection(root, activeId, activeCell, options) {
	const activePosition = selectionForCell(root, activeCell, options);
	for (const cell of cells(root, options)) {
		const id = surfaceIdFor$1(cell);
		const selected = cell === activeCell || id === activeId;
		cell.dataset["runtimeSelected"] = selected ? "true" : "false";
		cell.dataset["selected"] = selected ? "true" : "false";
		cell.classList.toggle("is-runtime-selected", selected);
		cell.tabIndex = selected ? 0 : -1;
	}
	for (const [rowIndex, row] of rows(root, options).entries()) {
		const selected = activePosition.rowIndex === rowIndex;
		row.dataset["runtimeSelectedRow"] = selected ? "true" : "false";
		row.classList.toggle("is-runtime-selected-row", selected);
	}
	for (const header of columnHeaders(root)) {
		const selected = activePosition.colKey !== void 0 && header.dataset["colKey"] === activePosition.colKey;
		header.dataset["runtimeSelectedCol"] = selected ? "true" : "false";
		header.classList.toggle("is-runtime-selected-col", selected);
	}
}
function nextCellForKey(root, current, event, options, cache) {
	const allCells = cells(root, options, cache);
	const currentIndex = allCells.indexOf(current);
	if (currentIndex < 0) return allCells[0] ?? null;
	const row = current.closest(options.rowSelector ?? DEFAULT_ROW_SELECTOR);
	const rowCells = row ? rowCellsFor(row, allCells, options, cache) : [];
	const allRows = rows(root, options, cache);
	const rowIndex = row ? allRows.indexOf(row) : -1;
	const colIndex = rowCells.indexOf(current);
	const columns = Math.max(1, rowCells.length || inferredColumnCount(root, allCells, options, cache));
	let nextIndex = currentIndex;
	switch (event.key) {
		case "ArrowUp":
			nextIndex = Math.max(0, currentIndex - columns);
			break;
		case "ArrowDown":
			nextIndex = Math.min(allCells.length - 1, currentIndex + columns);
			break;
		case "ArrowLeft":
			if (rowCells.length && colIndex > 0) return rowCells[colIndex - 1] ?? current;
			nextIndex = currentIndex;
			break;
		case "ArrowRight":
			if (rowCells.length && colIndex >= 0 && colIndex < rowCells.length - 1) return rowCells[colIndex + 1] ?? current;
			nextIndex = currentIndex;
			break;
		case "Home":
			if (event.ctrlKey || event.metaKey) return allCells[0] ?? current;
			if (rowCells.length) return rowCells[0] ?? current;
			nextIndex = Math.floor(currentIndex / columns) * columns;
			break;
		case "End":
			if (event.ctrlKey || event.metaKey) return allCells[allCells.length - 1] ?? current;
			if (rowCells.length) return rowCells[rowCells.length - 1] ?? current;
			nextIndex = Math.min(allCells.length - 1, Math.floor(currentIndex / columns) * columns + columns - 1);
			break;
		case "PageUp":
			nextIndex = Math.max(0, currentIndex - columns * 10);
			break;
		case "PageDown":
			nextIndex = Math.min(allCells.length - 1, currentIndex + columns * 10);
			break;
		case "Tab":
			nextIndex = event.shiftKey ? Math.max(0, currentIndex - 1) : Math.min(allCells.length - 1, currentIndex + 1);
			break;
	}
	if (rowIndex >= 0 && colIndex >= 0 && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
		const nextRow = allRows[event.key === "ArrowUp" ? rowIndex - 1 : rowIndex + 1];
		const nextRowCell = nextRow ? rowCellsFor(nextRow, allCells, options, cache)[colIndex] : null;
		if (nextRowCell) return nextRowCell;
	}
	return allCells[nextIndex] ?? current;
}
function inferredColumnCount(root, allCells, options, cache) {
	const firstRow = rows(root, options, cache)[0];
	if (!firstRow) return allCells.length || 1;
	return rowCellsFor(firstRow, allCells, options, cache).length || 1;
}
function colKeyFromId(id) {
	return /^c-[^-]+-(.+)$/.exec(id)?.[1];
}
function focusCell(cell, reveal) {
	if (!surfaceTargetRetainsFocus$2(cell.ownerDocument.activeElement, cell)) cell.focus({ preventScroll: true });
	if (reveal) cell.scrollIntoView({
		block: "nearest",
		inline: "nearest"
	});
}
function surfaceTargetRetainsFocus$2(target, selectedCell) {
	if (!target) return false;
	if (selectedCell?.contains(target) && isSurfaceTextEntryTarget(target)) return true;
	if (target.closest("[data-bx-lift]")) return true;
	const keyboardOwner = target.closest("[data-surface-keyboard-owner]");
	return Boolean(keyboardOwner && selectedCell?.contains(keyboardOwner));
}
function isVisible$1(element) {
	return element.offsetParent !== null || element.getClientRects().length > 0;
}
function restoreSurfaceCanvasSelection(id, options = {}) {
	const target = surfaceCanvasElementForId(id, options.root);
	const runtime = target ? surfaceRuntimeForElement(target) : void 0;
	if (!target || !runtime) return false;
	runtime.select(id, { restoreSource: options.restoreSource ?? true });
	if (options.focusDom) focusSurfaceCanvasObject(target, options.reveal ?? false);
	return runtimeOwnsSelection(runtime, id);
}
function clearSurfaceCanvasSelection(root) {
	const rootElement = rootElementFor(root);
	const runtime = rootElement ? surfaceRuntimeForElement(rootElement) : void 0;
	if (!rootElement || !runtime) return false;
	rootElement.dataset["surfaceCanvasSelectionCleared"] = "true";
	runtime.clearInteractionState();
	releaseSurfaceCanvasDomFocus(rootElement);
	return true;
}
function releaseSurfaceCanvasDomFocus(root) {
	const rootElement = rootElementFor(root);
	const active = rootElement?.ownerDocument.activeElement;
	if (!rootElement || !(active instanceof HTMLElement)) return false;
	if (!rootElement.contains(active)) return false;
	if (surfaceTargetRetainsFocus$1(active)) return false;
	const activeObject = active.closest("[data-surface-component=\"frame\"][data-canvas-object], [data-canvas-object], [data-surface-canvas-object]");
	if (!activeObject || !rootElement.contains(activeObject)) return false;
	active.blur();
	return rootElement.ownerDocument.activeElement !== active;
}
function surfaceCanvasElementForId(id, root) {
	const rootElement = rootElementFor(root);
	if (!rootElement) return null;
	return surfaceElementForId(rootElement, id) ?? rootElement.ownerDocument.getElementById(id);
}
function rootElementFor(root) {
	if (root && "nodeType" in root && root.nodeType === 1) return root;
	if (root && "documentElement" in root) return root.querySelector("[data-surface-canvas-binding=\"active\"]") ?? root.documentElement;
	if (typeof document !== "undefined") return document.querySelector("[data-surface-canvas-binding=\"active\"]") ?? document.documentElement;
	return null;
}
function focusSurfaceCanvasObject(object, reveal) {
	if (!surfaceTargetRetainsFocus$1(object.ownerDocument.activeElement)) object.focus({ preventScroll: true });
	if (reveal) object.scrollIntoView({
		block: "nearest",
		inline: "nearest"
	});
}
function surfaceTargetRetainsFocus$1(target) {
	if (!target) return false;
	return isSurfaceTextEntryTarget(target) || target.closest("[data-surface-keyboard-owner], [data-bx-lift]") !== null;
}
function runtimeOwnsSelection(runtime, id) {
	const snapshot = runtime.snapshot();
	if (snapshot.focusedId !== id) return false;
	return Object.values(snapshot.selections).some((selection) => selection.headId === id && selection.ids.length === 1 && selection.ids[0] === id);
}
var DEFAULT_OBJECT_SELECTOR = "[data-surface-component=\"frame\"][data-canvas-object], [data-canvas-object], [data-surface-canvas-object], [data-surface-scene-object], [data-scene-object]";
var DEFAULT_EDGE_SELECTOR = "[data-surface-component=\"edge\"], [data-surface-canvas-edge], .boxel-canvas__edge[data-id]";
var DEFAULT_DRAG_HANDLE_SELECTOR = "[data-surface-canvas-drag-handle]";
var DEFAULT_RESIZE_HANDLE_SELECTOR = "[data-surface-canvas-resize-handle]";
var DEFAULT_CONNECT_HANDLE_SELECTOR = "[data-surface-component=\"handle\"], [data-surface-canvas-handle], .boxel-canvas__handle";
var MARQUEE_STYLE_ID = "boxel-surface-canvas-marquee-styles";
var CANVAS_KEYS = new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Tab",
	"Enter",
	"F2",
	"Escape",
	"Delete",
	"Backspace",
	"a",
	"A",
	"d",
	"D"
]);
var surfaceCanvasBinding = modifier((element, _positional, options) => {
	const view = element.ownerDocument.defaultView ?? window;
	let frame = 0;
	let runtime;
	let unsubscribe;
	let retryCount = 0;
	let hasHydratedSelection = false;
	let cache = createSurfaceDomBindingCache();
	let activePointer = null;
	let activeMarquee = null;
	let activeConnection = null;
	let previousSelectedIds = /* @__PURE__ */ new Set();
	let previousTabIndexById = /* @__PURE__ */ new Map();
	let previousSelectionPaintRevision = -1;
	let previousBodyUserSelect = "";
	let suppressNextClick = false;
	const schedule = () => {
		if (frame !== 0) return;
		frame = view.requestAnimationFrame(paint);
	};
	const invalidate = () => {
		cache = createSurfaceDomBindingCache(cache.revision + 1);
	};
	const invalidateAndSchedule = () => {
		invalidate();
		schedule();
	};
	const invalidateGeometry = (object) => {
		invalidate();
		dispatchSurfaceGeometryChange(object);
	};
	const syncRuntime = () => {
		const next = options.runtime ?? surfaceRuntimeForElement(element);
		if (next !== runtime) {
			unsubscribe?.();
			runtime = next;
			unsubscribe = runtime?.subscribeSelection(schedule);
		}
		return runtime;
	};
	const paint = () => {
		frame = 0;
		const active = options.active !== false;
		element.dataset["surfaceCanvasBinding"] = active ? "active" : "inactive";
		const mode = canvasModeFor(element);
		element.dataset["surfaceCanvasMode"] = mode;
		element.dataset["surfaceCanvasCanMove"] = String(mode === "change" && canvasPointerDragEnabled(options));
		element.dataset["surfaceCanvasCanResize"] = String(mode === "change" && canvasPointerResizeEnabled(options));
		element.dataset["surfaceCanvasCanConnect"] = String(mode === "change" && canvasPointerConnectEnabled(options));
		element.dataset["surfaceCanvasCanMarquee"] = String(canvasPointerMarqueeEnabled(options));
		const currentRuntime = syncRuntime();
		if (!active) return;
		if (!currentRuntime) {
			if (retryCount < 120) {
				retryCount += 1;
				schedule();
			}
			return;
		}
		retryCount = 0;
		const projection = currentRuntime.projection({ mode: canvasModeFor(element) });
		let activeId = activeSelectionId(currentRuntime);
		if (activeId) {
			delete element.dataset["surfaceCanvasSelectionCleared"];
			hasHydratedSelection = true;
		}
		if (element.dataset["surfaceCanvasSelectionCleared"] === "true") hasHydratedSelection = true;
		if (!activeId && !hasHydratedSelection) {
			const seededObject = objects(element, options, cache).find((object) => object.dataset["selected"] === "true" || object.classList.contains("is-selected") || object.classList.contains("is-runtime-selected"));
			const seededId = seededObject ? surfaceIdFor(seededObject) : null;
			if (seededId) {
				currentRuntime.select(seededId, { restoreSource: true });
				activeId = seededId;
			}
			hasHydratedSelection = true;
		}
		const selectedIds = /* @__PURE__ */ new Set();
		const objectById = /* @__PURE__ */ new Map();
		const objectSelectionState = /* @__PURE__ */ new Map();
		const projectionById = /* @__PURE__ */ new Map();
		const tabIndexById = /* @__PURE__ */ new Map();
		for (const object of objects(element, options, cache)) {
			const id = surfaceIdFor(object);
			const projected = id ? projection.nodeMap.get(id) : void 0;
			const selected = Boolean(id && (projected?.selected || projected?.focused || id === activeId));
			if (id) {
				objectById.set(id, object);
				objectSelectionState.set(id, selected);
				projectionById.set(id, projected);
				tabIndexById.set(id, tabIndexForObjectProjection(selected, projected));
				if (selected) selectedIds.add(id);
			} else paintObjectSelectionState(object, selected, projected);
		}
		const forcePaint = previousSelectionPaintRevision !== cache.revision;
		const changedIds = forcePaint ? new Set(objectById.keys()) : symmetricDifference(previousSelectedIds, selectedIds);
		if (!forcePaint) {
			for (const [id, tabIndex] of tabIndexById) if (previousTabIndexById.get(id) !== tabIndex) changedIds.add(id);
		}
		for (const id of changedIds) {
			const object = objectById.get(id);
			if (!object) continue;
			paintObjectSelectionState(object, objectSelectionState.get(id) ?? false, projectionById.get(id));
		}
		previousSelectedIds = selectedIds;
		previousTabIndexById = tabIndexById;
		previousSelectionPaintRevision = cache.revision;
	};
	const selectObject = (object, event, opts = {}) => {
		if (options.active === false) return false;
		const currentRuntime = syncRuntime();
		const id = surfaceIdFor(object);
		if (!currentRuntime || !id) return false;
		delete element.dataset["surfaceCanvasSelectionCleared"];
		hasHydratedSelection = true;
		currentRuntime.select(id, {
			additive: opts.additive,
			range: opts.range,
			restoreSource: true
		});
		const selection = selectionForObject(element, object, options, cache, event);
		focusObject(object, opts.reveal ?? true, selection, options);
		options.onSelect?.(selection, event);
		schedule();
		return true;
	};
	const clearSelection = (event) => {
		const currentRuntime = syncRuntime();
		if (!currentRuntime) return false;
		if (!activeSelectionId(currentRuntime)) return false;
		element.dataset["surfaceCanvasSelectionCleared"] = "true";
		hasHydratedSelection = true;
		currentRuntime.clearInteractionState();
		releaseSurfaceCanvasDomFocus(element);
		options.onClear?.(event);
		schedule();
		return true;
	};
	const activateObject = (object, event) => {
		selectObject(object, event, { reveal: true });
		syncRuntime()?.dispatch({ type: "activate" });
		options.onActivate?.(selectionForObject(element, object, options, cache, event), event);
	};
	const onClick = (event) => {
		if (suppressNextClick) {
			suppressNextClick = false;
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			return;
		}
		if (options.active === false) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest("[data-bx-lift]")) return;
		if (surfaceTargetOwnsPointerEvent(target)) return;
		const object = closestObject(element, target, options);
		if (!object) {
			if (element.contains(target)) clearSelection(event);
			return;
		}
		if (target.closest("[data-surface-activate-frame]")) {
			activateObject(object, event);
			return;
		}
		selectObject(object, event, {
			reveal: false,
			additive: event.metaKey || event.ctrlKey,
			range: event.shiftKey
		});
	};
	const onPointerDown = (event) => {
		if (options.active === false || activePointer || activeMarquee || activeConnection) return;
		if (event.button !== 0) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (target.closest("[data-bx-lift]")) return;
		if (surfaceTargetOwnsPointerEvent(target)) return;
		if (canvasModeFor(element) === "change") {
			const connectHandle = closestConnectHandle(element, target, options);
			if (connectHandle && canvasPointerConnectEnabled(options)) {
				beginConnection(connectHandle, event);
				return;
			}
			const resizeHandle = closestResizeHandle(element, target, options);
			if (resizeHandle && canvasPointerResizeEnabled(options)) {
				const object = closestObject(element, resizeHandle, options);
				if (object && objectKindFor(object, options) !== "edge") {
					beginPointerResize(object, event);
					return;
				}
			}
			const object = closestObject(element, target, options);
			if (object && objectKindFor(object, options) !== "edge" && canvasPointerDragEnabled(options)) {
				if (!isCanvasDragStartTarget(object, target, options)) return;
				beginPointerMove(object, event);
				return;
			}
			if (object) return;
		} else if (closestObject(element, target, options)) return;
		if (canvasPointerMarqueeEnabled(options) && element.contains(target)) beginMarquee(event);
	};
	const onDblClick = (event) => {
		if (options.active === false) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		if (surfaceTargetOwnsPointerEvent(target)) return;
		const object = closestObject(element, target, options);
		if (!object) return;
		activateObject(object, event);
	};
	const onKeydown = (event) => {
		if (options.active === false) return;
		if (!CANVAS_KEYS.has(event.key)) return;
		if (event.defaultPrevented) return;
		if (event.target instanceof Element && event.target.closest("[data-bx-lift]")) return;
		if (surfaceTargetOwnsKeyboardEvent(event) || surfaceElementOwnsKeyboardEvent(element.ownerDocument.activeElement, event.key)) return;
		const currentRuntime = syncRuntime();
		if (!currentRuntime) return;
		const current = activeObjectElement(element, currentRuntime, options, cache) ?? closestObject(element, element.ownerDocument.activeElement, options);
		if (event.key === "Escape") {
			if (clearSelection(event)) consume(event);
			return;
		}
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
			consume(event);
			options.onSelectAll?.(event);
			return;
		}
		if (event.key === "Enter" || event.key === "F2") {
			const object = current ?? objects(element, options, cache)[0];
			if (!object) return;
			consume(event);
			activateObject(object, event);
			return;
		}
		if (event.key === "Delete" || event.key === "Backspace") {
			if (!current) return;
			consume(event);
			options.onDelete?.(selectionForObject(element, current, options, cache, event), event);
			return;
		}
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
			if (!current) return;
			consume(event);
			options.onDuplicate?.(selectionForObject(element, current, options, cache, event), event);
			return;
		}
		if (event.key === "Tab") {
			const next = current ? nextObjectInOrder(element, current, event.shiftKey ? -1 : 1, options, cache) : objects(element, options, cache)[0] ?? null;
			if (!next) return;
			consume(event);
			selectObject(next, event, { reveal: true });
			return;
		}
		if (isArrowKey(event.key)) {
			const object = current ?? objects(element, options, cache)[0];
			if (!object) return;
			consume(event);
			if (objectKindFor(object, options) === "edge") return;
			if (canvasModeFor(element) === "change") {
				const step = event.shiftKey ? 10 : 1;
				options.onNudge?.(selectionForObject(element, object, options, cache), arrowDelta(event.key, step), event);
				selectObject(object, event, { reveal: true });
				return;
			}
			const next = nearestObjectForArrow(element, object, event.key, options, cache);
			if (next) selectObject(next, event, { reveal: true });
		}
	};
	const mutationObserver = new MutationObserver(invalidateAndSchedule);
	mutationObserver.observe(element, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: [
			"class",
			"data-id",
			"data-ladder-id",
			"data-selected",
			"data-surface-canvas-edge",
			"data-surface-component",
			"data-canvas-object"
		]
	});
	element.addEventListener("click", onClick);
	element.addEventListener("dblclick", onDblClick);
	element.addEventListener("pointerdown", onPointerDown);
	element.addEventListener("keydown", onKeydown);
	view.addEventListener("keydown", onKeydown, true);
	view.addEventListener("scroll", invalidateAndSchedule, true);
	view.addEventListener("resize", invalidateAndSchedule);
	syncRuntime();
	schedule();
	return () => {
		if (frame !== 0) view.cancelAnimationFrame(frame);
		unsubscribe?.();
		mutationObserver.disconnect();
		endActivePointer("cancel");
		endActiveMarquee("cancel");
		endActiveConnection("cancel");
		element.removeEventListener("click", onClick);
		element.removeEventListener("dblclick", onDblClick);
		element.removeEventListener("pointerdown", onPointerDown);
		element.removeEventListener("keydown", onKeydown);
		view.removeEventListener("keydown", onKeydown, true);
		view.removeEventListener("scroll", invalidateAndSchedule, true);
		view.removeEventListener("resize", invalidateAndSchedule);
	};
	function beginPointerMove(object, event) {
		const selection = selectionForObject(element, object, options, cache);
		selectObject(object, event, {
			reveal: false,
			additive: event.metaKey || event.ctrlKey,
			range: event.shiftKey
		});
		activePointer = {
			kind: "move",
			object,
			selection,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			initialTransform: object.style.transform,
			initialWidth: object.offsetWidth,
			initialHeight: object.offsetHeight
		};
		beginPointerSession(object, event);
		options.onMove?.(selection, pointerMoveFor(event, activePointer, "start"), event);
	}
	function beginPointerResize(object, event) {
		const selection = selectionForObject(element, object, options, cache);
		selectObject(object, event, {
			reveal: false,
			additive: event.metaKey || event.ctrlKey,
			range: event.shiftKey
		});
		activePointer = {
			kind: "resize",
			object,
			selection,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			initialTransform: object.style.transform,
			initialWidth: object.offsetWidth,
			initialHeight: object.offsetHeight
		};
		beginPointerSession(object, event);
		options.onResize?.(selection, pointerResizeFor(event, activePointer, "start", options), event);
	}
	function beginPointerSession(object, event) {
		consumePointer(event);
		object.dataset["surfaceCanvasPointerActive"] = "true";
		element.dataset["surfaceCanvasPointerActive"] = activePointer?.kind ?? "true";
		previousBodyUserSelect = element.ownerDocument.body.style.userSelect;
		element.ownerDocument.body.style.userSelect = "none";
		view.addEventListener("pointermove", onWindowPointerMove, true);
		view.addEventListener("pointerup", onWindowPointerUp, true);
		view.addEventListener("pointercancel", onWindowPointerCancel, true);
	}
	function onWindowPointerMove(event) {
		if (activeConnection && event.pointerId === activeConnection.pointerId) {
			consumePointer(event);
			updateActiveConnection(event, "move");
			return;
		}
		if (activeMarquee && event.pointerId === activeMarquee.pointerId) {
			consumePointer(event);
			updateActiveMarquee(event, "move");
			return;
		}
		if (!activePointer || event.pointerId !== activePointer.pointerId) return;
		consumePointer(event);
		if (activePointer.kind === "move") {
			const move = snappedPointerMoveFor(event, activePointer, "move", options);
			applyMoveTransform(activePointer.object, activePointer.initialTransform, move.totalDx, move.totalDy);
			invalidateGeometry(activePointer.object);
			emitAutoPan(event, "move");
			options.onMove?.(activePointer.selection, move, event);
			return;
		}
		const resize = pointerResizeFor(event, activePointer, "move", options);
		activePointer.object.style.width = `${resize.width}px`;
		activePointer.object.style.height = `${resize.height}px`;
		invalidateGeometry(activePointer.object);
		emitAutoPan(event, "move");
		options.onResize?.(activePointer.selection, resize, event);
	}
	function onWindowPointerUp(event) {
		if (activeConnection && event.pointerId === activeConnection.pointerId) {
			consumePointer(event);
			endActiveConnection("end", event);
			return;
		}
		if (activeMarquee && event.pointerId === activeMarquee.pointerId) {
			consumePointer(event);
			endActiveMarquee("end", event);
			return;
		}
		if (!activePointer || event.pointerId !== activePointer.pointerId) return;
		consumePointer(event);
		endActivePointer("end", event);
	}
	function onWindowPointerCancel(event) {
		if (activeConnection && event.pointerId === activeConnection.pointerId) {
			consumePointer(event);
			endActiveConnection("cancel", event);
			return;
		}
		if (activeMarquee && event.pointerId === activeMarquee.pointerId) {
			consumePointer(event);
			endActiveMarquee("cancel", event);
			return;
		}
		if (!activePointer || event.pointerId !== activePointer.pointerId) return;
		consumePointer(event);
		endActivePointer("cancel", event);
	}
	function endActivePointer(phase, event) {
		if (!activePointer) return;
		const session = activePointer;
		activePointer = null;
		view.removeEventListener("pointermove", onWindowPointerMove, true);
		view.removeEventListener("pointerup", onWindowPointerUp, true);
		view.removeEventListener("pointercancel", onWindowPointerCancel, true);
		element.ownerDocument.body.style.userSelect = previousBodyUserSelect;
		delete element.dataset["surfaceCanvasPointerActive"];
		delete session.object.dataset["surfaceCanvasPointerActive"];
		if (session.kind === "move") {
			const move = event ? phase === "end" ? snappedPointerMoveFor(event, session, phase, options) : pointerMoveFor(event, session, phase) : pointerMoveForFallback(session, phase);
			if (phase === "cancel") {
				session.object.style.transform = session.initialTransform;
				dispatchSurfaceGeometryChange(session.object);
			}
			options.onMove?.(session.selection, move, event);
			if (phase === "end") view.requestAnimationFrame(() => {
				session.object.style.transform = session.initialTransform;
				dispatchSurfaceGeometryChange(session.object);
			});
		} else {
			const resize = event ? pointerResizeFor(event, session, phase, options) : pointerResizeForFallback(session, phase, options);
			if (phase === "cancel") {
				session.object.style.width = `${session.initialWidth}px`;
				session.object.style.height = `${session.initialHeight}px`;
				dispatchSurfaceGeometryChange(session.object);
			}
			options.onResize?.(session.selection, resize, event);
		}
		if (event) emitAutoPan(event, phase);
		invalidateGeometry(session.object);
	}
	function emitAutoPan(event, phase) {
		if (!canvasAutoPanEnabled(options)) return;
		const autoPan = autoPanForPointer(element, event, phase, options);
		if (!autoPan) return;
		if (phase === "move" && autoPan.dx === 0 && autoPan.dy === 0) return;
		options.onAutoPan?.(autoPan, event);
	}
	function beginConnection(handle, event) {
		const handleInfo = connectionHandleInfo(handle);
		if (!handleInfo.nodeId) return;
		consumePointer(event);
		activeConnection = {
			pointerId: event.pointerId,
			sourceId: handleInfo.nodeId,
			sourceHandleId: handleInfo.handleId,
			sourceHandleType: handleInfo.handleType,
			targetId: null,
			targetHandleId: null,
			targetHandleType: null
		};
		element.dataset["surfaceCanvasPointerActive"] = "connect";
		handle.dataset["surfaceCanvasConnectionSource"] = "true";
		previousBodyUserSelect = element.ownerDocument.body.style.userSelect;
		element.ownerDocument.body.style.userSelect = "none";
		syncRuntime()?.dispatch({
			type: "connectStart",
			sourceId: handleInfo.nodeId,
			sourceHandleId: handleInfo.handleId
		});
		view.addEventListener("pointermove", onWindowPointerMove, true);
		view.addEventListener("pointerup", onWindowPointerUp, true);
		view.addEventListener("pointercancel", onWindowPointerCancel, true);
		options.onConnectStart?.(connectionForSession(activeConnection, event, "start"), event);
	}
	function updateActiveConnection(event, phase) {
		if (!activeConnection) return null;
		const targetHandle = connectHandleAtPoint(element, event, options);
		const targetInfo = targetHandle ? connectionHandleInfo(targetHandle) : null;
		activeConnection.targetId = targetInfo?.nodeId ?? null;
		activeConnection.targetHandleId = targetInfo?.handleId ?? null;
		activeConnection.targetHandleType = targetInfo?.handleType ?? null;
		if (targetInfo?.nodeId) syncRuntime()?.dispatch({
			type: "connectOver",
			targetId: targetInfo.nodeId,
			targetHandleId: targetInfo.handleId
		});
		const connection = connectionForSession(activeConnection, event, phase);
		options.onConnectUpdate?.(connection, event);
		emitAutoPan(event, phase);
		return connection;
	}
	function endActiveConnection(phase, event) {
		if (!activeConnection) return;
		const connection = event ? updateActiveConnection(event, phase) : connectionForSessionFromFallback(activeConnection, phase);
		activeConnection = null;
		view.removeEventListener("pointermove", onWindowPointerMove, true);
		view.removeEventListener("pointerup", onWindowPointerUp, true);
		view.removeEventListener("pointercancel", onWindowPointerCancel, true);
		element.ownerDocument.body.style.userSelect = previousBodyUserSelect;
		delete element.dataset["surfaceCanvasPointerActive"];
		for (const source of element.querySelectorAll("[data-surface-canvas-connection-source=\"true\"]")) delete source.dataset["surfaceCanvasConnectionSource"];
		syncRuntime()?.dispatch({ type: "connectEnd" });
		if (connection && phase === "end" && connection.targetId) options.onConnect?.(connection, event);
		if (connection) options.onConnectEnd?.(connection, event);
	}
	function beginMarquee(event) {
		ensureMarqueeStyles(element.ownerDocument);
		consumePointer(event);
		const overlay = element.ownerDocument.createElement("div");
		overlay.className = "bx-surface-canvas-marquee";
		overlay.dataset["surfaceCanvasMarquee"] = "active";
		element.ownerDocument.body.append(overlay);
		activeMarquee = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			currentX: event.clientX,
			currentY: event.clientY,
			additive: event.metaKey || event.ctrlKey || event.shiftKey,
			overlay
		};
		element.dataset["surfaceCanvasPointerActive"] = "marquee";
		previousBodyUserSelect = element.ownerDocument.body.style.userSelect;
		element.ownerDocument.body.style.userSelect = "none";
		view.addEventListener("pointermove", onWindowPointerMove, true);
		view.addEventListener("pointerup", onWindowPointerUp, true);
		view.addEventListener("pointercancel", onWindowPointerCancel, true);
		applyMarqueeOverlay(activeMarquee);
		options.onMarqueeStart?.(marqueeForSession(element, activeMarquee, "start", options, cache), event);
	}
	function updateActiveMarquee(event, phase) {
		if (!activeMarquee) return;
		activeMarquee.currentX = event.clientX;
		activeMarquee.currentY = event.clientY;
		applyMarqueeOverlay(activeMarquee);
		options.onMarqueeUpdate?.(marqueeForSession(element, activeMarquee, phase, options, cache), event);
	}
	function endActiveMarquee(phase, event) {
		if (!activeMarquee) return;
		const session = activeMarquee;
		if (event) {
			session.currentX = event.clientX;
			session.currentY = event.clientY;
		}
		activeMarquee = null;
		view.removeEventListener("pointermove", onWindowPointerMove, true);
		view.removeEventListener("pointerup", onWindowPointerUp, true);
		view.removeEventListener("pointercancel", onWindowPointerCancel, true);
		element.ownerDocument.body.style.userSelect = previousBodyUserSelect;
		delete element.dataset["surfaceCanvasPointerActive"];
		session.overlay.remove();
		suppressNextClick = true;
		const marquee = marqueeForSession(element, session, phase, options, cache);
		if (phase === "end") {
			commitMarqueeSelection(marquee, event);
			options.onMarqueeCommit?.(marquee, event);
		} else options.onMarqueeUpdate?.(marquee, event);
	}
	function commitMarqueeSelection(marquee, event) {
		const currentRuntime = syncRuntime();
		if (!currentRuntime) return;
		if (marquee.ids.length === 0) {
			if (!marquee.additive) clearSelection(event);
			return;
		}
		delete element.dataset["surfaceCanvasSelectionCleared"];
		hasHydratedSelection = true;
		if (!marquee.additive) currentRuntime.clearInteractionState();
		for (const [index, id] of marquee.ids.entries()) currentRuntime.select(id, {
			additive: marquee.additive || index > 0,
			restoreSource: true
		});
		schedule();
	}
});
function consume(event) {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
}
function canvasModeFor(element) {
	const mode = element.closest("[data-surface-mode]")?.getAttribute("data-surface-mode");
	return mode === "change" || mode === "inspect" ? mode : "use";
}
function activeSelectionId(runtime) {
	const snapshot = runtime.snapshot();
	const activeScopeId = snapshot.activeScopeId;
	if (activeScopeId && snapshot.selections[activeScopeId]) return snapshot.selections[activeScopeId].headId;
	return snapshot.focusedId;
}
function activeObjectElement(root, runtime, options, cache) {
	const activeId = activeSelectionId(runtime);
	return activeId ? objectById(root, activeId, options, cache) : null;
}
function objectById(root, id, options, cache) {
	return objects(root, options, cache).find((object) => surfaceIdFor(object) === id) ?? null;
}
function closestObject(root, target, options) {
	if (!target) return null;
	const selector = canvasObjectSelector(options);
	const object = target.closest(selector);
	if (!object || !root.contains(object)) return null;
	if (object.closest("[data-bx-lift]")) return null;
	return object;
}
function objects(root, options, cache) {
	const selector = canvasObjectSelector(options);
	return cachedElementList(cache, root, `canvas:objects:${selector}`, () => Array.from(root.querySelectorAll(selector)).filter((object) => root.contains(object) && isVisible(object)));
}
function rectForObject(object, cache) {
	return cachedRectForElement(object, cache);
}
function surfaceIdFor(element) {
	return element.getAttribute("data-ladder-id") ?? element.getAttribute("data-id") ?? element.id ?? null;
}
function paintObjectSelectionState(object, selected, projected) {
	const selectedValue = selected ? "true" : "false";
	if (object.dataset["runtimeSelected"] !== selectedValue) object.dataset["runtimeSelected"] = selectedValue;
	if (object.dataset["selected"] !== selectedValue) object.dataset["selected"] = selectedValue;
	object.classList.toggle("is-runtime-selected", selected);
	const tabIndex = tabIndexForObjectProjection(selected, projected);
	if (tabIndex === null) object.removeAttribute("tabindex");
	else object.tabIndex = tabIndex;
}
function tabIndexForObjectProjection(selected, projected) {
	return projected?.tabIndex ?? (selected ? 0 : -1);
}
function symmetricDifference(left, right) {
	const changed = /* @__PURE__ */ new Set();
	for (const id of left) if (!right.has(id)) changed.add(id);
	for (const id of right) if (!left.has(id)) changed.add(id);
	return changed;
}
function selectionForObject(root, object, options, cache, event) {
	const allObjects = objects(root, options, cache);
	const rect = rectForObject(object, cache);
	const targetPayload = canvasTargetPayload(event?.target);
	return {
		id: surfaceIdFor(object) ?? object.id,
		focusKey: object.dataset["surfaceFocusKey"],
		kind: objectKindFor(object, options),
		field: targetPayload.field,
		payload: targetPayload.payload,
		index: allObjects.indexOf(object),
		x: rect.left,
		y: rect.top,
		width: rect.width,
		height: rect.height
	};
}
function canvasTargetPayload(target) {
	if (!(target instanceof Element)) return {};
	const payloadElement = closestCanvasPayloadElement(target);
	if (!payloadElement) return {};
	const payload = {};
	for (const { name, value } of Array.from(payloadElement.attributes)) {
		if (!name.startsWith("data-canvas-")) continue;
		const key = datasetPayloadKey(name.slice(12));
		if (key) payload[key] = value;
	}
	return {
		field: payload["field"],
		payload: Object.keys(payload).length > 0 ? payload : void 0
	};
}
function closestCanvasPayloadElement(target) {
	let cursor = target;
	while (cursor) {
		if (cursor instanceof HTMLElement && Array.from(cursor.attributes).some((attribute) => attribute.name.startsWith("data-canvas-"))) return cursor;
		cursor = cursor.parentElement;
	}
	return null;
}
function datasetPayloadKey(attributeSuffix) {
	return attributeSuffix.replace(/-([a-z])/g, (_match, char) => char.toUpperCase());
}
function canvasObjectSelector(options) {
	return [options.objectSelector ?? DEFAULT_OBJECT_SELECTOR, options.edgeSelector ?? DEFAULT_EDGE_SELECTOR].filter((selector) => selector.trim().length > 0).join(", ");
}
function objectKindFor(object, options) {
	const edgeSelector = options.edgeSelector ?? DEFAULT_EDGE_SELECTOR;
	if (edgeSelector.trim().length > 0 && object.matches(edgeSelector)) return "edge";
	return object.getAttribute("data-surface-component") === "edge" || object.hasAttribute("data-surface-canvas-edge") || object.classList.contains("boxel-canvas__edge") ? "edge" : "frame";
}
function nextObjectInOrder(root, current, direction, options, cache) {
	const allObjects = objects(root, options, cache);
	if (allObjects.length === 0) return null;
	const currentIndex = allObjects.indexOf(current);
	return allObjects[currentIndex < 0 ? 0 : (currentIndex + direction + allObjects.length) % allObjects.length] ?? null;
}
function nearestObjectForArrow(root, current, key, options, cache) {
	const currentRect = rectForObject(current, cache);
	const currentCenter = centerOf(currentRect);
	let best = null;
	for (const candidate of objects(root, options, cache)) {
		if (candidate === current) continue;
		const rect = rectForObject(candidate, cache);
		const center = centerOf(rect);
		const dx = center.x - currentCenter.x;
		const dy = center.y - currentCenter.y;
		if (!isCandidateInDirection(key, dx, dy)) continue;
		const primary = key === "ArrowLeft" || key === "ArrowRight" ? Math.abs(dx) : Math.abs(dy);
		const secondary = key === "ArrowLeft" || key === "ArrowRight" ? Math.abs(dy) : Math.abs(dx);
		const overlapBias = overlapsOrthogonalAxis(key, currentRect, rect) ? -1e3 : 0;
		const score = primary * 100 + secondary + overlapBias;
		if (!best || score < best.score) best = {
			object: candidate,
			score
		};
	}
	return best?.object ?? current;
}
function centerOf(rect) {
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2
	};
}
function isCandidateInDirection(key, dx, dy) {
	switch (key) {
		case "ArrowLeft": return dx < 0 && Math.abs(dx) >= Math.abs(dy) * .2;
		case "ArrowRight": return dx > 0 && Math.abs(dx) >= Math.abs(dy) * .2;
		case "ArrowUp": return dy < 0 && Math.abs(dy) >= Math.abs(dx) * .2;
		case "ArrowDown": return dy > 0 && Math.abs(dy) >= Math.abs(dx) * .2;
		default: return false;
	}
}
function overlapsOrthogonalAxis(key, a, b) {
	if (key === "ArrowLeft" || key === "ArrowRight") return a.top <= b.bottom && b.top <= a.bottom;
	return a.left <= b.right && b.left <= a.right;
}
function isArrowKey(key) {
	return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
}
function arrowDelta(key, step) {
	switch (key) {
		case "ArrowLeft": return {
			dx: -step,
			dy: 0
		};
		case "ArrowRight": return {
			dx: step,
			dy: 0
		};
		case "ArrowUp": return {
			dx: 0,
			dy: -step
		};
		case "ArrowDown": return {
			dx: 0,
			dy: step
		};
		default: return {
			dx: 0,
			dy: 0
		};
	}
}
function canvasPointerDragEnabled(options) {
	return options.pointerDrag ?? Boolean(options.onMove);
}
function canvasPointerResizeEnabled(options) {
	return options.pointerResize ?? Boolean(options.onResize);
}
function canvasPointerMarqueeEnabled(options) {
	return options.pointerMarquee ?? Boolean(options.onMarqueeStart || options.onMarqueeUpdate || options.onMarqueeCommit);
}
function canvasPointerConnectEnabled(options) {
	return options.pointerConnect ?? Boolean(options.onConnectStart || options.onConnectUpdate || options.onConnect || options.onConnectEnd);
}
function canvasAutoPanEnabled(options) {
	return options.autoPan ?? Boolean(options.onAutoPan);
}
function autoPanForPointer(root, event, phase, options) {
	const rect = root.getBoundingClientRect();
	if (rect.width <= 0 || rect.height <= 0) return null;
	const margin = options.autoPanMargin ?? 48;
	const maxSpeed = options.autoPanMaxSpeed ?? 18;
	return {
		dx: autoPanAxisDelta(event.clientX, rect.left, rect.right, margin, maxSpeed),
		dy: autoPanAxisDelta(event.clientY, rect.top, rect.bottom, margin, maxSpeed),
		pointerX: event.clientX,
		pointerY: event.clientY,
		margin,
		phase
	};
}
function autoPanAxisDelta(pointer, start, end, margin, maxSpeed) {
	if (margin <= 0 || maxSpeed <= 0) return 0;
	if (pointer < start + margin) {
		const pressure = (start + margin - pointer) / margin;
		return -Math.round(Math.min(1, Math.max(0, pressure)) * maxSpeed);
	}
	if (pointer > end - margin) {
		const pressure = (pointer - (end - margin)) / margin;
		return Math.round(Math.min(1, Math.max(0, pressure)) * maxSpeed);
	}
	return 0;
}
function ensureMarqueeStyles(document) {
	if (document.getElementById(MARQUEE_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = MARQUEE_STYLE_ID;
	style.textContent = `
    .bx-surface-canvas-marquee {
      position: fixed;
      z-index: 98;
      box-sizing: border-box;
      pointer-events: none;
      border: 1px solid var(--surface-decal-highlight, #00ffba);
      background: var(--surface-decal-highlight-fill-soft, rgba(0, 255, 186, 0.10));
      box-shadow: 0 0 0 3px var(--surface-decal-highlight-fill-soft, rgba(0, 255, 186, 0.10));
    }
  `;
	document.head.append(style);
}
function applyMarqueeOverlay(session) {
	const box = marqueeBoxForSession(session);
	session.overlay.style.left = `${box.left}px`;
	session.overlay.style.top = `${box.top}px`;
	session.overlay.style.width = `${box.width}px`;
	session.overlay.style.height = `${box.height}px`;
}
function marqueeForSession(root, session, phase, options, cache) {
	const box = marqueeBoxForSession(session);
	return {
		phase,
		startX: session.startX,
		startY: session.startY,
		currentX: session.currentX,
		currentY: session.currentY,
		left: box.left,
		top: box.top,
		right: box.right,
		bottom: box.bottom,
		width: box.width,
		height: box.height,
		pointerX: session.currentX,
		pointerY: session.currentY,
		ids: marqueeObjectIds(root, box, options, cache),
		additive: session.additive
	};
}
function marqueeBoxForSession(session) {
	const left = Math.min(session.startX, session.currentX);
	const top = Math.min(session.startY, session.currentY);
	const right = Math.max(session.startX, session.currentX);
	const bottom = Math.max(session.startY, session.currentY);
	return {
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top
	};
}
function marqueeObjectIds(root, box, options, cache) {
	const minSize = options.marqueeMinSize ?? 4;
	if (box.width < minSize && box.height < minSize) return [];
	const ids = [];
	for (const object of objects(root, options, cache)) {
		if (!rectsIntersect(rectForObject(object, cache), box)) continue;
		const id = surfaceIdFor(object);
		if (id) ids.push(id);
	}
	return ids;
}
function rectsIntersect(rect, box) {
	return rect.left <= box.right && rect.right >= box.left && rect.top <= box.bottom && rect.bottom >= box.top;
}
function closestResizeHandle(root, target, options) {
	const selector = options.resizeHandleSelector ?? DEFAULT_RESIZE_HANDLE_SELECTOR;
	const handle = target.closest(selector);
	return handle && root.contains(handle) ? handle : null;
}
function closestConnectHandle(root, target, options) {
	const selector = options.connectHandleSelector ?? DEFAULT_CONNECT_HANDLE_SELECTOR;
	if (selector.trim().length === 0) return null;
	const handle = target.closest(selector);
	return handle && root.contains(handle) ? handle : null;
}
function connectHandleAtPoint(root, event, options) {
	const elements = root.ownerDocument.elementsFromPoint(event.clientX, event.clientY);
	for (const element of elements) {
		const handle = closestConnectHandle(root, element, options);
		if (handle) return handle;
	}
	return null;
}
function connectionHandleInfo(handle) {
	return {
		nodeId: handle.getAttribute("data-nodeid") ?? handle.getAttribute("data-surface-node-id") ?? handle.getAttribute("data-ladder-id") ?? null,
		handleId: handle.getAttribute("data-handleid") ?? handle.getAttribute("data-surface-handle-id") ?? null,
		handleType: handle.getAttribute("data-handletype") ?? handle.getAttribute("data-surface-handle-type") ?? null
	};
}
function connectionForSession(session, event, phase) {
	return {
		phase,
		sourceId: session.sourceId,
		sourceHandleId: session.sourceHandleId,
		sourceHandleType: session.sourceHandleType,
		targetId: session.targetId,
		targetHandleId: session.targetHandleId,
		targetHandleType: session.targetHandleType,
		pointerX: event.clientX,
		pointerY: event.clientY
	};
}
function connectionForSessionFromFallback(session, phase) {
	return {
		phase,
		sourceId: session.sourceId,
		sourceHandleId: session.sourceHandleId,
		sourceHandleType: session.sourceHandleType,
		targetId: session.targetId,
		targetHandleId: session.targetHandleId,
		targetHandleType: session.targetHandleType,
		pointerX: 0,
		pointerY: 0
	};
}
function isCanvasDragStartTarget(object, target, options) {
	const selector = options.dragHandleSelector ?? DEFAULT_DRAG_HANDLE_SELECTOR;
	const handle = target.closest(selector);
	if (handle && object.contains(handle)) return true;
	if (object.querySelector(selector)) return false;
	return target.closest("button, input, textarea, select, [contenteditable]:not([contenteditable=false]), [data-surface-activate-frame], [data-surface-atom-editor]") === null;
}
function consumePointer(event) {
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
}
function pointerMoveFor(event, session, phase) {
	const totalDx = event.clientX - session.startX;
	const totalDy = event.clientY - session.startY;
	return {
		phase,
		dx: totalDx,
		dy: totalDy,
		totalDx,
		totalDy,
		pointerX: event.clientX,
		pointerY: event.clientY
	};
}
function snappedPointerMoveFor(event, session, phase, options) {
	return applySnapPosition(session.selection, pointerMoveFor(event, session, phase), options, event);
}
function applySnapPosition(selection, move, options, event) {
	const snapped = options.snapPosition?.(selection, move, event);
	if (!snapped) return move;
	const totalDx = finiteOr(snapped.dx, snapped.x === void 0 ? move.totalDx : snapped.x - selection.x);
	const totalDy = finiteOr(snapped.dy, snapped.y === void 0 ? move.totalDy : snapped.y - selection.y);
	return {
		...move,
		dx: totalDx,
		dy: totalDy,
		totalDx,
		totalDy
	};
}
function finiteOr(value, fallback) {
	return value !== void 0 && Number.isFinite(value) ? value : fallback;
}
function pointerMoveForFallback(session, phase) {
	return {
		phase,
		dx: 0,
		dy: 0,
		totalDx: 0,
		totalDy: 0,
		pointerX: session.startX,
		pointerY: session.startY
	};
}
function pointerResizeFor(event, session, phase, options) {
	return resizeForDelta(session, event.clientX - session.startX, event.clientY - session.startY, phase, event.clientX, event.clientY, options);
}
function pointerResizeForFallback(session, phase, options) {
	return resizeForDelta(session, 0, 0, phase, session.startX, session.startY, options);
}
function resizeForDelta(session, dx, dy, phase, pointerX, pointerY, options) {
	const minWidth = options.minResizeWidth ?? 180;
	const minHeight = options.minResizeHeight ?? 120;
	return {
		phase,
		dx,
		dy,
		width: Math.max(minWidth, session.initialWidth + dx),
		height: Math.max(minHeight, session.initialHeight + dy),
		pointerX,
		pointerY
	};
}
function applyMoveTransform(object, initialTransform, dx, dy) {
	const base = initialTransform && initialTransform !== "none" ? `${initialTransform} ` : "";
	object.style.transform = `${base}translate3d(${Math.round(dx)}px, ${Math.round(dy)}px, 0)`;
}
function focusObject(object, reveal, selection, options) {
	if (!surfaceTargetRetainsFocus(object.ownerDocument.activeElement)) object.focus({ preventScroll: true });
	if (!reveal) return;
	const revealMode = options.reveal ?? "scroll";
	if (typeof revealMode === "function") {
		revealMode(object, selection);
		return;
	}
	if (revealMode === "pan") {
		options.onReveal?.(selection, object);
		return;
	}
	if (revealMode === "scroll") object.scrollIntoView({
		block: "nearest",
		inline: "nearest"
	});
}
function surfaceTargetRetainsFocus(target) {
	if (!target) return false;
	return isSurfaceTextEntryTarget(target) || target.closest("[data-surface-keyboard-owner], [data-bx-lift]") !== null;
}
function isVisible(element) {
	return element.offsetParent !== null || element.getClientRects().length > 0;
}
/**
* `{{portal target}}` — appends the element to a DOM target outside
* the current render tree.
*
* K.5 Step B: lives in `boxel-surface` so any host (grid, canvas,
* future kanban / calendar) can portal lifts past their own clip /
* overflow / transform ancestors. Hosts that need a different
* default target (e.g., boxel-canvas portals to `.boxel-canvas` so
* lifts inherit the canvas's transformed coordinate space) ship
* their own wrapper.
*
* Targets:
*   - `'body'`            → `document.body`
*   - any CSS selector    → `element.closest(selector)` first, with
*                            fallback to `document.body`
*
* Restored on teardown — the element is removed entirely so Glimmer
* doesn't reattach it on the way out.
*/
var portal = modifier((element, [target]) => {
	const frame = requestAnimationFrame(() => {
		const dest = target === "body" ? document.body : element.closest(target) ?? document.body;
		if (dest && element.parentElement !== dest) dest.appendChild(element);
	});
	return () => {
		cancelAnimationFrame(frame);
		element.remove();
	};
});
var multiUnit = modifier((cell, [ladder, cellId], opts = {}) => {
	if (!ladder || !cellId) return;
	const registry = /* @__PURE__ */ new Map();
	const paint = () => {
		for (const id of registry.keys()) {
			const el = cell.querySelector(`[data-ladder-id="${CSS.escape(id)}"]`);
			if (!el) continue;
			el.classList.toggle("is-ladder-focused", ladder.isFocused(id));
			el.classList.toggle("is-ladder-selected", ladder.isSelected(id));
		}
	};
	const sync = () => {
		const units = cell.querySelectorAll("[data-unit-key]");
		const seen = /* @__PURE__ */ new Set();
		for (const unit of Array.from(units)) {
			const key = unit.getAttribute("data-unit-key");
			if (!key) continue;
			const fullId = `${cellId}.${key}`;
			seen.add(fullId);
			if (unit.getAttribute("data-ladder-id") !== fullId) unit.setAttribute("data-ladder-id", fullId);
			if (!registry.has(fullId)) {
				const cleanup = ladder.register({
					id: fullId,
					surface: "unit",
					parentId: cellId
				});
				registry.set(fullId, cleanup);
			}
		}
		for (const [id, cleanup] of registry) if (!seen.has(id)) {
			cleanup();
			registry.delete(id);
		}
	};
	sync();
	const observer = new MutationObserver(sync);
	observer.observe(cell, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["data-unit-key"]
	});
	const onClick = (event) => {
		if (opts.skipClick) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		const unit = target.closest("[data-unit-key]");
		if (!unit || !cell.contains(unit)) return;
		const fullId = unit.getAttribute("data-ladder-id");
		if (!fullId) return;
		event.stopPropagation();
		event.stopImmediatePropagation();
		ladder.select(fullId, {
			additive: event.metaKey || event.ctrlKey,
			range: event.shiftKey
		});
	};
	cell.addEventListener("click", onClick, true);
	const unsubscribe = ladder.subscribe(() => paint());
	queueMicrotask(paint);
	return () => {
		observer.disconnect();
		cell.removeEventListener("click", onClick);
		unsubscribe();
		for (const cleanup of registry.values()) cleanup();
		registry.clear();
	};
});
var surfaceLiftBinding = modifier((element, _positional, args) => {
	const { state, contract, row, col, onSelect, onActivate } = args;
	const supportsDetails = contract.lift.includes("details");
	const supportsEdit = contract.lift.includes("edit");
	const openDetails = () => {
		if (!supportsDetails) return;
		state.scheduleHoverDetails(row, col, contract);
	};
	const refreshDetails = () => {
		if (!supportsDetails) return;
		if (state.isOpenFor(row, col)) return;
		state.scheduleHoverDetails(row, col, contract);
	};
	const dismissDetails = () => {
		state.scheduleDismissDetails();
	};
	const onPointerEnter = (event) => {
		if (event.pointerType !== "mouse") return;
		openDetails();
	};
	const onPointerMove = (event) => {
		if (event.pointerType !== "mouse") return;
		refreshDetails();
	};
	const onPointerLeave = (event) => {
		if (event.pointerType !== "mouse") return;
		dismissDetails();
	};
	const onMouseEnter = () => {
		openDetails();
	};
	const onMouseMove = () => {
		refreshDetails();
	};
	const onMouseLeave = () => {
		dismissDetails();
	};
	const onClick = (event) => {
		onSelect?.(row, col, event);
	};
	const onDblClick = (event) => {
		if (onActivate) {
			event.stopPropagation();
			onActivate(row, col);
			return;
		}
		if (!supportsEdit) return;
		event.stopPropagation();
		state.openEdit(row, col);
	};
	element.addEventListener("pointerenter", onPointerEnter);
	element.addEventListener("pointermove", onPointerMove);
	element.addEventListener("pointerleave", onPointerLeave);
	element.addEventListener("mouseenter", onMouseEnter);
	element.addEventListener("mousemove", onMouseMove);
	element.addEventListener("mouseleave", onMouseLeave);
	element.addEventListener("click", onClick);
	element.addEventListener("dblclick", onDblClick);
	return () => {
		element.removeEventListener("pointerenter", onPointerEnter);
		element.removeEventListener("pointermove", onPointerMove);
		element.removeEventListener("pointerleave", onPointerLeave);
		element.removeEventListener("mouseenter", onMouseEnter);
		element.removeEventListener("mousemove", onMouseMove);
		element.removeEventListener("mouseleave", onMouseLeave);
		element.removeEventListener("click", onClick);
		element.removeEventListener("dblclick", onDblClick);
	};
});
//#endregion
export { commitSurfaceGridInput as a, releaseSurfaceCanvasDomFocus as c, restoreSurfaceGridSelection as d, surfaceCanvasBinding as f, surfaceLiftBinding as h, clearSurfaceGridSelection as i, releaseSurfaceGridDomFocus as l, surfaceGridBinding as m, cancelSurfaceGridInput as n, multiUnit as o, surfaceContinuousInput as p, clearSurfaceCanvasSelection as r, portal as s, SURFACE_GEOMETRY_CHANGE_EVENT as t, restoreSurfaceCanvasSelection as u };
