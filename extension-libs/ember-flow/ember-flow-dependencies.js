import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { modifier } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var umd = {exports: {}};

(function (module, exports) {
	!function(t,e){e(exports);}(commonjsGlobal,(function(t){const e={error001:()=>"[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",error002:()=>"It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",error003:t=>`Node type "${t}" not found. Using fallback type "default".`,error004:()=>"The React Flow parent container needs a width and a height to render the graph.",error005:()=>"Only child nodes can use a parent extent.",error006:()=>"Can't create edge. An edge needs a source and a target.",error007:t=>`The old edge with id=${t} does not exist.`,error009:t=>`Marker type "${t}" doesn't exist.`,error008:(t,{id:e,sourceHandle:n,targetHandle:o})=>`Couldn't create edge for ${t} handle id: "${"source"===t?n:o}", edge id: ${e}.`,error010:()=>"Handle: No node id found. Make sure to only use a Handle inside a custom Node.",error011:t=>`Edge type "${t}" not found. Using fallback type "default".`,error012:t=>`Node with id "${t}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,error013:(t="react")=>`It seems that you haven't loaded the styles. Please import '@xyflow/${t}/dist/style.css' or base.css to make sure everything is working properly.`,error014:()=>"useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",error015:()=>"It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."},n=[[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY]],o={"node.a11yDescription.default":"Press enter or space to select a node. Press delete to remove it and escape to cancel.","node.a11yDescription.keyboardDisabled":"Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.","node.a11yDescription.ariaLiveMessage":({direction:t,x:e,y:n})=>`Moved selected node ${t}. New position, x: ${e}, y: ${n}`,"edge.a11yDescription.default":"Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.","controls.ariaLabel":"Control Panel","controls.zoomIn.ariaLabel":"Zoom In","controls.zoomOut.ariaLabel":"Zoom Out","controls.fitView.ariaLabel":"Fit View","controls.interactive.ariaLabel":"Toggle Interactivity","minimap.ariaLabel":"Mini Map","handle.ariaLabel":"Handle"};var r,i,a;t.ConnectionMode=void 0,(r=t.ConnectionMode||(t.ConnectionMode={})).Strict="strict",r.Loose="loose",t.PanOnScrollMode=void 0,(i=t.PanOnScrollMode||(t.PanOnScrollMode={})).Free="free",i.Vertical="vertical",i.Horizontal="horizontal",t.SelectionMode=void 0,(a=t.SelectionMode||(t.SelectionMode={})).Partial="partial",a.Full="full";var s,u,c;t.ConnectionLineType=void 0,(s=t.ConnectionLineType||(t.ConnectionLineType={})).Bezier="default",s.Straight="straight",s.Step="step",s.SmoothStep="smoothstep",s.SimpleBezier="simplebezier",t.MarkerType=void 0,(u=t.MarkerType||(t.MarkerType={})).Arrow="arrow",u.ArrowClosed="arrowclosed",t.Position=void 0,(c=t.Position||(t.Position={})).Left="left",c.Top="top",c.Right="right",c.Bottom="bottom";const l={[t.Position.Left]:t.Position.Right,[t.Position.Right]:t.Position.Left,[t.Position.Top]:t.Position.Bottom,[t.Position.Bottom]:t.Position.Top};const h=t=>"id"in t&&"source"in t&&"target"in t,d=t=>"id"in t&&"internals"in t&&!("source"in t)&&!("target"in t),f=(t,e=[0,0])=>{const{width:n,height:o}=B(t),r=t.origin??e,i=n*r[0],a=o*r[1];return {x:t.position.x-i,y:t.position.y-a}},p=(t,e={})=>{let n={x:1/0,y:1/0,x2:-1/0,y2:-1/0},o=!1;return t.forEach((t=>{(void 0===e.filter||e.filter(t))&&(n=b(n,z(t)),o=!0);})),o?P(n):{x:0,y:0,width:0,height:0}},g=(t,e)=>{const n=new Set;return t.forEach((t=>{n.add(t.id);})),e.filter((t=>n.has(t.source)||n.has(t.target)))};function m({nodeId:t,nextPosition:n,nodeLookup:o,nodeOrigin:r=[0,0],nodeExtent:i,onError:a}){const s=o.get(t),u=s.parentId?o.get(s.parentId):void 0,{x:c,y:l}=u?u.internals.positionAbsolute:{x:0,y:0},h=s.origin??r;let d=s.extent||i;if("parent"!==s.extent||s.expandParent)u&&H(s.extent)&&(d=[[s.extent[0][0]+c,s.extent[0][1]+l],[s.extent[1][0]+c,s.extent[1][1]+l]]);else if(u){const t=u.measured.width,e=u.measured.height;t&&e&&(d=[[c,l],[c+t,l+e]]);}else a?.("005",e.error005());const f=H(d)?v(n,d,s.measured):n;return void 0!==s.measured.width&&void 0!==s.measured.height||a?.("015",e.error015()),{position:{x:f.x-c+(s.measured.width??0)*h[0],y:f.y-l+(s.measured.height??0)*h[1]},positionAbsolute:f}}const y=(t,e=0,n=1)=>Math.min(Math.max(t,e),n),v=(t={x:0,y:0},e,n)=>({x:y(t.x,e[0][0],e[1][0]-(n?.width??0)),y:y(t.y,e[0][1],e[1][1]-(n?.height??0))});function x(t,e,n){const{width:o,height:r}=B(n),{x:i,y:a}=n.internals.positionAbsolute;return v(t,[[i,a],[i+o,a+r]],e)}const w=(t,e,n)=>t<e?y(Math.abs(t-e),1,e)/e:t>n?-y(Math.abs(t-n),1,e)/e:0,_=(t,e,n=15,o=40)=>[w(t.x,o,e.width-o)*n,w(t.y,o,e.height-o)*n],b=(t,e)=>({x:Math.min(t.x,e.x),y:Math.min(t.y,e.y),x2:Math.max(t.x2,e.x2),y2:Math.max(t.y2,e.y2)}),M=({x:t,y:e,width:n,height:o})=>({x:t,y:e,x2:t+n,y2:e+o}),P=({x:t,y:e,x2:n,y2:o})=>({x:t,y:e,width:n-t,height:o-e}),E=(t,e=[0,0])=>{const{x:n,y:o}=d(t)?t.internals.positionAbsolute:f(t,e);return {x:n,y:o,width:t.measured?.width??t.width??t.initialWidth??0,height:t.measured?.height??t.height??t.initialHeight??0}},z=(t,e=[0,0])=>{const{x:n,y:o}=d(t)?t.internals.positionAbsolute:f(t,e);return {x:n,y:o,x2:n+(t.measured?.width??t.width??t.initialWidth??0),y2:o+(t.measured?.height??t.height??t.initialHeight??0)}},N=(t,e)=>P(b(M(t),M(e))),S=(t,e)=>{const n=Math.max(0,Math.min(t.x+t.width,e.x+e.width)-Math.max(t.x,e.x)),o=Math.max(0,Math.min(t.y+t.height,e.y+e.height)-Math.max(t.y,e.y));return Math.ceil(n*o)},k=t=>!isNaN(t)&&isFinite(t),I=(t,e)=>{},A=(t,e=[1,1])=>({x:e[0]*Math.round(t.x/e[0]),y:e[1]*Math.round(t.y/e[1])}),T=({x:t,y:e},[n,o,r],i=!1,a=[1,1])=>{const s={x:(t-n)/r,y:(e-o)/r};return i?A(s,a):s},$=({x:t,y:e},[n,o,r])=>({x:t*r+n,y:e*r+o});function C(t,e){if("number"==typeof t)return Math.floor(.5*(e-e/(1+t)));if("string"==typeof t&&t.endsWith("px")){const e=parseFloat(t);if(!Number.isNaN(e))return Math.floor(e)}if("string"==typeof t&&t.endsWith("%")){const n=parseFloat(t);if(!Number.isNaN(n))return Math.floor(e*n*.01)}return console.error(`[React Flow] The padding value "${t}" is invalid. Please provide a number or a string with a valid unit (px or %).`),0}const O=(t,e,n,o,r,i)=>{const a=function(t,e,n){if("string"==typeof t||"number"==typeof t){const o=C(t,n),r=C(t,e);return {top:o,right:r,bottom:o,left:r,x:2*r,y:2*o}}if("object"==typeof t){const o=C(t.top??t.y??0,n),r=C(t.bottom??t.y??0,n),i=C(t.left??t.x??0,e),a=C(t.right??t.x??0,e);return {top:o,right:a,bottom:r,left:i,x:i+a,y:o+r}}return {top:0,right:0,bottom:0,left:0,x:0,y:0}}(i,e,n),s=(e-a.x)/t.width,u=(n-a.y)/t.height,c=Math.min(s,u),l=y(c,o,r),h=e/2-(t.x+t.width/2)*l,d=n/2-(t.y+t.height/2)*l,f=function(t,e,n,o,r,i){const{x:a,y:s}=$(t,[e,n,o]),{x:u,y:c}=$({x:t.x+t.width,y:t.y+t.height},[e,n,o]),l=r-u,h=i-c;return {left:Math.floor(a),top:Math.floor(s),right:Math.floor(l),bottom:Math.floor(h)}}(t,h,d,l,e,n),p=Math.min(f.left-a.left,0),g=Math.min(f.top-a.top,0);return {x:h-p+Math.min(f.right-a.right,0),y:d-g+Math.min(f.bottom-a.bottom,0),zoom:l}},D=()=>"undefined"!=typeof navigator&&navigator?.userAgent?.indexOf("Mac")>=0;function H(t){return null!=t&&"parent"!==t}function B(t){return {width:t.measured?.width??t.width??t.initialWidth??0,height:t.measured?.height??t.height??t.initialHeight??0}}function L(t,{snapGrid:e=[0,0],snapToGrid:n=!1,transform:o,containerBounds:r}){const{x:i,y:a}=q(t),s=T({x:i-(r?.left??0),y:a-(r?.top??0)},o),{x:u,y:c}=n?A(s,e):s;return {xSnapped:u,ySnapped:c,...s}}const R=t=>({width:t.offsetWidth,height:t.offsetHeight}),X=t=>t?.getRootNode?.()||window?.document,Y=["INPUT","SELECT","TEXTAREA"];const V=t=>"clientX"in t,q=(t,e)=>{const n=V(t),o=n?t.clientX:t.touches?.[0].clientX,r=n?t.clientY:t.touches?.[0].clientY;return {x:o-(e?.left??0),y:r-(e?.top??0)}},Z=(t,e,n,o,r)=>{const i=e.querySelectorAll(`.${t}`);return i&&i.length?Array.from(i).map((e=>{const i=e.getBoundingClientRect();return {id:e.getAttribute("data-handleid"),type:t,nodeId:r,position:e.getAttribute("data-handlepos"),x:(i.left-n.left)/o,y:(i.top-n.top)/o,...R(e)}})):null};function G({sourceX:t,sourceY:e,targetX:n,targetY:o,sourceControlX:r,sourceControlY:i,targetControlX:a,targetControlY:s}){const u=.125*t+.375*r+.375*a+.125*n,c=.125*e+.375*i+.375*s+.125*o;return [u,c,Math.abs(u-t),Math.abs(c-e)]}function j(t,e){return t>=0?.5*t:25*e*Math.sqrt(-t)}function F({pos:e,x1:n,y1:o,x2:r,y2:i,c:a}){switch(e){case t.Position.Left:return [n-j(n-r,a),o];case t.Position.Right:return [n+j(r-n,a),o];case t.Position.Top:return [n,o-j(o-i,a)];case t.Position.Bottom:return [n,o+j(i-o,a)]}}function W({sourceX:t,sourceY:e,targetX:n,targetY:o}){const r=Math.abs(n-t)/2,i=n<t?n+r:n-r,a=Math.abs(o-e)/2;return [i,o<e?o+a:o-a,r,a]}const K=({source:t,sourceHandle:e,target:n,targetHandle:o})=>`xy-edge__${t}${e||""}-${n}${o||""}`;const U={[t.Position.Left]:{x:-1,y:0},[t.Position.Right]:{x:1,y:0},[t.Position.Top]:{x:0,y:-1},[t.Position.Bottom]:{x:0,y:1}},Q=({source:e,sourcePosition:n=t.Position.Bottom,target:o})=>n===t.Position.Left||n===t.Position.Right?e.x<o.x?{x:1,y:0}:{x:-1,y:0}:e.y<o.y?{x:0,y:1}:{x:0,y:-1},J=(t,e)=>Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2));function tt(t,e,n,o){const r=Math.min(J(t,e)/2,J(e,n)/2,o),{x:i,y:a}=e;if(t.x===i&&i===n.x||t.y===a&&a===n.y)return `L${i} ${a}`;if(t.y===a){return `L ${i+r*(t.x<n.x?-1:1)},${a}Q ${i},${a} ${i},${a+r*(t.y<n.y?1:-1)}`}const s=t.x<n.x?1:-1;return `L ${i},${a+r*(t.y<n.y?-1:1)}Q ${i},${a} ${i+r*s},${a}`}function et(t){return t&&!(!t.internals.handleBounds&&!t.handles?.length)&&!!(t.measured.width||t.width||t.initialWidth)}function nt(t){if(!t)return null;const e=[],n=[];for(const o of t)o.width=o.width??1,o.height=o.height??1,"source"===o.type?e.push(o):"target"===o.type&&n.push(o);return {source:e,target:n}}function ot(e,n,o=t.Position.Left,r=!1){const i=(n?.x??0)+e.internals.positionAbsolute.x,a=(n?.y??0)+e.internals.positionAbsolute.y,{width:s,height:u}=n??B(e);if(r)return {x:i+s/2,y:a+u/2};switch(n?.position??o){case t.Position.Top:return {x:i+s/2,y:a};case t.Position.Right:return {x:i+s,y:a+u/2};case t.Position.Bottom:return {x:i+s/2,y:a+u};case t.Position.Left:return {x:i,y:a+u/2}}}function rt(t,e){return t&&(e?t.find((t=>t.id===e)):t[0])||null}function it(t,e){if(!t)return "";if("string"==typeof t)return t;return `${e?`${e}__`:""}${Object.keys(t).sort().map((e=>`${e}=${t[e]}`)).join("&")}`}const at={left:0,center:50,right:100},st={top:0,center:50,bottom:100};const ut=1e3,ct=10,lt={nodeOrigin:[0,0],nodeExtent:n,elevateNodesOnSelect:!0,zIndexMode:"basic",defaults:{}},ht={...lt,checkEquality:!0};function dt(t,e){const n={...t};for(const t in e)void 0!==e[t]&&(n[t]=e[t]);return n}function ft(t,e){if(!t.handles)return t.measured?e?.internals.handleBounds:void 0;const n=[],o=[];for(const e of t.handles){const r={id:e.id,width:e.width??1,height:e.height??1,nodeId:t.id,x:e.x,y:e.y,position:e.position,type:e.type};"source"===e.type?n.push(r):"target"===e.type&&o.push(r);}return {source:n,target:o}}function pt(t){return "manual"===t}function gt(t,e,n,o,r){const{elevateNodesOnSelect:i,nodeOrigin:a,nodeExtent:s,zIndexMode:u}=dt(lt,o),c=t.parentId,l=e.get(c);if(!l)return void console.warn(`Parent node ${c} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);!function(t,e){if(!t.parentId)return;const n=e.get(t.parentId);n?n.set(t.id,t):e.set(t.parentId,new Map([[t.id,t]]));}(t,n),r&&!l.parentId&&void 0===l.internals.rootParentIndex&&"auto"===u&&(l.internals.rootParentIndex=++r.i,l.internals.z=l.internals.z+r.i*ct),r&&void 0!==l.internals.rootParentIndex&&(r.i=l.internals.rootParentIndex);const h=i&&!pt(u)?ut:0,{x:d,y:p,z:g}=function(t,e,n,o,r,i){const{x:a,y:s}=e.internals.positionAbsolute,u=B(t),c=f(t,n),l=H(t.extent)?v(c,t.extent,u):c;let h=v({x:a+l.x,y:s+l.y},o,u);"parent"===t.extent&&(h=x(h,u,e));const d=mt(t,r,i),p=e.internals.z??0;return {x:h.x,y:h.y,z:p>=d?p+1:d}}(t,l,a,s,h,u),{positionAbsolute:m}=t.internals,y=d!==m.x||p!==m.y;(y||g!==t.internals.z)&&e.set(t.id,{...t,internals:{...t.internals,positionAbsolute:y?{x:d,y:p}:m,z:g}});}function mt(t,e,n){const o=k(t.zIndex)?t.zIndex:0;return pt(n)?o:o+(t.selected?e:0)}function yt(t,e,n,o=[0,0]){const r=[],i=new Map;for(const n of t){const t=e.get(n.parentId);if(!t)continue;const o=i.get(n.parentId)?.expandedRect??E(t),r=N(o,n.rect);i.set(n.parentId,{expandedRect:r,parent:t});}return i.size>0&&i.forEach((({expandedRect:e,parent:i},a)=>{const s=i.internals.positionAbsolute,u=B(i),c=i.origin??o,l=e.x<s.x?Math.round(Math.abs(s.x-e.x)):0,h=e.y<s.y?Math.round(Math.abs(s.y-e.y)):0,d=Math.max(u.width,Math.round(e.width)),f=Math.max(u.height,Math.round(e.height)),p=(d-u.width)*c[0],g=(f-u.height)*c[1];(l>0||h>0||p||g)&&(r.push({id:a,type:"position",position:{x:i.position.x-l+p,y:i.position.y-h+g}}),n.get(a)?.forEach((e=>{t.some((t=>t.id===e.id))||r.push({id:e.id,type:"position",position:{x:e.position.x+l,y:e.position.y+h}});}))),(u.width<e.width||u.height<e.height||l||h)&&r.push({id:a,type:"dimensions",setAttributes:!0,dimensions:{width:d+(l?c[0]*l-p:0),height:f+(h?c[1]*h-g:0)}});})),r}function vt(t,e,n,o,r,i){let a=r;const s=o.get(a)||new Map;o.set(a,s.set(n,e)),a=`${r}-${t}`;const u=o.get(a)||new Map;if(o.set(a,u.set(n,e)),i){a=`${r}-${t}-${i}`;const s=o.get(a)||new Map;o.set(a,s.set(n,e));}}var xt={value:()=>{}};function wt(){for(var t,e=0,n=arguments.length,o={};e<n;++e){if(!(t=arguments[e]+"")||t in o||/[\s.]/.test(t))throw new Error("illegal type: "+t);o[t]=[];}return new _t(o)}function _t(t){this._=t;}function bt(t,e){for(var n,o=0,r=t.length;o<r;++o)if((n=t[o]).name===e)return n.value}function Mt(t,e,n){for(var o=0,r=t.length;o<r;++o)if(t[o].name===e){t[o]=xt,t=t.slice(0,o).concat(t.slice(o+1));break}return null!=n&&t.push({name:e,value:n}),t}_t.prototype=wt.prototype={constructor:_t,on:function(t,e){var n,o,r=this._,i=(o=r,(t+"").trim().split(/^|\s+/).map((function(t){var e="",n=t.indexOf(".");if(n>=0&&(e=t.slice(n+1),t=t.slice(0,n)),t&&!o.hasOwnProperty(t))throw new Error("unknown type: "+t);return {type:t,name:e}}))),a=-1,s=i.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++a<s;)if(n=(t=i[a]).type)r[n]=Mt(r[n],t.name,e);else if(null==e)for(n in r)r[n]=Mt(r[n],t.name,null);return this}for(;++a<s;)if((n=(t=i[a]).type)&&(n=bt(r[n],t.name)))return n},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new _t(t)},call:function(t,e){if((n=arguments.length-2)>0)for(var n,o,r=new Array(n),i=0;i<n;++i)r[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(i=0,n=(o=this._[t]).length;i<n;++i)o[i].value.apply(e,r);},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var o=this._[t],r=0,i=o.length;r<i;++r)o[r].value.apply(e,n);}};var Pt="http://www.w3.org/1999/xhtml",Et={svg:"http://www.w3.org/2000/svg",xhtml:Pt,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};function zt(t){var e=t+="",n=e.indexOf(":");return n>=0&&"xmlns"!==(e=t.slice(0,n))&&(t=t.slice(n+1)),Et.hasOwnProperty(e)?{space:Et[e],local:t}:t}function Nt(t){return function(){var e=this.ownerDocument,n=this.namespaceURI;return n===Pt&&e.documentElement.namespaceURI===Pt?e.createElement(t):e.createElementNS(n,t)}}function St(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function kt(t){var e=zt(t);return (e.local?St:Nt)(e)}function It(){}function At(t){return null==t?It:function(){return this.querySelector(t)}}function Tt(){return []}function $t(t){return null==t?Tt:function(){return this.querySelectorAll(t)}}function Ct(t){return function(){return null==(e=t.apply(this,arguments))?[]:Array.isArray(e)?e:Array.from(e);var e;}}function Ot(t){return function(){return this.matches(t)}}function Dt(t){return function(e){return e.matches(t)}}var Ht=Array.prototype.find;function Bt(){return this.firstElementChild}var Lt=Array.prototype.filter;function Rt(){return Array.from(this.children)}function Xt(t){return new Array(t.length)}function Yt(t,e){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=e;}function Vt(t,e,n,o,r,i){for(var a,s=0,u=e.length,c=i.length;s<c;++s)(a=e[s])?(a.__data__=i[s],o[s]=a):n[s]=new Yt(t,i[s]);for(;s<u;++s)(a=e[s])&&(r[s]=a);}function qt(t,e,n,o,r,i,a){var s,u,c,l=new Map,h=e.length,d=i.length,f=new Array(h);for(s=0;s<h;++s)(u=e[s])&&(f[s]=c=a.call(u,u.__data__,s,e)+"",l.has(c)?r[s]=u:l.set(c,u));for(s=0;s<d;++s)c=a.call(t,i[s],s,i)+"",(u=l.get(c))?(o[s]=u,u.__data__=i[s],l.delete(c)):n[s]=new Yt(t,i[s]);for(s=0;s<h;++s)(u=e[s])&&l.get(f[s])===u&&(r[s]=u);}function Zt(t){return t.__data__}function Gt(t){return "object"==typeof t&&"length"in t?t:Array.from(t)}function jt(t,e){return t<e?-1:t>e?1:t>=e?0:NaN}function Ft(t){return function(){this.removeAttribute(t);}}function Wt(t){return function(){this.removeAttributeNS(t.space,t.local);}}function Kt(t,e){return function(){this.setAttribute(t,e);}}function Ut(t,e){return function(){this.setAttributeNS(t.space,t.local,e);}}function Qt(t,e){return function(){var n=e.apply(this,arguments);null==n?this.removeAttribute(t):this.setAttribute(t,n);}}function Jt(t,e){return function(){var n=e.apply(this,arguments);null==n?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n);}}function te(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView}function ee(t){return function(){this.style.removeProperty(t);}}function ne(t,e,n){return function(){this.style.setProperty(t,e,n);}}function oe(t,e,n){return function(){var o=e.apply(this,arguments);null==o?this.style.removeProperty(t):this.style.setProperty(t,o,n);}}function re(t,e){return t.style.getPropertyValue(e)||te(t).getComputedStyle(t,null).getPropertyValue(e)}function ie(t){return function(){delete this[t];}}function ae(t,e){return function(){this[t]=e;}}function se(t,e){return function(){var n=e.apply(this,arguments);null==n?delete this[t]:this[t]=n;}}function ue(t){return t.trim().split(/^|\s+/)}function ce(t){return t.classList||new le(t)}function le(t){this._node=t,this._names=ue(t.getAttribute("class")||"");}function he(t,e){for(var n=ce(t),o=-1,r=e.length;++o<r;)n.add(e[o]);}function de(t,e){for(var n=ce(t),o=-1,r=e.length;++o<r;)n.remove(e[o]);}function fe(t){return function(){he(this,t);}}function pe(t){return function(){de(this,t);}}function ge(t,e){return function(){(e.apply(this,arguments)?he:de)(this,t);}}function me(){this.textContent="";}function ye(t){return function(){this.textContent=t;}}function ve(t){return function(){var e=t.apply(this,arguments);this.textContent=null==e?"":e;}}function xe(){this.innerHTML="";}function we(t){return function(){this.innerHTML=t;}}function _e(t){return function(){var e=t.apply(this,arguments);this.innerHTML=null==e?"":e;}}function be(){this.nextSibling&&this.parentNode.appendChild(this);}function Me(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild);}function Pe(){return null}function Ee(){var t=this.parentNode;t&&t.removeChild(this);}function ze(){var t=this.cloneNode(!1),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Ne(){var t=this.cloneNode(!0),e=this.parentNode;return e?e.insertBefore(t,this.nextSibling):t}function Se(t){return function(){var e=this.__on;if(e){for(var n,o=0,r=-1,i=e.length;o<i;++o)n=e[o],t.type&&n.type!==t.type||n.name!==t.name?e[++r]=n:this.removeEventListener(n.type,n.listener,n.options);++r?e.length=r:delete this.__on;}}}function ke(t,e,n){return function(){var o,r=this.__on,i=function(t){return function(e){t.call(this,e,this.__data__);}}(e);if(r)for(var a=0,s=r.length;a<s;++a)if((o=r[a]).type===t.type&&o.name===t.name)return this.removeEventListener(o.type,o.listener,o.options),this.addEventListener(o.type,o.listener=i,o.options=n),void(o.value=e);this.addEventListener(t.type,i,n),o={type:t.type,name:t.name,value:e,listener:i,options:n},r?r.push(o):this.__on=[o];}}function Ie(t,e,n){var o=te(t),r=o.CustomEvent;"function"==typeof r?r=new r(e,n):(r=o.document.createEvent("Event"),n?(r.initEvent(e,n.bubbles,n.cancelable),r.detail=n.detail):r.initEvent(e,!1,!1)),t.dispatchEvent(r);}function Ae(t,e){return function(){return Ie(this,t,e)}}function Te(t,e){return function(){return Ie(this,t,e.apply(this,arguments))}}Yt.prototype={constructor:Yt,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,e){return this._parent.insertBefore(t,e)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}},le.prototype={add:function(t){this._names.indexOf(t)<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")));},remove:function(t){var e=this._names.indexOf(t);e>=0&&(this._names.splice(e,1),this._node.setAttribute("class",this._names.join(" ")));},contains:function(t){return this._names.indexOf(t)>=0}};var $e=[null];function Ce(t,e){this._groups=t,this._parents=e;}function Oe(){return new Ce([[document.documentElement]],$e)}function De(t){return "string"==typeof t?new Ce([[document.querySelector(t)]],[document.documentElement]):new Ce([[t]],$e)}function He(t,e){if(t=function(t){let e;for(;e=t.sourceEvent;)t=e;return t}(t),void 0===e&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var o=n.createSVGPoint();return o.x=t.clientX,o.y=t.clientY,[(o=o.matrixTransform(e.getScreenCTM().inverse())).x,o.y]}if(e.getBoundingClientRect){var r=e.getBoundingClientRect();return [t.clientX-r.left-e.clientLeft,t.clientY-r.top-e.clientTop]}}return [t.pageX,t.pageY]}Ce.prototype=Oe.prototype={constructor:Ce,select:function(t){"function"!=typeof t&&(t=At(t));for(var e=this._groups,n=e.length,o=new Array(n),r=0;r<n;++r)for(var i,a,s=e[r],u=s.length,c=o[r]=new Array(u),l=0;l<u;++l)(i=s[l])&&(a=t.call(i,i.__data__,l,s))&&("__data__"in i&&(a.__data__=i.__data__),c[l]=a);return new Ce(o,this._parents)},selectAll:function(t){t="function"==typeof t?Ct(t):$t(t);for(var e=this._groups,n=e.length,o=[],r=[],i=0;i<n;++i)for(var a,s=e[i],u=s.length,c=0;c<u;++c)(a=s[c])&&(o.push(t.call(a,a.__data__,c,s)),r.push(a));return new Ce(o,r)},selectChild:function(t){return this.select(null==t?Bt:function(t){return function(){return Ht.call(this.children,t)}}("function"==typeof t?t:Dt(t)))},selectChildren:function(t){return this.selectAll(null==t?Rt:function(t){return function(){return Lt.call(this.children,t)}}("function"==typeof t?t:Dt(t)))},filter:function(t){"function"!=typeof t&&(t=Ot(t));for(var e=this._groups,n=e.length,o=new Array(n),r=0;r<n;++r)for(var i,a=e[r],s=a.length,u=o[r]=[],c=0;c<s;++c)(i=a[c])&&t.call(i,i.__data__,c,a)&&u.push(i);return new Ce(o,this._parents)},data:function(t,e){if(!arguments.length)return Array.from(this,Zt);var n,o=e?qt:Vt,r=this._parents,i=this._groups;"function"!=typeof t&&(n=t,t=function(){return n});for(var a=i.length,s=new Array(a),u=new Array(a),c=new Array(a),l=0;l<a;++l){var h=r[l],d=i[l],f=d.length,p=Gt(t.call(h,h&&h.__data__,l,r)),g=p.length,m=u[l]=new Array(g),y=s[l]=new Array(g);o(h,d,m,y,c[l]=new Array(f),p,e);for(var v,x,w=0,_=0;w<g;++w)if(v=m[w]){for(w>=_&&(_=w+1);!(x=y[_])&&++_<g;);v._next=x||null;}}return (s=new Ce(s,r))._enter=u,s._exit=c,s},enter:function(){return new Ce(this._enter||this._groups.map(Xt),this._parents)},exit:function(){return new Ce(this._exit||this._groups.map(Xt),this._parents)},join:function(t,e,n){var o=this.enter(),r=this,i=this.exit();return "function"==typeof t?(o=t(o))&&(o=o.selection()):o=o.append(t+""),null!=e&&(r=e(r))&&(r=r.selection()),null==n?i.remove():n(i),o&&r?o.merge(r).order():r},merge:function(t){for(var e=t.selection?t.selection():t,n=this._groups,o=e._groups,r=n.length,i=o.length,a=Math.min(r,i),s=new Array(r),u=0;u<a;++u)for(var c,l=n[u],h=o[u],d=l.length,f=s[u]=new Array(d),p=0;p<d;++p)(c=l[p]||h[p])&&(f[p]=c);for(;u<r;++u)s[u]=n[u];return new Ce(s,this._parents)},selection:function(){return this},order:function(){for(var t=this._groups,e=-1,n=t.length;++e<n;)for(var o,r=t[e],i=r.length-1,a=r[i];--i>=0;)(o=r[i])&&(a&&4^o.compareDocumentPosition(a)&&a.parentNode.insertBefore(o,a),a=o);return this},sort:function(t){function e(e,n){return e&&n?t(e.__data__,n.__data__):!e-!n}t||(t=jt);for(var n=this._groups,o=n.length,r=new Array(o),i=0;i<o;++i){for(var a,s=n[i],u=s.length,c=r[i]=new Array(u),l=0;l<u;++l)(a=s[l])&&(c[l]=a);c.sort(e);}return new Ce(r,this._parents).order()},call:function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},nodes:function(){return Array.from(this)},node:function(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var o=t[e],r=0,i=o.length;r<i;++r){var a=o[r];if(a)return a}return null},size:function(){let t=0;for(const e of this)++t;return t},empty:function(){return !this.node()},each:function(t){for(var e=this._groups,n=0,o=e.length;n<o;++n)for(var r,i=e[n],a=0,s=i.length;a<s;++a)(r=i[a])&&t.call(r,r.__data__,a,i);return this},attr:function(t,e){var n=zt(t);if(arguments.length<2){var o=this.node();return n.local?o.getAttributeNS(n.space,n.local):o.getAttribute(n)}return this.each((null==e?n.local?Wt:Ft:"function"==typeof e?n.local?Jt:Qt:n.local?Ut:Kt)(n,e))},style:function(t,e,n){return arguments.length>1?this.each((null==e?ee:"function"==typeof e?oe:ne)(t,e,null==n?"":n)):re(this.node(),t)},property:function(t,e){return arguments.length>1?this.each((null==e?ie:"function"==typeof e?se:ae)(t,e)):this.node()[t]},classed:function(t,e){var n=ue(t+"");if(arguments.length<2){for(var o=ce(this.node()),r=-1,i=n.length;++r<i;)if(!o.contains(n[r]))return !1;return !0}return this.each(("function"==typeof e?ge:e?fe:pe)(n,e))},text:function(t){return arguments.length?this.each(null==t?me:("function"==typeof t?ve:ye)(t)):this.node().textContent},html:function(t){return arguments.length?this.each(null==t?xe:("function"==typeof t?_e:we)(t)):this.node().innerHTML},raise:function(){return this.each(be)},lower:function(){return this.each(Me)},append:function(t){var e="function"==typeof t?t:kt(t);return this.select((function(){return this.appendChild(e.apply(this,arguments))}))},insert:function(t,e){var n="function"==typeof t?t:kt(t),o=null==e?Pe:"function"==typeof e?e:At(e);return this.select((function(){return this.insertBefore(n.apply(this,arguments),o.apply(this,arguments)||null)}))},remove:function(){return this.each(Ee)},clone:function(t){return this.select(t?Ne:ze)},datum:function(t){return arguments.length?this.property("__data__",t):this.node().__data__},on:function(t,e,n){var o,r,i=function(t){return t.trim().split(/^|\s+/).map((function(t){var e="",n=t.indexOf(".");return n>=0&&(e=t.slice(n+1),t=t.slice(0,n)),{type:t,name:e}}))}(t+""),a=i.length;if(!(arguments.length<2)){for(s=e?ke:Se,o=0;o<a;++o)this.each(s(i[o],e,n));return this}var s=this.node().__on;if(s)for(var u,c=0,l=s.length;c<l;++c)for(o=0,u=s[c];o<a;++o)if((r=i[o]).type===u.type&&r.name===u.name)return u.value},dispatch:function(t,e){return this.each(("function"==typeof e?Te:Ae)(t,e))},[Symbol.iterator]:function*(){for(var t=this._groups,e=0,n=t.length;e<n;++e)for(var o,r=t[e],i=0,a=r.length;i<a;++i)(o=r[i])&&(yield o);}};const Be={passive:!1},Le={capture:!0,passive:!1};function Re(t){t.stopImmediatePropagation();}function Xe(t){t.preventDefault(),t.stopImmediatePropagation();}function Ye(t){var e=t.document.documentElement,n=De(t).on("dragstart.drag",Xe,Le);"onselectstart"in e?n.on("selectstart.drag",Xe,Le):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none");}function Ve(t,e){var n=t.document.documentElement,o=De(t).on("dragstart.drag",null);e&&(o.on("click.drag",Xe,Le),setTimeout((function(){o.on("click.drag",null);}),0)),"onselectstart"in n?o.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect);}var qe=t=>()=>t;function Ze(t,{sourceEvent:e,subject:n,target:o,identifier:r,active:i,x:a,y:s,dx:u,dy:c,dispatch:l}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},subject:{value:n,enumerable:!0,configurable:!0},target:{value:o,enumerable:!0,configurable:!0},identifier:{value:r,enumerable:!0,configurable:!0},active:{value:i,enumerable:!0,configurable:!0},x:{value:a,enumerable:!0,configurable:!0},y:{value:s,enumerable:!0,configurable:!0},dx:{value:u,enumerable:!0,configurable:!0},dy:{value:c,enumerable:!0,configurable:!0},_:{value:l}});}function Ge(t){return !t.ctrlKey&&!t.button}function je(){return this.parentNode}function Fe(t,e){return null==e?{x:t.x,y:t.y}:e}function We(){return navigator.maxTouchPoints||"ontouchstart"in this}function Ke(){var t,e,n,o,r=Ge,i=je,a=Fe,s=We,u={},c=wt("start","drag","end"),l=0,h=0;function d(t){t.on("mousedown.drag",f).filter(s).on("touchstart.drag",m).on("touchmove.drag",y,Be).on("touchend.drag touchcancel.drag",v).style("touch-action","none").style("-webkit-tap-highlight-color","rgba(0,0,0,0)");}function f(a,s){if(!o&&r.call(this,a,s)){var u=x(this,i.call(this,a,s),a,s,"mouse");u&&(De(a.view).on("mousemove.drag",p,Le).on("mouseup.drag",g,Le),Ye(a.view),Re(a),n=!1,t=a.clientX,e=a.clientY,u("start",a));}}function p(o){if(Xe(o),!n){var r=o.clientX-t,i=o.clientY-e;n=r*r+i*i>h;}u.mouse("drag",o);}function g(t){De(t.view).on("mousemove.drag mouseup.drag",null),Ve(t.view,n),Xe(t),u.mouse("end",t);}function m(t,e){if(r.call(this,t,e)){var n,o,a=t.changedTouches,s=i.call(this,t,e),u=a.length;for(n=0;n<u;++n)(o=x(this,s,t,e,a[n].identifier,a[n]))&&(Re(t),o("start",t,a[n]));}}function y(t){var e,n,o=t.changedTouches,r=o.length;for(e=0;e<r;++e)(n=u[o[e].identifier])&&(Xe(t),n("drag",t,o[e]));}function v(t){var e,n,r=t.changedTouches,i=r.length;for(o&&clearTimeout(o),o=setTimeout((function(){o=null;}),500),e=0;e<i;++e)(n=u[r[e].identifier])&&(Re(t),n("end",t,r[e]));}function x(t,e,n,o,r,i){var s,h,f,p=c.copy(),g=He(i||n,e);if(null!=(f=a.call(t,new Ze("beforestart",{sourceEvent:n,target:d,identifier:r,active:l,x:g[0],y:g[1],dx:0,dy:0,dispatch:p}),o)))return s=f.x-g[0]||0,h=f.y-g[1]||0,function n(i,a,c){var m,y=g;switch(i){case"start":u[r]=n,m=l++;break;case"end":delete u[r],--l;case"drag":g=He(c||a,e),m=l;}p.call(i,t,new Ze(i,{sourceEvent:a,subject:f,target:d,identifier:r,active:m,x:g[0]+s,y:g[1]+h,dx:g[0]-y[0],dy:g[1]-y[1],dispatch:p}),o);}}return d.filter=function(t){return arguments.length?(r="function"==typeof t?t:qe(!!t),d):r},d.container=function(t){return arguments.length?(i="function"==typeof t?t:qe(t),d):i},d.subject=function(t){return arguments.length?(a="function"==typeof t?t:qe(t),d):a},d.touchable=function(t){return arguments.length?(s="function"==typeof t?t:qe(!!t),d):s},d.on=function(){var t=c.on.apply(c,arguments);return t===c?d:t},d.clickDistance=function(t){return arguments.length?(h=(t=+t)*t,d):Math.sqrt(h)},d}function Ue(t,e){if(!t.parentId)return !1;const n=e.get(t.parentId);return !!n&&(!!n.selected||Ue(n,e))}function Qe(t,e,n){let o=t;do{if(o?.matches?.(e))return !0;if(o===n)return !1;o=o?.parentElement;}while(o);return !1}function Je({nodeId:t,dragItems:e,nodeLookup:n,dragging:o=!0}){const r=[];for(const[t,i]of e){const e=n.get(t)?.internals.userNode;e&&r.push({...e,position:i.position,dragging:o});}if(!t)return [r[0],r];const i=n.get(t)?.internals.userNode;return [i?{...i,position:e.get(t)?.position||i.position,dragging:o}:r[0],r]}Ze.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};const tn=250;function en(t,e,n,o){let r=[],i=1/0;const a=function(t,e,n){const o=[],r={x:t.x-n,y:t.y-n,width:2*n,height:2*n};for(const t of e.values())S(r,E(t))>0&&o.push(t);return o}(t,n,e+tn);for(const n of a){const a=[...n.internals.handleBounds?.source??[],...n.internals.handleBounds?.target??[]];for(const s of a){if(o.nodeId===s.nodeId&&o.type===s.type&&o.id===s.id)continue;const{x:a,y:u}=ot(n,s,s.position,!0),c=Math.sqrt(Math.pow(a-t.x,2)+Math.pow(u-t.y,2));c>e||(c<i?(r=[{...s,x:a,y:u}],i=c):c===i&&r.push({...s,x:a,y:u}));}}if(!r.length)return null;if(r.length>1){const t="source"===o.type?"target":"source";return r.find((e=>e.type===t))??r[0]}return r[0]}function nn(t,e,n,o,r,i=!1){const a=o.get(t);if(!a)return null;const s="strict"===r?a.internals.handleBounds?.[e]:[...a.internals.handleBounds?.source??[],...a.internals.handleBounds?.target??[]],u=(n?s?.find((t=>t.id===n)):s?.[0])??null;return u&&i?{...u,...ot(a,u,u.position,!0)}:u}function on(t,e){return t||(e?.classList.contains("target")?"target":e?.classList.contains("source")?"source":null)}const rn=()=>!0;function an(e,{handle:n,connectionMode:o,fromNodeId:r,fromHandleId:i,fromType:a,doc:s,lib:u,flowId:c,isValidConnection:l=rn,nodeLookup:h}){const d="target"===a,f=n?s.querySelector(`.${u}-flow__handle[data-id="${c}-${n?.nodeId}-${n?.id}-${n?.type}"]`):null,{x:p,y:g}=q(e),m=s.elementFromPoint(p,g),y=m?.classList.contains(`${u}-flow__handle`)?m:f,v={handleDomNode:y,isValid:!1,connection:null,toHandle:null};if(y){const e=on(void 0,y),n=y.getAttribute("data-nodeid"),a=y.getAttribute("data-handleid"),s=y.classList.contains("connectable"),u=y.classList.contains("connectableend");if(!n||!e)return v;const c={source:d?n:r,sourceHandle:d?a:i,target:d?r:n,targetHandle:d?i:a};v.connection=c;const f=s&&u&&(o===t.ConnectionMode.Strict?d&&"source"===e||!d&&"target"===e:n!==r||a!==i);v.isValid=f&&l(c),v.toHandle=nn(n,e,a,h,o,!0);}return v}const sn={onPointerDown:function(e,{connectionMode:n,connectionRadius:o,handleId:r,nodeId:i,edgeUpdaterType:a,isTarget:s,domNode:u,nodeLookup:c,lib:h,autoPanOnConnect:d,flowId:f,panBy:p,cancelConnection:g,onConnectStart:m,onConnect:y,onConnectEnd:v,isValidConnection:x=rn,onReconnectEnd:w,updateConnection:b,getTransform:M,getFromHandle:P,autoPanSpeed:E,dragThreshold:z=1,handleDomNode:N}){const S=X(e.target);let k,I=0;const{x:A,y:C}=q(e),O=on(a,N),D=u?.getBoundingClientRect();let H=!1;if(!D||!O)return;const B=nn(i,O,r,c,n);if(!B)return;let L=q(e,D),R=!1,Y=null,V=!1,Z=null;function G(){if(!d||!D)return;const[t,e]=_(L,D,E);p({x:t,y:e}),I=requestAnimationFrame(G);}const j={...B,nodeId:i,type:O,position:B.position},F=c.get(i);let W={inProgress:!0,isValid:null,from:ot(F,j,t.Position.Left,!0),fromHandle:j,fromPosition:j.position,fromNode:F,to:L,toHandle:null,toPosition:l[j.position],toNode:null,pointer:L};function K(){H=!0,b(W),m?.(e,{nodeId:i,handleId:r,handleType:O});}function U(e){if(!H){const{x:t,y:n}=q(e),o=t-A,r=n-C;if(!(o*o+r*r>z*z))return;K();}if(!P()||!j)return void Q(e);const a=M();L=q(e,D),k=en(T(L,a,!1,[1,1]),o,c,j),R||(G(),R=!0);const u=an(e,{handle:k,connectionMode:n,fromNodeId:i,fromHandleId:r,fromType:s?"target":"source",isValidConnection:x,doc:S,lib:h,flowId:f,nodeLookup:c});Z=u.handleDomNode,Y=u.connection,V=function(t,e){let n=null;return e?n=!0:t&&!e&&(n=!1),n}(!!k,u.isValid);const d=c.get(i),p=d?ot(d,j,t.Position.Left,!0):W.from,g={...W,from:p,isValid:V,to:u.toHandle&&V?$({x:u.toHandle.x,y:u.toHandle.y},a):L,toHandle:u.toHandle,toPosition:V&&u.toHandle?u.toHandle.position:l[j.position],toNode:u.toHandle?c.get(u.toHandle.nodeId):null,pointer:L};b(g),W=g;}function Q(t){if(!("touches"in t&&t.touches.length>0)){if(H){(k||Z)&&Y&&V&&y?.(Y);const{inProgress:e,...n}=W,o={...n,toPosition:W.toHandle?W.toPosition:null};v?.(t,o),a&&w?.(t,o);}g(),cancelAnimationFrame(I),R=!1,V=!1,Y=null,Z=null,S.removeEventListener("mousemove",U),S.removeEventListener("mouseup",Q),S.removeEventListener("touchmove",U),S.removeEventListener("touchend",Q);}}0===z&&K(),S.addEventListener("mousemove",U),S.addEventListener("mouseup",Q),S.addEventListener("touchmove",U),S.addEventListener("touchend",Q);},isValid:an};function un(t,e,n){t.prototype=e.prototype=n,n.constructor=t;}function cn(t,e){var n=Object.create(t.prototype);for(var o in e)n[o]=e[o];return n}function ln(){}var hn=.7,dn=1/hn,fn="\\s*([+-]?\\d+)\\s*",pn="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",gn="\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",mn=/^#([0-9a-f]{3,8})$/,yn=new RegExp(`^rgb\\(${fn},${fn},${fn}\\)$`),vn=new RegExp(`^rgb\\(${gn},${gn},${gn}\\)$`),xn=new RegExp(`^rgba\\(${fn},${fn},${fn},${pn}\\)$`),wn=new RegExp(`^rgba\\(${gn},${gn},${gn},${pn}\\)$`),_n=new RegExp(`^hsl\\(${pn},${gn},${gn}\\)$`),bn=new RegExp(`^hsla\\(${pn},${gn},${gn},${pn}\\)$`),Mn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};function Pn(){return this.rgb().formatHex()}function En(){return this.rgb().formatRgb()}function zn(t){var e,n;return t=(t+"").trim().toLowerCase(),(e=mn.exec(t))?(n=e[1].length,e=parseInt(e[1],16),6===n?Nn(e):3===n?new In(e>>8&15|e>>4&240,e>>4&15|240&e,(15&e)<<4|15&e,1):8===n?Sn(e>>24&255,e>>16&255,e>>8&255,(255&e)/255):4===n?Sn(e>>12&15|e>>8&240,e>>8&15|e>>4&240,e>>4&15|240&e,((15&e)<<4|15&e)/255):null):(e=yn.exec(t))?new In(e[1],e[2],e[3],1):(e=vn.exec(t))?new In(255*e[1]/100,255*e[2]/100,255*e[3]/100,1):(e=xn.exec(t))?Sn(e[1],e[2],e[3],e[4]):(e=wn.exec(t))?Sn(255*e[1]/100,255*e[2]/100,255*e[3]/100,e[4]):(e=_n.exec(t))?Dn(e[1],e[2]/100,e[3]/100,1):(e=bn.exec(t))?Dn(e[1],e[2]/100,e[3]/100,e[4]):Mn.hasOwnProperty(t)?Nn(Mn[t]):"transparent"===t?new In(NaN,NaN,NaN,0):null}function Nn(t){return new In(t>>16&255,t>>8&255,255&t,1)}function Sn(t,e,n,o){return o<=0&&(t=e=n=NaN),new In(t,e,n,o)}function kn(t,e,n,o){return 1===arguments.length?((r=t)instanceof ln||(r=zn(r)),r?new In((r=r.rgb()).r,r.g,r.b,r.opacity):new In):new In(t,e,n,null==o?1:o);var r;}function In(t,e,n,o){this.r=+t,this.g=+e,this.b=+n,this.opacity=+o;}function An(){return `#${On(this.r)}${On(this.g)}${On(this.b)}`}function Tn(){const t=$n(this.opacity);return `${1===t?"rgb(":"rgba("}${Cn(this.r)}, ${Cn(this.g)}, ${Cn(this.b)}${1===t?")":`, ${t})`}`}function $n(t){return isNaN(t)?1:Math.max(0,Math.min(1,t))}function Cn(t){return Math.max(0,Math.min(255,Math.round(t)||0))}function On(t){return ((t=Cn(t))<16?"0":"")+t.toString(16)}function Dn(t,e,n,o){return o<=0?t=e=n=NaN:n<=0||n>=1?t=e=NaN:e<=0&&(t=NaN),new Bn(t,e,n,o)}function Hn(t){if(t instanceof Bn)return new Bn(t.h,t.s,t.l,t.opacity);if(t instanceof ln||(t=zn(t)),!t)return new Bn;if(t instanceof Bn)return t;var e=(t=t.rgb()).r/255,n=t.g/255,o=t.b/255,r=Math.min(e,n,o),i=Math.max(e,n,o),a=NaN,s=i-r,u=(i+r)/2;return s?(a=e===i?(n-o)/s+6*(n<o):n===i?(o-e)/s+2:(e-n)/s+4,s/=u<.5?i+r:2-i-r,a*=60):s=u>0&&u<1?0:a,new Bn(a,s,u,t.opacity)}function Bn(t,e,n,o){this.h=+t,this.s=+e,this.l=+n,this.opacity=+o;}function Ln(t){return (t=(t||0)%360)<0?t+360:t}function Rn(t){return Math.max(0,Math.min(1,t||0))}function Xn(t,e,n){return 255*(t<60?e+(n-e)*t/60:t<180?n:t<240?e+(n-e)*(240-t)/60:e)}un(ln,zn,{copy(t){return Object.assign(new this.constructor,this,t)},displayable(){return this.rgb().displayable()},hex:Pn,formatHex:Pn,formatHex8:function(){return this.rgb().formatHex8()},formatHsl:function(){return Hn(this).formatHsl()},formatRgb:En,toString:En}),un(In,kn,cn(ln,{brighter(t){return t=null==t?dn:Math.pow(dn,t),new In(this.r*t,this.g*t,this.b*t,this.opacity)},darker(t){return t=null==t?hn:Math.pow(hn,t),new In(this.r*t,this.g*t,this.b*t,this.opacity)},rgb(){return this},clamp(){return new In(Cn(this.r),Cn(this.g),Cn(this.b),$n(this.opacity))},displayable(){return -.5<=this.r&&this.r<255.5&&-.5<=this.g&&this.g<255.5&&-.5<=this.b&&this.b<255.5&&0<=this.opacity&&this.opacity<=1},hex:An,formatHex:An,formatHex8:function(){return `#${On(this.r)}${On(this.g)}${On(this.b)}${On(255*(isNaN(this.opacity)?1:this.opacity))}`},formatRgb:Tn,toString:Tn})),un(Bn,(function(t,e,n,o){return 1===arguments.length?Hn(t):new Bn(t,e,n,null==o?1:o)}),cn(ln,{brighter(t){return t=null==t?dn:Math.pow(dn,t),new Bn(this.h,this.s,this.l*t,this.opacity)},darker(t){return t=null==t?hn:Math.pow(hn,t),new Bn(this.h,this.s,this.l*t,this.opacity)},rgb(){var t=this.h%360+360*(this.h<0),e=isNaN(t)||isNaN(this.s)?0:this.s,n=this.l,o=n+(n<.5?n:1-n)*e,r=2*n-o;return new In(Xn(t>=240?t-240:t+120,r,o),Xn(t,r,o),Xn(t<120?t+240:t-120,r,o),this.opacity)},clamp(){return new Bn(Ln(this.h),Rn(this.s),Rn(this.l),$n(this.opacity))},displayable(){return (0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1},formatHsl(){const t=$n(this.opacity);return `${1===t?"hsl(":"hsla("}${Ln(this.h)}, ${100*Rn(this.s)}%, ${100*Rn(this.l)}%${1===t?")":`, ${t})`}`}}));var Yn=t=>()=>t;function Vn(t){return 1==(t=+t)?qn:function(e,n){return n-e?function(t,e,n){return t=Math.pow(t,n),e=Math.pow(e,n)-t,n=1/n,function(o){return Math.pow(t+o*e,n)}}(e,n,t):Yn(isNaN(e)?n:e)}}function qn(t,e){var n=e-t;return n?function(t,e){return function(n){return t+n*e}}(t,n):Yn(isNaN(t)?e:t)}var Zn=function t(e){var n=Vn(e);function o(t,e){var o=n((t=kn(t)).r,(e=kn(e)).r),r=n(t.g,e.g),i=n(t.b,e.b),a=qn(t.opacity,e.opacity);return function(e){return t.r=o(e),t.g=r(e),t.b=i(e),t.opacity=a(e),t+""}}return o.gamma=t,o}(1);function Gn(t,e){e||(e=[]);var n,o=t?Math.min(e.length,t.length):0,r=e.slice();return function(i){for(n=0;n<o;++n)r[n]=t[n]*(1-i)+e[n]*i;return r}}function jn(t,e){var n,o=e?e.length:0,r=t?Math.min(o,t.length):0,i=new Array(r),a=new Array(o);for(n=0;n<r;++n)i[n]=to(t[n],e[n]);for(;n<o;++n)a[n]=e[n];return function(t){for(n=0;n<r;++n)a[n]=i[n](t);return a}}function Fn(t,e){var n=new Date;return t=+t,e=+e,function(o){return n.setTime(t*(1-o)+e*o),n}}function Wn(t,e){return t=+t,e=+e,function(n){return t*(1-n)+e*n}}function Kn(t,e){var n,o={},r={};for(n in null!==t&&"object"==typeof t||(t={}),null!==e&&"object"==typeof e||(e={}),e)n in t?o[n]=to(t[n],e[n]):r[n]=e[n];return function(t){for(n in o)r[n]=o[n](t);return r}}var Un=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,Qn=new RegExp(Un.source,"g");function Jn(t,e){var n,o,r,i=Un.lastIndex=Qn.lastIndex=0,a=-1,s=[],u=[];for(t+="",e+="";(n=Un.exec(t))&&(o=Qn.exec(e));)(r=o.index)>i&&(r=e.slice(i,r),s[a]?s[a]+=r:s[++a]=r),(n=n[0])===(o=o[0])?s[a]?s[a]+=o:s[++a]=o:(s[++a]=null,u.push({i:a,x:Wn(n,o)})),i=Qn.lastIndex;return i<e.length&&(r=e.slice(i),s[a]?s[a]+=r:s[++a]=r),s.length<2?u[0]?function(t){return function(e){return t(e)+""}}(u[0].x):function(t){return function(){return t}}(e):(e=u.length,function(t){for(var n,o=0;o<e;++o)s[(n=u[o]).i]=n.x(t);return s.join("")})}function to(t,e){var n,o,r=typeof e;return null==e||"boolean"===r?Yn(e):("number"===r?Wn:"string"===r?(n=zn(e))?(e=n,Zn):Jn:e instanceof zn?Zn:e instanceof Date?Fn:(o=e,!ArrayBuffer.isView(o)||o instanceof DataView?Array.isArray(e)?jn:"function"!=typeof e.valueOf&&"function"!=typeof e.toString||isNaN(e)?Kn:Wn:Gn))(t,e)}var eo,no=180/Math.PI,oo={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1};function ro(t,e,n,o,r,i){var a,s,u;return (a=Math.sqrt(t*t+e*e))&&(t/=a,e/=a),(u=t*n+e*o)&&(n-=t*u,o-=e*u),(s=Math.sqrt(n*n+o*o))&&(n/=s,o/=s,u/=s),t*o<e*n&&(t=-t,e=-e,u=-u,a=-a),{translateX:r,translateY:i,rotate:Math.atan2(e,t)*no,skewX:Math.atan(u)*no,scaleX:a,scaleY:s}}function io(t,e,n,o){function r(t){return t.length?t.pop()+" ":""}return function(i,a){var s=[],u=[];return i=t(i),a=t(a),function(t,o,r,i,a,s){if(t!==r||o!==i){var u=a.push("translate(",null,e,null,n);s.push({i:u-4,x:Wn(t,r)},{i:u-2,x:Wn(o,i)});}else (r||i)&&a.push("translate("+r+e+i+n);}(i.translateX,i.translateY,a.translateX,a.translateY,s,u),function(t,e,n,i){t!==e?(t-e>180?e+=360:e-t>180&&(t+=360),i.push({i:n.push(r(n)+"rotate(",null,o)-2,x:Wn(t,e)})):e&&n.push(r(n)+"rotate("+e+o);}(i.rotate,a.rotate,s,u),function(t,e,n,i){t!==e?i.push({i:n.push(r(n)+"skewX(",null,o)-2,x:Wn(t,e)}):e&&n.push(r(n)+"skewX("+e+o);}(i.skewX,a.skewX,s,u),function(t,e,n,o,i,a){if(t!==n||e!==o){var s=i.push(r(i)+"scale(",null,",",null,")");a.push({i:s-4,x:Wn(t,n)},{i:s-2,x:Wn(e,o)});}else 1===n&&1===o||i.push(r(i)+"scale("+n+","+o+")");}(i.scaleX,i.scaleY,a.scaleX,a.scaleY,s,u),i=a=null,function(t){for(var e,n=-1,o=u.length;++n<o;)s[(e=u[n]).i]=e.x(t);return s.join("")}}}var ao=io((function(t){const e=new("function"==typeof DOMMatrix?DOMMatrix:WebKitCSSMatrix)(t+"");return e.isIdentity?oo:ro(e.a,e.b,e.c,e.d,e.e,e.f)}),"px, ","px)","deg)"),so=io((function(t){return null==t?oo:(eo||(eo=document.createElementNS("http://www.w3.org/2000/svg","g")),eo.setAttribute("transform",t),(t=eo.transform.baseVal.consolidate())?ro((t=t.matrix).a,t.b,t.c,t.d,t.e,t.f):oo)}),", ",")",")");function uo(t){return ((t=Math.exp(t))+1/t)/2}var co,lo,ho=function t(e,n,o){function r(t,r){var i,a,s=t[0],u=t[1],c=t[2],l=r[0],h=r[1],d=r[2],f=l-s,p=h-u,g=f*f+p*p;if(g<1e-12)a=Math.log(d/c)/e,i=function(t){return [s+t*f,u+t*p,c*Math.exp(e*t*a)]};else {var m=Math.sqrt(g),y=(d*d-c*c+o*g)/(2*c*n*m),v=(d*d-c*c-o*g)/(2*d*n*m),x=Math.log(Math.sqrt(y*y+1)-y),w=Math.log(Math.sqrt(v*v+1)-v);a=(w-x)/e,i=function(t){var o,r=t*a,i=uo(x),l=c/(n*m)*(i*(o=e*r+x,((o=Math.exp(2*o))-1)/(o+1))-function(t){return ((t=Math.exp(t))-1/t)/2}(x));return [s+l*f,u+l*p,c*i/uo(e*r+x)]};}return i.duration=1e3*a*e/Math.SQRT2,i}return r.rho=function(e){var n=Math.max(.001,+e),o=n*n;return t(n,o,o*o)},r}(Math.SQRT2,2,4),fo=0,po=0,go=0,mo=1e3,yo=0,vo=0,xo=0,wo="object"==typeof performance&&performance.now?performance:Date,_o="object"==typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17);};function bo(){return vo||(_o(Mo),vo=wo.now()+xo)}function Mo(){vo=0;}function Po(){this._call=this._time=this._next=null;}function Eo(t,e,n){var o=new Po;return o.restart(t,e,n),o}function zo(){vo=(yo=wo.now())+xo,fo=po=0;try{!function(){bo(),++fo;for(var t,e=co;e;)(t=vo-e._time)>=0&&e._call.call(void 0,t),e=e._next;--fo;}();}finally{fo=0,function(){var t,e,n=co,o=1/0;for(;n;)n._call?(o>n._time&&(o=n._time),t=n,n=n._next):(e=n._next,n._next=null,n=t?t._next=e:co=e);lo=t,So(o);}(),vo=0;}}function No(){var t=wo.now(),e=t-yo;e>mo&&(xo-=e,yo=t);}function So(t){fo||(po&&(po=clearTimeout(po)),t-vo>24?(t<1/0&&(po=setTimeout(zo,t-wo.now()-xo)),go&&(go=clearInterval(go))):(go||(yo=wo.now(),go=setInterval(No,mo)),fo=1,_o(zo)));}function ko(t,e,n){var o=new Po;return e=null==e?0:+e,o.restart((n=>{o.stop(),t(n+e);}),e,n),o}Po.prototype=Eo.prototype={constructor:Po,restart:function(t,e,n){if("function"!=typeof t)throw new TypeError("callback is not a function");n=(null==n?bo():+n)+(null==e?0:+e),this._next||lo===this||(lo?lo._next=this:co=this,lo=this),this._call=t,this._time=n,So();},stop:function(){this._call&&(this._call=null,this._time=1/0,So());}};var Io=wt("start","end","cancel","interrupt"),Ao=[],To=0,$o=1,Co=2,Oo=3,Do=4,Ho=5,Bo=6;function Lo(t,e,n,o,r,i){var a=t.__transition;if(a){if(n in a)return}else t.__transition={};!function(t,e,n){var o,r=t.__transition;function i(t){n.state=$o,n.timer.restart(a,n.delay,n.time),n.delay<=t&&a(t-n.delay);}function a(i){var c,l,h,d;if(n.state!==$o)return u();for(c in r)if((d=r[c]).name===n.name){if(d.state===Oo)return ko(a);d.state===Do?(d.state=Bo,d.timer.stop(),d.on.call("interrupt",t,t.__data__,d.index,d.group),delete r[c]):+c<e&&(d.state=Bo,d.timer.stop(),d.on.call("cancel",t,t.__data__,d.index,d.group),delete r[c]);}if(ko((function(){n.state===Oo&&(n.state=Do,n.timer.restart(s,n.delay,n.time),s(i));})),n.state=Co,n.on.call("start",t,t.__data__,n.index,n.group),n.state===Co){for(n.state=Oo,o=new Array(h=n.tween.length),c=0,l=-1;c<h;++c)(d=n.tween[c].value.call(t,t.__data__,n.index,n.group))&&(o[++l]=d);o.length=l+1;}}function s(e){for(var r=e<n.duration?n.ease.call(null,e/n.duration):(n.timer.restart(u),n.state=Ho,1),i=-1,a=o.length;++i<a;)o[i].call(t,r);n.state===Ho&&(n.on.call("end",t,t.__data__,n.index,n.group),u());}function u(){for(var o in n.state=Bo,n.timer.stop(),delete r[e],r)return;delete t.__transition;}r[e]=n,n.timer=Eo(i,0,n.time);}(t,n,{name:e,index:o,group:r,on:Io,tween:Ao,time:i.time,delay:i.delay,duration:i.duration,ease:i.ease,timer:null,state:To});}function Ro(t,e){var n=Yo(t,e);if(n.state>To)throw new Error("too late; already scheduled");return n}function Xo(t,e){var n=Yo(t,e);if(n.state>Oo)throw new Error("too late; already running");return n}function Yo(t,e){var n=t.__transition;if(!n||!(n=n[e]))throw new Error("transition not found");return n}function Vo(t,e){var n,o,r,i=t.__transition,a=!0;if(i){for(r in e=null==e?null:e+"",i)(n=i[r]).name===e?(o=n.state>Co&&n.state<Ho,n.state=Bo,n.timer.stop(),n.on.call(o?"interrupt":"cancel",t,t.__data__,n.index,n.group),delete i[r]):a=!1;a&&delete t.__transition;}}function qo(t,e){var n,o;return function(){var r=Xo(this,t),i=r.tween;if(i!==n)for(var a=0,s=(o=n=i).length;a<s;++a)if(o[a].name===e){(o=o.slice()).splice(a,1);break}r.tween=o;}}function Zo(t,e,n){var o,r;if("function"!=typeof n)throw new Error;return function(){var i=Xo(this,t),a=i.tween;if(a!==o){r=(o=a).slice();for(var s={name:e,value:n},u=0,c=r.length;u<c;++u)if(r[u].name===e){r[u]=s;break}u===c&&r.push(s);}i.tween=r;}}function Go(t,e,n){var o=t._id;return t.each((function(){var t=Xo(this,o);(t.value||(t.value={}))[e]=n.apply(this,arguments);})),function(t){return Yo(t,o).value[e]}}function jo(t,e){var n;return ("number"==typeof e?Wn:e instanceof zn?Zn:(n=zn(e))?(e=n,Zn):Jn)(t,e)}function Fo(t){return function(){this.removeAttribute(t);}}function Wo(t){return function(){this.removeAttributeNS(t.space,t.local);}}function Ko(t,e,n){var o,r,i=n+"";return function(){var a=this.getAttribute(t);return a===i?null:a===o?r:r=e(o=a,n)}}function Uo(t,e,n){var o,r,i=n+"";return function(){var a=this.getAttributeNS(t.space,t.local);return a===i?null:a===o?r:r=e(o=a,n)}}function Qo(t,e,n){var o,r,i;return function(){var a,s,u=n(this);if(null!=u)return (a=this.getAttribute(t))===(s=u+"")?null:a===o&&s===r?i:(r=s,i=e(o=a,u));this.removeAttribute(t);}}function Jo(t,e,n){var o,r,i;return function(){var a,s,u=n(this);if(null!=u)return (a=this.getAttributeNS(t.space,t.local))===(s=u+"")?null:a===o&&s===r?i:(r=s,i=e(o=a,u));this.removeAttributeNS(t.space,t.local);}}function tr(t,e){var n,o;function r(){var r=e.apply(this,arguments);return r!==o&&(n=(o=r)&&function(t,e){return function(n){this.setAttributeNS(t.space,t.local,e.call(this,n));}}(t,r)),n}return r._value=e,r}function er(t,e){var n,o;function r(){var r=e.apply(this,arguments);return r!==o&&(n=(o=r)&&function(t,e){return function(n){this.setAttribute(t,e.call(this,n));}}(t,r)),n}return r._value=e,r}function nr(t,e){return function(){Ro(this,t).delay=+e.apply(this,arguments);}}function or(t,e){return e=+e,function(){Ro(this,t).delay=e;}}function rr(t,e){return function(){Xo(this,t).duration=+e.apply(this,arguments);}}function ir(t,e){return e=+e,function(){Xo(this,t).duration=e;}}var ar=Oe.prototype.constructor;function sr(t){return function(){this.style.removeProperty(t);}}var ur=0;function cr(t,e,n,o){this._groups=t,this._parents=e,this._name=n,this._id=o;}function lr(){return ++ur}var hr=Oe.prototype;cr.prototype={constructor:cr,select:function(t){var e=this._name,n=this._id;"function"!=typeof t&&(t=At(t));for(var o=this._groups,r=o.length,i=new Array(r),a=0;a<r;++a)for(var s,u,c=o[a],l=c.length,h=i[a]=new Array(l),d=0;d<l;++d)(s=c[d])&&(u=t.call(s,s.__data__,d,c))&&("__data__"in s&&(u.__data__=s.__data__),h[d]=u,Lo(h[d],e,n,d,h,Yo(s,n)));return new cr(i,this._parents,e,n)},selectAll:function(t){var e=this._name,n=this._id;"function"!=typeof t&&(t=$t(t));for(var o=this._groups,r=o.length,i=[],a=[],s=0;s<r;++s)for(var u,c=o[s],l=c.length,h=0;h<l;++h)if(u=c[h]){for(var d,f=t.call(u,u.__data__,h,c),p=Yo(u,n),g=0,m=f.length;g<m;++g)(d=f[g])&&Lo(d,e,n,g,f,p);i.push(f),a.push(u);}return new cr(i,a,e,n)},selectChild:hr.selectChild,selectChildren:hr.selectChildren,filter:function(t){"function"!=typeof t&&(t=Ot(t));for(var e=this._groups,n=e.length,o=new Array(n),r=0;r<n;++r)for(var i,a=e[r],s=a.length,u=o[r]=[],c=0;c<s;++c)(i=a[c])&&t.call(i,i.__data__,c,a)&&u.push(i);return new cr(o,this._parents,this._name,this._id)},merge:function(t){if(t._id!==this._id)throw new Error;for(var e=this._groups,n=t._groups,o=e.length,r=n.length,i=Math.min(o,r),a=new Array(o),s=0;s<i;++s)for(var u,c=e[s],l=n[s],h=c.length,d=a[s]=new Array(h),f=0;f<h;++f)(u=c[f]||l[f])&&(d[f]=u);for(;s<o;++s)a[s]=e[s];return new cr(a,this._parents,this._name,this._id)},selection:function(){return new ar(this._groups,this._parents)},transition:function(){for(var t=this._name,e=this._id,n=lr(),o=this._groups,r=o.length,i=0;i<r;++i)for(var a,s=o[i],u=s.length,c=0;c<u;++c)if(a=s[c]){var l=Yo(a,e);Lo(a,t,n,c,s,{time:l.time+l.delay+l.duration,delay:0,duration:l.duration,ease:l.ease});}return new cr(o,this._parents,t,n)},call:hr.call,nodes:hr.nodes,node:hr.node,size:hr.size,empty:hr.empty,each:hr.each,on:function(t,e){var n=this._id;return arguments.length<2?Yo(this.node(),n).on.on(t):this.each(function(t,e,n){var o,r,i=function(t){return (t+"").trim().split(/^|\s+/).every((function(t){var e=t.indexOf(".");return e>=0&&(t=t.slice(0,e)),!t||"start"===t}))}(e)?Ro:Xo;return function(){var a=i(this,t),s=a.on;s!==o&&(r=(o=s).copy()).on(e,n),a.on=r;}}(n,t,e))},attr:function(t,e){var n=zt(t),o="transform"===n?so:jo;return this.attrTween(t,"function"==typeof e?(n.local?Jo:Qo)(n,o,Go(this,"attr."+t,e)):null==e?(n.local?Wo:Fo)(n):(n.local?Uo:Ko)(n,o,e))},attrTween:function(t,e){var n="attr."+t;if(arguments.length<2)return (n=this.tween(n))&&n._value;if(null==e)return this.tween(n,null);if("function"!=typeof e)throw new Error;var o=zt(t);return this.tween(n,(o.local?tr:er)(o,e))},style:function(t,e,n){var o="transform"==(t+="")?ao:jo;return null==e?this.styleTween(t,function(t,e){var n,o,r;return function(){var i=re(this,t),a=(this.style.removeProperty(t),re(this,t));return i===a?null:i===n&&a===o?r:r=e(n=i,o=a)}}(t,o)).on("end.style."+t,sr(t)):"function"==typeof e?this.styleTween(t,function(t,e,n){var o,r,i;return function(){var a=re(this,t),s=n(this),u=s+"";return null==s&&(this.style.removeProperty(t),u=s=re(this,t)),a===u?null:a===o&&u===r?i:(r=u,i=e(o=a,s))}}(t,o,Go(this,"style."+t,e))).each(function(t,e){var n,o,r,i,a="style."+e,s="end."+a;return function(){var u=Xo(this,t),c=u.on,l=null==u.value[a]?i||(i=sr(e)):void 0;c===n&&r===l||(o=(n=c).copy()).on(s,r=l),u.on=o;}}(this._id,t)):this.styleTween(t,function(t,e,n){var o,r,i=n+"";return function(){var a=re(this,t);return a===i?null:a===o?r:r=e(o=a,n)}}(t,o,e),n).on("end.style."+t,null)},styleTween:function(t,e,n){var o="style."+(t+="");if(arguments.length<2)return (o=this.tween(o))&&o._value;if(null==e)return this.tween(o,null);if("function"!=typeof e)throw new Error;return this.tween(o,function(t,e,n){var o,r;function i(){var i=e.apply(this,arguments);return i!==r&&(o=(r=i)&&function(t,e,n){return function(o){this.style.setProperty(t,e.call(this,o),n);}}(t,i,n)),o}return i._value=e,i}(t,e,null==n?"":n))},text:function(t){return this.tween("text","function"==typeof t?function(t){return function(){var e=t(this);this.textContent=null==e?"":e;}}(Go(this,"text",t)):function(t){return function(){this.textContent=t;}}(null==t?"":t+""))},textTween:function(t){var e="text";if(arguments.length<1)return (e=this.tween(e))&&e._value;if(null==t)return this.tween(e,null);if("function"!=typeof t)throw new Error;return this.tween(e,function(t){var e,n;function o(){var o=t.apply(this,arguments);return o!==n&&(e=(n=o)&&function(t){return function(e){this.textContent=t.call(this,e);}}(o)),e}return o._value=t,o}(t))},remove:function(){return this.on("end.remove",function(t){return function(){var e=this.parentNode;for(var n in this.__transition)if(+n!==t)return;e&&e.removeChild(this);}}(this._id))},tween:function(t,e){var n=this._id;if(t+="",arguments.length<2){for(var o,r=Yo(this.node(),n).tween,i=0,a=r.length;i<a;++i)if((o=r[i]).name===t)return o.value;return null}return this.each((null==e?qo:Zo)(n,t,e))},delay:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?nr:or)(e,t)):Yo(this.node(),e).delay},duration:function(t){var e=this._id;return arguments.length?this.each(("function"==typeof t?rr:ir)(e,t)):Yo(this.node(),e).duration},ease:function(t){var e=this._id;return arguments.length?this.each(function(t,e){if("function"!=typeof e)throw new Error;return function(){Xo(this,t).ease=e;}}(e,t)):Yo(this.node(),e).ease},easeVarying:function(t){if("function"!=typeof t)throw new Error;return this.each(function(t,e){return function(){var n=e.apply(this,arguments);if("function"!=typeof n)throw new Error;Xo(this,t).ease=n;}}(this._id,t))},end:function(){var t,e,n=this,o=n._id,r=n.size();return new Promise((function(i,a){var s={value:a},u={value:function(){0==--r&&i();}};n.each((function(){var n=Xo(this,o),r=n.on;r!==t&&((e=(t=r).copy())._.cancel.push(s),e._.interrupt.push(s),e._.end.push(u)),n.on=e;})),0===r&&i();}))},[Symbol.iterator]:hr[Symbol.iterator]};var dr={time:null,delay:0,duration:250,ease:function(t){return ((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}};function fr(t,e){for(var n;!(n=t.__transition)||!(n=n[e]);)if(!(t=t.parentNode))throw new Error(`transition ${e} not found`);return n}Oe.prototype.interrupt=function(t){return this.each((function(){Vo(this,t);}))},Oe.prototype.transition=function(t){var e,n;t instanceof cr?(e=t._id,t=t._name):(e=lr(),(n=dr).time=bo(),t=null==t?null:t+"");for(var o=this._groups,r=o.length,i=0;i<r;++i)for(var a,s=o[i],u=s.length,c=0;c<u;++c)(a=s[c])&&Lo(a,t,e,c,s,n||fr(a,e));return new cr(o,this._parents,t,e)};var pr=t=>()=>t;function gr(t,{sourceEvent:e,target:n,transform:o,dispatch:r}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:o,enumerable:!0,configurable:!0},_:{value:r}});}function mr(t,e,n){this.k=t,this.x=e,this.y=n;}mr.prototype={constructor:mr,scale:function(t){return 1===t?this:new mr(this.k*t,this.x,this.y)},translate:function(t,e){return 0===t&0===e?this:new mr(this.k,this.x+this.k*t,this.y+this.k*e)},apply:function(t){return [t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return [(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return (t-this.x)/this.k},invertY:function(t){return (t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return "translate("+this.x+","+this.y+") scale("+this.k+")"}};var yr=new mr(1,0,0);function vr(t){for(;!t.__zoom;)if(!(t=t.parentNode))return yr;return t.__zoom}function xr(t){t.stopImmediatePropagation();}function wr(t){t.preventDefault(),t.stopImmediatePropagation();}function _r(t){return !(t.ctrlKey&&"wheel"!==t.type||t.button)}function br(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t).hasAttribute("viewBox")?[[(t=t.viewBox.baseVal).x,t.y],[t.x+t.width,t.y+t.height]]:[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]:[[0,0],[t.clientWidth,t.clientHeight]]}function Mr(){return this.__zoom||yr}function Pr(t){return -t.deltaY*(1===t.deltaMode?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function Er(){return navigator.maxTouchPoints||"ontouchstart"in this}function zr(t,e,n){var o=t.invertX(e[0][0])-n[0][0],r=t.invertX(e[1][0])-n[1][0],i=t.invertY(e[0][1])-n[0][1],a=t.invertY(e[1][1])-n[1][1];return t.translate(r>o?(o+r)/2:Math.min(0,o)||Math.max(0,r),a>i?(i+a)/2:Math.min(0,i)||Math.max(0,a))}function Nr(){var t,e,n,o=_r,r=br,i=zr,a=Pr,s=Er,u=[0,1/0],c=[[-1/0,-1/0],[1/0,1/0]],l=250,h=ho,d=wt("start","zoom","end"),f=500,p=150,g=0,m=10;function y(t){t.property("__zoom",Mr).on("wheel.zoom",P,{passive:!1}).on("mousedown.zoom",E).on("dblclick.zoom",z).filter(s).on("touchstart.zoom",N).on("touchmove.zoom",S).on("touchend.zoom touchcancel.zoom",k).style("-webkit-tap-highlight-color","rgba(0,0,0,0)");}function v(t,e){return (e=Math.max(u[0],Math.min(u[1],e)))===t.k?t:new mr(e,t.x,t.y)}function x(t,e,n){var o=e[0]-n[0]*t.k,r=e[1]-n[1]*t.k;return o===t.x&&r===t.y?t:new mr(t.k,o,r)}function w(t){return [(+t[0][0]+ +t[1][0])/2,(+t[0][1]+ +t[1][1])/2]}function _(t,e,n,o){t.on("start.zoom",(function(){b(this,arguments).event(o).start();})).on("interrupt.zoom end.zoom",(function(){b(this,arguments).event(o).end();})).tween("zoom",(function(){var t=this,i=arguments,a=b(t,i).event(o),s=r.apply(t,i),u=null==n?w(s):"function"==typeof n?n.apply(t,i):n,c=Math.max(s[1][0]-s[0][0],s[1][1]-s[0][1]),l=t.__zoom,d="function"==typeof e?e.apply(t,i):e,f=h(l.invert(u).concat(c/l.k),d.invert(u).concat(c/d.k));return function(t){if(1===t)t=d;else {var e=f(t),n=c/e[2];t=new mr(n,u[0]-e[0]*n,u[1]-e[1]*n);}a.zoom(null,t);}}));}function b(t,e,n){return !n&&t.__zooming||new M(t,e)}function M(t,e){this.that=t,this.args=e,this.active=0,this.sourceEvent=null,this.extent=r.apply(t,e),this.taps=0;}function P(t,...e){if(o.apply(this,arguments)){var n=b(this,e).event(t),r=this.__zoom,s=Math.max(u[0],Math.min(u[1],r.k*Math.pow(2,a.apply(this,arguments)))),l=He(t);if(n.wheel)n.mouse[0][0]===l[0]&&n.mouse[0][1]===l[1]||(n.mouse[1]=r.invert(n.mouse[0]=l)),clearTimeout(n.wheel);else {if(r.k===s)return;n.mouse=[l,r.invert(l)],Vo(this),n.start();}wr(t),n.wheel=setTimeout((function(){n.wheel=null,n.end();}),p),n.zoom("mouse",i(x(v(r,s),n.mouse[0],n.mouse[1]),n.extent,c));}}function E(t,...e){if(!n&&o.apply(this,arguments)){var r=t.currentTarget,a=b(this,e,!0).event(t),s=De(t.view).on("mousemove.zoom",(function(t){if(wr(t),!a.moved){var e=t.clientX-l,n=t.clientY-h;a.moved=e*e+n*n>g;}a.event(t).zoom("mouse",i(x(a.that.__zoom,a.mouse[0]=He(t,r),a.mouse[1]),a.extent,c));}),!0).on("mouseup.zoom",(function(t){s.on("mousemove.zoom mouseup.zoom",null),Ve(t.view,a.moved),wr(t),a.event(t).end();}),!0),u=He(t,r),l=t.clientX,h=t.clientY;Ye(t.view),xr(t),a.mouse=[u,this.__zoom.invert(u)],Vo(this),a.start();}}function z(t,...e){if(o.apply(this,arguments)){var n=this.__zoom,a=He(t.changedTouches?t.changedTouches[0]:t,this),s=n.invert(a),u=n.k*(t.shiftKey?.5:2),h=i(x(v(n,u),a,s),r.apply(this,e),c);wr(t),l>0?De(this).transition().duration(l).call(_,h,a,t):De(this).call(y.transform,h,a,t);}}function N(n,...r){if(o.apply(this,arguments)){var i,a,s,u,c=n.touches,l=c.length,h=b(this,r,n.changedTouches.length===l).event(n);for(xr(n),a=0;a<l;++a)u=[u=He(s=c[a],this),this.__zoom.invert(u),s.identifier],h.touch0?h.touch1||h.touch0[2]===u[2]||(h.touch1=u,h.taps=0):(h.touch0=u,i=!0,h.taps=1+!!t);t&&(t=clearTimeout(t)),i&&(h.taps<2&&(e=u[0],t=setTimeout((function(){t=null;}),f)),Vo(this),h.start());}}function S(t,...e){if(this.__zooming){var n,o,r,a,s=b(this,e).event(t),u=t.changedTouches,l=u.length;for(wr(t),n=0;n<l;++n)r=He(o=u[n],this),s.touch0&&s.touch0[2]===o.identifier?s.touch0[0]=r:s.touch1&&s.touch1[2]===o.identifier&&(s.touch1[0]=r);if(o=s.that.__zoom,s.touch1){var h=s.touch0[0],d=s.touch0[1],f=s.touch1[0],p=s.touch1[1],g=(g=f[0]-h[0])*g+(g=f[1]-h[1])*g,m=(m=p[0]-d[0])*m+(m=p[1]-d[1])*m;o=v(o,Math.sqrt(g/m)),r=[(h[0]+f[0])/2,(h[1]+f[1])/2],a=[(d[0]+p[0])/2,(d[1]+p[1])/2];}else {if(!s.touch0)return;r=s.touch0[0],a=s.touch0[1];}s.zoom("touch",i(x(o,r,a),s.extent,c));}}function k(t,...o){if(this.__zooming){var r,i,a=b(this,o).event(t),s=t.changedTouches,u=s.length;for(xr(t),n&&clearTimeout(n),n=setTimeout((function(){n=null;}),f),r=0;r<u;++r)i=s[r],a.touch0&&a.touch0[2]===i.identifier?delete a.touch0:a.touch1&&a.touch1[2]===i.identifier&&delete a.touch1;if(a.touch1&&!a.touch0&&(a.touch0=a.touch1,delete a.touch1),a.touch0)a.touch0[1]=this.__zoom.invert(a.touch0[0]);else if(a.end(),2===a.taps&&(i=He(i,this),Math.hypot(e[0]-i[0],e[1]-i[1])<m)){var c=De(this).on("dblclick.zoom");c&&c.apply(this,arguments);}}}return y.transform=function(t,e,n,o){var r=t.selection?t.selection():t;r.property("__zoom",Mr),t!==r?_(t,e,n,o):r.interrupt().each((function(){b(this,arguments).event(o).start().zoom(null,"function"==typeof e?e.apply(this,arguments):e).end();}));},y.scaleBy=function(t,e,n,o){y.scaleTo(t,(function(){return this.__zoom.k*("function"==typeof e?e.apply(this,arguments):e)}),n,o);},y.scaleTo=function(t,e,n,o){y.transform(t,(function(){var t=r.apply(this,arguments),o=this.__zoom,a=null==n?w(t):"function"==typeof n?n.apply(this,arguments):n,s=o.invert(a),u="function"==typeof e?e.apply(this,arguments):e;return i(x(v(o,u),a,s),t,c)}),n,o);},y.translateBy=function(t,e,n,o){y.transform(t,(function(){return i(this.__zoom.translate("function"==typeof e?e.apply(this,arguments):e,"function"==typeof n?n.apply(this,arguments):n),r.apply(this,arguments),c)}),null,o);},y.translateTo=function(t,e,n,o,a){y.transform(t,(function(){var t=r.apply(this,arguments),a=this.__zoom,s=null==o?w(t):"function"==typeof o?o.apply(this,arguments):o;return i(yr.translate(s[0],s[1]).scale(a.k).translate("function"==typeof e?-e.apply(this,arguments):-e,"function"==typeof n?-n.apply(this,arguments):-n),t,c)}),o,a);},M.prototype={event:function(t){return t&&(this.sourceEvent=t),this},start:function(){return 1==++this.active&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(t,e){return this.mouse&&"mouse"!==t&&(this.mouse[1]=e.invert(this.mouse[0])),this.touch0&&"touch"!==t&&(this.touch0[1]=e.invert(this.touch0[0])),this.touch1&&"touch"!==t&&(this.touch1[1]=e.invert(this.touch1[0])),this.that.__zoom=e,this.emit("zoom"),this},end:function(){return 0==--this.active&&(delete this.that.__zooming,this.emit("end")),this},emit:function(t){var e=De(this.that).datum();d.call(t,this.that,new gr(t,{sourceEvent:this.sourceEvent,target:y,type:t,transform:this.that.__zoom,dispatch:d}),e);}},y.wheelDelta=function(t){return arguments.length?(a="function"==typeof t?t:pr(+t),y):a},y.filter=function(t){return arguments.length?(o="function"==typeof t?t:pr(!!t),y):o},y.touchable=function(t){return arguments.length?(s="function"==typeof t?t:pr(!!t),y):s},y.extent=function(t){return arguments.length?(r="function"==typeof t?t:pr([[+t[0][0],+t[0][1]],[+t[1][0],+t[1][1]]]),y):r},y.scaleExtent=function(t){return arguments.length?(u[0]=+t[0],u[1]=+t[1],y):[u[0],u[1]]},y.translateExtent=function(t){return arguments.length?(c[0][0]=+t[0][0],c[1][0]=+t[1][0],c[0][1]=+t[0][1],c[1][1]=+t[1][1],y):[[c[0][0],c[0][1]],[c[1][0],c[1][1]]]},y.constrain=function(t){return arguments.length?(i=t,y):i},y.duration=function(t){return arguments.length?(l=+t,y):l},y.interpolate=function(t){return arguments.length?(h=t,y):h},y.on=function(){var t=d.on.apply(d,arguments);return t===d?y:t},y.clickDistance=function(t){return arguments.length?(g=(t=+t)*t,y):Math.sqrt(g)},y.tapDistance=function(t){return arguments.length?(m=+t,y):m},y}vr.prototype=mr.prototype;const Sr=t=>({x:t.x,y:t.y,zoom:t.k}),kr=({x:t,y:e,zoom:n})=>yr.translate(t,e).scale(n),Ir=(t,e)=>t.target.closest(`.${e}`),Ar=(t,e)=>2===e&&Array.isArray(t)&&t.includes(2),Tr=t=>((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2,$r=(t,e=0,n=Tr,o=(()=>{}))=>{const r="number"==typeof e&&e>0;return r||o(),r?t.transition().duration(e).ease(n).on("end",o):t},Cr=t=>{const e=t.ctrlKey&&D()?10:1;return -t.deltaY*(1===t.deltaMode?.05:t.deltaMode?1:.002)*e};var Or;t.ResizeControlVariant=void 0,(Or=t.ResizeControlVariant||(t.ResizeControlVariant={})).Line="line",Or.Handle="handle";function Dr(t){return {isHorizontal:t.includes("right")||t.includes("left"),isVertical:t.includes("bottom")||t.includes("top"),affectsX:t.includes("left"),affectsY:t.includes("top")}}function Hr(t,e){return Math.max(0,e-t)}function Br(t,e){return Math.max(0,t-e)}function Lr(t,e,n){return Math.max(0,e-t,t-n)}function Rr(t,e){return t?!e:e}const Xr={width:0,height:0,x:0,y:0},Yr={...Xr,pointerX:0,pointerY:0,aspectRatio:1};function Vr(t,e,n){const o=e.position.x+t.position.x,r=e.position.y+t.position.y,i=t.measured.width??0,a=t.measured.height??0,s=n[0]*i,u=n[1]*a;return [[o-s,r-u],[o+i-s,r+a-u]]}t.XYDrag=function({onNodeMouseDown:t,getStoreItems:e,onDragStart:n,onDrag:o,onDragStop:r}){let i={x:null,y:null},a=0,s=new Map,u=!1,c={x:0,y:0},l=null,h=!1,d=null,f=!1,g=!1,y=null;return {update:function({noDragClassName:v,handleSelector:x,domNode:w,isSelectable:b,nodeId:P,nodeClickDistance:E=0}){function z({x:t,y:n}){const{nodeLookup:r,nodeExtent:a,snapGrid:u,snapToGrid:c,nodeOrigin:l,onNodeDrag:h,onSelectionDrag:d,onError:f,updateNodePositions:v}=e();i={x:t,y:n};let x=!1;const w=s.size>1,_=w&&a?M(p(s)):null,b=w&&c?function({dragItems:t,snapGrid:e,x:n,y:o}){const r=t.values().next().value;if(!r)return null;const i={x:n-r.distance.x,y:o-r.distance.y},a=A(i,e);return {x:a.x-i.x,y:a.y-i.y}}({dragItems:s,snapGrid:u,x:t,y:n}):null;for(const[e,o]of s){if(!r.has(e))continue;let i={x:t-o.distance.x,y:n-o.distance.y};c&&(i=b?{x:Math.round(i.x+b.x),y:Math.round(i.y+b.y)}:A(i,u));let s=null;if(w&&a&&!o.extent&&_){const{positionAbsolute:t}=o.internals,e=t.x-_.x+a[0][0],n=t.x+o.measured.width-_.x2+a[1][0];s=[[e,t.y-_.y+a[0][1]],[n,t.y+o.measured.height-_.y2+a[1][1]]];}const{position:h,positionAbsolute:d}=m({nodeId:e,nextPosition:i,nodeLookup:r,nodeExtent:s||a,nodeOrigin:l,onError:f});x=x||o.position.x!==h.x||o.position.y!==h.y,o.position=h,o.internals.positionAbsolute=d;}if(g=g||x,x&&(v(s,!0),y&&(o||h||!P&&d))){const[t,e]=Je({nodeId:P,dragItems:s,nodeLookup:r});o?.(y,s,t,e),h?.(y,t,e),P||d?.(y,e);}}async function N(){if(!l)return;const{transform:t,panBy:n,autoPanSpeed:o,autoPanOnNodeDrag:r}=e();if(!r)return u=!1,void cancelAnimationFrame(a);const[s,h]=_(c,l,o);0===s&&0===h||(i.x=(i.x??0)-s/t[2],i.y=(i.y??0)-h/t[2],await n({x:s,y:h})&&z(i)),a=requestAnimationFrame(N);}function S(o){const{nodeLookup:r,multiSelectionActive:a,nodesDraggable:u,transform:c,snapGrid:d,snapToGrid:f,selectNodesOnDrag:p,onNodeDragStart:g,onSelectionDragStart:m,unselectNodesAndEdges:y}=e();h=!0,p&&b||a||!P||r.get(P)?.selected||y(),b&&p&&P&&t?.(P);const v=L(o.sourceEvent,{transform:c,snapGrid:d,snapToGrid:f,containerBounds:l});if(i=v,s=function(t,e,n,o){const r=new Map;for(const[i,a]of t)if((a.selected||a.id===o)&&(!a.parentId||!Ue(a,t))&&(a.draggable||e&&void 0===a.draggable)){const e=t.get(i);e&&r.set(i,{id:i,position:e.position||{x:0,y:0},distance:{x:n.x-e.internals.positionAbsolute.x,y:n.y-e.internals.positionAbsolute.y},extent:e.extent,parentId:e.parentId,origin:e.origin,expandParent:e.expandParent,internals:{positionAbsolute:e.internals.positionAbsolute||{x:0,y:0}},measured:{width:e.measured.width??0,height:e.measured.height??0}});}return r}(r,u,v,P),s.size>0&&(n||g||!P&&m)){const[t,e]=Je({nodeId:P,dragItems:s,nodeLookup:r});n?.(o.sourceEvent,s,t,e),g?.(o.sourceEvent,t,e),P||m?.(o.sourceEvent,e);}}d=De(w);const k=Ke().clickDistance(E).on("start",(t=>{const{domNode:n,nodeDragThreshold:o,transform:r,snapGrid:a,snapToGrid:s}=e();l=n?.getBoundingClientRect()||null,f=!1,g=!1,y=t.sourceEvent,0===o&&S(t);const u=L(t.sourceEvent,{transform:r,snapGrid:a,snapToGrid:s,containerBounds:l});i=u,c=q(t.sourceEvent,l);})).on("drag",(t=>{const{autoPanOnNodeDrag:n,transform:o,snapGrid:r,snapToGrid:a,nodeDragThreshold:d,nodeLookup:p}=e(),g=L(t.sourceEvent,{transform:o,snapGrid:r,snapToGrid:a,containerBounds:l});if(y=t.sourceEvent,("touchmove"===t.sourceEvent.type&&t.sourceEvent.touches.length>1||P&&!p.has(P))&&(f=!0),!f){if(!u&&n&&h&&(u=!0,N()),!h){const e=q(t.sourceEvent,l),n=e.x-c.x,o=e.y-c.y;Math.sqrt(n*n+o*o)>d&&S(t);}(i.x!==g.xSnapped||i.y!==g.ySnapped)&&s&&h&&(c=q(t.sourceEvent,l),z(g));}})).on("end",(t=>{if(h&&!f&&(u=!1,h=!1,cancelAnimationFrame(a),s.size>0)){const{nodeLookup:n,updateNodePositions:o,onNodeDragStop:i,onSelectionDragStop:a}=e();if(g&&(o(s,!1),g=!1),r||i||!P&&a){const[e,o]=Je({nodeId:P,dragItems:s,nodeLookup:n,dragging:!1});r?.(t.sourceEvent,s,e,o),i?.(t.sourceEvent,e,o),P||a?.(t.sourceEvent,o);}}})).filter((t=>{const e=t.target;return !t.button&&(!v||!Qe(e,`.${v}`,w))&&(!x||Qe(e,x,w))}));d.call(k);},destroy:function(){d?.on(".drag",null);}}},t.XYHandle=sn,t.XYMinimap=function({domNode:t,panZoom:e,getTransform:n,getViewScale:o}){const r=De(t);return {update:function({translateExtent:t,width:i,height:a,zoomStep:s=1,pannable:u=!0,zoomable:c=!0,inversePan:l=!1}){let h=[0,0];const d=Nr().on("start",(t=>{"mousedown"!==t.sourceEvent.type&&"touchstart"!==t.sourceEvent.type||(h=[t.sourceEvent.clientX??t.sourceEvent.touches[0].clientX,t.sourceEvent.clientY??t.sourceEvent.touches[0].clientY]);})).on("zoom",u?r=>{const s=n();if("mousemove"!==r.sourceEvent.type&&"touchmove"!==r.sourceEvent.type||!e)return;const u=[r.sourceEvent.clientX??r.sourceEvent.touches[0].clientX,r.sourceEvent.clientY??r.sourceEvent.touches[0].clientY],c=[u[0]-h[0],u[1]-h[1]];h=u;const d=o()*Math.max(s[2],Math.log(s[2]))*(l?-1:1),f={x:s[0]-c[0]*d,y:s[1]-c[1]*d},p=[[0,0],[i,a]];e.setViewportConstrained({x:f.x,y:f.y,zoom:s[2]},p,t);}:null).on("zoom.wheel",c?t=>{if("wheel"!==t.sourceEvent.type||!e)return;const o=n(),r=t.sourceEvent.ctrlKey&&D()?10:1,i=-t.sourceEvent.deltaY*(1===t.sourceEvent.deltaMode?.05:t.sourceEvent.deltaMode?1:.002)*s,a=o[2]*Math.pow(2,i*r);e.scaleTo(a);}:null);r.call(d,{});},destroy:function(){r.on("zoom",null);},pointer:He}},t.XYPanZoom=function({domNode:e,minZoom:n,maxZoom:o,translateExtent:r,viewport:i,onPanZoom:a,onPanZoomStart:s,onPanZoomEnd:u,onDraggingChange:c}){const l={isZoomingOrPanning:!1,usedRightMouseButton:!1,prevViewport:{x:0,y:0,zoom:0},mouseButton:0,timerId:void 0,panScrollTimeout:void 0,isPanScrolling:!1},h=e.getBoundingClientRect(),d=Nr().scaleExtent([n,o]).translateExtent(r),f=De(e).call(d);x({x:i.x,y:i.y,zoom:y(i.zoom,n,o)},[[0,0],[h.width,h.height]],r);const p=f.on("wheel.zoom"),g=f.on("dblclick.zoom");function m(t,e){return f?new Promise((n=>{d?.interpolate("linear"===e?.interpolate?to:ho).transform($r(f,e?.duration,e?.ease,(()=>n(!0))),t);})):Promise.resolve(!1)}function v(){d.on("zoom",null);}async function x(t,e,n){const o=kr(t),r=d?.constrain()(o,e,n);return r&&await m(r),new Promise((t=>t(r)))}return d.wheelDelta(Cr),{update:function({noWheelClassName:e,noPanClassName:n,onPaneContextMenu:o,userSelectionActive:r,panOnScroll:i,panOnDrag:h,panOnScrollMode:m,panOnScrollSpeed:y,preventScrolling:x,zoomOnPinch:w,zoomOnScroll:_,zoomOnDoubleClick:b,zoomActivationKeyPressed:M,lib:P,onTransformChange:E,connectionInProgress:z,paneClickDistance:N,selectionOnDrag:S}){r&&!l.isZoomingOrPanning&&v();const I=i&&!M&&!r;d.clickDistance(S?1/0:!k(N)||N<0?0:N);const A=I?function({zoomPanValues:e,noWheelClassName:n,d3Selection:o,d3Zoom:r,panOnScrollMode:i,panOnScrollSpeed:a,zoomOnPinch:s,onPanZoomStart:u,onPanZoom:c,onPanZoomEnd:l}){return h=>{if(Ir(h,n))return h.ctrlKey&&h.preventDefault(),!1;h.preventDefault(),h.stopImmediatePropagation();const d=o.property("__zoom").k||1;if(h.ctrlKey&&s){const t=He(h),e=Cr(h),n=d*Math.pow(2,e);return void r.scaleTo(o,n,t,h)}const f=1===h.deltaMode?20:1;let p=i===t.PanOnScrollMode.Vertical?0:h.deltaX*f,g=i===t.PanOnScrollMode.Horizontal?0:h.deltaY*f;!D()&&h.shiftKey&&i!==t.PanOnScrollMode.Vertical&&(p=h.deltaY*f,g=0),r.translateBy(o,-p/d*a,-g/d*a,{internal:!0});const m=Sr(o.property("__zoom"));clearTimeout(e.panScrollTimeout),e.isPanScrolling?(c?.(h,m),e.panScrollTimeout=setTimeout((()=>{l?.(h,m),e.isPanScrolling=!1;}),150)):(e.isPanScrolling=!0,u?.(h,m));}}({zoomPanValues:l,noWheelClassName:e,d3Selection:f,d3Zoom:d,panOnScrollMode:m,panOnScrollSpeed:y,zoomOnPinch:w,onPanZoomStart:s,onPanZoom:a,onPanZoomEnd:u}):function({noWheelClassName:t,preventScrolling:e,d3ZoomHandler:n}){return function(o,r){const i="wheel"===o.type,a=!e&&i&&!o.ctrlKey,s=Ir(o,t);if(o.ctrlKey&&i&&s&&o.preventDefault(),a||s)return null;o.preventDefault(),n.call(this,o,r);}}({noWheelClassName:e,preventScrolling:x,d3ZoomHandler:p});if(f.on("wheel.zoom",A,{passive:!1}),!r){const t=function({zoomPanValues:t,onDraggingChange:e,onPanZoomStart:n}){return o=>{if(o.sourceEvent?.internal)return;const r=Sr(o.transform);t.mouseButton=o.sourceEvent?.button||0,t.isZoomingOrPanning=!0,t.prevViewport=r,"mousedown"===o.sourceEvent?.type&&e(!0),n&&n?.(o.sourceEvent,r);}}({zoomPanValues:l,onDraggingChange:c,onPanZoomStart:s});d.on("start",t);const e=function({zoomPanValues:t,panOnDrag:e,onPaneContextMenu:n,onTransformChange:o,onPanZoom:r}){return i=>{t.usedRightMouseButton=!(!n||!Ar(e,t.mouseButton??0)),i.sourceEvent?.sync||o([i.transform.x,i.transform.y,i.transform.k]),r&&!i.sourceEvent?.internal&&r?.(i.sourceEvent,Sr(i.transform));}}({zoomPanValues:l,panOnDrag:h,onPaneContextMenu:!!o,onPanZoom:a,onTransformChange:E});d.on("zoom",e);const n=function({zoomPanValues:t,panOnDrag:e,panOnScroll:n,onDraggingChange:o,onPanZoomEnd:r,onPaneContextMenu:i}){return a=>{if(!a.sourceEvent?.internal&&(t.isZoomingOrPanning=!1,i&&Ar(e,t.mouseButton??0)&&!t.usedRightMouseButton&&a.sourceEvent&&i(a.sourceEvent),t.usedRightMouseButton=!1,o(!1),r)){const e=Sr(a.transform);t.prevViewport=e,clearTimeout(t.timerId),t.timerId=setTimeout((()=>{r?.(a.sourceEvent,e);}),n?150:0);}}}({zoomPanValues:l,panOnDrag:h,panOnScroll:i,onPaneContextMenu:o,onPanZoomEnd:u,onDraggingChange:c});d.on("end",n);}const T=function({zoomActivationKeyPressed:t,zoomOnScroll:e,zoomOnPinch:n,panOnDrag:o,panOnScroll:r,zoomOnDoubleClick:i,userSelectionActive:a,noWheelClassName:s,noPanClassName:u,lib:c,connectionInProgress:l}){return h=>{const d=t||e,f=n&&h.ctrlKey,p="wheel"===h.type;if(1===h.button&&"mousedown"===h.type&&(Ir(h,`${c}-flow__node`)||Ir(h,`${c}-flow__edge`)))return !0;if(!(o||d||r||i||n))return !1;if(a)return !1;if(l&&!p)return !1;if(Ir(h,s)&&p)return !1;if(Ir(h,u)&&(!p||r&&p&&!t))return !1;if(!n&&h.ctrlKey&&p)return !1;if(!n&&"touchstart"===h.type&&h.touches?.length>1)return h.preventDefault(),!1;if(!d&&!r&&!f&&p)return !1;if(!o&&("mousedown"===h.type||"touchstart"===h.type))return !1;if(Array.isArray(o)&&!o.includes(h.button)&&"mousedown"===h.type)return !1;const g=Array.isArray(o)&&o.includes(h.button)||!h.button||h.button<=1;return (!h.ctrlKey||p)&&g}}({zoomActivationKeyPressed:M,panOnDrag:h,zoomOnScroll:_,panOnScroll:i,zoomOnDoubleClick:b,zoomOnPinch:w,userSelectionActive:r,noPanClassName:n,noWheelClassName:e,lib:P,connectionInProgress:z});d.filter(T),b?f.on("dblclick.zoom",g):f.on("dblclick.zoom",null);},destroy:v,setViewport:async function(t,e){const n=kr(t);return await m(n,e),new Promise((t=>t(n)))},setViewportConstrained:x,getViewport:function(){const t=f?vr(f.node()):{x:0,y:0,k:1};return {x:t.x,y:t.y,zoom:t.k}},scaleTo:function(t,e){return f?new Promise((n=>{d?.interpolate("linear"===e?.interpolate?to:ho).scaleTo($r(f,e?.duration,e?.ease,(()=>n(!0))),t);})):Promise.resolve(!1)},scaleBy:function(t,e){return f?new Promise((n=>{d?.interpolate("linear"===e?.interpolate?to:ho).scaleBy($r(f,e?.duration,e?.ease,(()=>n(!0))),t);})):Promise.resolve(!1)},setScaleExtent:function(t){d?.scaleExtent(t);},setTranslateExtent:function(t){d?.translateExtent(t);},syncViewport:function(t){if(f){const e=kr(t),n=f.property("__zoom");n.k===t.zoom&&n.x===t.x&&n.y===t.y||d?.transform(f,e,null,{sync:!0});}},setClickDistance:function(t){const e=!k(t)||t<0?0:t;d?.clickDistance(e);}}},t.XYResizer=function({domNode:t,nodeId:e,getStoreItems:n,onChange:o,onEnd:r}){const i=De(t);let a={controlDirection:Dr("bottom-right"),boundaries:{minWidth:0,minHeight:0,maxWidth:Number.MAX_VALUE,maxHeight:Number.MAX_VALUE},resizeDirection:void 0,keepAspectRatio:!1};return {update:function({controlPosition:t,boundaries:s,keepAspectRatio:u,resizeDirection:c,onResizeStart:l,onResize:h,onResizeEnd:d,shouldResize:f}){let p,g={...Xr},m={...Yr};a={boundaries:s,resizeDirection:c,keepAspectRatio:u,controlDirection:Dr(t)};let y,v,x,w=null,b=[],M=!1,P=0,E=!1,z={x:0,y:0},N=null;function S(){E=!1,cancelAnimationFrame(P),P=0,N=null;}async function k(){if(!w||!N)return void S();const{panBy:t,autoPanOnResize:e,autoPanSpeed:o}=n();if(!t||!e)return void S();const[r,i]=_(z,w,o);0===r&&0===i||await t({x:r,y:i})&&I(N),P=requestAnimationFrame(k);}function I(t){const{transform:e,snapGrid:r,snapToGrid:i,nodeOrigin:s}=n(),u=L(t.sourceEvent,{transform:e,snapGrid:r,snapToGrid:i,containerBounds:w}),c=[];if(!p)return;const{x:l,y:d,width:_,height:P}=g,E={},z=p.origin??s,{width:N,height:S,x:k,y:I}=function(t,e,n,o,r,i,a,s){let{affectsX:u,affectsY:c}=e;const{isHorizontal:l,isVertical:h}=e,d=l&&h,{xSnapped:f,ySnapped:p}=n,{minWidth:g,maxWidth:m,minHeight:y,maxHeight:v}=o,{x:x,y:w,width:_,height:b,aspectRatio:M}=t;let P=Math.floor(l?f-t.pointerX:0),E=Math.floor(h?p-t.pointerY:0);const z=_+(u?-P:P),N=b+(c?-E:E),S=-i[0]*_,k=-i[1]*b;let I=Lr(z,g,m),A=Lr(N,y,v);if(a){let t=0,e=0;u&&P<0?t=Hr(x+P+S,a[0][0]):!u&&P>0&&(t=Br(x+z+S,a[1][0])),c&&E<0?e=Hr(w+E+k,a[0][1]):!c&&E>0&&(e=Br(w+N+k,a[1][1])),I=Math.max(I,t),A=Math.max(A,e);}if(s){let t=0,e=0;u&&P>0?t=Br(x+P,s[0][0]):!u&&P<0&&(t=Hr(x+z,s[1][0])),c&&E>0?e=Br(w+E,s[0][1]):!c&&E<0&&(e=Hr(w+N,s[1][1])),I=Math.max(I,t),A=Math.max(A,e);}if(r){if(l){const t=Lr(z/M,y,v)*M;if(I=Math.max(I,t),a){let t=0;t=!u&&!c||u&&!c&&d?Br(w+k+z/M,a[1][1])*M:Hr(w+k+(u?P:-P)/M,a[0][1])*M,I=Math.max(I,t);}if(s){let t=0;t=!u&&!c||u&&!c&&d?Hr(w+z/M,s[1][1])*M:Br(w+(u?P:-P)/M,s[0][1])*M,I=Math.max(I,t);}}if(h){const t=Lr(N*M,g,m)/M;if(A=Math.max(A,t),a){let t=0;t=!u&&!c||c&&!u&&d?Br(x+N*M+S,a[1][0])/M:Hr(x+(c?E:-E)*M+S,a[0][0])/M,A=Math.max(A,t);}if(s){let t=0;t=!u&&!c||c&&!u&&d?Hr(x+N*M,s[1][0])/M:Br(x+(c?E:-E)*M,s[0][0])/M,A=Math.max(A,t);}}}E+=E<0?A:-A,P+=P<0?I:-I,r&&(d?z>N*M?E=(Rr(u,c)?-P:P)/M:P=(Rr(u,c)?-E:E)*M:l?(E=P/M,c=u):(P=E*M,u=c));const T=u?x+P:x,$=c?w+E:w;return {width:_+(u?-P:P),height:b+(c?-E:E),x:i[0]*P*(u?-1:1)+T,y:i[1]*E*(c?-1:1)+$}}(m,a.controlDirection,u,a.boundaries,a.keepAspectRatio,z,v,x),A=N!==_,T=S!==P,$=k!==l&&A,C=I!==d&&T;if(!($||C||A||T))return;if(($||C||1===z[0]||1===z[1])&&(E.x=$?k:g.x,E.y=C?I:g.y,g.x=E.x,g.y=E.y,b.length>0)){const t=k-l,e=I-d;for(const n of b)n.position={x:n.position.x-t+z[0]*(N-_),y:n.position.y-e+z[1]*(S-P)},c.push(n);}if((A||T)&&(E.width=!A||a.resizeDirection&&"horizontal"!==a.resizeDirection?g.width:N,E.height=!T||a.resizeDirection&&"vertical"!==a.resizeDirection?g.height:S,g.width=E.width,g.height=E.height),y&&p.expandParent){const t=z[0]*(E.width??0);E.x&&E.x<t&&(g.x=t,m.x=m.x-(E.x-t));const e=z[1]*(E.height??0);E.y&&E.y<e&&(g.y=e,m.y=m.y-(E.y-e));}const O=function({width:t,prevWidth:e,height:n,prevHeight:o,affectsX:r,affectsY:i}){const a=t-e,s=n-o,u=[a>0?1:a<0?-1:0,s>0?1:s<0?-1:0];return a&&r&&(u[0]=-1*u[0]),s&&i&&(u[1]=-1*u[1]),u}({width:g.width,prevWidth:_,height:g.height,prevHeight:P,affectsX:a.controlDirection.affectsX,affectsY:a.controlDirection.affectsY}),D={...g,direction:O},H=f?.(t,D);!1!==H&&(M=!0,h?.(t,D),o(E,c));}const A=Ke().on("start",(t=>{const{nodeLookup:o,transform:r,snapGrid:i,snapToGrid:a,nodeOrigin:s,paneDomNode:u}=n();if(p=o.get(e),!p)return;w=u?.getBoundingClientRect()??null;const{xSnapped:c,ySnapped:h}=L(t.sourceEvent,{transform:r,snapGrid:i,snapToGrid:a,containerBounds:w});z=q(t.sourceEvent,w??void 0),N=t,g={width:p.measured.width??0,height:p.measured.height??0,x:p.position.x??0,y:p.position.y??0},m={...g,pointerX:c,pointerY:h,aspectRatio:g.width/g.height},y=void 0,p.parentId&&("parent"===p.extent||p.expandParent)&&(y=o.get(p.parentId),v=y&&"parent"===p.extent?function(t){return [[0,0],[t.measured.width,t.measured.height]]}(y):void 0),b=[],x=void 0;for(const[t,n]of o)if(n.parentId===e&&(b.push({id:t,position:{...n.position},extent:n.extent}),"parent"===n.extent||n.expandParent)){const t=Vr(n,p,n.origin??s);x=x?[[Math.min(t[0][0],x[0][0]),Math.min(t[0][1],x[0][1])],[Math.max(t[1][0],x[1][0]),Math.max(t[1][1],x[1][1])]]:t;}l?.(t,{...g});})).on("drag",(t=>{const{panBy:e,autoPanOnResize:o}=n();N=t,z=q(t.sourceEvent,w??void 0),!E&&e&&o&&(E=!0,k()),I(t);})).on("end",(t=>{S(),M&&(d?.(t,{...g}),r?.({...g}),M=!1);}));i.call(A);},destroy:function(){i.on(".drag",null);}}},t.XY_RESIZER_HANDLE_POSITIONS=["top-left","top-right","bottom-left","bottom-right"],t.XY_RESIZER_LINE_POSITIONS=["top","right","bottom","left"],t.addEdge=(t,n,o={})=>{if(!t.source||!t.target)return e.error006(),n;const r=o.getEdgeId||K;let i;return i=h(t)?{...t}:{...t,id:r(t)},((t,e)=>e.some((e=>!(e.source!==t.source||e.target!==t.target||e.sourceHandle!==t.sourceHandle&&(e.sourceHandle||t.sourceHandle)||e.targetHandle!==t.targetHandle&&(e.targetHandle||t.targetHandle)))))(i,n)?n:(null===i.sourceHandle&&delete i.sourceHandle,null===i.targetHandle&&delete i.targetHandle,n.concat(i))},t.adoptUserNodes=function(t,e,n,o={}){const r=dt(ht,o),i={i:0},a=new Map(e),s=r?.elevateNodesOnSelect&&!pt(r.zIndexMode)?ut:0;let u=t.length>0,c=!1;e.clear(),n.clear();for(const l of t){let t=a.get(l.id);if(r.checkEquality&&l===t?.internals.userNode)e.set(l.id,t);else {const n=f(l,r.nodeOrigin),o=H(l.extent)?l.extent:r.nodeExtent,i=v(n,o,B(l));t={...r.defaults,...l,measured:{width:l.measured?.width,height:l.measured?.height},internals:{positionAbsolute:i,handleBounds:ft(l,t),z:mt(l,s,r.zIndexMode),userNode:l}},e.set(l.id,t);}void 0!==t.measured&&void 0!==t.measured.width&&void 0!==t.measured.height||t.hidden||(u=!1),l.parentId&&gt(t,e,n,o,i),c||=l.selected??!1;}return {nodesInitialized:u,hasSelectedNodes:c}},t.areConnectionMapsEqual=function(t,e){if(!t&&!e)return !0;if(!t||!e||t.size!==e.size)return !1;if(!t.size&&!e.size)return !0;for(const n of t.keys())if(!e.has(n))return !1;return !0},t.areSetsEqual=function(t,e){if(t.size!==e.size)return !1;for(const n of t)if(!e.has(n))return !1;return !0},t.boxToRect=P,t.calcAutoPan=_,t.calculateNodePosition=m,t.clamp=y,t.clampPosition=v,t.clampPositionToParent=x,t.createMarkerIds=function(t,{id:e,defaultColor:n,defaultMarkerStart:o,defaultMarkerEnd:r}){const i=new Set;return t.reduce(((t,a)=>([a.markerStart||o,a.markerEnd||r].forEach((o=>{if(o&&"object"==typeof o){const r=it(o,e);i.has(r)||(t.push({id:r,color:o.color||n,...o}),i.add(r));}})),t)),[]).sort(((t,e)=>t.id.localeCompare(e.id)))},t.defaultAriaLabelConfig=o,t.devWarn=I,t.elementSelectionKeys=["Enter"," ","Escape"],t.errorMessages=e,t.evaluateAbsolutePosition=function(t,e={width:0,height:0},n,o,r){const i={...t},a=o.get(n);if(a){const t=a.origin||r;i.x+=a.internals.positionAbsolute.x-(e.width??0)*t[0],i.y+=a.internals.positionAbsolute.y-(e.height??0)*t[1];}return i},t.fitViewport=async function({nodes:t,width:e,height:n,panZoom:o,minZoom:r,maxZoom:i},a){if(0===t.size)return Promise.resolve(!0);const s=function(t,e){const n=new Map,o=e?.nodes?new Set(e.nodes.map((t=>t.id))):null;return t.forEach((t=>{!t.measured.width||!t.measured.height||!e?.includeHiddenNodes&&t.hidden||o&&!o.has(t.id)||n.set(t.id,t);})),n}(t,a),u=p(s),c=O(u,e,n,a?.minZoom??r,a?.maxZoom??i,a?.padding??.1);return await o.setViewport(c,{duration:a?.duration,ease:a?.ease,interpolate:a?.interpolate}),Promise.resolve(!0)},t.getBezierEdgeCenter=G,t.getBezierPath=function({sourceX:e,sourceY:n,sourcePosition:o=t.Position.Bottom,targetX:r,targetY:i,targetPosition:a=t.Position.Top,curvature:s=.25}){const[u,c]=F({pos:o,x1:e,y1:n,x2:r,y2:i,c:s}),[l,h]=F({pos:a,x1:r,y1:i,x2:e,y2:n,c:s}),[d,f,p,g]=G({sourceX:e,sourceY:n,targetX:r,targetY:i,sourceControlX:u,sourceControlY:c,targetControlX:l,targetControlY:h});return [`M${e},${n} C${u},${c} ${l},${h} ${r},${i}`,d,f,p,g]},t.getBoundsOfBoxes=b,t.getBoundsOfRects=N,t.getConnectedEdges=g,t.getConnectionStatus=function(t){return null===t?null:t?"valid":"invalid"},t.getDimensions=R,t.getEdgeCenter=W,t.getEdgeId=K,t.getEdgePosition=function(n){const{sourceNode:o,targetNode:r}=n;if(!et(o)||!et(r))return null;const i=o.internals.handleBounds||nt(o.handles),a=r.internals.handleBounds||nt(r.handles),s=rt(i?.source??[],n.sourceHandle),u=rt(n.connectionMode===t.ConnectionMode.Strict?a?.target??[]:(a?.target??[]).concat(a?.source??[]),n.targetHandle);if(!s||!u)return n.onError?.("008",e.error008(s?"target":"source",{id:n.id,sourceHandle:n.sourceHandle,targetHandle:n.targetHandle})),null;const c=s?.position||t.Position.Bottom,l=u?.position||t.Position.Top,h=ot(o,s,c),d=ot(r,u,l);return {sourceX:h.x,sourceY:h.y,targetX:d.x,targetY:d.y,sourcePosition:c,targetPosition:l}},t.getEdgeToolbarTransform=function(t,e,n,o="center",r="center"){return `translate(${t}px, ${e}px) scale(${1/n}) translate(${-(at[o]??50)}%, ${-(st[r]??50)}%)`},t.getElementsToRemove=async function({nodesToRemove:t=[],edgesToRemove:e=[],nodes:n,edges:o,onBeforeDelete:r}){const i=new Set(t.map((t=>t.id))),a=[];for(const t of n){if(!1===t.deletable)continue;const e=i.has(t.id),n=!e&&t.parentId&&a.find((e=>e.id===t.parentId));(e||n)&&a.push(t);}const s=new Set(e.map((t=>t.id))),u=o.filter((t=>!1!==t.deletable)),c=g(a,u);for(const t of u){s.has(t.id)&&!c.find((e=>e.id===t.id))&&c.push(t);}if(!r)return {edges:c,nodes:a};const l=await r({nodes:a,edges:c});return "boolean"==typeof l?l?{edges:c,nodes:a}:{edges:[],nodes:[]}:l},t.getElevatedEdgeZIndex=function({sourceNode:t,targetNode:e,selected:n=!1,zIndex:o=0,elevateOnSelect:r=!1,zIndexMode:i="basic"}){return "manual"===i?o:(r&&n?o+1e3:o)+Math.max(t.parentId||r&&t.selected?t.internals.z:0,e.parentId||r&&e.selected?e.internals.z:0)},t.getEventPosition=q,t.getHandleBounds=Z,t.getHandlePosition=ot,t.getHostForElement=X,t.getIncomers=(t,e,n)=>{if(!t.id)return [];const o=new Set;return n.forEach((e=>{e.target===t.id&&o.add(e.source);})),e.filter((t=>o.has(t.id)))},t.getInternalNodesBounds=p,t.getMarkerId=it,t.getNodeDimensions=B,t.getNodePositionWithOrigin=f,t.getNodeToolbarTransform=function(e,n,o,r,i){let a=.5;"start"===i?a=0:"end"===i&&(a=1);let s=[(e.x+e.width*a)*n.zoom+n.x,e.y*n.zoom+n.y-r],u=[-100*a,-100];switch(o){case t.Position.Right:s=[(e.x+e.width)*n.zoom+n.x+r,(e.y+e.height*a)*n.zoom+n.y],u=[0,-100*a];break;case t.Position.Bottom:s[1]=(e.y+e.height)*n.zoom+n.y+r,u[1]=0;break;case t.Position.Left:s=[e.x*n.zoom+n.x-r,(e.y+e.height*a)*n.zoom+n.y],u=[-100,-100*a];}return `translate(${s[0]}px, ${s[1]}px) translate(${u[0]}%, ${u[1]}%)`},t.getNodesBounds=(t,e={nodeOrigin:[0,0]})=>{if(0===t.length)return {x:0,y:0,width:0,height:0};const n=t.reduce(((t,n)=>{const o="string"==typeof n;let r=e.nodeLookup||o?void 0:n;e.nodeLookup&&(r=o?e.nodeLookup.get(n):d(n)?n:e.nodeLookup.get(n.id));const i=r?z(r,e.nodeOrigin):{x:0,y:0,x2:0,y2:0};return b(t,i)}),{x:1/0,y:1/0,x2:-1/0,y2:-1/0});return P(n)},t.getNodesInside=(t,e,[n,o,r]=[0,0,1],i=!1,a=!1)=>{const s={...T(e,[n,o,r]),width:e.width/r,height:e.height/r},u=[];for(const e of t.values()){const{measured:t,selectable:n=!0,hidden:o=!1}=e;if(a&&!n||o)continue;const r=t.width??e.width??e.initialWidth??null,c=t.height??e.height??e.initialHeight??null,l=S(s,E(e)),h=(r??0)*(c??0),d=i&&l>0;(!e.internals.handleBounds||d||l>=h||e.dragging)&&u.push(e);}return u},t.getOutgoers=(t,e,n)=>{if(!t.id)return [];const o=new Set;return n.forEach((e=>{e.source===t.id&&o.add(e.target);})),e.filter((t=>o.has(t.id)))},t.getOverlappingArea=S,t.getPointerPosition=L,t.getSmoothStepPath=function({sourceX:e,sourceY:n,sourcePosition:o=t.Position.Bottom,targetX:r,targetY:i,targetPosition:a=t.Position.Top,borderRadius:s=5,centerX:u,centerY:c,offset:l=20,stepPosition:h=.5}){const[d,f,p,g,m]=function({source:e,sourcePosition:n=t.Position.Bottom,target:o,targetPosition:r=t.Position.Top,center:i,offset:a,stepPosition:s}){const u=U[n],c=U[r],l={x:e.x+u.x*a,y:e.y+u.y*a},h={x:o.x+c.x*a,y:o.y+c.y*a},d=Q({source:l,sourcePosition:n,target:h}),f=0!==d.x?"x":"y",p=d[f];let g,m,y=[];const v={x:0,y:0},x={x:0,y:0},[,,w,_]=W({sourceX:e.x,sourceY:e.y,targetX:o.x,targetY:o.y});if(u[f]*c[f]==-1){"x"===f?(g=i.x??l.x+(h.x-l.x)*s,m=i.y??(l.y+h.y)/2):(g=i.x??(l.x+h.x)/2,m=i.y??l.y+(h.y-l.y)*s);const t=[{x:g,y:l.y},{x:g,y:h.y}],e=[{x:l.x,y:m},{x:h.x,y:m}];y=u[f]===p?"x"===f?t:e:"x"===f?e:t;}else {const t=[{x:l.x,y:h.y}],i=[{x:h.x,y:l.y}];if(y="x"===f?u.x===p?i:t:u.y===p?t:i,n===r){const t=Math.abs(e[f]-o[f]);if(t<=a){const n=Math.min(a-1,a-t);u[f]===p?v[f]=(l[f]>e[f]?-1:1)*n:x[f]=(h[f]>o[f]?-1:1)*n;}}if(n!==r){const e="x"===f?"y":"x",n=u[f]===c[e],o=l[e]>h[e],r=l[e]<h[e];(1===u[f]&&(!n&&o||n&&r)||1!==u[f]&&(!n&&r||n&&o))&&(y="x"===f?t:i);}const s={x:l.x+v.x,y:l.y+v.y},d={x:h.x+x.x,y:h.y+x.y};Math.max(Math.abs(s.x-y[0].x),Math.abs(d.x-y[0].x))>=Math.max(Math.abs(s.y-y[0].y),Math.abs(d.y-y[0].y))?(g=(s.x+d.x)/2,m=y[0].y):(g=y[0].x,m=(s.y+d.y)/2);}const b={x:l.x+v.x,y:l.y+v.y},M={x:h.x+x.x,y:h.y+x.y};return [[e,...b.x!==y[0].x||b.y!==y[0].y?[b]:[],...y,...M.x!==y[y.length-1].x||M.y!==y[y.length-1].y?[M]:[],o],g,m,w,_]}({source:{x:e,y:n},sourcePosition:o,target:{x:r,y:i},targetPosition:a,center:{x:u,y:c},offset:l,stepPosition:h});let y=`M${d[0].x} ${d[0].y}`;for(let t=1;t<d.length-1;t++)y+=tt(d[t-1],d[t],d[t+1],s);return y+=`L${d[d.length-1].x} ${d[d.length-1].y}`,[y,f,p,g,m]},t.getStraightPath=function({sourceX:t,sourceY:e,targetX:n,targetY:o}){const[r,i,a,s]=W({sourceX:t,sourceY:e,targetX:n,targetY:o});return [`M ${t},${e}L ${n},${o}`,r,i,a,s]},t.getViewportForBounds=O,t.handleConnectionChange=function(t,e,n){if(!n)return;const o=[];t.forEach(((t,n)=>{e?.has(n)||o.push(t);})),o.length&&n(o);},t.handleExpandParent=yt,t.infiniteExtent=n,t.initialConnection={inProgress:!1,isValid:null,from:null,fromHandle:null,fromPosition:null,fromNode:null,to:null,toHandle:null,toPosition:null,toNode:null,pointer:null},t.isCoordinateExtent=H,t.isEdgeBase=h,t.isEdgeVisible=function({sourceNode:t,targetNode:e,width:n,height:o,transform:r}){const i=b(z(t),z(e));i.x===i.x2&&(i.x2+=1),i.y===i.y2&&(i.y2+=1);const a={x:-r[0]/r[2],y:-r[1]/r[2],width:n/r[2],height:o/r[2]};return S(a,P(i))>0},t.isInputDOMNode=function(t){const e=t.composedPath?.()?.[0]||t.target;return 1===e?.nodeType&&(Y.includes(e.nodeName)||e.hasAttribute("contenteditable")||!!e.closest(".nokey"))},t.isInternalNodeBase=d,t.isMacOs=D,t.isManualZIndexMode=pt,t.isMouseEvent=V,t.isNodeBase=t=>"id"in t&&"position"in t&&!("source"in t)&&!("target"in t),t.isNumeric=k,t.isRectObject=t=>k(t.width)&&k(t.height)&&k(t.x)&&k(t.y),t.mergeAriaLabelConfig=function(t){return {...o,...t||{}}},t.nodeHasDimensions=function(t){return void 0!==(t.measured?.width??t.width??t.initialWidth)&&void 0!==(t.measured?.height??t.height??t.initialHeight)},t.nodeToBox=z,t.nodeToRect=E,t.oppositePosition=l,t.panBy=async function({delta:t,panZoom:e,transform:n,translateExtent:o,width:r,height:i}){if(!e||!t.x&&!t.y)return Promise.resolve(!1);const a=await e.setViewportConstrained({x:n[0]+t.x,y:n[1]+t.y,zoom:n[2]},[[0,0],[r,i]],o),s=!!a&&(a.x!==n[0]||a.y!==n[1]||a.k!==n[2]);return Promise.resolve(s)},t.pointToRendererPoint=T,t.reconnectEdge=(t,n,o,r={shouldReplaceId:!0})=>{const{id:i,...a}=t;if(!n.source||!n.target)return e.error006(),o;if(!o.find((e=>e.id===t.id)))return e.error007(i),o;const s=r.getEdgeId||K,u={...a,id:r.shouldReplaceId?s(n):i,source:n.source,target:n.target,sourceHandle:n.sourceHandle,targetHandle:n.targetHandle};return o.filter((t=>t.id!==i)).concat(u)},t.rectToBox=M,t.rendererPointToPoint=$,t.shallowNodeData=function(t,e){if(null===t||null===e)return !1;const n=Array.isArray(t)?t:[t],o=Array.isArray(e)?e:[e];if(n.length!==o.length)return !1;for(let t=0;t<n.length;t++)if(n[t].id!==o[t].id||n[t].type!==o[t].type||!Object.is(n[t].data,o[t].data))return !1;return !0},t.snapPosition=A,t.updateAbsolutePositions=function(t,e,n){const o=dt(lt,n);for(const n of t.values())if(n.parentId)gt(n,t,e,o);else {const t=f(n,o.nodeOrigin),e=H(n.extent)?n.extent:o.nodeExtent,r=v(t,e,B(n));n.internals.positionAbsolute=r;}},t.updateConnectionLookup=function(t,e,n){t.clear(),e.clear();for(const o of n){const{source:n,target:r,sourceHandle:i=null,targetHandle:a=null}=o,s={edgeId:o.id,source:n,target:r,sourceHandle:i,targetHandle:a},u=`${n}-${i}--${r}-${a}`;vt("source",s,`${r}-${a}--${n}-${i}`,t,n,i),vt("target",s,u,t,r,a),e.set(o.id,o);}},t.updateNodeInternals=function(t,e,n,o,r,i,a){const s=o?.querySelector(".xyflow__viewport");let u=!1;if(!s)return {changes:[],updatedInternals:u};const c=[],l=window.getComputedStyle(s),{m22:h}=new window.DOMMatrixReadOnly(l.transform),d=[];for(const o of t.values()){const t=e.get(o.id);if(!t)continue;if(t.hidden){e.set(t.id,{...t,internals:{...t.internals,handleBounds:void 0}}),u=!0;continue}const s=R(o.nodeElement),l=t.measured.width!==s.width||t.measured.height!==s.height;if(!(!s.width||!s.height||!l&&t.internals.handleBounds&&!o.force)){const f=o.nodeElement.getBoundingClientRect(),p=H(t.extent)?t.extent:i;let{positionAbsolute:g}=t.internals;t.parentId&&"parent"===t.extent?g=x(g,s,e.get(t.parentId)):p&&(g=v(g,p,s));const m={...t,measured:s,internals:{...t.internals,positionAbsolute:g,handleBounds:{source:Z("source",o.nodeElement,f,h,t.id),target:Z("target",o.nodeElement,f,h,t.id)}}};e.set(t.id,m),t.parentId&&gt(m,e,n,{nodeOrigin:r,zIndexMode:a}),u=!0,l&&(c.push({id:t.id,type:"dimensions",dimensions:s}),t.expandParent&&t.parentId&&d.push({id:t.id,parentId:t.parentId,rect:E(m,r)}));}}if(d.length>0){const t=yt(d,e,n,r);c.push(...t);}return {changes:c,updatedInternals:u}},t.withResolvers=function(){let t,e;return {promise:new Promise(((n,o)=>{t=n,e=o;})),resolve:t,reject:e}};})); 
} (umd, umd.exports));

var umdExports = umd.exports;

function toCss(style) {
  if (!style) {
    return '';
  }
  if (typeof style === 'string') {
    return style;
  }
  return Object.entries(style).filter(entry => entry[1] !== undefined).map(([property, value]) => `${property}: ${value};`).join(' ');
}
function safeStyle(style) {
  let css = toCss(style);
  return css ? htmlSafe(css) : undefined;
}

var _EdgeText;
class EdgeText extends Component {
  get label() {
    let label = this.args.label;
    return typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;
  }
  get hasLabel() {
    return Boolean(this.label);
  }
  get textClasses() {
    return ['ember-flow__edge-textwrapper', this.args.className].filter(Boolean).join(' ');
  }
  get transform() {
    return `translate(${this.args.x ?? 0} ${this.args.y ?? 0})`;
  }
  get labelStyle() {
    return safeStyle(this.args.labelStyle);
  }
  get labelBgStyle() {
    return safeStyle(this.args.labelBgStyle);
  }
  get labelBgPadding() {
    return this.args.labelBgPadding ?? [4, 2];
  }
  get labelBgWidth() {
    return Math.max((this.label?.length ?? 0) * 6.5 + this.labelBgPadding[0] * 2, 12);
  }
  get labelBgHeight() {
    return 14 + this.labelBgPadding[1] * 2;
  }
  get labelBgX() {
    return -this.labelBgWidth / 2;
  }
  get labelBgY() {
    return -this.labelBgHeight / 2;
  }
  get labelBgBorderRadius() {
    return this.args.labelBgBorderRadius ?? 2;
  }
  get shouldShowLabelBg() {
    return this.args.labelShowBg ?? true;
  }
  get emptyStyle() {
    return htmlSafe('');
  }
}
_EdgeText = EdgeText;
setComponentTemplate(precompileTemplate("{{#if this.hasLabel}}\n  <g class={{this.textClasses}} transform={{this.transform}} style={{this.emptyStyle}} ...attributes>\n    {{#if this.shouldShowLabelBg}}\n      <rect class=\"ember-flow__edge-textbg\" x={{this.labelBgX}} y={{this.labelBgY}} width={{this.labelBgWidth}} height={{this.labelBgHeight}} rx={{this.labelBgBorderRadius}} ry={{this.labelBgBorderRadius}} style={{this.labelBgStyle}} />\n    {{/if}}\n    <text class=\"ember-flow__edge-text\" text-anchor=\"middle\" dominant-baseline=\"central\" style={{this.labelStyle}}>{{this.label}}</text>\n    {{yield}}\n  </g>\n{{/if}}", {
  strictMode: true
}), _EdgeText);

var _BaseEdge;
class BaseEdge extends Component {
  get pathClass() {
    return ['ember-flow__edge-path', this.args.className].filter(Boolean).join(' ');
  }
  get edgeStyle() {
    return safeStyle(this.args.style);
  }
  get interactionWidth() {
    return this.args.interactionWidth ?? 20;
  }
}
_BaseEdge = BaseEdge;
setComponentTemplate(precompileTemplate("<g ...attributes>\n  <path id={{@id}} class={{this.pathClass}} d={{@path}} style={{this.edgeStyle}} marker-start={{@markerStart}} marker-end={{@markerEnd}} />\n  {{#if this.interactionWidth}}\n    <path class=\"ember-flow__edge-interaction\" d={{@path}} stroke-width={{this.interactionWidth}} />\n  {{/if}}\n  <EdgeText @x={{@labelX}} @y={{@labelY}} @label={{@label}} @labelStyle={{@labelStyle}} @labelShowBg={{@labelShowBg}} @labelBgStyle={{@labelBgStyle}} @labelBgPadding={{@labelBgPadding}} @labelBgBorderRadius={{@labelBgBorderRadius}} />\n</g>", {
  strictMode: true,
  scope: () => ({
    EdgeText
  })
}), _BaseEdge);

function _applyDecoratedDescriptor(i, e, r, n, l) {
  var a = {};
  return Object.keys(n).forEach(function (i) {
    a[i] = n[i];
  }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) {
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

var background = modifier((element, [owner]) => {
  owner.registerBackground(element);
  let frame = requestAnimationFrame(() => owner.registerBackground(element));
  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterBackground();
  };
});

const storeByElement = new WeakMap();
function registerFlowStore(element, store) {
  storeByElement.set(element, store);
}
function unregisterFlowStore(element) {
  storeByElement.delete(element);
}
function getFlowStore(element) {
  let current = element;
  while (current) {
    let store = storeByElement.get(current);
    if (store) {
      return store;
    }
    current = current.parentElement;
  }
  return undefined;
}

let BackgroundVariant = /*#__PURE__*/function (BackgroundVariant) {
  BackgroundVariant["Lines"] = "lines";
  BackgroundVariant["Dots"] = "dots";
  BackgroundVariant["Cross"] = "cross";
  return BackgroundVariant;
}({});

var _Background;
class Background extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "element", void 0);
    _defineProperty(this, "store", void 0);
    _defineProperty(this, "unsubscribeViewport", void 0);
    _defineProperty(this, "syncPattern", viewport => {
      let element = this.element;
      if (!element) {
        return;
      }
      let pattern = element.querySelector('pattern');
      if (!pattern) {
        return;
      }
      let zoom = viewport.zoom || 1;
      let [gapX, gapY] = this.resolveTuple(this.args.gap ?? 20);
      let [offsetX, offsetY] = this.resolveTuple(this.args.offset ?? 0);
      let scaledGapX = gapX * zoom || 1;
      let scaledGapY = gapY * zoom || 1;
      let scaledSize = this.patternSize * zoom;
      let patternWidth = this.isCross ? scaledSize : scaledGapX;
      let patternHeight = this.isCross ? scaledSize : scaledGapY;
      let patternOffsetX = offsetX * zoom + patternWidth / 2;
      let patternOffsetY = offsetY * zoom + patternHeight / 2;
      pattern.setAttribute('x', `${viewport.x % scaledGapX}`);
      pattern.setAttribute('y', `${viewport.y % scaledGapY}`);
      pattern.setAttribute('width', `${scaledGapX}`);
      pattern.setAttribute('height', `${scaledGapY}`);
      pattern.setAttribute('patternTransform', `translate(-${patternOffsetX},-${patternOffsetY})`);
      let circle = pattern.querySelector('circle');
      if (circle) {
        let radius = scaledSize / 2;
        circle.setAttribute('cx', `${radius}`);
        circle.setAttribute('cy', `${radius}`);
        circle.setAttribute('r', `${radius}`);
      }
      let path = pattern.querySelector('path');
      if (path) {
        path.setAttribute('d', `M${patternWidth / 2} 0 V${patternHeight} M0 ${patternHeight / 2} H${patternWidth}`);
      }
    });
  }
  get patternStyle() {
    let declarations = [`--xy-background-pattern-color-props: ${this.patternColor}`, `--xy-background-color-props: ${this.args.bgColor ?? 'transparent'}`];
    return htmlSafe(declarations.join('; '));
  }
  get variant() {
    return this.args.variant ?? BackgroundVariant.Dots;
  }
  get isDots() {
    return this.variant === BackgroundVariant.Dots;
  }
  get isCross() {
    return this.variant === BackgroundVariant.Cross;
  }
  get patternColor() {
    return this.args.patternColor ?? this.args.color ?? '#81818a';
  }
  get patternId() {
    return `ember-flow-grid-${this.args.id ?? 'default'}`;
  }
  get gapX() {
    return this.resolveTuple(this.args.gap ?? 20)[0];
  }
  get gapY() {
    return this.resolveTuple(this.args.gap ?? 20)[1];
  }
  get offsetX() {
    return this.resolveTuple(this.args.offset ?? 0)[0];
  }
  get offsetY() {
    return this.resolveTuple(this.args.offset ?? 0)[1];
  }
  get patternSize() {
    if (this.args.size !== undefined) {
      return this.args.size;
    }
    return this.isCross ? 6 : 1;
  }
  get dotRadius() {
    return this.patternSize / 2;
  }
  get patternWidth() {
    return this.isCross ? this.patternSize : this.gapX;
  }
  get patternHeight() {
    return this.isCross ? this.patternSize : this.gapY;
  }
  get patternOffsetX() {
    return this.offsetX + this.patternWidth / 2;
  }
  get patternOffsetY() {
    return this.offsetY + this.patternHeight / 2;
  }
  get lineWidth() {
    return this.args.lineWidth ?? 1;
  }
  get linePath() {
    return `M${this.patternWidth / 2} 0 V${this.patternHeight} M0 ${this.patternHeight / 2} H${this.patternWidth}`;
  }
  get patternTransform() {
    return `translate(-${this.patternOffsetX},-${this.patternOffsetY})`;
  }
  get patternFill() {
    return `url(#${this.patternId})`;
  }
  get patternClasses() {
    return ['ember-flow__background-pattern', this.variant, this.args.patternClass, this.args.patternClassName].filter(Boolean).join(' ');
  }
  resolveTuple(value) {
    return Array.isArray(value) ? value : [value, value];
  }
  registerBackground(element) {
    this.element = element;
    let store = getFlowStore(element);
    if (!store) {
      this.syncPattern({
        x: 0,
        y: 0,
        zoom: 1
      });
      return;
    }
    if (this.store === store) {
      this.syncPattern(store.viewport);
      return;
    }
    this.unsubscribeViewport?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange(this.syncPattern);
  }
  unregisterBackground() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.store = undefined;
    this.element = undefined;
  }
}
_Background = Background;
setComponentTemplate(precompileTemplate("<svg class=\"ember-flow__background ember-flow__container\" aria-hidden=\"true\" style={{this.patternStyle}} {{background this}} ...attributes>\n  <defs>\n    <pattern id={{this.patternId}} x=\"0\" y=\"0\" width={{this.gapX}} height={{this.gapY}} patternUnits=\"userSpaceOnUse\" patternTransform={{this.patternTransform}}>\n      {{#if this.isDots}}\n        <circle class={{this.patternClasses}} cx={{this.dotRadius}} cy={{this.dotRadius}} r={{this.dotRadius}} />\n      {{else}}\n        <path class={{this.patternClasses}} stroke-width={{this.lineWidth}} d={{this.linePath}} />\n      {{/if}}\n    </pattern>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" fill=\"var(--xy-background-color-props)\" />\n  <rect width=\"100%\" height=\"100%\" fill={{this.patternFill}} />\n</svg>", {
  strictMode: true,
  scope: () => ({
    background
  })
}), _Background);

var _BezierEdge;
class BezierEdge extends Component {
  get pathData() {
    return umdExports.getBezierPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      sourcePosition: this.args.sourcePosition,
      targetX: this.args.targetX,
      targetY: this.args.targetY,
      targetPosition: this.args.targetPosition,
      curvature: this.args.pathOptions?.curvature
    });
  }
  get path() {
    return this.pathData[0];
  }
  get labelX() {
    return this.pathData[1];
  }
  get labelY() {
    return this.pathData[2];
  }
}
_BezierEdge = BezierEdge;
setComponentTemplate(precompileTemplate("<BaseEdge @id={{@id}} @path={{this.path}} @labelX={{this.labelX}} @labelY={{this.labelY}} @label={{@label}} @labelStyle={{@labelStyle}} @labelShowBg={{@labelShowBg}} @labelBgStyle={{@labelBgStyle}} @labelBgPadding={{@labelBgPadding}} @labelBgBorderRadius={{@labelBgBorderRadius}} @markerStart={{@markerStart}} @markerEnd={{@markerEnd}} @interactionWidth={{@interactionWidth}} @style={{@style}} ...attributes />", {
  strictMode: true,
  scope: () => ({
    BaseEdge
  })
}), _BezierEdge);

var _ControlButton;
class ControlButton extends Component {
  get buttonClasses() {
    return ['ember-flow__controls-button', this.args.class, this.args.className].filter(Boolean).join(' ');
  }
  get buttonStyle() {
    return safeStyle(this.args.style);
  }
}
_ControlButton = ControlButton;
setComponentTemplate(precompileTemplate("<button type=\"button\" class={{this.buttonClasses}} disabled={{@disabled}} title={{@title}} aria-label={{@ariaLabel}} style={{this.buttonStyle}} ...attributes>\n  {{yield}}\n</button>", {
  strictMode: true
}), _ControlButton);

var controlPanel = modifier((element, [owner]) => {
  owner.registerControlPanel(element);
  let frame = requestAnimationFrame(() => owner.registerControlPanel(element));
  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterControlPanel();
  };
});

var listen = modifier((element, [eventName, handler]) => {
  let listener = handler;
  element.addEventListener(eventName, listener);
  return () => {
    element.removeEventListener(eventName, listener);
  };
});

var _class$m, _descriptor$m, _Controls;
let Controls = (_class$m = (_Controls = class Controls extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$m, this);
    _defineProperty(this, "handleZoomIn", () => {
      void this.store?.zoomIn();
      this.args.onZoomIn?.();
    });
    _defineProperty(this, "handleZoomOut", () => {
      void this.store?.zoomOut();
      this.args.onZoomOut?.();
    });
    _defineProperty(this, "handleFitView", () => {
      void this.store?.fitView(this.args.fitViewOptions);
      this.args.onFitView?.();
    });
    _defineProperty(this, "handleToggleInteractivity", () => {
      let interactive = this.store?.toggleInteractivity() ?? true;
      this.args.onInteractiveChange?.(interactive);
    });
  }
  registerControlPanel(element) {
    this.store = getFlowStore(element);
  }
  unregisterControlPanel() {
    this.store = undefined;
  }
  get positionClasses() {
    let position = this.args.position ?? 'bottom-left';
    return position.replace('-', ' ');
  }
  get orientationClass() {
    return this.args.orientation === 'horizontal' ? 'horizontal' : 'vertical';
  }
  get showZoom() {
    return this.args.showZoom ?? true;
  }
  get showFitView() {
    return this.args.showFitView ?? true;
  }
  get showInteractive() {
    return this.args.showInteractive ?? this.args.showLock ?? true;
  }
  get minZoomReached() {
    let store = this.store;
    return store ? store.viewport.zoom <= store.minZoom : false;
  }
  get maxZoomReached() {
    let store = this.store;
    return store ? store.viewport.zoom >= store.maxZoom : false;
  }
  get isInteractive() {
    return this.store?.isInteractive ?? true;
  }
  get hasFlow() {
    return Boolean(this.store);
  }
  get flow() {
    return this.store;
  }
  get isLocked() {
    return !this.isInteractive;
  }
  get interactiveButtonClass() {
    return ['ember-flow__controls-button', 'ember-flow__controls-interactive', this.isLocked ? 'is-locked' : 'is-unlocked'].join(' ');
  }
  get interactiveTitle() {
    return this.isLocked ? 'unlock interactivity' : 'lock interactivity';
  }
  get interactivePressed() {
    return this.isLocked ? 'true' : 'false';
  }
}, setComponentTemplate(precompileTemplate("<div class=\"ember-flow__controls ember-flow__panel {{this.positionClasses}} {{this.orientationClass}}\" data-testid=\"ember-flow__controls\" aria-label=\"Ember Flow controls\" {{controlPanel this}} ...attributes>\n  {{#if this.showZoom}}\n    <button class=\"ember-flow__controls-button ember-flow__controls-zoomin\" type=\"button\" title=\"zoom in\" aria-label=\"zoom in\" disabled={{this.maxZoomReached}} {{listen \"click\" this.handleZoomIn}}>\n      <svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\">\n        <path d=\"M6 1v10M1 6h10\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" />\n      </svg>\n    </button>\n    <button class=\"ember-flow__controls-button ember-flow__controls-zoomout\" type=\"button\" title=\"zoom out\" aria-label=\"zoom out\" disabled={{this.minZoomReached}} {{listen \"click\" this.handleZoomOut}}>\n      <svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\">\n        <path d=\"M1 6h10\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" />\n      </svg>\n    </button>\n  {{/if}}\n  {{#if this.showFitView}}\n    <button class=\"ember-flow__controls-button ember-flow__controls-fitview\" type=\"button\" title=\"fit view\" aria-label=\"fit view\" {{listen \"click\" this.handleFitView}}>\n      <svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\">\n        <path d=\"M2 4V2h2M8 2h2v2M10 8v2H8M4 10H2V8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n      </svg>\n    </button>\n  {{/if}}\n  {{#if this.showInteractive}}\n    <button class={{this.interactiveButtonClass}} type=\"button\" title={{this.interactiveTitle}} aria-label={{this.interactiveTitle}} aria-pressed={{this.interactivePressed}} {{listen \"click\" this.handleToggleInteractivity}}>\n      {{#if this.isInteractive}}\n        <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" aria-hidden=\"true\">\n          <rect x=\"3\" y=\"6\" width=\"8\" height=\"6\" rx=\"1.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" />\n          <path d=\"M5 6V4.4a2.4 2.4 0 0 1 4.2-1.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" />\n        </svg>\n      {{else}}\n        <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" aria-hidden=\"true\">\n          <rect x=\"3\" y=\"6\" width=\"8\" height=\"6\" rx=\"1.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" />\n          <path d=\"M4.8 6V4.4a2.2 2.2 0 0 1 4.4 0V6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" />\n        </svg>\n      {{/if}}\n    </button>\n  {{/if}}\n  {{#if this.hasFlow}}\n    {{yield this.flow}}\n  {{/if}}\n</div>", {
  strictMode: true,
  scope: () => ({
    controlPanel,
    listen
  })
}), _Controls), _Controls), _descriptor$m = _applyDecoratedDescriptor(_class$m.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class$m);

var flowContext = modifier((element, [owner]) => {
  let frame = requestAnimationFrame(() => owner.registerFlowContext(element));
  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterFlowContext();
  };
});

var portal = modifier((element, [targetSelector]) => {
  let frame = requestAnimationFrame(() => {
    let root = element.closest('.ember-flow');
    let target = targetSelector === 'root' ? root : root?.querySelector(targetSelector);
    if (target && element.parentElement !== target) {
      target.appendChild(element);
    }
  });
  return () => {
    cancelAnimationFrame(frame);
    element.remove();
  };
});

var _class$l, _descriptor$l, _EdgeLabel;
let EdgeLabel = (_class$l = (_EdgeLabel = class EdgeLabel extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$l, this);
  }
  get classes() {
    return ['ember-flow__edge-label', this.args.transparent ? 'transparent' : undefined, this.args.className].filter(Boolean).join(' ');
  }
  get style() {
    let declarations = [`transform: translate(-50%, -50%) translate(${this.args.x ?? 0}px, ${this.args.y ?? 0}px)`, 'pointer-events: all', this.args.width !== undefined ? `width: ${this.toPx(this.args.width)}` : undefined, this.args.height !== undefined ? `height: ${this.toPx(this.args.height)}` : undefined, this.args.selectEdgeOnClick ? 'cursor: pointer' : undefined, toCss(this.args.style)].filter(Boolean);
    return htmlSafe(declarations.join('; '));
  }
  registerFlowContext(element) {
    this.store = getFlowStore(element);
  }
  unregisterFlowContext() {
    this.store = undefined;
  }
  handleClick(event) {
    if (!this.args.selectEdgeOnClick || !this.args.edgeId || !this.store) {
      return;
    }
    event.stopPropagation();
    this.store.clearSelection();
    this.store.selectEdge(this.args.edgeId);
  }
  toPx(value) {
    return typeof value === 'number' ? `${value}px` : value;
  }
}, setComponentTemplate(precompileTemplate("<div class={{this.classes}} data-id={{@edgeId}} style={{this.style}} tabindex=\"-1\" {{flowContext this}} {{portal \".ember-flow__edge-labels\"}} {{listen \"click\" this.handleClick}} ...attributes>\n  {{yield}}\n</div>", {
  strictMode: true,
  scope: () => ({
    flowContext,
    portal,
    listen
  })
}), _EdgeLabel), _EdgeLabel), _descriptor$l = _applyDecoratedDescriptor(_class$l.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class$l.prototype, "handleClick", [action], Object.getOwnPropertyDescriptor(_class$l.prototype, "handleClick"), _class$l.prototype), _class$l);

var _EdgeLabelRenderer;
class EdgeLabelRenderer extends Component {}
_EdgeLabelRenderer = EdgeLabelRenderer;
setComponentTemplate(precompileTemplate("<div {{portal \".ember-flow__edgelabel-renderer\"}} ...attributes>\n  {{yield}}\n</div>", {
  strictMode: true,
  scope: () => ({
    portal
  })
}), _EdgeLabelRenderer);

const controllerByElement = new WeakMap();
function registerFlowController(element, controller) {
  controllerByElement.set(element, controller);
}
function unregisterFlowController(element) {
  controllerByElement.delete(element);
}
function getFlowController(element) {
  let current = element;
  while (current) {
    let controller = controllerByElement.get(current);
    if (controller) {
      return controller;
    }
    current = current.parentElement;
  }
  return undefined;
}

var _class$k, _descriptor$k, _EdgeReconnectAnchor;
let EdgeReconnectAnchor = (_class$k = (_EdgeReconnectAnchor = class EdgeReconnectAnchor extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$k, this);
    _defineProperty(this, "controller", void 0);
  }
  registerFlowContext(element) {
    this.store = getFlowStore(element);
    this.controller = getFlowController(element);
  }
  unregisterFlowContext() {
    this.store = undefined;
    this.controller = undefined;
  }
  get edge() {
    if (this.args.edge) {
      return this.args.edge;
    }
    if (!this.args.edgeId) {
      return undefined;
    }
    return this.store?.getEdge(this.args.edgeId);
  }
  get edgeId() {
    return this.args.edgeId ?? this.args.edge?.id;
  }
  get hasEdge() {
    return Boolean(this.edge);
  }
  get size() {
    return this.args.size ?? 25;
  }
  get x() {
    return this.args.position?.x;
  }
  get y() {
    return this.args.position?.y;
  }
  get classes() {
    return ['ember-flow__edgeupdater', this.args.type ? `ember-flow__edgeupdater-${this.args.type}` : undefined, 'nopan', 'nodrag', this.args.class, this.args.className].filter(Boolean).join(' ');
  }
  get style() {
    return htmlSafe(['width: 100%', 'height: 100%', toCss(this.args.style)].filter(Boolean).join('; '));
  }
  get oppositeType() {
    return this.args.type === 'source' ? 'target' : 'source';
  }
  findFixedElement(element) {
    let edgeId = this.edgeId;
    if (!edgeId) {
      return null;
    }
    return element.closest('.ember-flow__edge-labels')?.querySelector(`.ember-flow__edgeupdater-${this.oppositeType}[data-edgeid="${this.escapeAttribute(edgeId)}"]`);
  }
  escapeAttribute(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }
  handlePointerDown(event) {
    let edge = this.edge;
    if (!edge || !this.args.type || event.button !== 0) {
      return;
    }
    let element = event.currentTarget;
    let detail = {
      edge,
      handleType: this.args.type,
      pointerEvent: event,
      fixedElement: this.findFixedElement(element)
    };
    if (this.controller) {
      this.controller.startEdgeReconnect(detail.edge, detail.handleType, detail.pointerEvent, detail.fixedElement);
      return;
    }
    element.dispatchEvent(new CustomEvent('ember-flow:edge-reconnect', {
      bubbles: true,
      detail
    }));
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__edge-reconnect-context\" {{flowContext this}}></span>\n{{#if this.hasEdge}}\n  <EdgeLabel @x={{this.x}} @y={{this.y}} @width={{this.size}} @height={{this.size}} @transparent={{true}} data-id={{this.edgeId}} data-edgeid={{this.edgeId}}>\n    <div class={{this.classes}} data-id={{this.edgeId}} data-edgeid={{this.edgeId}} data-drag-threshold={{@dragThreshold}} style={{this.style}} {{listen \"pointerdown\" this.handlePointerDown}} ...attributes>\n      {{#unless @reconnecting}}\n        {{yield}}\n      {{/unless}}\n    </div>\n  </EdgeLabel>\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    EdgeLabel,
    listen
  })
}), _EdgeReconnectAnchor), _EdgeReconnectAnchor), _descriptor$k = _applyDecoratedDescriptor(_class$k.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class$k.prototype, "handlePointerDown", [action], Object.getOwnPropertyDescriptor(_class$k.prototype, "handlePointerDown"), _class$k.prototype), _class$k);

function getEdgePathData(edge, source, target, options = {}) {
  let edgePosition = getEdgePosition(source, target, options);
  let pathOptions = edge.pathOptions ?? {};
  switch (edge.type) {
    case 'straight':
      return umdExports.getStraightPath(edgePosition);
    case 'step':
      return umdExports.getSmoothStepPath({
        ...edgePosition,
        borderRadius: 0,
        offset: pathOptions.offset
      });
    case 'smoothstep':
      return umdExports.getSmoothStepPath({
        ...edgePosition,
        borderRadius: pathOptions.borderRadius,
        offset: pathOptions.offset,
        stepPosition: pathOptions.stepPosition
      });
    case 'simplebezier':
      return getSimpleBezierPath(edgePosition);
    default:
      return umdExports.getBezierPath({
        ...edgePosition,
        curvature: pathOptions.curvature
      });
  }
}
function getControl({
  pos,
  x1,
  y1,
  x2,
  y2
}) {
  if (pos === umdExports.Position.Left || pos === umdExports.Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }
  return [x1, 0.5 * (y1 + y2)];
}
function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = umdExports.Position.Bottom,
  targetX,
  targetY,
  targetPosition = umdExports.Position.Top
}) {
  let [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY
  });
  let [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY
  });
  let [labelX, labelY, offsetX, offsetY] = umdExports.getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
function getEdgePosition(source, target, options = {}) {
  let sourcePosition = source.sourcePosition ?? umdExports.Position.Bottom;
  let targetPosition = target.targetPosition ?? umdExports.Position.Top;
  let sourceHandle = getHandlePosition(source, sourcePosition, options);
  let targetHandle = getHandlePosition(target, targetPosition, options);
  return {
    sourceX: sourceHandle.x,
    sourceY: sourceHandle.y,
    sourcePosition,
    targetX: targetHandle.x,
    targetY: targetHandle.y,
    targetPosition
  };
}
function getHandlePosition(node, position, options = {}) {
  let width = options.getNodeWidth?.(node) ?? node.width ?? node.initialWidth ?? node.measured?.width ?? 150;
  let height = options.getNodeHeight?.(node) ?? node.height ?? node.initialHeight ?? node.measured?.height ?? 40;
  let {
    x,
    y
  } = options.getNodePosition?.(node) ?? node.position;
  switch (position) {
    case umdExports.Position.Top:
      return {
        x: x + width / 2,
        y
      };
    case umdExports.Position.Right:
      return {
        x: x + width,
        y: y + height / 2
      };
    case umdExports.Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height
      };
    case umdExports.Position.Left:
      return {
        x,
        y: y + height / 2
      };
  }
}

var _class$j, _descriptor$j, _descriptor2$e, _EdgeToolbar;
let EdgeToolbar = (_class$j = (_EdgeToolbar = class EdgeToolbar extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$j, this);
    _initializerDefineProperty(this, "viewport", _descriptor2$e, this);
    _defineProperty(this, "unsubscribeViewport", void 0);
  }
  get edge() {
    this.store?.revision;
    return this.args.edgeId ? this.store?.getEdge(this.args.edgeId) : undefined;
  }
  get isActive() {
    if (typeof this.args.isVisible === 'boolean') {
      return this.args.isVisible;
    }
    return Boolean(this.edge?.selected);
  }
  get point() {
    let edge = this.edge;
    let store = this.store;
    if (this.args.x !== undefined && this.args.y !== undefined) {
      return {
        x: this.args.x,
        y: this.args.y
      };
    }
    if (!edge || !store) {
      return {
        x: 0,
        y: 0
      };
    }
    let source = store.getNode(edge.source);
    let target = store.getNode(edge.target);
    if (!source || !target) {
      return {
        x: 0,
        y: 0
      };
    }
    let [, labelX, labelY] = getEdgePathData(edge, source, target, {
      getNodePosition: node => store.getNodePosition(node),
      getNodeWidth: node => store.getNodeWidth(node),
      getNodeHeight: node => store.getNodeHeight(node)
    });
    return {
      x: labelX,
      y: labelY
    };
  }
  get toolbarClasses() {
    return ['ember-flow__edge-toolbar', this.args.className].filter(Boolean).join(' ');
  }
  get toolbarStyle() {
    let point = this.point;
    let offset = this.screenOffset;
    let zoom = this.viewport.zoom || 1;
    let transform = umdExports.getEdgeToolbarTransform(point.x + offset.x / zoom, point.y + offset.y / zoom, zoom, this.args.alignX ?? 'center', this.args.alignY ?? 'center');
    let zIndex = (this.edge?.zIndex ?? 0) + 1;
    return htmlSafe(['position: absolute', 'pointer-events: all', 'transform-origin: 0 0', `transform: ${transform}`, `z-index: ${zIndex}`, toCss(this.args.style)].filter(Boolean).join('; '));
  }
  get screenOffset() {
    let offset = this.args.offset ?? 10;
    switch (this.args.position) {
      case umdExports.Position.Top:
        return {
          x: 0,
          y: -offset
        };
      case umdExports.Position.Right:
        return {
          x: offset,
          y: 0
        };
      case umdExports.Position.Bottom:
        return {
          x: 0,
          y: offset
        };
      case umdExports.Position.Left:
        return {
          x: -offset,
          y: 0
        };
      default:
        return {
          x: 0,
          y: 0
        };
    }
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store) {
      return;
    }
    if (this.store === store) {
      this.viewport = store.getViewport();
      return;
    }
    this.unsubscribeViewport?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange(viewport => {
      this.viewport = {
        ...viewport
      };
    });
  }
  unregisterFlowContext() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.store = undefined;
  }
}, setComponentTemplate(precompileTemplate("<span {{flowContext this}}></span>\n{{#if this.isActive}}\n  <EdgeLabel @edgeId={{@edgeId}} @selectEdgeOnClick={{@selectEdgeOnClick}} @transparent={{true}}>\n    <div class={{this.toolbarClasses}} data-id={{@edgeId}} data-position={{@position}} data-offset={{@offset}} data-align-x={{@alignX}} data-align-y={{@alignY}} style={{this.toolbarStyle}} ...attributes>\n      {{yield}}\n    </div>\n  </EdgeLabel>\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    EdgeLabel
  })
}), _EdgeToolbar), _EdgeToolbar), _descriptor$j = _applyDecoratedDescriptor(_class$j.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$e = _applyDecoratedDescriptor(_class$j.prototype, "viewport", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {
      x: 0,
      y: 0,
      zoom: 1
    };
  }
}), _class$j);

var flowArgs = modifier((_, [owner]) => {
  owner.syncArgs();
});

var flowController = modifier((element, [controller]) => {
  registerFlowController(element, controller);
  return () => {
    unregisterFlowController(element);
  };
});

var flowStore = modifier((element, [store]) => {
  registerFlowStore(element, store);
  return () => {
    unregisterFlowStore(element);
  };
});

var panZoom = modifier((element, [owner]) => {
  owner.installPanZoom(element);
  return () => {
    owner.uninstallPanZoom();
  };
});

var _class$i, _descriptor$i, _descriptor2$d, _descriptor3$4, _descriptor4, _descriptor5, _descriptor6, _descriptor7;
let EmberFlowStore = (_class$i = class EmberFlowStore {
  constructor(initialViewport) {
    _defineProperty(this, "viewport", void 0);
    _defineProperty(this, "panZoom", null);
    _defineProperty(this, "domNode", null);
    _defineProperty(this, "translateExtent", [[-Infinity, -Infinity], [Infinity, Infinity]]);
    _defineProperty(this, "nodeOrigin", [0, 0]);
    _defineProperty(this, "nodeExtent", umdExports.infiniteExtent);
    _defineProperty(this, "zIndexMode", 'basic');
    _defineProperty(this, "elevateNodesOnSelect", true);
    _initializerDefineProperty(this, "width", _descriptor$i, this);
    _initializerDefineProperty(this, "height", _descriptor2$d, this);
    _defineProperty(this, "minZoom", 0.5);
    _defineProperty(this, "maxZoom", 2);
    _defineProperty(this, "snapToGrid", false);
    _defineProperty(this, "snapGrid", [15, 15]);
    _defineProperty(this, "autoPanOnNodeDrag", true);
    _defineProperty(this, "autoPanOnConnect", true);
    _defineProperty(this, "autoPanSpeed", 15);
    _initializerDefineProperty(this, "nodesDraggable", _descriptor3$4, this);
    _initializerDefineProperty(this, "nodesConnectable", _descriptor4, this);
    _initializerDefineProperty(this, "elementsSelectable", _descriptor5, this);
    _defineProperty(this, "nodeLookup", new Map());
    _defineProperty(this, "parentLookup", new Map());
    _defineProperty(this, "edgeLookup", new Map());
    _defineProperty(this, "connectionLookup", new Map());
    _initializerDefineProperty(this, "revision", _descriptor6, this);
    _defineProperty(this, "nodesInitialized", false);
    _initializerDefineProperty(this, "connection", _descriptor7, this);
    _defineProperty(this, "selectedNodeIds", new Set());
    _defineProperty(this, "selectedEdgeIds", new Set());
    _defineProperty(this, "deletedNodeIds", new Set());
    _defineProperty(this, "deletedEdgeIds", new Set());
    _defineProperty(this, "pressedKeys", new Set());
    _defineProperty(this, "nodePositions", new Map());
    _defineProperty(this, "nodeDimensions", new Map());
    _defineProperty(this, "viewportListeners", new Set());
    _defineProperty(this, "nodeGeometryListeners", new Set());
    _defineProperty(this, "graphListeners", new Set());
    _defineProperty(this, "connectionListeners", new Set());
    _defineProperty(this, "keyListeners", new Set());
    _defineProperty(this, "deleteCallbacks", {});
    _defineProperty(this, "cancelConnectionCallback", void 0);
    _defineProperty(this, "addedNodes", []);
    _defineProperty(this, "addedEdges", []);
    _defineProperty(this, "nodeUpdates", new Map());
    _defineProperty(this, "edgeUpdates", new Map());
    _defineProperty(this, "sourceNodePositionKeys", new Map());
    _defineProperty(this, "nodesOverride", void 0);
    _defineProperty(this, "edgesOverride", void 0);
    _defineProperty(this, "syncCache", void 0);
    _defineProperty(this, "currentSourceNodes", []);
    _defineProperty(this, "currentSourceEdges", []);
    this.viewport = initialViewport ?? {
      x: 0,
      y: 0,
      zoom: 1
    };
  }
  getNodes(sourceNodes = this.currentSourceNodes) {
    if (sourceNodes !== this.currentSourceNodes) {
      this.syncControlledSourceNodePositions(sourceNodes);
    }
    this.currentSourceNodes = sourceNodes;
    return this.syncGraph(this.nodesOverride ?? sourceNodes, this.edgesOverride ?? this.currentSourceEdges).nodes;
  }
  getEdges(sourceEdges = this.currentSourceEdges) {
    this.currentSourceEdges = sourceEdges;
    return this.syncGraph(this.nodesOverride ?? this.currentSourceNodes, this.edgesOverride ?? sourceEdges).edges;
  }
  syncGraph(sourceNodes = [], sourceEdges = []) {
    this.revision;
    let cache = this.syncCache;
    if (cache && cache.revision === this.revision && cache.sourceNodes === sourceNodes && cache.sourceEdges === sourceEdges) {
      return {
        nodes: cache.nodes,
        edges: cache.edges
      };
    }
    let nodes = this.materializeNodes(sourceNodes);
    let edges = this.materializeEdges(sourceEdges);
    let {
      nodesInitialized
    } = umdExports.adoptUserNodes(nodes, this.nodeLookup, this.parentLookup, {
      nodeExtent: this.nodeExtent,
      nodeOrigin: this.nodeOrigin,
      elevateNodesOnSelect: this.elevateNodesOnSelect,
      checkEquality: true,
      zIndexMode: this.zIndexMode
    });
    umdExports.updateConnectionLookup(this.connectionLookup, this.edgeLookup, edges);
    this.nodesInitialized = nodesInitialized;
    this.syncCache = {
      revision: this.revision,
      sourceNodes,
      sourceEdges,
      nodes,
      edges
    };
    return {
      nodes,
      edges
    };
  }
  get selectedNodes() {
    return Array.from(this.nodeLookup.values()).filter(node => this.selectedNodeIds.has(node.id) || node.selected).map(node => node.internals.userNode);
  }
  get selectedEdges() {
    return Array.from(this.edgeLookup.values()).filter(edge => this.selectedEdgeIds.has(edge.id) || edge.selected);
  }
  getInternalNode(id) {
    return this.nodeLookup.get(id);
  }
  getNode(id) {
    return this.nodeLookup.get(id)?.internals.userNode;
  }
  getEdge(id) {
    return this.edgeLookup.get(id);
  }
  getConnectedEdges(nodeId) {
    let connections = this.connectionLookup.get(nodeId);
    if (!connections) {
      return [];
    }
    let seen = new Set();
    let edges = [];
    for (let connection of connections.values()) {
      if (seen.has(connection.edgeId)) {
        continue;
      }
      let edge = this.edgeLookup.get(connection.edgeId);
      if (edge) {
        seen.add(connection.edgeId);
        edges.push(edge);
      }
    }
    return edges;
  }
  getInternalNodesBounds() {
    return umdExports.getInternalNodesBounds(this.nodeLookup, {
      filter: node => !node.hidden
    });
  }
  getNodesBounds(nodes) {
    return umdExports.getNodesBounds(nodes, {
      nodeLookup: this.nodeLookup,
      nodeOrigin: this.nodeOrigin
    });
  }
  setNodes(payload) {
    let currentNodes = this.getNodes();
    let nextNodes = typeof payload === 'function' ? payload(currentNodes) : payload;
    this.nodesOverride = [...nextNodes];
    this.addedNodes = [];
    this.nodeUpdates.clear();
    this.deletedNodeIds.clear();
    this.nodePositions.clear();
    this.nodeDimensions.clear();
    this.bump();
  }
  setEdges(payload) {
    let currentEdges = this.getEdges();
    let nextEdges = typeof payload === 'function' ? payload(currentEdges) : payload;
    this.edgesOverride = [...nextEdges];
    this.addedEdges = [];
    this.edgeUpdates.clear();
    this.deletedEdgeIds.clear();
    this.bump();
  }
  addNodes(payload) {
    let nodes = Array.isArray(payload) ? payload : [payload];
    for (let node of nodes) {
      this.deletedNodeIds.delete(node.id);
      this.nodeUpdates.delete(node.id);
      this.nodePositions.delete(node.id);
      this.nodeDimensions.delete(node.id);
    }
    if (this.nodesOverride) {
      this.nodesOverride = this.upsertElementsById(this.nodesOverride, nodes);
    } else {
      let sourceNodes = this.currentSourceNodes;
      let addedNodes = [...this.addedNodes];
      for (let node of nodes) {
        if (sourceNodes.some(sourceNode => sourceNode.id === node.id)) {
          this.nodeUpdates.set(node.id, node);
        } else {
          addedNodes = this.upsertElementsById(addedNodes, [node]);
        }
      }
      this.addedNodes = addedNodes;
    }
    this.bump();
  }
  addEdges(payload) {
    let edges = Array.isArray(payload) ? payload : [payload];
    for (let edge of edges) {
      this.deletedEdgeIds.delete(edge.id);
      this.edgeUpdates.delete(edge.id);
    }
    if (this.edgesOverride) {
      this.edgesOverride = this.upsertElementsById(this.edgesOverride, edges);
    } else {
      let sourceEdges = this.currentSourceEdges;
      let addedEdges = [...this.addedEdges];
      for (let edge of edges) {
        if (sourceEdges.some(sourceEdge => sourceEdge.id === edge.id)) {
          this.edgeUpdates.set(edge.id, edge);
        } else {
          addedEdges = this.upsertElementsById(addedEdges, [edge]);
        }
      }
      this.addedEdges = addedEdges;
    }
    this.bump();
  }
  upsertElementsById(elements, updates) {
    let nextElements = [...elements];
    for (let update of updates) {
      let index = nextElements.findIndex(element => element.id === update.id);
      if (index >= 0) {
        nextElements[index] = update;
      } else {
        nextElements.push(update);
      }
    }
    return nextElements;
  }
  updateNode(id, nodeUpdate, options = {
    replace: false
  }) {
    let currentNode = this.nodeUpdates.get(id) ?? this.getNode(id);
    if (!currentNode) {
      return;
    }
    let nextUpdate = typeof nodeUpdate === 'function' ? nodeUpdate(currentNode) : nodeUpdate;
    let nextNode = options.replace ? nextUpdate : {
      ...currentNode,
      ...nextUpdate
    };
    this.nodeUpdates.set(id, nextNode);
    if (nextNode.position) {
      this.nodePositions.set(id, this.roundPosition(nextNode.position));
    }
    if (nextNode.width !== undefined || nextNode.height !== undefined || nextNode.measured) {
      this.nodeDimensions.set(id, {
        width: nextNode.width ?? nextNode.measured?.width ?? this.getNodeWidth(currentNode),
        height: nextNode.height ?? nextNode.measured?.height ?? this.getNodeHeight(currentNode)
      });
    }
    this.bump();
  }
  updateNodeData(id, dataUpdate, options = {
    replace: false
  }) {
    this.updateNode(id, node => {
      let nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;
      return {
        data: options.replace ? nextData : {
          ...node.data,
          ...nextData
        }
      };
    });
  }
  updateEdge(id, edgeUpdate, options = {
    replace: false
  }) {
    let currentEdge = this.edgeUpdates.get(id) ?? this.getEdge(id);
    if (!currentEdge) {
      return;
    }
    let nextUpdate = typeof edgeUpdate === 'function' ? edgeUpdate(currentEdge) : edgeUpdate;
    let nextEdge = options.replace ? nextUpdate : {
      ...currentEdge,
      ...nextUpdate
    };
    this.edgeUpdates.set(id, nextEdge);
    this.bump();
  }
  updateEdgeData(id, dataUpdate, options = {
    replace: false
  }) {
    this.updateEdge(id, edge => {
      let nextData = typeof dataUpdate === 'function' ? dataUpdate(edge) : dataUpdate;
      return {
        data: options.replace ? nextData : {
          ...edge.data,
          ...nextData
        }
      };
    });
  }
  setDeleteCallbacks(callbacks) {
    this.deleteCallbacks = callbacks;
  }
  setCancelConnectionCallback(callback) {
    this.cancelConnectionCallback = callback;
  }
  cancelConnection() {
    this.cancelConnectionCallback?.();
    this.setConnection(umdExports.initialConnection);
  }
  async deleteElements({
    nodes: nodesToRemove = [],
    edges: edgesToRemove = []
  }) {
    let nodes = this.getNodes();
    let edges = this.getEdges();
    let {
      nodes: deletedNodes,
      edges: deletedEdges
    } = await umdExports.getElementsToRemove({
      nodesToRemove,
      edgesToRemove,
      nodes,
      edges,
      onBeforeDelete: this.deleteCallbacks.onBeforeDelete
    });
    let nodeChanges = deletedNodes.map(node => ({
      id: node.id,
      type: 'remove'
    }));
    let edgeChanges = deletedEdges.map(edge => ({
      id: edge.id,
      type: 'remove'
    }));
    if (deletedNodes.length === 0 && deletedEdges.length === 0) {
      return {
        deletedNodes,
        deletedEdges,
        nodeChanges,
        edgeChanges
      };
    }
    for (let node of deletedNodes) {
      this.deletedNodeIds.add(node.id);
      this.selectedNodeIds.delete(node.id);
      this.nodeUpdates.delete(node.id);
    }
    for (let edge of deletedEdges) {
      this.deletedEdgeIds.add(edge.id);
      this.selectedEdgeIds.delete(edge.id);
      this.edgeUpdates.delete(edge.id);
    }
    if (deletedEdges.length > 0) {
      this.deleteCallbacks.onEdgesDelete?.(deletedEdges);
    }
    if (deletedNodes.length > 0) {
      this.deleteCallbacks.onNodesDelete?.(deletedNodes);
    }
    this.deleteCallbacks.onDelete?.({
      nodes: deletedNodes,
      edges: deletedEdges
    });
    this.bump();
    return {
      deletedNodes,
      deletedEdges,
      nodeChanges,
      edgeChanges
    };
  }
  getIntersectingNodes(nodeOrRect, partially = true, nodes) {
    let isRect = umdExports.isRectObject(nodeOrRect);
    let nodeRect;
    let nodeId;
    if (isRect) {
      nodeRect = nodeOrRect;
      nodeId = null;
    } else {
      let nodeOrId = nodeOrRect;
      nodeRect = this.getNodeRect(nodeOrId);
      nodeId = nodeOrId.id;
    }
    if (!nodeRect) {
      return [];
    }
    return (nodes ?? this.getNodes()).filter(node => {
      if (nodeId && node.id === nodeId) {
        return false;
      }
      let currentNodeRect = this.getRenderedNodeBounds(node);
      let overlappingArea = umdExports.getOverlappingArea(currentNodeRect, nodeRect);
      let partiallyVisible = partially && overlappingArea > 0;
      return partiallyVisible || overlappingArea >= currentNodeRect.width * currentNodeRect.height || overlappingArea >= nodeRect.width * nodeRect.height;
    });
  }
  isNodeIntersecting(nodeOrRect, area, partially = true) {
    let isRect = umdExports.isRectObject(nodeOrRect);
    let nodeRect = isRect ? nodeOrRect : this.getNodeRect(nodeOrRect);
    if (!nodeRect) {
      return false;
    }
    let overlappingArea = umdExports.getOverlappingArea(nodeRect, area);
    let partiallyVisible = partially && overlappingArea > 0;
    return partiallyVisible || overlappingArea >= area.width * area.height || overlappingArea >= nodeRect.width * nodeRect.height;
  }
  getHandleConnections({
    type,
    id,
    nodeId
  }) {
    return Array.from(this.connectionLookup.get(`${nodeId}-${type}${id ? `-${id}` : ''}`)?.values() ?? []);
  }
  getNodeConnections({
    type,
    handleId,
    nodeId
  }) {
    return Array.from(this.connectionLookup.get(`${nodeId}${type ? handleId ? `-${type}-${handleId}` : `-${type}` : ''}`)?.values() ?? []);
  }
  materializeNodes(sourceNodes = []) {
    return [...sourceNodes, ...this.addedNodes].filter(node => !this.deletedNodeIds.has(node.id)).map(sourceNode => {
      let node = this.nodeUpdates.get(sourceNode.id) ?? sourceNode;
      let position = this.nodePositions.get(node.id);
      let dimensions = this.nodeDimensions.get(node.id);
      let width = dimensions?.width ?? node.width ?? node.initialWidth ?? node.measured?.width;
      let height = dimensions?.height ?? node.height ?? node.initialHeight ?? node.measured?.height;
      let selected = this.selectedNodeIds.has(node.id) || node.selected;
      let measured = width !== undefined || height !== undefined ? {
        ...node.measured,
        ...(width !== undefined ? {
          width
        } : {}),
        ...(height !== undefined ? {
          height
        } : {})
      } : node.measured;
      if (!position && !dimensions && selected === node.selected && measured === node.measured) {
        return node;
      }
      return {
        ...node,
        ...(position ? {
          position
        } : {}),
        ...(dimensions ? {
          width: dimensions.width,
          height: dimensions.height
        } : {}),
        ...(measured ? {
          measured
        } : {}),
        selected
      };
    });
  }
  syncControlledSourceNodePositions(sourceNodes) {
    let seenIds = new Set();
    for (let node of sourceNodes) {
      seenIds.add(node.id);
      let positionKey = this.positionKey(node.position);
      let previousPositionKey = this.sourceNodePositionKeys.get(node.id);
      if (previousPositionKey !== undefined && previousPositionKey !== positionKey) {
        this.nodePositions.set(node.id, this.roundPosition(node.position));
        this.notifyNodeGeometryListeners(node.id);
      }
      this.sourceNodePositionKeys.set(node.id, positionKey);
    }
    for (let id of this.sourceNodePositionKeys.keys()) {
      if (!seenIds.has(id)) {
        this.sourceNodePositionKeys.delete(id);
      }
    }
  }
  positionKey(position) {
    return `${position.x}:${position.y}`;
  }
  materializeEdges(sourceEdges = []) {
    return [...sourceEdges, ...this.addedEdges].map(sourceEdge => this.edgeUpdates.get(sourceEdge.id) ?? sourceEdge).filter(edge => !this.deletedEdgeIds.has(edge.id) && !this.deletedNodeIds.has(edge.source) && !this.deletedNodeIds.has(edge.target)).map(edge => {
      let selected = this.selectedEdgeIds.has(edge.id) || edge.selected;
      if (selected === edge.selected) {
        return edge;
      }
      return {
        ...edge,
        selected
      };
    });
  }
  getViewport() {
    return {
      ...this.viewport
    };
  }
  getZoom() {
    return this.viewport.zoom;
  }
  setViewport(viewport, options) {
    let nextViewport = this.normalizeViewport({
      x: viewport.x ?? this.viewport.x,
      y: viewport.y ?? this.viewport.y,
      zoom: viewport.zoom ?? this.viewport.zoom
    });
    if (options && this.panZoom) {
      return this.panZoom.setViewport(nextViewport, options).then(() => true);
    }
    this.commitViewport(nextViewport, true);
    return Promise.resolve(true);
  }
  setViewportFromPanZoom(viewport) {
    this.commitViewport(viewport, false);
  }
  commitViewport(viewport, syncPanZoom) {
    this.viewport = this.normalizeViewport(viewport);
    if (syncPanZoom) {
      this.syncPanZoomViewport();
    }
    this.notifyViewportListeners();
  }
  onViewportChange(callback) {
    this.viewportListeners.add(callback);
    callback(this.viewport);
    return () => {
      this.viewportListeners.delete(callback);
    };
  }
  onNodeGeometryChange(callback) {
    this.nodeGeometryListeners.add(callback);
    return () => {
      this.nodeGeometryListeners.delete(callback);
    };
  }
  onChange(callback) {
    this.graphListeners.add(callback);
    callback(this);
    return () => {
      this.graphListeners.delete(callback);
    };
  }
  subscribe(callback) {
    return this.onChange(callback);
  }
  onConnectionChange(callback) {
    this.connectionListeners.add(callback);
    callback(this.connection);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }
  onKeyChange(callback) {
    this.keyListeners.add(callback);
    callback(new Set(this.pressedKeys));
    return () => {
      this.keyListeners.delete(callback);
    };
  }
  setConnection(connection) {
    this.connection = connection;
    for (let listener of this.connectionListeners) {
      listener(this.connection);
    }
  }
  syncPanZoomViewport() {
    this.panZoom?.syncViewport(this.viewport);
  }
  addPressedKey(key) {
    let previousSize = this.pressedKeys.size;
    this.pressedKeys.add(key);
    if (this.pressedKeys.size !== previousSize) {
      this.notifyKeyListeners();
    }
  }
  removePressedKey(key) {
    if (this.pressedKeys.delete(key)) {
      this.notifyKeyListeners();
    }
  }
  notifyKeyListeners() {
    let keys = new Set(this.pressedKeys);
    for (let listener of this.keyListeners) {
      listener(keys);
    }
  }
  isMultiSelectionActive(configuredKey) {
    let keyConfig = configuredKey ?? 's';
    let keys = Array.isArray(keyConfig) ? keyConfig : [keyConfig];
    return keys.some(key => key !== null && this.pressedKeys.has(key));
  }
  clearSelection() {
    let hadSelection = this.selectedNodeIds.size > 0 || this.selectedEdgeIds.size > 0;
    this.selectedNodeIds.clear();
    this.selectedEdgeIds.clear();
    if (hadSelection) {
      this.bump();
    }
    return hadSelection;
  }
  selectNode(id) {
    let wasSelected = this.selectedNodeIds.has(id);
    this.selectedNodeIds.add(id);
    if (!wasSelected) {
      this.bump();
    }
    return !wasSelected;
  }
  selectEdge(id) {
    let wasSelected = this.selectedEdgeIds.has(id);
    this.selectedEdgeIds.add(id);
    if (!wasSelected) {
      this.bump();
    }
    return !wasSelected;
  }
  addEdge(edge) {
    this.addEdges(edge);
  }
  setNodePosition(id, position, positionAbsolute) {
    let rounded = {
      x: this.roundViewportValue(position.x),
      y: this.roundViewportValue(position.y)
    };
    this.nodePositions.set(id, rounded);
    this.syncInternalNodeGeometry(id, positionAbsolute);
    this.notifyNodeGeometryListeners(id);
    return rounded;
  }
  setNodeAbsolutePosition(id, node, absolutePosition) {
    let constrainedPosition = this.constrainNodeAbsolutePosition(node, absolutePosition);
    let userPosition = this.absoluteToUserPosition(node, constrainedPosition);
    return {
      position: this.setNodePosition(id, userPosition, constrainedPosition),
      positionAbsolute: constrainedPosition
    };
  }
  getNodePosition(node) {
    let position = this.getNodeUserPosition(node);
    let origin = this.getNodeOrigin(node);
    let localPosition = {
      x: position.x - this.getNodeWidth(node) * origin[0],
      y: position.y - this.getNodeHeight(node) * origin[1]
    };
    if (!node.parentId) {
      return localPosition;
    }
    let parent = this.currentSourceNodes.find(candidate => candidate.id === node.parentId);
    if (!parent) {
      return localPosition;
    }
    let parentPosition = this.getNodePosition(parent);
    return {
      x: parentPosition.x + localPosition.x,
      y: parentPosition.y + localPosition.y
    };
  }
  getNodeUserPosition(node) {
    return this.nodePositions.get(node.id) ?? node.position;
  }
  snapNodePosition(position) {
    return this.snapToGrid ? umdExports.snapPosition(position, this.snapGrid) : position;
  }
  setSnapGrid(snapToGrid, snapGrid) {
    this.snapToGrid = snapToGrid;
    this.snapGrid = snapGrid;
  }
  setAutoPanOptions({
    autoPanOnNodeDrag,
    autoPanOnConnect,
    autoPanSpeed
  }) {
    this.autoPanOnNodeDrag = autoPanOnNodeDrag ?? true;
    this.autoPanOnConnect = autoPanOnConnect ?? true;
    this.autoPanSpeed = autoPanSpeed ?? 15;
  }
  setNodeOrigin(nodeOrigin) {
    this.nodeOrigin = nodeOrigin;
  }
  setNodeExtent(nodeExtent) {
    this.nodeExtent = nodeExtent;
  }
  setTranslateExtent(translateExtent) {
    this.translateExtent = translateExtent;
    this.panZoom?.setTranslateExtent(translateExtent);
  }
  absoluteToUserPosition(node, absolutePosition) {
    let parentPosition = this.getParentAbsolutePosition(node);
    let origin = this.getNodeOrigin(node);
    return {
      x: absolutePosition.x - parentPosition.x + this.getNodeWidth(node) * origin[0],
      y: absolutePosition.y - parentPosition.y + this.getNodeHeight(node) * origin[1]
    };
  }
  getParentAbsolutePosition(node) {
    if (!node.parentId) {
      return {
        x: 0,
        y: 0
      };
    }
    let parent = this.currentSourceNodes.find(candidate => candidate.id === node.parentId);
    return parent ? this.getNodePosition(parent) : {
      x: 0,
      y: 0
    };
  }
  getNodeOrigin(node) {
    return node.origin ?? this.nodeOrigin;
  }
  constrainNodeAbsolutePosition(node, absolutePosition) {
    let snappedPosition = this.snapNodePosition(absolutePosition);
    let extent = this.getNodeAbsoluteExtent(node);
    if (!extent) {
      return this.roundPosition(snappedPosition);
    }
    return this.roundPosition(umdExports.clampPosition(snappedPosition, extent, {
      width: this.getNodeWidth(node),
      height: this.getNodeHeight(node)
    }));
  }
  getNodeAbsoluteExtent(node) {
    let parentPosition = this.getParentAbsolutePosition(node);
    if (node.extent === 'parent') {
      let parent = node.parentId ? this.currentSourceNodes.find(candidate => candidate.id === node.parentId) : undefined;
      if (!parent) {
        return null;
      }
      return [[parentPosition.x, parentPosition.y], [parentPosition.x + this.getNodeWidth(parent), parentPosition.y + this.getNodeHeight(parent)]];
    }
    if (umdExports.isCoordinateExtent(node.extent)) {
      if (!node.parentId) {
        return node.extent;
      }
      return [[node.extent[0][0] + parentPosition.x, node.extent[0][1] + parentPosition.y], [node.extent[1][0] + parentPosition.x, node.extent[1][1] + parentPosition.y]];
    }
    return umdExports.isCoordinateExtent(this.nodeExtent) ? this.nodeExtent : null;
  }
  setNodeDimensions(id, dimensions) {
    let rounded = {
      width: this.roundViewportValue(dimensions.width),
      height: this.roundViewportValue(dimensions.height)
    };
    this.nodeDimensions.set(id, rounded);
    this.syncInternalNodeGeometry(id);
    this.notifyNodeGeometryListeners(id);
    return rounded;
  }
  updateNodeInternals(nodeId) {
    let nodeIds = nodeId === undefined ? Array.from(this.nodeLookup.keys()) : Array.isArray(nodeId) ? nodeId : [nodeId];
    let didUpdate = false;
    for (let id of nodeIds) {
      let element = this.domNode?.querySelector(`.ember-flow__node[data-id="${this.escapeAttribute(id)}"]`);
      if (!element) {
        this.notifyNodeGeometryListeners(id);
        continue;
      }
      let width = element.offsetWidth;
      let height = element.offsetHeight;
      if (width > 0 && height > 0) {
        let currentNode = this.getNode(id);
        let currentWidth = currentNode ? this.getNodeWidth(currentNode) : 0;
        let currentHeight = currentNode ? this.getNodeHeight(currentNode) : 0;
        if (Math.abs(currentWidth - width) > 0.5 || Math.abs(currentHeight - height) > 0.5) {
          this.setNodeDimensions(id, {
            width,
            height
          });
          didUpdate = true;
        }
      }
      this.notifyNodeGeometryListeners(id);
    }
    if (didUpdate) {
      this.bump();
    }
  }
  moveSelectedNodes(direction, factor = 1) {
    let changes = [];
    let xVelocity = this.snapToGrid ? this.snapGrid[0] : 5;
    let yVelocity = this.snapToGrid ? this.snapGrid[1] : 5;
    let xDiff = direction.x * xVelocity * factor;
    let yDiff = direction.y * yVelocity * factor;
    for (let internalNode of this.nodeLookup.values()) {
      let userNode = internalNode.internals.userNode;
      let isSelected = internalNode.selected || this.selectedNodeIds.has(internalNode.id) || userNode.selected;
      let isDraggable = userNode.draggable ?? this.nodesDraggable;
      if (!isSelected || !isDraggable) {
        continue;
      }
      let nextPosition = {
        x: internalNode.internals.positionAbsolute.x + xDiff,
        y: internalNode.internals.positionAbsolute.y + yDiff
      };
      if (this.snapToGrid) {
        nextPosition = umdExports.snapPosition(nextPosition, this.snapGrid);
      }
      let {
        position,
        positionAbsolute
      } = umdExports.calculateNodePosition({
        nodeId: internalNode.id,
        nextPosition,
        nodeLookup: this.nodeLookup,
        nodeExtent: this.nodeExtent,
        nodeOrigin: this.nodeOrigin
      });
      let roundedPosition = this.roundPosition(position);
      let roundedAbsolutePosition = this.roundPosition(positionAbsolute);
      let currentPosition = this.getNodeUserPosition(userNode);
      if (currentPosition.x === roundedPosition.x && currentPosition.y === roundedPosition.y) {
        continue;
      }
      internalNode.position = roundedPosition;
      internalNode.internals.positionAbsolute = roundedAbsolutePosition;
      this.nodePositions.set(internalNode.id, roundedPosition);
      this.notifyNodeGeometryListeners(internalNode.id);
      changes.push({
        id: internalNode.id,
        type: 'position',
        position: roundedPosition
      });
    }
    if (changes.length > 0) {
      this.bump();
    }
    return changes;
  }
  getNodeWidth(node) {
    return this.nodeDimensions.get(node.id)?.width ?? node.width ?? node.initialWidth ?? node.measured?.width ?? 150;
  }
  getNodeHeight(node) {
    return this.nodeDimensions.get(node.id)?.height ?? node.height ?? node.initialHeight ?? node.measured?.height ?? 40;
  }
  getRenderedNodeBounds(node) {
    let position = this.getNodePosition(node);
    return {
      x: position.x,
      y: position.y,
      width: this.getNodeWidth(node),
      height: this.getNodeHeight(node)
    };
  }
  getRenderedNodesBounds(nodes = this.getNodes()) {
    if (nodes.length === 0) {
      return {
        x: 0,
        y: 0,
        width: 1,
        height: 1
      };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let node of nodes) {
      let bounds = this.getRenderedNodeBounds(node);
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    }
    return {
      x: minX,
      y: minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1)
    };
  }
  deleteSelectedElements({
    nodes,
    edges,
    nodesDeletable
  }) {
    let nodeChanges = [];
    let edgeChanges = [];
    if (nodesDeletable) {
      for (let id of [...this.selectedNodeIds]) {
        let node = nodes.find(candidate => candidate.id === id);
        if (!node || node.deletable === false) {
          continue;
        }
        this.deletedNodeIds.add(id);
        this.selectedNodeIds.delete(id);
        nodeChanges.push({
          id,
          type: 'remove'
        });
        for (let edge of edges) {
          if (edge.source === id || edge.target === id) {
            this.deletedEdgeIds.add(edge.id);
            this.selectedEdgeIds.delete(edge.id);
            edgeChanges.push({
              id: edge.id,
              type: 'remove'
            });
          }
        }
      }
    }
    for (let id of [...this.selectedEdgeIds]) {
      let edge = edges.find(candidate => candidate.id === id);
      if (!edge || edge.deletable === false) {
        continue;
      }
      this.deletedEdgeIds.add(id);
      this.selectedEdgeIds.delete(id);
      edgeChanges.push({
        id,
        type: 'remove'
      });
    }
    if (nodeChanges.length > 0 || edgeChanges.length > 0) {
      this.bump();
    }
    return {
      nodeChanges,
      edgeChanges
    };
  }
  async panBy(delta) {
    let changed = await umdExports.panBy({
      delta,
      panZoom: this.panZoom,
      transform: [this.viewport.x, this.viewport.y, this.viewport.zoom],
      translateExtent: this.translateExtent,
      width: this.width,
      height: this.height
    });
    if (!this.panZoom) {
      this.setViewport({
        x: this.viewport.x + delta.x,
        y: this.viewport.y + delta.y,
        zoom: this.viewport.zoom
      });
    }
    return changed;
  }
  setViewportDimensions(width, height) {
    if (this.width === width && this.height === height) {
      return;
    }
    this.width = width;
    this.height = height;
    this.bump();
  }
  setZoomExtent(minZoom, maxZoom) {
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
    this.panZoom?.setScaleExtent([minZoom, maxZoom]);
  }
  setInteractivity({
    nodesDraggable,
    nodesConnectable,
    elementsSelectable
  }) {
    let changed = false;
    if (nodesDraggable !== undefined && this.nodesDraggable !== nodesDraggable) {
      this.nodesDraggable = nodesDraggable;
      changed = true;
    }
    if (nodesConnectable !== undefined && this.nodesConnectable !== nodesConnectable) {
      this.nodesConnectable = nodesConnectable;
      changed = true;
    }
    if (elementsSelectable !== undefined && this.elementsSelectable !== elementsSelectable) {
      this.elementsSelectable = elementsSelectable;
      changed = true;
    }
    if (changed) {
      this.bump();
    }
  }
  get isInteractive() {
    return this.nodesDraggable || this.nodesConnectable || this.elementsSelectable;
  }
  toggleInteractivity() {
    let interactive = !this.isInteractive;
    this.setInteractivity({
      nodesDraggable: interactive,
      nodesConnectable: interactive,
      elementsSelectable: interactive
    });
    return interactive;
  }
  zoomBy(factor, options) {
    return this.panZoom?.scaleBy(factor, options) ?? Promise.resolve(false);
  }
  zoomIn(options) {
    return this.zoomBy(1.2, options);
  }
  zoomOut(options) {
    return this.zoomBy(1 / 1.2, options);
  }
  zoomTo(zoom, options) {
    return this.panZoom?.scaleTo(zoom, options) ?? Promise.resolve(false);
  }
  setZoom(zoom, options) {
    return this.zoomTo(zoom, options);
  }
  async setCenter(x, y, options) {
    if (!this.panZoom || this.width === 0 || this.height === 0) {
      return Promise.resolve(false);
    }
    let zoom = options?.zoom ?? this.maxZoom;
    await this.panZoom.setViewport({
      x: this.width / 2 - x * zoom,
      y: this.height / 2 - y * zoom,
      zoom
    }, {
      duration: options?.duration,
      ease: options?.ease,
      interpolate: options?.interpolate
    });
    return Promise.resolve(true);
  }
  async fitView(options) {
    if (!this.panZoom || this.width === 0 || this.height === 0) {
      return Promise.resolve(false);
    }
    let nodes = this.getFitViewNodes(options);
    if (nodes.length === 0) {
      return Promise.resolve(true);
    }
    let viewport = umdExports.getViewportForBounds(this.getRenderedNodesBounds(nodes), this.width, this.height, options?.minZoom ?? this.minZoom, options?.maxZoom ?? this.maxZoom, options?.padding ?? 0.1);
    let normalizedViewport = this.normalizeViewport({
      ...viewport,
      x: Math.round(viewport.x),
      y: Math.round(viewport.y)
    });
    await this.panZoom.setViewport(normalizedViewport, {
      duration: options?.duration,
      ease: options?.ease,
      interpolate: options?.interpolate
    });
    return Promise.resolve(true);
  }
  async fitBounds(bounds, options) {
    if (!this.panZoom || this.width === 0 || this.height === 0) {
      return Promise.resolve(false);
    }
    let viewport = umdExports.getViewportForBounds(bounds, this.width, this.height, this.minZoom, this.maxZoom, options?.padding ?? 0.1);
    await this.panZoom.setViewport(this.normalizeViewport(viewport), {
      duration: options?.duration,
      ease: options?.ease,
      interpolate: options?.interpolate
    });
    return Promise.resolve(true);
  }
  getFitViewNodes(options) {
    let optionNodeIds = options?.nodes ? new Set(options.nodes.map(node => node.id)) : null;
    return this.getNodes().filter(node => {
      if (!options?.includeHiddenNodes && node.hidden) {
        return false;
      }
      return !optionNodeIds || optionNodeIds.has(node.id);
    });
  }
  screenToFlowPosition(clientPosition, options = {}) {
    if (!this.domNode) {
      return clientPosition;
    }
    let {
      x: domX,
      y: domY
    } = this.domNode.getBoundingClientRect();
    let shouldSnap = options.snapToGrid ?? this.snapToGrid;
    let snapGrid = options.snapGrid ?? this.snapGrid;
    return umdExports.pointToRendererPoint({
      x: clientPosition.x - domX,
      y: clientPosition.y - domY
    }, [this.viewport.x, this.viewport.y, this.viewport.zoom], shouldSnap, snapGrid);
  }
  flowToScreenPosition(flowPosition) {
    if (!this.domNode) {
      return flowPosition;
    }
    let {
      x: domX,
      y: domY
    } = this.domNode.getBoundingClientRect();
    let rendererPosition = umdExports.rendererPointToPoint(flowPosition, [this.viewport.x, this.viewport.y, this.viewport.zoom]);
    return {
      x: rendererPosition.x + domX,
      y: rendererPosition.y + domY
    };
  }
  toObject(sourceNodes = this.currentSourceNodes, sourceEdges = this.currentSourceEdges) {
    return {
      nodes: this.getNodes(sourceNodes).map(node => ({
        ...node
      })),
      edges: this.getEdges(sourceEdges).map(edge => ({
        ...edge
      })),
      viewport: this.getViewport()
    };
  }
  reset(initialViewport) {
    this.selectedNodeIds.clear();
    this.selectedEdgeIds.clear();
    this.deletedNodeIds.clear();
    this.deletedEdgeIds.clear();
    this.pressedKeys.clear();
    this.nodePositions.clear();
    this.nodeDimensions.clear();
    this.addedNodes = [];
    this.addedEdges = [];
    this.nodeUpdates.clear();
    this.edgeUpdates.clear();
    this.sourceNodePositionKeys.clear();
    this.nodesOverride = undefined;
    this.edgesOverride = undefined;
    this.panZoom = null;
    this.viewport = initialViewport ?? {
      x: 0,
      y: 0,
      zoom: 1
    };
    this.notifyViewportListeners();
    this.bump();
  }
  bump() {
    this.revision++;
    this.notifyGraphListeners();
  }
  notifyGraphListeners() {
    for (let listener of this.graphListeners) {
      listener(this);
    }
  }
  normalizeViewport(viewport) {
    return {
      x: this.roundViewportValue(viewport.x),
      y: this.roundViewportValue(viewport.y),
      zoom: this.roundViewportValue(viewport.zoom)
    };
  }
  roundViewportValue(value) {
    return Math.round(value * 1000) / 1000;
  }
  roundPosition(position) {
    return {
      x: this.roundViewportValue(position.x),
      y: this.roundViewportValue(position.y)
    };
  }
  getNodeRect(nodeOrId) {
    let node = 'position' in nodeOrId ? nodeOrId : this.getNode(nodeOrId.id);
    return node ? this.getRenderedNodeBounds(node) : null;
  }
  notifyViewportListeners() {
    for (let listener of this.viewportListeners) {
      listener(this.viewport);
    }
  }
  notifyNodeGeometryListeners(nodeId) {
    for (let listener of this.nodeGeometryListeners) {
      listener(nodeId);
    }
  }
  escapeAttribute(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }
  syncInternalNodeGeometry(id, positionAbsolute) {
    let internalNode = this.nodeLookup.get(id);
    if (!internalNode) {
      return;
    }
    let dimensions = this.nodeDimensions.get(id);
    let position = this.nodePositions.get(id);
    let nextMeasured = dimensions === undefined ? internalNode.measured : {
      ...internalNode.measured,
      width: dimensions.width,
      height: dimensions.height
    };
    if (dimensions !== undefined) {
      internalNode.measured = nextMeasured;
      internalNode.width = dimensions.width;
      internalNode.height = dimensions.height;
    }
    if (position !== undefined) {
      internalNode.position = position;
      internalNode.internals.positionAbsolute = positionAbsolute ?? this.getNodePosition(internalNode.internals.userNode);
    }
    internalNode.internals.userNode = {
      ...internalNode.internals.userNode,
      ...(position !== undefined ? {
        position
      } : {}),
      ...(dimensions !== undefined ? {
        width: dimensions.width,
        height: dimensions.height,
        measured: nextMeasured
      } : {})
    };
  }
}, _descriptor$i = _applyDecoratedDescriptor(_class$i.prototype, "width", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor2$d = _applyDecoratedDescriptor(_class$i.prototype, "height", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor3$4 = _applyDecoratedDescriptor(_class$i.prototype, "nodesDraggable", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class$i.prototype, "nodesConnectable", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class$i.prototype, "elementsSelectable", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class$i.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class$i.prototype, "connection", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return umdExports.initialConnection;
  }
}), _class$i);

const alignXToPercent = {
  left: 0,
  center: 50,
  right: 100
};
const alignYToPercent = {
  top: 0,
  center: 50,
  bottom: 100
};
function getViewportOverlayTransform({
  x,
  y,
  zoom,
  offsetX = 0,
  offsetY = 0,
  alignX = 'center',
  alignY = 'center'
}) {
  return [`translate(${x}px, ${y}px)`, `scale(${1 / zoom})`, `translate(${offsetX}px, ${offsetY}px)`, `translate(${-(alignXToPercent[alignX] ?? 50)}%, ${-(alignYToPercent[alignY] ?? 50)}%)`].join(' ');
}

function getNativeEvent(event) {
  return 'nativeEvent' in event ? event.nativeEvent : event;
}
function createFlowEventScope() {
  let handledEvents = new WeakSet();
  return {
    markEventAsHandled(event) {
      handledEvents.add(getNativeEvent(event));
    },
    wasEventAlreadyHandled(event) {
      return handledEvents.has(getNativeEvent(event));
    }
  };
}
const defaultFlowEventScope = createFlowEventScope();
function markFlowEventAsHandled(event) {
  defaultFlowEventScope.markEventAsHandled(event);
}
function wasFlowEventHandled(event) {
  return defaultFlowEventScope.wasEventAlreadyHandled(event);
}
function isTextEntryElement(target) {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest(['input', 'textarea', 'select', '[contenteditable=""]', '[contenteditable="true"]', '[role="combobox"]', '[role="searchbox"]', '[role="spinbutton"]', '[role="textbox"]', '[data-flow-capture-keys="true"]', '[data-ember-flow-capture-keys="true"]'].join(',')));
}
function isFlowKeyboardEventCaptured(event) {
  return event.defaultPrevented || wasFlowEventHandled(event) || isTextEntryElement(event.target);
}

var _FlowEdge;
class FlowEdge extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleSourceReconnectPointerDown", event => {
      let fixedElement = event.currentTarget.parentElement?.querySelector('.ember-flow__edgeupdater-target');
      this.args.onReconnectPointerDown?.(this.args.edge, 'source', event, fixedElement ?? null);
    });
    _defineProperty(this, "handleTargetReconnectPointerDown", event => {
      let fixedElement = event.currentTarget.parentElement?.querySelector('.ember-flow__edgeupdater-source');
      this.args.onReconnectPointerDown?.(this.args.edge, 'target', event, fixedElement ?? null);
    });
    _defineProperty(this, "handleKeyDown", event => {
      if (this.args.disableKeyboardA11y || !this.isFocusable) {
        return;
      }
      this.args.onEdgeKeyDown?.(this.args.edge, event);
    });
    _defineProperty(this, "handleDoubleClick", event => {
      this.args.onEdgeDoubleClick?.(this.args.edge, event);
    });
    _defineProperty(this, "handleContextMenu", event => {
      this.args.onEdgeContextMenu?.(this.args.edge, event);
    });
    _defineProperty(this, "handleMouseEnter", event => {
      this.args.onEdgeMouseEnter?.(this.args.edge, event);
    });
    _defineProperty(this, "handleMouseMove", event => {
      this.args.onEdgeMouseMove?.(this.args.edge, event);
    });
    _defineProperty(this, "handleMouseLeave", event => {
      this.args.onEdgeMouseLeave?.(this.args.edge, event);
    });
  }
  get edgePathOptions() {
    return {
      getNodePosition: this.args.getNodePosition,
      getNodeWidth: this.args.getNodeWidth,
      getNodeHeight: this.args.getNodeHeight
    };
  }
  get edgeComponent() {
    return this.args.edgeComponent;
  }
  get pathData() {
    return getEdgePathData(this.args.edge, this.args.source, this.args.target, this.edgePathOptions);
  }
  get path() {
    return this.pathData[0];
  }
  get labelX() {
    return this.pathData[1];
  }
  get labelY() {
    return this.pathData[2];
  }
  get edgePosition() {
    return getEdgePosition(this.args.source, this.args.target, this.edgePathOptions);
  }
  get sourceX() {
    return this.edgePosition.sourceX;
  }
  get sourceY() {
    return this.edgePosition.sourceY;
  }
  get targetX() {
    return this.edgePosition.targetX;
  }
  get targetY() {
    return this.edgePosition.targetY;
  }
  get sourceAnchorX() {
    return this.shiftX(this.sourceX, this.reconnectRadius, this.edgePosition.sourcePosition);
  }
  get sourceAnchorY() {
    return this.shiftY(this.sourceY, this.reconnectRadius, this.edgePosition.sourcePosition);
  }
  get targetAnchorX() {
    return this.shiftX(this.targetX, this.reconnectRadius, this.edgePosition.targetPosition);
  }
  get targetAnchorY() {
    return this.shiftY(this.targetY, this.reconnectRadius, this.edgePosition.targetPosition);
  }
  get label() {
    let label = this.args.edge.label;
    return typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;
  }
  get hasLabel() {
    return Boolean(this.label);
  }
  get edgeClass() {
    let classes = ['ember-flow__edge'];
    if (this.args.edge.type) {
      classes.push(`ember-flow__edge-${this.args.edge.type}`);
    }
    if (this.args.edge.animated) {
      classes.push('animated');
    }
    if (this.args.edge.selected) {
      classes.push('selected');
    }
    if (this.args.edge.selectable !== false) {
      classes.push('selectable');
    }
    let edgeClass = this.args.edge.class ?? this.args.edge.className;
    if (edgeClass) {
      classes.push(edgeClass);
    }
    return classes.join(' ');
  }
  get edgeStyle() {
    return safeStyle(this.args.edge.style);
  }
  get labelStyle() {
    return safeStyle(this.args.edge.labelStyle);
  }
  get labelBgStyle() {
    return safeStyle(this.args.edge.labelBgStyle);
  }
  get labelTransform() {
    return `translate(${this.labelX} ${this.labelY})`;
  }
  get labelBgPadding() {
    return this.args.edge.labelBgPadding ?? [4, 2];
  }
  get labelBgWidth() {
    return Math.max((this.label?.length ?? 0) * 6.5 + this.labelBgPadding[0] * 2, 12);
  }
  get labelBgHeight() {
    return 14 + this.labelBgPadding[1] * 2;
  }
  get labelBgX() {
    return -this.labelBgWidth / 2;
  }
  get labelBgY() {
    return -this.labelBgHeight / 2;
  }
  get labelBgBorderRadius() {
    return this.args.edge.labelBgBorderRadius ?? 2;
  }
  get shouldShowLabelBg() {
    return this.args.edge.labelShowBg ?? true;
  }
  get svgStyle() {
    let zIndex = this.args.edge.zIndex ?? (this.args.source.parentId || this.args.target.parentId ? 1 : 0);
    return htmlSafe(`z-index: ${zIndex};`);
  }
  get interactionWidth() {
    return (this.args.edge.interactionWidth ?? 20) + 4;
  }
  get reconnectRadius() {
    return this.args.reconnectRadius ?? 10;
  }
  get reconnectable() {
    return this.args.edge.reconnectable ?? this.args.edgesReconnectable ?? false;
  }
  get isFocusable() {
    return this.args.edge.focusable ?? this.args.edgesFocusable ?? true;
  }
  get edgeRole() {
    return this.args.edge.ariaRole ?? (this.isFocusable ? 'group' : 'img');
  }
  get ariaLabel() {
    if (this.args.edge.ariaLabel === null) {
      return undefined;
    }
    return this.args.edge.ariaLabel ?? `Edge from ${this.args.edge.source} to ${this.args.edge.target}`;
  }
  get canReconnectSource() {
    return this.reconnectable === true || this.reconnectable === 'source';
  }
  get canReconnectTarget() {
    return this.reconnectable === true || this.reconnectable === 'target';
  }
  get markerStart() {
    return this.markerUrl(this.args.edge.markerStart);
  }
  get markerEnd() {
    return this.markerUrl(this.args.edge.markerEnd);
  }
  get isSelected() {
    return this.args.edge.selected ?? false;
  }
  markerUrl(marker) {
    if (!marker) {
      return undefined;
    }
    let type = typeof marker === 'string' ? marker : marker.type;
    return `url('#1__type=${type}')`;
  }
  shiftX(x, shift, position) {
    if (position === umdExports.Position.Left) {
      return x - shift;
    }
    if (position === umdExports.Position.Right) {
      return x + shift;
    }
    return x;
  }
  shiftY(y, shift, position) {
    if (position === umdExports.Position.Top) {
      return y - shift;
    }
    if (position === umdExports.Position.Bottom) {
      return y + shift;
    }
    return y;
  }
}
_FlowEdge = FlowEdge;
setComponentTemplate(precompileTemplate("<svg class=\"ember-flow__edge-wrapper\" style={{this.svgStyle}}>\n  <g class={{this.edgeClass}} id={{@edge.id}} data-id={{@edge.id}} data-testid=\"rf__edge-{{@edge.id}}\" role={{this.edgeRole}} tabindex={{if this.isFocusable \"0\"}} aria-roledescription=\"edge\" aria-label={{this.ariaLabel}} {{listen \"keydown\" this.handleKeyDown}} {{listen \"dblclick\" this.handleDoubleClick}} {{listen \"contextmenu\" this.handleContextMenu}} {{listen \"mouseenter\" this.handleMouseEnter}} {{listen \"mousemove\" this.handleMouseMove}} {{listen \"mouseleave\" this.handleMouseLeave}}>\n    {{#if this.isSelected}}\n      <path class=\"ember-flow__edge-selection\" d={{this.path}} />\n    {{/if}}\n    {{#if this.edgeComponent}}\n      <this.edgeComponent @id={{@edge.id}} @edge={{@edge}} @data={{@edge.data}} @type={{@edge.type}} @source={{@edge.source}} @target={{@edge.target}} @sourceHandleId={{@edge.sourceHandle}} @targetHandleId={{@edge.targetHandle}} @sourceX={{this.sourceX}} @sourceY={{this.sourceY}} @targetX={{this.targetX}} @targetY={{this.targetY}} @sourcePosition={{this.edgePosition.sourcePosition}} @targetPosition={{this.edgePosition.targetPosition}} @path={{this.path}} @labelX={{this.labelX}} @labelY={{this.labelY}} @label={{@edge.label}} @labelStyle={{@edge.labelStyle}} @labelShowBg={{@edge.labelShowBg}} @labelBgStyle={{@edge.labelBgStyle}} @labelBgPadding={{@edge.labelBgPadding}} @labelBgBorderRadius={{@edge.labelBgBorderRadius}} @markerStart={{this.markerStart}} @markerEnd={{this.markerEnd}} @style={{@edge.style}} @selected={{@edge.selected}} @animated={{@edge.animated}} @interactionWidth={{@edge.interactionWidth}} />\n    {{else}}\n      <path class=\"ember-flow__edge-path\" d={{this.path}} style={{this.edgeStyle}} marker-start={{this.markerStart}} marker-end={{this.markerEnd}} />\n      <path class=\"ember-flow__edge-interaction\" d={{this.path}} stroke-width={{this.interactionWidth}} />\n      {{#if this.hasLabel}}\n        <EdgeText @x={{this.labelX}} @y={{this.labelY}} @label={{this.label}} @labelStyle={{@edge.labelStyle}} @labelShowBg={{@edge.labelShowBg}} @labelBgStyle={{@edge.labelBgStyle}} @labelBgPadding={{@edge.labelBgPadding}} @labelBgBorderRadius={{@edge.labelBgBorderRadius}} />\n      {{/if}}\n    {{/if}}\n    {{#if this.canReconnectSource}}\n      <circle class=\"ember-flow__edgeupdater ember-flow__edgeupdater-source nopan nodrag\" cx={{this.sourceAnchorX}} cy={{this.sourceAnchorY}} r={{this.reconnectRadius}} stroke=\"transparent\" fill=\"transparent\" {{listen \"pointerdown\" this.handleSourceReconnectPointerDown}} />\n    {{/if}}\n    {{#if this.canReconnectTarget}}\n      <circle class=\"ember-flow__edgeupdater ember-flow__edgeupdater-target nopan nodrag\" cx={{this.targetAnchorX}} cy={{this.targetAnchorY}} r={{this.reconnectRadius}} stroke=\"transparent\" fill=\"transparent\" {{listen \"pointerdown\" this.handleTargetReconnectPointerDown}} />\n    {{/if}}\n  </g>\n</svg>", {
  strictMode: true,
  scope: () => ({
    listen,
    EdgeText
  })
}), _FlowEdge);

const nodeIdByElement = new WeakMap();
function registerNodeId(element, nodeId) {
  nodeIdByElement.set(element, nodeId);
}
function unregisterNodeId(element) {
  nodeIdByElement.delete(element);
}
function getNodeId(element) {
  let current = element;
  while (current) {
    let nodeId = nodeIdByElement.get(current);
    if (nodeId) {
      return nodeId;
    }
    current = current.parentElement;
  }
  return null;
}

var nodeContext = modifier((element, [nodeId]) => {
  registerNodeId(element, nodeId);
  return () => {
    unregisterNodeId(element);
  };
});

var _FlowNode;
class FlowNode extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleClick", event => {
      this.args.onNodeClick?.(this.args.node, event);
    });
    _defineProperty(this, "handleDoubleClick", event => {
      this.args.onNodeDoubleClick?.(this.args.node, event);
    });
    _defineProperty(this, "handleContextMenu", event => {
      this.args.onNodeContextMenu?.(this.args.node, event);
    });
    _defineProperty(this, "handlePointerDown", event => {
      this.args.onNodePointerDown?.(this.args.node, event);
    });
    _defineProperty(this, "handleKeyDown", event => {
      if (this.args.disableKeyboardA11y || !this.isFocusable) {
        return;
      }
      this.args.onNodeKeyDown?.(this.args.node, event);
    });
    _defineProperty(this, "handleTargetPointerDown", event => {
      this.args.onHandlePointerDown?.(this.args.node, 'target', event);
    });
    _defineProperty(this, "handleSourcePointerDown", event => {
      this.args.onHandlePointerDown?.(this.args.node, 'source', event);
    });
  }
  get nodeType() {
    return this.args.node.type ?? 'default';
  }
  get nodeClass() {
    return this.args.node.class ?? this.args.node.className ?? '';
  }
  get isDraggable() {
    return this.args.node.draggable ?? true;
  }
  get isSelectable() {
    return this.args.node.selectable ?? true;
  }
  get isSelected() {
    return this.args.node.selected ?? false;
  }
  get isConnectable() {
    return this.args.node.connectable ?? true;
  }
  get isFocusable() {
    return this.args.node.focusable ?? this.args.nodesFocusable ?? true;
  }
  get nodeRole() {
    return this.args.node.ariaRole ?? (this.isFocusable ? 'group' : undefined);
  }
  get nodeClasses() {
    let classes = ['ember-flow__node', `ember-flow__node-${this.nodeType}`, this.nodeClass];
    if (this.isDraggable) {
      classes.push('draggable', 'nopan');
    }
    if (this.isSelectable) {
      classes.push('selectable');
    }
    if (this.isSelected) {
      classes.push('selected');
    }
    return classes.filter(Boolean).join(' ');
  }
  get position() {
    return this.args.position ?? this.args.node.position;
  }
  get nodeStyle() {
    let {
      style
    } = this.args.node;
    let dimensions = [this.args.node.width !== undefined ? `width: ${this.args.node.width}px;` : undefined, this.args.node.height !== undefined ? `height: ${this.args.node.height}px;` : undefined].filter(Boolean).join(' ');
    return htmlSafe(`transform: translate(${this.position.x}px, ${this.position.y}px); ${dimensions} ${this.toCss(style)}`);
  }
  get label() {
    let label = this.args.node.data['label'];
    return typeof label === 'string' || typeof label === 'number' ? label : this.args.node.id;
  }
  get targetPosition() {
    return this.args.node.targetPosition ?? 'top';
  }
  get sourcePosition() {
    return this.args.node.sourcePosition ?? 'bottom';
  }
  get hasTargetHandle() {
    return !this.nodeComponent && this.nodeType !== 'input';
  }
  get hasSourceHandle() {
    return !this.nodeComponent && this.nodeType !== 'output';
  }
  get targetHandleClasses() {
    return this.handleClasses('target', this.targetPosition);
  }
  get sourceHandleClasses() {
    return this.handleClasses('source', this.sourcePosition);
  }
  get isDragHandleNode() {
    return this.nodeType === 'DragHandleNode';
  }
  get nodeComponent() {
    return this.args.nodeComponent;
  }
  toCss(style) {
    if (!style) {
      return '';
    }
    if (typeof style === 'string') {
      return style;
    }
    return Object.entries(style).filter(entry => entry[1] !== undefined).map(([property, value]) => `${property}: ${value};`).join(' ');
  }
  handleClasses(type, position) {
    return ['ember-flow__handle', `ember-flow__handle-${position}`, position, type, 'nodrag', 'nopan', this.isConnectable ? 'connectable' : undefined, this.isConnectable ? 'connectablestart' : undefined, this.isConnectable ? 'connectableend' : undefined, this.isConnectable ? 'connectionindicator' : undefined].filter(Boolean).join(' ');
  }
}
_FlowNode = FlowNode;
setComponentTemplate(precompileTemplate("<div class={{this.nodeClasses}} data-id={{@node.id}} style={{this.nodeStyle}} role={{this.nodeRole}} tabindex={{if this.isFocusable \"0\"}} aria-roledescription=\"node\" aria-label={{if @node.ariaLabel @node.ariaLabel @node.id}} {{nodeContext @node.id}} {{listen \"click\" this.handleClick}} {{listen \"dblclick\" this.handleDoubleClick}} {{listen \"contextmenu\" this.handleContextMenu}} {{listen \"pointerdown\" this.handlePointerDown}} {{listen \"keydown\" this.handleKeyDown}} ...attributes>\n  {{#if this.hasTargetHandle}}\n    <div class={{this.targetHandleClasses}} data-nodeid={{@node.id}} data-handlepos={{this.targetPosition}} data-handletype=\"target\" {{listen \"pointerdown\" this.handleTargetPointerDown}}></div>\n  {{/if}}\n  {{#if this.nodeComponent}}\n    <this.nodeComponent @node={{@node}} @id={{@node.id}} @data={{@node.data}} @type={{@node.type}} @width={{@node.width}} @height={{@node.height}} @sourcePosition={{@node.sourcePosition}} @targetPosition={{@node.targetPosition}} @dragHandle={{@node.dragHandle}} @parentId={{@node.parentId}} @selected={{@node.selected}} @draggable={{@node.draggable}} @selectable={{@node.selectable}} @deletable={{@node.deletable}} @dragging={{@node.dragging}} @zIndex={{@node.zIndex}} @isConnectable={{this.isConnectable}} @positionAbsoluteX={{this.position.x}} @positionAbsoluteY={{this.position.y}} />\n  {{else if this.isDragHandleNode}}\n    <div class=\"container\">\n      <div class=\"drag-handle custom-drag-handle\"></div>\n    </div>\n  {{else}}\n    {{this.label}}\n  {{/if}}\n  {{#if this.hasSourceHandle}}\n    <div class={{this.sourceHandleClasses}} data-nodeid={{@node.id}} data-handlepos={{this.sourcePosition}} data-handletype=\"source\" {{listen \"pointerdown\" this.handleSourcePointerDown}}></div>\n  {{/if}}\n</div>", {
  strictMode: true,
  scope: () => ({
    nodeContext,
    listen
  })
}), _FlowNode);

var _class$h, _descriptor$h, _EmberFlow;
const oppositePosition = {
  [umdExports.Position.Left]: umdExports.Position.Right,
  [umdExports.Position.Right]: umdExports.Position.Left,
  [umdExports.Position.Top]: umdExports.Position.Bottom,
  [umdExports.Position.Bottom]: umdExports.Position.Top
};
const arrowKeyDiffs = {
  ArrowUp: {
    x: 0,
    y: -1
  },
  ArrowDown: {
    x: 0,
    y: 1
  },
  ArrowLeft: {
    x: -1,
    y: 0
  },
  ArrowRight: {
    x: 1,
    y: 0
  }
};
const viewportRenderSettleDelay = 80;
let EmberFlow = (_class$h = (_EmberFlow = class EmberFlow extends Component {
  constructor(owner, args) {
    super(owner, args);
    _defineProperty(this, "store", void 0);
    _defineProperty(this, "rendererElement", null);
    _defineProperty(this, "viewportElement", null);
    _defineProperty(this, "selectionElement", null);
    _defineProperty(this, "connectionLineElement", null);
    _defineProperty(this, "connectionPathElement", null);
    _defineProperty(this, "resizeObserver", null);
    _defineProperty(this, "viewportDimensionsFrame", null);
    _defineProperty(this, "viewportRenderSettleTimeout", null);
    _defineProperty(this, "viewportRenderSettleFrame", null);
    _defineProperty(this, "onInitFrame", null);
    _defineProperty(this, "didFitView", false);
    _defineProperty(this, "didCallOnInit", false);
    _defineProperty(this, "didSetInitialInteractivity", false);
    _defineProperty(this, "pointerInsideFlow", false);
    _defineProperty(this, "suppressPaneClick", false);
    _defineProperty(this, "suppressNodeClick", false);
    _defineProperty(this, "suppressNodeClickFrame", null);
    _defineProperty(this, "unsubscribeViewportTransform", null);
    // Hot pointer interactions should stay off Ember's tracked render path while the
    // cursor is moving. Live movement mutates DOM/system mirrors directly; pointer-up
    // commits the public Ember model changes and bumps tracked state once.
    _defineProperty(this, "pendingSelectionFrame", null);
    _defineProperty(this, "pendingConnectionFrame", null);
    _defineProperty(this, "pendingConnectionAutoPanFrame", null);
    _defineProperty(this, "pendingNodeAutoPanFrame", null);
    _defineProperty(this, "connectionTargetHandleElement", null);
    _defineProperty(this, "activeNodeDrag", null);
    _defineProperty(this, "activeSelection", null);
    _defineProperty(this, "activeConnection", null);
    _defineProperty(this, "lastControlledViewport", null);
    _defineProperty(this, "activePanActivationKeyIds", new Set());
    _defineProperty(this, "panActivationKeyPressed", false);
    _defineProperty(this, "viewportDragging", false);
    _defineProperty(this, "panActivationCursorStyleElement", null);
    _initializerDefineProperty(this, "connectionRenderState", _descriptor$h, this);
    _defineProperty(this, "keydownHandler", null);
    _defineProperty(this, "keyupHandler", null);
    _defineProperty(this, "panActivationKeydownHandler", null);
    _defineProperty(this, "panActivationKeyupHandler", null);
    _defineProperty(this, "flowController", {
      startEdgeReconnect: (edge, handleType, event, fixedElement) => {
        this.handleEdgeReconnectPointerDown(edge, handleType, event, fixedElement ?? null);
      }
    });
    _defineProperty(this, "handleTransformChange", transform => {
      let viewport = {
        x: transform[0],
        y: transform[1],
        zoom: transform[2]
      };
      this.scheduleViewportRenderSettle();
      this.store.setViewportFromPanZoom(viewport);
      this.args.onViewportChange?.(this.store.viewport);
      if (this.args.onlyRenderVisibleElements) {
        this.store.bump();
      }
    });
    _defineProperty(this, "handlePanZoomStart", (event, viewport) => {
      this.markViewportTransforming();
      this.args.onMoveStart?.(event, viewport);
      this.args.onViewportChangeStart?.(viewport);
    });
    _defineProperty(this, "handlePanZoom", (event, viewport) => {
      this.args.onMove?.(event, viewport);
    });
    _defineProperty(this, "handlePanZoomEnd", (event, viewport) => {
      this.scheduleViewportRenderSettle();
      this.args.onMoveEnd?.(event, viewport);
      this.args.onViewportChangeEnd?.(viewport);
    });
    _defineProperty(this, "handlePanZoomDraggingChange", dragging => {
      this.viewportDragging = dragging;
      this.updatePanActivationClasses();
    });
    _defineProperty(this, "handleNodeClick", (node, event) => {
      if (this.suppressNodeClick) {
        this.suppressNodeClick = false;
        this.flushSuppressNodeClickFrame();
        return;
      }
      this.args.onNodeClick?.(event, node);
      if (!this.elementsSelectable || node.selectable === false || this.activeNodeDrag?.didMove) {
        return;
      }
      if (!event.shiftKey && !this.store.isMultiSelectionActive(this.multiSelectionKey)) {
        this.clearSelection();
      }
      this.selectNode(node.id);
    });
    _defineProperty(this, "handleNodeDoubleClick", (node, event) => {
      this.args.onNodeDoubleClick?.(event, node);
    });
    _defineProperty(this, "handleNodeContextMenu", (node, event) => {
      this.args.onNodeContextMenu?.(event, node);
    });
    _defineProperty(this, "handleEdgeClick", (edge, event) => {
      this.args.onEdgeClick?.(event, edge);
      if (!this.elementsSelectable || edge.selectable === false) {
        return;
      }
      event.stopPropagation();
      if (!event.shiftKey && !this.store.isMultiSelectionActive(this.multiSelectionKey)) {
        this.clearSelection();
      }
      this.selectEdge(edge.id);
    });
    _defineProperty(this, "handleEdgeDoubleClick", (edge, event) => {
      this.args.onEdgeDoubleClick?.(event, edge);
    });
    _defineProperty(this, "handleEdgeContextMenu", (edge, event) => {
      this.args.onEdgeContextMenu?.(event, edge);
    });
    _defineProperty(this, "handleEdgeMouseEnter", (edge, event) => {
      this.args.onEdgeMouseEnter?.(event, edge);
    });
    _defineProperty(this, "handleEdgeMouseMove", (edge, event) => {
      this.args.onEdgeMouseMove?.(event, edge);
    });
    _defineProperty(this, "handleEdgeMouseLeave", (edge, event) => {
      this.args.onEdgeMouseLeave?.(event, edge);
    });
    _defineProperty(this, "handleRendererClick", event => {
      if (wasFlowEventHandled(event)) {
        return;
      }
      if (this.suppressPaneClick) {
        this.suppressPaneClick = false;
        return;
      }
      let target = event.target;
      let edgeElement = target?.closest('.ember-flow__edge');
      if (edgeElement && this.rendererElement?.contains(edgeElement)) {
        let edgeId = edgeElement.dataset['id'];
        let edge = this.edges.find(candidate => candidate.id === edgeId);
        if (edge) {
          this.handleEdgeClick(edge, event);
          return;
        }
      }
      if (target?.closest('.ember-flow__node, .ember-flow__edge, .ember-flow__edge-label, .ember-flow__node-toolbar, .ember-flow__panel, .ember-flow__controls')) {
        return;
      }
      this.clearSelection();
      this.args.onPaneClick?.(event);
    });
    _defineProperty(this, "handlePaneMouseEnter", event => {
      this.args.onPaneMouseEnter?.(event);
    });
    _defineProperty(this, "handlePaneMouseMove", event => {
      if (wasFlowEventHandled(event)) {
        return;
      }
      this.args.onPaneMouseMove?.(event);
    });
    _defineProperty(this, "handlePaneMouseLeave", event => {
      this.args.onPaneMouseLeave?.(event);
    });
    _defineProperty(this, "handlePaneScroll", event => {
      if (wasFlowEventHandled(event)) {
        return;
      }
      this.args.onPaneScroll?.(event);
    });
    _defineProperty(this, "handlePaneContextMenu", event => {
      if (wasFlowEventHandled(event)) {
        return;
      }
      let target = event.target;
      let selectedNodes = this.store.selectedNodes;
      if (selectedNodes.length > 0 && target?.closest('.ember-flow__node')) {
        this.args.onSelectionContextMenu?.(event, selectedNodes);
        return;
      }
      if (target?.closest('.ember-flow__node, .ember-flow__edge, .ember-flow__edge-label, .ember-flow__node-toolbar, .ember-flow__panel, .ember-flow__controls')) {
        return;
      }
      this.args.onPaneContextMenu?.(event);
    });
    _defineProperty(this, "handleRendererPointerDown", event => {
      if (wasFlowEventHandled(event)) {
        return;
      }
      event.currentTarget?.closest('.ember-flow')?.focus({
        preventScroll: true
      });
    });
    _defineProperty(this, "handleRootPointerEnter", () => {
      this.pointerInsideFlow = true;
    });
    _defineProperty(this, "handleRootPointerLeave", () => {
      this.pointerInsideFlow = false;
    });
    _defineProperty(this, "handleNodePointerDown", (node, event) => {
      if (this.panActivationKeyPressed) {
        return;
      }
      if (!this.nodesDraggable || node.draggable === false || event.button !== 0) {
        return;
      }
      let target = event.target;
      let handle = target?.closest('.ember-flow__handle');
      if (handle) {
        let handleType = this.getHandleType(handle);
        if (handleType) {
          this.handleHandlePointerDown(node, handleType, event, handle);
        }
        return;
      }
      if (target?.closest('.nodrag')) {
        return;
      }
      if (node.dragHandle && !target?.closest(node.dragHandle)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      let nodePosition = this.store.getNodePosition(node);
      let pointerPosition = this.clientToFlowPosition(event.clientX, event.clientY);
      if (!pointerPosition) {
        return;
      }
      let startPositions = this.getNodeDragStartPositions(node);
      this.activeNodeDrag = {
        id: node.id,
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        currentClientX: event.clientX,
        currentClientY: event.clientY,
        currentEvent: null,
        pointerOffsetX: pointerPosition.x - nodePosition.x,
        pointerOffsetY: pointerPosition.y - nodePosition.y,
        startPrimaryPosition: nodePosition,
        startPositions,
        didMove: false,
        started: false,
        selectionDragStarted: false
      };
      for (let id of startPositions.keys()) {
        this.nodeElement(id)?.classList.add('dragging');
      }
      window.addEventListener('pointermove', this.handleWindowNodePointerMove);
      window.addEventListener('pointerup', this.handleWindowNodePointerUp);
      window.addEventListener('pointercancel', this.handleWindowNodePointerUp);
    });
    _defineProperty(this, "handleNodeKeyDown", (node, event) => {
      if (this.isPanActivationKeyEvent(event)) {
        return;
      }
      if (!this.shouldHandleElementSelectionKey(event) || node.selectable === false) {
        return;
      }
      event.preventDefault();
      if (event.key === 'Escape') {
        this.clearSelection();
        event.currentTarget?.blur();
        return;
      }
      if (!this.store.isMultiSelectionActive(this.multiSelectionKey)) {
        this.clearSelection();
      }
      this.selectNode(node.id);
    });
    _defineProperty(this, "handlePanePointerDown", event => {
      if (wasFlowEventHandled(event)) {
        return;
      }
      if (!this.shouldStartSelection(event)) {
        return;
      }
      let renderer = this.rendererElement;
      if (!renderer) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      let rect = renderer.getBoundingClientRect();
      this.activeSelection = {
        startX: event.clientX - rect.left,
        startY: event.clientY - rect.top,
        currentX: event.clientX - rect.left,
        currentY: event.clientY - rect.top
      };
      this.args.onSelectionStart?.(event);
      this.renderSelectionRect();
      window.addEventListener('pointermove', this.handleWindowSelectionPointerMove);
      window.addEventListener('pointerup', this.handleWindowSelectionPointerUp);
      window.addEventListener('pointercancel', this.handleWindowSelectionPointerUp);
    });
    _defineProperty(this, "handleHandlePointerDown", (node, handleType, event, handleElement) => {
      if (this.panActivationKeyPressed) {
        return;
      }
      if (!this.nodesConnectable || node.connectable === false || event.button !== 0) {
        return;
      }
      let renderer = this.rendererElement;
      let handle = handleElement ?? event.currentTarget;
      if (!renderer || !handle) {
        return;
      }
      if (!this.canStartConnection(handle)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      let rendererRect = renderer.getBoundingClientRect();
      let handleRect = handle.getBoundingClientRect();
      let fromX = handleRect.left + handleRect.width / 2 - rendererRect.left;
      let fromY = handleRect.top + handleRect.height / 2 - rendererRect.top;
      let fromPosition = this.getHandlePosition(handle, handleType === 'source' ? umdExports.Position.Bottom : umdExports.Position.Top);
      this.activeConnection = {
        nodeId: node.id,
        handleId: this.getHandleId(handle),
        handleType,
        pointerId: event.pointerId,
        currentEvent: null,
        fromElement: handle,
        fromPosition,
        fromX,
        fromY,
        toPosition: oppositePosition[fromPosition],
        toX: event.clientX - rendererRect.left,
        toY: event.clientY - rendererRect.top,
        targetHandle: null,
        isValid: null,
        startClientX: event.clientX,
        startClientY: event.clientY
      };
      this.store.setConnection(this.getConnectionState(this.activeConnection));
      this.args.onConnectStart?.(event, {
        nodeId: node.id,
        handleId: this.getHandleId(handle),
        handleType
      });
      if (this.connectionDragThreshold <= 1) {
        this.renderConnectionLine();
      }
      window.addEventListener('pointermove', this.handleWindowConnectionPointerMove);
      window.addEventListener('pointerup', this.handleWindowConnectionPointerUp);
      window.addEventListener('pointercancel', this.handleWindowConnectionPointerUp);
    });
    _defineProperty(this, "handleEdgeReconnectPointerDown", (edge, handleType, event, fixedElement) => {
      if (!this.args.onReconnect || event.button !== 0) {
        return;
      }
      let renderer = this.rendererElement;
      let reconnectingSource = handleType === 'source';
      let fixedHandleType = reconnectingSource ? 'target' : 'source';
      let fixedNodeId = reconnectingSource ? edge.target : edge.source;
      let fixedHandleId = reconnectingSource ? edge.targetHandle ?? null : edge.sourceHandle ?? null;
      let fixed = fixedElement ?? this.findHandleElement(fixedNodeId, fixedHandleType, fixedHandleId);
      if (!renderer || !fixed) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      let rendererRect = renderer.getBoundingClientRect();
      let fixedRect = fixed.getBoundingClientRect();
      let fromX = fixedRect.left + fixedRect.width / 2 - rendererRect.left;
      let fromY = fixedRect.top + fixedRect.height / 2 - rendererRect.top;
      let fromPosition = this.getHandlePosition(fixed, fixedHandleType === 'source' ? umdExports.Position.Bottom : umdExports.Position.Top);
      this.activeConnection = {
        nodeId: fixedNodeId,
        handleId: fixedHandleId,
        handleType: fixedHandleType,
        pointerId: event.pointerId,
        currentEvent: null,
        fromElement: fixed,
        fromPosition,
        fromX,
        fromY,
        toPosition: oppositePosition[fromPosition],
        toX: event.clientX - rendererRect.left,
        toY: event.clientY - rendererRect.top,
        targetHandle: null,
        isValid: null,
        startClientX: event.clientX,
        startClientY: event.clientY,
        reconnect: {
          edge: edge,
          handleType
        }
      };
      this.store.setConnection(this.getConnectionState(this.activeConnection));
      this.args.onConnectStart?.(event, {
        nodeId: fixedNodeId,
        handleId: fixedHandleId,
        handleType: fixedHandleType
      });
      this.args.onReconnectStart?.(event, edge, handleType);
      if (this.connectionDragThreshold <= 1) {
        this.renderConnectionLine();
      }
      window.addEventListener('pointermove', this.handleWindowConnectionPointerMove);
      window.addEventListener('pointerup', this.handleWindowConnectionPointerUp);
      window.addEventListener('pointercancel', this.handleWindowConnectionPointerUp);
    });
    _defineProperty(this, "handleEdgeReconnectEvent", event => {
      let detail = event.detail;
      if (!detail) {
        return;
      }
      this.handleEdgeReconnectPointerDown(detail.edge, detail.handleType, detail.pointerEvent, detail.fixedElement ?? null);
    });
    _defineProperty(this, "handleWindowNodePointerMove", event => {
      let drag = this.activeNodeDrag;
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }
      drag.currentClientX = event.clientX;
      drag.currentClientY = event.clientY;
      drag.currentEvent = event;
      if (Math.abs(event.clientX - drag.startClientX) > 1 || Math.abs(event.clientY - drag.startClientY) > 1) {
        drag.didMove = true;
      }
      if (!drag.didMove) {
        return;
      }
      this.applyActiveNodeDrag();
    });
    _defineProperty(this, "handleWindowNodePointerUp", event => {
      let drag = this.activeNodeDrag;
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }
      for (let id of drag.startPositions.keys()) {
        this.nodeElement(id)?.classList.remove('dragging');
      }
      if (drag.didMove) {
        this.args.onNodesChange?.(Array.from(drag.startPositions.keys()).map(id => ({
          id,
          type: 'position',
          position: this.store.nodePositions.get(id)
        })));
        this.store.bump();
        this.scheduleSuppressNodeClick();
      }
      let node = this.store.getNode(drag.id);
      if (node && drag.started) {
        this.args.onNodeDragStop?.(event, node);
      }
      if (drag.selectionDragStarted) {
        this.args.onSelectionDragStop?.(event, this.getDraggedNodes(drag));
      }
      this.detachNodeDragListeners();
    });
    _defineProperty(this, "handleEdgeKeyDown", (edge, event) => {
      if (!this.shouldHandleElementSelectionKey(event) || edge.selectable === false) {
        return;
      }
      event.preventDefault();
      if (event.key === 'Escape') {
        this.clearSelection();
        event.currentTarget?.blur();
        return;
      }
      if (!this.store.isMultiSelectionActive(this.multiSelectionKey)) {
        this.clearSelection();
      }
      this.selectEdge(edge.id);
    });
    _defineProperty(this, "handleWindowSelectionPointerMove", event => {
      let selection = this.activeSelection;
      let renderer = this.rendererElement;
      if (!selection || !renderer) {
        return;
      }
      let rect = renderer.getBoundingClientRect();
      selection.currentX = event.clientX - rect.left;
      selection.currentY = event.clientY - rect.top;
      this.scheduleSelectionFrame();
    });
    _defineProperty(this, "handleWindowSelectionPointerUp", event => {
      let selection = this.activeSelection;
      let renderer = this.rendererElement;
      if (!selection || !renderer) {
        this.detachSelectionListeners();
        return;
      }
      this.flushPendingSelectionFrame();
      let rendererRect = renderer.getBoundingClientRect();
      let x = Math.min(selection.startX, selection.currentX);
      let y = Math.min(selection.startY, selection.currentY);
      let width = Math.abs(selection.currentX - selection.startX);
      let height = Math.abs(selection.currentY - selection.startY);
      let selectionRect = {
        left: rendererRect.left + x,
        right: rendererRect.left + x + width,
        top: rendererRect.top + y,
        bottom: rendererRect.top + y + height
      };
      this.clearSelection();
      for (let node of this.nodes) {
        if (node.selectable === false) {
          continue;
        }
        let element = this.nodeElement(node.id);
        if (!element) {
          continue;
        }
        let nodeRect = element.getBoundingClientRect();
        if (this.isNodeInsideSelection(nodeRect, selectionRect)) {
          this.selectNode(node.id);
        }
      }
      this.suppressPaneClick = true;
      this.args.onSelectionEnd?.(event);
      this.detachSelectionListeners();
    });
    _defineProperty(this, "handleWindowConnectionPointerMove", event => {
      let connection = this.activeConnection;
      let renderer = this.rendererElement;
      if (!connection || !renderer || event.pointerId !== connection.pointerId) {
        return;
      }
      connection.currentEvent = event;
      if (!this.hasConnectionExceededThreshold(connection, event)) {
        return;
      }
      this.updateConnectionTargetFromEvent(event);
      this.store.setConnection(this.getConnectionState(connection, event));
      this.scheduleConnectionFrame();
      this.scheduleConnectionAutoPan();
    });
    _defineProperty(this, "handleWindowConnectionPointerUp", event => {
      let connection = this.activeConnection;
      if (!connection || event.pointerId !== connection.pointerId) {
        return;
      }
      if (!this.hasConnectionExceededThreshold(connection, event)) {
        this.args.onConnectEnd?.(event, this.getFinalConnectionState(connection, event, null, false));
        this.detachConnectionListeners();
        return;
      }
      this.flushPendingConnectionFrame();
      let candidate = this.findConnectionCandidate(event);
      let target = document.elementFromPoint(event.clientX, event.clientY);
      let targetHandle = target?.closest('.ember-flow__handle');
      let finalTargetHandle = connection.targetHandle ?? candidate?.handle ?? targetHandle;
      let completed = this.completeConnection(finalTargetHandle);
      let finalConnectionState = this.getFinalConnectionState(connection, event, finalTargetHandle, completed);
      this.args.onConnectEnd?.(event, finalConnectionState);
      if (connection.reconnect) {
        this.args.onReconnectEnd?.(event, connection.reconnect.edge, connection.reconnect.handleType, finalConnectionState);
      }
      this.detachConnectionListeners();
    });
    _defineProperty(this, "handleKeyDown", event => {
      this.store.addPressedKey(event.key);
      if (!isFlowKeyboardEventCaptured(event) && !umdExports.isInputDOMNode(event) && this.isPanActivationKeyEvent(event)) {
        event.preventDefault();
        this.setPanActivationKeyPressed(event, true);
      }
      if (umdExports.isInputDOMNode(event) || isFlowKeyboardEventCaptured(event) || this.args.disableKeyboardA11y) {
        return;
      }
      if (event.key !== this.deleteKey) {
        this.moveSelectedNodesWithKeyboard(event);
        return;
      }
      event.preventDefault();
      void this.deleteSelectedElements();
    });
    _defineProperty(this, "handleKeyUp", event => {
      this.store.removePressedKey(event.key);
      this.setPanActivationKeyPressed(event, false);
    });
    _defineProperty(this, "handlePanActivationKeyDownCapture", event => {
      if (!this.shouldHandlePanActivationKeyboardEvent(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.setPanActivationKeyPressed(event, true);
    });
    _defineProperty(this, "handlePanActivationKeyUpCapture", event => {
      if (!this.isPanActivationKeyEvent(event) || !this.panActivationKeyPressed && !this.shouldHandlePanActivationKeyboardEvent(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.setPanActivationKeyPressed(event, false);
    });
    _defineProperty(this, "handleRootKeyDown", event => {
      if (umdExports.isInputDOMNode(event) || isFlowKeyboardEventCaptured(event) || !this.isPanActivationKeyEvent(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.setPanActivationKeyPressed(event, true);
    });
    _defineProperty(this, "handleRootKeyUp", event => {
      if (!this.isPanActivationKeyEvent(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.setPanActivationKeyPressed(event, false);
    });
    _defineProperty(this, "handleNodeResize", event => {
      event.stopPropagation();
      if (event.detail.resizing) {
        this.applyNodeResize(event.detail, false);
        return;
      }
      this.applyNodeResize(event.detail, true);
    });
    _defineProperty(this, "nodeComponentFor", node => {
      let type = node.type;
      return type ? this.args.nodeTypes?.[type] : undefined;
    });
    _defineProperty(this, "edgeComponentFor", edge => {
      let type = edge.type;
      return type ? this.args.edgeTypes?.[type] : undefined;
    });
    _defineProperty(this, "nodePositionFor", node => {
      return this.getLiveNodePosition(node);
    });
    _defineProperty(this, "nodeWidthFor", node => {
      return this.store.getNodeWidth(node);
    });
    _defineProperty(this, "nodeHeightFor", node => {
      return this.store.getNodeHeight(node);
    });
    this.store = args.store ?? new EmberFlowStore(args.viewport ?? args.initialViewport);
    this.configureStorePlacement();
    this.configureStoreCallbacks();
  }
  get nodes() {
    return this.store.getNodes(this.args.nodes ?? this.args.defaultNodes ?? []);
  }
  get edges() {
    return this.store.getEdges(this.args.edges ?? this.args.defaultEdges ?? []).map(edge => this.applyDefaultEdgeOptions(edge));
  }
  get minZoom() {
    return this.args.minZoom ?? 0.5;
  }
  get maxZoom() {
    return this.args.maxZoom ?? 2;
  }
  get nodesDraggable() {
    return this.store.nodesDraggable;
  }
  get elementsSelectable() {
    return this.store.elementsSelectable;
  }
  get nodesConnectable() {
    return this.store.nodesConnectable;
  }
  get nodesFocusable() {
    return this.args.nodesFocusable ?? true;
  }
  get edgesFocusable() {
    return this.args.edgesFocusable ?? true;
  }
  get deleteKey() {
    let deleteKeyCode = this.args.deleteKeyCode;
    return this.args.deleteKey ?? (Array.isArray(deleteKeyCode) ? deleteKeyCode[0] : deleteKeyCode) ?? 'Backspace';
  }
  get multiSelectionKey() {
    return this.args.multiSelectionKey ?? this.args.multiSelectionKeyCode;
  }
  get selectionKey() {
    return this.args.selectionKey ?? this.args.selectionKeyCode;
  }
  get panActivationKey() {
    return this.args.panActivationKey ?? this.args.panActivationKeyCode ?? 'Space';
  }
  get edgesReconnectable() {
    return this.args.edgesReconnectable ?? Boolean(this.args.onReconnect);
  }
  get reconnectRadius() {
    return this.args.reconnectRadius ?? 10;
  }
  get connectionMode() {
    return this.args.connectionMode ?? umdExports.ConnectionMode.Strict;
  }
  get connectionRadius() {
    return this.args.connectionRadius ?? 20;
  }
  get connectionDragThreshold() {
    return this.args.connectionDragThreshold ?? 1;
  }
  get selectionMode() {
    return this.args.selectionMode ?? umdExports.SelectionMode.Full;
  }
  get defaultEdgeOptions() {
    return this.args.defaultEdgeOptions ?? {};
  }
  get connectionLineComponent() {
    return this.args.connectionLineComponent;
  }
  get rootClasses() {
    let classes = ['ember-flow', 'ember-flow__container'];
    if (this.args.colorMode === 'dark') {
      classes.push('dark');
    }
    if (this.panActivationKeyPressed) {
      classes.push('pan-activation');
    }
    if (this.viewportDragging) {
      classes.push('panning');
    }
    return classes.join(' ');
  }
  get rootStyle() {
    let declarations = [];
    if (this.args.width !== undefined) {
      declarations.push(`width: ${this.toCssSize(this.args.width)}`);
    }
    if (this.args.height !== undefined) {
      declarations.push(`height: ${this.toCssSize(this.args.height)}`);
    }
    return declarations.length > 0 ? htmlSafe(declarations.join('; ')) : undefined;
  }
  get viewportStyle() {
    return htmlSafe(this.getViewportTransform(this.store.viewport));
  }
  get connectionLineInitialStyle() {
    return htmlSafe(`display: none; ${toCss(this.args.connectionLineContainerStyle)}`);
  }
  get connectionLinePathStyle() {
    return safeStyle(this.args.connectionLineStyle);
  }
  get edgeItems() {
    let nodesById = new Map(this.nodes.map(node => [node.id, node]));
    return this.edges.map(edge => {
      let source = nodesById.get(edge.source);
      let target = nodesById.get(edge.target);
      if (!source || !target || edge.hidden || !this.shouldRenderEdge(edge)) {
        return null;
      }
      return {
        edge,
        source,
        target
      };
    }).filter(item => item !== null);
  }
  get renderedNodes() {
    let nodes = this.nodes;
    if (!this.args.onlyRenderVisibleElements || this.store.width === 0 || this.store.height === 0) {
      return nodes;
    }
    return nodes.filter(node => this.isRenderedNodeVisible(node));
  }
  isRenderedNodeVisible(node) {
    if (node.hidden) {
      return false;
    }
    let bounds = this.store.getRenderedNodeBounds(node);
    let viewport = this.store.viewport;
    let viewRect = {
      x: -viewport.x / viewport.zoom,
      y: -viewport.y / viewport.zoom,
      width: this.store.width / viewport.zoom,
      height: this.store.height / viewport.zoom
    };
    return bounds.x <= viewRect.x + viewRect.width && bounds.x + bounds.width >= viewRect.x && bounds.y <= viewRect.y + viewRect.height && bounds.y + bounds.height >= viewRect.y;
  }
  shouldRenderEdge(edge) {
    if (!this.args.onlyRenderVisibleElements || this.store.width === 0 || this.store.height === 0) {
      return true;
    }
    let sourceNode = this.store.nodeLookup.get(edge.source);
    let targetNode = this.store.nodeLookup.get(edge.target);
    return Boolean(sourceNode && targetNode && umdExports.isEdgeVisible({
      sourceNode,
      targetNode,
      width: this.store.width,
      height: this.store.height,
      transform: [this.store.viewport.x, this.store.viewport.y, this.store.viewport.zoom]
    }));
  }
  applyDefaultEdgeOptions(edge) {
    return {
      ...this.defaultEdgeOptions,
      ...edge
    };
  }
  installPanZoom(element) {
    this.rendererElement = element;
    this.viewportElement = element.querySelector('.ember-flow__viewport');
    this.selectionElement = element.querySelector('.ember-flow__selection');
    this.connectionLineElement = element.querySelector('.ember-flow__connectionline');
    this.connectionPathElement = element.querySelector('.ember-flow__connection-path');
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleViewportDimensionsUpdate();
    });
    this.resizeObserver.observe(element);
    this.store.domNode = element;
    this.syncArgs();
    if (!this.didSetInitialInteractivity) {
      this.didSetInitialInteractivity = true;
      this.store.setInteractivity({
        nodesDraggable: this.args.nodesDraggable ?? true,
        nodesConnectable: this.args.nodesConnectable ?? true,
        elementsSelectable: this.args.elementsSelectable ?? true
      });
    }
    this.unsubscribeViewportTransform?.();
    this.unsubscribeViewportTransform = this.store.onViewportChange(viewport => {
      this.applyViewportTransform(viewport);
    });
    this.keydownHandler = this.handleKeyDown;
    this.keyupHandler = this.handleKeyUp;
    this.panActivationKeydownHandler = this.handlePanActivationKeyDownCapture;
    this.panActivationKeyupHandler = this.handlePanActivationKeyUpCapture;
    window.addEventListener('keydown', this.panActivationKeydownHandler, true);
    window.addEventListener('keyup', this.panActivationKeyupHandler, true);
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
    this.store.panZoom = umdExports.XYPanZoom({
      domNode: element,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.store.translateExtent,
      viewport: this.store.viewport,
      onPanZoomStart: this.handlePanZoomStart,
      onPanZoom: this.handlePanZoom,
      onPanZoomEnd: this.handlePanZoomEnd,
      onDraggingChange: this.handlePanZoomDraggingChange
    });
    let currentViewport = this.store.panZoom.getViewport();
    if (currentViewport.x !== this.store.viewport.x || currentViewport.y !== this.store.viewport.y || currentViewport.zoom !== this.store.viewport.zoom) {
      this.handleTransformChange([currentViewport.x, currentViewport.y, currentViewport.zoom]);
    }
    this.updatePanZoomOptions();
    this.scheduleViewportDimensionsUpdate();
    this.scheduleOnInit();
    if (this.args.fitView && !this.didFitView) {
      this.didFitView = true;
      requestAnimationFrame(() => {
        this.measureRenderedNodes();
        this.store.setViewportDimensions(element.clientWidth, element.clientHeight);
        void this.store.fitView(this.args.fitViewOptions);
      });
    }
  }
  syncArgs() {
    this.store.setZoomExtent(this.minZoom, this.maxZoom);
    this.configureStorePlacement();
    this.configureStoreCallbacks();
    this.syncControlledViewport();
    this.updatePanZoomOptions();
  }
  updatePanZoomOptions() {
    let panActivationActive = this.panActivationKeyPressed;
    let panOnDrag = panActivationActive ? true : this.args.panOnDrag ?? true;
    let panOnScroll = panActivationActive ? true : this.args.panOnScroll ?? false;
    this.store.panZoom?.update({
      noWheelClassName: 'nowheel',
      noPanClassName: panActivationActive ? 'ember-flow__pan-activation-no-pan-disabled' : 'nopan',
      onPaneContextMenu: this.args.onPaneContextMenu,
      userSelectionActive: false,
      panOnScroll,
      panOnDrag,
      panOnScrollMode: this.args.panOnScrollMode ?? umdExports.PanOnScrollMode.Free,
      panOnScrollSpeed: this.args.panOnScrollSpeed ?? 0.5,
      preventScrolling: this.args.preventScrolling ?? true,
      zoomOnPinch: this.args.zoomOnPinch ?? true,
      zoomOnScroll: this.args.zoomOnScroll ?? true,
      zoomOnDoubleClick: this.args.zoomOnDoubleClick ?? true,
      zoomActivationKeyPressed: false,
      lib: 'ember',
      onTransformChange: this.handleTransformChange,
      connectionInProgress: false,
      paneClickDistance: this.args.paneClickDistance ?? 1,
      selectionOnDrag: !panActivationActive && (this.args.selectionOnDrag ?? false)
    });
  }
  syncControlledViewport() {
    let viewport = this.args.viewport;
    if (!viewport) {
      this.lastControlledViewport = null;
      return;
    }
    let key = `${viewport.x}:${viewport.y}:${viewport.zoom}`;
    if (key !== this.lastControlledViewport) {
      this.lastControlledViewport = key;
      void this.store.setViewport(viewport);
    }
  }
  uninstallPanZoom() {
    if (this.onInitFrame !== null) {
      cancelAnimationFrame(this.onInitFrame);
      this.onInitFrame = null;
    }
    if (this.viewportDimensionsFrame !== null) {
      cancelAnimationFrame(this.viewportDimensionsFrame);
      this.viewportDimensionsFrame = null;
    }
    if (this.viewportRenderSettleTimeout !== null) {
      clearTimeout(this.viewportRenderSettleTimeout);
      this.viewportRenderSettleTimeout = null;
    }
    if (this.viewportRenderSettleFrame !== null) {
      cancelAnimationFrame(this.viewportRenderSettleFrame);
      this.viewportRenderSettleFrame = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.store.panZoom?.destroy();
    this.store.panZoom = null;
    this.rendererElement = null;
    this.viewportElement = null;
    this.selectionElement = null;
    this.connectionLineElement = null;
    this.connectionPathElement = null;
    this.activePanActivationKeyIds.clear();
    this.panActivationKeyPressed = false;
    this.viewportDragging = false;
    this.pointerInsideFlow = false;
    this.clearPanActivationCursor();
    this.store.domNode = null;
    this.unsubscribeViewportTransform?.();
    this.unsubscribeViewportTransform = null;
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.keyupHandler) {
      window.removeEventListener('keyup', this.keyupHandler);
      this.keyupHandler = null;
    }
    if (this.panActivationKeydownHandler) {
      window.removeEventListener('keydown', this.panActivationKeydownHandler, true);
      this.panActivationKeydownHandler = null;
    }
    if (this.panActivationKeyupHandler) {
      window.removeEventListener('keyup', this.panActivationKeyupHandler, true);
      this.panActivationKeyupHandler = null;
    }
    this.detachNodeDragListeners();
    this.detachSelectionListeners();
    this.detachConnectionListeners();
  }
  markViewportTransforming() {
    this.viewportElement?.classList.add('is-transforming');
  }
  scheduleViewportRenderSettle() {
    this.markViewportTransforming();
    if (this.viewportRenderSettleTimeout !== null) {
      clearTimeout(this.viewportRenderSettleTimeout);
    }
    this.viewportRenderSettleTimeout = setTimeout(() => {
      this.viewportRenderSettleTimeout = null;
      if (this.viewportRenderSettleFrame !== null) {
        cancelAnimationFrame(this.viewportRenderSettleFrame);
      }
      this.viewportRenderSettleFrame = requestAnimationFrame(() => {
        this.viewportRenderSettleFrame = null;
        let viewport = this.viewportElement;
        if (!viewport) {
          return;
        }
        viewport.classList.remove('is-transforming');
        // Dropping the temporary compositor hint and forcing a layout read lets the browser
        // re-rasterize DOM node content at the settled zoom instead of keeping a scaled layer.
        void viewport.offsetHeight;
      });
    }, viewportRenderSettleDelay);
  }
  updateViewportDimensions() {
    let element = this.rendererElement;
    if (!element) {
      return;
    }
    this.store.setViewportDimensions(element.clientWidth, element.clientHeight);
  }
  scheduleViewportDimensionsUpdate(attempt = 0) {
    if (this.viewportDimensionsFrame !== null) {
      cancelAnimationFrame(this.viewportDimensionsFrame);
    }
    this.viewportDimensionsFrame = requestAnimationFrame(() => {
      this.viewportDimensionsFrame = null;
      this.updateViewportDimensions();
      this.measureRenderedNodes();
      if ((this.store.width === 0 || this.store.height === 0) && attempt < 10) {
        this.scheduleViewportDimensionsUpdate(attempt + 1);
      }
    });
  }
  configureStorePlacement() {
    this.store.zIndexMode = this.args.zIndexMode ?? 'basic';
    this.store.elevateNodesOnSelect = this.args.elevateNodesOnSelect ?? true;
    this.store.setNodeOrigin(this.args.nodeOrigin ?? [0, 0]);
    this.store.setNodeExtent(this.args.nodeExtent ?? umdExports.infiniteExtent);
    this.store.setTranslateExtent(this.args.translateExtent ?? umdExports.infiniteExtent);
    this.store.setSnapGrid(this.args.snapToGrid ?? false, this.args.snapGrid ?? [15, 15]);
    this.store.setAutoPanOptions({
      autoPanOnNodeDrag: this.args.autoPanOnNodeDrag,
      autoPanOnConnect: this.args.autoPanOnConnect,
      autoPanSpeed: this.args.autoPanSpeed
    });
  }
  configureStoreCallbacks() {
    this.store.setDeleteCallbacks({
      onBeforeDelete: this.args.onBeforeDelete,
      onNodesDelete: this.args.onNodesDelete,
      onEdgesDelete: this.args.onEdgesDelete,
      onDelete: this.args.onDelete
    });
    this.store.setCancelConnectionCallback(() => this.cancelConnection());
  }
  scheduleOnInit() {
    if (this.didCallOnInit || !this.args.onInit || this.onInitFrame !== null) {
      return;
    }
    this.onInitFrame = requestAnimationFrame(() => {
      this.onInitFrame = null;
      if (this.didCallOnInit || !this.rendererElement) {
        return;
      }
      this.didCallOnInit = true;
      this.args.onInit?.(this.store);
    });
  }
  toCssSize(value) {
    return typeof value === 'number' ? `${value}px` : value;
  }
  applyViewportTransform(viewport) {
    if (this.viewportElement) {
      this.viewportElement.style.transform = this.getViewportTransform(viewport);
    }
    this.rendererElement?.style.setProperty('--ember-flow-resize-control-scale', `${Math.max(1 / viewport.zoom, 1)}`);
  }
  measureRenderedNodes() {
    let changed = false;
    for (let node of this.nodes) {
      let element = this.nodeElement(node.id);
      if (!element) {
        continue;
      }
      let width = element.offsetWidth;
      let height = element.offsetHeight;
      if (width <= 0 || height <= 0) {
        continue;
      }
      let currentWidth = this.store.getNodeWidth(node);
      let currentHeight = this.store.getNodeHeight(node);
      if (Math.abs(currentWidth - width) > 0.5 || Math.abs(currentHeight - height) > 0.5) {
        this.store.setNodeDimensions(node.id, {
          width,
          height
        });
        changed = true;
      }
    }
    if (changed) {
      this.store.bump();
    }
  }
  getViewportTransform(viewport) {
    return `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;
  }
  getNodeDragStartPositions(primaryNode) {
    let shouldDragSelection = primaryNode.selected || this.store.selectedNodeIds.has(primaryNode.id);
    let nodes = shouldDragSelection ? this.nodes.filter(node => (node.selected || this.store.selectedNodeIds.has(node.id)) && node.draggable !== false) : [primaryNode];
    let startPositions = new Map();
    if (!nodes.some(node => node.id === primaryNode.id)) {
      nodes = [primaryNode, ...nodes];
    }
    for (let node of nodes) {
      startPositions.set(node.id, this.store.getNodePosition(node));
    }
    return startPositions;
  }
  shouldStartSelection(event) {
    if (event.button !== 0 || !this.elementsSelectable || this.panActivationKeyPressed) {
      return false;
    }
    let target = event.target;
    let eventTargetIsPane = Boolean(target?.closest('.ember-flow__pane'));
    let selectionOnDrag = (this.args.selectionOnDrag ?? false) && eventTargetIsPane;
    return selectionOnDrag || this.isSelectionKeyActive(event);
  }
  applyActiveNodeDrag(scheduleAutoPan = true) {
    let drag = this.activeNodeDrag;
    if (!drag?.didMove) {
      return;
    }
    let pointerPosition = this.clientToFlowPosition(drag.currentClientX, drag.currentClientY);
    if (!pointerPosition) {
      return;
    }
    let nextPrimaryPosition = {
      x: pointerPosition.x - drag.pointerOffsetX,
      y: pointerPosition.y - drag.pointerOffsetY
    };
    let delta = {
      x: nextPrimaryPosition.x - drag.startPrimaryPosition.x,
      y: nextPrimaryPosition.y - drag.startPrimaryPosition.y
    };
    let nextPositions = new Map();
    for (let [id, startPosition] of drag.startPositions) {
      nextPositions.set(id, {
        x: startPosition.x + delta.x,
        y: startPosition.y + delta.y
      });
    }
    let node = this.store.getNode(drag.id);
    let event = drag.currentEvent;
    if (node && event) {
      let snappedPrimaryPosition = this.args.snapNodePosition?.({
        event,
        node: node,
        position: nextPrimaryPosition,
        positions: nextPositions,
        store: this.store
      });
      if (snappedPrimaryPosition) {
        let snappedDelta = {
          x: snappedPrimaryPosition.x - drag.startPrimaryPosition.x,
          y: snappedPrimaryPosition.y - drag.startPrimaryPosition.y
        };
        nextPositions = new Map();
        for (let [id, startPosition] of drag.startPositions) {
          nextPositions.set(id, {
            x: startPosition.x + snappedDelta.x,
            y: startPosition.y + snappedDelta.y
          });
        }
      }
    }
    for (let [id, position] of nextPositions) {
      this.applyNodePosition(id, position);
    }
    if (node && event) {
      let draggedNodes = this.getDraggedNodes(drag);
      if (draggedNodes.length > 1) {
        if (!drag.selectionDragStarted) {
          drag.selectionDragStarted = true;
          this.args.onSelectionDragStart?.(event, draggedNodes);
        }
        this.args.onSelectionDrag?.(event, draggedNodes);
      }
      if (!drag.started) {
        drag.started = true;
        this.args.onNodeDragStart?.(event, node);
      }
      this.args.onNodeDrag?.(event, node);
      if (scheduleAutoPan) {
        this.scheduleNodeAutoPan();
      }
    }
  }
  scheduleSelectionFrame() {
    if (this.pendingSelectionFrame !== null) {
      return;
    }
    this.pendingSelectionFrame = requestAnimationFrame(() => {
      this.pendingSelectionFrame = null;
      this.renderSelectionRect();
    });
  }
  flushPendingSelectionFrame() {
    if (this.pendingSelectionFrame !== null) {
      cancelAnimationFrame(this.pendingSelectionFrame);
      this.pendingSelectionFrame = null;
      this.renderSelectionRect();
    }
  }
  scheduleSuppressNodeClick() {
    this.suppressNodeClick = true;
    this.flushSuppressNodeClickFrame();
    this.suppressNodeClickFrame = requestAnimationFrame(() => {
      this.suppressNodeClick = false;
      this.suppressNodeClickFrame = null;
    });
  }
  flushSuppressNodeClickFrame() {
    if (this.suppressNodeClickFrame !== null) {
      cancelAnimationFrame(this.suppressNodeClickFrame);
      this.suppressNodeClickFrame = null;
    }
  }
  scheduleConnectionFrame() {
    if (this.pendingConnectionFrame !== null) {
      return;
    }
    this.pendingConnectionFrame = requestAnimationFrame(() => {
      this.pendingConnectionFrame = null;
      this.renderConnectionLine();
      this.scheduleConnectionAutoPan();
    });
  }
  flushPendingConnectionFrame() {
    if (this.pendingConnectionFrame !== null) {
      cancelAnimationFrame(this.pendingConnectionFrame);
      this.pendingConnectionFrame = null;
      this.renderConnectionLine();
    }
  }
  scheduleConnectionAutoPan() {
    if (this.pendingConnectionAutoPanFrame !== null || !this.activeConnection?.currentEvent) {
      return;
    }
    this.pendingConnectionAutoPanFrame = requestAnimationFrame(() => {
      this.pendingConnectionAutoPanFrame = null;
      void this.autoPanForConnection();
    });
  }
  updateConnectionTargetFromEvent(event) {
    let connection = this.activeConnection;
    let renderer = this.rendererElement;
    if (!connection || !renderer) {
      return;
    }
    let rendererRect = renderer.getBoundingClientRect();
    let pointerPoint = {
      x: event.clientX - rendererRect.left,
      y: event.clientY - rendererRect.top
    };
    let candidate = this.findConnectionCandidate(event);
    if (candidate) {
      connection.toX = candidate.point.x;
      connection.toY = candidate.point.y;
      connection.toPosition = candidate.position;
      connection.targetHandle = candidate.handle;
      connection.isValid = candidate.isValid;
      this.setConnectionTargetHandle(candidate.handle, candidate.isValid);
      return;
    }
    connection.toX = pointerPoint.x;
    connection.toY = pointerPoint.y;
    connection.toPosition = oppositePosition[connection.fromPosition];
    connection.targetHandle = null;
    connection.isValid = null;
    this.setConnectionTargetHandle(null);
  }
  hasConnectionExceededThreshold(connection, event) {
    let distance = Math.hypot(event.clientX - connection.startClientX, event.clientY - connection.startClientY);
    return distance >= this.connectionDragThreshold;
  }
  updateConnectionSourceFromAnchor() {
    let connection = this.activeConnection;
    let renderer = this.rendererElement;
    if (!connection || !renderer) {
      return;
    }
    let fromElement = connection.fromElement && renderer.contains(connection.fromElement) ? connection.fromElement : this.findHandleElement(connection.nodeId, connection.handleType, connection.handleId);
    if (!fromElement) {
      return;
    }
    connection.fromElement = fromElement;
    connection.fromPosition = this.getHandlePosition(fromElement, connection.handleType === 'source' ? umdExports.Position.Bottom : umdExports.Position.Top);
    let point = this.getElementRendererPoint(fromElement);
    connection.fromX = point.x;
    connection.fromY = point.y;
  }
  findHandleElement(nodeId, handleType, handleId) {
    let renderer = this.rendererElement;
    if (!renderer) {
      return null;
    }
    for (let handle of renderer.querySelectorAll(`.ember-flow__handle[data-nodeid="${this.escapeAttribute(nodeId)}"][data-handletype="${handleType}"]`)) {
      if (this.getHandleId(handle) === handleId) {
        return handle;
      }
    }
    return null;
  }
  findConnectionCandidate(event) {
    let renderer = this.rendererElement;
    let connection = this.activeConnection;
    if (!renderer || !connection) {
      return null;
    }
    let directHandle = document.elementFromPoint(event.clientX, event.clientY)?.closest('.ember-flow__handle');
    if (directHandle && renderer.contains(directHandle)) {
      let directCandidate = this.connectionCandidateForHandle(directHandle, undefined, true);
      if (directCandidate) {
        return directCandidate;
      }
    }
    let pointerPosition = this.clientToFlowPosition(event.clientX, event.clientY);
    if (!pointerPosition) {
      return null;
    }
    let closestCandidate = null;
    for (let handle of renderer.querySelectorAll('.ember-flow__handle')) {
      if (this.isStartingHandle(handle, connection)) {
        continue;
      }
      let metrics = this.getHandlePointerDistance(handle, pointerPosition);
      if (!metrics) {
        continue;
      }
      if (metrics.distance > this.connectionRadius) {
        continue;
      }
      let candidate = this.connectionCandidateForHandle(handle, metrics.point, true);
      if (!candidate) {
        continue;
      }
      if (!closestCandidate || metrics.distance < closestCandidate.distance || metrics.distance === closestCandidate.distance && metrics.centerDistance < closestCandidate.centerDistance) {
        closestCandidate = {
          ...candidate,
          distance: metrics.distance,
          centerDistance: metrics.centerDistance
        };
      }
    }
    if (!closestCandidate) {
      return null;
    }
    return this.connectionCandidateForHandle(closestCandidate.handle, closestCandidate.point, true);
  }
  getHandlePointerDistance(handle, pointerPosition) {
    let rendererRect = this.rendererElement?.getBoundingClientRect();
    if (!rendererRect) {
      return null;
    }
    let handleRect = handle.getBoundingClientRect();
    let centerPoint = {
      x: handleRect.left + handleRect.width / 2 - rendererRect.left,
      y: handleRect.top + handleRect.height / 2 - rendererRect.top
    };
    let transform = [this.store.viewport.x, this.store.viewport.y, this.store.viewport.zoom];
    let centerFlowPoint = umdExports.pointToRendererPoint(centerPoint, transform);
    let topLeft = umdExports.pointToRendererPoint({
      x: handleRect.left - rendererRect.left,
      y: handleRect.top - rendererRect.top
    }, transform);
    let bottomRight = umdExports.pointToRendererPoint({
      x: handleRect.right - rendererRect.left,
      y: handleRect.bottom - rendererRect.top
    }, transform);
    let minX = Math.min(topLeft.x, bottomRight.x);
    let maxX = Math.max(topLeft.x, bottomRight.x);
    let minY = Math.min(topLeft.y, bottomRight.y);
    let maxY = Math.max(topLeft.y, bottomRight.y);
    let dx = pointerPosition.x < minX ? minX - pointerPosition.x : Math.max(pointerPosition.x - maxX, 0);
    let dy = pointerPosition.y < minY ? minY - pointerPosition.y : Math.max(pointerPosition.y - maxY, 0);
    let rectDistance = Math.hypot(dx, dy);
    let centerDistance = Math.hypot(centerFlowPoint.x - pointerPosition.x, centerFlowPoint.y - pointerPosition.y);
    return {
      point: centerPoint,
      distance: Math.min(rectDistance, centerDistance),
      centerDistance
    };
  }
  connectionCandidateForHandle(handle, point = this.getElementRendererPoint(handle), includeInvalid = false) {
    let isValid = Boolean(this.buildConnectionPayload(handle));
    if (!isValid && !includeInvalid) {
      return null;
    }
    return {
      handle,
      point,
      position: this.getHandlePosition(handle, this.getHandleType(handle) === 'source' ? umdExports.Position.Bottom : umdExports.Position.Top),
      isValid
    };
  }
  getElementRendererPoint(element) {
    let rendererRect = this.rendererElement?.getBoundingClientRect();
    let handleRect = element.getBoundingClientRect();
    return {
      x: handleRect.left + handleRect.width / 2 - (rendererRect?.left ?? 0),
      y: handleRect.top + handleRect.height / 2 - (rendererRect?.top ?? 0)
    };
  }
  isStartingHandle(handle, connection) {
    return handle.dataset['nodeid'] === connection.nodeId && this.getHandleType(handle) === connection.handleType && this.getHandleId(handle) === connection.handleId;
  }
  setConnectionTargetHandle(handle, isValid = null) {
    if (this.connectionTargetHandleElement === handle) {
      if (handle) {
        handle.classList.toggle('valid', isValid === true);
        handle.classList.toggle('invalid', isValid === false);
      }
      return;
    }
    this.connectionTargetHandleElement?.classList.remove('connectingto', 'valid', 'invalid');
    this.connectionTargetHandleElement = handle;
    this.connectionTargetHandleElement?.classList.add('connectingto');
    this.connectionTargetHandleElement?.classList.toggle('valid', isValid === true);
    this.connectionTargetHandleElement?.classList.toggle('invalid', isValid === false);
  }
  shouldHandlePanActivationKeyboardEvent(event) {
    if (umdExports.isInputDOMNode(event) || isTextEntryElement(event.target) || !this.isPanActivationKeyEvent(event)) {
      return false;
    }
    let root = this.rootElement();
    if (!root) {
      return false;
    }
    let activeElement = root.ownerDocument.activeElement;
    return activeElement instanceof Node && root.contains(activeElement) || this.pointerInsideFlow;
  }
  setPanActivationKeyPressed(event, pressed) {
    if (!this.isPanActivationKeyEvent(event)) {
      return;
    }
    let keyId = this.panActivationKeyId(event);
    if (pressed) {
      this.activePanActivationKeyIds.add(keyId);
    } else {
      this.activePanActivationKeyIds.delete(keyId);
    }
    let nextPressed = this.activePanActivationKeyIds.size > 0;
    if (nextPressed === this.panActivationKeyPressed) {
      return;
    }
    this.panActivationKeyPressed = nextPressed;
    if (!nextPressed) {
      this.viewportDragging = false;
    }
    this.updatePanActivationClasses();
    this.updatePanZoomOptions();
  }
  isPanActivationKeyEvent(event) {
    return this.isConfiguredKeyboardEvent(this.panActivationKey, event);
  }
  isConfiguredKeyboardEvent(configuredKey, event) {
    if (configuredKey === null) {
      return false;
    }
    let keys = Array.isArray(configuredKey) ? configuredKey : [configuredKey];
    return keys.some(key => {
      if (key === null) {
        return false;
      }
      return key === event.key || key === event.code || key === 'Space' && event.key === ' ' || key === 'Space' && event.key === 'Spacebar' || key === ' ' && event.code === 'Space';
    });
  }
  panActivationKeyId(event) {
    return event.code || event.key;
  }
  updatePanActivationClasses() {
    let element = this.rootElement();
    element?.classList.toggle('pan-activation', this.panActivationKeyPressed);
    element?.classList.toggle('panning', this.viewportDragging);
    this.updatePanActivationCursor();
  }
  rootElement() {
    return this.rendererElement?.closest('.ember-flow') ?? null;
  }
  updatePanActivationCursor() {
    let cursor = this.viewportDragging ? 'grabbing' : this.panActivationKeyPressed ? 'grab' : null;
    if (!cursor) {
      this.clearPanActivationCursor();
      return;
    }
    let document = this.rootElement()?.ownerDocument;
    if (!document) {
      return;
    }
    let styleElement = this.panActivationCursorStyleElement;
    if (!styleElement || styleElement.ownerDocument !== document || !styleElement.isConnected) {
      styleElement = document.createElement('style');
      styleElement.dataset['emberFlowPanCursor'] = '';
      document.head.append(styleElement);
      this.panActivationCursorStyleElement = styleElement;
    }
    styleElement.textContent = `*, *::before, *::after { cursor: ${cursor} !important; }`;
  }
  clearPanActivationCursor() {
    this.panActivationCursorStyleElement?.remove();
    this.panActivationCursorStyleElement = null;
  }
  async deleteSelectedElements() {
    let nodes = this.args.nodesDeletable === false ? [] : this.nodes.filter(node => this.isNodeSelected(node));
    let edges = this.edges.filter(edge => this.isEdgeSelected(edge));
    let {
      nodeChanges,
      edgeChanges
    } = await this.store.deleteElements({
      nodes,
      edges
    });
    if (nodeChanges.length > 0) {
      this.args.onNodesChange?.(nodeChanges);
    }
    if (edgeChanges.length > 0) {
      this.args.onEdgesChange?.(edgeChanges);
    }
    if (nodeChanges.length > 0 || edgeChanges.length > 0) {
      this.emitSelectionChange();
    }
  }
  isNodeSelected(node) {
    return node.selected || this.store.selectedNodeIds.has(node.id);
  }
  isEdgeSelected(edge) {
    return edge.selected || this.store.selectedEdgeIds.has(edge.id);
  }
  moveSelectedNodesWithKeyboard(event) {
    let direction = arrowKeyDiffs[event.key];
    if (!direction) {
      return;
    }
    let changes = this.store.moveSelectedNodes(direction, event.shiftKey ? 4 : 1);
    if (changes.length === 0) {
      return;
    }
    event.preventDefault();
    for (let change of changes) {
      if (change.type !== 'position') {
        continue;
      }
      let internalNode = this.store.getInternalNode(change.id);
      let element = this.nodeElement(change.id);
      if (internalNode && element) {
        let {
          positionAbsolute
        } = internalNode.internals;
        element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
      }
      this.updateConnectedEdges(change.id);
    }
    this.args.onNodesChange?.(changes);
  }
  detachNodeDragListeners() {
    window.removeEventListener('pointermove', this.handleWindowNodePointerMove);
    window.removeEventListener('pointerup', this.handleWindowNodePointerUp);
    window.removeEventListener('pointercancel', this.handleWindowNodePointerUp);
    if (this.pendingNodeAutoPanFrame !== null) {
      cancelAnimationFrame(this.pendingNodeAutoPanFrame);
      this.pendingNodeAutoPanFrame = null;
    }
    this.activeNodeDrag = null;
  }
  detachSelectionListeners(hide = true) {
    window.removeEventListener('pointermove', this.handleWindowSelectionPointerMove);
    window.removeEventListener('pointerup', this.handleWindowSelectionPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowSelectionPointerUp);
    if (this.pendingSelectionFrame !== null) {
      cancelAnimationFrame(this.pendingSelectionFrame);
      this.pendingSelectionFrame = null;
    }
    this.activeSelection = null;
    if (hide && this.selectionElement) {
      this.selectionElement.style.opacity = '0';
    }
  }
  detachConnectionListeners() {
    window.removeEventListener('pointermove', this.handleWindowConnectionPointerMove);
    window.removeEventListener('pointerup', this.handleWindowConnectionPointerUp);
    window.removeEventListener('pointercancel', this.handleWindowConnectionPointerUp);
    if (this.pendingConnectionFrame !== null) {
      cancelAnimationFrame(this.pendingConnectionFrame);
      this.pendingConnectionFrame = null;
    }
    if (this.pendingConnectionAutoPanFrame !== null) {
      cancelAnimationFrame(this.pendingConnectionAutoPanFrame);
      this.pendingConnectionAutoPanFrame = null;
    }
    this.setConnectionTargetHandle(null);
    this.activeConnection = null;
    this.connectionRenderState = null;
    this.store.setConnection(umdExports.initialConnection);
    if (this.connectionLineElement) {
      this.connectionLineElement.style.display = 'none';
    }
  }
  renderSelectionRect() {
    let selection = this.activeSelection;
    let element = this.selectionElement;
    if (!selection || !element) {
      return;
    }
    let x = Math.min(selection.startX, selection.currentX);
    let y = Math.min(selection.startY, selection.currentY);
    let width = Math.abs(selection.currentX - selection.startX);
    let height = Math.abs(selection.currentY - selection.startY);
    element.style.opacity = '1';
    element.style.transform = `translate(${x}px, ${y}px)`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }
  renderConnectionLine() {
    let connection = this.activeConnection;
    let line = this.connectionLineElement;
    let path = this.connectionPathElement;
    let renderer = this.rendererElement;
    if (!connection || !line || !renderer) {
      return;
    }
    this.updateConnectionSourceFromAnchor();
    line.setAttribute('width', `${renderer.clientWidth}`);
    line.setAttribute('height', `${renderer.clientHeight}`);
    line.style.display = 'block';
    line.querySelector('.ember-flow__connection')?.setAttribute('class', ['ember-flow__connection', umdExports.getConnectionStatus(connection.isValid)].filter(Boolean).join(' '));
    this.connectionRenderState = this.getConnectionLineProps(connection);
    if (!this.connectionLineComponent) {
      if (!path) {
        return;
      }
      path.setAttribute('d', this.getConnectionLinePath(connection));
      path.setAttribute('style', toCss(this.args.connectionLineStyle));
    }
  }
  getConnectionLineProps(connection) {
    return {
      connectionState: this.getConnectionState(connection, connection.currentEvent ?? undefined),
      fromX: connection.fromX,
      fromY: connection.fromY,
      toX: connection.toX,
      toY: connection.toY,
      fromPosition: connection.fromPosition,
      toPosition: connection.toPosition,
      fromNodeId: connection.nodeId,
      fromHandleId: connection.handleId,
      fromHandleType: connection.handleType,
      isValid: connection.isValid
    };
  }
  getConnectionLinePath(connection) {
    let pathParams = {
      sourceX: connection.fromX,
      sourceY: connection.fromY,
      sourcePosition: connection.fromPosition,
      targetX: connection.toX,
      targetY: connection.toY,
      targetPosition: connection.toPosition
    };
    switch (this.args.connectionLineType ?? umdExports.ConnectionLineType.Bezier) {
      case umdExports.ConnectionLineType.Bezier:
        return umdExports.getBezierPath(pathParams)[0];
      case umdExports.ConnectionLineType.SimpleBezier:
        return getSimpleBezierPath(pathParams)[0];
      case umdExports.ConnectionLineType.Step:
        return umdExports.getSmoothStepPath({
          ...pathParams,
          borderRadius: 0
        })[0];
      case umdExports.ConnectionLineType.SmoothStep:
        return umdExports.getSmoothStepPath(pathParams)[0];
      case umdExports.ConnectionLineType.Straight:
      default:
        return umdExports.getStraightPath(pathParams)[0];
    }
  }
  completeConnection(targetHandle) {
    let connection = this.activeConnection;
    let connectionPayload = targetHandle ? this.buildConnectionPayload(targetHandle) : null;
    if (!connection || !connectionPayload) {
      return false;
    }
    if (connection.reconnect) {
      let oldEdge = connection.reconnect.edge;
      let nextEdge = {
        ...oldEdge,
        ...connectionPayload
      };
      this.store.updateEdge(oldEdge.id, nextEdge, {
        replace: true
      });
      this.args.onReconnect?.(oldEdge, connectionPayload);
      this.args.onEdgesChange?.([{
        id: oldEdge.id,
        type: 'replace',
        item: nextEdge
      }]);
      return true;
    }
    let id = umdExports.getEdgeId(connectionPayload);
    if (this.edges.some(edge => edge.id === id)) {
      return false;
    }
    let edge = {
      id,
      source: connectionPayload.source,
      target: connectionPayload.target,
      sourceHandle: connectionPayload.sourceHandle,
      targetHandle: connectionPayload.targetHandle
    };
    this.store.addEdge(edge);
    this.args.onConnect?.(connectionPayload);
    this.args.onEdgesChange?.([{
      id,
      type: 'add',
      item: edge
    }]);
    return true;
  }
  buildConnectionPayload(targetHandle) {
    let connection = this.activeConnection;
    if (!connection) {
      return null;
    }
    let targetNodeId = targetHandle.dataset['nodeid'];
    if (!targetNodeId || targetNodeId === connection.nodeId) {
      return null;
    }
    let targetNode = this.nodes.find(node => node.id === targetNodeId);
    if (!targetNode || targetNode.connectable === false) {
      return null;
    }
    if (!this.canEndConnection(targetHandle)) {
      return null;
    }
    let targetHandleType = this.getHandleType(targetHandle);
    if (!targetHandleType) {
      return null;
    }
    let targetHandleId = this.getHandleId(targetHandle);
    let sourceId = null;
    let destinationId = null;
    let sourceHandle = null;
    let targetHandleIdForPayload = null;
    if (connection.handleType === 'source' && (targetHandleType === 'target' || this.connectionMode === umdExports.ConnectionMode.Loose)) {
      sourceId = connection.nodeId;
      destinationId = targetNodeId;
      sourceHandle = connection.handleId;
      targetHandleIdForPayload = targetHandleId;
    } else if (connection.handleType === 'target' && (targetHandleType === 'source' || this.connectionMode === umdExports.ConnectionMode.Loose)) {
      sourceId = targetNodeId;
      destinationId = connection.nodeId;
      sourceHandle = targetHandleId;
      targetHandleIdForPayload = connection.handleId;
    }
    if (!sourceId || !destinationId) {
      return null;
    }
    let connectionPayload = {
      source: sourceId,
      target: destinationId,
      sourceHandle,
      targetHandle: targetHandleIdForPayload
    };
    if (this.args.isValidConnection && !this.args.isValidConnection(connectionPayload)) {
      return null;
    }
    return connectionPayload;
  }
  getFinalConnectionState(connection, event, targetHandle, isValid) {
    let fromNode = this.store.getInternalNode(connection.nodeId) ?? null;
    let targetNodeId = targetHandle?.dataset['nodeid'];
    let toNode = targetNodeId ? this.store.getInternalNode(targetNodeId) ?? null : null;
    let pointer = this.clientToFlowPosition(event.clientX, event.clientY) ?? {
      x: connection.toX,
      y: connection.toY
    };
    let toPosition = targetHandle ? this.getHandlePosition(targetHandle, this.getHandleType(targetHandle) === 'source' ? umdExports.Position.Bottom : umdExports.Position.Top) : null;
    return {
      isValid,
      from: {
        x: connection.fromX,
        y: connection.fromY
      },
      fromHandle: connection.fromElement ? this.getHandleState(connection.fromElement, connection.handleType) : null,
      fromPosition: connection.fromPosition,
      fromNode,
      to: {
        x: connection.toX,
        y: connection.toY
      },
      toHandle: targetHandle ? this.getHandleState(targetHandle, this.getHandleType(targetHandle) ?? 'target') : null,
      toPosition: targetHandle && isValid ? toPosition : null,
      toNode,
      pointer
    };
  }
  getConnectionState(connection, event) {
    let fromNode = this.store.getInternalNode(connection.nodeId);
    let targetHandle = connection.targetHandle;
    let targetNodeId = targetHandle?.dataset['nodeid'];
    let toNode = targetNodeId ? this.store.getInternalNode(targetNodeId) : undefined;
    let pointer = event ? this.clientToFlowPosition(event.clientX, event.clientY) ?? {
      x: connection.toX,
      y: connection.toY
    } : {
      x: connection.toX,
      y: connection.toY
    };
    return {
      inProgress: true,
      isValid: connection.isValid,
      from: {
        x: connection.fromX,
        y: connection.fromY
      },
      fromHandle: connection.fromElement ? this.getHandleState(connection.fromElement, connection.handleType) : null,
      fromPosition: connection.fromPosition,
      fromNode: fromNode ?? null,
      to: {
        x: connection.toX,
        y: connection.toY
      },
      toHandle: targetHandle ? this.getHandleState(targetHandle, this.getHandleType(targetHandle) ?? 'target') : null,
      toPosition: targetHandle ? connection.toPosition : null,
      toNode: toNode ?? null,
      pointer
    };
  }
  cancelConnection() {
    this.detachConnectionListeners();
  }
  getHandleState(element, fallbackType) {
    let htmlElement = element instanceof HTMLElement ? element : null;
    let nodeId = htmlElement?.dataset['nodeid'];
    if (!htmlElement || !nodeId) {
      return null;
    }
    let rect = htmlElement.getBoundingClientRect();
    let rendererRect = this.rendererElement?.getBoundingClientRect();
    let position = this.getHandlePosition(htmlElement, this.getHandleType(htmlElement) === 'source' ? umdExports.Position.Bottom : umdExports.Position.Top);
    return {
      id: this.getHandleId(htmlElement),
      nodeId,
      x: rect.left - (rendererRect?.left ?? 0),
      y: rect.top - (rendererRect?.top ?? 0),
      position,
      type: this.getHandleType(htmlElement) ?? fallbackType,
      width: rect.width,
      height: rect.height
    };
  }
  clearSelection() {
    let selectedNodeIds = this.nodes.filter(node => node.selected || this.store.selectedNodeIds.has(node.id)).map(node => node.id);
    let selectedEdgeIds = this.edges.filter(edge => edge.selected || this.store.selectedEdgeIds.has(edge.id)).map(edge => edge.id);
    for (let id of selectedNodeIds) {
      this.nodeElement(id)?.classList.remove('selected');
    }
    for (let id of selectedEdgeIds) {
      this.edgeElement(id)?.classList.remove('selected');
    }
    this.store.clearSelection();
    if (selectedNodeIds.length > 0) {
      this.args.onNodesChange?.(selectedNodeIds.map(id => ({
        id,
        type: 'select',
        selected: false
      })));
    }
    if (selectedEdgeIds.length > 0) {
      this.args.onEdgesChange?.(selectedEdgeIds.map(id => ({
        id,
        type: 'select',
        selected: false
      })));
    }
    if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
      this.args.onSelectionChange?.({
        nodes: [],
        edges: []
      });
    }
  }
  selectNode(id) {
    let didSelect = this.store.selectNode(id);
    this.nodeElement(id)?.classList.add('selected');
    this.args.onNodesChange?.([{
      id,
      type: 'select',
      selected: true
    }]);
    if (didSelect) {
      this.emitSelectionChange();
    }
    return didSelect;
  }
  selectEdge(id) {
    let didSelect = this.store.selectEdge(id);
    this.edgeElement(id)?.classList.add('selected');
    this.args.onEdgesChange?.([{
      id,
      type: 'select',
      selected: true
    }]);
    if (didSelect) {
      this.emitSelectionChange();
    }
    return didSelect;
  }
  emitSelectionChange() {
    this.args.onSelectionChange?.({
      nodes: this.store.selectedNodes,
      edges: this.store.selectedEdges
    });
  }
  getDraggedNodes(drag) {
    return Array.from(drag.startPositions.keys()).map(id => this.store.getNode(id)).filter(node => Boolean(node));
  }
  applyNodePosition(id, position) {
    let node = this.store.getNode(id);
    if (!node) {
      return;
    }
    let {
      positionAbsolute
    } = this.store.setNodeAbsolutePosition(id, node, position);
    let element = this.nodeElement(id);
    if (element) {
      element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
    }
    this.updateConnectedEdges(id);
    this.updateDescendantNodePositions(id);
  }
  updateDescendantNodePositions(parentId) {
    for (let node of this.nodes) {
      if (node.parentId !== parentId) {
        continue;
      }
      let position = this.store.getNodePosition(node);
      let element = this.nodeElement(node.id);
      if (element) {
        element.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
      this.updateConnectedEdges(node.id);
      this.updateDescendantNodePositions(node.id);
    }
  }
  applyNodeResize(detail, commit) {
    let node = this.store.getNode(detail.id);
    if (!node) {
      return;
    }
    let previousPositionAbsolute = this.store.getNodePosition(node);
    let resizePosition = detail.position;
    let resizeDimensions = detail.dimensions;
    let snapResult = this.args.snapNodeResize?.({
      node: node,
      position: resizePosition,
      dimensions: resizeDimensions,
      controlPosition: detail.controlPosition,
      resizing: detail.resizing,
      store: this.store
    });
    if (snapResult?.position) {
      resizePosition = snapResult.position;
    }
    if (snapResult?.dimensions) {
      resizeDimensions = snapResult.dimensions;
    }
    let snappedPositionChanged = resizePosition.x !== detail.position.x || resizePosition.y !== detail.position.y;
    let constrainedDimensions = this.constrainResizeDimensionsForChildren(detail.id, resizeDimensions);
    let dimensions = this.store.setNodeDimensions(detail.id, constrainedDimensions);
    let position = this.store.setNodePosition(detail.id, resizePosition);
    let positionAbsolute = this.store.getNodePosition(node);
    let element = this.nodeElement(detail.id);
    let childChanges = detail.childChanges?.length && !snappedPositionChanged ? detail.childChanges : this.getFallbackResizeChildChanges(detail.id, previousPositionAbsolute, positionAbsolute);
    let nodeChanges = [{
      id: detail.id,
      type: 'position',
      position
    }, {
      id: detail.id,
      type: 'dimensions',
      dimensions,
      resizing: false,
      setAttributes: detail.setAttributes ?? true
    }];
    if (element) {
      element.style.transform = `translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`;
      element.style.width = `${dimensions.width}px`;
      element.style.height = `${dimensions.height}px`;
    }
    this.updateConnectedEdges(detail.id);
    for (let childChange of childChanges) {
      let child = this.store.getNode(childChange.id);
      if (!child) {
        continue;
      }
      let childPosition = this.store.setNodePosition(childChange.id, childChange.position);
      let childElement = this.nodeElement(childChange.id);
      let childPositionAbsolute = this.store.getNodePosition(child);
      if (childElement) {
        childElement.style.transform = `translate(${childPositionAbsolute.x}px, ${childPositionAbsolute.y}px)`;
      }
      this.updateConnectedEdges(childChange.id);
      this.updateDescendantNodePositions(childChange.id);
      nodeChanges.push({
        id: childChange.id,
        type: 'position',
        position: childPosition
      });
    }
    if (commit) {
      this.args.onNodesChange?.(nodeChanges);
      this.store.bump();
    }
  }
  constrainResizeDimensionsForChildren(parentId, dimensions) {
    let width = dimensions.width;
    let height = dimensions.height;
    for (let child of this.nodes) {
      if (child.parentId !== parentId || child.extent !== 'parent' && !child.expandParent) {
        continue;
      }
      let childWidth = this.store.getNodeWidth(child);
      let childHeight = this.store.getNodeHeight(child);
      let childPosition = this.store.getNodeUserPosition(child);
      let childOrigin = child.origin ?? this.store.nodeOrigin;
      let childLeft = childPosition.x - childWidth * childOrigin[0];
      let childTop = childPosition.y - childHeight * childOrigin[1];
      width = Math.max(width, childLeft + childWidth);
      height = Math.max(height, childTop + childHeight);
    }
    return {
      width,
      height
    };
  }
  getFallbackResizeChildChanges(parentId, previousPositionAbsolute, nextPositionAbsolute) {
    let delta = {
      x: nextPositionAbsolute.x - previousPositionAbsolute.x,
      y: nextPositionAbsolute.y - previousPositionAbsolute.y
    };
    if (delta.x === 0 && delta.y === 0) {
      return [];
    }
    return this.nodes.filter(node => node.parentId === parentId).map(child => {
      let childPosition = this.store.getNodeUserPosition(child);
      return {
        id: child.id,
        position: {
          x: childPosition.x - delta.x,
          y: childPosition.y - delta.y
        },
        extent: child.extent
      };
    });
  }
  updateConnectedEdges(nodeId) {
    let connectedEdges = this.store.getConnectedEdges(nodeId);
    if (connectedEdges.length === 0) {
      connectedEdges = this.edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    }
    for (let edge of connectedEdges) {
      let source = this.store.getNode(edge.source);
      let target = this.store.getNode(edge.target);
      let edgeElement = this.edgeElement(edge.id);
      if (!source || !target || !edgeElement) {
        continue;
      }
      let [edgePath, labelX, labelY] = getEdgePathData(edge, source, target, {
        getNodePosition: node => this.getLiveNodePosition(node),
        getNodeWidth: node => this.store.getNodeWidth(node),
        getNodeHeight: node => this.store.getNodeHeight(node)
      });
      for (let path of edgeElement.querySelectorAll('.ember-flow__edge-path, .ember-flow__edge-interaction, .ember-flow__edge-selection')) {
        path.setAttribute('d', edgePath);
      }
      let edgePosition = getEdgePosition(source, target, {
        getNodePosition: node => this.getLiveNodePosition(node),
        getNodeWidth: node => this.store.getNodeWidth(node),
        getNodeHeight: node => this.store.getNodeHeight(node)
      });
      this.updateEdgeReconnectAnchor(edgeElement, 'source', edgePosition.sourceX, edgePosition.sourceY, edgePosition.sourcePosition);
      this.updateEdgeReconnectAnchor(edgeElement, 'target', edgePosition.targetX, edgePosition.targetY, edgePosition.targetPosition);
      edgeElement?.querySelector('.ember-flow__edge-textwrapper')?.setAttribute('transform', `translate(${labelX} ${labelY})`);
      this.updateEdgeToolbar(edge.id, labelX, labelY);
    }
  }
  updateEdgeReconnectAnchor(edgeElement, handleType, x, y, position) {
    let anchor = edgeElement.querySelector(`.ember-flow__edgeupdater-${handleType}`);
    if (!anchor) {
      return;
    }
    let radius = Number(anchor.getAttribute('r') ?? this.reconnectRadius);
    let shift = Number.isFinite(radius) ? radius : this.reconnectRadius;
    anchor.setAttribute('cx', `${this.shiftEdgeAnchorX(x, shift, position)}`);
    anchor.setAttribute('cy', `${this.shiftEdgeAnchorY(y, shift, position)}`);
  }
  shiftEdgeAnchorX(x, shift, position) {
    if (position === umdExports.Position.Left) {
      return x - shift;
    }
    if (position === umdExports.Position.Right) {
      return x + shift;
    }
    return x;
  }
  shiftEdgeAnchorY(y, shift, position) {
    if (position === umdExports.Position.Top) {
      return y - shift;
    }
    if (position === umdExports.Position.Bottom) {
      return y + shift;
    }
    return y;
  }
  updateEdgeToolbar(edgeId, x, y) {
    let toolbar = this.rendererElement?.querySelector(`.ember-flow__edge-toolbar[data-id="${this.escapeAttribute(edgeId)}"]`);
    if (!toolbar) {
      return;
    }
    let offset = Number(toolbar.dataset['offset'] ?? 10);
    let position = toolbar.dataset['position'];
    let alignX = toolbar.dataset['alignX'];
    let alignY = toolbar.dataset['alignY'];
    let screenOffset = this.getToolbarScreenOffset(position, Number.isFinite(offset) ? offset : 10);
    toolbar.style.transform = getViewportOverlayTransform({
      x,
      y,
      zoom: this.store.viewport.zoom,
      offsetX: screenOffset.x,
      offsetY: screenOffset.y,
      alignX: alignX ?? 'center',
      alignY: alignY ?? 'center'
    });
  }
  getToolbarScreenOffset(position, offset) {
    switch (position) {
      case umdExports.Position.Top:
        return {
          x: 0,
          y: -offset
        };
      case umdExports.Position.Right:
        return {
          x: offset,
          y: 0
        };
      case umdExports.Position.Bottom:
        return {
          x: 0,
          y: offset
        };
      case umdExports.Position.Left:
        return {
          x: -offset,
          y: 0
        };
      default:
        return {
          x: 0,
          y: 0
        };
    }
  }
  getHandleType(handle) {
    let dataType = handle.dataset['handletype'];
    if (dataType === 'source' || dataType === 'target') {
      return dataType;
    }
    if (handle.classList.contains('source')) {
      return 'source';
    }
    if (handle.classList.contains('target')) {
      return 'target';
    }
    return null;
  }
  getHandlePosition(handle, fallback) {
    let position = handle.dataset?.['handlepos'];
    switch (position) {
      case umdExports.Position.Left:
      case umdExports.Position.Right:
      case umdExports.Position.Top:
      case umdExports.Position.Bottom:
        return position;
      default:
        return fallback;
    }
  }
  getHandleId(handle) {
    let id = handle.dataset['handleid'];
    return id && id !== 'null' ? id : null;
  }
  canStartConnection(handle) {
    return !handle.classList.contains('connectable') || handle.classList.contains('connectablestart');
  }
  canEndConnection(handle) {
    return !handle.classList.contains('connectable') || handle.classList.contains('connectableend');
  }
  isSelectionKeyActive(event) {
    let selectionKey = this.selectionKey ?? 'Shift';
    if (selectionKey === null) {
      return false;
    }
    let keys = Array.isArray(selectionKey) ? selectionKey : [selectionKey];
    return keys.some(key => {
      switch (key) {
        case 'Shift':
          return event.shiftKey;
        case 'Meta':
          return event.metaKey;
        case 'Control':
        case 'Ctrl':
          return event.ctrlKey;
        case 'Alt':
          return event.altKey;
        default:
          return this.store.pressedKeys.has(key);
      }
    });
  }
  shouldHandleElementSelectionKey(event) {
    if (this.args.disableKeyboardA11y || umdExports.isInputDOMNode(event)) {
      return false;
    }
    return event.key === 'Enter' || event.key === ' ' || event.key === 'Escape';
  }
  isNodeInsideSelection(nodeRect, selectionRect) {
    let intersects = nodeRect.left <= selectionRect.right && nodeRect.right >= selectionRect.left && nodeRect.top <= selectionRect.bottom && nodeRect.bottom >= selectionRect.top;
    if (this.selectionMode === umdExports.SelectionMode.Partial) {
      return intersects;
    }
    return intersects && nodeRect.left >= selectionRect.left && nodeRect.right <= selectionRect.right && nodeRect.top >= selectionRect.top && nodeRect.bottom <= selectionRect.bottom;
  }
  clientToFlowPosition(clientX, clientY) {
    let renderer = this.rendererElement;
    if (!renderer) {
      return null;
    }
    let rect = renderer.getBoundingClientRect();
    return umdExports.pointToRendererPoint({
      x: clientX - rect.left,
      y: clientY - rect.top
    }, [this.store.viewport.x, this.store.viewport.y, this.store.viewport.zoom]);
  }
  scheduleNodeAutoPan() {
    if (this.pendingNodeAutoPanFrame !== null) {
      return;
    }
    this.pendingNodeAutoPanFrame = requestAnimationFrame(() => {
      this.pendingNodeAutoPanFrame = null;
      void this.autoPanForNodeDrag();
    });
  }
  async autoPanForNodeDrag() {
    let drag = this.activeNodeDrag;
    if (this.args.autoPanOnNodeDrag === false || !this.rendererElement) {
      return;
    }
    let rect = this.rendererElement.getBoundingClientRect();
    if (!drag?.didMove) {
      return;
    }
    let [x = 0, y = 0] = umdExports.calcAutoPan({
      x: drag.currentClientX - rect.left,
      y: drag.currentClientY - rect.top
    }, {
      width: rect.width,
      height: rect.height
    }, this.args.autoPanSpeed ?? 15);
    if (x !== 0 || y !== 0) {
      let changed = await this.store.panBy({
        x,
        y
      });
      if (changed && this.activeNodeDrag === drag) {
        this.applyViewportTransform(this.store.viewport);
        this.applyActiveNodeDrag(false);
      }
      if (this.activeNodeDrag === drag) {
        this.scheduleNodeAutoPan();
      }
    }
  }
  async autoPanForConnection() {
    let connection = this.activeConnection;
    let event = connection?.currentEvent;
    if (this.args.autoPanOnConnect === false || !this.rendererElement || !connection || !event) {
      return;
    }
    let rect = this.rendererElement.getBoundingClientRect();
    let [x = 0, y = 0] = umdExports.calcAutoPan({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }, {
      width: rect.width,
      height: rect.height
    }, this.args.autoPanSpeed ?? 15);
    if (x !== 0 || y !== 0) {
      let changed = await this.store.panBy({
        x,
        y
      });
      if (changed && this.activeConnection === connection) {
        this.applyViewportTransform(this.store.viewport);
        this.updateConnectionSourceFromAnchor();
        this.updateConnectionTargetFromEvent(event);
        this.renderConnectionLine();
      }
      if (this.activeConnection === connection) {
        this.scheduleConnectionAutoPan();
      }
    }
  }
  getLiveNodePosition(node) {
    if (!this.activeNodeDrag) {
      return this.store.getNodePosition(node);
    }
    let transform = this.nodeElement(node.id)?.style.transform;
    let translate = transform?.match(/translate\(\s*(-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\s*\)/);
    if (translate) {
      return {
        x: Number(translate[1]),
        y: Number(translate[2])
      };
    }
    return this.store.getNodePosition(node);
  }
  nodeElement(id) {
    return this.rendererElement?.querySelector(`.ember-flow__node[data-id="${this.escapeAttribute(id)}"]`);
  }
  edgeElement(id) {
    return this.rendererElement?.querySelector(`.ember-flow__edge[data-id="${this.escapeAttribute(id)}"]`);
  }
  escapeAttribute(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }
}, setComponentTemplate(precompileTemplate("<div class={{this.rootClasses}} data-testid=\"ember-flow__wrapper\" role=\"application\" tabindex=\"0\" style={{this.rootStyle}} {{flowController this.flowController}} {{flowStore this.store}} {{flowArgs this @viewport @nodeOrigin @nodeExtent @translateExtent @snapToGrid @snapGrid @autoPanOnNodeDrag @autoPanOnConnect @autoPanSpeed @zIndexMode @elevateNodesOnSelect @paneClickDistance @panOnScroll @panOnScrollMode @panOnScrollSpeed @panOnDrag @zoomOnScroll @zoomOnPinch @zoomOnDoubleClick @preventScrolling}} {{listen \"ember-flow:edge-reconnect\" this.handleEdgeReconnectEvent}} {{listen \"pointerenter\" this.handleRootPointerEnter}} {{listen \"pointerleave\" this.handleRootPointerLeave}} {{listen \"keydown\" this.handleRootKeyDown}} {{listen \"keyup\" this.handleRootKeyUp}} ...attributes>\n  <div class=\"ember-flow__renderer ember-flow__container\" {{panZoom this}} {{listen \"pointerdown\" this.handleRendererPointerDown}} {{listen \"click\" this.handleRendererClick}} {{listen \"contextmenu\" this.handlePaneContextMenu}} {{listen \"wheel\" this.handlePaneScroll}} {{listen \"ember-flow:node-resize\" this.handleNodeResize}}>\n    <div class=\"ember-flow__pane ember-flow__container draggable\" {{listen \"pointerdown\" this.handlePanePointerDown}} {{listen \"mouseenter\" this.handlePaneMouseEnter}} {{listen \"mousemove\" this.handlePaneMouseMove}} {{listen \"mouseleave\" this.handlePaneMouseLeave}}></div>\n    <div class=\"ember-flow__viewport emberflow__viewport ember-flow__container\" style={{this.viewportStyle}}>\n      <div class=\"ember-flow__viewport-back ember-flow__container\"></div>\n      <div class=\"ember-flow__edges\">\n        {{#each this.edgeItems key=\"edge.id\" as |item|}}\n          <FlowEdge @edge={{item.edge}} @source={{item.source}} @target={{item.target}} @edgeComponent={{this.edgeComponentFor item.edge}} @edgesReconnectable={{this.edgesReconnectable}} @edgesFocusable={{this.edgesFocusable}} @disableKeyboardA11y={{@disableKeyboardA11y}} @reconnectRadius={{this.reconnectRadius}} @getNodePosition={{this.nodePositionFor}} @getNodeWidth={{this.nodeWidthFor}} @getNodeHeight={{this.nodeHeightFor}} @onReconnectPointerDown={{this.handleEdgeReconnectPointerDown}} @onEdgeKeyDown={{this.handleEdgeKeyDown}} @onEdgeDoubleClick={{this.handleEdgeDoubleClick}} @onEdgeContextMenu={{this.handleEdgeContextMenu}} @onEdgeMouseEnter={{this.handleEdgeMouseEnter}} @onEdgeMouseMove={{this.handleEdgeMouseMove}} @onEdgeMouseLeave={{this.handleEdgeMouseLeave}} />\n        {{/each}}\n      </div>\n      <div class=\"ember-flow__edge-labels ember-flow__edgelabel-renderer ember-flow__container\"></div>\n      <div class=\"ember-flow__nodes\">\n        {{#each this.renderedNodes key=\"id\" as |node|}}\n          {{#unless node.hidden}}\n            <FlowNode @node={{node}} @position={{this.nodePositionFor node}} @nodeComponent={{this.nodeComponentFor node}} @nodesFocusable={{this.nodesFocusable}} @disableKeyboardA11y={{@disableKeyboardA11y}} @onNodeClick={{this.handleNodeClick}} @onNodeDoubleClick={{this.handleNodeDoubleClick}} @onNodeContextMenu={{this.handleNodeContextMenu}} @onNodePointerDown={{this.handleNodePointerDown}} @onNodeKeyDown={{this.handleNodeKeyDown}} @onHandlePointerDown={{this.handleHandlePointerDown}} />\n          {{/unless}}\n        {{/each}}\n      </div>\n      <div class=\"ember-flow__viewport-front ember-flow__container\"></div>\n    </div>\n    <svg class=\"ember-flow__connectionline ember-flow__container\" style={{this.connectionLineInitialStyle}}>\n      <g class=\"ember-flow__connection\">\n        {{#if this.connectionLineComponent}}\n          {{#if this.connectionRenderState}}\n            <this.connectionLineComponent @connectionState={{this.connectionRenderState.connectionState}} @fromX={{this.connectionRenderState.fromX}} @fromY={{this.connectionRenderState.fromY}} @toX={{this.connectionRenderState.toX}} @toY={{this.connectionRenderState.toY}} @fromPosition={{this.connectionRenderState.fromPosition}} @toPosition={{this.connectionRenderState.toPosition}} @fromNodeId={{this.connectionRenderState.fromNodeId}} @fromHandleId={{this.connectionRenderState.fromHandleId}} @fromHandleType={{this.connectionRenderState.fromHandleType}} @isValid={{this.connectionRenderState.isValid}} />\n          {{/if}}\n        {{else}}\n          <path class=\"ember-flow__connection-path\" style={{this.connectionLinePathStyle}} fill=\"none\" />\n        {{/if}}\n      </g>\n    </svg>\n    <div class=\"ember-flow__selection\"></div>\n  </div>\n  {{yield this.store}}\n</div>", {
  strictMode: true,
  scope: () => ({
    flowController,
    flowStore,
    flowArgs,
    listen,
    panZoom,
    FlowEdge,
    FlowNode
  })
}), _EmberFlow), _EmberFlow), _descriptor$h = _applyDecoratedDescriptor(_class$h.prototype, "connectionRenderState", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _class$h);

var _EmberFlowProvider;
class EmberFlowProvider extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "ownedStore", new EmberFlowStore(this.args.initialViewport));
  }
  get store() {
    return this.args.store ?? this.ownedStore;
  }
}
_EmberFlowProvider = EmberFlowProvider;
setComponentTemplate(precompileTemplate("{{yield this.store}}", {
  strictMode: true
}), _EmberFlowProvider);

var nodeIdContext = modifier((element, [owner]) => {
  let frame = requestAnimationFrame(() => owner.registerNodeContext(element));
  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterNodeContext();
  };
});

var _class$g, _descriptor$g, _Handle;
let Handle = (_class$g = (_Handle = class Handle extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "contextNodeId", _descriptor$g, this);
  }
  get type() {
    return this.args.type ?? 'source';
  }
  get position() {
    return this.args.position ?? umdExports.Position.Top;
  }
  get nodeId() {
    return this.args.nodeId ?? this.args.node?.id ?? this.contextNodeId;
  }
  get handleId() {
    return this.args.id ?? null;
  }
  get isConnectable() {
    return this.args.isConnectable ?? true;
  }
  get isConnectableStart() {
    return this.isConnectable && (this.args.isConnectableStart ?? true);
  }
  get isConnectableEnd() {
    return this.isConnectable && (this.args.isConnectableEnd ?? true);
  }
  get handleClasses() {
    return ['ember-flow__handle', `ember-flow__handle-${this.position}`, this.position, this.type, 'nodrag', 'nopan', this.args.class, this.args.className, this.isConnectable ? 'connectable' : undefined, this.isConnectableStart ? 'connectablestart' : undefined, this.isConnectableEnd ? 'connectableend' : undefined, this.isConnectable ? 'connectionindicator' : undefined].filter(Boolean).join(' ');
  }
  get handleStyle() {
    return safeStyle(this.args.style);
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<div class={{this.handleClasses}} data-nodeid={{this.nodeId}} data-handleid={{this.handleId}} data-handlepos={{this.position}} data-handletype={{this.type}} style={{this.handleStyle}} {{nodeIdContext this}} ...attributes>\n  {{yield}}\n</div>", {
  strictMode: true,
  scope: () => ({
    nodeIdContext
  })
}), _Handle), _Handle), _descriptor$g = _applyDecoratedDescriptor(_class$g.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _class$g);

var miniMap = modifier((element, [owner]) => {
  owner.registerMiniMap(element);
  let frame = requestAnimationFrame(() => owner.registerMiniMap(element));
  return () => {
    cancelAnimationFrame(frame);
    owner.unregisterMiniMap();
  };
});

var _MiniMapNode;
class MiniMapNode extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleClick", event => {
      this.args.onClick?.(this.args.id, event);
    });
  }
  get classes() {
    return ['ember-flow__minimap-node', this.args.selected ? 'selected' : undefined, this.args.className].filter(Boolean).join(' ');
  }
  get borderRadius() {
    return this.args.borderRadius ?? 5;
  }
  get strokeWidth() {
    return this.args.strokeWidth ?? 2;
  }
  get nodeStyle() {
    let declarations = [this.args.color ? `fill: ${this.args.color}` : undefined, this.args.strokeColor ? `stroke: ${this.args.strokeColor}` : undefined, `stroke-width: ${this.strokeWidth}`].filter(Boolean);
    return htmlSafe(declarations.join('; '));
  }
}
_MiniMapNode = MiniMapNode;
setComponentTemplate(precompileTemplate("<rect class={{this.classes}} data-id={{@id}} x={{@x}} y={{@y}} rx={{this.borderRadius}} ry={{this.borderRadius}} width={{@width}} height={{@height}} style={{this.nodeStyle}} shape-rendering={{@shapeRendering}} {{listen \"click\" this.handleClick}} ...attributes />", {
  strictMode: true,
  scope: () => ({
    listen
  })
}), _MiniMapNode);

var _class$f, _descriptor$f, _descriptor2$c, _MiniMap;
const defaultWidth = 200;
const defaultHeight = 150;
let MiniMap = (_class$f = (_MiniMap = class MiniMap extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$f, this);
    _initializerDefineProperty(this, "viewport", _descriptor2$c, this);
    _defineProperty(this, "unsubscribeViewport", void 0);
    _defineProperty(this, "minimapElement", void 0);
    _defineProperty(this, "minimapInstance", void 0);
    _defineProperty(this, "handleSvgClick", event => {
      if (!this.args.onClick) {
        return;
      }
      let target = event.currentTarget;
      let rect = target.getBoundingClientRect();
      let box = this.viewBoxRect;
      let x = box.x + (event.clientX - rect.left) / rect.width * box.width;
      let y = box.y + (event.clientY - rect.top) / rect.height * box.height;
      this.args.onClick(event, {
        x,
        y
      });
    });
    _defineProperty(this, "handleNodeClick", (nodeId, event) => {
      let node = this.store?.getNode(nodeId);
      if (!node || !this.args.onNodeClick) {
        return;
      }
      event.stopPropagation();
      this.args.onNodeClick(event, node);
    });
  }
  get width() {
    return this.args.width ?? defaultWidth;
  }
  get height() {
    return this.args.height ?? defaultHeight;
  }
  get positionClasses() {
    let position = this.args.position ?? 'bottom-right';
    return position.replace('-', ' ');
  }
  get viewBB() {
    let store = this.store;
    let zoom = this.viewport.zoom || 1;
    return {
      x: -this.viewport.x / zoom,
      y: -this.viewport.y / zoom,
      width: (store?.width || 1) / zoom,
      height: (store?.height || 1) / zoom
    };
  }
  get boundingRect() {
    let nodeBounds = this.nodeItems.map(item => ({
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height
    }));
    return this.getBounds([this.viewBB, ...nodeBounds]);
  }
  get viewScale() {
    let bounds = this.boundingRect;
    return Math.max(bounds.width / this.width, bounds.height / this.height, 1);
  }
  get offset() {
    return (this.args.offsetScale ?? 5) * this.viewScale;
  }
  get viewBoxRect() {
    let bounds = this.boundingRect;
    let viewWidth = this.viewScale * this.width;
    let viewHeight = this.viewScale * this.height;
    return {
      x: bounds.x - (viewWidth - bounds.width) / 2 - this.offset,
      y: bounds.y - (viewHeight - bounds.height) / 2 - this.offset,
      width: viewWidth + this.offset * 2,
      height: viewHeight + this.offset * 2
    };
  }
  get viewBox() {
    let box = this.viewBoxRect;
    return `${box.x} ${box.y} ${box.width} ${box.height}`;
  }
  get maskPath() {
    let box = this.viewBoxRect;
    let view = this.viewBB;
    let offset = this.offset;
    return `M${box.x - offset},${box.y - offset}h${box.width + offset * 2}v${box.height + offset * 2}h${-box.width - offset * 2}z M${view.x},${view.y}h${view.width}v${view.height}h${-view.width}z`;
  }
  get labelledBy() {
    return 'ember-flow__minimap-desc';
  }
  get ariaLabel() {
    return this.args.ariaLabel ?? 'Mini Map';
  }
  get nodeComponent() {
    return this.args.nodeComponent;
  }
  get rootStyle() {
    let declarations = [this.cssVariable('--xy-minimap-background-color-props', this.args.bgColor), this.cssVariable('--xy-minimap-mask-background-color-props', this.args.maskColor), this.cssVariable('--xy-minimap-mask-stroke-color-props', this.args.maskStrokeColor), this.cssVariable('--xy-minimap-mask-stroke-width-props', typeof this.args.maskStrokeWidth === 'number' ? this.args.maskStrokeWidth * this.viewScale : undefined)].filter(Boolean);
    return declarations.length > 0 ? htmlSafe(declarations.join('; ')) : undefined;
  }
  get svgStyle() {
    let declarations = [this.cssVariable('--xy-minimap-node-stroke-width-props', typeof this.args.nodeStrokeWidth === 'number' ? this.args.nodeStrokeWidth : undefined)].filter(Boolean);
    return declarations.length > 0 ? htmlSafe(declarations.join('; ')) : undefined;
  }
  get nodeItems() {
    let store = this.store;
    if (!store) {
      return [];
    }
    store.revision;
    return store.getNodes().filter(node => !node.hidden).map(node => ({
      node,
      x: store.getNodePosition(node).x,
      y: store.getNodePosition(node).y,
      width: store.getNodeWidth(node),
      height: store.getNodeHeight(node),
      color: this.resolveNodeAttribute(this.args.nodeColor, node) ?? this.nodeBackground(node),
      strokeColor: this.resolveNodeAttribute(this.args.nodeStrokeColor, node),
      className: this.resolveNodeAttribute(this.args.nodeClassName ?? this.args.nodeClass, node)
    }));
  }
  registerMiniMap(element) {
    let store = getFlowStore(element);
    if (!store) {
      return;
    }
    this.minimapElement = element;
    if (this.store === store) {
      this.viewport = store.getViewport();
      this.installOrUpdateMiniMap();
      return;
    }
    this.unsubscribeViewport?.();
    this.minimapInstance?.destroy();
    this.minimapInstance = undefined;
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange(viewport => {
      this.viewport = {
        ...viewport
      };
      this.installOrUpdateMiniMap();
    });
    this.installOrUpdateMiniMap();
  }
  unregisterMiniMap() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.minimapInstance?.destroy();
    this.minimapInstance = undefined;
    this.minimapElement = undefined;
    this.store = undefined;
  }
  getBounds(rects) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let rect of rects) {
      minX = Math.min(minX, rect.x);
      minY = Math.min(minY, rect.y);
      maxX = Math.max(maxX, rect.x + rect.width);
      maxY = Math.max(maxY, rect.y + rect.height);
    }
    return {
      x: minX,
      y: minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1)
    };
  }
  resolveNodeAttribute(attribute, node) {
    return typeof attribute === 'function' ? attribute(node) : attribute;
  }
  nodeBackground(node) {
    let style = node.style;
    if (!style || typeof style === 'string') {
      return undefined;
    }
    let background = style['background'] ?? style['backgroundColor'];
    return background === undefined ? undefined : String(background);
  }
  cssVariable(name, value) {
    return value === undefined ? undefined : `${name}: ${value}`;
  }
  installOrUpdateMiniMap() {
    let store = this.store;
    let svg = this.minimapElement?.querySelector('.ember-flow__minimap-svg');
    if (!store?.panZoom || !svg) {
      return;
    }
    this.minimapInstance ??= umdExports.XYMinimap({
      domNode: svg,
      panZoom: store.panZoom,
      getTransform: () => [this.viewport.x, this.viewport.y, this.viewport.zoom],
      getViewScale: () => this.viewScale
    });
    this.minimapInstance.update({
      translateExtent: store.translateExtent,
      width: store.width,
      height: store.height,
      inversePan: this.args.inversePan,
      pannable: this.args.pannable ?? false,
      zoomStep: this.args.zoomStep,
      zoomable: this.args.zoomable ?? false
    });
  }
}, setComponentTemplate(precompileTemplate("<div class=\"ember-flow__minimap ember-flow__panel {{this.positionClasses}}\" data-testid=\"ember-flow__minimap\" style={{this.rootStyle}} {{miniMap this}} ...attributes>\n  <svg width={{this.width}} height={{this.height}} viewBox={{this.viewBox}} class=\"ember-flow__minimap-svg\" role=\"img\" aria-labelledby={{this.labelledBy}} style={{this.svgStyle}} {{listen \"click\" this.handleSvgClick}}>\n    {{#if this.ariaLabel}}\n      <title id={{this.labelledBy}}>{{this.ariaLabel}}</title>\n    {{/if}}\n\n    {{#each this.nodeItems as |item|}}\n      {{#if this.nodeComponent}}\n        <this.nodeComponent @id={{item.node.id}} @node={{item.node}} @x={{item.x}} @y={{item.y}} @width={{item.width}} @height={{item.height}} @borderRadius={{@nodeBorderRadius}} @color={{item.color}} @strokeColor={{item.strokeColor}} @strokeWidth={{@nodeStrokeWidth}} @className={{item.className}} @selected={{item.node.selected}} @shapeRendering=\"crispEdges\" @onClick={{this.handleNodeClick}} />\n      {{else}}\n        <MiniMapNode @id={{item.node.id}} @x={{item.x}} @y={{item.y}} @width={{item.width}} @height={{item.height}} @borderRadius={{@nodeBorderRadius}} @color={{item.color}} @strokeColor={{item.strokeColor}} @strokeWidth={{@nodeStrokeWidth}} @className={{item.className}} @selected={{item.node.selected}} @shapeRendering=\"crispEdges\" @onClick={{this.handleNodeClick}} />\n      {{/if}}\n    {{/each}}\n\n    <path class=\"ember-flow__minimap-mask\" d={{this.maskPath}} fill-rule=\"evenodd\" pointer-events=\"none\" />\n  </svg>\n</div>", {
  strictMode: true,
  scope: () => ({
    miniMap,
    listen,
    MiniMapNode
  })
}), _MiniMap), _MiniMap), _descriptor$f = _applyDecoratedDescriptor(_class$f.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$c = _applyDecoratedDescriptor(_class$f.prototype, "viewport", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {
      x: 0,
      y: 0,
      zoom: 1
    };
  }
}), _class$f);

function dispatchResize(element, id, controlPosition, change, childChanges, resizing, resizeDirection) {
  let store = getFlowStore(element);
  let node = store?.getNode(id);
  if (!store || !node) {
    return;
  }
  let currentPosition = store.getNodeUserPosition(node);
  let dimensions = {
    width: change.width ?? store.getNodeWidth(node),
    height: change.height ?? store.getNodeHeight(node)
  };
  let position = {
    x: change.x ?? currentPosition.x,
    y: change.y ?? currentPosition.y
  };
  element.dispatchEvent(new CustomEvent('ember-flow:node-resize', {
    bubbles: true,
    detail: {
      id,
      position,
      dimensions,
      controlPosition,
      childChanges,
      setAttributes: !resizeDirection ? true : resizeDirection === 'horizontal' ? 'width' : 'height',
      resizing
    }
  }));
}
var resizeControl = modifier((element, [nodeId, controlPosition, minWidth, minHeight, maxWidth, maxHeight, keepAspectRatio, resizeDirection, shouldResize, onResizeStart, onResize, onResizeEnd]) => {
  let resizer;
  let frame;
  let latestChildChanges = [];
  let install = () => {
    let store = getFlowStore(element);
    let id = nodeId ?? element.closest('.ember-flow__node')?.dataset['id'];
    if (!store || !id) {
      frame = requestAnimationFrame(install);
      return;
    }
    resizer = umdExports.XYResizer({
      domNode: element,
      nodeId: id,
      getStoreItems: () => ({
        nodeLookup: store.nodeLookup,
        transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
        snapGrid: store.snapGrid,
        snapToGrid: store.snapToGrid,
        nodeOrigin: store.nodeOrigin,
        paneDomNode: store.domNode,
        panBy: store.panBy.bind(store),
        autoPanOnResize: store.autoPanOnNodeDrag,
        autoPanSpeed: store.autoPanSpeed
      }),
      onChange: (change, childChanges) => {
        latestChildChanges = childChanges;
        dispatchResize(element, id, controlPosition, change, childChanges, true, resizeDirection);
      },
      onEnd: change => {
        dispatchResize(element, id, controlPosition, change, latestChildChanges, false, resizeDirection);
        latestChildChanges = [];
      }
    });
    resizer.update({
      controlPosition,
      boundaries: {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight
      },
      keepAspectRatio,
      resizeDirection,
      shouldResize,
      onResizeStart,
      onResize,
      onResizeEnd
    });
  };
  install();
  return () => {
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
    }
    resizer?.destroy();
  };
});

var _class$e, _descriptor$e, _NodeResizeControl;
let NodeResizeControl = (_class$e = (_NodeResizeControl = class NodeResizeControl extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "contextNodeId", _descriptor$e, this);
  }
  get variant() {
    return this.args.variant ?? umdExports.ResizeControlVariant.Handle;
  }
  get nodeId() {
    return this.args.nodeId ?? this.args.node?.id ?? this.contextNodeId ?? undefined;
  }
  get controlPosition() {
    return this.args.position ?? (this.variant === umdExports.ResizeControlVariant.Line ? 'right' : 'bottom-right');
  }
  get minWidth() {
    return this.args.minWidth ?? 10;
  }
  get minHeight() {
    return this.args.minHeight ?? 10;
  }
  get maxWidth() {
    return this.args.maxWidth ?? Number.MAX_VALUE;
  }
  get maxHeight() {
    return this.args.maxHeight ?? Number.MAX_VALUE;
  }
  get keepAspectRatio() {
    return this.args.keepAspectRatio ?? false;
  }
  get positionParts() {
    return this.controlPosition.split('-');
  }
  get controlClasses() {
    return ['ember-flow__resize-control', 'nodrag', 'nopan', ...this.positionParts, this.variant, this.args.class, this.args.className].filter(Boolean).join(' ');
  }
  get controlStyle() {
    let declarations = [toCss(this.args.style)];
    let color = this.args.color;
    if (color) {
      declarations.push(this.variant === umdExports.ResizeControlVariant.Line ? `border-color: ${color};` : `background-color: ${color};`);
    }
    if (this.variant === umdExports.ResizeControlVariant.Handle && this.args.autoScale !== false) {
      declarations.push('scale: var(--ember-flow-resize-control-scale, 1);');
    }
    let css = declarations.filter(Boolean).join(' ');
    return css ? htmlSafe(css) : undefined;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<div class={{this.controlClasses}} style={{this.controlStyle}} {{nodeIdContext this}} {{resizeControl this.nodeId this.controlPosition this.minWidth this.minHeight this.maxWidth this.maxHeight this.keepAspectRatio @resizeDirection @shouldResize @onResizeStart @onResize @onResizeEnd}} ...attributes>\n  {{yield}}\n</div>", {
  strictMode: true,
  scope: () => ({
    nodeIdContext,
    resizeControl
  })
}), _NodeResizeControl), _NodeResizeControl), _descriptor$e = _applyDecoratedDescriptor(_class$e.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _class$e);

var _NodeResizer;
class NodeResizer extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "linePositions", umdExports.XY_RESIZER_LINE_POSITIONS);
    _defineProperty(this, "handlePositions", umdExports.XY_RESIZER_HANDLE_POSITIONS);
    _defineProperty(this, "lineVariant", umdExports.ResizeControlVariant.Line);
  }
  get isVisible() {
    if ('isVisible' in this.args) {
      return Boolean(this.args.isVisible);
    }
    return true;
  }
}
_NodeResizer = NodeResizer;
setComponentTemplate(precompileTemplate("{{#if this.isVisible}}\n  {{#each this.linePositions as |position|}}\n    <NodeResizeControl @node={{@node}} @nodeId={{@nodeId}} @position={{position}} @variant={{this.lineVariant}} @color={{@color}} @minWidth={{@minWidth}} @minHeight={{@minHeight}} @maxWidth={{@maxWidth}} @maxHeight={{@maxHeight}} @keepAspectRatio={{@keepAspectRatio}} @resizeDirection={{@resizeDirection}} @autoScale={{@autoScale}} @shouldResize={{@shouldResize}} @onResizeStart={{@onResizeStart}} @onResize={{@onResize}} @onResizeEnd={{@onResizeEnd}} @className={{@lineClassName}} @style={{@lineStyle}} />\n  {{/each}}\n  {{#each this.handlePositions as |position|}}\n    <NodeResizeControl @node={{@node}} @nodeId={{@nodeId}} @position={{position}} @color={{@color}} @minWidth={{@minWidth}} @minHeight={{@minHeight}} @maxWidth={{@maxWidth}} @maxHeight={{@maxHeight}} @keepAspectRatio={{@keepAspectRatio}} @resizeDirection={{@resizeDirection}} @autoScale={{@autoScale}} @shouldResize={{@shouldResize}} @onResizeStart={{@onResizeStart}} @onResize={{@onResize}} @onResizeEnd={{@onResizeEnd}} @className={{@handleClassName}} @style={{@handleStyle}} />\n  {{/each}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    NodeResizeControl
  })
}), _NodeResizer);

var nodeToolbar = modifier((element, [owner]) => {
  owner.registerNodeToolbar(element);
  return () => {
    owner.unregisterNodeToolbar();
  };
});

var _class$d, _descriptor$d, _descriptor2$b, _NodeToolbar;
let NodeToolbar = (_class$d = (_NodeToolbar = class NodeToolbar extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$d, this);
    _initializerDefineProperty(this, "contextNodeId", _descriptor2$b, this);
    _defineProperty(this, "viewport", {
      x: 0,
      y: 0,
      zoom: 1
    });
    _defineProperty(this, "element", void 0);
    _defineProperty(this, "unsubscribeViewport", void 0);
    _defineProperty(this, "unsubscribeNodeGeometry", void 0);
  }
  get toolbarState() {
    let nodes = this.toolbarNodes;
    let isActive = this.isActive(nodes);
    return {
      nodes,
      isActive,
      shouldRender: isActive && nodes.length > 0,
      classes: this.toolbarClasses,
      dataId: nodes.map(node => node.id).join(' '),
      style: this.getToolbarStyle(nodes),
      context: this.getToolbarContext(nodes, isActive)
    };
  }
  get toolbarStore() {
    return this.store;
  }
  isActive(nodes) {
    if (typeof this.args.isVisible === 'boolean') {
      return this.args.isVisible;
    }
    if (this.store) {
      return nodes.length === 1 && Boolean(nodes[0]?.selected) && this.store.selectedNodes.length === 1;
    }
    return nodes.length === 1 && Boolean(nodes[0]?.selected);
  }
  get toolbarNodes() {
    this.store?.revision;
    let ids = this.nodeIds;
    if (!this.store) {
      return [];
    }
    return ids.map(id => id ? this.store?.getInternalNode(id) : undefined).filter(node => Boolean(node));
  }
  get nodeIds() {
    if (Array.isArray(this.args.nodeId)) {
      return this.args.nodeId;
    }
    return [this.args.nodeId ?? this.args.node?.id ?? this.contextNodeId].filter(id => Boolean(id));
  }
  get toolbarClasses() {
    return ['ember-flow__node-toolbar', this.args.className].filter(Boolean).join(' ');
  }
  getToolbarTransform(nodes) {
    let position = this.args.position ?? umdExports.Position.Top;
    let align = this.args.align ?? 'center';
    let offset = this.args.offset ?? 10;
    if (nodes.length === 0) {
      return '';
    }
    return umdExports.getNodeToolbarTransform(umdExports.getInternalNodesBounds(new Map(nodes.map(node => [node.id, node]))), this.viewport, position, offset, align);
  }
  getToolbarZIndex(nodes) {
    return Math.max(...nodes.map(node => (node.internals?.z ?? 0) + 1), 1);
  }
  getToolbarStyle(nodes) {
    let transform = this.getToolbarTransform(nodes);
    let zIndex = this.getToolbarZIndex(nodes);
    return htmlSafe(['position: absolute', 'pointer-events: all', 'transform-origin: 0 0', transform ? `transform: ${transform}` : undefined, `z-index: ${zIndex}`, toCss(this.args.style)].filter(Boolean).join('; '));
  }
  getToolbarContext(nodes, isVisible) {
    return {
      nodes: nodes.map(node => this.store?.getNode(node.id) ?? node.internals.userNode),
      nodeIds: nodes.map(node => node.id),
      isVisible
    };
  }
  registerNodeToolbar(element) {
    this.element = element;
    this.updateToolbarElement();
  }
  unregisterNodeToolbar() {
    this.element = undefined;
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store) {
      return;
    }
    if (this.store === store) {
      this.viewport = store.getViewport();
      this.updateToolbarElement();
      return;
    }
    this.unsubscribeViewport?.();
    this.unsubscribeNodeGeometry?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange(viewport => {
      this.viewport = viewport;
      this.updateToolbarElement();
    });
    this.unsubscribeNodeGeometry = store.onNodeGeometryChange(nodeId => {
      if (this.nodeIds.includes(nodeId)) {
        this.updateToolbarElement();
      }
    });
  }
  unregisterFlowContext() {
    this.unsubscribeViewport?.();
    this.unsubscribeNodeGeometry?.();
    this.unsubscribeViewport = undefined;
    this.unsubscribeNodeGeometry = undefined;
    this.store = undefined;
    this.element = undefined;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
  updateToolbarElement() {
    let element = this.element;
    if (!element) {
      return;
    }
    let nodes = this.toolbarNodes;
    if (!this.isActive(nodes) || nodes.length === 0) {
      return;
    }
    element.style.transform = this.getToolbarTransform(nodes);
    element.style.zIndex = String(this.getToolbarZIndex(nodes));
  }
}, setComponentTemplate(precompileTemplate("<span hidden {{flowContext this}}></span>\n<span hidden {{nodeIdContext this}}></span>\n{{#let this.toolbarState as |toolbar|}}\n  {{#if toolbar.shouldRender}}\n    <div class={{toolbar.classes}} data-id={{toolbar.dataId}} style={{toolbar.style}} {{portal \".ember-flow__renderer\"}} {{nodeToolbar this}} ...attributes>\n      {{yield this.toolbarStore toolbar.context}}\n    </div>\n  {{/if}}\n{{/let}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    nodeIdContext,
    portal,
    nodeToolbar
  })
}), _NodeToolbar), _NodeToolbar), _descriptor$d = _applyDecoratedDescriptor(_class$d.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$b = _applyDecoratedDescriptor(_class$d.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _class$d);

var _Panel;
class Panel extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "markEventHandled", event => {
      markFlowEventAsHandled(event);
    });
  }
  get positionClasses() {
    let position = this.args.position ?? 'top-left';
    return position.replace('-', ' ');
  }
}
_Panel = Panel;
setComponentTemplate(precompileTemplate("<div class=\"ember-flow__panel nopan nowheel {{this.positionClasses}}\" {{listen \"pointerdown\" this.markEventHandled}} {{listen \"pointermove\" this.markEventHandled}} {{listen \"pointerup\" this.markEventHandled}} {{listen \"pointercancel\" this.markEventHandled}} {{listen \"wheel\" this.markEventHandled}} {{listen \"keydown\" this.markEventHandled}} {{listen \"keyup\" this.markEventHandled}} ...attributes>\n  {{yield}}\n</div>", {
  strictMode: true,
  scope: () => ({
    listen
  })
}), _Panel);

var _SimpleBezierEdge;
class SimpleBezierEdge extends Component {
  get pathData() {
    return getSimpleBezierPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      sourcePosition: this.args.sourcePosition,
      targetX: this.args.targetX,
      targetY: this.args.targetY,
      targetPosition: this.args.targetPosition
    });
  }
  get path() {
    return this.pathData[0];
  }
  get labelX() {
    return this.pathData[1];
  }
  get labelY() {
    return this.pathData[2];
  }
}
_SimpleBezierEdge = SimpleBezierEdge;
setComponentTemplate(precompileTemplate("<BaseEdge @id={{@id}} @path={{this.path}} @labelX={{this.labelX}} @labelY={{this.labelY}} @label={{@label}} @labelStyle={{@labelStyle}} @labelShowBg={{@labelShowBg}} @labelBgStyle={{@labelBgStyle}} @labelBgPadding={{@labelBgPadding}} @labelBgBorderRadius={{@labelBgBorderRadius}} @markerStart={{@markerStart}} @markerEnd={{@markerEnd}} @interactionWidth={{@interactionWidth}} @style={{@style}} ...attributes />", {
  strictMode: true,
  scope: () => ({
    BaseEdge
  })
}), _SimpleBezierEdge);

var _SmoothStepEdge;
class SmoothStepEdge extends Component {
  get pathData() {
    return umdExports.getSmoothStepPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      sourcePosition: this.args.sourcePosition,
      targetX: this.args.targetX,
      targetY: this.args.targetY,
      targetPosition: this.args.targetPosition,
      borderRadius: this.args.pathOptions?.borderRadius,
      offset: this.args.pathOptions?.offset,
      stepPosition: this.args.pathOptions?.stepPosition
    });
  }
  get path() {
    return this.pathData[0];
  }
  get labelX() {
    return this.pathData[1];
  }
  get labelY() {
    return this.pathData[2];
  }
}
_SmoothStepEdge = SmoothStepEdge;
setComponentTemplate(precompileTemplate("<BaseEdge @id={{@id}} @path={{this.path}} @labelX={{this.labelX}} @labelY={{this.labelY}} @label={{@label}} @labelStyle={{@labelStyle}} @labelShowBg={{@labelShowBg}} @labelBgStyle={{@labelBgStyle}} @labelBgPadding={{@labelBgPadding}} @labelBgBorderRadius={{@labelBgBorderRadius}} @markerStart={{@markerStart}} @markerEnd={{@markerEnd}} @interactionWidth={{@interactionWidth}} @style={{@style}} ...attributes />", {
  strictMode: true,
  scope: () => ({
    BaseEdge
  })
}), _SmoothStepEdge);

var _StepEdge;
class StepEdge extends Component {
  get pathData() {
    return umdExports.getSmoothStepPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      sourcePosition: this.args.sourcePosition,
      targetX: this.args.targetX,
      targetY: this.args.targetY,
      targetPosition: this.args.targetPosition,
      borderRadius: 0,
      offset: this.args.pathOptions?.offset
    });
  }
  get path() {
    return this.pathData[0];
  }
  get labelX() {
    return this.pathData[1];
  }
  get labelY() {
    return this.pathData[2];
  }
}
_StepEdge = StepEdge;
setComponentTemplate(precompileTemplate("<BaseEdge @id={{@id}} @path={{this.path}} @labelX={{this.labelX}} @labelY={{this.labelY}} @label={{@label}} @labelStyle={{@labelStyle}} @labelShowBg={{@labelShowBg}} @labelBgStyle={{@labelBgStyle}} @labelBgPadding={{@labelBgPadding}} @labelBgBorderRadius={{@labelBgBorderRadius}} @markerStart={{@markerStart}} @markerEnd={{@markerEnd}} @interactionWidth={{@interactionWidth}} @style={{@style}} ...attributes />", {
  strictMode: true,
  scope: () => ({
    BaseEdge
  })
}), _StepEdge);

var _StraightEdge;
class StraightEdge extends Component {
  get pathData() {
    return umdExports.getStraightPath({
      sourceX: this.args.sourceX,
      sourceY: this.args.sourceY,
      targetX: this.args.targetX,
      targetY: this.args.targetY
    });
  }
  get path() {
    return this.pathData[0];
  }
  get labelX() {
    return this.pathData[1];
  }
  get labelY() {
    return this.pathData[2];
  }
}
_StraightEdge = StraightEdge;
setComponentTemplate(precompileTemplate("<BaseEdge @id={{@id}} @path={{this.path}} @labelX={{this.labelX}} @labelY={{this.labelY}} @label={{@label}} @labelStyle={{@labelStyle}} @labelShowBg={{@labelShowBg}} @labelBgStyle={{@labelBgStyle}} @labelBgPadding={{@labelBgPadding}} @labelBgBorderRadius={{@labelBgBorderRadius}} @markerStart={{@markerStart}} @markerEnd={{@markerEnd}} @interactionWidth={{@interactionWidth}} @style={{@style}} ...attributes />", {
  strictMode: true,
  scope: () => ({
    BaseEdge
  })
}), _StraightEdge);

var _class$c, _descriptor$c, _UseEmberFlow;
let UseEmberFlow = (_class$c = (_UseEmberFlow = class UseEmberFlow extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$c, this);
  }
  registerFlowContext(element) {
    this.store = getFlowStore(element);
  }
  unregisterFlowContext() {
    this.store = undefined;
  }
  get hasStore() {
    return Boolean(this.store);
  }
  get flow() {
    return this.store;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.flow}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseEmberFlow), _UseEmberFlow), _descriptor$c = _applyDecoratedDescriptor(_class$c.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class$c);

var _class$b, _descriptor$b, _descriptor2$a, _UseConnection;
let UseConnection = (_class$b = (_UseConnection = class UseConnection extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$b, this);
    _initializerDefineProperty(this, "connection", _descriptor2$a, this);
    _defineProperty(this, "unsubscribeConnection", void 0);
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeConnection?.();
    this.store = store;
    this.unsubscribeConnection = store.onConnectionChange(connection => {
      this.connection = connection;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeConnection?.();
    this.unsubscribeConnection = undefined;
    this.store = undefined;
    this.connection = umdExports.initialConnection;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.connection}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseConnection), _UseConnection), _descriptor$b = _applyDecoratedDescriptor(_class$b.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$a = _applyDecoratedDescriptor(_class$b.prototype, "connection", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return umdExports.initialConnection;
  }
}), _class$b);

var _class$a, _descriptor$a, _descriptor2$9, _UseEdges;
let UseEdges = (_class$a = (_UseEdges = class UseEdges extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$a, this);
    _initializerDefineProperty(this, "revision", _descriptor2$9, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get edges() {
    this.revision;
    return this.store?.getEdges() ?? [];
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.edges}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseEdges), _UseEdges), _descriptor$a = _applyDecoratedDescriptor(_class$a.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$9 = _applyDecoratedDescriptor(_class$a.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$a);

var _class$9, _descriptor$9, _descriptor2$8, _descriptor3$3, _UseHandleConnections;
let UseHandleConnections = (_class$9 = (_UseHandleConnections = class UseHandleConnections extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$9, this);
    _initializerDefineProperty(this, "contextNodeId", _descriptor2$8, this);
    _initializerDefineProperty(this, "revision", _descriptor3$3, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get nodeId() {
    return this.args.nodeId ?? this.contextNodeId;
  }
  get connections() {
    this.revision;
    if (!this.store || !this.nodeId) {
      return [];
    }
    return this.store.getHandleConnections({
      nodeId: this.nodeId,
      type: this.args.type,
      id: this.args.id
    });
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n<span hidden aria-hidden=\"true\" class=\"ember-flow__node-id-access\" {{nodeIdContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.connections}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    nodeIdContext
  })
}), _UseHandleConnections), _UseHandleConnections), _descriptor$9 = _applyDecoratedDescriptor(_class$9.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$8 = _applyDecoratedDescriptor(_class$9.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor3$3 = _applyDecoratedDescriptor(_class$9.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$9);

var _class$8, _descriptor$8, _descriptor2$7, _descriptor3$2, _UseInternalNode;
let UseInternalNode = (_class$8 = (_UseInternalNode = class UseInternalNode extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$8, this);
    _initializerDefineProperty(this, "contextNodeId", _descriptor2$7, this);
    _initializerDefineProperty(this, "revision", _descriptor3$2, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get nodeId() {
    return this.args.nodeId ?? this.args.id ?? this.contextNodeId;
  }
  get internalNode() {
    this.revision;
    return this.nodeId ? this.store?.getInternalNode(this.nodeId) ?? null : null;
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n<span hidden aria-hidden=\"true\" class=\"ember-flow__node-id-access\" {{nodeIdContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.internalNode}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    nodeIdContext
  })
}), _UseInternalNode), _UseInternalNode), _descriptor$8 = _applyDecoratedDescriptor(_class$8.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$7 = _applyDecoratedDescriptor(_class$8.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor3$2 = _applyDecoratedDescriptor(_class$8.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$8);

var _class$7, _descriptor$7, _descriptor2$6, _UseKeyPress;
let UseKeyPress = (_class$7 = (_UseKeyPress = class UseKeyPress extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$7, this);
    _initializerDefineProperty(this, "pressedKeys", _descriptor2$6, this);
    _defineProperty(this, "unsubscribeKeys", void 0);
  }
  get keys() {
    let key = this.args.key;
    if (key === undefined) {
      return [];
    }
    if (key === null) {
      return [];
    }
    return Array.isArray(key) ? key : [key];
  }
  get pressed() {
    if (this.keys.length === 0) {
      return false;
    }
    return this.keys.some(key => this.pressedKeys.has(key));
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeKeys?.();
    this.store = store;
    this.unsubscribeKeys = store.onKeyChange(keys => {
      this.pressedKeys = keys;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeKeys?.();
    this.unsubscribeKeys = undefined;
    this.store = undefined;
    this.pressedKeys = new Set();
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.pressed this.pressedKeys}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseKeyPress), _UseKeyPress), _descriptor$7 = _applyDecoratedDescriptor(_class$7.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$6 = _applyDecoratedDescriptor(_class$7.prototype, "pressedKeys", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return new Set();
  }
}), _class$7);

var _class$6, _descriptor$6, _descriptor2$5, _descriptor3$1, _UseNodeConnections;
let UseNodeConnections = (_class$6 = (_UseNodeConnections = class UseNodeConnections extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$6, this);
    _initializerDefineProperty(this, "contextNodeId", _descriptor2$5, this);
    _initializerDefineProperty(this, "revision", _descriptor3$1, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get nodeId() {
    return this.args.nodeId ?? this.args.id ?? this.contextNodeId;
  }
  get connections() {
    this.revision;
    if (!this.store || !this.nodeId) {
      return [];
    }
    return this.store.getNodeConnections({
      nodeId: this.nodeId,
      type: this.args.handleType,
      handleId: this.args.handleId
    });
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n<span hidden aria-hidden=\"true\" class=\"ember-flow__node-id-access\" {{nodeIdContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.connections}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    nodeIdContext
  })
}), _UseNodeConnections), _UseNodeConnections), _descriptor$6 = _applyDecoratedDescriptor(_class$6.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$5 = _applyDecoratedDescriptor(_class$6.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor3$1 = _applyDecoratedDescriptor(_class$6.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$6);

var _class$5, _descriptor$5, _UseNodeId;
let UseNodeId = (_class$5 = (_UseNodeId = class UseNodeId extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "contextNodeId", _descriptor$5, this);
  }
  get nodeId() {
    return this.contextNodeId;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__node-id-access\" {{nodeIdContext this}}></span>\n{{yield this.nodeId}}", {
  strictMode: true,
  scope: () => ({
    nodeIdContext
  })
}), _UseNodeId), _UseNodeId), _descriptor$5 = _applyDecoratedDescriptor(_class$5.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _class$5);

var _class$4, _descriptor$4, _descriptor2$4, _UseNodes;
let UseNodes = (_class$4 = (_UseNodes = class UseNodes extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$4, this);
    _initializerDefineProperty(this, "revision", _descriptor2$4, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get nodes() {
    this.revision;
    return this.store?.getNodes() ?? [];
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.nodes}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseNodes), _UseNodes), _descriptor$4 = _applyDecoratedDescriptor(_class$4.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$4 = _applyDecoratedDescriptor(_class$4.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$4);

var _class$3, _descriptor$3, _descriptor2$3, _descriptor3, _UseNodesData;
let UseNodesData = (_class$3 = (_UseNodesData = class UseNodesData extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$3, this);
    _initializerDefineProperty(this, "contextNodeId", _descriptor2$3, this);
    _initializerDefineProperty(this, "revision", _descriptor3, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get nodeIds() {
    if (Array.isArray(this.args.nodeIds)) {
      return this.args.nodeIds;
    }
    return [this.args.nodeIds ?? this.args.nodeId ?? this.contextNodeId].filter(id => Boolean(id));
  }
  get nodesData() {
    this.revision;
    if (!this.store) {
      return [];
    }
    return this.nodeIds.map(id => this.store?.getNode(id)).filter(node => Boolean(node)).map(node => ({
      id: node.id,
      type: node.type,
      data: node.data
    }));
  }
  get nodeData() {
    return this.nodesData[0] ?? null;
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
  registerNodeContext(element) {
    this.contextNodeId = getNodeId(element);
  }
  unregisterNodeContext() {
    this.contextNodeId = null;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n<span hidden aria-hidden=\"true\" class=\"ember-flow__node-id-access\" {{nodeIdContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.nodeData this.nodesData}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext,
    nodeIdContext
  })
}), _UseNodesData), _UseNodesData), _descriptor$3 = _applyDecoratedDescriptor(_class$3.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$3 = _applyDecoratedDescriptor(_class$3.prototype, "contextNodeId", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class$3.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$3);

var _class$2, _descriptor$2, _descriptor2$2, _UseNodesInitialized;
let UseNodesInitialized = (_class$2 = (_UseNodesInitialized = class UseNodesInitialized extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$2, this);
    _initializerDefineProperty(this, "revision", _descriptor2$2, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get initialized() {
    this.revision;
    return this.store?.nodesInitialized ?? false;
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.initialized}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseNodesInitialized), _UseNodesInitialized), _descriptor$2 = _applyDecoratedDescriptor(_class$2.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$2 = _applyDecoratedDescriptor(_class$2.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$2);

var _class$1, _descriptor$1, _descriptor2$1, _UseStore;
let UseStore = (_class$1 = (_UseStore = class UseStore extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor$1, this);
    _initializerDefineProperty(this, "revision", _descriptor2$1, this);
    _defineProperty(this, "unsubscribeStore", void 0);
  }
  get selected() {
    this.revision;
    let store = this.store;
    if (!store) {
      return undefined;
    }
    return this.args.selector ? this.args.selector(store) : store;
  }
  get hasStore() {
    return Boolean(this.store);
  }
  get flow() {
    return this.store;
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeStore?.();
    this.store = store;
    this.unsubscribeStore = store.onChange(() => {
      this.revision = store.revision;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeStore?.();
    this.unsubscribeStore = undefined;
    this.store = undefined;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.selected this.flow}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseStore), _UseStore), _descriptor$1 = _applyDecoratedDescriptor(_class$1.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$1 = _applyDecoratedDescriptor(_class$1.prototype, "revision", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _class$1);

var _class, _descriptor, _descriptor2, _UseViewport;
let UseViewport = (_class = (_UseViewport = class UseViewport extends Component {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "store", _descriptor, this);
    _initializerDefineProperty(this, "currentViewport", _descriptor2, this);
    _defineProperty(this, "unsubscribeViewport", void 0);
  }
  get viewport() {
    return this.currentViewport;
  }
  get hasStore() {
    return Boolean(this.store);
  }
  registerFlowContext(element) {
    let store = getFlowStore(element);
    if (!store || this.store === store) {
      return;
    }
    this.unsubscribeViewport?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange(viewport => {
      this.currentViewport = viewport;
    });
  }
  unregisterFlowContext() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.store = undefined;
  }
}, setComponentTemplate(precompileTemplate("<span hidden aria-hidden=\"true\" class=\"ember-flow__store-access\" {{flowContext this}}></span>\n{{#if this.hasStore}}\n  {{yield this.viewport}}\n{{/if}}", {
  strictMode: true,
  scope: () => ({
    flowContext
  })
}), _UseViewport), _UseViewport), _descriptor = _applyDecoratedDescriptor(_class.prototype, "store", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "currentViewport", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {
      x: 0,
      y: 0,
      zoom: 1
    };
  }
}), _class);

var _ViewportPortal;
class ViewportPortal extends Component {}
_ViewportPortal = ViewportPortal;
setComponentTemplate(precompileTemplate("<div class=\"ember-flow__viewport-portal\" {{portal \".ember-flow__viewport-front\"}} ...attributes>\n  {{yield}}\n</div>", {
  strictMode: true,
  scope: () => ({
    portal
  })
}), _ViewportPortal);

function applyChanges(changes, elements) {
  let updatedElements = [];
  let changesMap = new Map();
  let addItemChanges = [];
  for (let change of changes) {
    if (change.type === 'add') {
      addItemChanges.push(change);
      continue;
    }
    if (change.type === 'remove' || change.type === 'replace') {
      changesMap.set(change.id, [change]);
      continue;
    }
    let elementChanges = changesMap.get(change.id);
    if (elementChanges) {
      elementChanges.push(change);
    } else {
      changesMap.set(change.id, [change]);
    }
  }
  for (let element of elements) {
    let elementChanges = changesMap.get(element.id);
    if (!elementChanges) {
      updatedElements.push(element);
      continue;
    }
    if (elementChanges[0]?.type === 'remove') {
      continue;
    }
    if (elementChanges[0]?.type === 'replace') {
      updatedElements.push({
        ...elementChanges[0].item
      });
      continue;
    }
    let updatedElement = {
      ...element
    };
    for (let change of elementChanges) {
      applyChange(change, updatedElement);
    }
    updatedElements.push(updatedElement);
  }
  for (let change of addItemChanges) {
    if (change.type !== 'add') {
      continue;
    }
    let item = {
      ...change.item
    };
    if (change.index !== undefined) {
      updatedElements.splice(change.index, 0, item);
    } else {
      updatedElements.push(item);
    }
  }
  return updatedElements;
}
function applyChange(change, element) {
  switch (change.type) {
    case 'select':
      element.selected = change.selected;
      break;
    case 'position':
      if ('position' in element && change.position !== undefined) {
        element.position = change.position;
      }
      if ('dragging' in change && change.dragging !== undefined) {
        element.dragging = change.dragging;
      }
      break;
    case 'dimensions':
      if ('measured' in element && change.dimensions !== undefined) {
        element.measured = {
          ...change.dimensions
        };
        if (change.setAttributes === true || change.setAttributes === 'width') {
          element.width = change.dimensions.width;
        }
        if (change.setAttributes === true || change.setAttributes === 'height') {
          element.height = change.dimensions.height;
        }
      }
      if (typeof change.resizing === 'boolean') {
        element.resizing = change.resizing;
      }
      break;
  }
}
function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}

const FLOW_CONTENT_NODE_TYPE = 'ContentNode';
function createFlowContentNode(options) {
  return {
    id: options.id,
    type: FLOW_CONTENT_NODE_TYPE,
    data: {
      role: options.role,
      title: options.title,
      body: options.body,
      markdown: options.markdown,
      sourceId: options.sourceId,
      parentSourceId: options.parentSourceId,
      source: options.source,
      sourceTransform: options.sourceTransform,
      boardBehavior: options.boardBehavior,
      headingDepth: options.headingDepth,
      order: options.order,
      layout: options.layout,
      style: options.style
    },
    position: options.position,
    width: options.width,
    height: options.height,
    selected: options.selected,
    connectable: false,
    className: options.className ?? `extended-content-node extended-content-node--${options.role}`
  };
}
function createFlowSemanticEdge(options) {
  let hidden = options.hidden ?? options.visible === false;
  let visible = options.visible ?? !hidden;
  return {
    id: options.id,
    source: options.source,
    target: options.target,
    sourceHandle: options.sourceHandle,
    targetHandle: options.targetHandle,
    type: options.type,
    label: options.label,
    hidden,
    animated: options.animated,
    reconnectable: options.reconnectable,
    focusable: options.focusable,
    className: ['extended-semantic-edge', `extended-semantic-edge--${options.kind}`, `extended-semantic-edge--${options.role}`, options.className].filter(Boolean).join(' '),
    data: {
      kind: options.kind,
      role: options.role,
      visible,
      layoutWeight: options.layoutWeight,
      layoutPriority: options.layoutPriority,
      preferredDirection: options.preferredDirection
    }
  };
}
function isFlowContentNode(node) {
  return node.type === FLOW_CONTENT_NODE_TYPE;
}
function isFlowSemanticEdge(edge) {
  let data = edge.data;
  return data?.kind === 'connector' || data?.kind === 'annotation' || data?.kind === 'structure';
}
function getFlowSemanticEdgeKind(edge) {
  return isFlowSemanticEdge(edge) ? edge.data.kind : null;
}
function filterFlowSemanticEdges(edges, kind) {
  return edges.filter(edge => isFlowSemanticEdge(edge) && edge.data.kind === kind);
}
function getFlowLayoutParticipation(node) {
  if (!isFlowContentNode(node)) {
    return 'global';
  }
  return node.data.layout?.participation ?? (node.data.sourceId ? 'local' : 'none');
}

const DEFAULT_TONES = ['blue', 'purple', 'green', 'amber', 'rose'];
function slugifyFlowMarkdown(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function parseFlowMarkdownDocument(source, {
  rootId = 'document-root',
  tones = DEFAULT_TONES,
  slugify = slugifyFlowMarkdown,
  processLinks = [],
  processEdgeType = 'smoothstep',
  annotationEdgeType = 'simplebezier',
  animateProcessEdges = true,
  edgeClassNames
} = {}) {
  let tonePalette = tones.length ? tones : DEFAULT_TONES;
  let blocks = [];
  let lines = source.split('\n');
  let currentRoot = null;
  let currentSection = null;
  let sectionIndex = -1;
  let processOrder = 0;
  let annotationIndexByTarget = new Map();
  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) {
      continue;
    }
    let headingMatch = /^(#+)\s+(.+)$/.exec(line);
    if (headingMatch) {
      let depth = headingMatch[1]?.length ?? 1;
      let title = headingMatch[2] ?? '';
      let id = depth === 1 ? rootId : slugify(title);
      let block = {
        id,
        kind: depth === 1 ? 'root' : 'section',
        title,
        body: '',
        depth,
        sectionId: depth === 1 ? null : id,
        tone: depth === 1 ? 'neutral' : tonePalette[(sectionIndex + 1) % tonePalette.length] ?? 'neutral'
      };
      if (depth === 1) {
        currentRoot = block;
      } else {
        sectionIndex += 1;
        block.tone = tonePalette[sectionIndex % tonePalette.length] ?? 'neutral';
        currentSection = block;
      }
      blocks.push(block);
      continue;
    }
    let stepMatch = /^-\s+Step:\s+(.+?)\s+\|\s+(.+)$/.exec(line);
    if (stepMatch && currentSection) {
      processOrder += 1;
      let title = stepMatch[1] ?? '';
      blocks.push({
        id: slugify(title),
        kind: 'step',
        title,
        body: stepMatch[2] ?? '',
        depth: currentSection.depth + 1,
        sectionId: currentSection.id,
        processOrder,
        tone: currentSection.tone
      });
      continue;
    }
    let noteMatch = /^-\s+Note:\s+(.+)$/.exec(line);
    if (noteMatch && currentSection) {
      let targetId = findLastStepIdInSection(blocks, currentSection.id) ?? currentSection.id;
      let nextIndex = (annotationIndexByTarget.get(targetId) ?? 0) + 1;
      annotationIndexByTarget.set(targetId, nextIndex);
      blocks.push({
        id: `${targetId}-note-${nextIndex}`,
        kind: 'annotation',
        title: 'Note',
        body: noteMatch[1] ?? '',
        depth: currentSection.depth + 2,
        sectionId: currentSection.id,
        targetId,
        tone: currentSection.tone
      });
      continue;
    }
    let target = currentSection ?? currentRoot;
    if (target) {
      target.body = target.body ? `${target.body} ${line}` : line;
    }
  }
  let structureEdges = createMarkdownStructureEdges(blocks, rootId, edgeClassNames?.structure);
  let processEdges = processLinks.map(([source, target, label]) => createFlowSemanticEdge({
    id: `${source}-${target}`,
    source,
    target,
    kind: 'connector',
    role: 'transition',
    label,
    type: processEdgeType,
    animated: animateProcessEdges,
    className: edgeClassNames?.process,
    preferredDirection: 'right'
  }));
  let annotationEdges = blocks.filter(block => block.kind === 'annotation').map(annotation => createFlowSemanticEdge({
    id: `${annotation.id}-${annotation.targetId}`,
    source: annotation.id,
    target: annotation.targetId ?? annotation.sectionId ?? rootId,
    kind: 'annotation',
    role: 'comment',
    label: 'note',
    type: annotationEdgeType,
    className: edgeClassNames?.annotation,
    layoutWeight: 0
  }));
  return {
    source,
    rootId,
    blocks,
    structureEdges,
    processEdges,
    annotationEdges,
    blockOrderById: new Map(blocks.map((block, index) => [block.id, index]))
  };
}
function createMarkdownStructureEdges(blocks, rootId, className) {
  let structureEdges = [];
  let sections = blocks.filter(block => block.kind === 'section');
  let steps = blocks.filter(block => block.kind === 'step');
  for (let section of sections) {
    structureEdges.push(createStructureEdge({
      id: `root-${section.id}`,
      source: rootId,
      target: section.id,
      role: 'contains',
      layoutPriority: section.depth,
      className
    }));
  }
  for (let step of steps) {
    structureEdges.push(createStructureEdge({
      id: `${step.sectionId}-${step.id}`,
      source: step.sectionId ?? rootId,
      target: step.id,
      role: 'contains',
      layoutPriority: step.depth,
      className
    }));
  }
  for (let [index, section] of sections.entries()) {
    let next = sections[index + 1];
    if (!next) {
      continue;
    }
    structureEdges.push(createStructureEdge({
      id: `${section.id}-${next.id}`,
      source: section.id,
      target: next.id,
      role: 'next',
      layoutWeight: 0.3,
      preferredDirection: 'down',
      className
    }));
  }
  return structureEdges;
}
function findLastStepIdInSection(blocks, sectionId) {
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    let block = blocks[index];
    if (block?.kind === 'step' && block.sectionId === sectionId) {
      return block.id;
    }
  }
  return undefined;
}
function createStructureEdge(options) {
  return createFlowSemanticEdge({
    ...options,
    kind: 'structure',
    visible: false
  });
}

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - clampProgress(progress), 3);
}
function getNodePositionMap(nodes, getPosition = node => node.position) {
  let positions = new Map();
  for (let node of nodes) {
    positions.set(node.id, {
      ...getPosition(node)
    });
  }
  return positions;
}
function animateNodePositions({
  from,
  to,
  duration = 260,
  easing = easeOutCubic,
  signal,
  onFrame,
  onComplete
}) {
  let animationFrame = 0;
  let cancelled = false;
  let startTime = 0;
  let entries = getAnimationEntries(from, to);
  let cancel = () => {
    cancelled = true;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
  if (signal?.aborted) {
    cancel();
    return cancel;
  }
  let handleAbort = () => cancel();
  signal?.addEventListener('abort', handleAbort, {
    once: true
  });
  let emitFrame = progress => {
    let easedProgress = easing(clampProgress(progress));
    let positions = interpolateEntries(entries, easedProgress);
    let frame = {
      positions,
      progress: clampProgress(progress),
      easedProgress
    };
    onFrame(frame);
    return frame;
  };
  if (duration <= 0 || entries.length === 0) {
    let frame = emitFrame(1);
    onComplete?.(frame);
    signal?.removeEventListener('abort', handleAbort);
    return cancel;
  }
  let tick = timestamp => {
    if (cancelled) {
      signal?.removeEventListener('abort', handleAbort);
      return;
    }
    startTime ||= timestamp;
    let progress = (timestamp - startTime) / duration;
    let frame = emitFrame(progress);
    if (progress < 1) {
      animationFrame = requestAnimationFrame(tick);
    } else {
      signal?.removeEventListener('abort', handleAbort);
      onComplete?.(frame);
    }
  };
  animationFrame = requestAnimationFrame(tick);
  return cancel;
}
function getAnimationEntries(from, to) {
  let entries = [];
  for (let [id, target] of to) {
    let source = from.get(id) ?? target;
    entries.push({
      id,
      from: {
        ...source
      },
      to: {
        ...target
      }
    });
  }
  return entries;
}
function interpolateEntries(entries, progress) {
  let positions = new Map();
  for (let {
    id,
    from,
    to
  } of entries) {
    positions.set(id, {
      x: interpolate(from.x, to.x, progress),
      y: interpolate(from.y, to.y, progress)
    });
  }
  return positions;
}
function interpolate(from, to, progress) {
  return from + (to - from) * progress;
}
function clampProgress(progress) {
  if (progress <= 0) {
    return 0;
  }
  if (progress >= 1) {
    return 1;
  }
  return progress;
}

function defaultNodeWidth(node) {
            return node.width ?? node.measured?.width ?? 172;
          }

          function defaultNodeHeight(node) {
            return node.height ?? node.measured?.height ?? 72;
          }

          function computeRanks(nodes, edges) {
            let nodeIds = new Set(nodes.map((node) => node.id));
            let incoming = new Map(nodes.map((node) => [node.id, 0]));
            let outgoing = new Map(nodes.map((node) => [node.id, []]));
            for (let edge of edges) {
              if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
                continue;
              }
              incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
              let targets = outgoing.get(edge.source) ?? [];
              targets.push(edge.target);
              outgoing.set(edge.source, targets);
            }

            let queue = nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0).map((node) => node.id);
            let rank = new Map(nodes.map((node) => [node.id, 0]));
            let visited = new Set();

            while (queue.length) {
              let id = queue.shift();
              if (!id || visited.has(id)) {
                continue;
              }
              visited.add(id);
              for (let target of outgoing.get(id) ?? []) {
                rank.set(target, Math.max(rank.get(target) ?? 0, (rank.get(id) ?? 0) + 1));
                incoming.set(target, (incoming.get(target) ?? 1) - 1);
                if ((incoming.get(target) ?? 0) <= 0) {
                  queue.push(target);
                }
              }
            }

            return rank;
          }

          function boundsFor(nodes, positions, getNodeWidth, getNodeHeight) {
            let rects = nodes
              .map((node) => {
                let position = positions.get(node.id);
                return position
                  ? {
                      x: position.x,
                      y: position.y,
                      width: getNodeWidth(node),
                      height: getNodeHeight(node),
                    }
                  : null;
              })
              .filter(Boolean);
            if (!rects.length) {
              return { x: 0, y: 0, width: 0, height: 0 };
            }
            let minX = Math.min(...rects.map((rect) => rect.x));
            let minY = Math.min(...rects.map((rect) => rect.y));
            let maxX = Math.max(...rects.map((rect) => rect.x + rect.width));
            let maxY = Math.max(...rects.map((rect) => rect.y + rect.height));
            return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
          }

          async function applyElkLayout({ nodes, edges, options = {} }) {
            let direction = options.direction ?? 'LR';
            let origin = options.origin ?? { x: 0, y: 0 };
            let nodeSpacing = options.nodeSpacing ?? 72;
            let rankSpacing = options.rankSpacing ?? 140;
            let getNodeWidth = options.getNodeWidth ?? defaultNodeWidth;
            let getNodeHeight = options.getNodeHeight ?? defaultNodeHeight;
            let eligibleNodes = nodes.filter((node) => options.includeHidden || !node.hidden);
            let eligibleIds = new Set(eligibleNodes.map((node) => node.id));
            let eligibleEdges = edges.filter((edge) => eligibleIds.has(edge.source) && eligibleIds.has(edge.target));
            let rankById = computeRanks(eligibleNodes, eligibleEdges);
            let rankCounts = new Map();
            let positions = new Map();

            for (let node of eligibleNodes) {
              let rank = rankById.get(node.id) ?? 0;
              let row = rankCounts.get(rank) ?? 0;
              rankCounts.set(rank, row + 1);
              let width = getNodeWidth(node);
              let height = getNodeHeight(node);

              positions.set(node.id, direction === 'TB'
                ? {
                    x: origin.x + row * (width + nodeSpacing),
                    y: origin.y + rank * (height + rankSpacing),
                  }
                : {
                    x: origin.x + rank * (width + rankSpacing),
                    y: origin.y + row * (height + nodeSpacing),
                  });
            }

            return {
              nodes: nodes.map((node) => {
                let position = positions.get(node.id);
                return position ? { ...node, position } : node;
              }),
              positions,
              ranks: rankById,
              bounds: boundsFor(eligibleNodes, positions, getNodeWidth, getNodeHeight),
            };
          }

var ConnectionLineType = umdExports.ConnectionLineType;
var ConnectionMode = umdExports.ConnectionMode;
var MarkerType = umdExports.MarkerType;
var PanOnScrollMode = umdExports.PanOnScrollMode;
var Position = umdExports.Position;
var ResizeControlVariant = umdExports.ResizeControlVariant;
var SelectionMode = umdExports.SelectionMode;
var addEdge = umdExports.addEdge;
var getBezierEdgeCenter = umdExports.getBezierEdgeCenter;
var getBezierPath = umdExports.getBezierPath;
var getConnectedEdges = umdExports.getConnectedEdges;
var getEdgeCenter = umdExports.getEdgeCenter;
var getEdgeToolbarTransform = umdExports.getEdgeToolbarTransform;
var getIncomers = umdExports.getIncomers;
var getNodesBounds = umdExports.getNodesBounds;
var getOutgoers = umdExports.getOutgoers;
var getSmoothStepPath = umdExports.getSmoothStepPath;
var getStraightPath = umdExports.getStraightPath;
var getViewportForBounds = umdExports.getViewportForBounds;
var isEdgeBase = umdExports.isEdgeBase;
var isNodeBase = umdExports.isNodeBase;
var reconnectEdge = umdExports.reconnectEdge;
export { Background, BackgroundVariant, BaseEdge, BezierEdge, ConnectionLineType, ConnectionMode, ControlButton, Controls, EdgeLabel, EdgeLabelRenderer, EdgeReconnectAnchor, EdgeText, EdgeToolbar, EmberFlow, EmberFlowProvider, EmberFlowStore, FLOW_CONTENT_NODE_TYPE, Handle, MarkerType, MiniMap, MiniMapNode, NodeResizeControl, NodeResizer, NodeToolbar, PanOnScrollMode, Panel, Position, ResizeControlVariant, SelectionMode, SimpleBezierEdge, SmoothStepEdge, StepEdge, StraightEdge, UseConnection, UseEdges, UseEmberFlow, UseHandleConnections, UseInternalNode, UseKeyPress, UseNodeConnections, UseNodeId, UseNodes, UseNodesData, UseNodesInitialized, UseStore, UseViewport, ViewportPortal, addEdge, animateNodePositions, applyEdgeChanges, applyElkLayout, applyNodeChanges, createFlowContentNode, createFlowEventScope, createFlowSemanticEdge, easeOutCubic, filterFlowSemanticEdges, getBezierEdgeCenter, getBezierPath, getConnectedEdges, getEdgeCenter, getEdgeToolbarTransform, getFlowLayoutParticipation, getFlowSemanticEdgeKind, getFlowStore, getIncomers, getNodeId, getNodePositionMap, getNodesBounds, getOutgoers, getSimpleBezierPath, getSmoothStepPath, getStraightPath, getViewportForBounds, isEdgeBase as isEdge, isFlowContentNode, isFlowKeyboardEventCaptured, isFlowSemanticEdge, isNodeBase as isNode, isTextEntryElement, markFlowEventAsHandled, parseFlowMarkdownDocument, reconnectEdge, slugifyFlowMarkdown, wasFlowEventHandled };
