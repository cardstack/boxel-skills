import { A as surfaceTargetOwnsPointerEvent, C as surfaceNode, D as surfaceScopeAttributesForTree, E as surfaceScopeAttributesForElement, O as surfaceScopeRelay, S as surfaceInlineEdit, T as surfaceRuntimeForElement, _ as stampSurfaceScope, a as _initializerDefineProperty, b as surfaceElementOwnsKeyboardEvent, c as isSurfaceScopeAttribute, f as mergeSurfaceScopeAttributes, i as _defineProperty, j as surfaceTargetRetainsBrowserFocusAfterSelection, k as surfaceTargetOwnsKeyboardEvent, l as isSurfaceTextEntryTarget, m as registerSurfaceDomNode, n as SurfaceScopeRelay, o as commitInlineEdits, p as parentSurfaceIdForElement, r as _applyDecoratedDescriptor, s as createSurfaceScopeRelay, t as SurfaceScopeContextName, u as ladderForSurfaceElement, v as surfaceCoordinateDebugger, w as surfaceRoot, x as surfaceElementsForIds, y as surfaceElementForId } from "./chunks/coordinate-debugger-DMx2ibI_-DPMsHvI1.js";
import { $ as TextCell, A as Layout, B as ParentIdContextName, C as FormTabs, D as InspectContextName, E as Grid, F as ModeContextName, G as SURFACE_LAYERS, H as Plane, I as NumberCell, J as SurfaceComponent, K as Scene, L as Outline, M as LiftChevron, N as LiftContextName, O as LAYERS, P as LiftManager, Q as SwitchCell, R as Pane, S as FormTab, T as Frame, U as Row, V as PathContextName, W as Run, X as SurfaceRuntimeContextName, Y as SurfaceLayerManager, Z as SurfaceRuntimeImpl, _ as FormAlert, a as Connection, at as createLiftManager, b as FormSection, c as CueLabel, ct as nextSurfaceId, d as EmailCell, dt as surfaceFocusKey, et as Unit, f as Environment, ft as surfaceFocusKeyFromPath, g as Form, h as FocusLadder, ht as writeResolvedFormFieldValue, i as ChangeRouteContextName, it as createFocusLadder, j as Lift, k as LadderContextName, l as CueStatus, lt as readResolvedFormFieldValue, m as FociStore, mt as surfaceIdFromPath, n as Canvas, nt as collapseSurfaceLayerBoxes, o as CoordinateSpaceContextName, ot as createSurfaceRuntime, p as Flow, pt as surfaceId, q as Scroll, r as Cell, rt as createFociStore, s as CueDescription, st as labelForFieldKey, t as Accessory, tt as clipSurfaceLayerRect, u as DemoContextName, ut as resolveFormFields, v as FormField, w as FormWizard, x as FormStep, y as FormFieldContextName, z as ParentContextName } from "./chunks/form-step-t6BDikej-ZHGGx_QN.js";
import { a as commitSurfaceGridInput, c as releaseSurfaceCanvasDomFocus, d as restoreSurfaceGridSelection, f as surfaceCanvasBinding, h as surfaceLiftBinding, i as clearSurfaceGridSelection, l as releaseSurfaceGridDomFocus, m as surfaceGridBinding, n as cancelSurfaceGridInput, o as multiUnit, p as surfaceContinuousInput, r as clearSurfaceCanvasSelection, s as portal, t as SURFACE_GEOMETRY_CHANGE_EVENT, u as restoreSurfaceCanvasSelection } from "./chunks/lift-binding-DYIHoQTn-CBIDMir8.js";
import { modifier } from "ember-modifier";
import { tracked } from "@glimmer/tracking";
//#region node_modules/.pnpm/css-what@8.0.0/node_modules/css-what/dist/types.js
/** Discriminants for selector token kinds. */
var SelectorType;
(function(SelectorType) {
	SelectorType["Attribute"] = "attribute";
	SelectorType["Pseudo"] = "pseudo";
	SelectorType["PseudoElement"] = "pseudo-element";
	SelectorType["Tag"] = "tag";
	SelectorType["Universal"] = "universal";
	SelectorType["Adjacent"] = "adjacent";
	SelectorType["Child"] = "child";
	SelectorType["Descendant"] = "descendant";
	SelectorType["Parent"] = "parent";
	SelectorType["Sibling"] = "sibling";
	SelectorType["ColumnCombinator"] = "column-combinator";
})(SelectorType || (SelectorType = {}));
/** Operators available for attribute selectors. */
var AttributeAction;
(function(AttributeAction) {
	AttributeAction["Any"] = "any";
	AttributeAction["Element"] = "element";
	AttributeAction["End"] = "end";
	AttributeAction["Equals"] = "equals";
	AttributeAction["Exists"] = "exists";
	AttributeAction["Hyphen"] = "hyphen";
	AttributeAction["Not"] = "not";
	AttributeAction["Start"] = "start";
})(AttributeAction || (AttributeAction = {}));
//#endregion
//#region node_modules/.pnpm/css-what@8.0.0/node_modules/css-what/dist/parse.js
var reName = /^[^#\\]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\u00B0-\uFFFF-])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var CharCode;
(function(CharCode) {
	CharCode[CharCode["LeftParenthesis"] = 40] = "LeftParenthesis";
	CharCode[CharCode["RightParenthesis"] = 41] = "RightParenthesis";
	CharCode[CharCode["LeftSquareBracket"] = 91] = "LeftSquareBracket";
	CharCode[CharCode["RightSquareBracket"] = 93] = "RightSquareBracket";
	CharCode[CharCode["Comma"] = 44] = "Comma";
	CharCode[CharCode["Period"] = 46] = "Period";
	CharCode[CharCode["Colon"] = 58] = "Colon";
	CharCode[CharCode["SingleQuote"] = 39] = "SingleQuote";
	CharCode[CharCode["DoubleQuote"] = 34] = "DoubleQuote";
	CharCode[CharCode["Plus"] = 43] = "Plus";
	CharCode[CharCode["Tilde"] = 126] = "Tilde";
	CharCode[CharCode["QuestionMark"] = 63] = "QuestionMark";
	CharCode[CharCode["ExclamationMark"] = 33] = "ExclamationMark";
	CharCode[CharCode["Slash"] = 47] = "Slash";
	CharCode[CharCode["Equal"] = 61] = "Equal";
	CharCode[CharCode["Dollar"] = 36] = "Dollar";
	CharCode[CharCode["Pipe"] = 124] = "Pipe";
	CharCode[CharCode["Circumflex"] = 94] = "Circumflex";
	CharCode[CharCode["Asterisk"] = 42] = "Asterisk";
	CharCode[CharCode["GreaterThan"] = 62] = "GreaterThan";
	CharCode[CharCode["LessThan"] = 60] = "LessThan";
	CharCode[CharCode["Hash"] = 35] = "Hash";
	CharCode[CharCode["LowerI"] = 105] = "LowerI";
	CharCode[CharCode["LowerS"] = 115] = "LowerS";
	CharCode[CharCode["BackSlash"] = 92] = "BackSlash";
	CharCode[CharCode["Space"] = 32] = "Space";
	CharCode[CharCode["Tab"] = 9] = "Tab";
	CharCode[CharCode["NewLine"] = 10] = "NewLine";
	CharCode[CharCode["FormFeed"] = 12] = "FormFeed";
	CharCode[CharCode["CarriageReturn"] = 13] = "CarriageReturn";
})(CharCode || (CharCode = {}));
var actionTypes = new Map([
	[CharCode.Tilde, AttributeAction.Element],
	[CharCode.Circumflex, AttributeAction.Start],
	[CharCode.Dollar, AttributeAction.End],
	[CharCode.Asterisk, AttributeAction.Any],
	[CharCode.ExclamationMark, AttributeAction.Not],
	[CharCode.Pipe, AttributeAction.Hyphen]
]);
var unpackPseudos = new Set([
	"has",
	"not",
	"matches",
	"is",
	"where",
	"host",
	"host-context"
]);
/**
* Pseudo elements defined in CSS Level 1 and CSS Level 2 can be written with
* a single colon; eg. :before will turn into ::before.
* @see {@link https://www.w3.org/TR/2018/WD-selectors-4-20181121/#pseudo-element-syntax}
*/
var pseudosToPseudoElements = new Set([
	"before",
	"after",
	"first-line",
	"first-letter"
]);
/**
* Checks whether a specific selector is a traversal.
* This is useful eg. in swapping the order of elements that
* are not traversals.
* @param selector Selector to check.
*/
function isTraversal(selector) {
	switch (selector.type) {
		case SelectorType.Adjacent:
		case SelectorType.Child:
		case SelectorType.Descendant:
		case SelectorType.Parent:
		case SelectorType.Sibling:
		case SelectorType.ColumnCombinator: return true;
		case SelectorType.Attribute:
		case SelectorType.Pseudo:
		case SelectorType.PseudoElement:
		case SelectorType.Tag:
		case SelectorType.Universal: return false;
	}
}
var stripQuotesFromPseudos = new Set(["contains", "icontains"]);
function funescape(_, escaped, escapedWhitespace) {
	const high = Number.parseInt(escaped, 16) - 65536;
	return Number.isNaN(high) || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
}
function unescapeCSS(cssString) {
	return cssString.replace(reEscape, funescape);
}
function isQuote(c) {
	return c === CharCode.SingleQuote || c === CharCode.DoubleQuote;
}
function isWhitespace(c) {
	return c === CharCode.Space || c === CharCode.Tab || c === CharCode.NewLine || c === CharCode.FormFeed || c === CharCode.CarriageReturn;
}
/**
* Parses `selector`.
* @param selector Selector to parse.
* @returns Returns a two-dimensional array.
* The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
* the second contains the relevant tokens for that selector.
*/
function parse(selector) {
	const subselects = [];
	const endIndex = parseSelector(subselects, `${selector}`, 0);
	if (endIndex < selector.length) throw new Error(`Unmatched selector: ${selector.slice(endIndex)}`);
	return subselects;
}
function parseSelector(subselects, selector, selectorIndex) {
	let tokens = [];
	function getName(offset) {
		const match = selector.slice(selectorIndex + offset).match(reName);
		if (!match) throw new Error(`Expected name, found ${selector.slice(selectorIndex)}`);
		const [name] = match;
		selectorIndex += offset + name.length;
		return unescapeCSS(name);
	}
	function stripWhitespace(offset) {
		selectorIndex += offset;
		while (selectorIndex < selector.length && isWhitespace(selector.charCodeAt(selectorIndex))) selectorIndex++;
	}
	function readValueWithParenthesis() {
		selectorIndex += 1;
		const start = selectorIndex;
		for (let counter = 1; selectorIndex < selector.length; selectorIndex++) switch (selector.charCodeAt(selectorIndex)) {
			case CharCode.BackSlash:
				selectorIndex += 1;
				break;
			case CharCode.LeftParenthesis:
				counter += 1;
				break;
			case CharCode.RightParenthesis:
				counter -= 1;
				if (counter === 0) return unescapeCSS(selector.slice(start, selectorIndex++));
				break;
		}
		throw new Error("Parenthesis not matched");
	}
	function ensureNotTraversal() {
		if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) throw new Error("Did not expect successive traversals.");
	}
	function addTraversal(type) {
		if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) {
			tokens[tokens.length - 1].type = type;
			return;
		}
		ensureNotTraversal();
		tokens.push({ type });
	}
	function addSpecialAttribute(name, action) {
		tokens.push({
			type: SelectorType.Attribute,
			name,
			action,
			value: getName(1),
			namespace: null,
			ignoreCase: "quirks"
		});
	}
	/**
	* We have finished parsing the current part of the selector.
	*
	* Remove descendant tokens at the end if they exist,
	* and return the last index, so that parsing can be
	* picked up from here.
	*/
	function finalizeSubselector() {
		if (tokens.length > 0 && tokens[tokens.length - 1].type === SelectorType.Descendant) tokens.pop();
		if (tokens.length === 0) throw new Error("Empty sub-selector");
		subselects.push(tokens);
	}
	stripWhitespace(0);
	if (selector.length === selectorIndex) return selectorIndex;
	loop: while (selectorIndex < selector.length) {
		const firstChar = selector.charCodeAt(selectorIndex);
		switch (firstChar) {
			case CharCode.Space:
			case CharCode.Tab:
			case CharCode.NewLine:
			case CharCode.FormFeed:
			case CharCode.CarriageReturn:
				if (tokens.length === 0 || tokens[0].type !== SelectorType.Descendant) {
					ensureNotTraversal();
					tokens.push({ type: SelectorType.Descendant });
				}
				stripWhitespace(1);
				break;
			case CharCode.GreaterThan:
				addTraversal(SelectorType.Child);
				stripWhitespace(1);
				break;
			case CharCode.LessThan:
				addTraversal(SelectorType.Parent);
				stripWhitespace(1);
				break;
			case CharCode.Tilde:
				addTraversal(SelectorType.Sibling);
				stripWhitespace(1);
				break;
			case CharCode.Plus:
				addTraversal(SelectorType.Adjacent);
				stripWhitespace(1);
				break;
			case CharCode.Period:
				addSpecialAttribute("class", AttributeAction.Element);
				break;
			case CharCode.Hash:
				addSpecialAttribute("id", AttributeAction.Equals);
				break;
			case CharCode.LeftSquareBracket: {
				stripWhitespace(1);
				let name;
				let namespace = null;
				if (selector.charCodeAt(selectorIndex) === CharCode.Pipe) name = getName(1);
				else if (selector.startsWith("*|", selectorIndex)) {
					namespace = "*";
					name = getName(2);
				} else {
					name = getName(0);
					if (selector.charCodeAt(selectorIndex) === CharCode.Pipe && selector.charCodeAt(selectorIndex + 1) !== CharCode.Equal) {
						namespace = name;
						name = getName(1);
					}
				}
				stripWhitespace(0);
				let action = AttributeAction.Exists;
				const possibleAction = actionTypes.get(selector.charCodeAt(selectorIndex));
				if (possibleAction) {
					action = possibleAction;
					if (selector.charCodeAt(selectorIndex + 1) !== CharCode.Equal) throw new Error("Expected `=`");
					stripWhitespace(2);
				} else if (selector.charCodeAt(selectorIndex) === CharCode.Equal) {
					action = AttributeAction.Equals;
					stripWhitespace(1);
				}
				let value = "";
				let ignoreCase = null;
				if (action !== "exists") {
					if (isQuote(selector.charCodeAt(selectorIndex))) {
						const quote = selector.charCodeAt(selectorIndex);
						selectorIndex += 1;
						const sectionStart = selectorIndex;
						while (selectorIndex < selector.length && selector.charCodeAt(selectorIndex) !== quote) selectorIndex += selector.charCodeAt(selectorIndex) === CharCode.BackSlash ? 2 : 1;
						if (selector.charCodeAt(selectorIndex) !== quote) throw new Error("Attribute value didn't end");
						value = unescapeCSS(selector.slice(sectionStart, selectorIndex));
						selectorIndex += 1;
					} else {
						const valueStart = selectorIndex;
						while (selectorIndex < selector.length && !isWhitespace(selector.charCodeAt(selectorIndex)) && selector.charCodeAt(selectorIndex) !== CharCode.RightSquareBracket) selectorIndex += selector.charCodeAt(selectorIndex) === CharCode.BackSlash ? 2 : 1;
						value = unescapeCSS(selector.slice(valueStart, selectorIndex));
					}
					stripWhitespace(0);
					switch (selector.charCodeAt(selectorIndex) | 32) {
						case CharCode.LowerI:
							ignoreCase = true;
							stripWhitespace(1);
							break;
						case CharCode.LowerS:
							ignoreCase = false;
							stripWhitespace(1);
							break;
					}
				}
				if (selector.charCodeAt(selectorIndex) !== CharCode.RightSquareBracket) throw new Error("Attribute selector didn't terminate");
				selectorIndex += 1;
				const attributeSelector = {
					type: SelectorType.Attribute,
					name,
					action,
					value,
					namespace,
					ignoreCase
				};
				tokens.push(attributeSelector);
				break;
			}
			case CharCode.Colon: {
				if (selector.charCodeAt(selectorIndex + 1) === CharCode.Colon) {
					tokens.push({
						type: SelectorType.PseudoElement,
						name: getName(2).toLowerCase(),
						data: selector.charCodeAt(selectorIndex) === CharCode.LeftParenthesis ? readValueWithParenthesis() : null
					});
					break;
				}
				const name = getName(1).toLowerCase();
				if (pseudosToPseudoElements.has(name)) {
					tokens.push({
						type: SelectorType.PseudoElement,
						name,
						data: null
					});
					break;
				}
				let data = null;
				if (selector.charCodeAt(selectorIndex) === CharCode.LeftParenthesis) if (unpackPseudos.has(name)) {
					if (isQuote(selector.charCodeAt(selectorIndex + 1))) throw new Error(`Pseudo-selector ${name} cannot be quoted`);
					data = [];
					selectorIndex = parseSelector(data, selector, selectorIndex + 1);
					if (selector.charCodeAt(selectorIndex) !== CharCode.RightParenthesis) throw new Error(`Missing closing parenthesis in :${name} (${selector})`);
					selectorIndex += 1;
				} else {
					data = readValueWithParenthesis();
					if (stripQuotesFromPseudos.has(name)) {
						const quot = data.charCodeAt(0);
						if (quot === data.charCodeAt(data.length - 1) && isQuote(quot)) data = data.slice(1, -1);
					}
					data = unescapeCSS(data);
				}
				tokens.push({
					type: SelectorType.Pseudo,
					name,
					data
				});
				break;
			}
			case CharCode.Comma:
				finalizeSubselector();
				tokens = [];
				stripWhitespace(1);
				break;
			default: {
				if (selector.startsWith("/*", selectorIndex)) {
					const endIndex = selector.indexOf("*/", selectorIndex + 2);
					if (endIndex === -1) throw new Error("Comment was not terminated");
					selectorIndex = endIndex + 2;
					if (tokens.length === 0) stripWhitespace(0);
					break;
				}
				let namespace = null;
				let name;
				if (firstChar === CharCode.Asterisk) {
					selectorIndex += 1;
					name = "*";
				} else if (firstChar === CharCode.Pipe) {
					name = "";
					if (selector.charCodeAt(selectorIndex + 1) === CharCode.Pipe) {
						addTraversal(SelectorType.ColumnCombinator);
						stripWhitespace(2);
						break;
					}
				} else if (reName.test(selector.slice(selectorIndex))) name = getName(0);
				else break loop;
				if (selector.charCodeAt(selectorIndex) === CharCode.Pipe && selector.charCodeAt(selectorIndex + 1) !== CharCode.Pipe) {
					namespace = name;
					if (selector.charCodeAt(selectorIndex + 1) === CharCode.Asterisk) {
						name = "*";
						selectorIndex += 2;
					} else name = getName(1);
				}
				tokens.push(name === "*" ? {
					type: SelectorType.Universal,
					namespace
				} : {
					type: SelectorType.Tag,
					name,
					namespace
				});
			}
		}
	}
	finalizeSubselector();
	return selectorIndex;
}
//#endregion
//#region dist/index.js
/**
* A `Surface` names a kind of rendering context with its own
* authority over focus, selection, and gesture. The list is
* deliberately small.
*
* Re-exported from `widget.ts` so consumers can import from a
* single module:
*   `import type { Surface } from '@cardstack/boxel-surface'`
*/
/**
* What the SURFACE is being rendered FOR. Same as the legacy
* `Intent` (`'preview' | 'editor'`) but extended with the higher-
* level intents the contract negotiation needs to distinguish —
* a "picker" pane behaves differently from an "editor" pane,
* for example.
*
* For now the spreadsheet only uses `'preview'` and `'editor'`;
* the rest are reserved for the broader Boxel use cases the design
* memo describes.
*/
/**
* Capability HINTS the widget gives the negotiator. Smaller and
* less prescriptive than the legacy `Trait` union — these answer
* questions like "is this widget a text input?" or "is committing
* on every keystroke safe?", not "should it use a popover?". The
* contract dimensions decide the latter.
*
* Names are deliberately verb-y / property-y so they read as
* statements about the widget's NATURE, not about UI choices.
*/
/**
* The kinds of lift a cell can offer. K.5 introduces this enum as
* a first-class contract dimension, replacing the legacy
* `contract.popup` field which named the CSS mechanism rather than
* the user intent.
*
*   details   Hover-triggered tooltip-light read-only inspection.
*   preview   Anchored card-style summary, sticky.
*   edit      Focused mutation surface (picker, calendar, formula).
*   tools     Action palette / command list.
*
* See `src/components/lift.gts` for the Lift shell that
* renders each kind.
*/
/**
* A `Contract` is the FULL run-time policy for a child
* surface mounted inside a parent surface. Every dimension is
* non-optional and resolves to a concrete enum value — the host
* never has to ask "what if focus is undefined?".
*
* 10 dimensions, ordered roughly from most-defining to least:
*
*   focus       Who owns the focus root?
*   selection   Who owns the selection model?
*   pointer     Who handles mouse-down?
*   keyboard    Who handles arrow keys / typing?
*   commit      When does an edit become permanent?
*   sizing      Who decides the editor's box size?
*   overflow    Are popups portaled past clipping?
*   popup       What lift surface does the editor open in?
*   layer       Which z-tier does the lift live on?
*   adornment   What chrome wraps the surface?
*
* Each enum value is intentionally short and English-readable so
* the contract dump is self-documenting in dev tools.
*/
/**
* The shape a SURFACE declares about itself: which capability hints
* it accepts, which contract dimensions it permits / forbids /
* defaults. Shipping policies (`GRID_CELL_POLICY`, etc.) live with
* the surface owner — for grid, in `boxel-grid`.
*
* Policies REFINE base contracts. They do NOT replace the lookup —
* the negotiator always starts from the base table.
*/
/**
* Per-instance overrides. The most-specific layer of refinement —
* a single column, a single tile, a single embed says "for this
* one, override these dimensions." Subject to safety rules: the
* negotiator will not honor an override that would unlock focus
* for a `'plane'`-level surface, for example.
*/
/**
* The "if everything else returns nothing, you get this" contract.
* Equivalent to a static read-only display: parent owns everything,
* child has no authority, no editor mounts. Safe to render anywhere.
*/
var FALLBACK_CONTRACT = {
	focus: "parent",
	selection: "parent",
	pointer: "parent-gesture",
	keyboard: "parent-shortcuts",
	commit: "preview-only",
	sizing: "intrinsic",
	overflow: "visible",
	lift: [],
	liftPlacement: "attached",
	liftFocus: "auto",
	liftSize: "comfortable",
	liftBackdrop: "tint",
	liftElevation: "raised",
	liftKeyboardModel: "compose",
	rangeable: false,
	advanceOnCommit: "stay",
	layer: "base",
	adornment: "none"
};
var BASE_CONTRACTS = {
	"layout>run": {
		focus: "parent",
		selection: "none",
		pointer: "parent-gesture",
		keyboard: "parent-shortcuts",
		commit: "preview-only",
		sizing: "intrinsic",
		overflow: "visible",
		lift: [],
		liftPlacement: "attached",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "base",
		adornment: "none"
	},
	"layout>cell": {
		focus: "delegated",
		selection: "child",
		pointer: "child-interaction",
		keyboard: "child-text",
		commit: "on-blur",
		sizing: "fill",
		overflow: "clip",
		lift: ["details", "edit"],
		liftPlacement: "attached",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "down",
		layer: "popover",
		adornment: "hover"
	},
	"layout>unit": {
		focus: "delegated",
		selection: "child",
		pointer: "child-interaction",
		keyboard: "child-text",
		commit: "on-blur",
		sizing: "fill",
		overflow: "clip",
		lift: ["details", "edit"],
		liftPlacement: "attached",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: true,
		advanceOnCommit: "down",
		layer: "popover",
		adornment: "hover"
	},
	"cell>unit": {
		focus: "delegated",
		selection: "child",
		pointer: "child-interaction",
		keyboard: "child-text",
		commit: "on-blur",
		sizing: "intrinsic",
		overflow: "visible",
		lift: [],
		liftPlacement: "attached",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "popover",
		adornment: "hover"
	},
	"layout>layout": {
		focus: "delegated",
		selection: "shared",
		pointer: "gesture-split",
		keyboard: "parent-shortcuts",
		commit: "draft",
		sizing: "intrinsic",
		overflow: "visible",
		lift: [
			"details",
			"preview",
			"edit"
		],
		liftPlacement: "plane",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "base",
		adornment: "hover"
	},
	"layout>pane": {
		focus: "contained",
		selection: "child",
		pointer: "child-interaction",
		keyboard: "child-text",
		commit: "on-close",
		sizing: "fill",
		overflow: "scroll",
		lift: ["edit"],
		liftPlacement: "attached",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "popover",
		adornment: "none"
	},
	"layout>plane": {
		focus: "trapped",
		selection: "child",
		pointer: "blocked",
		keyboard: "modal",
		commit: "explicit",
		sizing: "fill",
		overflow: "scroll",
		lift: ["edit"],
		liftPlacement: "plane",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "modal",
		adornment: "none"
	},
	"pane>layout": {
		focus: "contained",
		selection: "child",
		pointer: "child-interaction",
		keyboard: "child-text",
		commit: "draft",
		sizing: "fill",
		overflow: "scroll",
		lift: ["edit"],
		liftPlacement: "attached",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "popover",
		adornment: "none"
	},
	"pane>plane": {
		focus: "trapped",
		selection: "child",
		pointer: "blocked",
		keyboard: "modal",
		commit: "explicit",
		sizing: "fill",
		overflow: "scroll",
		lift: ["edit"],
		liftPlacement: "plane",
		liftFocus: "auto",
		liftSize: "comfortable",
		liftBackdrop: "tint",
		liftElevation: "raised",
		liftKeyboardModel: "compose",
		rangeable: false,
		advanceOnCommit: "stay",
		layer: "modal",
		adornment: "none"
	}
};
var CONTRACT_TABLES = /* @__PURE__ */ new Map();
CONTRACT_TABLES.set("base", BASE_CONTRACTS);
function registerContractTable(name, table) {
	CONTRACT_TABLES.set(name, table);
}
/**
* Look up the base contract for a (parent, child) pair across all
* registered shards. Search order: most-recently-registered wins
* (so package shards override base if there's a conflict — the
* package owns the surface, it knows best).
*/
function lookupBaseContract(parent, child) {
	const key = `${parent}>${child}`;
	const tables = [...CONTRACT_TABLES.values()].reverse();
	for (const table of tables) {
		const hit = table[key];
		if (hit) return { ...hit };
	}
	return { ...FALLBACK_CONTRACT };
}
/** Pass 1: intent refinement.
*  Preview vs editor changes commit + adornment + lift availability. */
function applyIntent(contract, input) {
	if (input.childIntent === "preview") return {
		...contract,
		commit: "preview-only",
		lift: [],
		layer: "base"
	};
	if (input.childIntent === "editor") {
		if (contract.commit === "preview-only") return {
			...contract,
			commit: "draft"
		};
	}
	return contract;
}
/** Pass 2: capability refinement.
*  Each capability hint may upgrade specific dimensions. */
function applyCapabilities(contract, caps) {
	let c = { ...contract };
	const has = (cap) => caps.includes(cap);
	if (has("text-input")) {
		c.keyboard = "child-text";
		c.pointer = "child-interaction";
	}
	if (has("live-write")) c.commit = "live";
	if (has("draft-commit") && c.commit !== "live") c.commit = "draft";
	const declaredLifts = /* @__PURE__ */ new Set();
	if (has("lift-details")) declaredLifts.add("details");
	if (has("lift-preview")) declaredLifts.add("preview");
	if (has("lift-edit")) declaredLifts.add("edit");
	if (has("lift-tools")) declaredLifts.add("tools");
	if (declaredLifts.size === 0) c.lift = [];
	else c.lift = [
		"details",
		"preview",
		"edit",
		"tools"
	].filter((k) => declaredLifts.has(k));
	if (has("plane-default") && c.lift.length > 0) {
		c.liftPlacement = "plane";
		c.layer = "modal";
		c.overflow = "portal";
	} else if (has("shadow-default") && c.lift.length > 0) {
		c.liftPlacement = "shadow";
		c.layer = "cell-lift";
		c.overflow = "portal";
	} else if (c.lift.length > 0 && c.liftPlacement === "attached") c.overflow = "portal";
	if (c.lift.length > 0) {
		const mostEscalated = c.lift[c.lift.length - 1];
		if (mostEscalated === "edit") {
			if (c.liftPlacement === "plane") {
				c.liftSize = "spacious";
				c.liftBackdrop = "scrim";
				c.liftElevation = "modal";
			} else if (c.liftPlacement === "shadow") {
				c.liftSize = "auto";
				c.liftBackdrop = "none";
				c.liftElevation = "elevated";
			} else {
				c.liftSize = "comfortable";
				c.liftBackdrop = "blur";
				c.liftElevation = "elevated";
			}
			if (has("arrow-nudge") && has("text-input")) c.liftKeyboardModel = "edit-number";
			else if (has("text-input") && !has("lift-edit")) c.liftKeyboardModel = "edit-text";
			else if (has("text-input") && has("lift-edit") && !c.lift.includes("details")) c.liftKeyboardModel = "edit-text";
			else c.liftKeyboardModel = "pick";
		} else if (mostEscalated === "tools") {
			c.liftSize = "compact";
			c.liftBackdrop = "none";
			c.liftElevation = "raised";
			c.liftKeyboardModel = "pick";
		} else {
			c.liftSize = "compact";
			c.liftBackdrop = "tint";
			c.liftElevation = "raised";
			c.liftKeyboardModel = "compose";
		}
	}
	if (has("commit-on-close") && c.lift.length > 0 && c.commit !== "live") c.commit = "on-close";
	if (has("hover-reveal") && c.adornment === "none") c.adornment = "hover";
	if (has("resizable")) c.sizing = "resizable";
	if (has("cq-size")) c.sizing = "measured";
	return c;
}
/** Pass 3: parent surface policy.
*  Apply the surface's overrides + drop forbidden capabilities
*  retroactively (a widget that asked for `popover` but the
*  surface forbids `popover` should fall back to inline). */
function applyParentPolicy(contract, caps, policy) {
	if (!policy) return {
		contract,
		caps
	};
	let nextCaps = caps;
	if (policy.permits || policy.forbids) {
		const permits = policy.permits ? new Set(policy.permits) : null;
		const forbids = new Set(policy.forbids ?? []);
		nextCaps = caps.filter((c) => {
			if (forbids.has(c)) return false;
			if (permits && !permits.has(c)) return false;
			return true;
		});
	}
	let nextContract = contract;
	if (policy.overrides) nextContract = {
		...contract,
		...policy.overrides
	};
	return {
		contract: nextContract,
		caps: nextCaps
	};
}
/** Pass 4: safety escalations.
*  Hard rules that no override or policy can bypass.
*
*  - A modal plane MUST trap focus, block pointer, and route
*    keyboard to modal.
*  - A child with `text-input` MUST give the child keyboard. */
function applySafetyEscalations(contract, input) {
	let c = { ...contract };
	if (c.lift.length > 0 && c.liftPlacement === "plane" || input.childSurface === "plane") {
		c.focus = "trapped";
		c.pointer = "blocked";
		c.keyboard = "modal";
		c.layer = "modal";
		c.commit = c.commit === "live" ? "live" : "explicit";
	}
	if (input.capabilities.includes("text-input")) {
		if (c.keyboard !== "modal") c.keyboard = "child-text";
	}
	return c;
}
/** Pass 5: instance overrides.
*  Applied LAST so a single column / tile can refine a final
*  dimension. Subject to safety: overrides cannot reverse a
*  safety escalation (the safety pass runs BEFORE overrides
*  conceptually but we re-apply safety after to make it true). */
function applyInstanceOverrides(contract, overrides, input) {
	if (!overrides) return contract;
	return applySafetyEscalations({
		...contract,
		...overrides
	}, input);
}
/**
* The main entry point. Pure function; same input → same output.
*
* Pipeline:
*   1. Look up base contract for (parent, child) — sharded across
*      all registered tables, last-registered wins.
*   2. Apply intent refinement (preview vs editor).
*   3. Apply capability hints (widget shape).
*   4. Apply parent surface policy (permits / forbids / overrides).
*   5. Apply safety escalations (modal / text-input).
*   6. Apply instance overrides + re-run safety.
*
* Stable shape — returns a NEW object every call (no aliasing).
*/
function negotiateContract(input) {
	let contract = lookupBaseContract(input.parentSurface, input.childSurface);
	contract = applyIntent(contract, input);
	contract = applyCapabilities(contract, input.capabilities);
	const policyApplied = applyParentPolicy(contract, input.capabilities, input.parentPolicy);
	contract = policyApplied.contract;
	const filteredCaps = policyApplied.caps;
	contract = applySafetyEscalations(contract, {
		...input,
		capabilities: filteredCaps
	});
	contract = applyInstanceOverrides(contract, input.instanceOverrides, {
		...input,
		capabilities: filteredCaps
	});
	return contract;
}
/**
* Convenience entry point. Take a widget's `capabilities` array
* (the new shape — `Capability[]`) and the surface pair,
* negotiate the contract. Most callers use this rather than
* `negotiateContract` directly because the parent/child
* intent + capability propagation is the boilerplate.
*/
function negotiateForWidget(args) {
	return negotiateContract({
		parentSurface: args.parentSurface,
		parentIntent: args.parentIntent ?? "editor",
		childSurface: args.childSurface,
		childIntent: args.childIntent,
		capabilities: args.widgetCapabilities ?? [],
		parentPolicy: args.parentPolicy,
		instanceOverrides: args.instanceOverrides
	});
}
function validateProjectionConformance(projection, adapter, options = {}) {
	const requireAllNodes = options.requireAllNodes ?? true;
	const requireProjectedDecals = options.requireProjectedDecals ?? false;
	const adapterNodes = new Map(adapter.nodes.map((node) => [node.id, node]));
	const adapterTabIds = adapter.nodes.filter((node) => node.tabIndex === 0).map((node) => node.id);
	const semanticIssues = [];
	const visualIssues = [];
	const issues = [];
	const nodeReports = [];
	const addSemantic = (code, message, id) => {
		semanticIssues.push(message);
		issues.push({
			code,
			message,
			id,
			severity: "error"
		});
	};
	const addVisual = (code, message, id) => {
		visualIssues.push(message);
		issues.push({
			code,
			message,
			id,
			severity: "error"
		});
	};
	if (!sameIds(projection.traversal.ids, adapterTabIds)) addSemantic("tab-order-mismatch", `DOM tabbables ${joinIds(adapterTabIds)} do not match projection traversal ${joinIds(projection.traversal.ids)}`);
	const expectedTraversalIds = options.expectedTraversalIds ?? null;
	if (expectedTraversalIds && !sameIds(projection.traversal.ids, expectedTraversalIds)) addSemantic("expected-traversal-mismatch", `Projection traversal ${joinIds(projection.traversal.ids)} does not match expected ${joinIds(expectedTraversalIds)}`);
	const focusedId = projection.nodes.find((node) => node.focused)?.id ?? null;
	if (focusedId && adapter.activeDomId !== focusedId) addSemantic("dom-focus-mismatch", `DOM focus ${adapter.activeDomId ?? "none"} does not match projected focus ${focusedId}`, focusedId);
	for (const node of projection.nodes) {
		const adapterNode = adapterNodes.get(node.id);
		if (requireAllNodes && !adapterNode) addVisual("missing-node", `Missing adapter node for projected surface ${node.id}`, node.id);
		const nodeIssues = validateProjectedNode(node, adapterNode);
		for (const issue of nodeIssues) {
			issues.push(issue);
			if (issue.code.startsWith("tabindex") || issue.code === "stop-reason-mismatch") semanticIssues.push(issue.message);
			else visualIssues.push(issue.message);
		}
		nodeReports.push({
			id: node.id,
			traversalStop: node.traversalStop,
			traversalReason: node.traversalReason,
			selectable: node.selectable,
			editable: node.editable,
			receiver: node.receiver,
			browserFocusable: node.browserFocusable,
			programmaticFocusable: node.programmaticFocusable,
			expectedTabIndex: node.tabIndex,
			actualTabIndex: adapterNode?.tabIndex,
			focused: node.focused,
			selected: node.selected,
			hovered: node.hovered,
			focusPath: node.focusPath,
			layerRoles: node.layerRoles,
			adornments: node.adornments,
			issues: nodeIssues
		});
	}
	for (const adapterNode of adapter.nodes) if (!projection.nodeMap.has(adapterNode.id)) addSemantic("unknown-adapter-node", `Adapter node ${adapterNode.id} is not present in projection`, adapterNode.id);
	for (const generatedId of options.generatedIds ?? []) if (!adapterNodes.get(generatedId)?.generated) addVisual("missing-generated-marker", `${generatedId} is generated but lacks generated projection marker`, generatedId);
	const keyOwners = (options.activityLayers ?? []).filter((layer) => layer.keyOwner);
	if (keyOwners.length > 1) addSemantic("multiple-key-owners", `Multiple key owners: ${keyOwners.map((layer) => layer.id).join(", ")}`);
	for (const layer of options.activityLayers ?? []) {
		const adapterNode = adapterNodes.get(layer.id) ?? (layer.sourceId ? adapterNodes.get(layer.sourceId) : void 0);
		if (!Boolean(adapterNode || adapter.layerIds?.includes(layer.id))) {
			addVisual("missing-layer-projection", `Layer ${layer.role}:${layer.id} has no visible adapter projection`, layer.id);
			continue;
		}
		if (layer.role === "input" || layer.role === "preview") continue;
		if (!adapterNodeHasClass(adapterNode, `is-layer-${layer.role}`)) addVisual("missing-layer-class", `${layer.id} missing layer class is-layer-${layer.role}`, layer.id);
	}
	if (requireProjectedDecals) {
		for (const decal of projection.visualDecals) if (!adapterDecalExists(adapter.decals ?? [], decal.kind, decal.ids)) addVisual("missing-decal", `Missing ${decal.kind} decal for ${joinIds(decal.ids)}`);
	}
	return {
		ok: semanticIssues.length === 0 && visualIssues.length === 0,
		semanticIssues,
		visualIssues,
		issues,
		traversalIds: projection.traversal.ids,
		adapterTabIds,
		expectedTraversalIds,
		nodes: nodeReports
	};
}
function validateProjectedNode(node, adapterNode) {
	if (!adapterNode) return [];
	const issues = [];
	const add = (code, message) => {
		issues.push({
			code,
			message,
			id: node.id,
			severity: "error"
		});
	};
	if (adapterNode.tabIndex !== node.tabIndex) add("tabindex-mismatch", `${node.id} tabindex ${formatTabIndex(adapterNode.tabIndex)} does not match projection ${formatTabIndex(node.tabIndex)}`);
	if (node.traversalReason !== adapterNode.stopReason) add("stop-reason-mismatch", `${node.id} stop reason ${adapterNode.stopReason ?? "none"} does not match projection ${node.traversalReason ?? "none"}`);
	if (node.traversalStop !== adapterNodeHasClass(adapterNode, "is-navigable-target")) add("navigable-class-mismatch", `${node.id} navigable class does not match traversal projection`);
	if (node.receiver !== adapterNodeHasClass(adapterNode, "is-drop-target")) add("receiver-class-mismatch", `${node.id} drop-target class does not match receiver projection`);
	if (node.editable !== adapterNodeHasClass(adapterNode, "is-editable")) add("editable-class-mismatch", `${node.id} editable class does not match editable projection`);
	if (node.traversalStop && node.editable !== adapterNodeHasClass(adapterNode, "is-editable-target")) add("editable-target-class-mismatch", `${node.id} editable-target class does not match editable traversal projection`);
	if (node.focused !== adapterNodeHasClass(adapterNode, "is-focused")) add("focused-class-mismatch", `${node.id} focused class does not match projection`);
	if (node.focusPath !== adapterNodeHasClass(adapterNode, "is-focus-path")) add("focus-path-class-mismatch", `${node.id} focus-path class does not match projection`);
	if (node.selected !== adapterNodeHasClass(adapterNode, "is-selected")) add("selected-class-mismatch", `${node.id} selected class does not match projection`);
	for (const role of node.layerRoles) if (!adapterNodeHasClass(adapterNode, `is-layer-${role}`)) add("layer-class-mismatch", `${node.id} missing projected layer class is-layer-${role}`);
	return issues;
}
function adapterNodeHasClass(node, className) {
	return Boolean(node?.classes?.includes(className));
}
function adapterDecalExists(decals, kind, ids) {
	return decals.some((decal) => decal.kind === kind && sameIds(decal.ids, ids));
}
function sameIds(a, b) {
	return a.length === b.length && a.every((id, index) => id === b[index]);
}
function joinIds(ids) {
	return ids.length > 0 ? ids.join(" -> ") : "none";
}
function formatTabIndex(value) {
	return value === void 0 || value === null ? "none" : String(value);
}
var StyleId$1 = "boxel-surface-selection-decals-styles";
var DECAL_THEME_VARIABLES$1 = [
	"--boxel-highlight",
	"--surface-decal-highlight",
	"--surface-decal-highlight-fill",
	"--surface-decal-highlight-fill-soft"
];
function ensureStyles$1(document) {
	if (document.getElementById(StyleId$1)) return;
	const style = document.createElement("style");
	style.id = StyleId$1;
	style.textContent = `
    .bx-surface-selection-decal-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      contain: layout style;
    }

    .bx-surface-selection-decal {
      position: fixed;
      box-sizing: border-box;
      pointer-events: none;
      border: 2px solid var(--surface-decal-highlight, #00ffba);
      border-radius: 2px;
      background: transparent;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--surface-decal-highlight, #00ffba) 22%, transparent),
        0 0 0 4px var(--surface-decal-highlight-fill, rgba(0, 255, 186, 0.18));
    }

    .bx-surface-selection-decal--range {
      background: var(--surface-decal-highlight-fill-soft, rgba(0, 255, 186, 0.10));
    }
  `;
	document.head.append(style);
}
function syncDecalThemeVariables$1(source, target) {
	const styles = source.ownerDocument.defaultView?.getComputedStyle(source);
	if (!styles) return;
	for (const name of DECAL_THEME_VARIABLES$1) {
		const value = styles.getPropertyValue(name).trim();
		if (value) target.style.setProperty(name, value);
	}
}
function targetSelectors(targets) {
	if (!targets) return [];
	if (typeof targets === "string") return targets ? [targets] : [];
	return targets.filter((target) => target.length > 0);
}
function clipRectFor$1(document, element, selector) {
	const view = document.defaultView ?? window;
	const viewport = new DOMRect(0, 0, view.innerWidth, view.innerHeight);
	if (!selector) return viewport;
	const clip = element.closest(selector) ?? document.querySelector(selector);
	if (!clip) return viewport;
	return intersectDomRects$1(viewport, clip.getBoundingClientRect()) ?? viewport;
}
function intersectDomRects$1(a, b) {
	const left = Math.max(a.left, b.left);
	const top = Math.max(a.top, b.top);
	const right = Math.min(a.right, b.right);
	const bottom = Math.min(a.bottom, b.bottom);
	if (right <= left || bottom <= top) return null;
	return new DOMRect(left, top, right - left, bottom - top);
}
function rectForElement$1(element, clip) {
	const rect = intersectDomRects$1(element.getBoundingClientRect(), clip);
	if (!rect) return null;
	return {
		id: element.id || element.dataset["surfaceId"],
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height
	};
}
var surfaceSelectionDecals = modifier((element, [targets], options) => {
	const document = element.ownerDocument;
	const view = document.defaultView ?? window;
	ensureStyles$1(document);
	const root = document.createElement("div");
	const z = SURFACE_LAYERS.allocate("selection");
	root.className = "bx-surface-selection-decal-layer";
	root.dataset["surfaceLayerTier"] = "selection";
	root.dataset["surfaceLayerZ"] = String(z);
	root.style.zIndex = String(z);
	document.body.append(root);
	let frame = 0;
	const render = () => {
		frame = 0;
		syncDecalThemeVariables$1(element, root);
		root.replaceChildren();
		if (options.active === false) return;
		const clip = clipRectFor$1(document, element, options.clipTo);
		const rects = targetSelectors(targets).map((selector) => document.querySelector(selector)).filter((target) => target !== null).map((target) => rectForElement$1(target, clip)).filter((rect) => rect !== null);
		const boxes = SURFACE_LAYERS.collapseSelectionBoxes(rects, { tolerance: options.tolerance });
		const variant = options.variant ?? "selection";
		for (const box of boxes) {
			const decal = document.createElement("div");
			decal.className = [
				"bx-surface-selection-decal",
				`bx-surface-selection-decal--${variant}`,
				options.className ?? ""
			].filter(Boolean).join(" ");
			decal.dataset["surfaceSelectionIds"] = box.ids.join(" ");
			decal.style.left = `${box.left}px`;
			decal.style.top = `${box.top}px`;
			decal.style.width = `${box.width}px`;
			decal.style.height = `${box.height}px`;
			root.append(decal);
		}
	};
	const schedule = () => {
		if (frame !== 0) return;
		frame = view.requestAnimationFrame(render);
	};
	schedule();
	view.addEventListener("scroll", schedule, true);
	view.addEventListener("resize", schedule);
	return () => {
		if (frame !== 0) view.cancelAnimationFrame(frame);
		view.removeEventListener("scroll", schedule, true);
		view.removeEventListener("resize", schedule);
		root.remove();
		SURFACE_LAYERS.release(z);
	};
});
var StyleId = "boxel-surface-decal-layer-styles";
var SVG_NS = "http://www.w3.org/2000/svg";
var DEFAULT_DECAL_STROKE_WIDTH = 2;
var DECAL_ZOOM_VARIABLE = "--surface-decal-zoom";
var DECAL_STROKE_WIDTH_VARIABLE = "--surface-decal-stroke-width";
var KIND_CLASS = { receiver: "drop-target" };
var DECAL_THEME_VARIABLES = [
	"--boxel-highlight",
	"--boxel-orange",
	"--boxel-lilac",
	"--boxel-lilac-lift",
	"--surface-decal-highlight",
	"--surface-decal-transfer",
	"--surface-decal-inspect",
	"--surface-decal-context",
	"--surface-decal-active-edit-bg",
	"--surface-decal-highlight-fill",
	"--surface-decal-highlight-fill-soft",
	"--surface-decal-transfer-fill",
	"--surface-decal-transfer-fill-soft",
	"--surface-decal-inspect-fill",
	"--surface-decal-context-fill",
	"--surface-decal-hover-fill"
];
function ensureStyles(document) {
	if (document.getElementById(StyleId)) return;
	const style = document.createElement("style");
	style.id = StyleId;
	style.textContent = `
    .bx-surface-decal-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      contain: layout style;
      --surface-decal-stroke-width: 2px;
      --surface-decal-fine-stroke-width: max(1px, calc(var(--surface-decal-stroke-width) / 2));
      --surface-decal-halo-width: calc(var(--surface-decal-stroke-width) * 2);
      --surface-decal-inspect-halo-width: calc(var(--surface-decal-stroke-width) * 2.5);
    }

    .bx-surface-lift-decal-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      contain: layout style;
      --surface-decal-stroke-width: 2px;
      --surface-decal-fine-stroke-width: max(1px, calc(var(--surface-decal-stroke-width) / 2));
      --surface-decal-halo-width: calc(var(--surface-decal-stroke-width) * 2);
      --surface-decal-inspect-halo-width: calc(var(--surface-decal-stroke-width) * 2.5);
    }

    .bx-surface-decal {
      position: fixed;
      box-sizing: border-box;
      pointer-events: none;
      border-radius: 2px;
      background: transparent;
    }

    .bx-surface-decal--focus,
    .bx-surface-decal--selection,
    .bx-surface-decal--lift-focus {
      border: var(--surface-decal-stroke-width) solid var(--surface-decal-highlight, #00ffba);
      box-shadow:
        0 0 0 var(--surface-decal-fine-stroke-width) color-mix(in srgb, var(--surface-decal-highlight, #00ffba) 22%, transparent),
        0 0 0 var(--surface-decal-halo-width) var(--surface-decal-highlight-fill, rgba(0, 255, 186, 0.18));
    }

    .bx-surface-decal--range {
      border: var(--surface-decal-stroke-width) solid var(--surface-decal-highlight, #00ffba);
      background: var(--surface-decal-highlight-fill-soft, rgba(0, 255, 186, 0.10));
      box-shadow:
        0 0 0 var(--surface-decal-fine-stroke-width) color-mix(in srgb, var(--surface-decal-highlight, #00ffba) 18%, transparent),
        0 0 0 var(--surface-decal-halo-width) var(--surface-decal-highlight-fill-soft, rgba(0, 255, 186, 0.10));
    }

    .bx-surface-decal--edit-anchor {
      border: var(--surface-decal-fine-stroke-width) solid color-mix(in srgb, var(--surface-decal-highlight, #00ffba) 32%, transparent);
      background: color-mix(in srgb, var(--surface-decal-highlight, #00ffba) 3%, transparent);
      box-shadow: 0 0 0 calc(var(--surface-decal-stroke-width) * 1.5) color-mix(in srgb, var(--surface-decal-highlight, #00ffba) 5%, transparent);
    }

    .bx-surface-decal--inspect {
      border: var(--surface-decal-stroke-width) solid var(--surface-decal-inspect, #a66dfa);
      box-shadow:
        0 0 0 var(--surface-decal-fine-stroke-width) color-mix(in srgb, var(--surface-decal-inspect, #a66dfa) 42%, transparent),
        0 0 0 var(--surface-decal-inspect-halo-width) var(--surface-decal-inspect-fill, rgba(166, 109, 250, 0.18)),
        0 0 18px color-mix(in srgb, var(--surface-decal-inspect, #a66dfa) 20%, transparent);
    }

    .bx-surface-decal--receiver,
    .bx-surface-decal--drop-target {
      border: var(--surface-decal-stroke-width) dashed var(--surface-decal-transfer, #ff7f00);
      background: var(--surface-decal-transfer-fill-soft, rgba(255, 127, 0, 0.08));
      box-shadow: 0 0 0 var(--surface-decal-halo-width) var(--surface-decal-transfer-fill, rgba(255, 127, 0, 0.16));
    }

    .bx-surface-decal--source,
    .bx-surface-decal--origin {
      border: var(--surface-decal-stroke-width) dashed var(--surface-decal-transfer, #ff7f00);
      background: var(--surface-decal-transfer-fill, rgba(255, 127, 0, 0.16));
      box-shadow: 0 0 0 calc(var(--surface-decal-stroke-width) * 1.5) var(--surface-decal-transfer-fill, rgba(255, 127, 0, 0.16));
    }

    .bx-surface-decal--destination {
      border: var(--surface-decal-stroke-width) solid var(--surface-decal-transfer, #ff7f00);
      background: var(--surface-decal-transfer-fill, rgba(255, 127, 0, 0.16));
      box-shadow: 0 0 0 var(--surface-decal-halo-width) var(--surface-decal-transfer-fill-soft, rgba(255, 127, 0, 0.08));
    }

    .bx-surface-decal--context,
    .bx-surface-decal--hover {
      border: var(--surface-decal-fine-stroke-width) solid color-mix(in srgb, var(--surface-decal-context, #919191) 22%, transparent);
      background: var(--surface-decal-context-fill, rgba(0, 0, 0, 0.04));
      opacity: 0.72;
    }

    .bx-surface-decal--hover {
      background: var(--surface-decal-hover-fill, rgba(0, 0, 0, 0.04));
    }

    .bx-surface-decal-path-svg {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: visible;
      pointer-events: none;
      contain: layout style;
    }

    .bx-surface-decal-path {
      fill: none;
      stroke: var(--surface-decal-highlight, #00ffba);
      stroke-width: var(--surface-decal-stroke-width);
      vector-effect: non-scaling-stroke;
      filter: drop-shadow(0 0 var(--surface-decal-halo-width) var(--surface-decal-highlight-fill, rgba(0, 255, 186, 0.18)));
    }

    .bx-surface-decal-path--inspect {
      stroke: var(--surface-decal-inspect, #a66dfa);
      filter: drop-shadow(0 0 var(--surface-decal-inspect-halo-width) var(--surface-decal-inspect-fill, rgba(166, 109, 250, 0.18)));
    }

    .bx-surface-decal-path--receiver,
    .bx-surface-decal-path--drop-target,
    .bx-surface-decal-path--source,
    .bx-surface-decal-path--origin,
    .bx-surface-decal-path--destination {
      stroke: var(--surface-decal-transfer, #ff7f00);
      stroke-dasharray: 6 4;
      filter: drop-shadow(0 0 var(--surface-decal-halo-width) var(--surface-decal-transfer-fill, rgba(255, 127, 0, 0.16)));
    }
  `;
	document.head.append(style);
}
function syncDecalThemeVariables(source, target) {
	const styles = source.ownerDocument.defaultView?.getComputedStyle(source);
	if (!styles) return;
	for (const name of DECAL_THEME_VARIABLES) {
		const value = styles.getPropertyValue(name).trim();
		if (value) target.style.setProperty(name, value);
	}
}
function syncDecalStrokeWidth(source, runtime, ...targets) {
	const styles = source.ownerDocument.defaultView?.getComputedStyle(source);
	if (!styles) return;
	const explicitStroke = parsePositiveNumber(styles.getPropertyValue(DECAL_STROKE_WIDTH_VARIABLE));
	const zoom = runtime?.viewport.zoom ?? parsePositiveNumber(styles.getPropertyValue(DECAL_ZOOM_VARIABLE)) ?? 1;
	const strokeWidth = explicitStroke ?? Math.max(DEFAULT_DECAL_STROKE_WIDTH / zoom, 1);
	const rounded = Math.round(strokeWidth * 1e3) / 1e3;
	for (const target of targets) target.style.setProperty(DECAL_STROKE_WIDTH_VARIABLE, `${rounded}px`);
}
function parsePositiveNumber(value) {
	const parsed = Number.parseFloat(value.trim());
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
function clipRectFor(document, element, clip) {
	const view = document.defaultView ?? window;
	const viewport = new DOMRect(0, 0, view.innerWidth, view.innerHeight);
	if (clip === "none") return null;
	if (clip === "viewport") return viewport;
	return intersectDomRects(viewport, element.getBoundingClientRect()) ?? viewport;
}
function intersectDomRects(a, b) {
	const left = Math.max(a.left, b.left);
	const top = Math.max(a.top, b.top);
	const right = Math.min(a.right, b.right);
	const bottom = Math.min(a.bottom, b.bottom);
	if (right <= left || bottom <= top) return null;
	return new DOMRect(left, top, right - left, bottom - top);
}
function sourceRectForElement(element) {
	const elementRect = element.getBoundingClientRect();
	return elementRect.width > 0 && elementRect.height > 0 ? elementRect : descendantFallbackRectForElement(element);
}
function radiusSourceForElement(element) {
	const elementRect = element.getBoundingClientRect();
	if (elementRect.width > 0 && elementRect.height > 0) return element;
	if (!allowsDescendantRectFallback(element)) return element;
	let best = null;
	let bestArea = 0;
	for (const descendant of element.querySelectorAll("*")) {
		const rect = descendant.getBoundingClientRect();
		const area = rect.width * rect.height;
		if (rect.width <= 0 || rect.height <= 0 || area <= bestArea) continue;
		best = descendant;
		bestArea = area;
	}
	return best ?? element;
}
function cornerRadiiForElement(element, rect) {
	const styles = element.ownerDocument.defaultView?.getComputedStyle(element);
	if (!styles) return void 0;
	const width = rect.width;
	const height = rect.height;
	const max = Math.max(0, Math.min(width, height) / 2);
	return {
		topLeft: clampDecalRadius(parseRadius(styles.borderTopLeftRadius, width, height), max),
		topRight: clampDecalRadius(parseRadius(styles.borderTopRightRadius, width, height), max),
		bottomRight: clampDecalRadius(parseRadius(styles.borderBottomRightRadius, width, height), max),
		bottomLeft: clampDecalRadius(parseRadius(styles.borderBottomLeftRadius, width, height), max)
	};
}
function parseRadius(value, width, height) {
	const token = value.trim().split(/\s+/)[0] ?? "";
	if (token.endsWith("px")) {
		const parsed = Number.parseFloat(token);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	if (token.endsWith("%")) {
		const parsed = Number.parseFloat(token);
		return Number.isFinite(parsed) ? Math.min(width, height) * (parsed / 100) : 0;
	}
	const parsed = Number.parseFloat(token);
	return Number.isFinite(parsed) ? parsed : 0;
}
function clampDecalRadius(value, max) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(value, max));
}
function cornerRadiiCss(radius) {
	if (!radius) return "";
	return [
		radius.topLeft,
		radius.topRight,
		radius.bottomRight,
		radius.bottomLeft
	].map((value) => `${Math.round(value * 100) / 100}px`).join(" ");
}
function hasMeaningfulVisibleArea(clipped, source) {
	const minWidth = Math.min(8, source.width);
	const minHeight = Math.min(8, source.height);
	return clipped.width >= minWidth && clipped.height >= minHeight;
}
function rectForElement(element) {
	const sourceRect = sourceRectForElement(element);
	if (!sourceRect) return null;
	const radiusElement = radiusSourceForElement(element);
	return {
		id: element.getAttribute("data-ladder-id") ?? element.dataset["bxGridTraversalId"] ?? element.id,
		left: sourceRect.left,
		top: sourceRect.top,
		width: sourceRect.width,
		height: sourceRect.height,
		radius: cornerRadiiForElement(radiusElement, sourceRect)
	};
}
function decalShapeForTarget(element) {
	const explicit = element.getAttribute("data-surface-decal-shape");
	if (explicit === "rect" || explicit === "path" || explicit === "none") return explicit;
	if (element.classList.contains("boxel-canvas__edge") || element.getAttribute("data-surface-component") === "edge" || element.hasAttribute("data-surface-canvas-edge")) return "path";
	return "rect";
}
function pathForElement(element) {
	if (element instanceof SVGPathElement) return element;
	return element.querySelector("[data-surface-decal-path], .boxel-canvas__edge-path, path:not(.boxel-canvas__edge-interaction)");
}
function hiddenReasonForElement(element, clip) {
	const sourceRect = sourceRectForElement(element);
	if (!sourceRect) return "missing-layout";
	return intersectDomRects(sourceRect, clip) ? null : "offscreen-or-clipped";
}
function descendantFallbackRectForElement(element) {
	if (!allowsDescendantRectFallback(element)) return null;
	return descendantUnionRect(element);
}
function allowsDescendantRectFallback(element) {
	const surface = element.getAttribute("data-surface") ?? element.getAttribute("data-surface-component");
	return surface === "cell" || surface === "run" || surface === "unit";
}
function descendantUnionRect(element) {
	let left = Number.POSITIVE_INFINITY;
	let top = Number.POSITIVE_INFINITY;
	let right = Number.NEGATIVE_INFINITY;
	let bottom = Number.NEGATIVE_INFINITY;
	let found = false;
	for (const descendant of element.querySelectorAll("*")) {
		const rect = descendant.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) continue;
		left = Math.min(left, rect.left);
		top = Math.min(top, rect.top);
		right = Math.max(right, rect.right);
		bottom = Math.max(bottom, rect.bottom);
		found = true;
	}
	return found ? new DOMRect(left, top, right - left, bottom - top) : null;
}
function parsePixelValue(value) {
	const trimmed = value.trim();
	if (!trimmed.endsWith("px")) return null;
	const parsed = Number.parseFloat(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
}
function rectForFixedLiftElement(element, clip) {
	if (element.style.position !== "fixed") return null;
	const left = parsePixelValue(element.style.left);
	const top = parsePixelValue(element.style.top);
	if (left === null || top === null) return null;
	const measured = element.getBoundingClientRect();
	const width = measured.width || element.offsetWidth;
	const height = measured.height || element.offsetHeight;
	if (width <= 0 || height <= 0) return null;
	const rect = intersectDomRects(new DOMRect(left, top, width, height), clip);
	if (!rect) return null;
	return {
		id: element.getAttribute("data-ladder-id") ?? element.dataset["bxGridTraversalId"] ?? element.id,
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height
	};
}
function rectForLiftElement(element, clip) {
	return rectForFixedLiftElement(element, clip) ?? rectForElement(element);
}
function topmostKeyboardLift(document) {
	return Array.from(document.querySelectorAll("[data-bx-lift][data-bx-lift-keyboard-lock=\"true\"]")).filter((lift) => lift.isConnected).sort((a, b) => {
		const za = Number(a.dataset["surfaceLayerZ"] ?? 0);
		return Number(b.dataset["surfaceLayerZ"] ?? 0) - za;
	})[0] ?? null;
}
function liftAnchorElement(lift) {
	const selector = lift.getAttribute("data-bx-lift-anchor-selector");
	if (!selector) return null;
	try {
		return lift.ownerDocument.querySelector(selector);
	} catch {
		return null;
	}
}
function liftUsesShadowFocus(lift) {
	const kind = lift.getAttribute("data-bx-lift-kind");
	return kind === "edit" || kind === "tools";
}
function mutationInsideDecalLayer(target, root, liftRoot) {
	return target === root || target === liftRoot || target instanceof Node && (root.contains(target) || liftRoot.contains(target));
}
function nodeContainsLift(node) {
	return node instanceof HTMLElement && (node.matches("[data-bx-lift]") || node.querySelector("[data-bx-lift]") !== null);
}
function mutationAffectsLiftLayer(mutation, root, liftRoot) {
	if (mutationInsideDecalLayer(mutation.target, root, liftRoot)) return false;
	if (mutation.type === "attributes") return mutation.target instanceof HTMLElement && (mutation.target.matches("[data-bx-lift]") || mutation.target.closest("[data-bx-lift]") !== null);
	for (const node of [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)]) if (nodeContainsLift(node)) return true;
	return false;
}
function renderLiftFocusDecal(document, root) {
	root.replaceChildren();
	const lift = topmostKeyboardLift(document);
	if (!lift) {
		root.style.zIndex = "";
		return null;
	}
	if (liftUsesShadowFocus(lift)) {
		root.style.zIndex = "";
		return {
			lift,
			anchor: liftAnchorElement(lift),
			anchorDecal: true
		};
	}
	const rect = rectForLiftElement(lift, clipRectFor(document, lift, "viewport"));
	if (!rect) {
		root.style.zIndex = "";
		return {
			lift,
			anchor: liftAnchorElement(lift),
			anchorDecal: true
		};
	}
	const liftZ = Number(lift.dataset["surfaceLayerZ"] ?? 0);
	if (Number.isFinite(liftZ) && liftZ > 0) root.style.zIndex = String(liftZ + 1);
	const decal = document.createElement("div");
	decal.className = "bx-surface-decal bx-surface-decal--lift-focus";
	decal.dataset["surfaceDecalKind"] = "lift-focus";
	decal.dataset["surfaceDecalIds"] = lift.getAttribute("id") ?? lift.getAttribute("data-bx-lift-focus-token") ?? "active-lift";
	decal.style.left = `${rect.left}px`;
	decal.style.top = `${rect.top}px`;
	decal.style.width = `${rect.width}px`;
	decal.style.height = `${rect.height}px`;
	decal.style.borderRadius = cornerRadiiCss(cornerRadiiForElement(lift, rect)) || getComputedStyle(lift).borderRadius || "10px";
	root.append(decal);
	return {
		lift,
		anchor: liftAnchorElement(lift),
		anchorDecal: true
	};
}
function renderLiftAnchorDecal(document, root, state) {
	if (!state?.anchor || !state.anchorDecal) return;
	const rect = rectForElement(state.anchor);
	if (!rect) return;
	const decal = document.createElement("div");
	decal.className = "bx-surface-decal bx-surface-decal--edit-anchor";
	decal.dataset["surfaceDecalKind"] = "edit-anchor";
	decal.dataset["surfaceDecalLiftAnchor"] = "true";
	decal.dataset["surfaceDecalIds"] = state.anchor.getAttribute("data-ladder-id") ?? state.anchor.dataset["bxGridTraversalId"] ?? state.anchor.id ?? "lift-anchor";
	decal.style.left = `${rect.left}px`;
	decal.style.top = `${rect.top}px`;
	decal.style.width = `${rect.width}px`;
	decal.style.height = `${rect.height}px`;
	decal.style.borderRadius = cornerRadiiCss(rect.radius);
	root.append(decal);
}
function decalCompetesWithLiftAnchor(kind, targets, state) {
	if (!state?.anchor) return false;
	if (kind !== "focus" && kind !== "selection" && kind !== "source" && kind !== "range") return false;
	return targets.includes(state.anchor);
}
function modeFor(element, options) {
	if (options.mode) return options.mode;
	const raw = element.closest("[data-surface-mode]")?.dataset["surfaceMode"];
	if (raw === "use" || raw === "change" || raw === "inspect" || raw === "debug") return raw;
	return "use";
}
function decalsFor(element, options) {
	if (options.projection) return options.projection.visualDecals;
	return (options.runtime ?? surfaceRuntimeForElement(element))?.projection(projectionOptionsFor(element, options)).visualDecals ?? [];
}
function projectionOptionsFor(element, options) {
	const projectionOptions = { mode: modeFor(element, options) };
	if (options.rootId !== void 0) projectionOptions.rootId = options.rootId;
	return projectionOptions;
}
function classForKind(kind) {
	return KIND_CLASS[kind] ?? kind;
}
var surfaceDecalLayer = modifier((element, _positional, options) => {
	const document = element.ownerDocument;
	const view = document.defaultView ?? window;
	ensureStyles(document);
	const root = document.createElement("div");
	const liftRoot = document.createElement("div");
	const z = SURFACE_LAYERS.allocate("selection");
	root.className = "bx-surface-decal-layer";
	root.dataset["surfaceLayerTier"] = "selection";
	root.dataset["surfaceLayerZ"] = String(z);
	root.style.zIndex = String(z);
	options.scopeRelay?.stamp(root);
	document.body.append(root);
	liftRoot.className = "bx-surface-lift-decal-layer";
	liftRoot.dataset["surfaceLayerTier"] = "lift-focus";
	options.scopeRelay?.stamp(liftRoot);
	document.body.append(liftRoot);
	let frame = 0;
	let retryCount = 0;
	let subscribedRuntime = options.runtime ?? surfaceRuntimeForElement(element);
	let unsubscribeRuntimeSelection;
	let unsubscribeRuntimeViewport;
	const renderedDecals = /* @__PURE__ */ new Map();
	const removeLiftAnchorDecals = () => {
		for (const decal of root.querySelectorAll("[data-surface-decal-lift-anchor=\"true\"]")) decal.remove();
	};
	const clearRootDecals = () => {
		for (const decal of renderedDecals.values()) decal.remove();
		renderedDecals.clear();
		removeLiftAnchorDecals();
	};
	const upsertRectDecal = (key, decalModel, box) => {
		const existing = renderedDecals.get(key);
		if (existing && !(existing instanceof HTMLElement)) {
			existing.remove();
			renderedDecals.delete(key);
		}
		let decal = renderedDecals.get(key);
		if (!decal) {
			decal = document.createElement("div");
			renderedDecals.set(key, decal);
			root.append(decal);
		}
		const kindClass = classForKind(decalModel.kind);
		decal.className = [
			"bx-surface-decal",
			`bx-surface-decal--${decalModel.kind}`,
			kindClass !== decalModel.kind ? `bx-surface-decal--${kindClass}` : "",
			options.className ?? ""
		].filter(Boolean).join(" ");
		decal.dataset["surfaceDecalKey"] = key;
		decal.dataset["surfaceDecalKind"] = decalModel.kind;
		decal.dataset["surfaceDecalIds"] = box.ids.join(" ");
		decal.style.left = `${box.left}px`;
		decal.style.top = `${box.top}px`;
		decal.style.width = `${box.width}px`;
		decal.style.height = `${box.height}px`;
		decal.style.borderRadius = cornerRadiiCss(box.radius);
	};
	const upsertPathDecal = (key, decalModel, target) => {
		const sourcePath = pathForElement(target);
		const matrix = sourcePath?.getScreenCTM();
		const d = sourcePath?.getAttribute("d");
		if (!sourcePath || !matrix || !d) return false;
		const existing = renderedDecals.get(key);
		if (existing && !(existing instanceof SVGSVGElement)) {
			existing.remove();
			renderedDecals.delete(key);
		}
		let svg = renderedDecals.get(key);
		if (!svg) {
			svg = document.createElementNS(SVG_NS, "svg");
			renderedDecals.set(key, svg);
			root.append(svg);
		}
		const kindClass = classForKind(decalModel.kind);
		svg.setAttribute("class", ["bx-surface-decal-path-svg", options.className ?? ""].filter(Boolean).join(" "));
		svg.setAttribute("aria-hidden", "true");
		svg.dataset["surfaceDecalKey"] = key;
		svg.dataset["surfaceDecalKind"] = decalModel.kind;
		svg.dataset["surfaceDecalIds"] = decalModel.ids.join(" ");
		svg.replaceChildren();
		const path = document.createElementNS(SVG_NS, "path");
		path.setAttribute("class", [
			"bx-surface-decal-path",
			`bx-surface-decal-path--${decalModel.kind}`,
			kindClass !== decalModel.kind ? `bx-surface-decal-path--${kindClass}` : ""
		].filter(Boolean).join(" "));
		path.setAttribute("d", d);
		path.setAttribute("transform", `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
		svg.append(path);
		return true;
	};
	const removeStaleDecals = (nextKeys) => {
		for (const [key, decal] of renderedDecals) {
			if (nextKeys.has(key)) continue;
			decal.remove();
			renderedDecals.delete(key);
		}
	};
	const syncSubscriptions = () => {
		const nextRuntime = options.runtime ?? surfaceRuntimeForElement(element);
		if (nextRuntime !== subscribedRuntime) {
			unsubscribeRuntimeSelection?.();
			unsubscribeRuntimeViewport?.();
			unsubscribeRuntimeSelection = void 0;
			unsubscribeRuntimeViewport = void 0;
			subscribedRuntime = nextRuntime;
			unsubscribeRuntimeSelection = subscribedRuntime?.subscribeSelection(schedule);
			unsubscribeRuntimeViewport = subscribedRuntime?.subscribeViewport(schedule);
		}
		return subscribedRuntime;
	};
	const render = () => {
		frame = 0;
		options.scopeRelay?.stamp(root);
		options.scopeRelay?.stamp(liftRoot);
		syncDecalThemeVariables(element, root);
		syncDecalThemeVariables(element, liftRoot);
		root.dataset["surfaceDecalActive"] = String(options.active !== false);
		if (options.active === false) {
			clearRootDecals();
			liftRoot.replaceChildren();
			liftRoot.style.zIndex = "";
			return;
		}
		removeLiftAnchorDecals();
		const activeLift = renderLiftFocusDecal(document, liftRoot);
		renderLiftAnchorDecal(document, root, activeLift);
		const runtime = syncSubscriptions();
		syncDecalStrokeWidth(element, runtime, root, liftRoot);
		const clip = clipRectFor(document, element, options.clip ?? "none");
		const diagnosticClip = clip ?? clipRectFor(document, element, "viewport");
		const kindFilter = options.kinds ? new Set(options.kinds) : null;
		const decals = decalsFor(element, options);
		let targetCount = 0;
		let measuredTargetCount = 0;
		let hiddenTargetCount = 0;
		let boxCount = 0;
		root.dataset["surfaceDecalModelCount"] = String(decals.length);
		root.dataset["surfaceDecalRuntime"] = runtime ? "ready" : "missing";
		delete root.dataset["surfaceDecalFirstTargetRect"];
		delete root.dataset["surfaceDecalFirstHiddenReason"];
		if (!runtime && retryCount < 30) {
			retryCount += 1;
			schedule();
			return;
		}
		retryCount = 0;
		const nextDecalKeys = /* @__PURE__ */ new Set();
		const kindIndexes = /* @__PURE__ */ new Map();
		for (const decalModel of decals) {
			if (kindFilter && !kindFilter.has(decalModel.kind)) continue;
			const targets = surfaceElementsForIds(element, decalModel.ids, runtime);
			if (decalCompetesWithLiftAnchor(decalModel.kind, targets, activeLift)) continue;
			targetCount += targets.length;
			const firstTarget = targets[0];
			if (firstTarget && root.dataset["surfaceDecalFirstTargetRect"] === void 0) {
				const rect = firstTarget.getBoundingClientRect();
				root.dataset["surfaceDecalFirstTargetRect"] = [
					Math.round(rect.left),
					Math.round(rect.top),
					Math.round(rect.width),
					Math.round(rect.height)
				].join(" ");
			}
			const rects = [];
			let pathCount = 0;
			for (const target of targets) {
				const shape = decalShapeForTarget(target);
				if (shape === "none") continue;
				if (shape === "path") {
					const key = `${decalModel.kind}:path:${pathCount}`;
					if (upsertPathDecal(key, decalModel, target)) {
						nextDecalKeys.add(key);
						pathCount += 1;
						measuredTargetCount += 1;
						continue;
					}
				}
				const rect = rectForElement(target);
				if (rect) {
					measuredTargetCount += 1;
					const visibleRect = clip ? clipSurfaceLayerRect(rect, clip) : rect;
					if (visibleRect && hasMeaningfulVisibleArea(visibleRect, rect)) {
						rects.push(visibleRect);
						continue;
					}
					hiddenTargetCount += 1;
					root.dataset["surfaceDecalFirstHiddenReason"] ??= diagnosticClip ? hiddenReasonForElement(target, diagnosticClip) ?? "offscreen-or-clipped" : "offscreen-or-clipped";
					continue;
				}
				hiddenTargetCount += 1;
				root.dataset["surfaceDecalFirstHiddenReason"] ??= diagnosticClip ? hiddenReasonForElement(target, diagnosticClip) ?? "unknown" : "unknown";
			}
			const boxes = SURFACE_LAYERS.collapseSelectionBoxes(rects, { tolerance: options.tolerance });
			boxCount += boxes.length;
			for (const box of boxes) {
				const index = kindIndexes.get(decalModel.kind) ?? 0;
				kindIndexes.set(decalModel.kind, index + 1);
				const key = `${decalModel.kind}:${index}`;
				nextDecalKeys.add(key);
				upsertRectDecal(key, decalModel, box);
			}
		}
		removeStaleDecals(nextDecalKeys);
		root.dataset["surfaceDecalTargetCount"] = String(targetCount);
		root.dataset["surfaceDecalMeasuredTargetCount"] = String(measuredTargetCount);
		root.dataset["surfaceDecalHiddenTargetCount"] = String(hiddenTargetCount);
		root.dataset["surfaceDecalBoxCount"] = String(boxCount);
	};
	const schedule = () => {
		if (frame !== 0) return;
		frame = view.requestAnimationFrame(render);
	};
	unsubscribeRuntimeSelection = subscribedRuntime?.subscribeSelection(schedule);
	unsubscribeRuntimeViewport = subscribedRuntime?.subscribeViewport(schedule);
	schedule();
	element.addEventListener(SURFACE_GEOMETRY_CHANGE_EVENT, schedule);
	view.addEventListener("scroll", schedule, true);
	view.addEventListener("resize", schedule);
	const liftObserver = new MutationObserver((mutations) => {
		if (mutations.some((mutation) => mutationAffectsLiftLayer(mutation, root, liftRoot))) schedule();
	});
	liftObserver.observe(document.body, {
		attributes: true,
		attributeFilter: [
			"data-bx-lift",
			"data-bx-lift-keyboard-lock",
			"data-surface-layer-z",
			"data-bx-lift-anchor-selector"
		],
		childList: true,
		subtree: true
	});
	return () => {
		if (frame !== 0) view.cancelAnimationFrame(frame);
		unsubscribeRuntimeSelection?.();
		unsubscribeRuntimeViewport?.();
		liftObserver.disconnect();
		element.removeEventListener(SURFACE_GEOMETRY_CHANGE_EVENT, schedule);
		view.removeEventListener("scroll", schedule, true);
		view.removeEventListener("resize", schedule);
		clearRootDecals();
		root.remove();
		liftRoot.remove();
		SURFACE_LAYERS.release(z);
	};
});
var _class, _descriptor;
/** What the host needs to know about the open lift. Three fields:
*  WHICH unit (row, col coordinates), WHICH kind, and the implicit
*  "is anything open" derived from `target !== null`.
*
*  `row` / `col` are intentionally generic: a grid uses (rowIdx,
*  colIdx); a canvas uses (nodeRow, nodeField); a kanban could use
*  (laneIdx, cardIdx). The state doesn't care what they mean — only
*  that the pair uniquely identifies the unit so the
*  `anchorSelectorFor` callback can resolve a DOM element. */
/** The open-lift state machine. See module docstring. */
var LiftState = (_class = class LiftState {
	constructor(opts = {}) {
		/** The currently-open lift's `(row, col, kind)`, or null when no
		*  lift is open. Tracked so templates re-render on transitions
		*  (open → close, kind change, target change). */
		_initializerDefineProperty(this, "target", _descriptor, this);
		_defineProperty(this, "hoverTimer", null);
		_defineProperty(this, "dismissTimer", null);
		/** Timestamp of the most-recent explicit close (commit / cancel /
		*  dismiss). `scheduleHoverDetails` checks this against `dismissCooldownMs`
		*  to suppress immediate re-opens. Without this, closing an EDIT lift
		*  (the cursor is still over the source cell because the lift was
		*  covering it) would trigger pointerenter on the cell underneath
		*  → schedule hover details → 500ms later a details lift pops open
		*  the user didn't ask for. */
		_defineProperty(this, "lastClosedAt", 0);
		_defineProperty(this, "opts", void 0);
		/** Open the details lift on (row, col). Cancels any pending
		*  hover-open or dismiss timers. Idempotent — calling on the
		*  already-open unit is a no-op. */
		_defineProperty(this, "openDetails", (row, col) => {
			this.cancelHoverTimer();
			this.cancelDismissTimer();
			this.target = {
				row,
				col,
				kind: "details"
			};
		});
		/** Open the edit lift on (row, col). Cancels any pending hover /
		*  dismiss timers. The host typically calls this from explicit
		*  edit gestures (chevron click, dblclick, Enter, F2). Idempotent. */
		_defineProperty(this, "openEdit", (row, col) => {
			this.openLift(row, col, "edit");
		});
		/** Open the tools lift on (row, col). Tools lifts host action
		*  menus / command palettes — see the `actions` widget. Same
		*  dispatch shape as openEdit; the host picks which to call based
		*  on the unit's negotiated `contract.lift` (tools-only widgets
		*  go through this path). */
		_defineProperty(this, "openTools", (row, col) => {
			this.openLift(row, col, "tools");
		});
		/** Generic open-by-kind. Hosts that want to dispatch dynamically
		*  from `contract.lift` (e.g. "open whichever kind the widget
		*  declared most-escalated") call this directly:
		*
		*    const kind = contract.lift[contract.lift.length - 1];
		*    if (kind) this.liftState.openLift(rowIdx, colIdx, kind);
		*
		*  Adding a new lift kind to the system becomes a one-line change
		*  on the widget side (declare the cap), the contract side (cap →
		*  lift kind in the negotiator), and the lift CSS side (a
		*  `.bx-lift--<kind>` rule). No new method to wire on LiftState,
		*  no new dispatch branch in the host. `openEdit` / `openTools` /
		*  `openDetails` stay as named conveniences for callers that
		*  always know the kind statically. */
		_defineProperty(this, "openLift", (row, col, kind) => {
			this.cancelHoverTimer();
			this.cancelDismissTimer();
			this.target = {
				row,
				col,
				kind
			};
		});
		/** Schedule details to open on (row, col) after the hover pause.
		*  Bails out if the unit's contract doesn't list `'details'` in
		*  `lift[]`, or if an edit lift is already open (the user is
		*  committed to editing — no peeks). The companion modifier
		*  calls this on `pointerenter`. */
		_defineProperty(this, "scheduleHoverDetails", (row, col, contract) => {
			if (!contract.lift.includes("details")) return;
			if (this.target?.kind === "edit") return;
			if (this.lastClosedAt > 0 && Date.now() - this.lastClosedAt < this.opts.dismissCooldownMs) return;
			this.cancelHoverTimer();
			this.cancelDismissTimer();
			this.hoverTimer = setTimeout(() => {
				this.hoverTimer = null;
				if (this.target?.kind === "edit") return;
				this.target = {
					row,
					col,
					kind: "details"
				};
			}, this.opts.hoverPauseMs);
		});
		/** Cancel a pending hover-to-details timer; if a details lift IS
		*  open, schedule a dismiss after the grace window. Used by both
		*  source-pointerleave and lift-pointerleave — the dismiss only
		*  fires if neither the source nor the lift cancels it via
		*  `cancelDismiss()` first. */
		_defineProperty(this, "scheduleDismissDetails", () => {
			this.cancelHoverTimer();
			if (this.target?.kind !== "details") return;
			this.cancelDismissTimer();
			this.dismissTimer = setTimeout(() => {
				this.dismissTimer = null;
				if (this.target?.kind === "details") this.target = null;
			}, this.opts.dismissGraceMs);
		});
		/** Cancel a pending dismiss — pointer entered the lift element
		*  before the grace expired, so the user is reading the details. */
		_defineProperty(this, "cancelDismiss", () => {
			this.cancelDismissTimer();
		});
		/** Switch the open lift's kind without closing it. Same anchor,
		*  different content — the `<Lift>` re-renders its body without
		*  unmounting. Used for details ↔ edit escalation from inside
		*  the lift body or its toolbar. No-op if no lift is open. */
		_defineProperty(this, "escalate", (kind) => {
			if (!this.target) return;
			this.target = {
				...this.target,
				kind
			};
		});
		/** Close the lift. Cancels all pending timers. Used for explicit
		*  dismissals (Esc, click-out, commit, cancel). Stamps `lastClosedAt`
		*  so `scheduleHoverDetails` can suppress immediate hover re-opens
		*  (the cursor is still over the source cell because the lift was
		*  covering it; the unmount triggers a synthetic pointerenter). */
		_defineProperty(this, "close", () => {
			this.cancelHoverTimer();
			this.cancelDismissTimer();
			this.target = null;
			this.lastClosedAt = Date.now();
		});
		this.opts = {
			anchorSelectorFor: opts.anchorSelectorFor ?? defaultAnchorSelectorFor,
			hoverPauseMs: opts.hoverPauseMs ?? 500,
			dismissGraceMs: opts.dismissGraceMs ?? 200,
			dismissCooldownMs: opts.dismissCooldownMs ?? 600
		};
	}
	/** True when any lift is open (any unit, any kind). */
	get isOpen() {
		return this.target !== null;
	}
	/** The open lift's kind, or null if nothing is open. Templates
	*  use this to switch between Details and Edit content. */
	get kind() {
		return this.target?.kind ?? null;
	}
	/** Velcro anchor selector for the open lift, or `''` if nothing
	*  is open. Pass directly to
	*  `<Lift @anchor={{state.anchorSelector}}>`. */
	get anchorSelector() {
		if (!this.target) return "";
		return this.opts.anchorSelectorFor(this.target.row, this.target.col);
	}
	/** True if the lift is open AND it points at this exact unit.
	*  Used by per-unit chrome (e.g., `<LiftChevron>`) that needs to
	*  know "is the lift open on ME, specifically." */
	isOpenFor(row, col) {
		return this.target !== null && this.target.row === row && this.target.col === col;
	}
	/** Cancel any pending timers. Hosts call this from `willDestroy()`
	*  to keep teardown tidy. Safe to call multiple times. */
	destroy() {
		this.cancelHoverTimer();
		this.cancelDismissTimer();
	}
	cancelHoverTimer() {
		if (this.hoverTimer != null) {
			clearTimeout(this.hoverTimer);
			this.hoverTimer = null;
		}
	}
	cancelDismissTimer() {
		if (this.dismissTimer != null) {
			clearTimeout(this.dismissTimer);
			this.dismissTimer = null;
		}
	}
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, "target", [tracked], {
	configurable: true,
	enumerable: true,
	writable: true,
	initializer: function() {
		return null;
	}
}), _class);
/** Default anchor selector — every host's body unit stamps
*  `data-row="N"` and `data-col="N"`. Override via
*  `LiftStateOptions.anchorSelectorFor` when the host scopes by id
*  (multiple grids on one page, multiple canvases stacked) or uses
*  a different attribute scheme. */
function defaultAnchorSelectorFor(row, col) {
	return `[data-row="${row}"][data-col="${col}"]`;
}
/** Factory — mirrors `createFocusLadder()`. Use as a class field
*  in your host component:
*
*    liftState = createLiftState({
*      anchorSelectorFor: (r, c) =>
*        `[data-bx-grid="t1"] [data-row="${r}"][data-col="${c}"]`,
*    });
*
*  The instance is reactive — templates that read `state.target /
*  kind / isOpen / anchorSelector` re-render on transitions. */
function createLiftState(opts = {}) {
	return new LiftState(opts);
}
/** Default lower bound. Below this, lift typography starts losing
*  readability — we'd rather visual "stickiness" at a small viewport
*  than hand the user an unreadable popover. */
var DEFAULT_RELATIVE_SCALE_MIN = .85;
/** Default upper bound. Above this, lifts dominate the source
*  content visually. The growth side is intentionally generous —
*  users who've zoomed in WANT the popover to grow noticeably. */
var DEFAULT_RELATIVE_SCALE_MAX = 1.8;
/** Exponent for the zoomed-OUT half (scale < 1). Shallow = very
*  little shrinking. 0.30 means a 50% canvas zoom only damps the
*  lift to ~80%. */
var SHRINK_EXPONENT = .3;
/** Exponent for the zoomed-IN half (scale >= 1). Steeper than the
*  shrink side so growth feels responsive. 0.70 keeps the damping
*  visible (lift doesn't grow 1:1 with canvas) but doesn't flatten
*  the way sqrt would. */
var GROW_EXPONENT = .7;
/** Compute a damped multiplier from a raw environment scale.
*
*  Designed for canvas zoom + 3D-scene camera-distance + any other
*  scalable host. Pass the environment's raw "how zoomed in are we"
*  number; receive a multiplier suitable for adornment surfaces.
*
*  The default curve uses asymmetric exponents (gentler shrinking,
*  more aggressive growing) and clamps to [0.85, 1.8]. See the
*  module header for the rationale behind the asymmetry.
*
*  @param scale  raw environment scale (zoom, camera ratio, etc.)
*  @param min    lower bound for the result. Defaults to 0.85.
*  @param max    upper bound for the result. Defaults to 1.8.
*/
function dampedRelativeScale(scale, min = DEFAULT_RELATIVE_SCALE_MIN, max = DEFAULT_RELATIVE_SCALE_MAX) {
	if (!Number.isFinite(scale) || scale <= 0) return 1;
	if (scale === 1) return 1;
	const damped = Math.pow(scale, scale < 1 ? SHRINK_EXPONENT : GROW_EXPONENT);
	if (damped < min) return min;
	if (damped > max) return max;
	return damped;
}
/**
* Guards expensive renderer resizes from feedback loops caused by transient
* overlays, scrollbars, transformed anchors, or ResizeObserver jitter.
*/
var StableSizeGate = class {
	constructor(options = {}) {
		_defineProperty(this, "jitterPx", void 0);
		_defineProperty(this, "thrashLimit", void 0);
		_defineProperty(this, "thrashWindowMs", void 0);
		_defineProperty(this, "cooldownMs", void 0);
		_defineProperty(this, "now", void 0);
		_defineProperty(this, "width", 0);
		_defineProperty(this, "height", 0);
		_defineProperty(this, "hasAcceptedSize", false);
		_defineProperty(this, "resizeTimes", []);
		_defineProperty(this, "cooldownUntil", 0);
		_defineProperty(this, "pending", null);
		this.jitterPx = options.jitterPx ?? 2;
		this.thrashLimit = options.thrashLimit ?? 6;
		this.thrashWindowMs = options.thrashWindowMs ?? 300;
		this.cooldownMs = options.cooldownMs ?? 450;
		this.now = options.now ?? (() => performance.now());
	}
	consider(width, height) {
		const next = this.normalize(width, height);
		if (!this.hasAcceptedSize) return this.accept(next.width, next.height, "initial");
		if (this.isJitter(next.width, next.height)) return this.decision(false, next.width, next.height, "jitter");
		const now = this.now();
		if (now < this.cooldownUntil) {
			this.pending = next;
			return this.decision(false, next.width, next.height, "cooldown");
		}
		this.recordResize(now);
		if (this.resizeTimes.length >= this.thrashLimit) {
			this.cooldownUntil = now + this.cooldownMs;
			this.resizeTimes = [];
			this.pending = next;
			return this.decision(false, next.width, next.height, "cooldown");
		}
		return this.accept(next.width, next.height, "changed");
	}
	flush() {
		const pending = this.pending;
		if (!pending) return null;
		if (this.now() < this.cooldownUntil) return this.decision(false, pending.width, pending.height, "cooldown");
		this.pending = null;
		if (this.isJitter(pending.width, pending.height)) return this.decision(false, pending.width, pending.height, "jitter");
		return this.accept(pending.width, pending.height, "changed");
	}
	get hasPending() {
		return this.pending !== null;
	}
	normalize(width, height) {
		return {
			width: Math.max(1, Math.round(width)),
			height: Math.max(1, Math.round(height))
		};
	}
	isJitter(width, height) {
		return Math.abs(width - this.width) <= this.jitterPx && Math.abs(height - this.height) <= this.jitterPx;
	}
	recordResize(now) {
		const cutoff = now - this.thrashWindowMs;
		this.resizeTimes = this.resizeTimes.filter((time) => time >= cutoff);
		this.resizeTimes.push(now);
	}
	accept(width, height, reason) {
		this.width = width;
		this.height = height;
		this.hasAcceptedSize = true;
		return this.decision(true, width, height, reason);
	}
	decision(apply, width, height, reason) {
		return {
			apply,
			width,
			height,
			reason
		};
	}
};
var postureByMode = {
	use: "use",
	inspect: "use",
	change: "compose"
};
function surfaceElementById(id, root = document) {
	if (typeof CSS !== "undefined" && CSS.escape) return root.querySelector(`[data-ladder-id="${CSS.escape(id)}"]`);
	for (const element of root.querySelectorAll("[data-ladder-id]")) if (element.getAttribute("data-ladder-id") === id) return element;
	return null;
}
function normalizeAttributeValue(value) {
	if (value === null || value === void 0 || value === false) return void 0;
	if (value === true) return "true";
	return String(value);
}
function postureForElement(element, fallback) {
	const mode = element?.closest("[data-surface-mode]")?.getAttribute("data-surface-mode");
	return mode && mode in postureByMode ? postureByMode[mode] : fallback;
}
function inspectingForElement(element, fallback) {
	const inspect = element?.closest("[data-surface-inspect]")?.getAttribute("data-surface-inspect");
	return inspect === "" || inspect === "true" || inspect === null && element?.closest("[data-surface-mode]")?.getAttribute("data-surface-mode") === "inspect" || inspect === null && fallback;
}
function attributesFromElement(node, element, options) {
	const attrs = {
		id: node.id,
		surface: node.surface,
		kind: node.surface
	};
	if (node.target) attrs["target"] = node.target;
	if (node.targetScope) attrs["targetScope"] = node.targetScope;
	if (element) {
		for (const attr of Array.from(element.attributes)) if (attr.name.startsWith("data-surface-")) attrs[attr.name.slice(13)] = attr.value;
		else if (attr.name.startsWith("data-rule-")) attrs[attr.name.slice(10)] = attr.value;
		else if (attr.name === "class") attrs["class"] = attr.value;
		else if (attr.name === "role") attrs["role"] = attr.value;
		else if (attr.name === "aria-label") attrs["label"] = attr.value;
	}
	const extra = options.attributesForNode?.(node, element) ?? {};
	for (const [key, value] of Object.entries(extra)) {
		const normalized = normalizeAttributeValue(value);
		if (normalized !== void 0) attrs[key] = normalized;
	}
	return attrs;
}
function ruleNodesFromLadder(ladder, options = {}) {
	const root = options.root ?? (typeof document !== "undefined" ? document : void 0);
	const fallbackPosture = options.posture ?? "use";
	const fallbackInspecting = options.inspecting ?? false;
	return ladder.treeSnapshot().map((snapshot) => {
		const element = root ? surfaceElementById(snapshot.id, root) : null;
		const posture = postureForElement(element, fallbackPosture);
		const inspecting = inspectingForElement(element, fallbackInspecting);
		return {
			id: snapshot.id,
			surface: snapshot.surface,
			parentId: snapshot.parentId,
			target: snapshot.target,
			targetScope: snapshot.targetScope,
			attributes: attributesFromElement(snapshot, element, options),
			states: {
				focused: snapshot.focused,
				selected: snapshot.selected,
				hovered: snapshot.hovered,
				focusPath: snapshot.onFocusPath,
				posture,
				inspecting
			}
		};
	});
}
function parseRules(rules) {
	return rules.map((rule, index) => {
		const selectors = parse(rule.match);
		return {
			...rule,
			selectors,
			specificity: specificityForSelectors(selectors, rule.priority ?? 0),
			sourceOrder: index
		};
	});
}
function resolveRules(nodes, rules) {
	const parsed = isParsedSurfaceRules(rules) ? rules : parseRules(rules);
	const byId = new Map(nodes.map((node) => [node.id, node]));
	return nodes.map((node) => {
		const matches = parsed.filter((rule) => ruleMatchesNode(rule, node, byId)).map((rule) => ({
			node,
			rule,
			specificity: rule.specificity
		}));
		matches.sort(compareRuleMatches);
		return {
			node,
			matches,
			best: matches[matches.length - 1] ?? null
		};
	});
}
function bestRuleFor(id, nodes, rules) {
	return resolveRules(nodes, rules).find((resolution) => resolution.node.id === id)?.best ?? null;
}
function surfaceFor(rules, request, fallback) {
	const nodes = ruleNodesFromRequest(request);
	const target = nodes[nodes.length - 1];
	if (!target) return fallback;
	const best = bestRuleFor(target.id, nodes, rules);
	if (!best) return fallback;
	return rules.find((candidate) => candidate.id === best.rule.id)?.use ?? fallback;
}
function ruleNodesFromRequest(request) {
	const posture = request.states?.posture ?? "use";
	const inspecting = request.states?.inspecting ?? posture === "inspect";
	const ancestors = request.ancestors ?? [];
	const nodes = [];
	let parentId = request.parentId ?? null;
	for (let index = 0; index < ancestors.length; index += 1) {
		const ancestor = ancestors[index];
		const id = ancestor.id ?? `${ancestor.surface}:${index}`;
		nodes.push({
			id,
			surface: ancestor.surface,
			parentId,
			attributes: normalizeAttributes({
				...ancestor.attributes ?? {},
				surface: ancestor.surface,
				kind: ancestor.surface
			}),
			states: normalizeStates(ancestor.states, posture, inspecting)
		});
		parentId = id;
	}
	const id = request.id ?? `${request.surface}:request`;
	nodes.push({
		id,
		surface: request.surface,
		parentId,
		attributes: normalizeAttributes({
			...request.attributes ?? {},
			surface: request.surface,
			kind: request.surface
		}),
		states: normalizeStates(request.states, posture, inspecting)
	});
	return nodes;
}
function normalizeAttributes(attributes) {
	const normalized = {};
	for (const [key, value] of Object.entries(attributes)) {
		const next = normalizeAttributeValue(value);
		if (next !== void 0) normalized[key] = next;
	}
	return normalized;
}
function normalizeStates(states, posture, inspecting) {
	const explicitPosture = states?.posture ?? posture;
	const normalizedPosture = explicitPosture === "inspect" ? "use" : explicitPosture;
	return {
		focused: states?.focused ?? false,
		selected: states?.selected ?? false,
		hovered: states?.hovered ?? false,
		focusPath: states?.focusPath ?? false,
		posture: normalizedPosture,
		inspecting: states?.inspecting ?? (inspecting || explicitPosture === "inspect")
	};
}
function isParsedSurfaceRules(rules) {
	return rules.every((rule) => "selectors" in rule);
}
function ruleMatchesNode(rule, node, byId) {
	return rule.selectors.some((selector) => selectorBranchMatchesNode(selector, selector.length - 1, node, byId));
}
function selectorBranchMatchesNode(selector, tokenIndex, node, byId) {
	if (!node) return false;
	let index = tokenIndex;
	while (index >= 0) {
		const token = selector[index];
		if (token.type === SelectorType.Child) return selectorBranchMatchesNode(selector, index - 1, byId.get(node.parentId ?? ""), byId);
		if (token.type === SelectorType.Descendant) {
			let ancestor = byId.get(node.parentId ?? "");
			while (ancestor) {
				if (selectorBranchMatchesNode(selector, index - 1, ancestor, byId)) return true;
				ancestor = byId.get(ancestor.parentId ?? "");
			}
			return false;
		}
		if (!simpleTokenMatchesNode(token, node)) return false;
		index -= 1;
	}
	return true;
}
function simpleTokenMatchesNode(token, node) {
	switch (token.type) {
		case SelectorType.Tag: return token.name === "*" || token.name === node.surface || token.name === node.attributes["component"] || token.name === node.attributes["kind"];
		case SelectorType.Universal: return true;
		case SelectorType.Attribute: return attributeSelectorMatchesNode(token, node);
		case SelectorType.Pseudo: return pseudoSelectorMatchesNode(token.name, node);
		default: return false;
	}
}
function attributeSelectorMatchesNode(token, node) {
	const actual = node.attributes[token.name];
	switch (token.action) {
		case "exists": return actual !== void 0;
		case "equals": return actual === token.value;
		case "element": return actual?.split(/\s+/).includes(token.value) ?? false;
		case "start": return actual?.startsWith(token.value) ?? false;
		case "end": return actual?.endsWith(token.value) ?? false;
		case "any": return actual?.includes(token.value) ?? false;
		case "hyphen": return actual === token.value || actual?.startsWith(`${token.value}-`) === true;
		case "not": return actual !== token.value;
		default: return false;
	}
}
function pseudoSelectorMatchesNode(name, node) {
	switch (name) {
		case "focused":
		case "focus": return node.states.focused;
		case "selected": return node.states.selected;
		case "hovered":
		case "hover": return node.states.hovered;
		case "focus-path": return node.states.focusPath;
		case "use":
		case "compose": return node.states.posture === name;
		case "inspect":
		case "inspecting": return node.states.inspecting;
		default: return false;
	}
}
function specificityForSelectors(selectors, priority) {
	const sorted = selectors.map((selector) => specificityForSelector(selector, priority)).sort(compareSpecificity);
	return sorted[sorted.length - 1];
}
function specificityForSelector(selector, priority) {
	let relationship = 0;
	let predicate = 0;
	let segment = 0;
	for (const token of selector) switch (token.type) {
		case SelectorType.Child:
			relationship += 10;
			break;
		case SelectorType.Descendant:
			relationship += 3;
			break;
		case SelectorType.Attribute:
			predicate += 10;
			break;
		case SelectorType.Pseudo:
			predicate += 8;
			break;
		case SelectorType.Tag:
			segment += token.name === "*" ? -1 : 5;
			break;
		case SelectorType.Universal:
			segment -= 1;
			break;
	}
	return {
		priority,
		relationship,
		predicate,
		segment
	};
}
function compareRuleMatches(a, b) {
	const specificity = compareSpecificity(a.specificity, b.specificity);
	if (specificity !== 0) return specificity;
	return a.rule.sourceOrder - b.rule.sourceOrder;
}
function compareSpecificity(a, b) {
	return a.priority - b.priority || a.relationship - b.relationship || a.predicate - b.predicate || a.segment - b.segment;
}
var SURFACES_DIST_VERSION = "@cardstack/surfaces@0.10.0";
var SURFACES_DIST_BUILD = "2026-05-14T22:19:43.957Z";
//#endregion
export { SurfaceComponent as AbstractFoundation, SurfaceComponent as AbstractFoundationSurface, SurfaceComponent, SurfaceComponent as SurfaceComponentSurface, Accessory, Accessory as SurfaceAccessory, BASE_CONTRACTS, Canvas, Canvas as CanvasSurface, Cell, Cell as FieldCell, ChangeRouteContextName, ChangeRouteContextName as SurfaceChangeRouteContextName, Connection, Connection as ConnectionSurface, CoordinateSpaceContextName, CoordinateSpaceContextName as SurfaceCoordinateSpaceContextName, CueDescription, CueLabel, CueStatus, DEFAULT_RELATIVE_SCALE_MAX, DEFAULT_RELATIVE_SCALE_MIN, DemoContextName, DemoContextName as SurfaceDemoContextName, EmailCell, Environment, Environment as EnvironmentSurface, FALLBACK_CONTRACT, Flow, Flow as FlowSurface, FociStore, FocusLadder, Form, FormAlert, FormField, FormFieldContextName, FormSection, FormStep, FormTab, FormTabs, FormWizard, Frame, Frame as FrameSurface, Grid, Grid as GridSurface, InspectContextName, InspectContextName as SurfaceInspectContextName, LAYERS, LadderContextName, LadderContextName as SurfaceLadderContextName, SurfaceLayerManager as LayerManager, SurfaceLayerManager, Layout, Layout as LayoutSurface, Lift, LiftChevron, LiftContextName, LiftContextName as SurfaceLiftContextName, LiftManager, LiftManager as SurfaceLiftManager, LiftState, ModeContextName, ModeContextName as SurfaceModeContextName, NumberCell, Outline, Outline as OutlineSurface, Pane, Pane as PaneSurface, ParentContextName, ParentContextName as ParentSurfaceContextName, ParentIdContextName, ParentIdContextName as ParentSurfaceIdContextName, PathContextName, PathContextName as SurfacePathContextName, Plane, Plane as PlaneSurface, Row, Row as RowSurface, Run, Run as RunSurface, SURFACES_DIST_BUILD, SURFACES_DIST_VERSION, SURFACE_LAYERS, Scene, Scene as SceneSurface, Scroll, Scroll as ScrollSurface, StableSizeGate, SurfaceRuntimeContextName, SurfaceRuntimeImpl, SurfaceScopeContextName, SurfaceScopeRelay, SwitchCell, TextCell, Unit, Unit as UnitSurface, bestRuleFor, cancelSurfaceGridInput, clearSurfaceCanvasSelection, clearSurfaceCanvasSelection as clearSurfaceSceneSelection, clearSurfaceGridSelection, clipSurfaceLayerRect, collapseSurfaceLayerBoxes, commitInlineEdits, commitInlineEdits as commitSurfaceInlineEdits, commitSurfaceGridInput, createFociStore, createFocusLadder, createLiftManager, createLiftManager as createSurfaceLiftManager, createLiftState, createSurfaceRuntime, createSurfaceScopeRelay, dampedRelativeScale, isSurfaceScopeAttribute, isSurfaceTextEntryTarget, labelForFieldKey, ladderForSurfaceElement, lookupBaseContract, mergeSurfaceScopeAttributes, multiUnit, negotiateContract, negotiateContract as negotiateSurfaceContract, negotiateForWidget, nextSurfaceId, parentSurfaceIdForElement, parseRules, portal, readResolvedFormFieldValue, registerContractTable, registerSurfaceDomNode, releaseSurfaceCanvasDomFocus, releaseSurfaceCanvasDomFocus as releaseSurfaceSceneDomFocus, releaseSurfaceGridDomFocus, resolveFormFields, resolveRules, restoreSurfaceCanvasSelection, restoreSurfaceCanvasSelection as restoreSurfaceSceneSelection, restoreSurfaceGridSelection, ruleNodesFromLadder, ruleNodesFromRequest, stampSurfaceScope, surfaceCanvasBinding, surfaceCanvasBinding as surfaceSceneBinding, surfaceContinuousInput, surfaceCoordinateDebugger, surfaceDecalLayer, surfaceElementForId, surfaceElementOwnsKeyboardEvent, surfaceElementsForIds, surfaceFocusKey, surfaceFocusKeyFromPath, surfaceFor, surfaceGridBinding, surfaceId, surfaceIdFromPath, surfaceInlineEdit, surfaceLiftBinding, surfaceNode, surfaceRoot, surfaceRuntimeForElement, surfaceScopeAttributesForElement, surfaceScopeAttributesForTree, surfaceScopeRelay, surfaceSelectionDecals, surfaceTargetOwnsKeyboardEvent, surfaceTargetOwnsPointerEvent, surfaceTargetRetainsBrowserFocusAfterSelection, validateProjectionConformance, writeResolvedFormFieldValue };
