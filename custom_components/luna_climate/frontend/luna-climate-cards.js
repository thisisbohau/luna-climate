var po=Object.defineProperty;var uo=Object.getOwnPropertyDescriptor;var v=(i,e,t,o)=>{for(var n=o>1?void 0:o?uo(e,t):e,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(e,t,n):s(n))||n);return o&&n&&po(e,t,n),n};var ho=new Set(["primary","accent","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","light-grey","grey","dark-grey","blue-grey","black","white","disabled"]);function Vt(i){if(!i)return;let e=i.trim();if(e)return ho.has(e)?`var(--${e}-color)`:e}function E(i,e){return`color-mix(in srgb, ${i} ${e}%, transparent)`}var f={heat:"var(--luna-heat-color, var(--state-climate-heat-color, #ff8100))",boost:"var(--luna-boost-color, var(--deep-orange-color, #ff6f22))",away:"var(--luna-away-color, #8fa6c4)",off:"var(--luna-off-color, var(--disabled-color, #9e9e9e))",max:"var(--luna-max-color, var(--red-color, #f44336))",warning:"var(--luna-warning-color, var(--error-color, #db4437))",batteryOk:"var(--luna-battery-ok-color, var(--success-color, #43a047))",batteryLow:"var(--luna-battery-low-color, var(--warning-color, #ffa600))"};var $t=globalThis,_t=$t.ShadowRoot&&($t.ShadyCSS===void 0||$t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ut=Symbol(),we=new WeakMap,lt=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==Ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(_t&&e===void 0){let o=t!==void 0&&t.length===1;o&&(e=we.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&we.set(t,e))}return e}toString(){return this.cssText}},$=i=>new lt(typeof i=="string"?i:i+"",void 0,Ut),z=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((o,n,r)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new lt(t,i,Ut)},$e=(i,e)=>{if(_t)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let o=document.createElement("style"),n=$t.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=t.cssText,i.appendChild(o)}},jt=_t?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let o of e.cssRules)t+=o.cssText;return $(t)})(i):i;var{is:mo,defineProperty:fo,getOwnPropertyDescriptor:go,getOwnPropertyNames:yo,getOwnPropertySymbols:bo,getPrototypeOf:vo}=Object,kt=globalThis,_e=kt.trustedTypes,xo=_e?_e.emptyScript:"",wo=kt.reactiveElementPolyfillSupport,ct=(i,e)=>i,dt={toAttribute(i,e){switch(e){case Boolean:i=i?xo:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},St=(i,e)=>!mo(i,e),ke={attribute:!0,type:String,converter:dt,reflect:!1,useDefault:!1,hasChanged:St};Symbol.metadata??=Symbol("metadata"),kt.litPropertyMetadata??=new WeakMap;var V=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ke){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(e,o,t);n!==void 0&&fo(this.prototype,e,n)}}static getPropertyDescriptor(e,t,o){let{get:n,set:r}=go(this.prototype,e)??{get(){return this[t]},set(s){this[t]=s}};return{get:n,set(s){let d=n?.call(this);r?.call(this,s),this.requestUpdate(e,d,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ke}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;let e=vo(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){let t=this.properties,o=[...yo(t),...bo(t)];for(let n of o)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[o,n]of t)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[t,o]of this.elementProperties){let n=this._$Eu(t,o);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let o=new Set(e.flat(1/0).reverse());for(let n of o)t.unshift(jt(n))}else e!==void 0&&t.push(jt(e));return t}static _$Eu(e,t){let o=t.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $e(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){let o=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,o);if(n!==void 0&&o.reflect===!0){let r=(o.converter?.toAttribute!==void 0?o.converter:dt).toAttribute(t,o.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){let o=this.constructor,n=o._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let r=o.getPropertyOptions(n),s=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:dt;this._$Em=n;let d=s.fromAttribute(t,r.type);this[n]=d??this._$Ej?.get(n)??d,this._$Em=null}}requestUpdate(e,t,o,n=!1,r){if(e!==void 0){let s=this.constructor;if(n===!1&&(r=this[e]),o??=s.getPropertyOptions(e),!((o.hasChanged??St)(r,t)||o.useDefault&&o.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,o))))return;this.C(e,t,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:n,wrapped:r},s){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),r!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,r]of o){let{wrapped:s}=r,d=this[n];s!==!0||this._$AL.has(n)||d===void 0||this.C(n,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[ct("elementProperties")]=new Map,V[ct("finalized")]=new Map,wo?.({ReactiveElement:V}),(kt.reactiveElementVersions??=[]).push("2.1.2");var Xt=globalThis,Se=i=>i,At=Xt.trustedTypes,Ae=At?At.createPolicy("lit-html",{createHTML:i=>i}):void 0,De="$lit$",F=`lit$${Math.random().toFixed(9).slice(2)}$`,Pe="?"+F,$o=`<${Pe}>`,J=document,ut=()=>J.createComment(""),ht=i=>i===null||typeof i!="object"&&typeof i!="function",Yt=Array.isArray,_o=i=>Yt(i)||typeof i?.[Symbol.iterator]=="function",Zt=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ce=/-->/g,Te=/>/g,X=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ee=/'/g,ze=/"/g,Le=/^(?:script|style|textarea|title)$/i,Jt=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),c=Jt(1),gt=Jt(2),Xo=Jt(3),Q=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Me=new WeakMap,Y=J.createTreeWalker(J,129);function He(i,e){if(!Yt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ae!==void 0?Ae.createHTML(e):e}var ko=(i,e)=>{let t=i.length-1,o=[],n,r=e===2?"<svg>":e===3?"<math>":"",s=pt;for(let d=0;d<t;d++){let a=i[d],l,u,m=-1,h=0;for(;h<a.length&&(s.lastIndex=h,u=s.exec(a),u!==null);)h=s.lastIndex,s===pt?u[1]==="!--"?s=Ce:u[1]!==void 0?s=Te:u[2]!==void 0?(Le.test(u[2])&&(n=RegExp("</"+u[2],"g")),s=X):u[3]!==void 0&&(s=X):s===X?u[0]===">"?(s=n??pt,m=-1):u[1]===void 0?m=-2:(m=s.lastIndex-u[2].length,l=u[1],s=u[3]===void 0?X:u[3]==='"'?ze:Ee):s===ze||s===Ee?s=X:s===Ce||s===Te?s=pt:(s=X,n=void 0);let b=s===X&&i[d+1].startsWith("/>")?" ":"";r+=s===pt?a+$o:m>=0?(o.push(l),a.slice(0,m)+De+a.slice(m)+F+b):a+F+(m===-2?d:b)}return[He(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]},mt=class i{constructor({strings:e,_$litType$:t},o){let n;this.parts=[];let r=0,s=0,d=e.length-1,a=this.parts,[l,u]=ko(e,t);if(this.el=i.createElement(l,o),Y.currentNode=this.el.content,t===2||t===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(n=Y.nextNode())!==null&&a.length<d;){if(n.nodeType===1){if(n.hasAttributes())for(let m of n.getAttributeNames())if(m.endsWith(De)){let h=u[s++],b=n.getAttribute(m).split(F),_=/([.?@])?(.*)/.exec(h);a.push({type:1,index:r,name:_[2],strings:b,ctor:_[1]==="."?qt:_[1]==="?"?Kt:_[1]==="@"?Gt:nt}),n.removeAttribute(m)}else m.startsWith(F)&&(a.push({type:6,index:r}),n.removeAttribute(m));if(Le.test(n.tagName)){let m=n.textContent.split(F),h=m.length-1;if(h>0){n.textContent=At?At.emptyScript:"";for(let b=0;b<h;b++)n.append(m[b],ut()),Y.nextNode(),a.push({type:2,index:++r});n.append(m[h],ut())}}}else if(n.nodeType===8)if(n.data===Pe)a.push({type:2,index:r});else{let m=-1;for(;(m=n.data.indexOf(F,m+1))!==-1;)a.push({type:7,index:r}),m+=F.length-1}r++}}static createElement(e,t){let o=J.createElement("template");return o.innerHTML=e,o}};function ot(i,e,t=i,o){if(e===Q)return e;let n=o!==void 0?t._$Co?.[o]:t._$Cl,r=ht(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(i),n._$AT(i,t,o)),o!==void 0?(t._$Co??=[])[o]=n:t._$Cl=n),n!==void 0&&(e=ot(i,n._$AS(i,e.values),n,o)),e}var Ft=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:o}=this._$AD,n=(e?.creationScope??J).importNode(t,!0);Y.currentNode=n;let r=Y.nextNode(),s=0,d=0,a=o[0];for(;a!==void 0;){if(s===a.index){let l;a.type===2?l=new ft(r,r.nextSibling,this,e):a.type===1?l=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(l=new Wt(r,this,e)),this._$AV.push(l),a=o[++d]}s!==a?.index&&(r=Y.nextNode(),s++)}return Y.currentNode=J,n}p(e){let t=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}},ft=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ot(this,e,t),ht(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==Q&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):_o(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&ht(this._$AH)?this._$AA.nextSibling.data=e:this.T(J.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:o}=e,n=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=mt.createElement(He(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(t);else{let r=new Ft(n,this),s=r.u(this.options);r.p(t),this.T(s),this._$AH=r}}_$AC(e){let t=Me.get(e.strings);return t===void 0&&Me.set(e.strings,t=new mt(e)),t}k(e){Yt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,o,n=0;for(let r of e)n===t.length?t.push(o=new i(this.O(ut()),this.O(ut()),this,this.options)):o=t[n],o._$AI(r),n++;n<t.length&&(this._$AR(o&&o._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let o=Se(e).nextSibling;Se(e).remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},nt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,n,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=p}_$AI(e,t=this,o,n){let r=this.strings,s=!1;if(r===void 0)e=ot(this,e,t,0),s=!ht(e)||e!==this._$AH&&e!==Q,s&&(this._$AH=e);else{let d=e,a,l;for(e=r[0],a=0;a<r.length-1;a++)l=ot(this,d[o+a],t,a),l===Q&&(l=this._$AH[a]),s||=!ht(l)||l!==this._$AH[a],l===p?e=p:e!==p&&(e+=(l??"")+r[a+1]),this._$AH[a]=l}s&&!n&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},qt=class extends nt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},Kt=class extends nt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},Gt=class extends nt{constructor(e,t,o,n,r){super(e,t,o,n,r),this.type=5}_$AI(e,t=this){if((e=ot(this,e,t,0)??p)===Q)return;let o=this._$AH,n=e===p&&o!==p||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,r=e!==p&&(o===p||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Wt=class{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ot(this,e)}};var So=Xt.litHtmlPolyfillSupport;So?.(mt,ft),(Xt.litHtmlVersions??=[]).push("3.3.3");var Be=(i,e,t)=>{let o=t?.renderBefore??e,n=o._$litPart$;if(n===void 0){let r=t?.renderBefore??null;o._$litPart$=n=new ft(e.insertBefore(ut(),r),r,void 0,t??{})}return n._$AI(i),n};var Qt=globalThis,S=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Be(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}};S._$litElement$=!0,S.finalized=!0,Qt.litElementHydrateSupport?.({LitElement:S});var Ao=Qt.litElementPolyfillSupport;Ao?.({LitElement:S});(Qt.litElementVersions??=[]).push("4.2.2");var Co={attribute:!0,type:String,converter:dt,reflect:!1,hasChanged:St},To=(i=Co,e,t)=>{let{kind:o,metadata:n}=t,r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),o==="setter"&&((i=Object.create(i)).wrapped=!0),r.set(t.name,i),o==="accessor"){let{name:s}=t;return{set(d){let a=e.get.call(this);e.set.call(this,d),this.requestUpdate(s,a,i,!0,d)},init(d){return d!==void 0&&this.C(s,void 0,i,d),d}}}if(o==="setter"){let{name:s}=t;return function(d){let a=this[s];e.call(this,d),this.requestUpdate(s,a,i,!0,d)}}throw Error("Unsupported decorator location: "+o)};function M(i){return(e,t)=>typeof t=="object"?To(i,e,t):((o,n,r)=>{let s=n.hasOwnProperty(r);return n.constructor.createProperty(r,o),s?Object.getOwnPropertyDescriptor(n,r):void 0})(i,e,t)}function w(i){return M({...i,state:!0,attribute:!1})}var te={en:{heating:"Heating",idle:"Idle",off:"Off",max:"Max",schedule:"Schedule",manual:"Manual",away:"Away",boost:"Boost",precomfort:"Precomfort",no_schedule:"No schedule",target:"Target",now:"now",until:"until",then:"then",all_day:"all day",tomorrow:"tomorrow",manual_paused:"Manual \xB7 schedule paused",resume:"Resume schedule",boost_for:"Boost {min} min",boost_to:"Boost to {value} \xB7 {left} left",cancel:"Cancel",lower:"Lower target temperature",raise:"Raise target temperature",battery:"Battery",battery_low:"Low",workday:"Workday",free_day:"Free day",workday_sub:"Runs on workdays",free_sub:"Weekends & holidays",today:"Today",copy:"Copy",copy_to_type:"Copy to {type}",copy_confirm:"Replace the {to} schedule with this {from} schedule? Nothing is saved until you press Save.",battery_ok:"All good",batteries_low:"{count} low",day_type:"Day",day_types:"Today {today} \xB7 tomorrow {tomorrow}",by_weekday:"Mon\u2013Fri rule",thermostats:"{n} thermostats",thermostat:"1 thermostat",min:"min",boost_badge_aria:"Boost {zone} for {min} minutes",cancel_boost_aria:"Cancel boost in {zone}",unavailable:"Unavailable",not_luna:"{entity} is not a Luna Climate zone",humidity:"Humidity",mode:"Mode",temperature:"Temperature",carry_over:"Carried over from the day before",move_start:"Move start ({time})",add_block:"Add block",discard:"Discard",saving:"Saving\u2026",save:"Save",carry_hint:"Until the first block, the evening before keeps running (usually {value}). Add a block at 00:00 to start the day differently.",empty_hint:"No blocks on this day yet. Add one to give it its own schedule.",add_midnight:"Add block at 00:00",select_hint:"Tap a block to change it. Drag a handle to move a start time.",from:"From",to:"To",next_block:"next day's first block",action:"Action",split:"Split",remove:"Remove",overview:"Overview",devices:"Devices",settings:"Settings",thermostats_title:"Thermostats",sensors_title:"Temperature sensors",linked_title:"Linked devices",humidity_title:"Humidity sensors",batteries:"Batteries",home:"Home",everyone_away:"Everyone away",follows_away:"Follows home/away",not_following_away:"Ignores home/away",open_in_ha:"Open in Home Assistant",close:"Close",unsaved:"The schedule has unsaved changes.",keep_editing:"Keep editing",discard_close:"Discard and close",saved:"Schedule saved",away_temp:"Away temperature",boost_offset:"Boost offset",hysteresis:"Hysteresis",min_cycle:"Minimum cycle time",current:"Now",none:"None"},de:{heating:"Heizt",idle:"Bereit",off:"Aus",max:"Max",schedule:"Zeitplan",manual:"Manuell",away:"Abwesend",boost:"Boost",precomfort:"Vorheizen",no_schedule:"Kein Zeitplan",target:"Ziel",now:"aktuell",until:"bis",then:"danach",all_day:"ganzt\xE4gig",tomorrow:"morgen",manual_paused:"Manuell \xB7 Zeitplan pausiert",resume:"Zeitplan fortsetzen",boost_for:"Boost {min} min",boost_to:"Boost auf {value} \xB7 noch {left}",cancel:"Abbrechen",lower:"Zieltemperatur senken",raise:"Zieltemperatur erh\xF6hen",battery:"Batterie",battery_low:"Schwach",workday:"Arbeitstag",free_day:"Freier Tag",workday_sub:"Gilt an Arbeitstagen",free_sub:"Wochenende & Feiertage",today:"Heute",copy:"Kopieren",copy_to_type:"Nach {type} kopieren",copy_confirm:"Den Zeitplan \u201E{to}\u201C durch diesen Zeitplan \u201E{from}\u201C ersetzen? Gespeichert wird erst mit Speichern.",battery_ok:"Alles gut",batteries_low:"{count} schwach",day_type:"Tag",day_types:"Heute {today} \xB7 morgen {tomorrow}",by_weekday:"Mo\u2013Fr-Regel",thermostats:"{n} Thermostate",thermostat:"1 Thermostat",min:"min",boost_badge_aria:"{zone} f\xFCr {min} Minuten boosten",cancel_boost_aria:"Boost in {zone} abbrechen",unavailable:"Nicht verf\xFCgbar",not_luna:"{entity} ist keine Luna-Climate-Zone",humidity:"Luftfeuchte",mode:"Modus",temperature:"Temperatur",carry_over:"Vom Vortag \xFCbernommen",move_start:"Beginn verschieben ({time})",add_block:"Block hinzuf\xFCgen",discard:"Verwerfen",saving:"Speichert\u2026",save:"Speichern",carry_hint:"Bis zum ersten Block l\xE4uft der Vorabend weiter (meist {value}). F\xFCge einen Block um 00:00 hinzu, damit der Tag anders beginnt.",empty_hint:"Dieser Tag hat noch keine Bl\xF6cke. F\xFCge einen hinzu, um ihm einen eigenen Zeitplan zu geben.",add_midnight:"Block um 00:00 hinzuf\xFCgen",select_hint:"Tippe auf einen Block, um ihn zu \xE4ndern. Ziehe einen Griff, um eine Startzeit zu verschieben.",from:"Von",to:"Bis",next_block:"erster Block des n\xE4chsten Tages",action:"Aktion",split:"Teilen",remove:"Entfernen",overview:"\xDCbersicht",devices:"Ger\xE4te",settings:"Einstellungen",thermostats_title:"Thermostate",sensors_title:"Temperatursensoren",linked_title:"Verkn\xFCpfte Ger\xE4te",humidity_title:"Feuchtigkeitssensoren",batteries:"Batterien",home:"Zuhause",everyone_away:"Alle abwesend",follows_away:"Folgt Zuhause/Abwesend",not_following_away:"Ignoriert Zuhause/Abwesend",open_in_ha:"In Home Assistant \xF6ffnen",close:"Schlie\xDFen",unsaved:"Der Zeitplan hat ungespeicherte \xC4nderungen.",keep_editing:"Weiter bearbeiten",discard_close:"Verwerfen und schlie\xDFen",saved:"Zeitplan gespeichert",away_temp:"Abwesenheitstemperatur",boost_offset:"Boost-Aufschlag",hysteresis:"Hysterese",min_cycle:"Mindestschaltdauer",current:"Aktuell",none:"Keine"}};function x(i,e,t={}){let r=((i?.locale?.language??i?.language??"en").slice(0,2)==="de"?te.de:te.en)[e]??te.en[e];for(let[s,d]of Object.entries(t))r=r.replace(`{${s}}`,String(d));return r}function A(i){return!!(i&&i.attributes.luna_zone_id)}function Eo(i){if(i==="off"||i==="max")return i;let e=Number(i);return Number.isFinite(e)?e:"off"}function H(i){let e=i.attributes,t=Eo(e.luna_value),o=typeof e.current_temperature=="number"?e.current_temperature:void 0,n=e.hvac_action==="heating"||e.hvac_action===void 0&&t!=="off"&&o!==void 0&&(t==="max"||o<t-.2),r=e.luna_boost_ends_at?Date.parse(e.luna_boost_ends_at):NaN,s=e.luna_boost_started_at?Date.parse(e.luna_boost_started_at):NaN;return{entityId:i.entity_id,zoneId:String(e.luna_zone_id??""),name:String(e.luna_zone_name??e.friendly_name??i.entity_id),available:i.state!=="unavailable",source:e.luna_source??"none",value:t,current:o,humidity:typeof e.current_humidity=="number"?e.current_humidity:void 0,heating:n,precomfort:!!e.luna_precomfort_active,boostEndsAt:Number.isFinite(r)?r:void 0,boostStartedAt:Number.isFinite(s)?s:void 0,thermostats:Array.isArray(e.luna_thermostats)?e.luna_thermostats:[],linkedDevices:Array.isArray(e.luna_linked_devices)?e.luna_linked_devices:[]}}function D(i,e=Date.now()){return i.source==="boost"&&i.boostEndsAt!==void 0&&i.boostEndsAt>e}function q(i,e=i.value,t=i.source){return e==="off"?f.off:t==="boost"?f.boost:t==="away"?f.away:e==="max"?f.max:f.heat}function U(i,e){return e||(!i.thermostats.length&&i.linkedDevices.length?"mdi:heating-coil":"mdi:radiator")}function it(i,e){let t=i.states[e]?.attributes,o=Number(t?.luna_battery_count??0);if(o)return{low:!!t?.luna_battery_low,count:o}}function k(i,e){if(i===void 0)return"\u2013";if(i==="off"||i==="max")return x(e,i);let t=e?.locale?.language??"en";return`${i.toLocaleString(t,{minimumFractionDigits:1,maximumFractionDigits:1})}\xB0`}function K(i,e){let t=e?.locale?.language??"en";return`${Math.round(i).toLocaleString(t)}%`}var zo=[{key:"zone_mode",label:"mode"},{key:"boost_offset",label:"boost_offset"},{key:"hysteresis",label:"hysteresis"},{key:"min_cycle",label:"min_cycle"}],Ie={schedule:"schedule",manual:"manual",away:"away",boost:"boost",none:"no_schedule"};function ee(){return document.querySelector("home-assistant")}var P=class extends S{constructor(){super(...arguments);this.tab="overview";this.saving=!1;this.confirmClose=!1;this.bodyOverflow="";this.onKey=t=>{t.key==="Escape"&&(t.preventDefault(),this.confirmClose?this.confirmClose=!1:this.close())}}open(t,o="overview",n){this.restoreFocus=document.activeElement,this.entityId=t,this.tab=o,this.error=void 0,this.confirmClose=!1,this.schedule=void 0,this.hass=n??ee()?.hass??this.hass,this.isConnected||document.body.appendChild(this),this.bodyOverflow=document.body.style.overflow,document.body.style.overflow="hidden",window.clearInterval(this.hassTimer),this.hassTimer=window.setInterval(()=>{let r=ee()?.hass;r&&r!==this.hass&&(this.hass=r)},1e3),window.clearInterval(this.tickTimer),this.tickTimer=window.setInterval(()=>this.requestUpdate(),1e3),this.loadSchedule(),this.updateComplete.then(()=>this.renderRoot.querySelector(".dialog")?.focus())}close(t=!1){let o=this.editor;if(!t&&o?.dirty){this.tab="schedule",this.confirmClose=!0;return}window.clearInterval(this.hassTimer),window.clearInterval(this.tickTimer),window.clearTimeout(this.toastTimer),document.body.style.overflow=this.bodyOverflow,this.confirmClose=!1,this.remove(),this.restoreFocus?.focus?.()}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey)}get editor(){return this.renderRoot?.querySelector("luna-schedule-editor")}get stateObj(){return this.entityId?this.hass?.states[this.entityId]:void 0}L(t,o){return x(this.hass,t,o)}async loadSchedule(){let t=this.stateObj;if(!(!this.hass||!t||!A(t)))try{this.schedule=await this.hass.callWS({type:"luna_climate/schedule/get",zone_id:t.attributes.luna_zone_id})}catch(o){this.error=String(o?.message??o)}}async onSave(t){let o=this.stateObj;if(!(!this.hass||!o)){this.saving=!0,this.error=void 0;try{this.schedule=await this.hass.callWS({type:"luna_climate/schedule/set",zone_id:o.attributes.luna_zone_id,schedules:t.detail.schedules}),this.showToast(this.L("saved"))}catch(n){this.error=String(n?.message??n)}finally{this.saving=!1}}}showToast(t){this.toast=t,window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toast=void 0,2500)}moreInfo(t){if(this.editor?.dirty){this.tab="schedule",this.confirmClose=!0;return}this.close(!0),(ee()??document.body).dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}async service(t,o={}){!this.hass||!this.entityId||await this.hass.callService("luna_climate",t,{entity_id:this.entityId,...o})}settingEntity(t){let o=this.hass?.entities,n=this.entityId?o?.[this.entityId]?.device_id:void 0;if(!(!o||!n))return Object.values(o).find(r=>r.device_id===n&&r.translation_key===t)?.entity_id}globalEntity(t){let o=this.hass?.entities;if(!o)return;let n=Object.values(o).find(r=>r.platform==="luna_climate"&&r.translation_key===t)?.entity_id;return n?this.hass.states[n]:void 0}batteryState(){let t=this.settingEntity("zone_battery");return t?this.hass.states[t]:void 0}dayName(t){return t?this.L(t==="workday"?"workday":"free_day"):"\u2013"}render(){let t=this.hass,o=this.stateObj;if(!t||!this.entityId)return p;let r=o&&A(o)?H(o):void 0,s=r?q(r):f.off,d=`--zone-color: ${s}; --zone-shape: ${E(s,16)};`;return c`
      <div class="backdrop" @click=${()=>this.close()}></div>
      <div class="dialog" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="title" style=${d}>
        <header>
          <span class="shape"><ha-icon .icon=${r?U(r):"mdi:alert-circle-outline"}></ha-icon></span>
          <div class="titles">
            <h2 id="title">${r?.name??this.entityId}</h2>
            ${r?c`<span class="sub"
                  >${this.L(Ie[r.source]??"schedule")} · ${k(r.value,t)}${o?.attributes.luna_day_type?` \xB7 ${this.dayName(o.attributes.luna_day_type)}`:""}</span
                >`:p}
          </div>
          <button type="button" class="close" aria-label=${this.L("close")} @click=${()=>this.close()}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>

        <nav class="tabs" role="tablist">
          ${["overview","schedule"].map(a=>c`<button
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
          ${r?this.tab==="overview"?this.renderOverview(r):p:c`<p class="error">${this.L("not_luna",{entity:this.entityId})}</p>`}
          <luna-schedule-editor
            class=${r&&this.tab==="schedule"?"":"hidden"}
            .hass=${t}
            .data=${this.schedule}
            .busy=${this.saving}
            .error=${this.error}
            @schedule-save=${this.onSave}
          ></luna-schedule-editor>
        </div>

        ${this.confirmClose?c`<div class="confirm" role="alertdialog" aria-live="assertive">
              <span>${this.L("unsaved")}</span>
              <div>
                <button type="button" class="ghost" @click=${()=>this.confirmClose=!1}>${this.L("keep_editing")}</button>
                <button type="button" class="danger" @click=${()=>this.close(!0)}>${this.L("discard_close")}</button>
              </div>
            </div>`:p}
        ${this.toast?c`<div class="toast" role="status">${this.toast}</div>`:p}
      </div>
    `}renderOverview(t){let o=this.hass,n=this.L.bind(this),r=D(t),s=r?Math.max(0,t.boostEndsAt-Date.now()):0,d=Math.floor(s/1e3),a=this.globalEntity("home"),l=this.globalEntity("away_temp"),u=this.globalEntity("day_type"),h=this.batteryState()?.attributes.luna_batteries??[],b=h.filter(y=>y.low).length,_=(y,R,O)=>c`<div class="stat">
        <span class="label">${n(y)}</span>
        <span class="value">${O?c`<ha-icon .icon=${O}></ha-icon>`:p}${R}</span>
      </div>`;return c`
      <section class="stats">
        ${_("current",t.current!==void 0?k(t.current,o):"\u2013",t.heating?"mdi:fire":void 0)}
        ${_("target",k(t.value,o))}
        ${t.humidity!==void 0?_("humidity",K(t.humidity,o),"mdi:water-percent"):p}
        ${_("mode",n(Ie[t.source]??"schedule"))}
      </section>

      <section class="actions">
        ${r?c`<button type="button" class="action boosting" @click=${()=>this.service("cancel_boost")}>
              <ha-icon icon="mdi:fire"></ha-icon>${n("boost")} · ${Math.floor(d/60)}:${String(d%60).padStart(2,"0")}
              <span class="muted">${n("cancel")}</span>
            </button>`:[30,60].map(y=>c`<button type="button" class="action" @click=${()=>this.service("boost",{duration:y})}>
                <ha-icon icon="mdi:fire"></ha-icon>${n("boost_for",{min:y})}
              </button>`)}
        ${t.source==="manual"?c`<button type="button" class="action" @click=${()=>this.service("resume_schedule")}>
              <ha-icon icon="mdi:calendar-clock"></ha-icon>${n("resume")}
            </button>`:p}
      </section>

      <section class="group">
        <h3>${n("home")}</h3>
        <div class="list">
          ${a?c`<button type="button" class="row" @click=${()=>this.moreInfo(a.entity_id)}>
                <ha-icon .icon=${a.state==="on"?"mdi:home-account":"mdi:home-export-outline"}></ha-icon>
                <span class="name">${a.state==="on"?n("home"):n("everyone_away")}</span>
                <span class="state">${this.stateObj?.attributes.luna_away_enabled===!1?n("not_following_away"):n("follows_away")}</span>
              </button>`:c`<div class="row static"><span class="name">${n("none")}</span></div>`}
          ${l?c`<button type="button" class="row" @click=${()=>this.moreInfo(l.entity_id)}>
                <ha-icon icon="mdi:thermometer-low"></ha-icon>
                <span class="name">${n("away_temp")}</span>
                <span class="state">${k(Number(l.state),o)}</span>
                <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
              </button>`:p}
          ${u?c`<button type="button" class="row" @click=${()=>this.moreInfo(u.entity_id)}>
                <ha-icon icon="mdi:calendar-week"></ha-icon>
                <span class="name">${n("day_type")}</span>
                <span class="state">
                  ${n("day_types",{today:this.dayName(u.state),tomorrow:this.dayName(u.attributes.luna_tomorrow)})}${u.attributes.luna_from_entity===!1?c` <span class="muted">(${n("by_weekday")})</span>`:p}
                </span>
              </button>`:p}
        </div>
      </section>

      ${this.renderDevices(n("thermostats_title"),t.thermostats)}
      ${this.renderDevices(n("sensors_title"),this.stateObj?.attributes.luna_temp_sensors??[])}
      ${this.renderDevices(n("linked_title"),t.linkedDevices)}

      ${h.length?c`<section class="group">
            <h3>
              ${n("batteries")}
              <span class="status ${b?"low":"ok"}">
                <ha-icon .icon=${b?"mdi:battery-alert-variant-outline":"mdi:battery-check"}></ha-icon>
                ${b?n("batteries_low",{count:b}):n("battery_ok")}
              </span>
            </h3>
            <div class="list">
              ${h.map(y=>{let R=y.low===null?n("unavailable"):y.level!==void 0?`${Math.round(y.level)}%`:y.low?n("battery_low"):"OK";return c`<button type="button" class="row" @click=${()=>this.moreInfo(y.entity_id)}>
                  <ha-icon
                    class=${y.low?"battery-low":y.low===!1?"battery-ok":""}
                    .icon=${y.low?"mdi:battery-alert-variant-outline":y.low===!1?"mdi:battery":"mdi:battery-unknown"}
                  ></ha-icon>
                  <span class="name">${y.device}</span>
                  <span class="state ${y.low?"warn":""}">${R}</span>
                </button>`})}
            </div>
          </section>`:p}

      <section class="group">
        <h3>${n("settings")}</h3>
        <div class="list">
          ${zo.map(({key:y,label:R})=>{let O=this.settingEntity(y),W=O?o.states[O]:void 0;return!O||!W?p:c`<button type="button" class="row" @click=${()=>this.moreInfo(O)}>
              <span class="name">${n(R)}</span>
              <span class="state">${o.formatEntityState?o.formatEntityState(W):W.state}</span>
              <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            </button>`})}
        </div>
      </section>

      <button type="button" class="link" @click=${()=>this.moreInfo(this.entityId)}>
        ${n("open_in_ha")} <ha-icon icon="mdi:open-in-new"></ha-icon>
      </button>
    `}renderDevices(t,o){if(!o.length)return p;let n=this.hass;return c`<section class="group">
      <h3>${t}</h3>
      <div class="list">
        ${o.map(r=>{let s=n.states[r],d=String(s?.attributes.friendly_name??r),a=s?n.formatEntityState?n.formatEntityState(s):s.state:this.L("unavailable");if(s&&r.startsWith("climate.")){let l=[a];typeof s.attributes.temperature=="number"&&l.push(`\u2192 ${k(s.attributes.temperature,n)}`),typeof s.attributes.current_temperature=="number"&&l.push(`${this.L("now")} ${k(s.attributes.current_temperature,n)}`),a=l.join(" \xB7 ")}return c`<button type="button" class="row" @click=${()=>this.moreInfo(r)}>
            ${s?c`<ha-state-icon .hass=${n} .stateObj=${s}></ha-state-icon>`:c`<ha-icon icon="mdi:help-circle-outline"></ha-icon>`}
            <span class="name">${d}</span>
            <span class="state">${a}</span>
          </button>`})}
      </div>
    </section>`}};P.styles=z`
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
      color: ${$(f.boost)};
    }
    .action.boosting {
      background: color-mix(in srgb, ${$(f.boost)} 18%, transparent);
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
      display: flex;
      align-items: center;
      gap: 10px;
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
      color: ${$(f.batteryLow)};
      font-weight: 600;
    }
    .row > ha-icon.battery-ok {
      color: ${$(f.batteryOk)};
    }
    .row > ha-icon.battery-low {
      color: ${$(f.batteryLow)};
    }
    .row .state .muted {
      opacity: 0.7;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 22px;
      padding: 0 8px 0 6px;
      border-radius: 11px;
      font-size: 11.5px;
      letter-spacing: 0;
      text-transform: none;
      --mdc-icon-size: 14px;
    }
    .status.ok {
      color: ${$(f.batteryOk)};
      background: color-mix(in srgb, ${$(f.batteryOk)} 14%, transparent);
    }
    .status.low {
      color: ${$(f.batteryLow)};
      background: color-mix(in srgb, ${$(f.batteryLow)} 16%, transparent);
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
  `,v([w()],P.prototype,"hass",2),v([w()],P.prototype,"entityId",2),v([w()],P.prototype,"tab",2),v([w()],P.prototype,"schedule",2),v([w()],P.prototype,"saving",2),v([w()],P.prototype,"error",2),v([w()],P.prototype,"confirmClose",2),v([w()],P.prototype,"toast",2);var Oe;function N(i,e="overview",t){customElements.get("luna-zone-dialog")&&(Oe??=document.createElement("luna-zone-dialog"),Oe.open(i,e,t))}function tt(i,e,t){i.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}function L(i="light"){tt(window,"haptic",i)}function oe(i){return i!==void 0&&i.action!=="none"}async function Ne(i,e,t,o){if(!o||o.action==="none")return;if(o.confirmation){let r=typeof o.confirmation=="object"&&o.confirmation.text?o.confirmation.text:"Are you sure?";if(L("warning"),!window.confirm(r))return}let n=o.entity??t;switch(o.action){case"more-info":n&&e.states[n]?.attributes.luna_zone_id!==void 0?N(n,"overview",e):n&&tt(i,"hass-more-info",{entityId:n});return;case"toggle":n&&(await e.callService("homeassistant","toggle",{entity_id:n}),L("light"));return;case"perform-action":case"call-service":{let r=o.perform_action??o.service;if(!r||!r.includes("."))return;let[s,d]=r.split(".",2);await e.callService(s,d,o.data??o.service_data,o.target),L("light");return}case"navigate":if(!o.navigation_path)return;o.navigation_replace?history.replaceState(null,"",o.navigation_path):history.pushState(null,"",o.navigation_path),tt(window,"location-changed",{replace:!!o.navigation_replace});return;case"url":o.url_path&&window.open(o.url_path);return;case"fire-dom-event":tt(i,"ll-custom",o);return}}var Tt=class{constructor(e,t){this.onGesture=e;this.options=t;this.held=!1;this.startX=0;this.startY=0;this.active=!1;this.down=e=>{e.button===0&&(this.active=!0,this.held=!1,this.startX=e.clientX,this.startY=e.clientY,window.clearTimeout(this.holdTimer),this.options().hold&&(this.holdTimer=window.setTimeout(()=>{this.held=!0,L("light"),this.onGesture("hold")},500)))};this.move=e=>{this.active&&(Math.abs(e.clientX-this.startX)>10||Math.abs(e.clientY-this.startY)>10)&&this.cancel()};this.up=()=>{if(this.active&&(this.active=!1,window.clearTimeout(this.holdTimer),!this.held)){if(!this.options().doubleTap){this.onGesture("tap");return}if(this.tapTimer!==void 0){window.clearTimeout(this.tapTimer),this.tapTimer=void 0,this.onGesture("double_tap");return}this.tapTimer=window.setTimeout(()=>{this.tapTimer=void 0,this.onGesture("tap")},250)}};this.cancel=()=>{this.active=!1,window.clearTimeout(this.holdTimer)};this.key=e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.onGesture("tap"))};this.contextMenu=e=>{this.options().hold&&e.preventDefault()}}};var ne=2*Math.PI*17,j=class extends S{constructor(){super(...arguments);this.gestures=new Tt(t=>void this.onGesture(t),()=>({hold:oe(this.actionFor("hold")),doubleTap:oe(this.actionFor("double_tap"))}))}tickEvery(){return 0}entityId(){return typeof this.config?.entity=="string"?this.config.entity:void 0}async onGesture(t){this.hass&&await Ne(this,this.hass,this.entityId(),this.actionFor(t))}getCardSize(){return 1}getGridOptions(){return{columns:6,rows:1,min_columns:3,min_rows:1}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),this.tickTimer=void 0}updated(t){super.updated(t);let o=this.tickEvery();o&&this.tickTimer===void 0?this.tickTimer=window.setInterval(()=>this.requestUpdate(),o):!o&&this.tickTimer!==void 0&&(window.clearInterval(this.tickTimer),this.tickTimer=void 0)}render(){if(!this.config||!this.hass)return p;let t=this.viewModel();if(!t)return p;let o=[`--pill-color: ${t.color}`,`--pill-shape: ${E(t.color,18)}`,`--pill-ring-track: ${E(t.color,22)}`,`--pill-indicator: ${t.indicatorColor??"var(--error-color, #db4437)"}`].join(";"),n=t.progress===void 0?ne:ne*(1-Math.min(1,Math.max(0,t.progress)));return c`
      <ha-card style=${o}>
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
              ${t.stateObj?c`<ha-state-icon
                    .hass=${this.hass}
                    .stateObj=${t.stateObj}
                    .icon=${t.icon}
                  ></ha-state-icon>`:c`<ha-icon .icon=${t.icon??"mdi:help-circle-outline"}></ha-icon>`}
            </span>
            ${t.progress===void 0?p:gt`<svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
                  <circle class="track" cx="18" cy="18" r="17"></circle>
                  <circle class="bar" cx="18" cy="18" r="17"
                    stroke-dasharray=${ne.toFixed(2)}
                    stroke-dashoffset=${n.toFixed(2)}></circle>
                </svg>`}
            ${t.indicator?c`<span class="dot"></span>`:p}
          </span>
          <span class="text">
            ${t.name?c`<span class="name">${t.name}</span>`:p}
            ${t.content?c`<span class="content">${t.content}</span>`:p}
          </span>
        </button>
      </ha-card>
    `}};j.styles=z`
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
  `,v([M({attribute:!1})],j.prototype,"hass",2),v([w()],j.prototype,"config",2);function Re(i){return typeof i=="string"&&(i.includes("{{")||i.includes("{%"))}var Et=class{constructor(e){this.onChange=e;this.subs=new Map;this.results=new Map}sync(e,t,o){let n=new Map;for(let[r,s]of Object.entries(t))Re(s)&&n.set(r,s);for(let[r,s]of this.subs)n.get(r)!==s.template&&this.drop(r);for(let[r,s]of n){if(this.subs.has(r))continue;let d=e.connection.subscribeMessage(a=>{if(a.error!==void 0)console.warn(`luna card template "${r}":`,a.error),this.results.set(r,"");else{let l=a.result;this.results.set(r,l==null?"":typeof l=="object"?JSON.stringify(l):String(l))}this.onChange()},{type:"render_template",template:s,variables:o,strict:!0,report_errors:!0}).catch(a=>(console.warn(`luna card template "${r}" failed:`,a),this.results.set(r,""),this.onChange(),async()=>{}));this.subs.set(r,{template:s,unsub:d})}}value(e,t){if(Re(t))return this.results.get(e);if(t!=null)return String(t)}clear(){for(let e of[...this.subs.keys()])this.drop(e)}drop(e){let t=this.subs.get(e);this.subs.delete(e),this.results.delete(e),t?.unsub.then(o=>o()).catch(()=>{})}};var Mo=["name","content","icon","color","progress","indicator","indicator_color"];function Do(i){if(i===void 0)return!1;let e=i.trim().toLowerCase();return!(e===""||e==="false"||e==="0"||e==="off"||e==="none"||e==="no")}var zt=class extends j{constructor(){super(...arguments);this.templates=new Et(()=>this.requestUpdate());this.resync=!0}setConfig(t){if(!t)throw new Error("Invalid configuration");if(!t.entity&&!t.content&&!t.name)throw new Error("Set an entity, or at least a name or content");this.config={...t},this.resync=!0}static getStubConfig(t){return{type:"custom:luna-badge-card",entity:Object.keys(t.states).find(n=>n.startsWith("light.")||n.startsWith("sensor."))}}static getConfigForm(){return{schema:[{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]},{name:"content",selector:{template:{}}},{name:"color",selector:{ui_color:{include_state:!1,include_none:!0}}},{name:"progress",selector:{template:{}}},{name:"indicator",selector:{template:{}}},{name:"tap_action",selector:{ui_action:{default_action:"more-info"}}},{name:"hold_action",selector:{ui_action:{default_action:"none"}}},{name:"double_tap_action",selector:{ui_action:{default_action:"none"}}}],computeLabel:t=>({entity:"Entity",name:"Name (small line)",icon:"Icon",content:"Content (bold line) \u2014 text or template",color:"Colour",progress:"Progress ring, 0\u2013100 \u2014 number or template",indicator:"Indicator dot \u2014 template, shown when truthy",tap_action:"Tap",hold_action:"Hold",double_tap_action:"Double tap"})[t.name]??t.name}}disconnectedCallback(){super.disconnectedCallback(),this.templates.clear()}connectedCallback(){super.connectedCallback(),this.resync=!0,this.requestUpdate()}willUpdate(t){if(super.willUpdate(t),!(!this.hass||!this.config||!this.isConnected)&&this.resync){this.resync=!1;let o={};for(let n of Mo)o[n]=this.config[n];this.templates.sync(this.hass,o,{config:this.config,user:this.hass.user?.name,entity:this.config.entity})}}actionFor(t){let o=this.config;if(o)return t==="tap"?o.tap_action??(o.entity?{action:"more-info"}:void 0):t==="hold"?o.hold_action:o.double_tap_action}viewModel(){let t=this.config,o=this.hass,n=m=>this.templates.value(m,t[m]),r=t.entity?o.states[t.entity]:void 0,s=n("name")??(r?String(r.attributes.friendly_name??t.entity):void 0),d=n("content")??(r?o.formatEntityState?o.formatEntityState(r):r.state:void 0),a=n("progress"),l;if(a!==void 0&&a.trim()!==""){let m=Number(a);Number.isFinite(m)&&(l=Math.min(100,Math.max(0,m))/100)}let u=Vt(n("color"))??"var(--state-icon-color, var(--primary-color))";return{stateObj:r,icon:n("icon"),name:s,content:d,color:u,progress:l,indicator:Do(n("indicator")),indicatorColor:Vt(n("indicator_color")),ariaLabel:[s,d].filter(Boolean).join(", ")}}};var Mt=class extends j{setConfig(e){if(!e?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={duration:30,show_humidity:!0,...e}}static getStubConfig(e){return{type:"custom:luna-boost-badge",entity:Object.keys(e.states).find(o=>A(e.states[o]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"duration",selector:{number:{min:5,max:240,step:5,unit_of_measurement:"min",mode:"box"}}}]},{name:"show_humidity",selector:{boolean:{}}},{name:"hold_action",selector:{ui_action:{default_action:"more-info"}}}],computeLabel:e=>({entity:"Luna zone",name:"Name",duration:"Boost duration",show_humidity:"Show humidity",hold_action:"Hold"})[e.name]??e.name}}tickEvery(){let e=this.config&&this.hass?.states[this.config.entity];return e&&A(e)&&D(H(e))?5e3:0}actionFor(e){let t=this.config;if(t)return e==="tap"?t.tap_action:e==="hold"?t.hold_action??{action:"more-info"}:t.double_tap_action}async onGesture(e){if(e!=="tap"||this.config?.tap_action||!this.hass||!this.config)return super.onGesture(e);let t=this.hass.states[this.config.entity];if(!t||!A(t))return;let o=H(t);L(D(o)?"light":"success"),D(o)?await this.hass.callService("luna_climate","cancel_boost",{entity_id:o.entityId}):await this.hass.callService("luna_climate","boost",{entity_id:o.entityId,duration:this.config.duration??30})}viewModel(){let e=this.config,t=this.hass,o=t.states[e.entity];if(!o)return{icon:"mdi:alert-circle-outline",name:e.entity,content:x(t,"unavailable"),color:f.warning,ariaLabel:e.entity};if(!A(o))return{icon:"mdi:alert-circle-outline",name:e.name??e.entity,content:x(t,"not_luna",{entity:""}).trim(),color:f.warning,ariaLabel:x(t,"not_luna",{entity:e.entity})};let n=H(o),r=e.name??n.name,s=e.duration??30,d=it(t,n.entityId),a=Date.now();if(!n.available)return{icon:U(n,e.icon),name:r,content:x(t,"unavailable"),color:f.off,ariaLabel:`${r}, ${x(t,"unavailable")}`};if(D(n,a)){let b=Math.max(0,n.boostEndsAt-a),_=n.boostStartedAt!==void 0?n.boostEndsAt-n.boostStartedAt:s*6e4;return{icon:"mdi:fire",name:r,content:`${x(t,"boost")} \xB7 ${Math.ceil(b/6e4)} ${x(t,"min")}`,color:f.boost,progress:_>0?b/_:0,indicator:d?.low,indicatorColor:f.batteryLow,ariaLabel:x(t,"cancel_boost_aria",{zone:r})}}let l=n.current!==void 0?k(n.current,t):"\u2013",u=e.show_humidity!==!1&&n.humidity!==void 0?K(n.humidity,t):void 0,m=U(n,e.icon),h=u?`${l} \xB7 ${u}`:l;return n.source==="away"?(m="mdi:home-export-outline",h=`${x(t,"away")} \xB7 ${k(n.value,t)}`):n.value==="off"&&(m="mdi:power",h=`${x(t,"off")} \xB7 ${l}`),{icon:m,name:r,content:h,color:q(n),indicator:d?.low,indicatorColor:f.batteryLow,ariaLabel:x(t,"boost_badge_aria",{zone:r,min:s})}}};var Po={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6};function Ve(i,e=new Date){try{let t=new Intl.DateTimeFormat("en-US",{timeZone:i,weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(e),o=n=>t.find(r=>r.type===n)?.value??"";return{weekday:Po[o("weekday")]??0,minutes:Number(o("hour"))*60+Number(o("minute"))}}catch{return{weekday:(e.getDay()+6)%7,minutes:e.getHours()*60+e.getMinutes()}}}function Lo(i){let[e,t]=i.split(":").map(Number);return(e||0)*60+(t||0)}function ie(i,e){return(i.schedules[e]??[]).map(t=>({start:Lo(t.start),value:t.value})).sort((t,o)=>t.start-o.start)}function Ue(i,e){if(!i)return{segments:[]};let t=i.day_types,o=ie(i,t.today),n={segments:[],dayType:t.today},r;for(let a of[t.yesterday,t.today,t.tomorrow]){let l=ie(i,a);if(l.length){r=l[l.length-1].value;break}}if(r===void 0)return n;let s=[...o];(!s.length||s[0].start>0)&&s.unshift({start:0,value:r}),n.segments=s.map((a,l)=>{let u=l+1<s.length?s[l+1].start:1440;return{start:a.start,end:u,value:a.value,current:e.minutes>=a.start&&e.minutes<u}}),n.current=n.segments.find(a=>a.current)?.value;let d=o.find(a=>a.start>e.minutes);if(d)return n.nextAt=d.start,n.nextValue=d.value,n.nextDayOffset=0,n;for(let a=1;a<=7;a++){let l=ie(i,a===1?t.tomorrow:t.today);if(l.length){n.nextAt=a*1440+l[0].start,n.nextValue=l[0].value,n.nextDayOffset=a;break}}return n}function je(i){let e=(i%1440+1440)%1440,t=Math.floor(e/60),o=e%60;return`${t<10?"0":""}${t}:${o<10?"0":""}${o}`}var rt=class{constructor(e,t){this.host=e;this.source=t;e.addController(this)}hostConnected(){this.key=void 0}hostUpdated(){let{hass:e,zone:t,enabled:o}=this.source();if(!e||!t||!o)return;let n=e.states[t.entityId]?.attributes??{},r=`${t.zoneId}|${n.luna_block_start??""}|${n.luna_day_type??""}|${Math.floor(Date.now()/6e5)}`;r!==this.key&&(this.key=r,this.fetch(e,t.zoneId))}async fetch(e,t){try{this.schedule=await e.callWS({type:"luna_climate/schedule/get",zone_id:t})}catch(o){console.warn("luna card: could not load schedule",o),this.schedule=void 0}this.host.requestUpdate()}};function Dt({hass:i,schedule:e,source:t,onResume:o,onOpen:n}){let r=(h,b)=>x(i,h,b),s=h=>k(h,i),d=Ve(i.config.time_zone),a=e?Ue(e,d):{segments:[]},l="";if(a.nextAt!==void 0){let h=je(a.nextAt);if(a.nextDayOffset===0)l=`${r("until")} ${h}`;else if(a.nextDayOffset===1)l=`${r("until")} ${r("tomorrow")} ${h}`;else{let b=new Date(Date.now()+a.nextDayOffset*864e5).toLocaleDateString(i.locale?.language??"en",{weekday:"short"});l=`${r("until")} ${b} ${h}`}}else a.current!==void 0&&(l=r("all_day"));let u;t==="manual"?u=r("manual_paused"):a.current===void 0?u=e?r("no_schedule"):"":u=`${t==="schedule"?"":`${r("schedule")} `}${s(a.current)} ${l}`.trim();let m=a.nextValue!==void 0?`${r("then")} ${s(a.nextValue)}`:"";return c`
    <div class="schedule">
      <div class="caption">
        <span class="left">${u}</span>
        ${t==="manual"?c`<button type="button" class="link" @click=${o}>${r("resume")}</button>`:c`<span class="right">${m}</span>`}
      </div>
      <div
        class="strip ${n?"open":""}"
        role=${n?"button":"presentation"}
        tabindex=${n?"0":"-1"}
        aria-label=${n?r("schedule"):""}
        @click=${h=>{n&&(h.stopPropagation(),n())}}
        @keydown=${h=>{n&&(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),n())}}
      >
        ${a.segments.map(h=>{let b=h.value==="off"?"color-mix(in srgb, var(--primary-text-color) 16%, transparent)":h.value==="max"?f.max:E(f.heat,Math.round(Math.min(100,35+(h.value-17)/8*65))),_=h.start/1440*100,y=(h.end-h.start)/1440*100;return c`<span
            class="block ${h.current?"current":""}"
            style=${`left: calc(${_}% + 1px); width: calc(${y}% - 2px); background: ${b};`}
          ></span>`})}
        ${Array.from({length:25},(h,b)=>c`<span class="tick ${b%6===0?"major":""}" style=${`left: ${b/24*100}%`}></span>`)}
        ${[0,6,12,18,24].map(h=>c`<span class="hour ${h===0?"first":h===24?"last":""}" style=${`left: ${h/24*100}%`}
              >${String(h).padStart(2,"0")}</span
            >`)}
        <span class="now-marker" style=${`left: ${d.minutes/1440*100}%`}></span>
      </div>
    </div>
  `}var Pt=z`
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
`;var g={W:366,H:232,cx:183,cy:170,r:150,T0:10,T1:27,A0:200,A1:-20},le=10.5,Lt=25,yt=i=>g.A0-(i-g.T0)/(g.T1-g.T0)*(g.A0-g.A1),st=(i,e)=>{let t=i*Math.PI/180;return{x:+(g.cx+e*Math.cos(t)).toFixed(2),y:+(g.cy-e*Math.sin(t)).toFixed(2)}},qe=(i,e)=>{if(e-i<.01)return"";let t=yt(i),o=yt(e),n=st(t,g.r),r=st(o,g.r);return`M ${n.x} ${n.y} A ${g.r} ${g.r} 0 ${t-o>180?1:0} 1 ${r.x} ${r.y}`},Ho=(()=>{let i="";for(let e=11;e<=26;e++){let t=yt(e),o=st(t,g.r-13),n=st(t,g.r-(e%5===0?22:18));i+=`M ${o.x} ${o.y} L ${n.x} ${n.y} `}return i})(),Bo=qe(g.T0,g.T1),re=$(f.boost),Io=$(f.batteryOk),Ze=$(f.batteryLow),se=i=>i==="off"?g.T0:i==="max"?g.T1:Math.min(g.T1,Math.max(g.T0,i));function Fe(i){return i<le-.25?"off":i>Lt+.25?"max":Math.min(Lt,Math.max(le,Math.round(i*2)/2))}var ae={schedule:{icon:"mdi:calendar-clock",label:"schedule"},manual:{icon:"mdi:hand-back-right-outline",label:"manual"},away:{icon:"mdi:home-export-outline",label:"away"},boost:{icon:"mdi:fire",label:"boost"},none:{icon:"mdi:calendar-remove-outline",label:"no_schedule"}},G=class extends S{constructor(){super(...arguments);this.scheduleCtl=new rt(this,()=>({hass:this.hass,zone:this.zone,enabled:this.config?.show_schedule!==!1}));this.dragging=!1;this.tickEvery=0;this.onPointerDown=t=>{let o=this.pointerToTarget(t);o.onArc&&(t.preventDefault(),this.dragging=!0,window.clearTimeout(this.commitTimer),t.currentTarget.setPointerCapture?.(t.pointerId),this.pending=o.value)};this.onPointerMove=t=>{if(!this.dragging)return;let o=this.pointerToTarget(t).value;o!==this.pending&&(this.pending=o,L("light"))};this.onPointerUp=()=>{this.dragging&&(this.dragging=!1,this.commit())}}setConfig(t){if(!t?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={show_schedule:!0,show_stepper:!0,show_humidity:!0,boost_durations:[30,60],...t}}static getStubConfig(t){return{type:"custom:luna-zone-card",entity:Object.keys(t.states).find(n=>A(t.states[n]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"boost_durations",selector:{select:{multiple:!0,custom_value:!0,options:["15","30","45","60","90","120"].map(t=>({value:t,label:`${t} min`}))}}},{type:"grid",name:"",schema:[{name:"show_schedule",selector:{boolean:{}}},{name:"show_stepper",selector:{boolean:{}}},{name:"show_humidity",selector:{boolean:{}}}]}],computeLabel:t=>({entity:"Luna zone",name:"Name",icon:"Icon",boost_durations:"Boost buttons",show_schedule:"Show schedule strip",show_stepper:"Show \u2212 / + buttons",show_humidity:"Show humidity"})[t.name]??t.name}}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),window.clearTimeout(this.commitTimer),window.clearTimeout(this.echoTimer),this.tickTimer=void 0,this.tickEvery=0}get zone(){let t=this.config&&this.hass?.states[this.config.entity];return t&&A(t)?H(t):void 0}willUpdate(t){super.willUpdate(t);let o=this.zone;o&&this.awaitingEcho!==void 0&&!this.dragging&&o.source==="manual"&&o.value===this.awaitingEcho&&this.clearPending()}updated(t){super.updated(t);let o=this.zone;if(!o||!this.hass)return;let n=D(o)?1e3:3e4;n!==this.tickEvery&&(window.clearInterval(this.tickTimer),this.tickEvery=n,this.tickTimer=window.setInterval(()=>this.requestUpdate(),n))}clearPending(){this.pending=void 0,this.awaitingEcho=void 0,window.clearTimeout(this.echoTimer)}shownValue(t){return this.pending??t.value}step(t){let o=this.zone;if(!o)return;let n=this.shownValue(o),r=n==="off"?g.T0:n==="max"?Lt+.5:n;r+=t*.5,n==="max"&&t<0&&(r=Lt),n==="off"&&t>0&&(r=le),this.pending=Fe(r),L("light"),window.clearTimeout(this.commitTimer),this.commitTimer=window.setTimeout(()=>this.commit(),900)}async commit(){let t=this.zone,o=this.pending;if(!(!t||o===void 0||!this.hass)){this.awaitingEcho=o,window.clearTimeout(this.echoTimer),this.echoTimer=window.setTimeout(()=>this.clearPending(),4e3);try{await this.hass.callService("luna_climate","set_target",{entity_id:t.entityId,value:o})}catch(n){throw this.clearPending(),n}}}pointerToTarget(t){let n=t.currentTarget.getBoundingClientRect(),r=n.width/g.W,s=(t.clientX-n.left)/r,d=(t.clientY-n.top)/r,a=Math.hypot(s-g.cx,d-g.cy),l=Math.atan2(g.cy-d,s-g.cx)*180/Math.PI;l<-90&&(l+=360),l=Math.max(g.A1,Math.min(g.A0,l));let u=g.T0+(g.A0-l)/(g.A0-g.A1)*(g.T1-g.T0);return{value:Fe(u),onArc:Math.abs(a-g.r)<=30}}async call(t,o={}){let n=this.zone;!n||!this.hass||(this.clearPending(),await this.hass.callService("luna_climate",t,{entity_id:n.entityId,...o}))}moreInfo(){this.config&&N(this.config.entity,"overview",this.hass)}openSchedule(){this.config&&N(this.config.entity,"schedule",this.hass)}render(){if(!this.config||!this.hass)return p;let t=this.hass,o=t.states[this.config.entity];if(!o||!A(o))return c`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${x(t,"not_luna",{entity:this.config.entity})}</span>
      </ha-card>`;let n=H(o),r=(T,Rt)=>x(t,T,Rt),s=T=>k(T,t),d=this.shownValue(n),a=this.pending!==void 0?"manual":n.source,l=a==="boost"&&D(n),u=d==="off",m=d==="max",h=this.pending===void 0?n.heating:!u&&n.current!==void 0&&se(d)>n.current,b=q(n,d,a),_=se(d),y=n.current!==void 0?se(n.current):void 0,R=u||y===void 0?"":qe(Math.min(_,y),Math.max(_,y)),O=st(yt(_),g.r),W=y!==void 0?st(yt(y),g.r):void 0,It=n.precomfort&&a==="schedule"?{icon:"mdi:map-marker-radius-outline",label:"precomfort"}:ae[a]??ae.none,fe=it(t,n.entityId),Ot=[];n.thermostats.length&&Ot.push(n.thermostats.length===1?r("thermostat"):r("thermostats",{n:n.thermostats.length}));for(let T of n.linkedDevices){let Rt=t.states[T];Ot.push(String(Rt?.attributes.friendly_name??T))}let no=[r(h?"heating":u?"off":"idle"),Ot.join(" + ")].filter(Boolean).join(" \xB7 "),ge=r(a==="schedule"?"target":ae[a].label),io=u?r("off"):m?r("max"):d.toLocaleString(t.locale?.language??"en",{minimumFractionDigits:1,maximumFractionDigits:1}),Nt=n.current!==void 0?s(n.current):"\u2013",ro=u?`${Nt}`:`${r(h?"heating":"idle")} \xB7 ${r("now")} ${Nt}`,ye=this.config.show_humidity!==!1&&n.humidity!==void 0?K(n.humidity,t):void 0,so=Date.now(),be=l?Math.max(0,n.boostEndsAt-so):0,ve=l&&n.boostStartedAt!==void 0?n.boostEndsAt-n.boostStartedAt:0,xe=Math.floor(be/1e3),ao=`${Math.floor(xe/60)}:${String(xe%60).padStart(2,"0")}`,lo=(this.config.boost_durations??[30,60]).map(T=>Number(T)).filter(T=>Number.isFinite(T)&&T>0).slice(0,4),co=`--zone-color: ${b}; --zone-shape: ${E(b,16)};`;return c`
      <ha-card style=${co} class=${n.available?"":"unavailable"}>
        <div class="header">
          <button class="info" type="button" @click=${this.moreInfo} aria-label=${n.name}>
            <span class="shape"><ha-icon .icon=${U(n,this.config.icon)}></ha-icon></span>
            <span class="titles">
              <span class="name">${this.config.name??n.name}</span>
              <span class="sub">${n.available?no:r("unavailable")}</span>
            </span>
          </button>
          ${fe?fe.low?c`<span class="chip battery-low" title=${`${r("battery")}: ${r("battery_low")}`}>
                  <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                  <span>${r("battery_low")}</span>
                </span>`:c`<span class="chip battery-ok icon-only" title=${`${r("battery")}: ${r("battery_ok")}`}>
                  <ha-icon icon="mdi:battery-check"></ha-icon>
                </span>`:p}
          <span class="chip" title=${r(It.label)}>
            <ha-icon .icon=${It.icon}></ha-icon>
            <span>${r(It.label)}</span>
          </span>
        </div>

        <div class="dial">
          <svg
            viewBox="0 0 ${g.W} ${g.H}"
            role="img"
            aria-label=${`${ge} ${s(d)}, ${r("now")} ${Nt}`}
            @pointerdown=${this.onPointerDown}
            @pointermove=${this.onPointerMove}
            @pointerup=${this.onPointerUp}
            @pointercancel=${this.onPointerUp}
          >
            <path class="track" d=${Bo}></path>
            <path class="ticks" d=${Ho}></path>
            ${gt`<path class="seg ${h?"active":""}" d=${R}></path>`}
            ${W?gt`<circle class="current" cx=${W.x} cy=${W.y} r="6"></circle>`:p}
            <circle class="handle" cx=${O.x} cy=${O.y} r="12"></circle>
          </svg>
          <span class="end off">${r("off")}</span>
          <span class="end max">${r("max")}</span>
          <div class="center">
            <span class="label">${ge}</span>
            <span class="big">${io}${u||m?p:c`<span class="deg">°</span>`}</span>
            <span class="now">
              ${h?c`<ha-icon icon="mdi:fire"></ha-icon>`:p}
              <span>${ro}</span>
              ${ye?c`<span class="hum" title=${r("humidity")}>
                    <ha-icon icon="mdi:water-percent"></ha-icon>${ye}
                  </span>`:p}
            </span>
          </div>
          ${this.config.show_stepper===!1?p:c`<div class="stepper">
                <button type="button" aria-label=${r("lower")} @click=${()=>this.step(-1)}>
                  <ha-icon icon="mdi:minus"></ha-icon>
                </button>
                <span class="divider"></span>
                <button type="button" aria-label=${r("raise")} @click=${()=>this.step(1)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>`}
        </div>

        ${this.config.show_schedule===!1?p:Dt({hass:t,schedule:this.scheduleCtl.schedule,source:a,onOpen:()=>this.openSchedule(),onResume:()=>void this.call("resume_schedule")})}

        <div class="actions">
          ${l?c`<button type="button" class="boosting" @click=${()=>this.call("cancel_boost")} aria-label=${r("cancel_boost_aria",{zone:n.name})}>
                <span class="fill" style=${`width: ${ve>0?(be/ve*100).toFixed(2):0}%`}></span>
                <ha-icon icon="mdi:fire"></ha-icon>
                <span class="label">${r("boost_to",{value:s(n.value),left:ao})}</span>
                <span class="cancel">${r("cancel")}</span>
              </button>`:lo.map(T=>c`<button type="button" class="boost" @click=${()=>this.call("boost",{duration:T})}>
                  <ha-icon icon="mdi:fire"></ha-icon>
                  <span>${r("boost_for",{min:T})}</span>
                </button>`)}
        </div>
      </ha-card>
    `}};G.styles=[Pt,z`
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
    .chip.battery-low {
      background: color-mix(in srgb, ${Ze} 16%, transparent);
      color: ${Ze};
    }
    .chip.battery-ok {
      color: ${Io};
    }
    .chip.icon-only {
      padding: 0;
      width: 28px;
      justify-content: center;
    }
    .chip.battery-low ha-icon,
    .chip.battery-ok ha-icon {
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
      color: ${re};
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
      background: color-mix(in srgb, ${re} 10%, transparent);
    }
    .actions .boosting .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: color-mix(in srgb, ${re} 22%, transparent);
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
  `],v([M({attribute:!1})],G.prototype,"hass",2),v([w()],G.prototype,"config",2),v([w()],G.prototype,"pending",2);var Ke={schedule:{icon:"mdi:calendar-clock",label:"schedule"},manual:{icon:"mdi:hand-back-right-outline",label:"manual"},away:{icon:"mdi:home-export-outline",label:"away"},boost:{icon:"mdi:fire",label:"boost"},none:{icon:"mdi:calendar-remove-outline",label:"no_schedule"}},et=class extends S{constructor(){super(...arguments);this.tickEvery=0;this.scheduleCtl=new rt(this,()=>({hass:this.hass,zone:this.zone,enabled:!0}))}setConfig(t){if(!t?.entity)throw new Error("Set the entity of a Luna Climate zone");this.config={show_humidity:!0,...t}}static getStubConfig(t){return{type:"custom:luna-zone-compact-card",entity:Object.keys(t.states).find(n=>A(t.states[n]))??"climate.luna_zone"}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{filter:{integration:"luna_climate",domain:"climate"}}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"show_humidity",selector:{boolean:{}}}],computeLabel:t=>({entity:"Luna zone",name:"Name",icon:"Icon",show_humidity:"Show humidity"})[t.name]??t.name}}getCardSize(){return 3}getGridOptions(){return{columns:12,min_columns:6}}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.tickTimer),this.tickTimer=void 0,this.tickEvery=0}get zone(){let t=this.config&&this.hass?.states[this.config.entity];return t&&A(t)?H(t):void 0}updated(t){super.updated(t);let o=this.zone;if(!o)return;let n=D(o)?1e4:3e4;n!==this.tickEvery&&(window.clearInterval(this.tickTimer),this.tickEvery=n,this.tickTimer=window.setInterval(()=>this.requestUpdate(),n))}moreInfo(){this.config&&N(this.config.entity,"overview",this.hass)}openSchedule(){this.config&&N(this.config.entity,"schedule",this.hass)}render(){if(!this.config||!this.hass)return p;let t=this.hass,o=t.states[this.config.entity];if(!o||!A(o))return c`<ha-card class="message">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${x(t,"not_luna",{entity:this.config.entity})}</span>
      </ha-card>`;let n=H(o),r=(y,R)=>x(t,y,R),s=q(n),d=D(n),a=n.precomfort&&n.source==="schedule"?{icon:"mdi:map-marker-radius-outline",label:"precomfort"}:Ke[n.source]??Ke.none,l=r(a.label);if(d){let y=Math.max(0,n.boostEndsAt-Date.now());l=`${r("boost")} \xB7 ${Math.ceil(y/6e4)} ${r("min")}`}else n.value==="off"&&n.source!=="manual"&&(l=`${r(a.label)} \xB7 ${r("off")}`);let u=n.value==="off"?r("off"):k(n.value,t),m=n.current!==void 0?k(n.current,t):"\u2013",h=this.config.show_humidity!==!1&&n.humidity!==void 0,b=it(t,n.entityId),_=`--zone-color: ${s}; --zone-shape: ${E(s,16)};`;return c`
      <ha-card style=${_} class=${n.available?"":"unavailable"}>
        <button class="header" type="button" @click=${this.moreInfo} aria-label=${n.name}>
          <span class="shape"><ha-icon .icon=${U(n,this.config.icon)}></ha-icon></span>
          <span class="name">${this.config.name??n.name}</span>
          ${b?b.low?c`<span class="battery low" title=${`${r("battery")}: ${r("battery_low")}`}>
                  <ha-icon icon="mdi:battery-alert-variant-outline"></ha-icon>
                  ${r("battery_low")}
                </span>`:c`<span class="battery ok" title=${`${r("battery")}: ${r("battery_ok")}`}>
                  <ha-icon icon="mdi:battery-check"></ha-icon>
                </span>`:p}
        </button>

        <div class="stats ${h?"three":"two"}">
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
              ${n.heating?c`<ha-icon class="flame" icon="mdi:fire"></ha-icon>`:p}
              <span class="text">${m}</span>
              <span class="target" title=${r("target")}>→ ${u}</span>
            </span>
          </div>
          ${h?c`<div class="stat">
                <span class="label">${r("humidity")}</span>
                <span class="value">
                  <ha-icon class="water" icon="mdi:water-percent"></ha-icon>
                  <span class="text">${K(n.humidity,t)}</span>
                </span>
              </div>`:p}
        </div>

        ${Dt({hass:t,schedule:this.scheduleCtl.schedule,source:n.source,onOpen:()=>this.openSchedule(),onResume:()=>void t.callService("luna_climate","resume_schedule",{entity_id:n.entityId})})}
      </ha-card>
    `}};et.styles=[Pt,z`
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
        --mdc-icon-size: 15px;
      }
      .battery.low {
        color: ${$(f.batteryLow)};
        background: color-mix(in srgb, ${$(f.batteryLow)} 16%, transparent);
      }
      .battery.ok {
        padding: 0;
        width: 26px;
        justify-content: center;
        color: ${$(f.batteryOk)};
        --mdc-icon-size: 17px;
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
    `],v([M({attribute:!1})],et.prototype,"hass",2),v([w()],et.prototype,"config",2);var We=["workday","free"];function bt(i){return i==="workday"?"free":"workday"}var I=15,Z=1440,ce=18,de=25;function Ht(i){let[e,t]=i.split(":").map(Number);return(e||0)*60+(t||0)}function B(i){let e=Math.max(0,Math.min(Z,Math.round(i))),t=Math.floor(e/60),o=e%60;return`${String(t).padStart(2,"0")}:${String(o).padStart(2,"0")}`}function pe(i,e=I){return Math.round(i/e)*e}function Ge(i){let e=[];for(let t of i??[]){let o=Ht(t.start);e.some(n=>n.start===o)||e.push({start:o,value:t.value})}return e.sort((t,o)=>t.start-o.start)}function Xe(i){return{workday:Ge(i?.workday),free:Ge(i?.free)}}function Ye(i){let e=t=>t.map(o=>({start:B(o.start),value:o.value}));return{workday:e(i.workday),free:e(i.free)}}function vt(i){return{workday:i.workday.map(e=>({...e})),free:i.free.map(e=>({...e}))}}function ue(i,e){return JSON.stringify(i)===JSON.stringify(e)}function he(i,e){for(let t of[e,bt(e)]){let o=i[t];if(o.length)return o[o.length-1].value}}function xt(i,e){return e+1<i.length?i[e+1].start:Z}function me(i,e){let t=e>0?i[e-1].start+I:0,o=e+1<i.length?i[e+1].start-I:Z-I;return[t,o]}function wt(i,e,t){let[o,n]=me(i,e),r=i.map(s=>({...s}));return r[e].start=Math.max(o,Math.min(n,pe(t))),r}function Je(i,e){let t=i[e].start,o=xt(i,e),n=pe((t+o)/2);if(n-t<I||o-n<I)return;let r=i.map(s=>({...s}));return r.splice(e+1,0,{start:n,value:i[e].value}),{blocks:r,index:e+1}}function Qe(i,e,t){let o=Math.max(0,Math.min(Z-I,pe(e)));if(i.some(r=>Math.abs(r.start-o)<I))return;let n=[...i.map(r=>({...r})),{start:o,value:t}].sort((r,s)=>r.start-s.start);return{blocks:n,index:n.findIndex(r=>r.start===o)}}function to(i,e){return i.filter((t,o)=>o!==e)}function eo(i){return Math.min(de,Math.max(ce,Math.round(i*2)/2))}var Oo=$(f.max),No=$(f.heat);function oo(i){return i==="off"?"color-mix(in srgb, var(--primary-text-color) 14%, transparent)":i==="max"?f.max:E(f.heat,Math.round(Math.min(100,35+(i-17)/8*65)))}function Ro(i){return i==="off"?"var(--secondary-text-color)":i==="max"||i>=22?"#fff":"var(--primary-text-color)"}var C=class extends S{constructor(){super(...arguments);this.busy=!1;this.plan={workday:[],free:[]};this.original={workday:[],free:[]};this.kind="workday";this.copying=!1;this.kindChosen=!1;this.barWidth=600;this.lastTemp=21}firstUpdated(){let t=this.renderRoot.querySelector(".bar");!t||typeof ResizeObserver>"u"||(this.resize=new ResizeObserver(([o])=>this.barWidth=o.contentRect.width),this.resize.observe(t))}disconnectedCallback(){super.disconnectedCallback(),this.resize?.disconnect(),this.resize=void 0}connectedCallback(){super.connectedCallback(),this.hasUpdated&&!this.resize&&this.firstUpdated()}get dirty(){return!ue(this.plan,this.original)}reset(){this.plan=vt(this.original),this.selected=void 0,this.copying=!1}willUpdate(t){if(super.willUpdate(t),t.has("data")&&this.data){let o=Xe(this.data.schedules);(!this.dirty||ue(o,this.plan))&&(this.original=o,this.plan=vt(o),typeof this.selected=="number"&&this.selected>=this.blocks.length&&(this.selected=void 0)),this.kindChosen||(this.kind=this.data.day_types.today,this.kindChosen=!0)}}get blocks(){return this.plan[this.kind]}L(t,o){return x(this.hass,t,o)}fmt(t){return k(t,this.hass)}typeName(t){return this.L(t==="workday"?"workday":"free_day")}setDay(t){this.plan={...vt(this.plan),[this.kind]:t}}select(t){this.selected=this.selected===t?void 0:t,this.copying=!1}setValue(t){if(typeof this.selected!="number")return;typeof t=="number"&&(this.lastTemp=t);let o=this.blocks.map(n=>({...n}));o[this.selected].value=t,this.setDay(o),L("light")}stepTemp(t){if(typeof this.selected!="number")return;let o=this.blocks[this.selected].value,n=typeof o=="number"?o:this.lastTemp;this.setValue(eo(n+t*.5))}addBlock(){let t=this.blocks;if(!t.length){this.setDay([{start:6*60,value:this.lastTemp}]),this.selected=0;return}if(this.selected==="carry"){this.addAtMidnight();return}let o=typeof this.selected=="number"?this.selected:this.longestBlock(),n=Je(t,o);n&&(this.setDay(n.blocks),this.selected=n.index)}addAtMidnight(){let t=he(this.plan,this.kind)??this.lastTemp,o=Qe(this.blocks,0,t);o&&(this.setDay(o.blocks),this.selected=o.index)}longestBlock(){let t=0,o=-1;return this.blocks.forEach((n,r)=>{let s=xt(this.blocks,r)-n.start;s>o&&(t=r,o=s)}),t}removeSelected(){if(typeof this.selected!="number")return;let t=this.selected;this.setDay(to(this.blocks,t)),this.selected=this.blocks.length?Math.max(0,t-1):void 0}setStartFromInput(t,o){o&&this.setDay(wt(this.blocks,t,Ht(o)))}setEndFromInput(t,o){!o||t+1>=this.blocks.length||this.setDay(wt(this.blocks,t+1,Ht(o)))}minutesAt(t){let n=this.renderRoot.querySelector(".bar").getBoundingClientRect();return(t.clientX-n.left)/n.width*Z}onHandleDown(t,o){t.preventDefault(),t.stopPropagation(),t.currentTarget.setPointerCapture?.(t.pointerId),this.dragging=o,this.selected=o,this.copying=!1}onHandleMove(t,o){if(this.dragging!==o)return;let n=this.blocks[o].start,r=wt(this.blocks,o,this.minutesAt(t));r[o].start!==n&&(this.setDay(r),L("light"))}onHandleUp(){this.dragging=void 0}onHandleKey(t,o){let n=t.key==="ArrowLeft"||t.key==="ArrowDown"?-I:t.key==="ArrowRight"||t.key==="ArrowUp"?I:0;n&&(t.preventDefault(),this.setDay(wt(this.blocks,o,this.blocks[o].start+n)),this.selected=o)}applyCopy(){let t=bt(this.kind);this.plan={...vt(this.plan),[t]:this.blocks.map(o=>({...o}))},this.copying=!1,this.kind=t,this.selected=void 0,L("success")}save(){tt(this,"schedule-save",{schedules:Ye(this.plan)})}cancel(){this.reset(),tt(this,"schedule-cancel")}render(){let t=this.blocks,o=he(this.plan,this.kind),n=this.data?.day_types.today,r=t.length?t[0].start:Z,s=a=>`${a/Z*100}%`,d=a=>a/Z*this.barWidth;return c`
      <div class="kinds" role="tablist" aria-label=${this.L("schedule")}>
        ${We.map(a=>c`<button
            type="button"
            role="tab"
            class="kind ${a===this.kind?"active":""}"
            aria-selected=${a===this.kind?"true":"false"}
            @click=${()=>{this.kind=a,this.selected=void 0,this.copying=!1}}
          >
            <ha-icon .icon=${a==="workday"?"mdi:briefcase-outline":"mdi:beach"}></ha-icon>
            <span class="kind-text">
              <span class="kind-name">${this.typeName(a)}</span>
              <span class="kind-sub">${this.L(a==="workday"?"workday_sub":"free_sub")}</span>
            </span>
            ${a===n?c`<span class="today">${this.L("today")}</span>`:p}
          </button>`)}
      </div>

      <div class="bar-wrap">
        <div class="bar">
          ${r>0?c`<button
                type="button"
                class="seg carry ${this.selected==="carry"?"selected":""}"
                style=${`left: 0; width: ${s(r)}; --seg: ${o!==void 0?oo(o):"transparent"}; --ink: var(--secondary-text-color)`}
                aria-label=${this.L("carry_over")}
                @click=${()=>this.select("carry")}
              >
                ${d(r)>=56&&o!==void 0?c`<span class="label">${this.fmt(o)}</span>`:p}
              </button>`:p}
          ${t.map((a,l)=>{let u=xt(t,l),m=u-a.start;return c`<button
              type="button"
              class="seg ${this.selected===l?"selected":""} ${l===t.length-1?"last":""}"
              style=${`left: ${s(a.start)}; width: ${s(m)}; --seg: ${oo(a.value)}; --ink: ${Ro(a.value)}`}
              aria-label=${`${B(a.start)}\u2013${B(u)}, ${this.fmt(a.value)}`}
              @click=${()=>this.select(l)}
            >
              ${d(m)>=52?c`<span class="label">${this.fmt(a.value)}</span>`:p}
              ${d(m)>=104?c`<span class="time">${B(a.start)}–${B(u)}</span>`:p}
            </button>`})}
          ${t.map((a,l)=>c`<button
              type="button"
              class="handle ${this.dragging===l?"dragging":""}"
              style=${`left: ${s(a.start)}`}
              aria-label=${this.L("move_start",{time:B(a.start)})}
              @pointerdown=${u=>this.onHandleDown(u,l)}
              @pointermove=${u=>this.onHandleMove(u,l)}
              @pointerup=${()=>this.onHandleUp()}
              @pointercancel=${()=>this.onHandleUp()}
              @keydown=${u=>this.onHandleKey(u,l)}
            >
              <span class="grip"></span>
              ${this.dragging===l?c`<span class="bubble">${B(a.start)}</span>`:p}
            </button>`)}
        </div>
        <div class="axis" aria-hidden="true">
          ${[0,3,6,9,12,15,18,21,24].map(a=>c`<span class=${a===0?"first":a===24?"last":""} style=${`left: ${a/24*100}%`}
              >${String(a).padStart(2,"0")}</span
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
          <ha-icon icon="mdi:content-copy"></ha-icon>${this.L("copy_to_type",{type:this.typeName(bt(this.kind))})}
        </button>
      </div>

      ${this.copying?this.renderCopy():this.renderPanel(o)}

      ${this.error?c`<div class="error" role="alert">${this.error}</div>`:p}

      <div class="footer">
        <button type="button" class="ghost" ?disabled=${!this.dirty||this.busy} @click=${this.cancel}>
          ${this.L("discard")}
        </button>
        <button type="button" class="primary" ?disabled=${!this.dirty||this.busy} @click=${this.save}>
          ${this.busy?this.L("saving"):this.L("save")}
        </button>
      </div>
    `}renderCopy(){let t=this.typeName(bt(this.kind));return c`<div class="panel">
      <div class="hint">${this.L("copy_confirm",{from:this.typeName(this.kind),to:t})}</div>
      <div class="row end">
        <button type="button" class="ghost" @click=${()=>this.copying=!1}>${this.L("cancel")}</button>
        <button type="button" class="primary" @click=${this.applyCopy}>${this.L("copy")}</button>
      </div>
    </div>`}renderPanel(t){if(this.selected==="carry")return c`<div class="panel">
        <div class="hint">
          ${t!==void 0?this.L("carry_hint",{value:this.fmt(t)}):this.L("empty_hint")}
        </div>
        <div class="row end">
          <button type="button" class="primary" @click=${this.addAtMidnight}>${this.L("add_midnight")}</button>
        </div>
      </div>`;if(typeof this.selected!="number")return c`<div class="panel muted">
        <div class="hint">${this.blocks.length?this.L("select_hint"):this.L("empty_hint")}</div>
      </div>`;let o=this.selected,n=this.blocks[o],r=xt(this.blocks,o),[s,d]=me(this.blocks,o),a=o+1>=this.blocks.length,l=typeof n.value=="number"?n.value:void 0;return c`<div class="panel">
      <div class="row times">
        <label>
          <span>${this.L("from")}</span>
          <input
            type="time"
            step="900"
            .value=${B(n.start)}
            min=${B(s)}
            max=${B(d)}
            @change=${u=>this.setStartFromInput(o,u.target.value)}
          />
        </label>
        <label>
          <span>${this.L("to")}</span>
          ${a?c`<span class="fixed">${this.L("next_block")}</span>`:c`<input
                type="time"
                step="900"
                .value=${B(r)}
                @change=${u=>this.setEndFromInput(o,u.target.value)}
              />`}
        </label>
      </div>

      <div class="values" role="radiogroup" aria-label=${this.L("action")}>
        <button
          type="button"
          role="radio"
          class="value ${n.value==="off"?"active":""}"
          aria-checked=${n.value==="off"?"true":"false"}
          @click=${()=>this.setValue("off")}
        >
          <ha-icon icon="mdi:power"></ha-icon>${this.L("off")}
        </button>
        <div class="value temp ${l!==void 0?"active":""}">
          <button type="button" aria-label=${this.L("lower")} ?disabled=${l!==void 0&&l<=ce} @click=${()=>this.stepTemp(-1)}>
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button
            type="button"
            role="radio"
            class="reading"
            aria-checked=${l!==void 0?"true":"false"}
            @click=${()=>this.setValue(l??this.lastTemp)}
          >
            ${this.fmt(l??this.lastTemp)}
          </button>
          <button type="button" aria-label=${this.L("raise")} ?disabled=${l!==void 0&&l>=de} @click=${()=>this.stepTemp(1)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <button
          type="button"
          role="radio"
          class="value ${n.value==="max"?"active max":""}"
          aria-checked=${n.value==="max"?"true":"false"}
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
    </div>`}};C.styles=z`
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

    .kinds {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 8px;
    }
    .kind {
      all: unset;
      position: relative;
      box-sizing: border-box;
      min-height: 56px;
      padding: 8px 12px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      cursor: pointer;
      background: var(--luna-soft);
      color: var(--secondary-text-color);
      box-shadow: inset 0 0 0 1.5px transparent;
    }
    .kind ha-icon {
      flex: none;
      --mdc-icon-size: 20px;
    }
    .kind.active {
      color: var(--primary-text-color);
      box-shadow: inset 0 0 0 1.5px var(--primary-text-color);
    }
    .kind:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .kind-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .kind-name {
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .kind-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .today {
      position: absolute;
      top: -7px;
      right: 10px;
      padding: 1px 7px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
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
      background: ${Oo};
      color: #fff;
    }
    .value.temp {
      padding: 0;
      display: grid;
      grid-template-columns: 40px 1fr 40px;
      cursor: default;
    }
    .value.temp.active {
      background: ${No};
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
  `,v([M({attribute:!1})],C.prototype,"hass",2),v([M({attribute:!1})],C.prototype,"data",2),v([M({type:Boolean})],C.prototype,"busy",2),v([M({attribute:!1})],C.prototype,"error",2),v([w()],C.prototype,"plan",2),v([w()],C.prototype,"original",2),v([w()],C.prototype,"kind",2),v([w()],C.prototype,"selected",2),v([w()],C.prototype,"copying",2),v([w()],C.prototype,"dragging",2),v([w()],C.prototype,"barWidth",2);var Vo="0.5.0";function at(i,e){customElements.get(i)||customElements.define(i,e)}at("luna-zone-card",G);at("luna-zone-compact-card",et);at("luna-badge-card",zt);at("luna-boost-badge",Mt);at("luna-schedule-editor",C);at("luna-zone-dialog",P);function Uo(){let i=!1,e=()=>{if(i)return;let o=document.querySelector("home-assistant")?.hass;o?.connection&&(i=!0,window.clearInterval(t),o.connection.subscribeMessage(n=>{n.entity_id&&document.visibilityState==="visible"&&N(n.entity_id)},{type:"luna_climate/subscribe_ui"}).catch(()=>{}))},t=window.setInterval(e,1e3);e()}Uo();var Bt=window;Bt.customCards=Bt.customCards??[];for(let i of[{type:"luna-zone-card",name:"Luna zone",description:"Dial, schedule strip and boost buttons for one Luna Climate zone.",preview:!0},{type:"luna-zone-compact-card",name:"Luna zone (compact)",description:"Mode, temperature and humidity over the schedule strip, without the dial.",preview:!0},{type:"luna-boost-badge",name:"Luna boost badge",description:"Compact pill for a Luna zone. Tap to boost, tap again to cancel.",preview:!0},{type:"luna-badge-card",name:"Luna badge",description:"General-purpose pill for any entity, with templates, a progress ring and an indicator dot.",preview:!0}])Bt.customCards.some(e=>e.type===i.type)||Bt.customCards.push(i);console.info(`%c LUNA CLIMATE %c ${Vo} `,"background:#ff8100;color:#111;font-weight:700","color:#ff8100");
