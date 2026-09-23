var rn=Object.defineProperty;var an=Object.getOwnPropertyDescriptor;var b=(o,e,t,n)=>{for(var i=n>1?void 0:n?an(e,t):e,s=o.length-1,r;s>=0;s--)(r=o[s])&&(i=(n?r(e,t,i):r(i))||i);return n&&i&&rn(e,t,i),i};var ln=new Set(["primary","accent","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","light-grey","grey","dark-grey","blue-grey","black","white","disabled"]);function Nt(o){if(!o)return;let e=o.trim();if(e)return ln.has(e)?`var(--${e}-color)`:e}function T(o,e){return`color-mix(in srgb, ${o} ${e}%, transparent)`}var y={heat:"var(--luna-heat-color, var(--state-climate-heat-color, #ff8100))",boost:"var(--luna-boost-color, var(--deep-orange-color, #ff6f22))",away:"var(--luna-away-color, #8fa6c4)",off:"var(--luna-off-color, var(--disabled-color, #9e9e9e))",max:"var(--luna-max-color, var(--red-color, #f44336))",warning:"var(--luna-warning-color, var(--error-color, #db4437))"};var bt=globalThis,yt=bt.ShadowRoot&&(bt.ShadyCSS===void 0||bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Vt=Symbol(),be=new WeakMap,ot=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==Vt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(yt&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=be.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&be.set(t,e))}return e}toString(){return this.cssText}},B=o=>new ot(typeof o=="string"?o:o+"",void 0,Vt),E=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((n,i,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[s+1],o[0]);return new ot(t,o,Vt)},ye=(o,e)=>{if(yt)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),i=bt.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=t.cssText,o.appendChild(n)}},Rt=yt?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return B(t)})(o):o;var{is:cn,defineProperty:dn,getOwnPropertyDescriptor:un,getOwnPropertyNames:pn,getOwnPropertySymbols:hn,getPrototypeOf:mn}=Object,vt=globalThis,ve=vt.trustedTypes,fn=ve?ve.emptyScript:"",gn=vt.reactiveElementPolyfillSupport,st=(o,e)=>o,rt={toAttribute(o,e){switch(e){case Boolean:o=o?fn:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},xt=(o,e)=>!cn(o,e),xe={attribute:!0,type:String,converter:rt,reflect:!1,useDefault:!1,hasChanged:xt};Symbol.metadata??=Symbol("metadata"),vt.litPropertyMetadata??=new WeakMap;var O=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=xe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),i=this.getPropertyDescriptor(e,n,t);i!==void 0&&dn(this.prototype,e,i)}}static getPropertyDescriptor(e,t,n){let{get:i,set:s}=un(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:i,set(r){let l=i?.call(this);s?.call(this,r),this.requestUpdate(e,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??xe}static _$Ei(){if(this.hasOwnProperty(st("elementProperties")))return;let e=mn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(st("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(st("properties"))){let t=this.properties,n=[...pn(t),...hn(t)];for(let i of n)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,i]of t)this.elementProperties.set(n,i)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let i=this._$Eu(t,n);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let i of n)t.unshift(Rt(i))}else e!==void 0&&t.push(Rt(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ye(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,n);if(i!==void 0&&n.reflect===!0){let s=(n.converter?.toAttribute!==void 0?n.converter:rt).toAttribute(t,n.type);this._$Em=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){let n=this.constructor,i=n._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let s=n.getPropertyOptions(i),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:rt;this._$Em=i;let l=r.fromAttribute(t,s.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,n,i=!1,s){if(e!==void 0){let r=this.constructor;if(i===!1&&(s=this[e]),n??=r.getPropertyOptions(e),!((n.hasChanged??xt)(s,t)||n.useDefault&&n.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:i,wrapped:s},r){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),s!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[i,s]of n){let{wrapped:r}=s,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,s,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[st("elementProperties")]=new Map,O[st("finalized")]=new Map,gn?.({ReactiveElement:O}),(vt.reactiveElementVersions??=[]).push("2.1.2");var Kt=globalThis,we=o=>o,wt=Kt.trustedTypes,$e=wt?wt.createPolicy("lit-html",{createHTML:o=>o}):void 0,Te="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+R,bn=`<${Ee}>`,K=document,lt=()=>K.createComment(""),ct=o=>o===null||typeof o!="object"&&typeof o!="function",Gt=Array.isArray,yn=o=>Gt(o)||typeof o?.[Symbol.iterator]=="function",Ut=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_e=/-->/g,ke=/>/g,F=RegExp(`>|${Ut}(?:([^\\s"'>=/]+)(${Ut}*=${Ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Se=/'/g,Ae=/"/g,ze=/^(?:script|style|textarea|title)$/i,Xt=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),d=Xt(1),pt=Xt(2),Wn=Xt(3),G=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Ce=new WeakMap,W=K.createTreeWalker(K,129);function Me(o,e){if(!Gt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return $e!==void 0?$e.createHTML(e):e}var vn=(o,e)=>{let t=o.length-1,n=[],i,s=e===2?"<svg>":e===3?"<math>":"",r=at;for(let l=0;l<t;l++){let a=o[l],c,h,f=-1,p=0;for(;p<a.length&&(r.lastIndex=p,h=r.exec(a),h!==null);)p=r.lastIndex,r===at?h[1]==="!--"?r=_e:h[1]!==void 0?r=ke:h[2]!==void 0?(ze.test(h[2])&&(i=RegExp("</"+h[2],"g")),r=F):h[3]!==void 0&&(r=F):r===F?h[0]===">"?(r=i??at,f=-1):h[1]===void 0?f=-2:(f=r.lastIndex-h[2].length,c=h[1],r=h[3]===void 0?F:h[3]==='"'?Ae:Se):r===Ae||r===Se?r=F:r===_e||r===ke?r=at:(r=F,i=void 0);let m=r===F&&o[l+1].startsWith("/>")?" ":"";s+=r===at?a+bn:f>=0?(n.push(c),a.slice(0,f)+Te+a.slice(f)+R+m):a+R+(f===-2?l:m)}return[Me(o,s+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},dt=class o{constructor({strings:e,_$litType$:t},n){let i;this.parts=[];let s=0,r=0,l=e.length-1,a=this.parts,[c,h]=vn(e,t);if(this.el=o.createElement(c,n),W.currentNode=this.el.content,t===2||t===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=W.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(Te)){let p=h[r++],m=i.getAttribute(f).split(R),w=/([.?@])?(.*)/.exec(p);a.push({type:1,index:s,name:w[2],strings:m,ctor:w[1]==="."?Zt:w[1]==="?"?qt:w[1]==="@"?Ft:Q}),i.removeAttribute(f)}else f.startsWith(R)&&(a.push({type:6,index:s}),i.removeAttribute(f));if(ze.test(i.tagName)){let f=i.textContent.split(R),p=f.length-1;if(p>0){i.textContent=wt?wt.emptyScript:"";for(let m=0;m<p;m++)i.append(f[m],lt()),W.nextNode(),a.push({type:2,index:++s});i.append(f[p],lt())}}}else if(i.nodeType===8)if(i.data===Ee)a.push({type:2,index:s});else{let f=-1;for(;(f=i.data.indexOf(R,f+1))!==-1;)a.push({type:7,index:s}),f+=R.length-1}s++}}static createElement(e,t){let n=K.createElement("template");return n.innerHTML=e,n}};function J(o,e,t=o,n){if(e===G)return e;let i=n!==void 0?t._$Co?.[n]:t._$Cl,s=ct(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(o),i._$AT(o,t,n)),n!==void 0?(t._$Co??=[])[n]=i:t._$Cl=i),i!==void 0&&(e=J(o,i._$AS(o,e.values),i,n)),e}var jt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,i=(e?.creationScope??K).importNode(t,!0);W.currentNode=i;let s=W.nextNode(),r=0,l=0,a=n[0];for(;a!==void 0;){if(r===a.index){let c;a.type===2?c=new ut(s,s.nextSibling,this,e):a.type===1?c=new a.ctor(s,a.name,a.strings,this,e):a.type===6&&(c=new Wt(s,this,e)),this._$AV.push(c),a=n[++l]}r!==a?.index&&(s=W.nextNode(),r++)}return W.currentNode=K,i}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},ut=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),ct(e)?e===u||e==null||e===""?(this._$AH!==u&&this._$AR(),this._$AH=u):e!==this._$AH&&e!==G&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):yn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==u&&ct(this._$AH)?this._$AA.nextSibling.data=e:this.T(K.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=dt.createElement(Me(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(t);else{let s=new jt(i,this),r=s.u(this.options);s.p(t),this.T(r),this._$AH=s}}_$AC(e){let t=Ce.get(e.strings);return t===void 0&&Ce.set(e.strings,t=new dt(e)),t}k(e){Gt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,i=0;for(let s of e)i===t.length?t.push(n=new o(this.O(lt()),this.O(lt()),this,this.options)):n=t[i],n._$AI(s),i++;i<t.length&&(this._$AR(n&&n._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=we(e).nextSibling;we(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,i,s){this.type=1,this._$AH=u,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=u}_$AI(e,t=this,n,i){let s=this.strings,r=!1;if(s===void 0)e=J(this,e,t,0),r=!ct(e)||e!==this._$AH&&e!==G,r&&(this._$AH=e);else{let l=e,a,c;for(e=s[0],a=0;a<s.length-1;a++)c=J(this,l[n+a],t,a),c===G&&(c=this._$AH[a]),r||=!ct(c)||c!==this._$AH[a],c===u?e=u:e!==u&&(e+=(c??"")+s[a+1]),this._$AH[a]=c}r&&!i&&this.j(e)}j(e){e===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Zt=class extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===u?void 0:e}},qt=class extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==u)}},Ft=class extends Q{constructor(e,t,n,i,s){super(e,t,n,i,s),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??u)===G)return;let n=this._$AH,i=e===u&&n!==u||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==u&&(n===u||i);i&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Wt=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}};var xn=Kt.litHtmlPolyfillSupport;xn?.(dt,ut),(Kt.litHtmlVersions??=[]).push("3.3.3");var Pe=(o,e,t)=>{let n=t?.renderBefore??e,i=n._$litPart$;if(i===void 0){let s=t?.renderBefore??null;n._$litPart$=i=new ut(e.insertBefore(lt(),s),s,void 0,t??{})}return i._$AI(o),i};var Yt=globalThis,S=class extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Pe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};S._$litElement$=!0,S.finalized=!0,Yt.litElementHydrateSupport?.({LitElement:S});var wn=Yt.litElementPolyfillSupport;wn?.({LitElement:S});(Yt.litElementVersions??=[]).push("4.2.2");var $n={attribute:!0,type:String,converter:rt,reflect:!1,hasChanged:xt},_n=(o=$n,e,t)=>{let{kind:n,metadata:i}=t,s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),n==="setter"&&((o=Object.create(o)).wrapped=!0),s.set(t.name,o),n==="accessor"){let{name:r}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(r,a,o,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,o,l),l}}}if(n==="setter"){let{name:r}=t;return function(l){let a=this[r];e.call(this,l),this.requestUpdate(r,a,o,!0,l)}}throw Error("Unsupported decorator location: "+n)};function z(o){return(e,t)=>typeof t=="object"?_n(o,e,t):((n,i,s)=>{let r=i.hasOwnProperty(s);return i.constructor.createProperty(s,n),r?Object.getOwnPropertyDescriptor(i,s):void 0})(o,e,t)}function x(o){return z({...o,state:!0,attribute:!1})}var Jt={en:{heating:"Heating",idle:"Idle",off:"Off",max:"Max",schedule:"Schedule",manual:"Manual",away:"Away",boost:"Boost",precomfort:"Precomfort",no_schedule:"No schedule",target:"Target",now:"now",until:"until",then:"then",all_day:"all day",tomorrow:"tomorrow",manual_paused:"Manual \xB7 schedule paused",resume:"Resume schedule",boost_for:"Boost {min} min",boost_to:"Boost to {value} \xB7 {left} left",cancel:"Cancel",lower:"Lower target temperature",raise:"Raise target temperature",battery:"Battery",battery_low:"Low",thermostats:"{n} thermostats",thermostat:"1 thermostat",min:"min",boost_badge_aria:"Boost {zone} for {min} minutes",cancel_boost_aria:"Cancel boost in {zone}",unavailable:"Unavailable",not_luna:"{entity} is not a Luna Climate zone",humidity:"Humidity",mode:"Mode",temperature:"Temperature",days:"Days",carry_over:"Carried over from the day before",move_start:"Move start ({time})",add_block:"Add block",copy_day:"Copy day",discard:"Discard",saving:"Saving\u2026",save:"Save",copy_to:"Copy {day} to",apply:"Apply",carry_hint:"{value} continues from {day}. Add a block at 00:00 to start this day differently.",empty_hint:"No blocks on this day yet. Add one to give it its own schedule.",add_midnight:"Add block at 00:00",select_hint:"Tap a block to change it. Drag a handle to move a start time.",from:"From",to:"To",next_block:"next day's first block",action:"Action",split:"Split",remove:"Remove",overview:"Overview",devices:"Devices",settings:"Settings",thermostats_title:"Thermostats",sensors_title:"Temperature sensors",linked_title:"Linked devices",humidity_title:"Humidity sensors",batteries:"Batteries",home:"Home",everyone_away:"Everyone away",follows_away:"Follows home/away",not_following_away:"Ignores home/away",open_in_ha:"Open in Home Assistant",close:"Close",unsaved:"The schedule has unsaved changes.",keep_editing:"Keep editing",discard_close:"Discard and close",saved:"Schedule saved",away_temp:"Away temperature",boost_offset:"Boost offset",hysteresis:"Hysteresis",min_cycle:"Minimum cycle time",night_mode:"Night mode",night_temp:"Night temperature",current:"Now",none:"None"},de:{heating:"Heizt",idle:"Bereit",off:"Aus",max:"Max",schedule:"Zeitplan",manual:"Manuell",away:"Abwesend",boost:"Boost",precomfort:"Vorheizen",no_schedule:"Kein Zeitplan",target:"Ziel",now:"aktuell",until:"bis",then:"danach",all_day:"ganzt\xE4gig",tomorrow:"morgen",manual_paused:"Manuell \xB7 Zeitplan pausiert",resume:"Zeitplan fortsetzen",boost_for:"Boost {min} min",boost_to:"Boost auf {value} \xB7 noch {left}",cancel:"Abbrechen",lower:"Zieltemperatur senken",raise:"Zieltemperatur erh\xF6hen",battery:"Batterie",battery_low:"Schwach",thermostats:"{n} Thermostate",thermostat:"1 Thermostat",min:"min",boost_badge_aria:"{zone} f\xFCr {min} Minuten boosten",cancel_boost_aria:"Boost in {zone} abbrechen",unavailable:"Nicht verf\xFCgbar",not_luna:"{entity} ist keine Luna-Climate-Zone",humidity:"Luftfeuchte",mode:"Modus",temperature:"Temperatur",days:"Tage",carry_over:"Vom Vortag \xFCbernommen",move_start:"Beginn verschieben ({time})",add_block:"Block hinzuf\xFCgen",copy_day:"Tag kopieren",discard:"Verwerfen",saving:"Speichert\u2026",save:"Speichern",copy_to:"{day} kopieren nach",apply:"\xDCbernehmen",carry_hint:"{value} l\xE4uft von {day} weiter. F\xFCge einen Block um 00:00 hinzu, damit der Tag anders beginnt.",empty_hint:"Dieser Tag hat noch keine Bl\xF6cke. F\xFCge einen hinzu, um ihm einen eigenen Zeitplan zu geben.",add_midnight:"Block um 00:00 hinzuf\xFCgen",select_hint:"Tippe auf einen Block, um ihn zu \xE4ndern. Ziehe einen Griff, um eine Startzeit zu verschieben.",from:"Von",to:"Bis",next_block:"erster Block des n\xE4chsten Tages",action:"Aktion",split:"Teilen",remove:"Entfernen",overview:"\xDCbersicht",devices:"Ger\xE4te",settings:"Einstellungen",thermostats_title:"Thermostate",sensors_title:"Temperatursensoren",linked_title:"Verkn\xFCpfte Ger\xE4te",humidity_title:"Feuchtigkeitssensoren",batteries:"Batterien",home:"Zuhause",everyone_away:"Alle abwesend",follows_away:"Folgt Zuhause/Abwesend",not_following_away:"Ignoriert Zuhause/Abwesend",open_in_ha:"In Home Assistant \xF6ffnen",close:"Schlie\xDFen",unsaved:"Der Zeitplan hat ungespeicherte \xC4nderungen.",keep_editing:"Weiter bearbeiten",discard_close:"Verwerfen und schlie\xDFen",saved:"Zeitplan gespeichert",away_temp:"Abwesenheitstemperatur",boost_offset:"Boost-Aufschlag",hysteresis:"Hysterese",min_cycle:"Mindestschaltdauer",night_mode:"Nachtmodus",night_temp:"Nachttemperatur",current:"Aktuell",none:"Keine"}};function v(o,e,t={}){let s=((o?.locale?.language??o?.language??"en").slice(0,2)==="de"?Jt.de:Jt.en)[e]??Jt.en[e];for(let[r,l]of Object.entries(t))s=s.replace(`{${r}}`,String(l));return s}function A(o){return!!(o&&o.attributes.luna_zone_id)}function kn(o){if(o==="off"||o==="max")return o;let e=Number(o);return Number.isFinite(e)?e:"off"}function L(o){let e=o.attributes,t=kn(e.luna_value),n=typeof e.current_temperature=="number"?e.current_temperature:void 0,i=e.hvac_action==="heating"||e.hvac_action===void 0&&t!=="off"&&n!==void 0&&(t==="max"||n<t-.2),s=e.luna_boost_ends_at?Date.parse(e.luna_boost_ends_at):NaN,r=e.luna_boost_started_at?Date.parse(e.luna_boost_started_at):NaN;return{entityId:o.entity_id,zoneId:String(e.luna_zone_id??""),name:String(e.luna_zone_name??e.friendly_name??o.entity_id),available:o.state!=="unavailable",source:e.luna_source??"none",value:t,current:n,humidity:typeof e.current_humidity=="number"?e.current_humidity:void 0,heating:i,precomfort:!!e.luna_precomfort_active,boostEndsAt:Number.isFinite(s)?s:void 0,boostStartedAt:Number.isFinite(r)?r:void 0,thermostats:Array.isArray(e.luna_thermostats)?e.luna_thermostats:[],linkedDevices:Array.isArray(e.luna_linked_devices)?e.luna_linked_devices:[]}}function M(o,e=Date.now()){return o.source==="boost"&&o.boostEndsAt!==void 0&&o.boostEndsAt>e}function U(o,e=o.value,t=o.source){return e==="off"?y.off:t==="boost"?y.boost:t==="away"?y.away:e==="max"?y.max:y.heat}function N(o,e){return e||(!o.thermostats.length&&o.linkedDevices.length?"mdi:heating-coil":"mdi:radiator")}function tt(o,e){let t=o.entities;if(!t)return;let n=t[e]?.device_id;if(!n)return;let i=Object.values(t).find(l=>l.device_id===n&&l.translation_key==="battery_min");if(!i)return;let s=o.states[i.entity_id];if(!s)return;let r=Number(s.state);return{lowest:Number.isFinite(r)?r:void 0,warning:!!s.attributes.luna_battery_warning}}function _(o,e){if(o===void 0)return"\u2013";if(o==="off"||o==="max")return v(e,o);let t=e?.locale?.language??"en";return`${o.toLocaleString(t,{minimumFractionDigits:1,maximumFractionDigits:1})}\xB0`}function j(o,e){let t=e?.locale?.language??"en";return`${Math.round(o).toLocaleString(t)}%`}var Sn=[{key:"zone_mode",label:"mode"},{key:"away_temp",label:"away_temp"},{key:"boost_offset",label:"boost_offset"},{key:"hysteresis",label:"hysteresis"},{key:"min_cycle",label:"min_cycle"},{key:"night_mode",label:"night_mode"},{key:"night_temp",label:"night_temp"}],Be={schedule:"schedule",manual:"manual",away:"away",boost:"boost",none:"no_schedule"};function Qt(){return document.querySelector("home-assistant")}var P=class extends S{constructor(){super(...arguments);this.tab="overview";this.saving=!1;this.confirmClose=!1;this.bodyOverflow="";this.onKey=t=>{t.key==="Escape"&&(t.preventDefault(),this.confirmClose?this.confirmClose=!1:this.close())}}open(t,n="overview",i){this.restoreFocus=document.activeElement,this.entityId=t,this.tab=n,this.error=void 0,this.confirmClose=!1,this.schedule=void 0,this.hass=i??Qt()?.hass??this.hass,this.isConnected||document.body.appendChild(this),this.bodyOverflow=document.body.style.overflow,document.body.style.overflow="hidden",window.clearInterval(this.hassTimer),this.hassTimer=window.setInterval(()=>{let s=Qt()?.hass;s&&s!==this.hass&&(this.hass=s)},1e3),window.clearInterval(this.tickTimer),this.tickTimer=window.setInterval(()=>this.requestUpdate(),1e3),this.loadSchedule(),this.updateComplete.then(()=>this.renderRoot.querySelector(".dialog")?.focus())}close(t=!1){let n=this.editor;if(!t&&n?.dirty){this.tab="schedule",this.confirmClose=!0;return}window.clearInterval(this.hassTimer),window.clearInterval(this.tickTimer),window.clearTimeout(this.toastTimer),document.body.style.overflow=this.bodyOverflow,this.confirmClose=!1,this.remove(),this.restoreFocus?.focus?.()}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey)}get editor(){return this.renderRoot?.querySelector("luna-schedule-editor")}get stateObj(){return this.entityId?this.hass?.states[this.entityId]:void 0}L(t,n){return v(this.hass,t,n)}async loadSchedule(){let t=this.stateObj;if(!(!this.hass||!t||!A(t)))try{let n=await this.hass.callWS({type:"luna_climate/schedule/get",zone_id:t.attributes.luna_zone_id});this.schedule=n.schedule}catch(n){this.error=String(n?.message??n)}}async onSave(t){let n=this.stateObj;if(!(!this.hass||!n)){this.saving=!0,this.error=void 0;try{let i=await this.hass.callWS({type:"luna_climate/schedule/set",zone_id:n.attributes.luna_zone_id,schedule:t.detail.schedule});this.schedule=i.schedule,this.showToast(this.L("saved"))}catch(i){this.error=String(i?.message??i)}finally{this.saving=!1}}}showToast(t){this.toast=t,window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toast=void 0,2500)}moreInfo(t){if(this.editor?.dirty){this.tab="schedule",this.confirmClose=!0;return}this.close(!0),(Qt()??document.body).dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}async service(t,n={}){!this.hass||!this.entityId||await this.hass.callService("luna_climate",t,{entity_id:this.entityId,...n})}settingEntity(t){let n=this.hass?.entities,i=this.entityId?n?.[this.entityId]?.device_id:void 0;if(!(!n||!i))return Object.values(n).find(s=>s.device_id===i&&s.translation_key===t)?.entity_id}homeEntity(){let t=this.hass?.entities;if(!t)return;let n=Object.values(t).find(i=>i.platform==="luna_climate"&&i.translation_key==="home")?.entity_id;return n?this.hass.states[n]:void 0}batteryState(){let t=this.settingEntity("battery_min");return t?this.hass.states[t]:void 0}render(){let t=this.hass,n=this.stateObj;if(!t||!this.entityId)return u;let s=n&&A(n)?L(n):void 0,r=s?U(s):y.off,l=`--zone-color: ${r}; --zone-shape: ${T(r,16)};`;return d`
      <div class="backdrop" @click=${()=>this.close()}></div>
      <div class="dialog" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="title" style=${l}>
        <header>
          <span class="shape"><ha-icon .icon=${s?N(s):"mdi:alert-circle-outline"}></ha-icon></span>
          <div class="titles">
            <h2 id="title">${s?.name??this.entityId}</h2>
            ${s?d`<span class="sub">${this.L(Be[s.source]??"schedule")} · ${_(s.value,t)}</span>`:u}
          </div>
          <button type="button" class="close" aria-label=${this.L("close")} @click=${()=>this.close()}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>

        <nav class="tabs" role="tablist">
          ${["overview","schedule"].map(a=>d`<button
              type="button"
              role="tab"
              class=${this.tab===a?"active":""}
              aria-selected=${this.tab===a?"true":"false"}
              @click=${()=>this.tab=a}
            >
              ${this.L(a==="overview"?"overview":"schedule")}
            </button>`)}
        </nav>

        <div class="content">
          ${s?this.tab==="overview"?this.renderOverview(s):u:d`<p class="error">${this.L("not_luna",{entity:this.entityId})}</p>`}
          <luna-schedule-editor
            class=${s&&this.tab==="schedule"?"":"hidden"}
            .hass=${t}
            .schedule=${this.schedule}
            .busy=${this.saving}
            .error=${this.error}
            @schedule-save=${this.onSave}
          ></luna-schedule-editor>
        </div>

        ${this.confirmClose?d`<div class="confirm" role="alertdialog" aria-live="assertive">
              <span>${this.L("unsaved")}</span>
              <div>
                <button type="button" class="ghost" @click=${()=>this.confirmClose=!1}>${this.L("keep_editing")}</button>
                <button type="button" class="danger" @click=${()=>this.close(!0)}>${this.L("discard_close")}</button>
              </div>
            </div>`:u}
        ${this.toast?d`<div class="toast" role="status">${this.toast}</div>`:u}
      </div>
    `}renderOverview(t){let n=this.hass,i=this.L.bind(this),s=M(t),r=s?Math.max(0,t.boostEndsAt-Date.now()):0,l=Math.floor(r/1e3),a=this.homeEntity(),c=this.batteryState(),h=c?.attributes.luna_batteries??[],f=c?.attributes.luna_battery_flags??[],p=(m,w,$)=>d`<div class="stat">
        <span class="label">${i(m)}</span>
        <span class="value">${$?d`<ha-icon .icon=${$}></ha-icon>`:u}${w}</span>
      </div>`;return d`
      <section class="stats">
        ${p("current",t.current!==void 0?_(t.current,n):"\u2013",t.heating?"mdi:fire":void 0)}
        ${p("target",_(t.value,n))}
        ${t.humidity!==void 0?p("humidity",j(t.humidity,n),"mdi:water-percent"):u}
        ${p("mode",i(Be[t.source]??"schedule"))}
      </section>

      <section class="actions">
        ${s?d`<button type="button" class="action boosting" @click=${()=>this.service("cancel_boost")}>
              <ha-icon icon="mdi:fire"></ha-icon>${i("boost")} · ${Math.floor(l/60)}:${String(l%60).padStart(2,"0")}
              <span class="muted">${i("cancel")}</span>
            </button>`:[30,60].map(m=>d`<button type="button" class="action" @click=${()=>this.service("boost",{duration:m})}>
                <ha-icon icon="mdi:fire"></ha-icon>${i("boost_for",{min:m})}
              </button>`)}
        ${t.source==="manual"?d`<button type="button" class="action" @click=${()=>this.service("resume_schedule")}>
              <ha-icon icon="mdi:calendar-clock"></ha-icon>${i("resume")}
            </button>`:u}
      </section>

      <section class="group">
        <h3>${i("home")}</h3>
        <div class="list">
          ${a?d`<button type="button" class="row" @click=${()=>this.moreInfo(a.entity_id)}>
                <ha-icon .icon=${a.state==="on"?"mdi:home-account":"mdi:home-export-outline"}></ha-icon>
                <span class="name">${a.state==="on"?i("home"):i("everyone_away")}</span>
                <span class="state">${this.stateObj?.attributes.luna_away_enabled===!1?i("not_following_away"):i("follows_away")}</span>
              </button>`:d`<div class="row static"><span class="name">${i("none")}</span></div>`}
        </div>
      </section>

      ${this.renderDevices(i("thermostats_title"),t.thermostats)}
      ${this.renderDevices(i("sensors_title"),this.stateObj?.attributes.luna_temp_sensors??[])}
      ${this.renderDevices(i("linked_title"),t.linkedDevices)}

      ${h.length||f.length?d`<section class="group">
            <h3>${i("batteries")}</h3>
            <div class="list">
              ${h.map(m=>d`<button type="button" class="row" @click=${()=>this.moreInfo(m.entity_id)}>
                  <ha-icon .icon=${m.level<5?"mdi:battery-alert-variant-outline":"mdi:battery"}></ha-icon>
                  <span class="name">${m.device}</span>
                  <span class="state ${m.level<5?"warn":""}">${Math.round(m.level)}%</span>
                </button>`)}
              ${f.map(m=>d`<button type="button" class="row" @click=${()=>this.moreInfo(m.entity_id)}>
                  <ha-icon .icon=${m.low?"mdi:battery-alert-variant-outline":"mdi:battery"}></ha-icon>
                  <span class="name">${m.device}</span>
                  <span class="state ${m.low?"warn":""}">${m.low?i("battery_low"):"OK"}</span>
                </button>`)}
            </div>
          </section>`:u}

      <section class="group">
        <h3>${i("settings")}</h3>
        <div class="list">
          ${Sn.map(({key:m,label:w})=>{let $=this.settingEntity(m),q=$?n.states[$]:void 0;return!$||!q?u:d`<button type="button" class="row" @click=${()=>this.moreInfo($)}>
              <span class="name">${i(w)}</span>
              <span class="state">${n.formatEntityState?n.formatEntityState(q):q.state}</span>
              <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            </button>`})}
        </div>
      </section>

      <button type="button" class="link" @click=${()=>this.moreInfo(this.entityId)}>
        ${i("open_in_ha")} <ha-icon icon="mdi:open-in-new"></ha-icon>
      </button>
    `}renderDevices(t,n){if(!n.length)return u;let i=this.hass;return d`<section class="group">
      <h3>${t}</h3>
      <div class="list">
        ${n.map(s=>{let r=i.states[s],l=String(r?.attributes.friendly_name??s),a=r?i.formatEntityState?i.formatEntityState(r):r.state:this.L("unavailable");if(r&&s.startsWith("climate.")){let c=[a];typeof r.attributes.temperature=="number"&&c.push(`\u2192 ${_(r.attributes.temperature,i)}`),typeof r.attributes.current_temperature=="number"&&c.push(`${this.L("now")} ${_(r.attributes.current_temperature,i)}`),a=c.join(" \xB7 ")}return d`<button type="button" class="row" @click=${()=>this.moreInfo(s)}>
            ${r?d`<ha-state-icon .hass=${i} .stateObj=${r}></ha-state-icon>`:d`<ha-icon icon="mdi:help-circle-outline"></ha-icon>`}
            <span class="name">${l}</span>
            <span class="state">${a}</span>
          </button>`})}
      </div>
    </section>`}};P.styles=E`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--ha-font-family-body, Roboto, system-ui, sans-serif);
      color: var(--primary-text-color);
      --luna-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      animation: fade 150ms ease;
    }
    .dialog {
      position: relative;
      box-sizing: border-box;
      width: min(720px, calc(100vw - 32px));
      /* Fixed, so switching tabs doesn't make the dialog jump. */
      height: min(860px, calc(100vh - 48px));
      outline: none;
      display: flex;
      flex-direction: column;
      border-radius: 24px;
      background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      animation: rise 180ms ease;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
    @media (max-width: 600px) {
      .dialog {
        width: 100vw;
        height: 100dvh;
        border-radius: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        animation: none;
      }
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
    ha-icon,
    ha-state-icon {
      --mdc-icon-size: 20px;
    }

    header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 16px 10px 20px;
    }
    .shape {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--zone-shape);
      color: var(--zone-color);
      --mdc-icon-size: 24px;
    }
    .titles {
      flex: 1;
      min-width: 0;
    }
    h2 {
      margin: 0;
      font-size: 20px;
      line-height: 26px;
      font-weight: 600;
    }
    .sub {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .close {
      all: unset;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .close:hover {
      background: var(--luna-soft);
    }
    .close:focus-visible {
      outline: 2px solid var(--primary-color);
    }

    .tabs {
      display: flex;
      gap: 4px;
      padding: 0 20px;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .tabs button {
      all: unset;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    .tabs button.active {
      color: var(--primary-text-color);
      border-bottom-color: var(--zone-color);
    }
    .tabs button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 18px 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overscroll-behavior: contain;
    }
    .hidden {
      display: none !important;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 14px;
      border-radius: 14px;
      background: var(--luna-soft);
    }
    .stat .label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .stat .value {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 20px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      --mdc-icon-size: 18px;
    }
    .stat .value ha-icon {
      color: var(--zone-color);
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .action {
      all: unset;
      box-sizing: border-box;
      flex: 1 1 140px;
      height: 44px;
      padding: 0 14px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      background: var(--luna-soft);
    }
    .action ha-icon {
      color: ${B(y.boost)};
    }
    .action.boosting {
      background: color-mix(in srgb, ${B(y.boost)} 18%, transparent);
    }
    .action .muted {
      margin-left: auto;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    .action:focus-visible {
      outline: 2px solid var(--primary-color);
    }

    .group h3 {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .list {
      border-radius: 14px;
      overflow: hidden;
      background: var(--luna-soft);
    }
    .row {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      min-height: 48px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .row + .row {
      border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }
    .row:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .row.static {
      cursor: default;
    }
    .row > ha-icon,
    .row > ha-state-icon {
      flex: none;
      color: var(--secondary-text-color);
    }
    .row .name {
      flex: 1;
      min-width: 0;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row .state {
      font-size: 13.5px;
      color: var(--secondary-text-color);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .row .state.warn {
      color: ${B(y.warning)};
      font-weight: 600;
    }
    .row .chev {
      --mdc-icon-size: 18px;
    }
    .link {
      all: unset;
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-color);
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .link:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .error {
      color: var(--error-color);
    }

    .confirm {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding: 12px 20px;
      border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, var(--ha-card-background, var(--card-background-color)));
      font-size: 14px;
    }
    .confirm div {
      display: flex;
      gap: 8px;
    }
    .confirm button {
      all: unset;
      height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .confirm .ghost {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }
    .confirm .danger {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .toast {
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      padding: 10px 16px;
      border-radius: 10px;
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  `,b([x()],P.prototype,"hass",2),b([x()],P.prototype,"entityId",2),b([x()],P.prototype,"tab",2),b([x()],P.prototype,"schedule",2),b([x()],P.prototype,"saving",2),b([x()],P.prototype,"error",2),b([x()],P.prototype,"confirmClose",2),b([x()],P.prototype,"toast",2);var Le;function I(o,e="overview",t){customElements.get("luna-zone-dialog")&&(Le??=document.createElement("luna-zone-dialog"),Le.open(o,e,t))}function X(o,e,t){o.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}function H(o="light"){X(window,"haptic",o)}function te(o){return o!==void 0&&o.action!=="none"}async function He(o,e,t,n){if(!n||n.action==="none")return;if(n.confirmation){let s=typeof n.confirmation=="object"&&n.confirmation.text?n.confirmation.text:"Are you sure?";if(H("warning"),!window.confirm(s))return}let i=n.entity??t;switch(n.action){case"more-info":i&&e.states[i]?.attributes.luna_zone_id!==void 0?I(i,"overview",e):i&&X(o,"hass-more-info",{entityId:i});return;case"toggle":i&&(await e.callService("homeassistant","toggle",{entity_id:i}),H("light"));return;case"perform-action":case"call-service":{let s=n.perform_action??n.service;if(!s||!s.includes("."))return;let[r,l]=s.split(".",2);await e.callService(r,l,n.data??n.service_data,n.target),H("light");return}case"navigate":if(!n.navigation_path)return;n.navigation_replace?history.replaceState(null,"",n.navigation_path):history.pushState(null,"",n.navigation_path),X(window,"location-changed",{replace:!!n.navigation_replace});return;case"url":n.url_path&&window.open(n.url_path);return;case"fire-dom-event":X(o,"ll-custom",n);return}}var _t=class{constructor(e,t){this.onGesture=e;this.options=t;this.held=!1;this.startX=0;this.startY=0;this.active=!1;this.down=e=>{e.button===0&&(this.active=!0,this.held=!1,this.startX=e.clientX,this.startY=e.clientY,window.clearTimeout(this.holdTimer),this.options().hold&&(this.holdTimer=window.setTimeout(()=>{this.held=!0,H("light"),this.onGesture("hold")},500)))};this.move=e=>{this.active&&(Math.abs(e.clientX-this.startX)>10||Math.abs(e.clientY-this.startY)>10)&&this.cancel()};this.up=()=>{if(this.active&&(this.active=!1,window.clearTimeout(this.holdTimer),!this.held)){if(!this.options().doubleTap){this.onGesture("tap");return}if(this.tapTimer!==void 0){window.clearTimeout(this.tapTimer),this.tapTimer=void 0,this.onGesture("double_tap");return}this.tapTimer=window.setTimeout(()=>{this.tapTimer=void 0,this.onGesture("tap")},250)}};this.cancel=()=>{this.active=!1,window.clearTimeout(this.holdTimer)};this.key=e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.onGesture("tap"))};this.contextMenu=e=>{this.options().hold&&e.preventDefault()}}};var ee=2*Math.PI*17,V=class extends S{constructor(){super(...arguments);this.gestures=new _t(t=>void this.onGesture(t),()=>({hold:te(this.actionFor("hold")),doubleTap:te(this.actionFor("double_tap"))}))}tickEvery(){return 0}entityId(){return typeof this.config?.entity=="string"?this.config.entity:void 0}async onGesture(t){this.hass&&await He(this,this.hass,this.entityId(),this.actionFor(t))}getCardSize(){return 1}getGridOptions(){return{columns:6,rows:1,min_columns:3,min_rows:1}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),this.tickTimer=void 0}updated(t){super.updated(t);let n=this.tickEvery();n&&this.tickTimer===void 0?this.tickTimer=window.setInterval(()=>this.requestUpdate(),n):!n&&this.tickTimer!==void 0&&(window.clearInterval(this.tickTimer),this.tickTimer=void 0)}render(){if(!this.config||!this.hass)return u;let t=this.viewModel();if(!t)return u;let n=[`--pill-color: ${t.color}`,`--pill-shape: ${T(t.color,18)}`,`--pill-ring-track: ${T(t.color,22)}`,`--pill-indicator: ${t.indicatorColor??"var(--error-color, #db4437)"}`].join(";"),i=t.progress===void 0?ee:ee*(1-Math.min(1,Math.max(0,t.progress)));return d`
      <ha-card style=${n}>
        <button
          class="pill"
          type="button"
          aria-label=${t.ariaLabel}
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
              ${t.stateObj?d`<ha-state-icon
                    .hass=${this.hass}
                    .stateObj=${t.stateObj}
                    .icon=${t.icon}
                  ></ha-state-icon>`:d`<ha-icon .icon=${t.icon??"mdi:help-circle-outline"}></ha-icon>`}
            </span>
            ${t.progress===void 0?u:pt`<svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
                  <circle class="track" cx="18" cy="18" r="17"></circle>
                  <circle class="bar" cx="18" cy="18" r="17"
                    stroke-dasharray=${ee.toFixed(2)}
                    stroke-dashoffset=${i.toFixed(2)}></circle>
                </svg>`}
            ${t.indicator?d`<span class="dot"></span>`:u}
          </span>
          <span class="text">
            ${t.name?d`<span class="name">${t.name}</span>`:u}
            ${t.content?d`<span class="content">${t.content}</span>`:u}
          </span>
        </button>
      </ha-card>
    `}};V.styles=E`
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
  `,b([z({attribute:!1})],V.prototype,"hass",2),b([x()],V.prototype,"config",2);function De(o){return typeof o=="string"&&(o.includes("{{")||o.includes("{%"))}var kt=class{constructor(e){this.onChange=e;this.subs=new Map;this.results=new Map}sync(e,t,n){let i=new Map;for(let[s,r]of Object.entries(t))De(r)&&i.set(s,r);for(let[s,r]of this.subs)i.get(s)!==r.template&&this.drop(s);for(let[s,r]of i){if(this.subs.has(s))continue;let l=e.connection.subscribeMessage(a=>{if(a.error!==void 0)console.warn(`luna card template "${s}":`,a.error),this.results.set(s,"");else{let c=a.result;this.results.set(s,c==null?"":typeof c=="object"?JSON.stringify(c):String(c))}this.onChange()},{type:"render_template",template:r,variables:n,strict:!0,report_errors:!0}).catch(a=>(console.warn(`luna card template "${s}" failed:`,a),this.results.set(s,""),this.onChange(),async()=>{}));this.subs.set(s,{template:r,unsub:l})}}value(e,t){if(De(t))return this.results.get(e);if(t!=null)return String(t)}clear(){for(let e of[...this.subs.keys()])this.drop(e)}drop(e){let t=this.subs.get(e);this.subs.delete(e),this.results.delete(e),t?.unsub.then(n=>n()).catch(()=>{})}};var An=["name","content","icon","color","progress","indicator","indicator_color"];function Cn(o){if(o===void 0)return!1;let e=o.trim().toLowerCase();return!(e===""||e==="false"||e==="0"||e==="off"||e==="none"||e==="no")}var St=class extends V{constructor(){super(...arguments);this.templates=new kt(()=>this.requestUpdate());this.resync=!0}setConfig(t){if(!t)throw new Error("Invalid configuration");if(!t.entity&&!t.content&&!t.name)throw new Error("Set an entity, or at least a name or content");this.config={...t},this.resync=!0}static getStubConfig(t){return{type:"custom:luna-badge-card",entity:Object.keys(t.states).find(i=>i.startsWith("light.")||i.startsWith("sensor."))}}static getConfigForm(){return{schema:[{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]},{name:"content",selector:{template:{}}},{name:"color",selector:{ui_color:{include_state:!1,include_none:!0}}},{name:"progress",selector:{template:{}}},{name:"indicator",selector:{template:{}}},{name:"tap_action",selector:{ui_action:{default_action:"more-info"}}},{name:"hold_action",selector:{ui_action:{default_action:"none"}}},{name:"double_tap_action",selector:{ui_action:{default_action:"none"}}}],computeLabel:t=>({entity:"Entity",name:"Name (small line)",icon:"Icon",content:"Content (bold line) \u2014 text or template",color:"Colour",progress:"Progress ring, 0\u2013100 \u2014 number or template",indicator:"Indicator dot \u2014 template, shown when truthy",tap_action:"Tap",hold_action:"Hold",double_tap_action:"Double tap"})[t.name]??t.name}}disconnectedCallback(){super.disconnectedCallback(),this.templates.clear()}connectedCallback(){super.connectedCallback(),this.resync=!0,this.requestUpdate()}willUpdate(t){if(super.willUpdate(t),!(!this.hass||!this.config||!this.isConnected)&&this.resync){this.resync=!1;let n={};for(let i of An)n[i]=this.config[i];this.templates.sync(this.hass,n,{config:this.config,user:this.hass.user?.name,entity:this.config.entity})}}actionFor(t){let n=this.config;if(n)return t==="tap"?n.tap_action??(n.entity?{action:"more-info"}:void 0):t==="hold"?n.hold_action:n.double_tap_action}viewModel(){let t=this.config,n=this.hass,i=f=>this.templates.value(f,t[f]),s=t.entity?n.states[t.entity]:void 0,r=i("name")??(s?String(s.attributes.friendly_name??t.entity):void 0),l=i("content")??(s?n.formatEntityState?n.formatEntityState(s):s.state:void 0),a=i("progress"),c;if(a!==void 0&&a.trim()!==""){let f=Number(a);Number.isFinite(f)&&(c=Math.min(100,Math.max(0,f))/100)}let h=Nt(i("color"))??"var(--state-icon-color, var(--primary-color))";return{stateObj:s,icon:i("icon"),name:r,content:l,color:h,progress:c,indicator:Cn(i("indicator")),indicatorColor:Nt(i("indicator_color")),ariaLabel:[r,l].filter(Boolean).join(", ")}}};var At=class extends V{setConfig(e){if(!e?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={duration:30,show_humidity:!0,...e}}static getStubConfig(e){return{type:"custom:luna-boost-badge",entity:Object.keys(e.states).find(n=>A(e.states[n]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"duration",selector:{number:{min:5,max:240,step:5,unit_of_measurement:"min",mode:"box"}}}]},{name:"show_humidity",selector:{boolean:{}}},{name:"hold_action",selector:{ui_action:{default_action:"more-info"}}}],computeLabel:e=>({entity:"Luna zone",name:"Name",duration:"Boost duration",show_humidity:"Show humidity",hold_action:"Hold"})[e.name]??e.name}}tickEvery(){let e=this.config&&this.hass?.states[this.config.entity];return e&&A(e)&&M(L(e))?5e3:0}actionFor(e){let t=this.config;if(t)return e==="tap"?t.tap_action:e==="hold"?t.hold_action??{action:"more-info"}:t.double_tap_action}async onGesture(e){if(e!=="tap"||this.config?.tap_action||!this.hass||!this.config)return super.onGesture(e);let t=this.hass.states[this.config.entity];if(!t||!A(t))return;let n=L(t);H(M(n)?"light":"success"),M(n)?await this.hass.callService("luna_climate","cancel_boost",{entity_id:n.entityId}):await this.hass.callService("luna_climate","boost",{entity_id:n.entityId,duration:this.config.duration??30})}viewModel(){let e=this.config,t=this.hass,n=t.states[e.entity];if(!n)return{icon:"mdi:alert-circle-outline",name:e.entity,content:v(t,"unavailable"),color:y.warning,ariaLabel:e.entity};if(!A(n))return{icon:"mdi:alert-circle-outline",name:e.name??e.entity,content:v(t,"not_luna",{entity:""}).trim(),color:y.warning,ariaLabel:v(t,"not_luna",{entity:e.entity})};let i=L(n),s=e.name??i.name,r=e.duration??30,l=tt(t,i.entityId),a=Date.now();if(!i.available)return{icon:N(i,e.icon),name:s,content:v(t,"unavailable"),color:y.off,ariaLabel:`${s}, ${v(t,"unavailable")}`};if(M(i,a)){let m=Math.max(0,i.boostEndsAt-a),w=i.boostStartedAt!==void 0?i.boostEndsAt-i.boostStartedAt:r*6e4;return{icon:"mdi:fire",name:s,content:`${v(t,"boost")} \xB7 ${Math.ceil(m/6e4)} ${v(t,"min")}`,color:y.boost,progress:w>0?m/w:0,indicator:l?.warning,ariaLabel:v(t,"cancel_boost_aria",{zone:s})}}let c=i.current!==void 0?_(i.current,t):"\u2013",h=e.show_humidity!==!1&&i.humidity!==void 0?j(i.humidity,t):void 0,f=N(i,e.icon),p=h?`${c} \xB7 ${h}`:c;return i.source==="away"?(f="mdi:home-export-outline",p=`${v(t,"away")} \xB7 ${_(i.value,t)}`):i.value==="off"&&(f="mdi:power",p=`${v(t,"off")} \xB7 ${c}`),{icon:f,name:s,content:p,color:U(i),indicator:l?.warning,ariaLabel:v(t,"boost_badge_aria",{zone:s,min:r})}}};var Tn={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6};function Ie(o,e=new Date){try{let t=new Intl.DateTimeFormat("en-US",{timeZone:o,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(e),n=i=>t.find(s=>s.type===i)?.value??"";return{weekday:Tn[n("weekday")]??0,minutes:Number(n("hour"))*60+Number(n("minute"))}}catch{return{weekday:(e.getDay()+6)%7,minutes:e.getHours()*60+e.getMinutes()}}}function En(o){let[e,t]=o.split(":").map(Number);return(e||0)*60+(t||0)}function ne(o,e){return o.filter(t=>t.weekdays.includes(e)).map(t=>({start:En(t.start),value:t.value})).sort((t,n)=>t.start-n.start)}function Oe(o,e){if(!o.length)return{segments:[]};let t;for(let a=1;a<=7&&t===void 0;a++){let c=ne(o,(e.weekday-a+7)%7);c.length&&(t=c[c.length-1].value)}let n=ne(o,e.weekday),i=[...n];(!i.length||i[0].start>0)&&t!==void 0&&i.unshift({start:0,value:t});let s=i.map((a,c)=>{let h=c+1<i.length?i[c+1].start:1440;return{start:a.start,end:h,value:a.value,current:e.minutes>=a.start&&e.minutes<h}}),r={segments:s,current:s.find(a=>a.current)?.value},l=n.find(a=>a.start>e.minutes);if(l)return r.nextAt=l.start,r.nextValue=l.value,r.nextDayOffset=0,r;for(let a=1;a<=7;a++){let c=ne(o,(e.weekday+a)%7);if(c.length){r.nextAt=a*1440+c[0].start,r.nextValue=c[0].value,r.nextDayOffset=a;break}}return r}function Ne(o){let e=(o%1440+1440)%1440,t=Math.floor(e/60),n=e%60;return`${t<10?"0":""}${t}:${n<10?"0":""}${n}`}var et=class{constructor(e,t){this.host=e;this.source=t;e.addController(this)}hostConnected(){this.key=void 0}hostUpdated(){let{hass:e,zone:t,enabled:n}=this.source();if(!e||!t||!n)return;let i=e.states[t.entityId]?.attributes.luna_block_start??"",s=`${t.zoneId}|${i}|${Math.floor(Date.now()/6e5)}`;s!==this.key&&(this.key=s,this.fetch(e,t.zoneId))}async fetch(e,t){try{let n=await e.callWS({type:"luna_climate/schedule/get",zone_id:t});this.schedule=n.schedule}catch(n){console.warn("luna card: could not load schedule",n),this.schedule=[]}this.host.requestUpdate()}};function Ct({hass:o,schedule:e,source:t,onResume:n,onOpen:i}){let s=(p,m)=>v(o,p,m),r=p=>_(p,o),l=Ie(o.config.time_zone),a=e?Oe(e,l):{segments:[]},c="";if(a.nextAt!==void 0){let p=Ne(a.nextAt);if(a.nextDayOffset===0)c=`${s("until")} ${p}`;else if(a.nextDayOffset===1)c=`${s("until")} ${s("tomorrow")} ${p}`;else{let m=new Date(Date.now()+a.nextDayOffset*864e5).toLocaleDateString(o.locale?.language??"en",{weekday:"short"});c=`${s("until")} ${m} ${p}`}}else a.current!==void 0&&(c=s("all_day"));let h;t==="manual"?h=s("manual_paused"):a.current===void 0?h=e?s("no_schedule"):"":h=`${t==="schedule"?"":`${s("schedule")} `}${r(a.current)} ${c}`.trim();let f=a.nextValue!==void 0?`${s("then")} ${r(a.nextValue)}`:"";return d`
    <div class="schedule">
      <div class="caption">
        <span class="left">${h}</span>
        ${t==="manual"?d`<button type="button" class="link" @click=${n}>${s("resume")}</button>`:d`<span class="right">${f}</span>`}
      </div>
      <div
        class="strip ${i?"open":""}"
        role=${i?"button":"presentation"}
        tabindex=${i?"0":"-1"}
        aria-label=${i?s("schedule"):""}
        @click=${p=>{i&&(p.stopPropagation(),i())}}
        @keydown=${p=>{i&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),i())}}
      >
        ${a.segments.map(p=>{let m=p.value==="off"?"color-mix(in srgb, var(--primary-text-color) 16%, transparent)":p.value==="max"?y.max:T(y.heat,Math.round(Math.min(100,35+(p.value-17)/8*65))),w=p.start/1440*100,$=(p.end-p.start)/1440*100;return d`<span
            class="block ${p.current?"current":""}"
            style=${`left: calc(${w}% + 1px); width: calc(${$}% - 2px); background: ${m};`}
          ></span>`})}
        ${Array.from({length:25},(p,m)=>d`<span class="tick ${m%6===0?"major":""}" style=${`left: ${m/24*100}%`}></span>`)}
        ${[0,6,12,18,24].map(p=>d`<span class="hour ${p===0?"first":p===24?"last":""}" style=${`left: ${p/24*100}%`}
              >${String(p).padStart(2,"0")}</span
            >`)}
        <span class="now-marker" style=${`left: ${l.minutes/1440*100}%`}></span>
      </div>
    </div>
  `}var Tt=E`
  .strip.open {
    cursor: pointer;
  }
  .strip.open:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 4px;
    border-radius: 4px;
  }
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
`;var g={W:366,H:232,cx:183,cy:170,r:150,T0:10,T1:27,A0:200,A1:-20},re=10.5,Et=25,ht=o=>g.A0-(o-g.T0)/(g.T1-g.T0)*(g.A0-g.A1),nt=(o,e)=>{let t=o*Math.PI/180;return{x:+(g.cx+e*Math.cos(t)).toFixed(2),y:+(g.cy-e*Math.sin(t)).toFixed(2)}},Ue=(o,e)=>{if(e-o<.01)return"";let t=ht(o),n=ht(e),i=nt(t,g.r),s=nt(n,g.r);return`M ${i.x} ${i.y} A ${g.r} ${g.r} 0 ${t-n>180?1:0} 1 ${s.x} ${s.y}`},zn=(()=>{let o="";for(let e=11;e<=26;e++){let t=ht(e),n=nt(t,g.r-13),i=nt(t,g.r-(e%5===0?22:18));o+=`M ${n.x} ${n.y} L ${i.x} ${i.y} `}return o})(),Mn=Ue(g.T0,g.T1),ie=B(y.boost),Ve=B(y.warning),oe=o=>o==="off"?g.T0:o==="max"?g.T1:Math.min(g.T1,Math.max(g.T0,o));function Re(o){return o<re-.25?"off":o>Et+.25?"max":Math.min(Et,Math.max(re,Math.round(o*2)/2))}var se={schedule:{icon:"mdi:calendar-clock",label:"schedule"},manual:{icon:"mdi:hand-back-right-outline",label:"manual"},away:{icon:"mdi:home-export-outline",label:"away"},boost:{icon:"mdi:fire",label:"boost"},none:{icon:"mdi:calendar-remove-outline",label:"no_schedule"}},Z=class extends S{constructor(){super(...arguments);this.scheduleCtl=new et(this,()=>({hass:this.hass,zone:this.zone,enabled:this.config?.show_schedule!==!1}));this.dragging=!1;this.tickEvery=0;this.onPointerDown=t=>{let n=this.pointerToTarget(t);n.onArc&&(t.preventDefault(),this.dragging=!0,window.clearTimeout(this.commitTimer),t.currentTarget.setPointerCapture?.(t.pointerId),this.pending=n.value)};this.onPointerMove=t=>{if(!this.dragging)return;let n=this.pointerToTarget(t).value;n!==this.pending&&(this.pending=n,H("light"))};this.onPointerUp=()=>{this.dragging&&(this.dragging=!1,this.commit())}}setConfig(t){if(!t?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={show_schedule:!0,show_stepper:!0,show_humidity:!0,boost_durations:[30,60],...t}}static getStubConfig(t){return{type:"custom:luna-zone-card",entity:Object.keys(t.states).find(i=>A(t.states[i]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"boost_durations",selector:{select:{multiple:!0,custom_value:!0,options:["15","30","45","60","90","120"].map(t=>({value:t,label:`${t} min`}))}}},{type:"grid",name:"",schema:[{name:"show_schedule",selector:{boolean:{}}},{name:"show_stepper",selector:{boolean:{}}},{name:"show_humidity",selector:{boolean:{}}}]}],computeLabel:t=>({entity:"Luna zone",name:"Name",icon:"Icon",boost_durations:"Boost buttons",show_schedule:"Show schedule strip",show_stepper:"Show \u2212 / + buttons",show_humidity:"Show humidity"})[t.name]??t.name}}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),window.clearTimeout(this.commitTimer),window.clearTimeout(this.echoTimer),this.tickTimer=void 0,this.tickEvery=0}get zone(){let t=this.config&&this.hass?.states[this.config.entity];return t&&A(t)?L(t):void 0}willUpdate(t){super.willUpdate(t);let n=this.zone;n&&this.awaitingEcho!==void 0&&!this.dragging&&n.source==="manual"&&n.value===this.awaitingEcho&&this.clearPending()}updated(t){super.updated(t);let n=this.zone;if(!n||!this.hass)return;let i=M(n)?1e3:3e4;i!==this.tickEvery&&(window.clearInterval(this.tickTimer),this.tickEvery=i,this.tickTimer=window.setInterval(()=>this.requestUpdate(),i))}clearPending(){this.pending=void 0,this.awaitingEcho=void 0,window.clearTimeout(this.echoTimer)}shownValue(t){return this.pending??t.value}step(t){let n=this.zone;if(!n)return;let i=this.shownValue(n),s=i==="off"?g.T0:i==="max"?Et+.5:i;s+=t*.5,i==="max"&&t<0&&(s=Et),i==="off"&&t>0&&(s=re),this.pending=Re(s),H("light"),window.clearTimeout(this.commitTimer),this.commitTimer=window.setTimeout(()=>this.commit(),900)}async commit(){let t=this.zone,n=this.pending;if(!(!t||n===void 0||!this.hass)){this.awaitingEcho=n,window.clearTimeout(this.echoTimer),this.echoTimer=window.setTimeout(()=>this.clearPending(),4e3);try{await this.hass.callService("luna_climate","set_target",{entity_id:t.entityId,value:n})}catch(i){throw this.clearPending(),i}}}pointerToTarget(t){let i=t.currentTarget.getBoundingClientRect(),s=i.width/g.W,r=(t.clientX-i.left)/s,l=(t.clientY-i.top)/s,a=Math.hypot(r-g.cx,l-g.cy),c=Math.atan2(g.cy-l,r-g.cx)*180/Math.PI;c<-90&&(c+=360),c=Math.max(g.A1,Math.min(g.A0,c));let h=g.T0+(g.A0-c)/(g.A0-g.A1)*(g.T1-g.T0);return{value:Re(h),onArc:Math.abs(a-g.r)<=30}}async call(t,n={}){let i=this.zone;!i||!this.hass||(this.clearPending(),await this.hass.callService("luna_climate",t,{entity_id:i.entityId,...n}))}moreInfo(){this.config&&I(this.config.entity,"overview",this.hass)}openSchedule(){this.config&&I(this.config.entity,"schedule",this.hass)}render(){if(!this.config||!this.hass)return u;let t=this.hass,n=t.states[this.config.entity];if(!n||!A(n))return d`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${v(t,"not_luna",{entity:this.config.entity})}</span>
      </ha-card>`;let i=L(n),s=(C,Ot)=>v(t,C,Ot),r=C=>_(C,t),l=this.shownValue(i),a=this.pending!==void 0?"manual":i.source,c=a==="boost"&&M(i),h=l==="off",f=l==="max",p=this.pending===void 0?i.heating:!h&&i.current!==void 0&&oe(l)>i.current,m=U(i,l,a),w=oe(l),$=i.current!==void 0?oe(i.current):void 0,q=h||$===void 0?"":Ue(Math.min(w,$),Math.max(w,$)),ue=nt(ht(w),g.r),Bt=$!==void 0?nt(ht($),g.r):void 0,Lt=i.precomfort&&a==="schedule"?{icon:"mdi:map-marker-radius-outline",label:"precomfort"}:se[a]??se.none,Ht=tt(t,i.entityId),Dt=[];i.thermostats.length&&Dt.push(i.thermostats.length===1?s("thermostat"):s("thermostats",{n:i.thermostats.length}));for(let C of i.linkedDevices){let Ot=t.states[C];Dt.push(String(Ot?.attributes.friendly_name??C))}let Je=[s(p?"heating":h?"off":"idle"),Dt.join(" + ")].filter(Boolean).join(" \xB7 "),pe=s(a==="schedule"?"target":se[a].label),Qe=h?s("off"):f?s("max"):l.toLocaleString(t.locale?.language??"en",{minimumFractionDigits:1,maximumFractionDigits:1}),It=i.current!==void 0?r(i.current):"\u2013",tn=h?`${It}`:`${s(p?"heating":"idle")} \xB7 ${s("now")} ${It}`,he=this.config.show_humidity!==!1&&i.humidity!==void 0?j(i.humidity,t):void 0,en=Date.now(),me=c?Math.max(0,i.boostEndsAt-en):0,fe=c&&i.boostStartedAt!==void 0?i.boostEndsAt-i.boostStartedAt:0,ge=Math.floor(me/1e3),nn=`${Math.floor(ge/60)}:${String(ge%60).padStart(2,"0")}`,on=(this.config.boost_durations??[30,60]).map(C=>Number(C)).filter(C=>Number.isFinite(C)&&C>0).slice(0,4),sn=`--zone-color: ${m}; --zone-shape: ${T(m,16)};`;return d`
      <ha-card style=${sn} class=${i.available?"":"unavailable"}>
        <div class="header">
          <button class="info" type="button" @click=${this.moreInfo} aria-label=${i.name}>
            <span class="shape"><ha-icon .icon=${N(i,this.config.icon)}></ha-icon></span>
            <span class="titles">
              <span class="name">${this.config.name??i.name}</span>
              <span class="sub">${i.available?Je:s("unavailable")}</span>
            </span>
          </button>
          ${Ht?.warning?d`<span class="chip warn" title=${s("battery")}>
                <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                <span>${Ht.lowest!==void 0?`${Math.round(Ht.lowest)}%`:s("battery_low")}</span>
              </span>`:u}
          <span class="chip" title=${s(Lt.label)}>
            <ha-icon .icon=${Lt.icon}></ha-icon>
            <span>${s(Lt.label)}</span>
          </span>
        </div>

        <div class="dial">
          <svg
            viewBox="0 0 ${g.W} ${g.H}"
            role="img"
            aria-label=${`${pe} ${r(l)}, ${s("now")} ${It}`}
            @pointerdown=${this.onPointerDown}
            @pointermove=${this.onPointerMove}
            @pointerup=${this.onPointerUp}
            @pointercancel=${this.onPointerUp}
          >
            <path class="track" d=${Mn}></path>
            <path class="ticks" d=${zn}></path>
            ${pt`<path class="seg ${p?"active":""}" d=${q}></path>`}
            ${Bt?pt`<circle class="current" cx=${Bt.x} cy=${Bt.y} r="6"></circle>`:u}
            <circle class="handle" cx=${ue.x} cy=${ue.y} r="12"></circle>
          </svg>
          <span class="end off">${s("off")}</span>
          <span class="end max">${s("max")}</span>
          <div class="center">
            <span class="label">${pe}</span>
            <span class="big">${Qe}${h||f?u:d`<span class="deg">°</span>`}</span>
            <span class="now">
              ${p?d`<ha-icon icon="mdi:fire"></ha-icon>`:u}
              <span>${tn}</span>
              ${he?d`<span class="hum" title=${s("humidity")}>
                    <ha-icon icon="mdi:water-percent"></ha-icon>${he}
                  </span>`:u}
            </span>
          </div>
          ${this.config.show_stepper===!1?u:d`<div class="stepper">
                <button type="button" aria-label=${s("lower")} @click=${()=>this.step(-1)}>
                  <ha-icon icon="mdi:minus"></ha-icon>
                </button>
                <span class="divider"></span>
                <button type="button" aria-label=${s("raise")} @click=${()=>this.step(1)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>`}
        </div>

        ${this.config.show_schedule===!1?u:Ct({hass:t,schedule:this.scheduleCtl.schedule,source:a,onOpen:()=>this.openSchedule(),onResume:()=>void this.call("resume_schedule")})}

        <div class="actions">
          ${c?d`<button type="button" class="boosting" @click=${()=>this.call("cancel_boost")} aria-label=${s("cancel_boost_aria",{zone:i.name})}>
                <span class="fill" style=${`width: ${fe>0?(me/fe*100).toFixed(2):0}%`}></span>
                <ha-icon icon="mdi:fire"></ha-icon>
                <span class="label">${s("boost_to",{value:r(i.value),left:nn})}</span>
                <span class="cancel">${s("cancel")}</span>
              </button>`:on.map(C=>d`<button type="button" class="boost" @click=${()=>this.call("boost",{duration:C})}>
                  <ha-icon icon="mdi:fire"></ha-icon>
                  <span>${s("boost_for",{min:C})}</span>
                </button>`)}
        </div>
      </ha-card>
    `}};Z.styles=[Tt,E`
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
      background: color-mix(in srgb, ${Ve} 14%, transparent);
      color: ${Ve};
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
      color: ${ie};
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
      background: color-mix(in srgb, ${ie} 10%, transparent);
    }
    .actions .boosting .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: color-mix(in srgb, ${ie} 22%, transparent);
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
  `],b([z({attribute:!1})],Z.prototype,"hass",2),b([x()],Z.prototype,"config",2),b([x()],Z.prototype,"pending",2);var je={schedule:{icon:"mdi:calendar-clock",label:"schedule"},manual:{icon:"mdi:hand-back-right-outline",label:"manual"},away:{icon:"mdi:home-export-outline",label:"away"},boost:{icon:"mdi:fire",label:"boost"},none:{icon:"mdi:calendar-remove-outline",label:"no_schedule"}},Y=class extends S{constructor(){super(...arguments);this.tickEvery=0;this.scheduleCtl=new et(this,()=>({hass:this.hass,zone:this.zone,enabled:!0}))}setConfig(t){if(!t?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={show_humidity:!0,...t}}static getStubConfig(t){return{type:"custom:luna-zone-compact-card",entity:Object.keys(t.states).find(i=>A(t.states[i]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"show_humidity",selector:{boolean:{}}}],computeLabel:t=>({entity:"Luna zone",name:"Name",icon:"Icon",show_humidity:"Show humidity"})[t.name]??t.name}}getCardSize(){return 3}getGridOptions(){return{columns:12,min_columns:6}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),this.tickTimer=void 0,this.tickEvery=0}get zone(){let t=this.config&&this.hass?.states[this.config.entity];return t&&A(t)?L(t):void 0}updated(t){super.updated(t);let n=this.zone;if(!n)return;let i=M(n)?1e4:3e4;i!==this.tickEvery&&(window.clearInterval(this.tickTimer),this.tickEvery=i,this.tickTimer=window.setInterval(()=>this.requestUpdate(),i))}moreInfo(){this.config&&I(this.config.entity,"overview",this.hass)}openSchedule(){this.config&&I(this.config.entity,"schedule",this.hass)}render(){if(!this.config||!this.hass)return u;let t=this.hass,n=t.states[this.config.entity];if(!n||!A(n))return d`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${v(t,"not_luna",{entity:this.config.entity})}</span>
      </ha-card>`;let i=L(n),s=($,q)=>v(t,$,q),r=U(i),l=M(i),a=i.precomfort&&i.source==="schedule"?{icon:"mdi:map-marker-radius-outline",label:"precomfort"}:je[i.source]??je.none,c=s(a.label);if(l){let $=Math.max(0,i.boostEndsAt-Date.now());c=`${s("boost")} \xB7 ${Math.ceil($/6e4)} ${s("min")}`}else i.value==="off"&&i.source!=="manual"&&(c=`${s(a.label)} \xB7 ${s("off")}`);let h=i.value==="off"?s("off"):_(i.value,t),f=i.current!==void 0?_(i.current,t):"\u2013",p=this.config.show_humidity!==!1&&i.humidity!==void 0,m=tt(t,i.entityId),w=`--zone-color: ${r}; --zone-shape: ${T(r,16)};`;return d`
      <ha-card style=${w} class=${i.available?"":"unavailable"}>
        <button class="header" type="button" @click=${this.moreInfo} aria-label=${i.name}>
          <span class="shape"><ha-icon .icon=${N(i,this.config.icon)}></ha-icon></span>
          <span class="name">${this.config.name??i.name}</span>
          ${m?.warning?d`<span class="battery" title=${s("battery")}>
                <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                ${m.lowest!==void 0?`${Math.round(m.lowest)}%`:s("battery_low")}
              </span>`:u}
        </button>

        <div class="stats ${p?"three":"two"}">
          <div class="stat mode">
            <span class="label">${s("mode")}</span>
            <span class="value">
              <ha-icon .icon=${a.icon}></ha-icon>
              <span class="text">${i.available?c:s("unavailable")}</span>
            </span>
          </div>
          <div class="stat">
            <span class="label">${s("temperature")}</span>
            <span class="value">
              ${i.heating?d`<ha-icon class="flame" icon="mdi:fire"></ha-icon>`:u}
              <span class="text">${f}</span>
              <span class="target" title=${s("target")}>→ ${h}</span>
            </span>
          </div>
          ${p?d`<div class="stat">
                <span class="label">${s("humidity")}</span>
                <span class="value">
                  <ha-icon class="water" icon="mdi:water-percent"></ha-icon>
                  <span class="text">${j(i.humidity,t)}</span>
                </span>
              </div>`:u}
        </div>

        ${Ct({hass:t,schedule:this.scheduleCtl.schedule,source:i.source,onOpen:()=>this.openSchedule(),onResume:()=>void t.callService("luna_climate","resume_schedule",{entity_id:i.entityId})})}
      </ha-card>
    `}};Y.styles=[Tt,E`
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
    `],b([z({attribute:!1})],Y.prototype,"hass",2),b([x()],Y.prototype,"config",2);function zt(o){let[e,t]=o.split(":").map(Number);return(e||0)*60+(t||0)}function D(o){let e=Math.max(0,Math.min(1440,Math.round(o))),t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function ae(o,e=15){return Math.round(o/e)*e}function Ze(o){let e=[[],[],[],[],[],[],[]];for(let t of o??[]){let n=zt(t.start);for(let i of t.weekdays)i<0||i>6||e[i].some(s=>s.start===n)||e[i].push({start:n,value:t.value})}for(let t of e)t.sort((n,i)=>n.start-i.start);return e}function Pn(o,e){return typeof o=="number"&&typeof e=="number"?Math.abs(o-e)<1e-9:o===e}function qe(o){let e=[];return o.forEach((t,n)=>{for(let i of t){let s=e.find(r=>r.start===i.start&&Pn(r.value,i.value));s?s.days.push(n):e.push({start:i.start,value:i.value,days:[n]})}}),e.sort((t,n)=>t.start-n.start||t.days[0]-n.days[0]),e.map(t=>({weekdays:t.days.sort((n,i)=>n-i),start:D(t.start),value:t.value}))}function mt(o){return o.map(e=>e.map(t=>({...t})))}function le(o,e){return JSON.stringify(o)===JSON.stringify(e)}function ce(o,e){for(let t=1;t<=7;t++){let n=o[(e-t+7)%7];if(n.length)return n[n.length-1].value}}function ft(o,e){return e+1<o.length?o[e+1].start:1440}function de(o,e){let t=e>0?o[e-1].start+15:0,n=e+1<o.length?o[e+1].start-15:1425;return[t,n]}function gt(o,e,t){let[n,i]=de(o,e),s=o.map(r=>({...r}));return s[e].start=Math.max(n,Math.min(i,ae(t))),s}function Fe(o,e){let t=o[e].start,n=ft(o,e),i=ae((t+n)/2);if(i-t<15||n-i<15)return;let s=o.map(r=>({...r}));return s.splice(e+1,0,{start:i,value:o[e].value}),{blocks:s,index:e+1}}function We(o,e,t){let n=Math.max(0,Math.min(1425,ae(e)));if(o.some(s=>Math.abs(s.start-n)<15))return;let i=[...o.map(s=>({...s})),{start:n,value:t}].sort((s,r)=>s.start-r.start);return{blocks:i,index:i.findIndex(s=>s.start===n)}}function Ke(o,e){return o.filter((t,n)=>n!==e)}function Ge(o){return Math.min(25,Math.max(18,Math.round(o*2)/2))}var Hn=B(y.max),Dn=B(y.heat);function Ye(o){return o==="off"?"color-mix(in srgb, var(--primary-text-color) 14%, transparent)":o==="max"?y.max:T(y.heat,Math.round(Math.min(100,35+(o-17)/8*65)))}function In(o){return o==="off"?"var(--secondary-text-color)":o==="max"||o>=22?"#fff":"var(--primary-text-color)"}var k=class extends S{constructor(){super(...arguments);this.busy=!1;this.week=[[],[],[],[],[],[],[]];this.original=[[],[],[],[],[],[],[]];this.day=(new Date().getDay()+6)%7;this.copying=!1;this.copyTargets=new Set;this.barWidth=600;this.lastTemp=21}firstUpdated(){let t=this.renderRoot.querySelector(".bar");!t||typeof ResizeObserver>"u"||(this.resize=new ResizeObserver(([n])=>this.barWidth=n.contentRect.width),this.resize.observe(t))}disconnectedCallback(){super.disconnectedCallback(),this.resize?.disconnect(),this.resize=void 0}connectedCallback(){super.connectedCallback(),this.hasUpdated&&!this.resize&&this.firstUpdated()}get dirty(){return!le(this.week,this.original)}reset(){this.week=mt(this.original),this.selected=void 0,this.copying=!1}willUpdate(t){if(super.willUpdate(t),t.has("schedule")&&this.schedule){let n=Ze(this.schedule);(!this.dirty||le(n,this.week))&&(this.original=n,this.week=mt(n),typeof this.selected=="number"&&this.selected>=this.blocks.length&&(this.selected=void 0))}}get blocks(){return this.week[this.day]}L(t,n){return v(this.hass,t,n)}fmt(t){return _(t,this.hass)}dayName(t,n="short"){return new Date(Date.UTC(2024,0,1+t)).toLocaleDateString(this.hass?.locale?.language??"en",{weekday:n,timeZone:"UTC"})}setDay(t){let n=mt(this.week);n[this.day]=t,this.week=n}select(t){this.selected=this.selected===t?void 0:t,this.copying=!1}setValue(t){if(typeof this.selected!="number")return;typeof t=="number"&&(this.lastTemp=t);let n=this.blocks.map(i=>({...i}));n[this.selected].value=t,this.setDay(n),H("light")}stepTemp(t){if(typeof this.selected!="number")return;let n=this.blocks[this.selected].value,i=typeof n=="number"?n:this.lastTemp;this.setValue(Ge(i+t*.5))}addBlock(){let t=this.blocks;if(!t.length){this.setDay([{start:6*60,value:this.lastTemp}]),this.selected=0;return}if(this.selected==="carry"){this.addAtMidnight();return}let n=typeof this.selected=="number"?this.selected:this.longestBlock(),i=Fe(t,n);i&&(this.setDay(i.blocks),this.selected=i.index)}addAtMidnight(){let t=ce(this.week,this.day)??this.lastTemp,n=We(this.blocks,0,t);n&&(this.setDay(n.blocks),this.selected=n.index)}longestBlock(){let t=0,n=-1;return this.blocks.forEach((i,s)=>{let r=ft(this.blocks,s)-i.start;r>n&&(t=s,n=r)}),t}removeSelected(){if(typeof this.selected!="number")return;let t=this.selected;this.setDay(Ke(this.blocks,t)),this.selected=this.blocks.length?Math.max(0,t-1):void 0}setStartFromInput(t,n){n&&this.setDay(gt(this.blocks,t,zt(n)))}setEndFromInput(t,n){!n||t+1>=this.blocks.length||this.setDay(gt(this.blocks,t+1,zt(n)))}minutesAt(t){let i=this.renderRoot.querySelector(".bar").getBoundingClientRect();return(t.clientX-i.left)/i.width*1440}onHandleDown(t,n){t.preventDefault(),t.stopPropagation(),t.currentTarget.setPointerCapture?.(t.pointerId),this.dragging=n,this.selected=n,this.copying=!1}onHandleMove(t,n){if(this.dragging!==n)return;let i=this.blocks[n].start,s=gt(this.blocks,n,this.minutesAt(t));s[n].start!==i&&(this.setDay(s),H("light"))}onHandleUp(){this.dragging=void 0}onHandleKey(t,n){let i=t.key==="ArrowLeft"||t.key==="ArrowDown"?-15:t.key==="ArrowRight"||t.key==="ArrowUp"?15:0;i&&(t.preventDefault(),this.setDay(gt(this.blocks,n,this.blocks[n].start+i)),this.selected=n)}toggleCopyTarget(t){let n=new Set(this.copyTargets);n.has(t)?n.delete(t):n.add(t),this.copyTargets=n}applyCopy(){let t=mt(this.week);for(let n of this.copyTargets)t[n]=this.blocks.map(i=>({...i}));this.week=t,this.copying=!1,this.copyTargets=new Set}save(){X(this,"schedule-save",{schedule:qe(this.week)})}cancel(){this.reset(),X(this,"schedule-cancel")}render(){let t=this.blocks,n=ce(this.week,this.day),i=t.length?t[0].start:1440,s=l=>`${l/1440*100}%`,r=l=>l/1440*this.barWidth;return d`
      <div class="days" role="tablist" aria-label=${this.L("days")}>
        ${[0,1,2,3,4,5,6].map(l=>d`<button
            type="button"
            role="tab"
            class="day ${l===this.day?"active":""}"
            aria-selected=${l===this.day?"true":"false"}
            @click=${()=>{this.day=l,this.selected=void 0,this.copying=!1}}
          >
            ${this.dayName(l)}${this.week[l].length?d`<span class="has"></span>`:u}
          </button>`)}
      </div>

      <div class="bar-wrap">
        <div class="bar">
          ${i>0?d`<button
                type="button"
                class="seg carry ${this.selected==="carry"?"selected":""}"
                style=${`left: 0; width: ${s(i)}; --seg: ${n!==void 0?Ye(n):"transparent"}; --ink: var(--secondary-text-color)`}
                aria-label=${this.L("carry_over")}
                @click=${()=>this.select("carry")}
              >
                ${r(i)>=56&&n!==void 0?d`<span class="label">${this.fmt(n)}</span>`:u}
              </button>`:u}
          ${t.map((l,a)=>{let c=ft(t,a),h=c-l.start;return d`<button
              type="button"
              class="seg ${this.selected===a?"selected":""} ${a===t.length-1?"last":""}"
              style=${`left: ${s(l.start)}; width: ${s(h)}; --seg: ${Ye(l.value)}; --ink: ${In(l.value)}`}
              aria-label=${`${D(l.start)}\u2013${D(c)}, ${this.fmt(l.value)}`}
              @click=${()=>this.select(a)}
            >
              ${r(h)>=52?d`<span class="label">${this.fmt(l.value)}</span>`:u}
              ${r(h)>=104?d`<span class="time">${D(l.start)}–${D(c)}</span>`:u}
            </button>`})}
          ${t.map((l,a)=>d`<button
              type="button"
              class="handle ${this.dragging===a?"dragging":""}"
              style=${`left: ${s(l.start)}`}
              aria-label=${this.L("move_start",{time:D(l.start)})}
              @pointerdown=${c=>this.onHandleDown(c,a)}
              @pointermove=${c=>this.onHandleMove(c,a)}
              @pointerup=${()=>this.onHandleUp()}
              @pointercancel=${()=>this.onHandleUp()}
              @keydown=${c=>this.onHandleKey(c,a)}
            >
              <span class="grip"></span>
              ${this.dragging===a?d`<span class="bubble">${D(l.start)}</span>`:u}
            </button>`)}
        </div>
        <div class="axis" aria-hidden="true">
          ${[0,3,6,9,12,15,18,21,24].map(l=>d`<span class=${l===0?"first":l===24?"last":""} style=${`left: ${l/24*100}%`}
              >${String(l).padStart(2,"0")}</span
            >`)}
        </div>
      </div>

      <div class="tools">
        <button type="button" class="tool" @click=${this.addBlock}>
          <ha-icon icon="mdi:plus"></ha-icon>${this.L("add_block")}
        </button>
        <button
          type="button"
          class="tool ${this.copying?"on":""}"
          ?disabled=${!t.length}
          @click=${()=>{this.copying=!this.copying,this.selected=void 0}}
        >
          <ha-icon icon="mdi:content-copy"></ha-icon>${this.L("copy_day")}
        </button>
      </div>

      ${this.copying?this.renderCopy():this.renderPanel(n)}

      ${this.error?d`<div class="error" role="alert">${this.error}</div>`:u}

      <div class="footer">
        <button type="button" class="ghost" ?disabled=${!this.dirty||this.busy} @click=${this.cancel}>
          ${this.L("discard")}
        </button>
        <button type="button" class="primary" ?disabled=${!this.dirty||this.busy} @click=${this.save}>
          ${this.busy?this.L("saving"):this.L("save")}
        </button>
      </div>
    `}renderCopy(){return d`<div class="panel">
      <div class="panel-title">${this.L("copy_to",{day:this.dayName(this.day,"long")})}</div>
      <div class="targets">
        ${[0,1,2,3,4,5,6].filter(t=>t!==this.day).map(t=>d`<button
              type="button"
              class="day small ${this.copyTargets.has(t)?"active":""}"
              aria-pressed=${this.copyTargets.has(t)?"true":"false"}
              @click=${()=>this.toggleCopyTarget(t)}
            >
              ${this.dayName(t)}
            </button>`)}
      </div>
      <div class="row end">
        <button type="button" class="ghost" @click=${()=>this.copying=!1}>${this.L("cancel")}</button>
        <button type="button" class="primary" ?disabled=${!this.copyTargets.size} @click=${this.applyCopy}>
          ${this.L("apply")}
        </button>
      </div>
    </div>`}renderPanel(t){if(this.selected==="carry"){let h=this.dayName((this.day+6)%7,"long");return d`<div class="panel">
        <div class="hint">
          ${t!==void 0?this.L("carry_hint",{day:h,value:this.fmt(t)}):this.L("empty_hint")}
        </div>
        <div class="row end">
          <button type="button" class="primary" @click=${this.addAtMidnight}>${this.L("add_midnight")}</button>
        </div>
      </div>`}if(typeof this.selected!="number")return d`<div class="panel muted">
        <div class="hint">${this.blocks.length?this.L("select_hint"):this.L("empty_hint")}</div>
      </div>`;let n=this.selected,i=this.blocks[n],s=ft(this.blocks,n),[r,l]=de(this.blocks,n),a=n+1>=this.blocks.length,c=typeof i.value=="number"?i.value:void 0;return d`<div class="panel">
      <div class="row times">
        <label>
          <span>${this.L("from")}</span>
          <input
            type="time"
            step="900"
            .value=${D(i.start)}
            min=${D(r)}
            max=${D(l)}
            @change=${h=>this.setStartFromInput(n,h.target.value)}
          />
        </label>
        <label>
          <span>${this.L("to")}</span>
          ${a?d`<span class="fixed">${this.L("next_block")}</span>`:d`<input
                type="time"
                step="900"
                .value=${D(s)}
                @change=${h=>this.setEndFromInput(n,h.target.value)}
              />`}
        </label>
      </div>

      <div class="values" role="radiogroup" aria-label=${this.L("action")}>
        <button
          type="button"
          role="radio"
          class="value ${i.value==="off"?"active":""}"
          aria-checked=${i.value==="off"?"true":"false"}
          @click=${()=>this.setValue("off")}
        >
          <ha-icon icon="mdi:power"></ha-icon>${this.L("off")}
        </button>
        <div class="value temp ${c!==void 0?"active":""}">
          <button type="button" aria-label=${this.L("lower")} ?disabled=${c!==void 0&&c<=18} @click=${()=>this.stepTemp(-1)}>
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button
            type="button"
            role="radio"
            class="reading"
            aria-checked=${c!==void 0?"true":"false"}
            @click=${()=>this.setValue(c??this.lastTemp)}
          >
            ${this.fmt(c??this.lastTemp)}
          </button>
          <button type="button" aria-label=${this.L("raise")} ?disabled=${c!==void 0&&c>=25} @click=${()=>this.stepTemp(1)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <button
          type="button"
          role="radio"
          class="value ${i.value==="max"?"active max":""}"
          aria-checked=${i.value==="max"?"true":"false"}
          @click=${()=>this.setValue("max")}
        >
          <ha-icon icon="mdi:fire"></ha-icon>${this.L("max")}
        </button>
      </div>

      <div class="row">
        <button type="button" class="ghost" @click=${this.addBlock}>
          <ha-icon icon="mdi:content-cut"></ha-icon>${this.L("split")}
        </button>
        <button type="button" class="ghost danger" @click=${this.removeSelected}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${this.L("remove")}
        </button>
      </div>
    </div>`}};k.styles=E`
    :host {
      display: flex;
      flex-direction: column;
      gap: 14px;
      --luna-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }
    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    ha-icon {
      --mdc-icon-size: 18px;
    }

    .days,
    .targets {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .day {
      all: unset;
      position: relative;
      box-sizing: border-box;
      min-width: 44px;
      height: 36px;
      padding: 0 10px;
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: var(--luna-soft);
      color: var(--secondary-text-color);
    }
    .day.active {
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
    }
    .day .has {
      position: absolute;
      bottom: 4px;
      left: 50%;
      width: 4px;
      height: 4px;
      margin-left: -2px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.6;
    }
    .day.small {
      height: 32px;
      min-width: 40px;
    }

    .bar-wrap {
      padding: 14px 0 0;
    }
    .bar {
      position: relative;
      height: 56px;
      border-radius: 12px;
      background: var(--luna-soft);
      touch-action: none;
    }
    .seg {
      all: unset;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      bottom: 0;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1px;
      overflow: hidden;
      cursor: pointer;
      background: var(--seg);
      color: var(--ink);
      border-left: 2px solid var(--card-background-color, #1c1c1c);
    }
    .seg:first-child {
      border-left: none;
      border-radius: 12px 0 0 12px;
    }
    .seg.carry {
      background:
        repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, var(--card-background-color, #1c1c1c) 55%, transparent) 6px 10px),
        var(--seg);
      opacity: 0.75;
    }
    .seg.selected {
      box-shadow: inset 0 0 0 2px var(--primary-text-color);
      z-index: 1;
    }
    .seg:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 2px var(--primary-color);
    }
    .seg .label {
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    .seg .time {
      font-size: 11px;
      opacity: 0.85;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .seg.last {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .handle {
      all: unset;
      position: absolute;
      top: -8px;
      bottom: -8px;
      width: 28px;
      margin-left: -14px;
      z-index: 2;
      cursor: ew-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .handle .grip {
      width: 6px;
      height: 30px;
      border-radius: 3px;
      background: var(--primary-text-color);
      box-shadow: 0 0 0 2px var(--card-background-color, #1c1c1c);
      transition: transform 120ms ease;
    }
    .handle:hover .grip,
    .handle.dragging .grip {
      transform: scaleY(1.15);
    }
    .handle:focus-visible {
      outline: none;
    }
    .handle:focus-visible .grip {
      box-shadow: 0 0 0 2px var(--card-background-color, #1c1c1c), 0 0 0 4px var(--primary-color);
    }
    .bubble {
      position: absolute;
      bottom: calc(100% + 4px);
      padding: 3px 7px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
      white-space: nowrap;
    }
    .axis {
      position: relative;
      height: 18px;
      margin-top: 4px;
    }
    .axis span {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .axis .first {
      transform: none;
    }
    .axis .last {
      transform: translateX(-100%);
    }

    .tools,
    .row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .row.end {
      justify-content: flex-end;
    }
    .tool,
    .ghost,
    .primary,
    .value {
      all: unset;
      box-sizing: border-box;
      height: 40px;
      padding: 0 14px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      background: var(--luna-soft);
      color: var(--primary-text-color);
    }
    .tool.on {
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
    }
    .ghost {
      background: transparent;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    }
    .ghost.danger {
      color: var(--error-color, #db4437);
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px;
      border-radius: 14px;
      background: var(--luna-soft);
    }
    .panel.muted .hint {
      color: var(--secondary-text-color);
    }
    .panel-title {
      font-weight: 600;
    }
    .hint {
      font-size: 13.5px;
      line-height: 1.45;
    }
    .times {
      gap: 16px;
    }
    .times label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .times input {
      font: inherit;
      font-size: 15px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      background: var(--card-background-color, transparent);
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      border-radius: 8px;
      padding: 6px 8px;
      min-height: 36px;
      color-scheme: light dark;
    }
    .times .fixed {
      font-size: 14px;
      color: var(--primary-text-color);
      padding: 8px 0;
    }
    .values {
      display: grid;
      grid-template-columns: 1fr 1.6fr 1fr;
      gap: 8px;
    }
    .value.active {
      background: var(--primary-text-color);
      color: var(--card-background-color, #fff);
    }
    .value.active.max {
      background: ${Hn};
      color: #fff;
    }
    .value.temp {
      padding: 0;
      display: grid;
      grid-template-columns: 40px 1fr 40px;
      cursor: default;
    }
    .value.temp.active {
      background: ${Dn};
      color: #1a1a1a;
    }
    .value.temp button {
      all: unset;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-variant-numeric: tabular-nums;
    }
    .value.temp .reading {
      font-size: 15px;
      font-weight: 700;
    }
    .value.temp button:disabled {
      opacity: 0.35;
    }
    .error {
      padding: 10px 12px;
      border-radius: 10px;
      color: var(--error-color, #db4437);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      font-size: 13.5px;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 4px;
    }
    .footer .primary,
    .footer .ghost {
      min-width: 110px;
    }
  `,b([z({attribute:!1})],k.prototype,"hass",2),b([z({attribute:!1})],k.prototype,"schedule",2),b([z({type:Boolean})],k.prototype,"busy",2),b([z({attribute:!1})],k.prototype,"error",2),b([x()],k.prototype,"week",2),b([x()],k.prototype,"original",2),b([x()],k.prototype,"day",2),b([x()],k.prototype,"selected",2),b([x()],k.prototype,"copying",2),b([x()],k.prototype,"copyTargets",2),b([x()],k.prototype,"dragging",2),b([x()],k.prototype,"barWidth",2);var On="0.4.0";function it(o,e){customElements.get(o)||customElements.define(o,e)}it("luna-zone-card",Z);it("luna-zone-compact-card",Y);it("luna-badge-card",St);it("luna-boost-badge",At);it("luna-schedule-editor",k);it("luna-zone-dialog",P);function Nn(){let o=!1,e=()=>{if(o)return;let n=document.querySelector("home-assistant")?.hass;n?.connection&&(o=!0,window.clearInterval(t),n.connection.subscribeMessage(i=>{i.entity_id&&document.visibilityState==="visible"&&I(i.entity_id)},{type:"luna_climate/subscribe_ui"}).catch(()=>{}))},t=window.setInterval(e,1e3);e()}Nn();var Pt=window;Pt.customCards=Pt.customCards??[];for(let o of[{type:"luna-zone-card",name:"Luna zone",description:"Dial, schedule strip and boost buttons for one Luna Climate zone.",preview:!0},{type:"luna-zone-compact-card",name:"Luna zone (compact)",description:"Mode, temperature and humidity over the schedule strip, without the dial.",preview:!0},{type:"luna-boost-badge",name:"Luna boost badge",description:"Compact pill for a Luna zone. Tap to boost, tap again to cancel.",preview:!0},{type:"luna-badge-card",name:"Luna badge",description:"General-purpose pill for any entity, with templates, a progress ring and an indicator dot.",preview:!0}])Pt.customCards.some(e=>e.type===o.type)||Pt.customCards.push(o);console.info(`%c LUNA CLIMATE %c ${On} `,"background:#ff8100;color:#111;font-weight:700","color:#ff8100");
