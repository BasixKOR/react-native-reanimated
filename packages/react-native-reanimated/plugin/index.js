"use strict";var Ye=Object.create;var be=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var Qe=Object.getOwnPropertyNames;var et=Object.getPrototypeOf,tt=Object.prototype.hasOwnProperty;var p=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var rt=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Qe(t))!tt.call(e,i)&&i!==r&&be(e,i,{get:()=>t[i],enumerable:!(n=Ke(t,i))||n.enumerable});return e};var M=(e,t,r)=>(r=e!=null?Ye(et(e)):{},rt(t||!e||!e.__esModule?be(r,"default",{value:e,enumerable:!0}):r,e));var E=p(m=>{"use strict";Object.defineProperty(m,"__esModule",{value:!0});m.workletClassFactorySuffix=m.isWorkletizableObjectNode=m.isWorkletizableObjectPath=m.isWorkletizableFunctionNode=m.isWorkletizableFunctionPath=m.WorkletizableObject=m.WorkletizableFunction=void 0;var U=require("@babel/types");m.WorkletizableFunction="FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ObjectMethod";m.WorkletizableObject="ObjectExpression";function nt(e){return e.isFunctionDeclaration()||e.isFunctionExpression()||e.isArrowFunctionExpression()||e.isObjectMethod()}m.isWorkletizableFunctionPath=nt;function it(e){return(0,U.isFunctionDeclaration)(e)||(0,U.isFunctionExpression)(e)||(0,U.isArrowFunctionExpression)(e)||(0,U.isObjectMethod)(e)}m.isWorkletizableFunctionNode=it;function ot(e){return e.isObjectExpression()}m.isWorkletizableObjectPath=ot;function st(e){return(0,U.isObjectExpression)(e)}m.isWorkletizableObjectNode=st;m.workletClassFactorySuffix="__classFactory"});var Z=p(x=>{"use strict";Object.defineProperty(x,"__esModule",{value:!0});x.initializeGlobals=x.globals=x.defaultGlobals=void 0;var at=["globalThis","Infinity","NaN","undefined","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape","Object","Function","Boolean","Symbol","Error","AggregateError","EvalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError","InternalError","Number","BigInt","Math","Date","String","RegExp","Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","BigInt64Array","BigUint64Array","Float32Array","Float64Array","Map","Set","WeakMap","WeakSet","ArrayBuffer","SharedArrayBuffer","DataView","Atomics","JSON","WeakRef","FinalizationRegistry","Iterator","AsyncIterator","Promise","GeneratorFunction","AsyncGeneratorFunction","Generator","AsyncGenerator","AsyncFunction","Reflect","Proxy","Intl","null","this","global","window","globalThis","console","performance","queueMicrotask","requestAnimationFrame","setImmediate","arguments","HermesInternal","_WORKLET","ReanimatedError"],lt=["_IS_FABRIC","_log","_toString","_scheduleOnJS","_scheduleOnRuntime","_makeShareableClone","_updatePropsPaper","_updatePropsFabric","_removeFromPropsRegistry","_measurePaper","_measureFabric","_scrollToPaper","_dispatchCommandPaper","_dispatchCommandFabric","_setGestureState","_notifyAboutProgress","_notifyAboutEnd","_runOnUIQueue","_getAnimationTimestamp"];x.defaultGlobals=new Set(at.concat(lt));function ct(){x.globals=new Set(x.defaultGlobals)}x.initializeGlobals=ct});var D=p(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.replaceWithFactoryCall=C.addCustomGlobals=C.isRelease=void 0;var B=require("@babel/types"),ut=Z();function dt(){var e,t;let r=/(prod|release|stag[ei])/i;return!!(!((e=process.env.BABEL_ENV)===null||e===void 0)&&e.match(r)||!((t=process.env.NODE_ENV)===null||t===void 0)&&t.match(r))}C.isRelease=dt;function ft(){this.opts&&Array.isArray(this.opts.globals)&&this.opts.globals.forEach(e=>{ut.globals.add(e)})}C.addCustomGlobals=ft;function pt(e,t,r){if(!t||!bt(e))e.replaceWith(r);else{let n=(0,B.variableDeclaration)("const",[(0,B.variableDeclarator)((0,B.identifier)(t),r)]);e.replaceWith(n)}}C.replaceWithFactoryCall=pt;function bt(e){return(0,B.isScopable)(e.parent)||(0,B.isExportNamedDeclaration)(e.parent)}});var ye=p(O=>{"use strict";var mt=O&&O.__createBinding||(Object.create?function(e,t,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(t,r);(!i||("get"in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,i)}:function(e,t,r,n){n===void 0&&(n=r),e[n]=t[r]}),yt=O&&O.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),me=O&&O.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var r in e)r!=="default"&&Object.prototype.hasOwnProperty.call(e,r)&&mt(t,e,r);return yt(t,e),t},kt=O&&O.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(O,"__esModule",{value:!0});O.buildWorkletString=void 0;var se=require("@babel/core"),gt=kt(require("@babel/generator")),c=require("@babel/types"),G=require("assert"),_t=me(require("convert-source-map")),Ot=me(require("fs")),vt=E(),ht=D(),Et="mock source map";function It(e,t,r,n,i){St(e,n);let s=e.program.body.find(g=>(0,c.isFunctionDeclaration)(g))||e.program.body.find(g=>(0,c.isExpressionStatement)(g))||void 0;(0,G.strict)(s,"[Reanimated] `draftExpression` is undefined.");let l=(0,c.isFunctionDeclaration)(s)?s:s.expression;(0,G.strict)("params"in l,"'params' property is undefined in 'expression'"),(0,G.strict)((0,c.isBlockStatement)(l.body),"[Reanimated] `expression.body` is not a `BlockStatement`");let u=new Set;(0,se.traverse)(e,{NewExpression(g){if(!(0,c.isIdentifier)(g.node.callee))return;let W=g.node.callee.name;if(!r.some(H=>H.name===W)||u.has(W))return;let A=r.findIndex(H=>H.name===W);r.splice(A,1);let ne=W+vt.workletClassFactorySuffix;r.push((0,c.identifier)(ne)),(0,c.assertBlockStatement)(l.body),l.body.body.unshift((0,c.variableDeclaration)("const",[(0,c.variableDeclarator)((0,c.identifier)(W),(0,c.callExpression)((0,c.identifier)(ne),[]))])),u.add(W)}});let f=(0,c.functionExpression)((0,c.identifier)(n),l.params,l.body,l.generator,l.async),k=(0,gt.default)(f).code;(0,G.strict)(i,"[Reanimated] `inputMap` is undefined.");let _=!((0,ht.isRelease)()||t.opts.disableSourceMaps);if(_){i.sourcesContent=[];for(let g of i.sources)i.sourcesContent.push(Ot.readFileSync(g).toString("utf-8"))}let R=(0,se.transformSync)(k,{plugins:[Ft(r)],compact:!0,sourceMaps:_,inputSourceMap:i,ast:!1,babelrc:!1,configFile:!1,comments:!1});(0,G.strict)(R,"[Reanimated] `transformed` is null.");let j;return _&&(Wt()?j=Et:(j=_t.fromObject(R.map).toObject(),delete j.sourcesContent)),[R.code,JSON.stringify(j)]}O.buildWorkletString=It;function St(e,t){(0,se.traverse)(e,{FunctionExpression(r){if(!r.node.id){r.stop();return}let n=r.node.id.name;r.scope.rename(n,t)}})}function Wt(){return process.env.REANIMATED_JEST_SHOULD_MOCK_SOURCE_MAP==="1"}function xt(e,t,r){t.length===0||!(0,c.isProgram)(e.parent)||(0,c.isExpression)(e.node.body)||e.node.body.body.unshift(r)}function Ct(e){var t;(0,c.isProgram)(e.parent)&&!(0,c.isArrowFunctionExpression)(e.node)&&!(0,c.isObjectMethod)(e.node)&&e.node.id&&e.scope.parent&&((t=e.scope.parent.bindings[e.node.id.name])===null||t===void 0?void 0:t.references)>0&&e.node.body.body.unshift((0,c.variableDeclaration)("const",[(0,c.variableDeclarator)((0,c.identifier)(e.node.id.name),(0,c.memberExpression)((0,c.thisExpression)(),(0,c.identifier)("_recur")))]))}function Ft(e){let t=(0,c.variableDeclaration)("const",[(0,c.variableDeclarator)((0,c.objectPattern)(e.map(r=>(0,c.objectProperty)((0,c.identifier)(r.name),(0,c.identifier)(r.name),!1,!0))),(0,c.memberExpression)((0,c.thisExpression)(),(0,c.identifier)("__closure")))]);return{visitor:{"FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ObjectMethod":r=>{xt(r,e,t),Ct(r)}}}}});var Oe=p(P=>{"use strict";var wt=P&&P.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(P,"__esModule",{value:!0});P.makeWorkletFactory=void 0;var ge=require("@babel/core"),jt=wt(require("@babel/generator")),o=require("@babel/types"),F=require("assert"),_e=require("path"),Dt=Z(),ke=E(),ae=D(),Rt=ye(),At=require("../package.json").version,Mt="x.y.z",Pt=[require.resolve("@babel/preset-typescript")],qt=[require.resolve("@babel/plugin-transform-shorthand-properties"),require.resolve("@babel/plugin-transform-arrow-functions"),require.resolve("@babel/plugin-transform-optional-chaining"),require.resolve("@babel/plugin-transform-nullish-coalescing-operator"),[require.resolve("@babel/plugin-transform-template-literals"),{loose:!0}]];function Lt(e,t){zt(e),(0,F.strict)(t.file.opts.filename,"[Reanimated] `state.file.opts.filename` is undefined.");let r=(0,jt.default)(e.node,{sourceMaps:!0,sourceFileName:t.file.opts.filename});r.code="("+(e.isObjectMethod()?"function ":"")+r.code+`
)`;let n=(0,ge.transformSync)(r.code,{filename:t.file.opts.filename,presets:Pt,plugins:qt,ast:!0,babelrc:!1,configFile:!1,inputSourceMap:r.map});(0,F.strict)(n,"[Reanimated] `transformed` is undefined."),(0,F.strict)(n.ast,"[Reanimated] `transformed.ast` is undefined.");let i=Bt(n.ast,e),s=(0,o.cloneNode)(e.node),l=(0,o.isBlockStatement)(s.body)?(0,o.functionExpression)(null,s.params,s.body,s.generator,s.async):s,{workletName:u,reactName:f}=Ut(e,t),[k,_]=(0,Rt.buildWorkletString)(n.ast,t,i,u,n.map);(0,F.strict)(k,"[Reanimated] `funString` is undefined.");let R=Tt(k),j=1;i.length>0&&(j-=i.length+2);let g=e.parentPath.isProgram()?e:e.findParent(y=>{var ie,oe;return(oe=(ie=y.parentPath)===null||ie===void 0?void 0:ie.isProgram())!==null&&oe!==void 0?oe:!1});(0,F.strict)(g,"[Reanimated] `pathForStringDefinitions` is null."),(0,F.strict)(g.parentPath,"[Reanimated] `pathForStringDefinitions.parentPath` is null.");let W=g.parentPath.scope.generateUidIdentifier(`worklet_${R}_init_data`),A=(0,o.objectExpression)([(0,o.objectProperty)((0,o.identifier)("code"),(0,o.stringLiteral)(k))]);if(!(0,ae.isRelease)()){let y=t.file.opts.filename;t.opts.relativeSourceLocation&&(y=(0,_e.relative)(t.cwd,y),_=_==null?void 0:_.replace(t.file.opts.filename,y)),A.properties.push((0,o.objectProperty)((0,o.identifier)("location"),(0,o.stringLiteral)(y)))}_&&A.properties.push((0,o.objectProperty)((0,o.identifier)("sourceMap"),(0,o.stringLiteral)(_))),!(0,ae.isRelease)()&&A.properties.push((0,o.objectProperty)((0,o.identifier)("version"),(0,o.stringLiteral)(Nt()?Mt:At)));let pe=!t.opts.omitNativeOnlyData;pe&&g.insertBefore((0,o.variableDeclaration)("const",[(0,o.variableDeclarator)(W,A)])),(0,F.strict)(!(0,o.isFunctionDeclaration)(l),"[Reanimated] `funExpression` is a `FunctionDeclaration`."),(0,F.strict)(!(0,o.isObjectMethod)(l),"[Reanimated] `funExpression` is an `ObjectMethod`.");let T=[(0,o.variableDeclaration)("const",[(0,o.variableDeclarator)((0,o.identifier)(f),l)]),(0,o.expressionStatement)((0,o.assignmentExpression)("=",(0,o.memberExpression)((0,o.identifier)(f),(0,o.identifier)("__closure"),!1),(0,o.objectExpression)(i.map(y=>y.name.endsWith(ke.workletClassFactorySuffix)?(0,o.objectProperty)((0,o.identifier)(y.name),(0,o.memberExpression)((0,o.identifier)(y.name.slice(0,y.name.length-ke.workletClassFactorySuffix.length)),(0,o.identifier)(y.name))):(0,o.objectProperty)((0,o.identifier)(y.name),y,!1,!0))))),(0,o.expressionStatement)((0,o.assignmentExpression)("=",(0,o.memberExpression)((0,o.identifier)(f),(0,o.identifier)("__workletHash"),!1),(0,o.numericLiteral)(R)))];return pe&&T.push((0,o.expressionStatement)((0,o.assignmentExpression)("=",(0,o.memberExpression)((0,o.identifier)(f),(0,o.identifier)("__initData"),!1),W))),(0,ae.isRelease)()||(T.unshift((0,o.variableDeclaration)("const",[(0,o.variableDeclarator)((0,o.identifier)("_e"),(0,o.arrayExpression)([(0,o.newExpression)((0,o.memberExpression)((0,o.identifier)("global"),(0,o.identifier)("Error")),[]),(0,o.numericLiteral)(j),(0,o.numericLiteral)(-27)]))])),T.push((0,o.expressionStatement)((0,o.assignmentExpression)("=",(0,o.memberExpression)((0,o.identifier)(f),(0,o.identifier)("__stackDetails"),!1),(0,o.identifier)("_e"))))),T.push((0,o.returnStatement)((0,o.identifier)(f))),(0,o.functionExpression)(void 0,[],(0,o.blockStatement)(T))}P.makeWorkletFactory=Lt;function zt(e){e.traverse({DirectiveLiteral(t){t.node.value==="worklet"&&t.getFunctionParent()===e&&t.parentPath.remove()}})}function Nt(){return process.env.REANIMATED_JEST_SHOULD_MOCK_VERSION==="1"}function Tt(e){let t=e.length,r=5381,n=52711;for(;t--;){let i=e.charCodeAt(t);r=r*33^i,n=n*33^i}return(r>>>0)*4096+(n>>>0)}function Ut(e,t){let r="unknownFile";if(t.file.opts.filename){let l=t.file.opts.filename;r=(0,_e.basename)(l);let u=l.split("/"),f=u.indexOf("node_modules");f!==-1&&(r=`${u[f+1]}_${r}`)}let n=`${r}${t.workletNumber++}`,i="";(0,o.isObjectMethod)(e.node)&&(0,o.isIdentifier)(e.node.key)?i=e.node.key.name:((0,o.isFunctionDeclaration)(e.node)||(0,o.isFunctionExpression)(e.node))&&(0,o.isIdentifier)(e.node.id)&&(i=e.node.id.name);let s=i?(0,o.toIdentifier)(`${i}_${n}`):(0,o.toIdentifier)(n);return i=i||(0,o.toIdentifier)(n),{workletName:s,reactName:i}}function Bt(e,t){let r=new Map,n=new Map;return(0,ge.traverse)(e,{Identifier(i){if(!i.isReferencedIdentifier())return;let s=i.node.name;if(Dt.globals.has(s)||"id"in t.node&&t.node.id&&t.node.id.name===s)return;let l=i.parent;if((0,o.isMemberExpression)(l)&&l.property===i.node&&!l.computed||(0,o.isObjectProperty)(l)&&(0,o.isObjectExpression)(i.parentPath.parent)&&i.node!==l.value)return;let u=i.scope;for(;u!=null;){if(u.bindings[s]!=null)return;u=u.parent}r.set(s,i.node),n.set(s,!1)}}),t.traverse({Identifier(i){if(!i.isReferencedIdentifier())return;let s=r.get(i.node.name);!s||n.get(i.node.name)||(s.loc=i.node.loc,n.set(i.node.name,!0))}}),Array.from(r.values())}});var ve=p(V=>{"use strict";Object.defineProperty(V,"__esModule",{value:!0});V.makeWorkletFactoryCall=void 0;var Gt=require("@babel/types"),Ht=Oe();function Zt(e,t){let r=(0,Ht.makeWorkletFactory)(e,t),n=(0,Gt.callExpression)(r,[]);return Vt(e,n),n}V.makeWorkletFactoryCall=Zt;function Vt(e,t){let r=e.node.loc;r&&(t.callee.loc={filename:r.filename,identifierName:r.identifierName,start:r.start,end:r.start})}});var X=p(w=>{"use strict";Object.defineProperty(w,"__esModule",{value:!0});w.substituteObjectMethodWithObjectProperty=w.processWorklet=w.processIfWithWorkletDirective=void 0;var le=require("@babel/types"),Xt=E(),$t=D(),Jt=ve();function he(e,t){return!(0,le.isBlockStatement)(e.node.body)||!Yt(e.node.body.directives)?!1:(Ee(e,t),!0)}w.processIfWithWorkletDirective=he;function Ee(e,t){t.opts.processNestedWorklets&&e.traverse({[Xt.WorkletizableFunction](n,i){he(n,i)}},t);let r=(0,Jt.makeWorkletFactoryCall)(e,t);Kt(e,r)}w.processWorklet=Ee;function Yt(e){return e.some(t=>(0,le.isDirectiveLiteral)(t.value)&&t.value.value==="worklet")}function Kt(e,t){var r;if(e.isObjectMethod())Ie(e,t);else{let n="id"in e.node?(r=e.node.id)===null||r===void 0?void 0:r.name:void 0;(0,$t.replaceWithFactoryCall)(e,n,t)}}function Ie(e,t){let r=(0,le.objectProperty)(e.node.key,t);e.replaceWith(r)}w.substituteObjectMethodWithObjectProperty=Ie});var We=p($=>{"use strict";Object.defineProperty($,"__esModule",{value:!0});$.isGestureHandlerEventCallback=void 0;var I=require("@babel/types"),Qt=new Set(["Tap","Pan","Pinch","Rotation","Fling","LongPress","ForceTouch","Native","Manual","Race","Simultaneous","Exclusive","Hover"]),er=new Set(["onBegin","onStart","onEnd","onFinalize","onUpdate","onChange","onTouchesDown","onTouchesMove","onTouchesUp","onTouchesCancelled"]);function tr(e){return(0,I.isCallExpression)(e.parent)&&(0,I.isExpression)(e.parent.callee)&&rr(e.parent.callee)}$.isGestureHandlerEventCallback=tr;function rr(e){return(0,I.isMemberExpression)(e)&&(0,I.isIdentifier)(e.property)&&er.has(e.property.name)&&Se(e.object)}function Se(e){return!!(nr(e)||(0,I.isCallExpression)(e)&&(0,I.isMemberExpression)(e.callee)&&Se(e.callee.object))}function nr(e){return(0,I.isCallExpression)(e)&&(0,I.isMemberExpression)(e.callee)&&(0,I.isIdentifier)(e.callee.object)&&e.callee.object.name==="Gesture"&&(0,I.isIdentifier)(e.callee.property)&&Qt.has(e.callee.property.name)}});var Fe=p(J=>{"use strict";Object.defineProperty(J,"__esModule",{value:!0});J.isLayoutAnimationCallback=void 0;var S=require("@babel/types"),ir=new Set(["BounceIn","BounceInDown","BounceInLeft","BounceInRight","BounceInUp","BounceOut","BounceOutDown","BounceOutLeft","BounceOutRight","BounceOutUp","FadeIn","FadeInDown","FadeInLeft","FadeInRight","FadeInUp","FadeOut","FadeOutDown","FadeOutLeft","FadeOutRight","FadeOutUp","FlipInEasyX","FlipInEasyY","FlipInXDown","FlipInXUp","FlipInYLeft","FlipInYRight","FlipOutEasyX","FlipOutEasyY","FlipOutXDown","FlipOutXUp","FlipOutYLeft","FlipOutYRight","LightSpeedInLeft","LightSpeedInRight","LightSpeedOutLeft","LightSpeedOutRight","PinwheelIn","PinwheelOut","RollInLeft","RollInRight","RollOutLeft","RollOutRight","RotateInDownLeft","RotateInDownRight","RotateInUpLeft","RotateInUpRight","RotateOutDownLeft","RotateOutDownRight","RotateOutUpLeft","RotateOutUpRight","SlideInDown","SlideInLeft","SlideInRight","SlideInUp","SlideOutDown","SlideOutLeft","SlideOutRight","SlideOutUp","StretchInX","StretchInY","StretchOutX","StretchOutY","ZoomIn","ZoomInDown","ZoomInEasyDown","ZoomInEasyUp","ZoomInLeft","ZoomInRight","ZoomInRotate","ZoomInUp","ZoomOut","ZoomOutDown","ZoomOutEasyDown","ZoomOutEasyUp","ZoomOutLeft","ZoomOutRight","ZoomOutRotate","ZoomOutUp"]),or=new Set(["Layout","LinearTransition","SequencedTransition","FadingTransition","JumpingTransition","CurvedTransition","EntryExitTransition"]),xe=new Set([...ir,...or]),sr=new Set(["build","duration","delay","getDuration","randomDelay","getDelay","getDelayFunction"]),ar=new Set(["easing","rotate","springify","damping","mass","stiffness","overshootClamping","restDisplacementThreshold","restSpeedThreshold","withInitialValues","getAnimationAndConfig"]),lr=new Set(["easingX","easingY","easingWidth","easingHeight","entering","exiting","reverse"]),cr=new Set([...sr,...ar,...lr]),ur=new Set(["withCallback"]);function dr(e){return(0,S.isCallExpression)(e.parent)&&(0,S.isExpression)(e.parent.callee)&&fr(e.parent.callee)}J.isLayoutAnimationCallback=dr;function fr(e){return(0,S.isMemberExpression)(e)&&(0,S.isIdentifier)(e.property)&&ur.has(e.property.name)&&Ce(e.object)}function Ce(e){return(0,S.isIdentifier)(e)&&xe.has(e.name)?!0:!!((0,S.isNewExpression)(e)&&(0,S.isIdentifier)(e.callee)&&xe.has(e.callee.name)||(0,S.isCallExpression)(e)&&(0,S.isMemberExpression)(e.callee)&&(0,S.isIdentifier)(e.callee.property)&&cr.has(e.callee.property.name)&&Ce(e.callee.object))}});var we=p(Y=>{"use strict";Object.defineProperty(Y,"__esModule",{value:!0});Y.findReferencedWorklet=void 0;var q=E();function pr(e,t,r){let n=e.node.name,s=e.scope.getBinding(n);return s?t&&s.path.isFunctionDeclaration()?s.path:s.constant?br(s,t,r):mr(s,t,r):void 0}Y.findReferencedWorklet=pr;function br(e,t,r){let n=e.path;if(!n.isVariableDeclarator())return;let i=n.get("init");if(t&&(0,q.isWorkletizableFunctionPath)(i)||r&&(0,q.isWorkletizableObjectPath)(i))return i}function mr(e,t,r){let n=e.constantViolations.reverse().find(s=>s.isAssignmentExpression()&&(t&&(0,q.isWorkletizableFunctionPath)(s.get("right"))||r&&(0,q.isWorkletizableObjectPath)(s.get("right"))));if(!n||!n.isAssignmentExpression())return;let i=n.get("right");if(t&&(0,q.isWorkletizableFunctionPath)(i)||r&&(0,q.isWorkletizableObjectPath)(i))return i}});var De=p(K=>{"use strict";Object.defineProperty(K,"__esModule",{value:!0});K.processWorkletizableObject=void 0;var yr=E(),je=X();function kr(e,t){let r=e.get("properties");for(let n of r)if(n.isObjectMethod())(0,je.processWorklet)(n,t);else if(n.isObjectProperty()){let i=n.get("value");(0,yr.isWorkletizableFunctionPath)(i)&&(0,je.processWorklet)(i,t)}else throw new Error(`[Reanimated] '${n.type}' as to-be workletized argument is not supported for object hooks.`)}K.processWorkletizableObject=kr});var Pe=p(L=>{"use strict";Object.defineProperty(L,"__esModule",{value:!0});L.processCalleesAutoworkletizableCallbacks=L.processIfAutoworkletizableCallback=void 0;var gr=require("@babel/types"),Q=E(),Me=X(),_r=We(),Or=Fe(),vr=we(),hr=De(),Re=new Set(["useAnimatedGestureHandler","useAnimatedScrollHandler"]),Ae=new Set(["useFrameCallback","useAnimatedStyle","useAnimatedProps","createAnimatedPropAdapter","useDerivedValue","useAnimatedScrollHandler","useAnimatedReaction","useWorkletCallback","withTiming","withSpring","withDecay","withRepeat","runOnUI","executeOnUIRuntimeSync"]),Er=new Map([["useAnimatedGestureHandler",[0]],["useFrameCallback",[0]],["useAnimatedStyle",[0]],["useAnimatedProps",[0]],["createAnimatedPropAdapter",[0]],["useDerivedValue",[0]],["useAnimatedScrollHandler",[0]],["useAnimatedReaction",[0,1]],["useWorkletCallback",[0]],["withTiming",[2]],["withSpring",[2]],["withDecay",[1]],["withRepeat",[3]],["runOnUI",[0]],["executeOnUIRuntimeSync",[0]]]);function Ir(e,t){return(0,_r.isGestureHandlerEventCallback)(e)||(0,Or.isLayoutAnimationCallback)(e)?((0,Me.processWorklet)(e,t),!0):!1}L.processIfAutoworkletizableCallback=Ir;function Sr(e,t){let r=(0,gr.isSequenceExpression)(e.node.callee)?e.node.callee.expressions[e.node.callee.expressions.length-1]:e.node.callee,n="name"in r?r.name:"property"in r&&"name"in r.property?r.property.name:void 0;if(n!==void 0&&(Ae.has(n)||Re.has(n))){let i=Ae.has(n),s=Re.has(n),l=Er.get(n),u=e.get("arguments").filter((f,k)=>l.includes(k));Wr(u,t,i,s)}}L.processCalleesAutoworkletizableCallbacks=Sr;function Wr(e,t,r,n){e.forEach(i=>{let s=xr(i,r,n);s&&((0,Q.isWorkletizableFunctionPath)(s)?(0,Me.processWorklet)(s,t):(0,Q.isWorkletizableObjectPath)(s)&&(0,hr.processWorkletizableObject)(s,t))})}function xr(e,t,r){if(t&&(0,Q.isWorkletizableFunctionPath)(e)||r&&(0,Q.isWorkletizableObjectPath)(e))return e;if(e.isReferencedIdentifier()&&e.isIdentifier())return(0,vr.findReferencedWorklet)(e,t,r)}});var ce=p(h=>{"use strict";Object.defineProperty(h,"__esModule",{value:!0});h.isContextObject=h.processIfWorkletContextObject=h.contextObjectMarker=void 0;var v=require("@babel/types");h.contextObjectMarker="__workletContextObject";function Cr(e,t){return qe(e.node)?(wr(e.node),Fr(e.node),!0):!1}h.processIfWorkletContextObject=Cr;function qe(e){return e.properties.some(t=>(0,v.isObjectProperty)(t)&&(0,v.isIdentifier)(t.key)&&t.key.name===h.contextObjectMarker)}h.isContextObject=qe;function Fr(e){let t=(0,v.functionExpression)(null,[],(0,v.blockStatement)([(0,v.returnStatement)((0,v.cloneNode)(e))],[(0,v.directive)((0,v.directiveLiteral)("worklet"))]));e.properties.push((0,v.objectProperty)((0,v.identifier)(`${h.contextObjectMarker}Factory`),t))}function wr(e){e.properties=e.properties.filter(t=>!((0,v.isObjectProperty)(t)&&(0,v.isIdentifier)(t.key)&&t.key.name===h.contextObjectMarker))}});var Ue=p(z=>{"use strict";Object.defineProperty(z,"__esModule",{value:!0});z.isImplicitContextObject=z.processIfWorkletFile=void 0;var b=require("@babel/types"),Le=E(),ze=ce();function jr(e,t){return e.node.directives.some(r=>r.value.value==="worklet")?(e.node.directives=e.node.directives.filter(r=>r.value.value!=="worklet"),Dr(e),!0):!1}z.processIfWorkletFile=jr;function Dr(e){let t=e.get("body");Nr(e.node),t.forEach(r=>{let n=Rr(r);ue(n)})}function Rr(e){return e.isExportNamedDeclaration()||e.isExportDefaultDeclaration()?e.get("declaration"):e}function ue(e){(0,Le.isWorkletizableFunctionPath)(e)?(e.isArrowFunctionExpression()&&Pr(e.node),Ne(e.node.body)):(0,Le.isWorkletizableObjectPath)(e)?Te(e)?qr(e.node):Mr(e):e.isVariableDeclaration()?Ar(e):e.isClassDeclaration()&&zr(e.node.body)}function Ar(e){e.get("declarations").forEach(r=>{let n=r.get("init");n.isExpression()&&ue(n)})}function Mr(e){e.get("properties").forEach(r=>{if(r.isObjectMethod())Ne(r.node.body);else if(r.isObjectProperty()){let n=r.get("value");ue(n)}})}function Pr(e){(0,b.isBlockStatement)(e.body)||(e.body=(0,b.blockStatement)([(0,b.returnStatement)(e.body)]))}function Ne(e){e.directives.some(t=>t.value.value==="worklet")||e.directives.push((0,b.directive)((0,b.directiveLiteral)("worklet")))}function qr(e){e.properties.some(t=>(0,b.isObjectProperty)(t)&&(0,b.isIdentifier)(t.key)&&t.key.name===ze.contextObjectMarker)||e.properties.push((0,b.objectProperty)((0,b.identifier)(`${ze.contextObjectMarker}`),(0,b.booleanLiteral)(!0)))}function Te(e){return e.get("properties").some(r=>r.isObjectMethod()?Lr(r):!1)}z.isImplicitContextObject=Te;function Lr(e){let t=!1;return e.traverse({ThisExpression(r){t=!0,r.stop()}}),t}function zr(e){e.body.push((0,b.classProperty)((0,b.identifier)("__workletClass"),(0,b.booleanLiteral)(!0)))}function Nr(e){let t=e.body,r=t.length,n=0;for(;n<r;){let i=t[n];if(!Tr(i)){n++;continue}let s=t.splice(n,1);t.push(...s),r--}}function Tr(e){return(0,b.isExpressionStatement)(e)&&(0,b.isAssignmentExpression)(e.expression)&&(0,b.isMemberExpression)(e.expression.left)&&(0,b.isIdentifier)(e.expression.left.object)&&e.expression.left.object.name==="exports"}});var Be=p(ee=>{"use strict";Object.defineProperty(ee,"__esModule",{value:!0});ee.processInlineStylesWarning=void 0;var d=require("@babel/types"),Ur=D(),de=require("assert");function Br(e){return(0,d.callExpression)((0,d.arrowFunctionExpression)([],(0,d.blockStatement)([(0,d.expressionStatement)((0,d.callExpression)((0,d.memberExpression)((0,d.identifier)("console"),(0,d.identifier)("warn")),[(0,d.callExpression)((0,d.memberExpression)((0,d.callExpression)((0,d.identifier)("require"),[(0,d.stringLiteral)("react-native-reanimated")]),(0,d.identifier)("getUseOfValueInStyleWarning")),[])])),(0,d.returnStatement)(e.node)])),[])}function Gr(e){e.isMemberExpression()&&(0,d.isIdentifier)(e.node.property)&&e.node.property.name==="value"&&e.replaceWith(Br(e))}function Hr(e){if((0,d.isArrayExpression)(e.node)){let t=e.get("elements");(0,de.strict)(Array.isArray(t),"[Reanimated] `elements` should be an array.");for(let r of t)r.isObjectExpression()&&fe(r)}}function fe(e){let t=e.get("properties");for(let r of t)if(r.isObjectProperty()){let n=r.get("value");(0,d.isIdentifier)(r.node.key)&&r.node.key.name==="transform"?Hr(n):Gr(n)}}function Zr(e,t){if((0,Ur.isRelease)()||t.opts.disableInlineStylesWarning||e.node.name.name!=="style"||!(0,d.isJSXExpressionContainer)(e.node.value))return;let r=e.get("value").get("expression");if((0,de.strict)(!Array.isArray(r),"[Reanimated] `expression` should not be an array."),r.isArrayExpression()){let n=r.get("elements");(0,de.strict)(Array.isArray(n),"[Reanimated] `elements` should be an array.");for(let i of n)i.isObjectExpression()&&fe(i)}else r.isObjectExpression()&&fe(r)}ee.processInlineStylesWarning=Zr});var He=p(te=>{"use strict";Object.defineProperty(te,"__esModule",{value:!0});te.substituteWebCallExpression=void 0;var Ge=require("@babel/types");function Vr(e){let t=e.node.callee;if((0,Ge.isIdentifier)(t)){let r=t.name;(r==="isWeb"||r==="shouldBeUseWeb")&&e.replaceWith((0,Ge.booleanLiteral)(!0))}}te.substituteWebCallExpression=Vr});var $e=p(N=>{"use strict";var Ze=N&&N.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(N,"__esModule",{value:!0});N.processIfWorkletClass=void 0;var Xr=require("@babel/core"),$r=Ze(require("@babel/generator")),Jr=Ze(require("@babel/traverse")),a=require("@babel/types"),re=require("assert"),Yr=E(),Kr=D(),Ve="__workletClass";function Qr(e,t){return!e.node.id||!sn(e.node.body)?!1:(an(e.node.body),en(e,t),!0)}N.processIfWorkletClass=Qr;function en(e,t){(0,re.strict)(e.node.id);let r=e.node.id.name,n=tn(e.node,t);ln(n),rn(n.program.body),nn(n.program.body,r),n.program.body.push((0,a.returnStatement)((0,a.identifier)(r)));let i=(0,a.functionExpression)(null,[],(0,a.blockStatement)([...n.program.body])),s=(0,a.callExpression)(i,[]);(0,Kr.replaceWithFactoryCall)(e,r,s)}function tn(e,t){let r=(0,$r.default)(e).code,n=(0,Xr.transformSync)(r,{plugins:["@babel/plugin-transform-class-properties","@babel/plugin-transform-classes","@babel/plugin-transform-unicode-regex"],filename:t.file.opts.filename,ast:!0,babelrc:!1,configFile:!1});return(0,re.strict)(n&&n.ast),n.ast}function rn(e){e.forEach(t=>{if((0,a.isFunctionDeclaration)(t)){let r=(0,a.directive)((0,a.directiveLiteral)("worklet"));t.body.directives.push(r)}})}function nn(e,t){let r=t+Yr.workletClassFactorySuffix,n=on(e,t),s=e[n].declarations[0].init,l=(0,a.functionDeclaration)((0,a.identifier)(r),[],(0,a.blockStatement)([(0,a.variableDeclaration)("const",[(0,a.variableDeclarator)((0,a.identifier)(t),s)]),(0,a.expressionStatement)((0,a.assignmentExpression)("=",(0,a.memberExpression)((0,a.identifier)(t),(0,a.identifier)(r)),(0,a.identifier)(r))),(0,a.returnStatement)((0,a.identifier)(t))],[(0,a.directive)((0,a.directiveLiteral)("worklet"))])),u=(0,a.variableDeclaration)("const",[(0,a.variableDeclarator)((0,a.identifier)(t),(0,a.callExpression)((0,a.identifier)(r),[]))]);e.splice(n,1,l,u)}function on(e,t){let r=e.findIndex(n=>(0,a.isVariableDeclaration)(n)&&n.declarations.some(i=>(0,a.isIdentifier)(i.id)&&i.id.name===t));return(0,re.strict)(r>=0),r}function sn(e){return e.body.some(t=>(0,a.isClassProperty)(t)&&(0,a.isIdentifier)(t.key)&&t.key.name===Ve)}function an(e){e.body=e.body.filter(t=>!(0,a.isClassProperty)(t)||!(0,a.isIdentifier)(t.key)||t.key.name!==Ve)}function ln(e){let t=cn(e),r=un(t),n=t.map(u=>u.index),i=r.map(u=>u.index),s=e.program.body,l=[...s];for(let u=0;u<t.length;u++){let f=i[u],k=n[u],_=l[f];s[k]=_}}function cn(e){let t=[];return(0,Jr.default)(e,{Program:{enter:r=>{r.get("body").forEach((i,s)=>{var l;let u=i.getBindingIdentifiers();if(!i.isFunctionDeclaration()||!(!((l=i.node.id)===null||l===void 0)&&l.name))return;let f={name:i.node.id.name,index:s,dependencies:new Set};t.push(f),i.traverse({Identifier(k){dn(k,u,i)&&f.dependencies.add(k.node.name)}})})}}}),t}function un(e){let t=[],r=new Set;for(let n of e)Xe(n,e,t,r);return t}function Xe(e,t,r,n){if(n.has(e.name))throw new Error("Cycle detected. This should never happen.");if(!r.find(i=>i.name===e.name)){n.add(e.name);for(let i of e.dependencies)if(!r.find(s=>s.name===i)){let s=t.find(l=>l.name===i);(0,re.strict)(s),Xe(s,t,r,n)}r.push(e),n.delete(e.name)}}function dn(e,t,r){return e.isReferencedIdentifier()&&!(e.node.name in t)&&!r.scope.hasOwnBinding(e.node.name)&&r.scope.hasReference(e.node.name)}});Object.defineProperty(exports,"__esModule",{value:!0});var Je=Pe(),fn=ce(),pn=Ue(),bn=Z(),mn=Be(),yn=E(),kn=D(),gn=He(),_n=X(),On=$e();module.exports=function(){function e(t){try{t()}catch(r){throw new Error(`[Reanimated] Babel plugin exception: ${r}`)}}return{pre(t){e(()=>{t.workletNumber=1,(0,bn.initializeGlobals)(),kn.addCustomGlobals.call(this)})},visitor:{CallExpression:{enter(t,r){e(()=>{(0,Je.processCalleesAutoworkletizableCallbacks)(t,r),r.opts.substituteWebPlatformChecks&&(0,gn.substituteWebCallExpression)(t)})}},[yn.WorkletizableFunction]:{enter(t,r){e(()=>{(0,_n.processIfWithWorkletDirective)(t,r)||(0,Je.processIfAutoworkletizableCallback)(t,r)})}},ObjectExpression:{enter(t,r){e(()=>{(0,fn.processIfWorkletContextObject)(t,r)})}},ClassDeclaration:{enter(t,r){e(()=>{(0,On.processIfWorkletClass)(t,r)})}},Program:{enter(t,r){e(()=>{r.workletNumber=1,(0,pn.processIfWorkletFile)(t,r)})}},JSXAttribute:{enter(t,r){e(()=>(0,mn.processInlineStylesWarning)(t,r))}}}}};
//# sourceMappingURL=index.js.map
