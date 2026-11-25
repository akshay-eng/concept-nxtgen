import{C as e,S as t,a as n,b as r,c as i,d as a,h as o,i as s,l as c,n as l,o as u,r as d,t as f,u as p,x as m,y as h}from"./dist-COY8jhD9.js";import{c as g,p as _,u as v}from"./index-BKGgo08E.js";var y=_(v(),1),b=g(),x=1;function S(t,n,r=x){let i=(n+180)/360*Math.PI*2,a=(90-t)/180*Math.PI;return new e(-Math.cos(i)*Math.sin(a)*r,Math.cos(a)*r,Math.sin(i)*Math.sin(a)*r)}var C=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,w=`
  uniform sampler2D uNight;
  uniform sampler2D uWater;
  uniform vec3 uLightDir;
  uniform float uLights;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  float gridLine(float coord, float step, float width) {
    float f = abs(fract(coord / step - 0.5) - 0.5) * step;
    float w = fwidth(coord) * width;
    return 1.0 - smoothstep(0.0, w, f);
  }

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float water = texture2D(uWater, vUv).r;
    vec3 night = texture2D(uNight, vUv).rgb;
    float lum = dot(night, vec3(0.299, 0.587, 0.114));

    // Sodium-orange city lights, with a whiter core where they are densest
    vec3 warm = vec3(1.0, 0.62, 0.26);
    // The Black Marble plate carries faint moonlit terrain; keep only real light sources.
    float city = pow(smoothstep(0.11, 0.75, lum), 1.25);
    vec3 lights = city * mix(warm, vec3(1.0, 0.86, 0.66), smoothstep(0.45, 1.0, city)) * 4.6 * uLights;
    float terrain = smoothstep(0.02, 0.14, lum) * (1.0 - city);

    // Values are linear: the composer encodes to sRGB on output.
    vec3 land = vec3(0.0045, 0.0075, 0.016);
    vec3 sea = vec3(0.0009, 0.0016, 0.0050);
    vec3 base = mix(land, sea, water);

    float diff = max(dot(n, normalize(uLightDir)), 0.0);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 2.6);

    // Specular glint on the ocean from the rim light
    vec3 h = normalize(normalize(uLightDir) + v);
    float spec = pow(max(dot(n, h), 0.0), 60.0) * water * 0.35;

    // Graticule every 15° in a faint brand blue
    float lat = vUv.y * 180.0;
    float lon = vUv.x * 360.0;
    float grid = max(gridLine(lat, 15.0, 1.2), gridLine(lon, 15.0, 1.2)) * 0.045;

    vec3 col = base * (0.5 + 1.6 * diff) + vec3(0.006, 0.009, 0.018) * terrain * (0.5 + diff);
    col += lights * (1.0 - 0.55 * diff);
    col += vec3(0.02, 0.07, 0.42) * fres;
    col += vec3(0.05, 0.09, 0.3) * spec * (1.0 - fres);
    col += vec3(0.03, 0.06, 0.22) * grid;
    gl_FragColor = vec4(col, 1.0);
  }
`;function T({lightsMV:t}){let[i,a]=n(m,[`./textures/earth-night-2k.jpg`,`./textures/earth-water-1k.jpg`]),o=u(e=>e.gl);(0,y.useMemo)(()=>{for(let e of[i,a])e.anisotropy=Math.min(8,o.capabilities.getMaxAnisotropy()),e.colorSpace=``},[i,a,o]);let c=(0,y.useMemo)(()=>new r({vertexShader:C,fragmentShader:w,uniforms:{uNight:{value:i},uWater:{value:a},uLightDir:{value:new e(-.6,.55,.45)},uLights:{value:0}}}),[i,a]);return s(()=>{c.uniforms.uLights.value=t.current}),(0,b.jsx)(`mesh`,{material:c,children:(0,b.jsx)(`sphereGeometry`,{args:[x,160,160]})})}function E(){let e=(0,y.useMemo)(()=>new r({vertexShader:`
          varying vec3 vN;
          varying vec3 vView;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,fragmentShader:`
          varying vec3 vN;
          varying vec3 vView;
          void main() {
            // 0 at the outer limb of the shell, ~0.5 where it meets the planet's edge
            float d = clamp(-dot(normalize(vN), normalize(vView)), 0.0, 1.0);
            float g = pow(clamp(d / 0.5, 0.0, 1.0), 2.6);
            gl_FragColor = vec4(vec3(0.05, 0.16, 0.85) * g * 0.7, 1.0);
          }
        `,side:1,blending:2,transparent:!0,depthWrite:!1}),[]);return(0,b.jsx)(`mesh`,{material:e,scale:1.16,children:(0,b.jsx)(`sphereGeometry`,{args:[x,96,96]})})}var D=`
  varying float vT;
  void main() { vT = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,O=`
  uniform float uTime;
  uniform float uOffset;
  uniform float uSpeed;
  uniform vec3 uColor;
  uniform float uReveal;
  varying float vT;
  void main() {
    float head = fract(uTime * uSpeed + uOffset) * 1.4 - 0.2;
    float d = vT - head;
    float trail = smoothstep(-0.32, 0.0, d) * (1.0 - smoothstep(0.0, 0.015, d));
    float drawn = step(vT, uReveal);
    float a = (0.10 + trail * 1.6) * drawn;
    gl_FragColor = vec4(uColor * (0.6 + trail * 2.6), a);
  }
`;function k({from:e,to:n,offset:i,speed:o,color:c,revealRef:l}){let{geo:u,mat:d}=(0,y.useMemo)(()=>{let s=S(e.lat,e.lon,x*1.002),l=S(n.lat,n.lon,x*1.002),u=s.distanceTo(l),d=1+Math.min(.32,u*.55),f=s.clone().lerp(l,.25).normalize().multiplyScalar(x*d),m=s.clone().lerp(l,.75).normalize().multiplyScalar(x*d),h=new a(s,f,m,l);return{geo:new t(h,80,.0016,6,!1),mat:new r({vertexShader:D,fragmentShader:O,uniforms:{uTime:{value:0},uOffset:{value:i},uSpeed:{value:o},uColor:{value:new p(c)},uReveal:{value:0}},transparent:!0,depthWrite:!1,blending:2})}},[e,n,i,o,c]);return s(e=>{d.uniforms.uTime.value=e.clock.elapsedTime,d.uniforms.uReveal.value=l.current}),(0,b.jsx)(`mesh`,{geometry:u,material:d})}function A({p:t,index:n,revealRef:r,anchor:i}){let a=(0,y.useRef)(null),o=(0,y.useRef)(null),c=(0,y.useMemo)(()=>S(t.lat,t.lon,x*1.003),[t]),l=(0,y.useMemo)(()=>new h().setFromUnitVectors(new e(0,0,1),c.clone().normalize()),[c]),u=t.kind===`dc`;s(e=>{let t=(e.clock.elapsedTime*.55+n*.37)%1,i=r.current;a.current&&(a.current.scale.setScalar((.6+t*1.5)*i),a.current.material.opacity=(1-t)*.7*i),o.current&&o.current.scale.setScalar(Math.max(1e-4,i))});let d=t.kind===`edge`,f=u?.0085:d?.0055:.0038,m=u?new p(2.6,1.6,.6):d?new p(.7,1,2.6):new p(.55,.7,1.4);return(0,b.jsxs)(`group`,{position:c,quaternion:l,ref:i,children:[(0,b.jsxs)(`mesh`,{ref:o,children:[(0,b.jsx)(`circleGeometry`,{args:[f,24]}),(0,b.jsx)(`meshBasicMaterial`,{color:m,toneMapped:!1,transparent:!0,depthWrite:!1})]}),u&&(0,b.jsxs)(`mesh`,{ref:a,children:[(0,b.jsx)(`ringGeometry`,{args:[f*1.4,f*1.75,40]}),(0,b.jsx)(`meshBasicMaterial`,{color:new p(2.2,1.3,.5),toneMapped:!1,transparent:!0,depthWrite:!1})]})]})}function j(e){let t=e;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}function M({count:e=1400}){let t=(0,y.useMemo)(()=>{let t=j(7),n=new c,r=new Float32Array(e*3);for(let n=0;n<e;n++){let e=t()*2-1,i=t()*Math.PI*2,a=14+t()*20,o=Math.sqrt(1-e*e);r.set([o*Math.cos(i)*a,e*a,o*Math.sin(i)*a],n*3)}return n.setAttribute(`position`,new i(r,3)),n},[e]);return(0,b.jsx)(`points`,{geometry:t,children:(0,b.jsx)(`pointsMaterial`,{size:.035,sizeAttenuation:!0,color:`#9fb4ff`,transparent:!0,opacity:.55,depthWrite:!1})})}function N({points:t,routes:n,progress:r,compact:i,reduced:a,onReady:c,labels:l}){let d=(0,y.useRef)(null),f=(0,y.useRef)(null),p=(0,y.useRef)(null),m=(0,y.useRef)({x:0,y:0}),h=(0,y.useRef)(1),g=(0,y.useRef)(1),_=(0,y.useRef)(0),v=u(e=>e.camera),x=u(e=>e.size),C=(0,y.useRef)([]),w=(0,y.useMemo)(()=>({v:new e,n:new e,c:new e}),[]),D=(0,y.useMemo)(()=>Object.fromEntries(t.map(e=>[e.name,e])),[t]),O=(0,y.useMemo)(()=>{let e=S(21,79);return{y:-Math.atan2(e.x,e.z),x:o.degToRad(21)}},[]);return s((e,n)=>{let s=e.clock.elapsedTime;_.current<3&&++_.current===3&&c?.();let u=r.get(),h=e.pointer;if(m.current.x+=(h.x-m.current.x)*Math.min(1,n*2.5),m.current.y+=(h.y-m.current.y)*Math.min(1,n*2.5),f.current){let e=a?0:(1-Math.cos(s*.12))*.05,t=i?0:Math.atan2(.78*(1-u*.6),v.position.z);f.current.rotation.y=O.y+0+e-t+m.current.x*.08-u*.15}if(d.current&&(d.current.rotation.x=O.x+0-m.current.y*.05+u*.12),p.current){let e=v,t=2*e.position.z*Math.tan(o.degToRad(e.fov/2))*e.aspect,n=i?0:.78,r=i?-.6:-.08,a=(i?Math.min(.8,t*.56):.84)*1;p.current.position.set(n*(1-u*.6),r+u*(i?.4:.1),0),p.current.scale.setScalar(a*(1+u*.55))}v.position.z=3.3-u*.35;let g=l?.current;if(g){let e=0;for(let n=0;n<t.length;n++){if(t[n].kind!==`dc`)continue;let r=g[e++],a=C.current[n];if(!r||!a)continue;a.getWorldPosition(w.v),w.n.copy(w.v).sub(p.current.position).normalize(),w.c.copy(v.position).sub(w.v).normalize();let o=w.n.dot(w.c);w.v.project(v);let s=(w.v.x*.5+.5)*x.width,c=(-w.v.y*.5+.5)*x.height;r.style.transform=`translate3d(${s+12}px, ${c-11}px, 0)`,r.style.opacity=i?`0`:String(Math.max(0,Math.min(1,(o-.15)*4)))}}}),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(M,{}),(0,b.jsxs)(`group`,{ref:p,children:[(0,b.jsx)(`group`,{ref:d,children:(0,b.jsxs)(`group`,{ref:f,children:[(0,b.jsx)(T,{lightsMV:g}),n.map(([e,t],n)=>D[e]&&D[t]?(0,b.jsx)(k,{from:D[e],to:D[t],offset:n*.137%1,speed:.16+n%5*.025,color:n%3==0?`#ffb547`:`#6f97ff`,revealRef:h},e+t):null),t.map((e,t)=>(0,b.jsx)(A,{p:e,index:t,revealRef:h,anchor:e=>{C.current[t]=e}},e.name))]})}),(0,b.jsx)(E,{})]})]})}function P(e){let{visible:t,...n}=e;return(0,b.jsx)(d,{dpr:[1,1.5],frameloop:t?`always`:`never`,camera:{position:[0,0,3.3],fov:36,near:.1,far:100},gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},children:(0,b.jsxs)(y.Suspense,{fallback:null,children:[(0,b.jsx)(N,{...n}),(0,b.jsx)(l,{multisampling:0,children:(0,b.jsx)(f,{mipmapBlur:!0,intensity:.85,luminanceThreshold:.62,luminanceSmoothing:.2,radius:.72})})]})})}export{P as default};