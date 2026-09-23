var Oe=Object.defineProperty;var Le=Object.getOwnPropertyDescriptor;var A=(i,t,e,o)=>{for(var n=o>1?void 0:o?Le(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Oe(t,e,n),n};var Re=new Set(["primary","accent","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","light-grey","grey","dark-grey","blue-grey","black","white","disabled"]);function zt(i){if(!i)return;let t=i.trim();if(t)return Re.has(t)?`var(--${t}-color)`:t}function E(i,t){return`color-mix(in srgb, ${i} ${t}%, transparent)`}var b={heat:"var(--luna-heat-color, var(--state-climate-heat-color, #ff8100))",boost:"var(--luna-boost-color, var(--deep-orange-color, #ff6f22))",away:"var(--luna-away-color, #8fa6c4)",off:"var(--luna-off-color, var(--disabled-color, #9e9e9e))",max:"var(--luna-max-color, var(--red-color, #f44336))",warning:"var(--luna-warning-color, var(--error-color, #db4437))"};var ct=globalThis,lt=ct.ShadowRoot&&(ct.ShadyCSS===void 0||ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Mt=Symbol(),oe=new WeakMap,Y=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==Mt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(lt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&oe.set(e,t))}return t}toString(){return this.cssText}},J=i=>new Y(typeof i=="string"?i:i+"",void 0,Mt),T=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((o,n,r)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new Y(e,i,Mt)},ie=(i,t)=>{if(lt)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),n=ct.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,i.appendChild(o)}},Pt=lt?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return J(e)})(i):i;var{is:Ie,defineProperty:Ue,getOwnPropertyDescriptor:Ve,getOwnPropertyNames:Be,getOwnPropertySymbols:De,getPrototypeOf:je}=Object,dt=globalThis,re=dt.trustedTypes,Ze=re?re.emptyScript:"",qe=dt.reactiveElementPolyfillSupport,Q=(i,t)=>i,tt={toAttribute(i,t){switch(t){case Boolean:i=i?Ze:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ut=(i,t)=>!Ie(i,t),se={attribute:!0,type:String,converter:tt,reflect:!1,useDefault:!1,hasChanged:ut};Symbol.metadata??=Symbol("metadata"),dt.litPropertyMetadata??=new WeakMap;var z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=se){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&Ue(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){let{get:n,set:r}=Ve(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){let c=n?.call(this);r?.call(this,s),this.requestUpdate(t,c,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??se}static _$Ei(){if(this.hasOwnProperty(Q("elementProperties")))return;let t=je(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Q("properties"))){let e=this.properties,o=[...Be(e),...De(e)];for(let n of o)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)e.unshift(Pt(n))}else t!==void 0&&e.push(Pt(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ie(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:tt).toAttribute(e,o.type);this._$Em=t,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(t,e){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let r=o.getPropertyOptions(n),s=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:tt;this._$Em=n;let c=s.fromAttribute(e,r.type);this[n]=c??this._$Ej?.get(n)??c,this._$Em=null}}requestUpdate(t,e,o,n=!1,r){if(t!==void 0){let s=this.constructor;if(n===!1&&(r=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??ut)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:n,wrapped:r},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),r!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,r]of o){let{wrapped:s}=r,c=this[n];s!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,r,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};z.elementStyles=[],z.shadowRootOptions={mode:"open"},z[Q("elementProperties")]=new Map,z[Q("finalized")]=new Map,qe?.({ReactiveElement:z}),(dt.reactiveElementVersions??=[]).push("2.1.2");var Ut=globalThis,ae=i=>i,ht=Ut.trustedTypes,ce=ht?ht.createPolicy("lit-html",{createHTML:i=>i}):void 0,me="$lit$",H=`lit$${Math.random().toFixed(9).slice(2)}$`,fe="?"+H,Ge=`<${fe}>`,U=document,nt=()=>U.createComment(""),ot=i=>i===null||typeof i!="object"&&typeof i!="function",Vt=Array.isArray,Fe=i=>Vt(i)||typeof i?.[Symbol.iterator]=="function",Ht=`[ 	
\f\r]`,et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,le=/-->/g,de=/>/g,R=RegExp(`>|${Ht}(?:([^\\s"'>=/]+)(${Ht}*=${Ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ue=/'/g,he=/"/g,ge=/^(?:script|style|textarea|title)$/i,Bt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),f=Bt(1),st=Bt(2),fn=Bt(3),V=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),pe=new WeakMap,I=U.createTreeWalker(U,129);function ye(i,t){if(!Vt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(t):t}var Ke=(i,t)=>{let e=i.length-1,o=[],n,r=t===2?"<svg>":t===3?"<math>":"",s=et;for(let c=0;c<e;c++){let a=i[c],l,p,d=-1,m=0;for(;m<a.length&&(s.lastIndex=m,p=s.exec(a),p!==null);)m=s.lastIndex,s===et?p[1]==="!--"?s=le:p[1]!==void 0?s=de:p[2]!==void 0?(ge.test(p[2])&&(n=RegExp("</"+p[2],"g")),s=R):p[3]!==void 0&&(s=R):s===R?p[0]===">"?(s=n??et,d=-1):p[1]===void 0?d=-2:(d=s.lastIndex-p[2].length,l=p[1],s=p[3]===void 0?R:p[3]==='"'?he:ue):s===he||s===ue?s=R:s===le||s===de?s=et:(s=R,n=void 0);let y=s===R&&i[c+1].startsWith("/>")?" ":"";r+=s===et?a+Ge:d>=0?(o.push(l),a.slice(0,d)+me+a.slice(d)+H+y):a+H+(d===-2?c:y)}return[ye(i,r+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},it=class i{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let r=0,s=0,c=t.length-1,a=this.parts,[l,p]=Ke(t,e);if(this.el=i.createElement(l,o),I.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=I.nextNode())!==null&&a.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(me)){let m=p[s++],y=n.getAttribute(d).split(H),v=/([.?@])?(.*)/.exec(m);a.push({type:1,index:r,name:v[2],strings:y,ctor:v[1]==="."?Ot:v[1]==="?"?Lt:v[1]==="@"?Rt:q}),n.removeAttribute(d)}else d.startsWith(H)&&(a.push({type:6,index:r}),n.removeAttribute(d));if(ge.test(n.tagName)){let d=n.textContent.split(H),m=d.length-1;if(m>0){n.textContent=ht?ht.emptyScript:"";for(let y=0;y<m;y++)n.append(d[y],nt()),I.nextNode(),a.push({type:2,index:++r});n.append(d[m],nt())}}}else if(n.nodeType===8)if(n.data===fe)a.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(H,d+1))!==-1;)a.push({type:7,index:r}),d+=H.length-1}r++}}static createElement(t,e){let o=U.createElement("template");return o.innerHTML=t,o}};function Z(i,t,e=i,o){if(t===V)return t;let n=o!==void 0?e._$Co?.[o]:e._$Cl,r=ot(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,e,o)),o!==void 0?(e._$Co??=[])[o]=n:e._$Cl=n),n!==void 0&&(t=Z(i,n._$AS(i,t.values),n,o)),t}var Nt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,n=(t?.creationScope??U).importNode(e,!0);I.currentNode=n;let r=I.nextNode(),s=0,c=0,a=o[0];for(;a!==void 0;){if(s===a.index){let l;a.type===2?l=new rt(r,r.nextSibling,this,t):a.type===1?l=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(l=new It(r,this,t)),this._$AV.push(l),a=o[++c]}s!==a?.index&&(r=I.nextNode(),s++)}return I.currentNode=U,n}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},rt=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),ot(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==V&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Fe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&ot(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=it.createElement(ye(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(e);else{let r=new Nt(n,this),s=r.u(this.options);r.p(e),this.T(s),this._$AH=r}}_$AC(t){let e=pe.get(t.strings);return e===void 0&&pe.set(t.strings,e=new it(t)),e}k(t){Vt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,n=0;for(let r of t)n===e.length?e.push(o=new i(this.O(nt()),this.O(nt()),this,this.options)):o=e[n],o._$AI(r),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=ae(t).nextSibling;ae(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=u}_$AI(t,e=this,o,n){let r=this.strings,s=!1;if(r===void 0)t=Z(this,t,e,0),s=!ot(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{let c=t,a,l;for(t=r[0],a=0;a<r.length-1;a++)l=Z(this,c[o+a],e,a),l===V&&(l=this._$AH[a]),s||=!ot(l)||l!==this._$AH[a],l===u?t=u:t!==u&&(t+=(l??"")+r[a+1]),this._$AH[a]=l}s&&!n&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ot=class extends q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},Lt=class extends q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},Rt=class extends q{constructor(t,e,o,n,r){super(t,e,o,n,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??u)===V)return;let o=this._$AH,n=t===u&&o!==u||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==u&&(o===u||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},It=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}};var We=Ut.litHtmlPolyfillSupport;We?.(it,rt),(Ut.litHtmlVersions??=[]).push("3.3.3");var be=(i,t,e)=>{let o=e?.renderBefore??t,n=o._$litPart$;if(n===void 0){let r=e?.renderBefore??null;o._$litPart$=n=new rt(t.insertBefore(nt(),r),r,void 0,e??{})}return n._$AI(i),n};var Dt=globalThis,$=class extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=be(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};$._$litElement$=!0,$.finalized=!0,Dt.litElementHydrateSupport?.({LitElement:$});var Xe=Dt.litElementPolyfillSupport;Xe?.({LitElement:$});(Dt.litElementVersions??=[]).push("4.2.2");var Ye={attribute:!0,type:String,converter:tt,reflect:!1,hasChanged:ut},Je=(i=Ye,t,e)=>{let{kind:o,metadata:n}=e,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),o==="setter"&&((i=Object.create(i)).wrapped=!0),r.set(e.name,i),o==="accessor"){let{name:s}=e;return{set(c){let a=t.get.call(this);t.set.call(this,c),this.requestUpdate(s,a,i,!0,c)},init(c){return c!==void 0&&this.C(s,void 0,i,c),c}}}if(o==="setter"){let{name:s}=e;return function(c){let a=this[s];t.call(this,c),this.requestUpdate(s,a,i,!0,c)}}throw Error("Unsupported decorator location: "+o)};function N(i){return(t,e)=>typeof e=="object"?Je(i,t,e):((o,n,r)=>{let s=n.hasOwnProperty(r);return n.constructor.createProperty(r,o),s?Object.getOwnPropertyDescriptor(n,r):void 0})(i,t,e)}function B(i){return N({...i,state:!0,attribute:!1})}function O(i,t,e){i.dispatchEvent(new CustomEvent(t,{bubbles:!0,composed:!0,detail:e}))}function M(i="light"){O(window,"haptic",i)}function jt(i){return i!==void 0&&i.action!=="none"}async function ve(i,t,e,o){if(!o||o.action==="none")return;if(o.confirmation){let r=typeof o.confirmation=="object"&&o.confirmation.text?o.confirmation.text:"Are you sure?";if(M("warning"),!window.confirm(r))return}let n=o.entity??e;switch(o.action){case"more-info":n&&O(i,"hass-more-info",{entityId:n});return;case"toggle":n&&(await t.callService("homeassistant","toggle",{entity_id:n}),M("light"));return;case"perform-action":case"call-service":{let r=o.perform_action??o.service;if(!r||!r.includes("."))return;let[s,c]=r.split(".",2);await t.callService(s,c,o.data??o.service_data,o.target),M("light");return}case"navigate":if(!o.navigation_path)return;o.navigation_replace?history.replaceState(null,"",o.navigation_path):history.pushState(null,"",o.navigation_path),O(window,"location-changed",{replace:!!o.navigation_replace});return;case"url":o.url_path&&window.open(o.url_path);return;case"fire-dom-event":O(i,"ll-custom",o);return}}var mt=class{constructor(t,e){this.onGesture=t;this.options=e;this.held=!1;this.startX=0;this.startY=0;this.active=!1;this.down=t=>{t.button===0&&(this.active=!0,this.held=!1,this.startX=t.clientX,this.startY=t.clientY,window.clearTimeout(this.holdTimer),this.options().hold&&(this.holdTimer=window.setTimeout(()=>{this.held=!0,M("light"),this.onGesture("hold")},500)))};this.move=t=>{this.active&&(Math.abs(t.clientX-this.startX)>10||Math.abs(t.clientY-this.startY)>10)&&this.cancel()};this.up=()=>{if(this.active&&(this.active=!1,window.clearTimeout(this.holdTimer),!this.held)){if(!this.options().doubleTap){this.onGesture("tap");return}if(this.tapTimer!==void 0){window.clearTimeout(this.tapTimer),this.tapTimer=void 0,this.onGesture("double_tap");return}this.tapTimer=window.setTimeout(()=>{this.tapTimer=void 0,this.onGesture("tap")},250)}};this.cancel=()=>{this.active=!1,window.clearTimeout(this.holdTimer)};this.key=t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.onGesture("tap"))};this.contextMenu=t=>{this.options().hold&&t.preventDefault()}}};var Zt=2*Math.PI*17,P=class extends ${constructor(){super(...arguments);this.gestures=new mt(e=>void this.onGesture(e),()=>({hold:jt(this.actionFor("hold")),doubleTap:jt(this.actionFor("double_tap"))}))}tickEvery(){return 0}entityId(){return typeof this.config?.entity=="string"?this.config.entity:void 0}async onGesture(e){this.hass&&await ve(this,this.hass,this.entityId(),this.actionFor(e))}getCardSize(){return 1}getGridOptions(){return{columns:6,rows:1,min_columns:3,min_rows:1}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),this.tickTimer=void 0}updated(e){super.updated(e);let o=this.tickEvery();o&&this.tickTimer===void 0?this.tickTimer=window.setInterval(()=>this.requestUpdate(),o):!o&&this.tickTimer!==void 0&&(window.clearInterval(this.tickTimer),this.tickTimer=void 0)}render(){if(!this.config||!this.hass)return u;let e=this.viewModel();if(!e)return u;let o=[`--pill-color: ${e.color}`,`--pill-shape: ${E(e.color,18)}`,`--pill-ring-track: ${E(e.color,22)}`,`--pill-indicator: ${e.indicatorColor??"var(--error-color, #db4437)"}`].join(";"),n=e.progress===void 0?Zt:Zt*(1-Math.min(1,Math.max(0,e.progress)));return f`
      <ha-card style=${o}>
        <button
          class="pill"
          type="button"
          aria-label=${e.ariaLabel}
          @pointerdown=${this.gestures.down}
          @pointermove=${this.gestures.move}
          @pointerup=${this.gestures.up}
          @pointercancel=${this.gestures.cancel}
          @pointerleave=${this.gestures.cancel}
          @keydown=${this.gestures.key}
          @contextmenu=${this.gestures.contextMenu}
        >
          <span class="icon">
            <span class="shape">
              ${e.stateObj?f`<ha-state-icon
                    .hass=${this.hass}
                    .stateObj=${e.stateObj}
                    .icon=${e.icon}
                  ></ha-state-icon>`:f`<ha-icon .icon=${e.icon??"mdi:help-circle-outline"}></ha-icon>`}
            </span>
            ${e.progress===void 0?u:st`<svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
                  <circle class="track" cx="18" cy="18" r="17"></circle>
                  <circle class="bar" cx="18" cy="18" r="17"
                    stroke-dasharray=${Zt.toFixed(2)}
                    stroke-dashoffset=${n.toFixed(2)}></circle>
                </svg>`}
            ${e.indicator?f`<span class="dot"></span>`:u}
          </span>
          <span class="text">
            ${e.name?f`<span class="name">${e.name}</span>`:u}
            ${e.content?f`<span class="content">${e.content}</span>`:u}
          </span>
        </button>
      </ha-card>
    `}};P.styles=T`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      height: 100%;
      min-height: 44px;
      box-sizing: border-box;
      display: flex;
      overflow: hidden;
      border-radius: var(--luna-pill-radius, 999px);
    }
    .pill {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 16px 0 6px;
      cursor: pointer;
      border-radius: inherit;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      touch-action: manipulation;
      transition: background-color 150ms ease;
    }
    .pill:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .pill:active {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .icon {
      position: relative;
      flex: none;
      width: 36px;
      height: 36px;
    }
    .shape {
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pill-shape);
      color: var(--pill-color);
      --mdc-icon-size: 18px;
      transition: background-color 200ms ease, color 200ms ease;
    }
    .ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    .ring .track {
      fill: none;
      stroke: var(--pill-ring-track);
      stroke-width: 2;
    }
    .ring .bar {
      fill: none;
      stroke: var(--pill-color);
      stroke-width: 2;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s linear;
    }
    .dot {
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--pill-indicator);
      box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #1c1c1c));
    }
    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      line-height: 1.3;
    }
    .name {
      font-size: var(--ha-font-size-xs, 11px);
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content {
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-bold, 600);
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-variant-numeric: tabular-nums;
    }
  `,A([N({attribute:!1})],P.prototype,"hass",2),A([B()],P.prototype,"config",2);function xe(i){return typeof i=="string"&&(i.includes("{{")||i.includes("{%"))}var ft=class{constructor(t){this.onChange=t;this.subs=new Map;this.results=new Map}sync(t,e,o){let n=new Map;for(let[r,s]of Object.entries(e))xe(s)&&n.set(r,s);for(let[r,s]of this.subs)n.get(r)!==s.template&&this.drop(r);for(let[r,s]of n){if(this.subs.has(r))continue;let c=t.connection.subscribeMessage(a=>{if(a.error!==void 0)console.warn(`luna card template "${r}":`,a.error),this.results.set(r,"");else{let l=a.result;this.results.set(r,l==null?"":typeof l=="object"?JSON.stringify(l):String(l))}this.onChange()},{type:"render_template",template:s,variables:o,strict:!0,report_errors:!0}).catch(a=>(console.warn(`luna card template "${r}" failed:`,a),this.results.set(r,""),this.onChange(),async()=>{}));this.subs.set(r,{template:s,unsub:c})}}value(t,e){if(xe(e))return this.results.get(t);if(e!=null)return String(e)}clear(){for(let t of[...this.subs.keys()])this.drop(t)}drop(t){let e=this.subs.get(t);this.subs.delete(t),this.results.delete(t),e?.unsub.then(o=>o()).catch(()=>{})}};var Qe=["name","content","icon","color","progress","indicator","indicator_color"];function tn(i){if(i===void 0)return!1;let t=i.trim().toLowerCase();return!(t===""||t==="false"||t==="0"||t==="off"||t==="none"||t==="no")}var gt=class extends P{constructor(){super(...arguments);this.templates=new ft(()=>this.requestUpdate());this.resync=!0}setConfig(e){if(!e)throw new Error("Invalid configuration");if(!e.entity&&!e.content&&!e.name)throw new Error("Set an entity, or at least a name or content");this.config={...e},this.resync=!0}static getStubConfig(e){return{type:"custom:luna-badge-card",entity:Object.keys(e.states).find(n=>n.startsWith("light.")||n.startsWith("sensor."))}}static getConfigForm(){return{schema:[{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]},{name:"content",selector:{template:{}}},{name:"color",selector:{ui_color:{include_state:!1,include_none:!0}}},{name:"progress",selector:{template:{}}},{name:"indicator",selector:{template:{}}},{name:"tap_action",selector:{ui_action:{default_action:"more-info"}}},{name:"hold_action",selector:{ui_action:{default_action:"none"}}},{name:"double_tap_action",selector:{ui_action:{default_action:"none"}}}],computeLabel:e=>({entity:"Entity",name:"Name (small line)",icon:"Icon",content:"Content (bold line) \u2014 text or template",color:"Colour",progress:"Progress ring, 0\u2013100 \u2014 number or template",indicator:"Indicator dot \u2014 template, shown when truthy",tap_action:"Tap",hold_action:"Hold",double_tap_action:"Double tap"})[e.name]??e.name}}disconnectedCallback(){super.disconnectedCallback(),this.templates.clear()}connectedCallback(){super.connectedCallback(),this.resync=!0,this.requestUpdate()}willUpdate(e){if(super.willUpdate(e),!(!this.hass||!this.config||!this.isConnected)&&this.resync){this.resync=!1;let o={};for(let n of Qe)o[n]=this.config[n];this.templates.sync(this.hass,o,{config:this.config,user:this.hass.user?.name,entity:this.config.entity})}}actionFor(e){let o=this.config;if(o)return e==="tap"?o.tap_action??(o.entity?{action:"more-info"}:void 0):e==="hold"?o.hold_action:o.double_tap_action}viewModel(){let e=this.config,o=this.hass,n=d=>this.templates.value(d,e[d]),r=e.entity?o.states[e.entity]:void 0,s=n("name")??(r?String(r.attributes.friendly_name??e.entity):void 0),c=n("content")??(r?o.formatEntityState?o.formatEntityState(r):r.state:void 0),a=n("progress"),l;if(a!==void 0&&a.trim()!==""){let d=Number(a);Number.isFinite(d)&&(l=Math.min(100,Math.max(0,d))/100)}let p=zt(n("color"))??"var(--state-icon-color, var(--primary-color))";return{stateObj:r,icon:n("icon"),name:s,content:c,color:p,progress:l,indicator:tn(n("indicator")),indicatorColor:zt(n("indicator_color")),ariaLabel:[s,c].filter(Boolean).join(", ")}}};var qt={en:{heating:"Heating",idle:"Idle",off:"Off",max:"Max",schedule:"Schedule",manual:"Manual",away:"Away",boost:"Boost",precomfort:"Precomfort",no_schedule:"No schedule",target:"Target",now:"now",until:"until",then:"then",all_day:"all day",tomorrow:"tomorrow",manual_paused:"Manual \xB7 schedule paused",resume:"Resume schedule",boost_for:"Boost {min} min",boost_to:"Boost to {value} \xB7 {left} left",cancel:"Cancel",lower:"Lower target temperature",raise:"Raise target temperature",battery:"Battery",battery_low:"Low",thermostats:"{n} thermostats",thermostat:"1 thermostat",min:"min",boost_badge_aria:"Boost {zone} for {min} minutes",cancel_boost_aria:"Cancel boost in {zone}",unavailable:"Unavailable",not_luna:"{entity} is not a Luna Climate zone",humidity:"Humidity",mode:"Mode",temperature:"Temperature"},de:{heating:"Heizt",idle:"Bereit",off:"Aus",max:"Max",schedule:"Zeitplan",manual:"Manuell",away:"Abwesend",boost:"Boost",precomfort:"Vorheizen",no_schedule:"Kein Zeitplan",target:"Ziel",now:"aktuell",until:"bis",then:"danach",all_day:"ganzt\xE4gig",tomorrow:"morgen",manual_paused:"Manuell \xB7 Zeitplan pausiert",resume:"Zeitplan fortsetzen",boost_for:"Boost {min} min",boost_to:"Boost auf {value} \xB7 noch {left}",cancel:"Abbrechen",lower:"Zieltemperatur senken",raise:"Zieltemperatur erh\xF6hen",battery:"Batterie",battery_low:"Schwach",thermostats:"{n} Thermostate",thermostat:"1 Thermostat",min:"min",boost_badge_aria:"{zone} f\xFCr {min} Minuten boosten",cancel_boost_aria:"Boost in {zone} abbrechen",unavailable:"Nicht verf\xFCgbar",not_luna:"{entity} ist keine Luna-Climate-Zone",humidity:"Luftfeuchte",mode:"Modus",temperature:"Temperatur"}};function g(i,t,e={}){let r=((i?.locale?.language??i?.language??"en").slice(0,2)==="de"?qt.de:qt.en)[t]??qt.en[t];for(let[s,c]of Object.entries(e))r=r.replace(`{${s}}`,String(c));return r}function w(i){return!!(i&&i.attributes.luna_zone_id)}function en(i){if(i==="off"||i==="max")return i;let t=Number(i);return Number.isFinite(t)?t:"off"}function S(i){let t=i.attributes,e=en(t.luna_value),o=typeof t.current_temperature=="number"?t.current_temperature:void 0,n=t.hvac_action==="heating"||t.hvac_action===void 0&&e!=="off"&&o!==void 0&&(e==="max"||o<e-.2),r=t.luna_boost_ends_at?Date.parse(t.luna_boost_ends_at):NaN,s=t.luna_boost_started_at?Date.parse(t.luna_boost_started_at):NaN;return{entityId:i.entity_id,zoneId:String(t.luna_zone_id??""),name:String(t.luna_zone_name??t.friendly_name??i.entity_id),available:i.state!=="unavailable",source:t.luna_source??"none",value:e,current:o,humidity:typeof t.current_humidity=="number"?t.current_humidity:void 0,heating:n,precomfort:!!t.luna_precomfort_active,boostEndsAt:Number.isFinite(r)?r:void 0,boostStartedAt:Number.isFinite(s)?s:void 0,thermostats:Array.isArray(t.luna_thermostats)?t.luna_thermostats:[],linkedDevices:Array.isArray(t.luna_linked_devices)?t.luna_linked_devices:[]}}function _(i,t=Date.now()){return i.source==="boost"&&i.boostEndsAt!==void 0&&i.boostEndsAt>t}function G(i,t=i.value,e=i.source){return t==="off"?b.off:e==="boost"?b.boost:e==="away"?b.away:t==="max"?b.max:b.heat}function D(i,t){return t||(!i.thermostats.length&&i.linkedDevices.length?"mdi:heating-coil":"mdi:radiator")}function F(i,t){let e=i.entities;if(!e)return;let o=e[t]?.device_id;if(!o)return;let n=Object.values(e).find(c=>c.device_id===o&&c.translation_key==="battery_min");if(!n)return;let r=i.states[n.entity_id];if(!r)return;let s=Number(r.state);return{lowest:Number.isFinite(s)?s:void 0,warning:!!r.attributes.luna_battery_warning}}function k(i,t){if(i===void 0)return"\u2013";if(i==="off"||i==="max")return g(t,i);let e=t?.locale?.language??"en";return`${i.toLocaleString(e,{minimumFractionDigits:1,maximumFractionDigits:1})}\xB0`}function K(i,t){let e=t?.locale?.language??"en";return`${Math.round(i).toLocaleString(e)}%`}var yt=class extends P{setConfig(t){if(!t?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={duration:30,show_humidity:!0,...t}}static getStubConfig(t){return{type:"custom:luna-boost-badge",entity:Object.keys(t.states).find(o=>w(t.states[o]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"duration",selector:{number:{min:5,max:240,step:5,unit_of_measurement:"min",mode:"box"}}}]},{name:"show_humidity",selector:{boolean:{}}},{name:"hold_action",selector:{ui_action:{default_action:"more-info"}}}],computeLabel:t=>({entity:"Luna zone",name:"Name",duration:"Boost duration",show_humidity:"Show humidity",hold_action:"Hold"})[t.name]??t.name}}tickEvery(){let t=this.config&&this.hass?.states[this.config.entity];return t&&w(t)&&_(S(t))?5e3:0}actionFor(t){let e=this.config;if(e)return t==="tap"?e.tap_action:t==="hold"?e.hold_action??{action:"more-info"}:e.double_tap_action}async onGesture(t){if(t!=="tap"||this.config?.tap_action||!this.hass||!this.config)return super.onGesture(t);let e=this.hass.states[this.config.entity];if(!e||!w(e))return;let o=S(e);M(_(o)?"light":"success"),_(o)?await this.hass.callService("luna_climate","cancel_boost",{entity_id:o.entityId}):await this.hass.callService("luna_climate","boost",{entity_id:o.entityId,duration:this.config.duration??30})}viewModel(){let t=this.config,e=this.hass,o=e.states[t.entity];if(!o)return{icon:"mdi:alert-circle-outline",name:t.entity,content:g(e,"unavailable"),color:b.warning,ariaLabel:t.entity};if(!w(o))return{icon:"mdi:alert-circle-outline",name:t.name??t.entity,content:g(e,"not_luna",{entity:""}).trim(),color:b.warning,ariaLabel:g(e,"not_luna",{entity:t.entity})};let n=S(o),r=t.name??n.name,s=t.duration??30,c=F(e,n.entityId),a=Date.now();if(!n.available)return{icon:D(n,t.icon),name:r,content:g(e,"unavailable"),color:b.off,ariaLabel:`${r}, ${g(e,"unavailable")}`};if(_(n,a)){let y=Math.max(0,n.boostEndsAt-a),v=n.boostStartedAt!==void 0?n.boostEndsAt-n.boostStartedAt:s*6e4;return{icon:"mdi:fire",name:r,content:`${g(e,"boost")} \xB7 ${Math.ceil(y/6e4)} ${g(e,"min")}`,color:b.boost,progress:v>0?y/v:0,indicator:c?.warning,ariaLabel:g(e,"cancel_boost_aria",{zone:r})}}let l=n.current!==void 0?k(n.current,e):"\u2013",p=t.show_humidity!==!1&&n.humidity!==void 0?K(n.humidity,e):void 0,d=D(n,t.icon),m=p?`${l} \xB7 ${p}`:l;return n.source==="away"?(d="mdi:home-export-outline",m=`${g(e,"away")} \xB7 ${k(n.value,e)}`):n.value==="off"&&(d="mdi:power",m=`${g(e,"off")} \xB7 ${l}`),{icon:d,name:r,content:m,color:G(n),indicator:c?.warning,ariaLabel:g(e,"boost_badge_aria",{zone:r,min:s})}}};var nn={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6};function we(i,t=new Date){try{let e=new Intl.DateTimeFormat("en-US",{timeZone:i,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(t),o=n=>e.find(r=>r.type===n)?.value??"";return{weekday:nn[o("weekday")]??0,minutes:Number(o("hour"))*60+Number(o("minute"))}}catch{return{weekday:(t.getDay()+6)%7,minutes:t.getHours()*60+t.getMinutes()}}}function on(i){let[t,e]=i.split(":").map(Number);return(t||0)*60+(e||0)}function Gt(i,t){return i.filter(e=>e.weekdays.includes(t)).map(e=>({start:on(e.start),value:e.value})).sort((e,o)=>e.start-o.start)}function $e(i,t){if(!i.length)return{segments:[]};let e;for(let a=1;a<=7&&e===void 0;a++){let l=Gt(i,(t.weekday-a+7)%7);l.length&&(e=l[l.length-1].value)}let o=Gt(i,t.weekday),n=[...o];(!n.length||n[0].start>0)&&e!==void 0&&n.unshift({start:0,value:e});let r=n.map((a,l)=>{let p=l+1<n.length?n[l+1].start:1440;return{start:a.start,end:p,value:a.value,current:t.minutes>=a.start&&t.minutes<p}}),s={segments:r,current:r.find(a=>a.current)?.value},c=o.find(a=>a.start>t.minutes);if(c)return s.nextAt=c.start,s.nextValue=c.value,s.nextDayOffset=0,s;for(let a=1;a<=7;a++){let l=Gt(i,(t.weekday+a)%7);if(l.length){s.nextAt=a*1440+l[0].start,s.nextValue=l[0].value,s.nextDayOffset=a;break}}return s}function _e(i){let t=(i%1440+1440)%1440,e=Math.floor(t/60),o=t%60;return`${e<10?"0":""}${e}:${o<10?"0":""}${o}`}var W=class{constructor(t,e){this.host=t;this.source=e;t.addController(this)}hostConnected(){this.key=void 0}hostUpdated(){let{hass:t,zone:e,enabled:o}=this.source();if(!t||!e||!o)return;let n=t.states[e.entityId]?.attributes.luna_block_start??"",r=`${e.zoneId}|${n}|${Math.floor(Date.now()/6e5)}`;r!==this.key&&(this.key=r,this.fetch(t,e.zoneId))}async fetch(t,e){try{let o=await t.callWS({type:"luna_climate/schedule/get",zone_id:e});this.schedule=o.schedule}catch(o){console.warn("luna card: could not load schedule",o),this.schedule=[]}this.host.requestUpdate()}};function bt({hass:i,schedule:t,source:e,onResume:o}){let n=(d,m)=>g(i,d,m),r=d=>k(d,i),s=we(i.config.time_zone),c=t?$e(t,s):{segments:[]},a="";if(c.nextAt!==void 0){let d=_e(c.nextAt);if(c.nextDayOffset===0)a=`${n("until")} ${d}`;else if(c.nextDayOffset===1)a=`${n("until")} ${n("tomorrow")} ${d}`;else{let m=new Date(Date.now()+c.nextDayOffset*864e5).toLocaleDateString(i.locale?.language??"en",{weekday:"short"});a=`${n("until")} ${m} ${d}`}}else c.current!==void 0&&(a=n("all_day"));let l;e==="manual"?l=n("manual_paused"):c.current===void 0?l=t?n("no_schedule"):"":l=`${e==="schedule"?"":`${n("schedule")} `}${r(c.current)} ${a}`.trim();let p=c.nextValue!==void 0?`${n("then")} ${r(c.nextValue)}`:"";return f`
    <div class="schedule">
      <div class="caption">
        <span class="left">${l}</span>
        ${e==="manual"?f`<button type="button" class="link" @click=${o}>${n("resume")}</button>`:f`<span class="right">${p}</span>`}
      </div>
      <div class="strip" aria-hidden="true">
        ${c.segments.map(d=>{let m=d.value==="off"?"color-mix(in srgb, var(--primary-text-color) 16%, transparent)":d.value==="max"?b.max:E(b.heat,Math.round(Math.min(100,35+(d.value-17)/8*65))),y=d.start/1440*100,v=(d.end-d.start)/1440*100;return f`<span
            class="block ${d.current?"current":""}"
            style=${`left: calc(${y}% + 1px); width: calc(${v}% - 2px); background: ${m};`}
          ></span>`})}
        ${Array.from({length:25},(d,m)=>f`<span class="tick ${m%6===0?"major":""}" style=${`left: ${m/24*100}%`}></span>`)}
        ${[0,6,12,18,24].map(d=>f`<span class="hour ${d===0?"first":d===24?"last":""}" style=${`left: ${d/24*100}%`}
              >${String(d).padStart(2,"0")}</span
            >`)}
        <span class="now-marker" style=${`left: ${s.minutes/1440*100}%`}></span>
      </div>
    </div>
  `}var vt=T`
  .caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 20px;
    font-size: var(--ha-font-size-s, 13px);
  }
  .caption .left {
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .caption .right {
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .caption .link {
    all: unset;
    cursor: pointer;
    font-weight: 600;
    color: var(--zone-color);
    white-space: nowrap;
    padding: 4px 0;
  }
  .caption .link:focus-visible {
    outline: 2px solid var(--primary-color);
  }
  .strip {
    position: relative;
    height: 42px;
    margin-top: 6px;
  }
  .block {
    position: absolute;
    top: 8px;
    height: 6px;
    border-radius: 3px;
    opacity: 0.5;
  }
  .block.current {
    opacity: 1;
  }
  .tick {
    position: absolute;
    top: 20px;
    width: 1px;
    height: 4px;
    background: color-mix(in srgb, var(--primary-text-color) 22%, transparent);
  }
  .tick.major {
    height: 7px;
  }
  .hour {
    position: absolute;
    top: 29px;
    transform: translateX(-50%);
    font-size: 10.5px;
    line-height: 13px;
    color: var(--secondary-text-color);
  }
  .hour.first {
    transform: none;
  }
  .hour.last {
    transform: translateX(-100%);
  }
  .now-marker {
    position: absolute;
    top: 0;
    width: 2px;
    height: 17px;
    margin-left: -1px;
    border-radius: 1px;
    background: var(--primary-text-color);
  }
  .now-marker::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -4px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--zone-color);
  }
`;var h={W:366,H:232,cx:183,cy:170,r:150,T0:10,T1:27,A0:200,A1:-20},Xt=10.5,xt=25,at=i=>h.A0-(i-h.T0)/(h.T1-h.T0)*(h.A0-h.A1),X=(i,t)=>{let e=i*Math.PI/180;return{x:+(h.cx+t*Math.cos(e)).toFixed(2),y:+(h.cy-t*Math.sin(e)).toFixed(2)}},ke=(i,t)=>{if(t-i<.01)return"";let e=at(i),o=at(t),n=X(e,h.r),r=X(o,h.r);return`M ${n.x} ${n.y} A ${h.r} ${h.r} 0 ${e-o>180?1:0} 1 ${r.x} ${r.y}`},rn=(()=>{let i="";for(let t=11;t<=26;t++){let e=at(t),o=X(e,h.r-13),n=X(e,h.r-(t%5===0?22:18));i+=`M ${o.x} ${o.y} L ${n.x} ${n.y} `}return i})(),sn=ke(h.T0,h.T1),Ft=J(b.boost),Ae=J(b.warning),Kt=i=>i==="off"?h.T0:i==="max"?h.T1:Math.min(h.T1,Math.max(h.T0,i));function Se(i){return i<Xt-.25?"off":i>xt+.25?"max":Math.min(xt,Math.max(Xt,Math.round(i*2)/2))}var Wt={schedule:{icon:"mdi:calendar-clock",label:"schedule"},manual:{icon:"mdi:hand-back-right-outline",label:"manual"},away:{icon:"mdi:home-export-outline",label:"away"},boost:{icon:"mdi:fire",label:"boost"},none:{icon:"mdi:calendar-remove-outline",label:"no_schedule"}},L=class extends ${constructor(){super(...arguments);this.scheduleCtl=new W(this,()=>({hass:this.hass,zone:this.zone,enabled:this.config?.show_schedule!==!1}));this.dragging=!1;this.tickEvery=0;this.onPointerDown=e=>{let o=this.pointerToTarget(e);o.onArc&&(e.preventDefault(),this.dragging=!0,window.clearTimeout(this.commitTimer),e.currentTarget.setPointerCapture?.(e.pointerId),this.pending=o.value)};this.onPointerMove=e=>{if(!this.dragging)return;let o=this.pointerToTarget(e).value;o!==this.pending&&(this.pending=o,M("light"))};this.onPointerUp=()=>{this.dragging&&(this.dragging=!1,this.commit())}}setConfig(e){if(!e?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={show_schedule:!0,show_stepper:!0,show_humidity:!0,boost_durations:[30,60],...e}}static getStubConfig(e){return{type:"custom:luna-zone-card",entity:Object.keys(e.states).find(n=>w(e.states[n]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"boost_durations",selector:{select:{multiple:!0,custom_value:!0,options:["15","30","45","60","90","120"].map(e=>({value:e,label:`${e} min`}))}}},{type:"grid",name:"",schema:[{name:"show_schedule",selector:{boolean:{}}},{name:"show_stepper",selector:{boolean:{}}},{name:"show_humidity",selector:{boolean:{}}}]}],computeLabel:e=>({entity:"Luna zone",name:"Name",icon:"Icon",boost_durations:"Boost buttons",show_schedule:"Show schedule strip",show_stepper:"Show \u2212 / + buttons",show_humidity:"Show humidity"})[e.name]??e.name}}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),window.clearTimeout(this.commitTimer),window.clearTimeout(this.echoTimer),this.tickTimer=void 0,this.tickEvery=0}get zone(){let e=this.config&&this.hass?.states[this.config.entity];return e&&w(e)?S(e):void 0}willUpdate(e){super.willUpdate(e);let o=this.zone;o&&this.awaitingEcho!==void 0&&!this.dragging&&o.source==="manual"&&o.value===this.awaitingEcho&&this.clearPending()}updated(e){super.updated(e);let o=this.zone;if(!o||!this.hass)return;let n=_(o)?1e3:3e4;n!==this.tickEvery&&(window.clearInterval(this.tickTimer),this.tickEvery=n,this.tickTimer=window.setInterval(()=>this.requestUpdate(),n))}clearPending(){this.pending=void 0,this.awaitingEcho=void 0,window.clearTimeout(this.echoTimer)}shownValue(e){return this.pending??e.value}step(e){let o=this.zone;if(!o)return;let n=this.shownValue(o),r=n==="off"?h.T0:n==="max"?xt+.5:n;r+=e*.5,n==="max"&&e<0&&(r=xt),n==="off"&&e>0&&(r=Xt),this.pending=Se(r),M("light"),window.clearTimeout(this.commitTimer),this.commitTimer=window.setTimeout(()=>this.commit(),900)}async commit(){let e=this.zone,o=this.pending;if(!(!e||o===void 0||!this.hass)){this.awaitingEcho=o,window.clearTimeout(this.echoTimer),this.echoTimer=window.setTimeout(()=>this.clearPending(),4e3);try{await this.hass.callService("luna_climate","set_target",{entity_id:e.entityId,value:o})}catch(n){throw this.clearPending(),n}}}pointerToTarget(e){let n=e.currentTarget.getBoundingClientRect(),r=n.width/h.W,s=(e.clientX-n.left)/r,c=(e.clientY-n.top)/r,a=Math.hypot(s-h.cx,c-h.cy),l=Math.atan2(h.cy-c,s-h.cx)*180/Math.PI;l<-90&&(l+=360),l=Math.max(h.A1,Math.min(h.A0,l));let p=h.T0+(h.A0-l)/(h.A0-h.A1)*(h.T1-h.T0);return{value:Se(p),onArc:Math.abs(a-h.r)<=30}}async call(e,o={}){let n=this.zone;!n||!this.hass||(this.clearPending(),await this.hass.callService("luna_climate",e,{entity_id:n.entityId,...o}))}moreInfo(){this.config&&O(this,"hass-more-info",{entityId:this.config.entity})}render(){if(!this.config||!this.hass)return u;let e=this.hass,o=e.states[this.config.entity];if(!o||!w(o))return f`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${g(e,"not_luna",{entity:this.config.entity})}</span>
      </ha-card>`;let n=S(o),r=(x,Tt)=>g(e,x,Tt),s=x=>k(x,e),c=this.shownValue(n),a=this.pending!==void 0?"manual":n.source,l=a==="boost"&&_(n),p=c==="off",d=c==="max",m=this.pending===void 0?n.heating:!p&&n.current!==void 0&&Kt(c)>n.current,y=G(n,c,a),v=Kt(c),C=n.current!==void 0?Kt(n.current):void 0,_t=p||C===void 0?"":ke(Math.min(v,C),Math.max(v,C)),Yt=X(at(v),h.r),At=C!==void 0?X(at(C),h.r):void 0,St=n.precomfort&&a==="schedule"?{icon:"mdi:map-marker-radius-outline",label:"precomfort"}:Wt[a]??Wt.none,kt=F(e,n.entityId),Ct=[];n.thermostats.length&&Ct.push(n.thermostats.length===1?r("thermostat"):r("thermostats",{n:n.thermostats.length}));for(let x of n.linkedDevices){let Tt=e.states[x];Ct.push(String(Tt?.attributes.friendly_name??x))}let Ee=[r(m?"heating":p?"off":"idle"),Ct.join(" + ")].filter(Boolean).join(" \xB7 "),Jt=r(a==="schedule"?"target":Wt[a].label),Te=p?r("off"):d?r("max"):c.toLocaleString(e.locale?.language??"en",{minimumFractionDigits:1,maximumFractionDigits:1}),Et=n.current!==void 0?s(n.current):"\u2013",ze=p?`${Et}`:`${r(m?"heating":"idle")} \xB7 ${r("now")} ${Et}`,Qt=this.config.show_humidity!==!1&&n.humidity!==void 0?K(n.humidity,e):void 0,Me=Date.now(),te=l?Math.max(0,n.boostEndsAt-Me):0,ee=l&&n.boostStartedAt!==void 0?n.boostEndsAt-n.boostStartedAt:0,ne=Math.floor(te/1e3),Pe=`${Math.floor(ne/60)}:${String(ne%60).padStart(2,"0")}`,He=(this.config.boost_durations??[30,60]).map(x=>Number(x)).filter(x=>Number.isFinite(x)&&x>0).slice(0,4),Ne=`--zone-color: ${y}; --zone-shape: ${E(y,16)};`;return f`
      <ha-card style=${Ne} class=${n.available?"":"unavailable"}>
        <div class="header">
          <button class="info" type="button" @click=${this.moreInfo} aria-label=${n.name}>
            <span class="shape"><ha-icon .icon=${D(n,this.config.icon)}></ha-icon></span>
            <span class="titles">
              <span class="name">${this.config.name??n.name}</span>
              <span class="sub">${n.available?Ee:r("unavailable")}</span>
            </span>
          </button>
          ${kt?.warning?f`<span class="chip warn" title=${r("battery")}>
                <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                <span>${kt.lowest!==void 0?`${Math.round(kt.lowest)}%`:r("battery_low")}</span>
              </span>`:u}
          <span class="chip" title=${r(St.label)}>
            <ha-icon .icon=${St.icon}></ha-icon>
            <span>${r(St.label)}</span>
          </span>
        </div>

        <div class="dial">
          <svg
            viewBox="0 0 ${h.W} ${h.H}"
            role="img"
            aria-label=${`${Jt} ${s(c)}, ${r("now")} ${Et}`}
            @pointerdown=${this.onPointerDown}
            @pointermove=${this.onPointerMove}
            @pointerup=${this.onPointerUp}
            @pointercancel=${this.onPointerUp}
          >
            <path class="track" d=${sn}></path>
            <path class="ticks" d=${rn}></path>
            ${st`<path class="seg ${m?"active":""}" d=${_t}></path>`}
            ${At?st`<circle class="current" cx=${At.x} cy=${At.y} r="6"></circle>`:u}
            <circle class="handle" cx=${Yt.x} cy=${Yt.y} r="12"></circle>
          </svg>
          <span class="end off">${r("off")}</span>
          <span class="end max">${r("max")}</span>
          <div class="center">
            <span class="label">${Jt}</span>
            <span class="big">${Te}${p||d?u:f`<span class="deg">°</span>`}</span>
            <span class="now">
              ${m?f`<ha-icon icon="mdi:fire"></ha-icon>`:u}
              <span>${ze}</span>
              ${Qt?f`<span class="hum" title=${r("humidity")}>
                    <ha-icon icon="mdi:water-percent"></ha-icon>${Qt}
                  </span>`:u}
            </span>
          </div>
          ${this.config.show_stepper===!1?u:f`<div class="stepper">
                <button type="button" aria-label=${r("lower")} @click=${()=>this.step(-1)}>
                  <ha-icon icon="mdi:minus"></ha-icon>
                </button>
                <span class="divider"></span>
                <button type="button" aria-label=${r("raise")} @click=${()=>this.step(1)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>`}
        </div>

        ${this.config.show_schedule===!1?u:bt({hass:e,schedule:this.scheduleCtl.schedule,source:a,onResume:()=>void this.call("resume_schedule")})}

        <div class="actions">
          ${l?f`<button type="button" class="boosting" @click=${()=>this.call("cancel_boost")} aria-label=${r("cancel_boost_aria",{zone:n.name})}>
                <span class="fill" style=${`width: ${ee>0?(te/ee*100).toFixed(2):0}%`}></span>
                <ha-icon icon="mdi:fire"></ha-icon>
                <span class="label">${r("boost_to",{value:s(n.value),left:Pe})}</span>
                <span class="cancel">${r("cancel")}</span>
              </button>`:He.map(x=>f`<button type="button" class="boost" @click=${()=>this.call("boost",{duration:x})}>
                  <ha-icon icon="mdi:fire"></ha-icon>
                  <span>${r("boost_for",{min:x})}</span>
                </button>`)}
        </div>
      </ha-card>
    `}};L.styles=[vt,T`
    :host {
      display: block;
      --luna-track: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      --luna-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    ha-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-sizing: border-box;
      height: 100%;
      font-variant-numeric: tabular-nums;
      container-type: inline-size;
    }
    /* Narrow cards: chips drop their label and keep the icon, so the
       zone name gets the room. The label stays available as a title. */
    @container (max-width: 360px) {
      .chip {
        padding: 0 7px;
      }
      .chip span {
        display: none;
      }
    }
    ha-card.unavailable .dial,
    ha-card.unavailable .actions,
    ha-card.unavailable .schedule {
      opacity: 0.5;
      pointer-events: none;
    }
    ha-card.message {
      flex-direction: row;
      align-items: center;
      gap: 12px;
      color: var(--error-color);
    }
    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* header */
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;
    }
    .info {
      all: unset;
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      border-radius: 20px;
    }
    .info:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .shape {
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zone-shape);
      color: var(--zone-color);
      --mdc-icon-size: 22px;
      transition: background-color 200ms ease, color 200ms ease;
    }
    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 2px;
    }
    .name {
      font-size: var(--ha-font-size-m, 15px);
      font-weight: var(--ha-font-weight-bold, 600);
      line-height: 20px;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sub {
      font-size: var(--ha-font-size-s, 12.5px);
      line-height: 16px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip {
      flex: none;
      height: 28px;
      box-sizing: border-box;
      padding: 0 10px 0 8px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--luna-soft);
      color: var(--secondary-text-color);
      font-size: var(--ha-font-size-xs, 12px);
      font-weight: var(--ha-font-weight-bold, 600);
      --mdc-icon-size: 16px;
    }
    .chip ha-icon {
      color: var(--zone-color);
    }
    .chip.warn {
      background: color-mix(in srgb, ${Ae} 14%, transparent);
      color: ${Ae};
    }
    .chip.warn ha-icon {
      color: inherit;
    }

    /* dial */
    .dial {
      position: relative;
      container-type: inline-size;
      aspect-ratio: 366 / 232;
      width: 100%;
      /* Past this the dial only adds height; the card stays compact in a
         wide column and the arc stays a comfortable drag target. */
      max-width: 380px;
      margin: 4px auto 0;
    }
    .dial svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      touch-action: none;
      cursor: grab;
    }
    .track {
      fill: none;
      stroke: var(--luna-track);
      stroke-width: 6;
      stroke-linecap: round;
    }
    .ticks {
      fill: none;
      stroke: color-mix(in srgb, var(--primary-text-color) 22%, transparent);
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .seg {
      fill: none;
      stroke: color-mix(in srgb, var(--primary-text-color) 30%, transparent);
      stroke-width: 6;
      stroke-linecap: round;
    }
    .seg.active {
      stroke: var(--zone-color);
    }
    .current {
      fill: var(--ha-card-background, var(--card-background-color));
      stroke: var(--primary-text-color);
      stroke-width: 2.5;
    }
    .handle {
      fill: var(--zone-color);
      stroke: var(--ha-card-background, var(--card-background-color));
      stroke-width: 4;
      transition: fill 200ms ease;
    }
    .end {
      position: absolute;
      top: 87%;
      font-size: clamp(10px, 3cqw, 11px);
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .end.off {
      left: 12.6%;
    }
    .end.max {
      right: 12%;
    }
    .center {
      position: absolute;
      left: 0;
      right: 0;
      top: 26.5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }
    .center .label {
      font-size: clamp(10px, 3.1cqw, 11.5px);
      line-height: 1.4;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: var(--ha-font-weight-bold, 600);
      color: var(--secondary-text-color);
    }
    .center .big {
      display: flex;
      align-items: flex-start;
      font-size: clamp(34px, 16.4cqw, 60px);
      line-height: 1.07;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--primary-text-color);
      margin-top: 2px;
    }
    .center .deg {
      font-size: 0.43em;
      line-height: 1.5;
      color: var(--secondary-text-color);
      margin-left: 2px;
    }
    .center .now {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: clamp(11px, 3.55cqw, 13px);
      line-height: 1.4;
      color: var(--secondary-text-color);
      --mdc-icon-size: clamp(12px, 3.8cqw, 14px);
    }
    .center .now ha-icon {
      color: var(--zone-color);
    }
    .center .hum {
      display: inline-flex;
      align-items: center;
      gap: 1px;
      margin-left: 4px;
    }
    .center .hum ha-icon {
      color: var(--secondary-text-color);
    }
    .stepper {
      position: absolute;
      left: 50%;
      top: 76.7%;
      transform: translateX(-50%);
      width: clamp(88px, 28.4cqw, 104px);
      height: clamp(36px, 12cqw, 44px);
      border-radius: 999px;
      background: var(--luna-soft);
      display: flex;
      align-items: stretch;
    }
    .stepper button {
      all: unset;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--primary-text-color);
      --mdc-icon-size: 18px;
    }
    .stepper button:first-child {
      border-radius: 999px 0 0 999px;
    }
    .stepper button:last-child {
      border-radius: 0 999px 999px 0;
    }
    .stepper button:active {
      background: var(--luna-soft);
    }
    .stepper button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .stepper .divider {
      width: 1px;
      margin: 12px 0;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }

    .schedule {
      margin-top: 4px;
    }

    /* actions */
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .actions button {
      all: unset;
      box-sizing: border-box;
      flex: 1 1 0;
      min-width: 0;
      height: 44px;
      border-radius: 12px;
      background: var(--luna-soft);
      color: var(--primary-text-color);
      font-size: var(--ha-font-size-s, 13.5px);
      font-weight: var(--ha-font-weight-bold, 600);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      cursor: pointer;
      --mdc-icon-size: 17px;
      transition: background-color 150ms ease;
    }
    .actions button ha-icon {
      color: ${Ft};
    }
    .actions button:active {
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .actions button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .actions .boosting {
      position: relative;
      overflow: hidden;
      justify-content: flex-start;
      padding: 0 14px;
      background: color-mix(in srgb, ${Ft} 10%, transparent);
    }
    .actions .boosting .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: color-mix(in srgb, ${Ft} 22%, transparent);
      transition: width 1s linear;
    }
    .actions .boosting ha-icon,
    .actions .boosting .label,
    .actions .boosting .cancel {
      position: relative;
    }
    .actions .boosting .label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .actions .boosting .cancel {
      margin-left: auto;
      padding-left: 8px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
  `],A([N({attribute:!1})],L.prototype,"hass",2),A([B()],L.prototype,"config",2),A([B()],L.prototype,"pending",2);var Ce={schedule:{icon:"mdi:calendar-clock",label:"schedule"},manual:{icon:"mdi:hand-back-right-outline",label:"manual"},away:{icon:"mdi:home-export-outline",label:"away"},boost:{icon:"mdi:fire",label:"boost"},none:{icon:"mdi:calendar-remove-outline",label:"no_schedule"}},j=class extends ${constructor(){super(...arguments);this.tickEvery=0;this.scheduleCtl=new W(this,()=>({hass:this.hass,zone:this.zone,enabled:!0}))}setConfig(e){if(!e?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={show_humidity:!0,...e}}static getStubConfig(e){return{type:"custom:luna-zone-compact-card",entity:Object.keys(e.states).find(n=>w(e.states[n]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"show_humidity",selector:{boolean:{}}}],computeLabel:e=>({entity:"Luna zone",name:"Name",icon:"Icon",show_humidity:"Show humidity"})[e.name]??e.name}}getCardSize(){return 3}getGridOptions(){return{columns:12,min_columns:6}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),this.tickTimer=void 0,this.tickEvery=0}get zone(){let e=this.config&&this.hass?.states[this.config.entity];return e&&w(e)?S(e):void 0}updated(e){super.updated(e);let o=this.zone;if(!o)return;let n=_(o)?1e4:3e4;n!==this.tickEvery&&(window.clearInterval(this.tickTimer),this.tickEvery=n,this.tickTimer=window.setInterval(()=>this.requestUpdate(),n))}moreInfo(){this.config&&O(this,"hass-more-info",{entityId:this.config.entity})}render(){if(!this.config||!this.hass)return u;let e=this.hass,o=e.states[this.config.entity];if(!o||!w(o))return f`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${g(e,"not_luna",{entity:this.config.entity})}</span>
      </ha-card>`;let n=S(o),r=(C,_t)=>g(e,C,_t),s=G(n),c=_(n),a=n.precomfort&&n.source==="schedule"?{icon:"mdi:map-marker-radius-outline",label:"precomfort"}:Ce[n.source]??Ce.none,l=r(a.label);if(c){let C=Math.max(0,n.boostEndsAt-Date.now());l=`${r("boost")} \xB7 ${Math.ceil(C/6e4)} ${r("min")}`}else n.value==="off"&&n.source!=="manual"&&(l=`${r(a.label)} \xB7 ${r("off")}`);let p=n.value==="off"?r("off"):k(n.value,e),d=n.current!==void 0?k(n.current,e):"\u2013",m=this.config.show_humidity!==!1&&n.humidity!==void 0,y=F(e,n.entityId),v=`--zone-color: ${s}; --zone-shape: ${E(s,16)};`;return f`
      <ha-card style=${v} class=${n.available?"":"unavailable"}>
        <button class="header" type="button" @click=${this.moreInfo} aria-label=${n.name}>
          <span class="shape"><ha-icon .icon=${D(n,this.config.icon)}></ha-icon></span>
          <span class="name">${this.config.name??n.name}</span>
          ${y?.warning?f`<span class="battery" title=${r("battery")}>
                <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                ${y.lowest!==void 0?`${Math.round(y.lowest)}%`:r("battery_low")}
              </span>`:u}
        </button>

        <div class="stats ${m?"three":"two"}">
          <div class="stat mode">
            <span class="label">${r("mode")}</span>
            <span class="value">
              <ha-icon .icon=${a.icon}></ha-icon>
              <span class="text">${n.available?l:r("unavailable")}</span>
            </span>
          </div>
          <div class="stat">
            <span class="label">${r("temperature")}</span>
            <span class="value">
              ${n.heating?f`<ha-icon class="flame" icon="mdi:fire"></ha-icon>`:u}
              <span class="text">${d}</span>
              <span class="target" title=${r("target")}>→ ${p}</span>
            </span>
          </div>
          ${m?f`<div class="stat">
                <span class="label">${r("humidity")}</span>
                <span class="value">
                  <ha-icon class="water" icon="mdi:water-percent"></ha-icon>
                  <span class="text">${K(n.humidity,e)}</span>
                </span>
              </div>`:u}
        </div>

        ${bt({hass:e,schedule:this.scheduleCtl.schedule,source:n.source,onResume:()=>void e.callService("luna_climate","resume_schedule",{entity_id:n.entityId})})}
      </ha-card>
    `}};j.styles=[vt,T`
      :host {
        display: block;
      }
      ha-card {
        padding: 12px 16px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-sizing: border-box;
        height: 100%;
        font-variant-numeric: tabular-nums;
        container-type: inline-size;
      }
      ha-card.message {
        flex-direction: row;
        align-items: center;
        gap: 12px;
        color: var(--error-color);
      }
      ha-card.unavailable .stats,
      ha-card.unavailable .schedule {
        opacity: 0.5;
      }
      .header {
        all: unset;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        cursor: pointer;
        border-radius: 18px;
      }
      .header:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .shape {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--zone-shape);
        color: var(--zone-color);
        --mdc-icon-size: 20px;
      }
      .name {
        flex: 1;
        min-width: 0;
        font-size: var(--ha-font-size-m, 15px);
        font-weight: var(--ha-font-weight-bold, 600);
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .battery {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        height: 26px;
        padding: 0 9px 0 7px;
        border-radius: 13px;
        font-size: 12px;
        font-weight: 600;
        color: var(--luna-warning-color, var(--error-color, #db4437));
        background: color-mix(in srgb, var(--luna-warning-color, var(--error-color, #db4437)) 14%, transparent);
        --mdc-icon-size: 15px;
      }

      .stats {
        display: grid;
        gap: 8px;
      }
      .stats.three {
        grid-template-columns: minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 1fr);
      }
      .stats.two {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      }
      .stat {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
        padding: 8px 10px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      }
      .label {
        font-size: var(--ha-font-size-xs, 11px);
        line-height: 14px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .value {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        font-size: var(--ha-font-size-m, 15px);
        line-height: 20px;
        font-weight: var(--ha-font-weight-bold, 600);
        color: var(--primary-text-color);
        --mdc-icon-size: 16px;
      }
      .value .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
      .mode ha-icon,
      .value .flame {
        flex: none;
        color: var(--zone-color);
      }
      .value .water {
        flex: none;
        color: var(--luna-humidity-color, var(--blue-color, #2196f3));
      }
      .value .target {
        flex: none;
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      /* Narrow: tighter tiles, and the target moves out of the way. */
      @container (max-width: 380px) {
        .stat {
          padding: 7px 8px;
        }
        .value {
          font-size: 14px;
        }
        .value .target {
          display: none;
        }
        .mode ha-icon {
          display: none;
        }
      }
    `],A([N({attribute:!1})],j.prototype,"hass",2),A([B()],j.prototype,"config",2);var an="0.3.0";function $t(i,t){customElements.get(i)||customElements.define(i,t)}$t("luna-zone-card",L);$t("luna-zone-compact-card",j);$t("luna-badge-card",gt);$t("luna-boost-badge",yt);var wt=window;wt.customCards=wt.customCards??[];for(let i of[{type:"luna-zone-card",name:"Luna zone",description:"Dial, schedule strip and boost buttons for one Luna Climate zone.",preview:!0},{type:"luna-zone-compact-card",name:"Luna zone (compact)",description:"Mode, temperature and humidity over the schedule strip, without the dial.",preview:!0},{type:"luna-boost-badge",name:"Luna boost badge",description:"Compact pill for a Luna zone. Tap to boost, tap again to cancel.",preview:!0},{type:"luna-badge-card",name:"Luna badge",description:"General-purpose pill for any entity, with templates, a progress ring and an indicator dot.",preview:!0}])wt.customCards.some(t=>t.type===i.type)||wt.customCards.push(i);console.info(`%c LUNA CLIMATE %c ${an} `,"background:#ff8100;color:#111;font-weight:700","color:#ff8100");
