(()=>{"use strict";var e=function(e,t,n,o){return new(n||(n=Promise))((function(s,i){function a(e){try{l(o.next(e))}catch(e){i(e)}}function r(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,r)}l((o=o.apply(e,t||[])).next())}))};class t{constructor(){this.modules=new Map}loadModule(e){this.modules.set(e.getCommand(),e)}matchCommandToModule(e){return this.modules.get(e)||null}moduleCount(){return this.modules.size}runSoloModule(){this.modules.values().next().value.run()}getSoloModule(){return this.modules.values().next().value}}const n=e=>"RECTANGLE"===e.type||"ELLIPSE"===e.type||"POLYGON"===e.type||"STAR"===e.type||"VECTOR"===e.type||"BOOLEAN_OPERATION"===e.type,o=!1,s=3,i="#fa0",a="#4caf50";function r(e,t){o&&(t?console.log(`%c${e}`,`color: ${t}`):console.log(e))}function l(e){return Math.round(e*Math.pow(10,s))/Math.pow(10,s)}function c(e){return e*(180/Math.PI)}function d(e){return e*(Math.PI/180)}function h(e){let t=0;if(void 0===e.adjacentSide||isNaN(e.adjacentSide)||(++t,e.adjacentSide=Math.abs(e.adjacentSide)),void 0===e.oppositeSide||isNaN(e.oppositeSide)||(++t,e.oppositeSide=Math.abs(e.oppositeSide)),void 0===e.angle||isNaN(e.angle)||(++t,e.angle=Math.abs(e.angle)),t<2)console.log("%cNot enough values to calculate the hypotenuse of the triangle.","color: #f30;");else{if("number"==typeof e.adjacentSide&&"number"==typeof e.oppositeSide)return Math.sqrt(e.adjacentSide*e.adjacentSide+e.oppositeSide*e.oppositeSide)||0;if("number"==typeof e.oppositeSide&&"number"==typeof e.angle)return Math.abs(e.oppositeSide/Math.sin(d(e.angle)));if("number"==typeof e.adjacentSide&&"number"==typeof e.angle)return Math.abs(e.adjacentSide/Math.cos(d(e.angle)))}return null}function u(e){let t=0;if(void 0===e.hypotenuse||isNaN(e.hypotenuse)||(++t,e.hypotenuse=Math.abs(e.hypotenuse)),void 0===e.adjacentSide||isNaN(e.adjacentSide)||(++t,e.adjacentSide=Math.abs(e.adjacentSide)),void 0===e.angle||isNaN(e.angle)||(++t,e.angle=Math.abs(e.angle)),t<2)console.log("%cNot enough values to calculate the opoosite side of the triangle.","color: #f30;");else{if(void 0!==e.hypotenuse&&void 0!==e.adjacentSide)return Math.sqrt(e.hypotenuse*e.hypotenuse+e.adjacentSide*e.adjacentSide);if(void 0!==e.hypotenuse&&void 0!==e.angle)return Math.abs(Math.sin(d(e.angle))*e.hypotenuse);if(void 0!==e.adjacentSide&&void 0!==e.angle)return Math.abs(Math.tan(d(e.angle))*e.adjacentSide)}return null}const g=3;function m(e){return Math.round(e*Math.pow(10,g))/Math.pow(10,g)}function f(e,t){return{x:t.x+(t.x-e.x),y:t.y+(t.y-e.y)}}function p(e,t,n){return"before"===n?{x:e.x-t.x,y:e.y-t.y}:{x:e.x+t.x,y:e.y+t.y}}function y(e,t){const n=h({adjacentSide:Math.abs(e.x-t.x),oppositeSide:Math.abs(e.y-t.y)});return null!=n?m(n):NaN}function x(e,t,n,o){return 0===n.length?N(e,t,o):1===n.length?C(e,n[0],t,o):2===n.length?b(e,n[0],n[1],t,o):(console.error('More than 2 handles received for getPointOnPath. Parameter "handles" should not contain more than 2 Vectors.'),null)}function N(e,t,n){const o=e.x+n*(t.x-e.x),s=e.y+n*(t.y-e.y);return{x:m(o),y:m(s)}}function C(e,t,n,o){return{x:(1-o)*(1-o)*e.x+2*(1-o)*o*t.x+o*o*n.x,y:(1-o)*(1-o)*e.y+2*(1-o)*o*t.y+o*o*n.y}}function b(e,t,n,o,s){return{x:(1-s)*(1-s)*(1-s)*e.x+3*(1-s)*(1-s)*s*t.x+3*(1-s)*s*s*n.x+s*s*s*o.x,y:(1-s)*(1-s)*(1-s)*e.y+3*(1-s)*(1-s)*s*t.y+3*(1-s)*s*s*n.y+s*s*s*o.y}}function S(e,t){const n=0-e.x,o=0-e.y,s={x:t.x+n,y:t.y+o};return m(c(Math.atan2(-s.y,s.x)))}function v(e){const t=Math.atan2(e.line1.start.y-e.line1.end.y,e.line1.start.x-e.line1.end.x),n=Math.atan2(e.line2.end.y-e.line2.start.y,e.line2.end.x-e.line2.start.x);return Math.abs(c(n-t))}function P(e,t){const n=e*(Math.PI/180),o=t*Math.cos(n),s=t*Math.sin(n);return{x:m(o),y:m(-s)}}function M(e,t){let n="clockwise"===t?e-90:e+90;return n>360?n-=360:n<0&&(n+=360),m(n)}function w(e,t,n,o){if(0===n)return t;{const s=P(M(e,o),n);return{x:t.x+s.x,y:t.y+s.y}}}function D(e,t,n){r("Starting distortedges-startingpoint.create()",i);const o=e.getLastCommandOnPath(t,!1),s=e.getNextCommand(t);if(s){const i=e.getPathSegmentByCommand(o),c=e.settings.distanceApart?e.settings.distanceApart:i.increments[i.increments.length-1]*i.pathLength,d=x(o.origin,o.coords,o.handles,l((i.pathLength-c)/i.pathLength)),h=e.getPathSegmentByCommand(s),u=e.settings.distanceApart?e.settings.distanceApart:h.increments[0]*i.pathLength,g=x(s.origin,s.coords,s.handles,l(u/h.pathLength));if(d&&g){let o,s={coords:{x:NaN,y:NaN},handleAngle:NaN},i=0;if(e.settings.keepWithinOriginalSize||(i=n.variableDistortionDistance?Math.random()*n.maximumDistortionDistance:n.maximumDistortionDistance),0===i)o=t.origin;else{const e=P(M(S(d,g),"clockwise"===t.winding?"counter-clockwise":"clockwise"),i);o={x:t.origin.x+e.x,y:t.origin.y+e.y}}let l=`M ${o.x} ${o.y}`;const c=S(d,g);e.getPathSegmentByCommand(t).subpoints=[{coords:o,slope:c,segmentDistance:0}];const h=e.getLastCommandOnPath(t);return e.getPathSegmentByCommand(h).subpoints=[{coords:o,slope:-c,segmentDistance:0}],s.coords=o,s.handleAngle=c,r("Completed distortedges-startingpoint.create(). Result type: "+typeof l,a),{path:l,previousSubpoint:s}}}return r("Completed distortedges-startingpoint.create(). Result type: null","#f30"),null}function $(e,t,n,o,s){r("Starting distortedges-uniformdistance.create()",i);let c="",d=e.getPathSegmentByCommand(t),h={half:{offset:NaN,rotation:"counter-clockwise",coords:{x:NaN,y:NaN},slope1:NaN,slope2:NaN,handleDistance1:{x:NaN,y:NaN},handleDistance2:{x:NaN,y:NaN},handle1:{x:NaN,y:NaN},handle2:{x:NaN,y:NaN}},full:{offset:NaN,rotation:"counter-clockwise",coords:{x:NaN,y:NaN},slope1:NaN,slope2:NaN,handleDistance1:{x:NaN,y:NaN},handleDistance2:{x:NaN,y:NaN},handle1:{x:NaN,y:NaN},handle2:{x:NaN,y:NaN}}};const g="clockwise"===t.winding?"clockwise":"counter-clockwise",m="clockwise"===t.winding?"counter-clockwise":"clockwise",f=e.getPreviousCommand(t),x=e.getNextCommand(t),C=d.subSegments-1;for(let i=0;i<d.subSegments;++i){const a=0!==n.handleDistancePeak||0!==n.handleDistanceTrough,r="Z"===(null==x?void 0:x.type)&&i===C,b=!n.forceDistortion&&1===d.subSegments;if(n.variableDistortionDistance)if(e.settings.keepWithinOriginalSize){const e=b?0:2*n.maximumDistortionDistance;h.half.offset=Math.random()*e,h.full.offset=Math.random()*e,h.half.rotation=g,h.full.rotation=g}else{const e=b?0:n.maximumDistortionDistance;h.half.offset=Math.random()*e,h.full.offset=Math.random()*e;let t=Math.ceil(2*Math.random());h.half.rotation=1===t?g:m,t=Math.ceil(2*Math.random()),h.half.rotation=1===t?g:m}else e.settings.keepWithinOriginalSize?(h.half.offset=b?0:n.maximumDistortionDistance,h.full.offset=0):(h.half.offset=0,h.full.offset=b?0:n.maximumDistortionDistance),h.half.rotation=g,h.full.rotation=m;const M=d.subpoints[i],D=0===i?t.origin:d.subpoints[i-1].coords,$=N(D,M.coords,.5);let k=S(D,M.coords);if("L"===t.type&&(0===i?k+=22.5:i===C&&(k-=22.5)),h.half.coords=w(k,$,h.half.offset,h.half.rotation),e.settings.keepWithinOriginalSize)h.full.coords=M.coords;else if(r){const n=e.getFirstCommandOnPath(t),o=e.getPathSegmentByCommand(n);h.full.coords=o.subpoints[0].coords}else h.full.coords=w(M.slope,M.coords,h.full.offset,h.full.rotation);if(a){if(f&&0===i){const t=e.getPathSegmentByCommand(f),n=t.subpoints.length-1;h.half.slope1=t.subpoints[n].slope}else h.half.slope1=s.handleAngle;h.half.slope2=S(D,M.coords),h.full.slope1=h.half.slope2,h.full.slope2=M.slope;const t=n.handleDistancePeak,o=n.handleDistanceTrough;let a=v({line1:{start:s.coords,end:h.half.coords},line2:{start:h.half.coords,end:h.full.coords}})/2;a>90&&(a=180-a);const r=u({hypotenuse:y(s.coords,h.half.coords),angle:a});let l=null!=r?r:.5*M.segmentDistance;l=Number(l.toFixed(2));const c=u({hypotenuse:y(h.half.coords,h.full.coords),angle:a});let d=null!=c?c:.5*M.segmentDistance;d=Number(d.toFixed(2)),h.half.handleDistance1=P(h.half.slope1,l*t),h.half.handle1=p(s.coords,h.half.handleDistance1,"after"),h.half.handleDistance2=P(h.half.slope2,l*o),h.half.handle2=p(h.half.coords,h.half.handleDistance2,"before"),h.full.handleDistance1=P(h.full.slope1,d*o),h.full.handle1=p(h.half.coords,h.full.handleDistance1,"after"),h.full.handleDistance2=P(h.full.slope2,d*t),h.full.handle2=p(h.full.coords,h.full.handleDistance2,"before")}o.discern(h.half.coords),o.discern(h.full.coords),s.coords=h.full.coords,a&&(s.handleAngle=h.full.slope2),c=a?[c,"C",l(h.half.handle1.x),l(h.half.handle1.y),l(h.half.handle2.x),l(h.half.handle2.y),l(h.half.coords.x),l(h.half.coords.y),"C",l(h.full.handle1.x),l(h.full.handle1.y),l(h.full.handle2.x),l(h.full.handle2.y),l(h.full.coords.x),l(h.full.coords.y)].join(" "):[c,"L",l(h.half.coords.x),l(h.half.coords.y),"L",l(h.full.coords.x),l(h.full.coords.y)].join(" ")}return r("Completed distortedges-variabledistance.distort(). Result type: "+typeof c,a),{path:c.trim(),previousSubpoint:s}}const k="color: #9747FF;",A="color: #C191FF;",O="color: #f30;";class L{constructor(e){var t,n,o;this.commands=[],this.nsew=[0,0,0,0];const s={firstCoords:{x:0,y:0},previousCoords:{x:0,y:0},currentCoords:{x:0,y:0},area:0,vectorCommands:[]};let i=e.split(" ");for(let e of i)if(/[MLQCZ]/i.test(e)){let t={type:e,handles:[],coords:{x:NaN,y:NaN},origin:{x:NaN,y:NaN},winding:"clockwise"};if(this.commands.push(t),"Z"===e){const e=this.getPreviousCommand(t),n=this.getFirstCommandOnPath(t);if(e&&(e.coords.x!==n.coords.x||e.coords.y!==n.coords.y)){let n=this.getFirstCommandOnPath(t);this.commands.splice(this.commands.length-1,0,{type:"L",handles:[],coords:n.coords,origin:e.coords,winding:s.area>0?"counter-clockwise":"clockwise"})}}if("Z"!==e)s.vectorCommands.push(t),s.previousCoords=Object.assign({},s.currentCoords);else{s.area+=this._getWindingArea(s.currentCoords,s.firstCoords);const e=s.area>0?"counter-clockwise":"clockwise";for(let t=0;t<s.vectorCommands.length;++t){let n=s.vectorCommands[t];if("Z"===n.type){const t=this.getPreviousCommand(n);n.winding=t?t.winding:e}else n.winding=e}}}else{const i=this.commands[this.commands.length-1],a=Number(e);switch(i.type){case"M":case"L":if(isNaN(i.coords.x))i.coords.x=a,this._setEW(a),"M"===i.type&&(s.firstCoords.x=a),s.currentCoords.x=a;else{i.coords.y=a;const e=null!==(t=this.getPreviousCommand(i))&&void 0!==t?t:{coords:{x:0,y:0}};i.origin="M"===i.type?i.coords:e.coords,this._setNS(a),"M"===i.type&&(s.firstCoords.y=a),s.currentCoords.y=a,"M"!==i.type&&(s.area+=this._getWindingArea(s.previousCoords,s.currentCoords))}break;case"C":if(0===i.handles.length)i.handles.push({x:a,y:NaN});else if(1===i.handles.length&&isNaN(i.handles[0].y))i.handles[0].y=a;else if(1===i.handles.length)i.handles.push({x:a,y:NaN});else if(2===i.handles.length&&isNaN(i.handles[1].y))i.handles[1].y=a;else if(isNaN(i.coords.x))i.coords.x=a,this._setEW(a),s.currentCoords.x=a;else{i.coords.y=a;const e=null!==(n=this.getPreviousCommand(i))&&void 0!==n?n:{coords:{x:0,y:0}};i.origin=e.coords,this._setNS(a),s.currentCoords.y=a,s.area+=this._getWindingArea(s.previousCoords,s.currentCoords)}break;case"Q":if(0===i.handles.length)i.handles.push({x:a,y:NaN});else if(1===i.handles.length)i.handles[0].y=a;else if(isNaN(i.coords.x))i.coords.x=a,this._setEW(a),s.currentCoords.x=a;else{i.coords.y=a;const e=null!==(o=this.getPreviousCommand(i))&&void 0!==o?o:{coords:{x:0,y:0}};i.origin=e.coords,this._setNS(a),s.currentCoords.y=a,s.area+=this._getWindingArea(s.previousCoords,s.currentCoords)}}}}_setNS(e){e<this.nsew[0]?this.nsew[0]=e:e>this.nsew[1]&&(this.nsew[1]=e)}_setEW(e){e<this.nsew[3]?this.nsew[3]=e:e>this.nsew[2]&&(this.nsew[2]=e)}_getWindingArea(e,t){return(t.x-e.x)*(t.y+t.y)}size(){return this.commands.length}getCommandIndex(e){return this.commands.indexOf(e)}getCommand(e){return this.commands[e]}getFirstCommandOnPath(e,t){t=null==t||t;const n=this.getCommandIndex(e);let o=e;if(n>0){for(let e=n-1;e>=0;--e)if(0===e)o=this.getCommand(0);else if("Z"===this.getCommand(e).type){let n=e+1;if(t)o=this.getCommand(n);else{for(;"M"===this.getCommand(n).type;)++n;o=this.getCommand(n)}break}}else 0===n?o=e:console.error("Vector command not found in model.");return o}getLastCommandOnPath(e,t){t=null==t||t;const n=this.size(),o=this.getCommandIndex(e);let s=e;if(o>=0){for(let e=o;e<n;++e)if(s=this.getCommand(e),"Z"===this.getCommand(e).type){t||(s=this.getCommand(e-1));break}}else console.error("Vector command not found in model.");return s}getPreviousCommand(e){const t=this.commands.indexOf(e);return 0===t?(console.log("%cLast command in library retrieved as current command is the first.",A),this.commands[this.commands.length-1]):t>0?this.commands[t-1]:(console.log(`%cNo such command found. Command requested: ${JSON.stringify(e)}`,O),null)}getNextCommand(e){const t=this.commands.indexOf(e);return t===this.size()-1?(console.log("%cFirst command of library retrieved as current command is the last.",A),this.commands[0]):t>-1?this.commands[t+1]:(console.log(`%cNo such command found. Command requested: ${JSON.stringify(e)}`,O),null)}saveCoords(e,t){const n=this.getCommandIndex(e);this.getCommand(n).coords={x:t.x,y:t.y}}saveHandle(e,t){const n=this.getCommandIndex(e);this.getCommand(n).handles=t}getBoundingBox(){return{width:this.nsew[2]-this.nsew[3],height:this.nsew[1]-this.nsew[0]}}}class _ extends L{constructor(e,t){super(e),this.pathSegments=[],this.perimeter=0,this.settings=t;for(let e of this.commands){const n=this._getPathSegment(e,t);n&&this.pathSegments.push(n),this._generateSubpoints(e,this.getLastPathSegment()),this.perimeter+=this.getLastPathSegment().pathLength}}_getPathSegment(e,t){var n,o;if("M"===e.type||"Z"===e.type)return{pathLength:0,subSegments:0,increments:[],subpoints:[]};if("L"===e.type||"Q"===e.type||"C"===e.type){let s=this.getPreviousCommand(e),i={pathLength:0,subSegments:0,increments:[],subpoints:[]};if(s){if("Z"===s.type&&(s=this.getFirstCommandOnPath(s)),"L"===e.type?i.pathLength=y(s.coords,e.coords):"Q"===e.type?i.pathLength=function(e,t,n){let o=0;for(let s=1;s<30;++s){const i=C(e,t,n,s/30),a=C(e,t,n,(s+1)/30),r=h({adjacentSide:Math.abs(i.x-a.x),oppositeSide:Math.abs(i.y-a.y)});if("number"!=typeof r){console.error("Calculated segment length for quadratic path length returned as null.");break}o+=m(r)}return m(o)}(s.coords,e.handles[0],e.coords):"C"===e.type&&(i.pathLength=function(e,t,n,o){let s=0;for(let i=1;i<30;++i){const a=b(e,t,n,o,i/30),r=b(e,t,n,o,(i+1)/30),l=h({adjacentSide:Math.abs(a.x-r.x),oppositeSide:Math.abs(a.y-r.y)});if("number"!=typeof l){console.error("Calculated segment length for cubic path length returned as null.");break}s+=m(l)}return m(s)}(s.coords,e.handles[0],e.handles[1],e.coords)),t.variableDistanceApart){const e=this._getVariableDistances(i.pathLength,null!==(n=t.minDistanceApart)&&void 0!==n?n:0,null!==(o=t.maxDistanceApart)&&void 0!==o?o:0);i.subSegments=e.length,i.increments=[...e]}else{const n=0!==t.distanceApart&&t.distanceApart?t.distanceApart:.1*i.pathLength,o=this._getUniformDistances(e,i.pathLength,n,t.keepWithinOriginalSize);i.subSegments=o.length,i.increments=[...o]}return i}console.error("Previous command could not be retreived as Vector Command could not be found.")}return null}_generateSubpoints(e,t){let n=0;if("M"===e.type)n=this.getCommandIndex(e),this.getPathSegmentByCommand(e).subpoints.push({coords:e.coords,slope:0,segmentDistance:0});else if("Z"!==e.type){let n=x(e.origin,e.coords,e.handles,t.increments[0]);if(null===n)return void console.error("Current subpoint coords in the Extended Vector Node Model cannot be determined.");{let o=e.origin,s=t.increments[0],i={x:NaN,y:NaN};for(let a=0;a<t.subSegments;++a){const r=t.increments[a]*t.pathLength,l=this.getPreviousCommand(e);if(0===a&&l&&"M"!==l.type&&"Z"!==l.type){const e=this.getPathSegmentByCommand(l);let t=e.subpoints[e.subpoints.length-1];const o=x(l.origin,l.coords,l.handles,1-e.increments[e.increments.length-1]),s=n;o?t.slope=S(o,s):console.error("Starting point of slope cannot be determined.")}a!==t.subSegments-1?(s+=t.increments[a+1],i=x(e.origin,e.coords,e.handles,s),this.getPathSegmentByCommand(e).subpoints.push({coords:n,slope:S(o,i),segmentDistance:r})):this.getPathSegmentByCommand(e).subpoints.push({coords:n,slope:0,segmentDistance:r}),o=n,n=i}}}else{this.getPathSegmentByCommand(e).subpoints.push({coords:{x:NaN,y:NaN},slope:0,segmentDistance:0});const t=this.getPreviousCommand(e);if(t){const e=this.getPathSegmentByCommand(t),o=1-e.increments[e.increments.length-1];let s=e.subpoints[e.subpoints.length-1];const i=this.getCommand(n+1),a=this.getPathSegmentByCommand(i),r=S(x(t.origin,t.coords,t.handles,o),x(i.origin,i.coords,i.handles,a.increments[0]));s.slope=r,this.getPathSegmentByCommand(this.getCommand(n)).subpoints[0].slope=r}}}_getUniformDistances(e,t,n,o){let s=[];if(t<=n)s.push(1);else if(o&&"L"===e.type){const e=2*n/t,o=t-4*n;s.push(e);const i=Math.round(o/n),a=o/i/t;for(let e=0;e<i;++e)s.push(a);s.push(e)}else{const e=Math.round(t/n),o=t/e/t;for(let t=0;t<e;++t)s.push(o)}return s}_getVariableDistances(e,t,n){let o=[],s=e;const i=0===t?.2:t/e,a=0===n?.5:n/e,r=i*e;for(;s>0;){let t=l((c=i,d=a,Math.round(100*(Math.random()*(d-c)+c))/100/2*e));if(s<=r){0===o.length?o.push(1):o[o.length-1]+=l(s/e);break}t>s&&(t=s),o.push(t/e),s-=t}var c,d;return 0===o.length&&o.push(1),o}getLastPathSegment(){return this.pathSegments[this.pathSegments.length-1]}getPathSegmentByCommand(e){return this.pathSegments[this.getCommandIndex(e)]}getPerimeter(){return this.perimeter}}class I{constructor(e,t){this.x=e/2,this.y=t/2,this.n=this.y,this.s=this.y,this.e=this.x,this.w=this.x}discern(e){e.x>this.e?this.e=e.x:e.x<this.w&&(this.w=e.x),e.y>this.s?this.s=e.y:e.y<this.n&&(this.n=e.y)}getCoords(){return{x:this.x-this.w,y:this.y-this.n}}}function E(e){let t=e;if(/d=\"/.test(e)){const n=e.indexOf("d=")+3,o=e.substring(n).indexOf('"')+n;t=e.substring(n,o)}for(;t.search(/([MLHVCSQAZ]\d)|(\d[MLHVCSQAZ])|(Z[MLHVCSQAZ])/i)>-1;){const e=t.search(/([A-Z]\d)|(\d[A-Z])|([A-Z][A-Z])/i)+1;t=[t.substring(0,e),t.substring(e)].join(" ")}return function(e){let t=0,n=0,o="";const s=new RegExp("[MLVHCSQTAZ]","i");let i="",a={x:0,y:0};for(;e.search(s)>-1;){let r=e.search(s),l=e.substring(r,r+1),c=[];switch("Z"!==l&&([c,e]=j(e)),l){case"M":t=c[0],n=c[1],o=0===o.length?`${l} ${t} ${n}`:`${o} ${l} ${t} ${n}`;break;case"L":t=c[0],n=c[1],o=0===o.length?`M ${t} ${n} ${l} ${t} ${n}`:`${o} ${l} ${t} ${n}`;break;case"H":t=c[0],o=`${o} L ${t} ${n}`;break;case"V":n=c[0],o=`${o} L ${t} ${n}`;break;case"C":t=c[4],n=c[5],o=`${o} C ${c[0]} ${c[1]} ${c[2]} ${c[3]} ${t} ${n}`,a={x:c[2],y:c[3]};break;case"S":if(t=c[2],n=c[3],"C"===i||"S"==i){const e=f(a,{x:t,y:n});o=`${o} C ${e.x} ${e.y} ${c[0]} ${c[1]} ${t} ${n}`}else o=`${o} C ${t} ${n} ${c[0]} ${c[1]} ${t} ${n}`;a={x:c[0],y:c[1]};break;case"Q":t=c[2],n=c[3],o=`${o} Q ${c[0]} ${c[1]} ${t} ${n}`,a={x:c[0],y:c[1]};break;case"T":if(t=c[0],n=c[1],"Q"===i||"T"===i){const e=f(a,{x:t,y:n});o=`${o} Q ${e.x} ${e.y} ${t} ${n}`,a={x:e.x,y:e.y}}else o=`${o} L ${t} ${n}`;break;case"Z":o=`${o} Z`,e=e.search(/Z./)>-1?e.substring(1):""}i=l}return o}(t)}function j(e){const t=e.search(/[-\d]/),n=e.substring(t).search(/[MLVHCSQTAZ]/i)+t,o=e.substring(t,n).split(" ");let s=[];for(let e of o)isNaN(Number(e))||s.push(Number(Number(e).toFixed(15)));return[s,e.substring(n)]}class Z{constructor(e,t,n){var o;"string"!=typeof e&&console.error('Parameter "input" needs to be a string when creating a new DistortedNode object.'),void 0===(o=t).variableDistanceApart?console.error('Parameter "variableDistanceApart" missing.'):"boolean"!=typeof o.variableDistanceApart&&console.error('Parameter "variableDistanceApart" needs to be a boolean.'),o.variableDistanceApart||o.distanceApart?o.variableDistanceApart||"number"==typeof o.distanceApart||console.error('Parameter "distanceApart" needs to be a number.'):console.error('Parameter "distanceApart" missing.'),void 0===o.keepWithinOriginalSize?console.error('Parameter "keepWithinOriginalSize" missing.'):"boolean"!=typeof o.keepWithinOriginalSize&&console.error('Parameter "keepWithinOriginalSize" needs to be a boolean.'),r("Received settings:"),r(t),e=e.includes("<svg")?function(e){let t=[];for(;e.includes("<path");){const n=e.indexOf("<path"),o=e.indexOf(">");t.push(e.substring(n,o+1)),e=e.substring(o+1)}let n="";for(let e of t)n=0===n.length?E(e):[n,E(e)].join(" ");return n}(e):E(e),this.settings=t,this.model=new _(e,t),n&&(this.recipe=n)}getDrawCommands(e){return e?this._distortEdges(e).path:this.recipe?this._distortEdges(this.recipe).path:""}getAll(e){return e?this._distortEdges(e):this.recipe?this._distortEdges(this.recipe):{path:"",center:{x:0,y:0}}}_distortEdges(e){r("Starting distortedges.distortEdges()",i);let t="",n=new I(this.model.getBoundingBox().width,this.model.getBoundingBox().height),o={coords:{x:NaN,y:NaN},handleAngle:NaN};for(let s=0;s<this.model.size();++s){const i=this.model.getCommand(s);switch(i.type){case"M":const s=D(this.model,i,e);s?(t=0===t.length?`${s.path}`:`${t} ${s.path}`,o=s.previousSubpoint):console.error("Starting point could not be created.");break;case"L":case"C":const a=$(this.model,i,e,n,o);t=`${t} ${a.path}`,o=a.previousSubpoint;break;case"Z":t=`${t} Z`}}const s={path:t,center:n.getCoords()};return r("Completed distortedges.distortEdges()",a),r(s),s}}function B(e,t,n){return o=this,s=void 0,a=function*(){const o=e.rotation;e.rotation=0;const s=figma.flatten([e.clone()],figma.currentPage),i=e.getPluginData("svgCode"),a=0===i.length?yield function(e){return t=this,n=void 0,s=function*(){let t=yield e.exportAsync({format:"SVG",svgOutlineText:!0,svgIdAttribute:!1,svgSimplifyStroke:!1});return String.fromCharCode.apply(null,Array.from(t))},new((o=void 0)||(o=Promise))((function(e,i){function a(e){try{l(s.next(e))}catch(e){i(e)}}function r(e){try{l(s.throw(e))}catch(e){i(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(a,r)}l((s=s.apply(t,n||[])).next())}));var t,n,o,s}(s):i;let r=new Z(a,t).getAll(n),l=figma.createFrame();if(e.parent){let t=e.parent.children.indexOf(e);e.parent.insertChild(t+1,l)}l.x=e.x,l.y=e.y,l.resize(e.width,e.height),l.fills=[],l.clipsContent=!1;let c=figma.createVector();return l.appendChild(c),c.vectorPaths=[{windingRule:"EVENODD",data:r.path}],t.keepWithinOriginalSize?(c.x=0,c.y=0):(c.x=l.width/2-r.center.x,c.y=l.height/2-r.center.y),c.strokes=e.strokes,c.strokeStyleId=e.strokeStyleId,c.strokeWeight=e.strokeWeight,c.strokeCap=e.strokeCap,c.strokeJoin=e.strokeJoin,c.dashPattern=e.dashPattern,c.strokeMiterLimit=e.strokeMiterLimit,c.fills=e.fills,c.fillStyleId=e.fillStyleId,c.opacity=e.opacity,c.blendMode=e.blendMode,c.effects=e.effects,c.effectStyleId=e.effectStyleId,c.name=`${e.name}`,l.name=`${e.name} (Original size)`,l.rotation=o,c.setPluginData("svgCode",a),c.setPluginData("settings",JSON.stringify(t)),c.setPluginData("recipe",JSON.stringify(n)),c.setPluginData("boundingBox",JSON.stringify({x:l.x,y:l.y,width:l.width,height:l.height})),l.setPluginData("enclosedNode",c.id),s.remove(),e.rotation=o,e.visible=!1,l},new((i=void 0)||(i=Promise))((function(e,t){function n(e){try{l(a.next(e))}catch(e){t(e)}}function r(e){try{l(a.throw(e))}catch(e){t(e)}}function l(t){var o;t.done?e(t.value):(o=t.value,o instanceof i?o:new i((function(e){e(o)}))).then(n,r)}l((a=a.apply(o,s||[])).next())}));var o,s,i,a}function W(e,t,n){const o=new Z(e.getPluginData("svgCode"),t).getAll(n),s=[{windingRule:e.vectorPaths[0].windingRule,data:o.path}];e.vectorPaths=s;const i=e.getPluginData("boundingBox");if(i){const t=JSON.parse(i);t.width&&t.height&&(e.x=t.width/2-o.center.x,e.y=t.height/2-o.center.y)}e.setPluginData("settings",JSON.stringify(t)),e.setPluginData("recipe",JSON.stringify(n))}function z(){const e=figma.currentPage.selection;if(1===e.length)if(n(e[0])){const t=e[0].getPluginData("settings"),n=e[0].getPluginData("recipe");0!==t.length&&0!==n.length&&V(t,n)}else if("FRAME"===e[0].type){const t=e[0].getPluginData("enclosedNode");if(t.length>0){const n=e[0].findOne((e=>e.id===t));if(n){const e=n.getPluginData("settings"),t=n.getPluginData("recipe");0!==t.length&&V(e,t)}}}}function V(e,t){const n=JSON.parse(e),o=JSON.parse(t);console.log("%cSettings retrieved:",k),console.log(n),console.log("%cRecipe retrieved:",k),console.log(o),figma.ui.postMessage({command:"updateUI",args:{settings:n,recipe:o}})}var R=function(e,t,n,o){return new(n||(n=Promise))((function(s,i){function a(e){try{l(o.next(e))}catch(e){i(e)}}function r(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,r)}l((o=o.apply(e,t||[])).next())}))};const F=[new class{constructor(t,n,o,s){this.command=t,this.hasUI=n,this.userParameters={};const i=(()=>e(this,void 0,void 0,(function*(){}))).constructor;this.isAsync=o instanceof i,this.fn=o,n&&!s&&console.log("Module should have UI but does not have any means to parse input from the UI."),this.uiCommands=null!=s?s:()=>{}}setParameterSuggestion(e,t){this.userParameters[e]?this.userParameters[e].push(t):this.userParameters[e]=[t]}getCommand(){return this.command}parameterExists(e,t){return this.userParameters[e].indexOf(t)>=0}getParameterSuggestions(e){return this.userParameters[e]||[]}run(t){return e(this,void 0,void 0,(function*(){let e=t||{};return this.isAsync?yield this.fn(e):this.fn(e)}))}parseUICommands(e){this.uiCommands(e)}}("runDistortEdges",!0,(()=>{figma.showUI(__html__,{themeColors:!0}),figma.on("selectionchange",z)}),(e=>R(void 0,void 0,void 0,(function*(){"runPlugin"===e.command&&(yield function(e,t){return R(this,void 0,void 0,(function*(){const o=figma.currentPage.selection;if(0!==o.length){let s=[];for(let i of o){if("FRAME"===i.type&&i.getPluginData("enclosedNode").length>0){let n=i.findOne((e=>e.id===i.getPluginData("enclosedNode")));n&&"VECTOR"===n.type&&n.getPluginData("svgCode").length>0&&(W(n,e,t),s.push(i))}"VECTOR"===i.type&&i.getPluginData("svgCode").length>0?(W(i,e,t),s.push(i)):n(i)&&s.push(yield B(i,e,t))}0===s.length?figma.notify("No valid layers detected!",{timeout:3e3}):(figma.currentPage.selection=s,1===s.length?(figma.notify("Layer distorted.",{timeout:3e3}),figma.ui.postMessage({command:"updateUI",args:{settings:e,recipe:t}})):(figma.notify("Layers distorted.",{timeout:3e3}),figma.ui.postMessage({command:"clearUI",args:{}})))}else figma.notify("No selection detected!",{timeout:3e3})}))}(e.args.settings,e.args.recipe))}))))];console.log("%cPlugin has started.","color: #ccc");let T,U=function(e){let n=new t;if(e.length>0){for(let t of e)n.loadModule(t),console.log(`%cModule loaded: ${t.getCommand()}`,"color: #ccc");return n}return null}(F);figma.parameters.on("input",(({parameters:e,key:t,result:n})=>{if(U){let e=U.matchCommandToModule(figma.command);e&&n.setSuggestions(e.getParameterSuggestions(t))}})),figma.on("run",(({parameters:e})=>{return t=void 0,n=void 0,s=function*(){e&&(console.log("%cUser input logged:","color: #ccc"),console.log(e)),U||(figma.notify("No operation modules loaded.",{timeout:5e3,error:!0}),figma.closePlugin()),U?(T=0===figma.command.length&&1===U.moduleCount()?U.getSoloModule():U.matchCommandToModule(figma.command),0===figma.command.length&&1===U.moduleCount()?U.runSoloModule():T?(T.isAsync?yield T.run(e):T.run(e),T.hasUI||figma.closePlugin()):(figma.notify("Selected operation has no corresponding module loaded! Closing plugin...",{timeout:5e3,error:!0}),figma.closePlugin())):figma.closePlugin()},new((o=void 0)||(o=Promise))((function(e,i){function a(e){try{l(s.next(e))}catch(e){i(e)}}function r(e){try{l(s.throw(e))}catch(e){i(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(a,r)}l((s=s.apply(t,n||[])).next())}));var t,n,o,s})),figma.ui.onmessage=e=>{"ui"===e.call?"resize"===e.command&&figma.ui.resize(e.args.width,e.args.height):"module"===e.call&&(null==T?void 0:T.hasUI)&&(delete e.call,T.parseUICommands(e))}})();