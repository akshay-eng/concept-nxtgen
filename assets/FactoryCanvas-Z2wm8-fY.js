import{C as e,_ as t,b as n,g as r,i,m as a,n as o,o as s,p as c,r as l,t as u,u as d,y as f}from"./dist-COY8jhD9.js";import{c as p,p as m,u as h}from"./index-BKGgo08E.js";var g=m(h(),1),_=p(),v=18,y=.78,b=1.15,x={w:.7,h:2.15,d:1.05},S=22,C=`
  attribute float aSeed;
  attribute float aHue;
  varying float vSeed;
  varying float vHue;
  varying vec2 vUv;
  void main() {
    vSeed = aSeed; vHue = aHue; vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  }
`,w=`
  uniform float uTime;
  varying float vSeed;
  varying float vHue;
  varying vec2 vUv;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float rate = 0.6 + hash(vSeed * 3.1) * 3.0;
    float tick = floor(uTime * rate + vSeed * 17.0);
    float on = step(0.32, hash(tick + vSeed * 91.0));
    float load = 0.35 + 0.65 * on;
    vec3 blue = vec3(0.22, 0.48, 2.6);
    vec3 amber = vec3(2.6, 1.35, 0.35);
    vec3 white = vec3(1.6, 1.8, 2.4);
    vec3 c = vHue < 0.78 ? blue : (vHue < 0.93 ? white : amber);
    float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    gl_FragColor = vec4(c * load * edge * 0.8, 1.0);
  }
`;function T(){let o=(0,g.useRef)(null),s=(0,g.useRef)(null),c=(0,g.useMemo)(()=>new n({vertexShader:C,fragmentShader:w,uniforms:{uTime:{value:0}},toneMapped:!1}),[]),l=(0,g.useMemo)(()=>{let e=new t(x.w*.74,.011),n=new Float32Array(792),r=new Float32Array(792);for(let e=0;e<792;e++)n[e]=Math.random()*100,r[e]=Math.random();return e.setAttribute(`aSeed`,new a(n,1)),e.setAttribute(`aHue`,new a(r,1)),e},[792]);return(0,g.useLayoutEffect)(()=>{let t=new r,n=new f,i=new e(1,1,1),a=0;for(let r=0;r<2;r++){let c=r===0?-1:1,l=c*(b/2+x.d/2);n.setFromAxisAngle(new e(0,1,0),c*-Math.PI/2);for(let u=0;u<v;u++){let d=-u*y,f=r*v+u;t.compose(new e(l,x.h/2,d),n,i),o.current.setMatrixAt(f,t);let p=b/2*c-c*.002;for(let r=0;r<S;r++){let o=.22+r*((x.h-.4)/S);t.compose(new e(p,o,d),n,i),s.current.setMatrixAt(a++,t)}}}o.current.instanceMatrix.needsUpdate=!0,s.current.instanceMatrix.needsUpdate=!0},[]),i(e=>{c.uniforms.uTime.value=e.clock.elapsedTime}),(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)(`instancedMesh`,{ref:o,args:[void 0,void 0,36],children:[(0,_.jsx)(`boxGeometry`,{args:[x.w,x.h,x.d]}),(0,_.jsx)(`meshStandardMaterial`,{color:`#0a0d14`,metalness:.7,roughness:.38})]}),(0,_.jsx)(`instancedMesh`,{ref:s,args:[l,c,792]})]})}function E(){let e=(0,g.useMemo)(()=>new n({transparent:!0,vertexShader:`varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
          varying vec3 vW;
          float line(float c, float s) { float f = abs(fract(c / s - 0.5) - 0.5) * s; return 1.0 - smoothstep(0.0, fwidth(c) * 1.4, f); }
          void main() {
            float g = max(line(vW.x, 0.6), line(vW.z, 0.6));
            float aisle = 1.0 - smoothstep(0.35, 0.6, abs(vW.x));
            vec3 c = vec3(0.004, 0.006, 0.012) + vec3(0.02, 0.05, 0.22) * g * 0.5 + vec3(0.03, 0.07, 0.3) * aisle * 0.25;
            gl_FragColor = vec4(c, 1.0);
          }
        `}),[]);return(0,_.jsx)(`mesh`,{"rotation-x":-Math.PI/2,position:[0,0,-18*y*.5],material:e,children:(0,_.jsx)(`planeGeometry`,{args:[12,26.04]})})}function D(){return(0,_.jsx)(_.Fragment,{children:[-.38,.38].map(e=>(0,_.jsxs)(`mesh`,{position:[e,2.75,-6.0200000000000005],children:[(0,_.jsx)(`boxGeometry`,{args:[.04,.02,16.04]}),(0,_.jsx)(`meshBasicMaterial`,{color:new d(1.2,1.5,2.4),toneMapped:!1})]},e))})}function O({progress:t,reduced:n}){let r=s(e=>e.camera),a=s(e=>e.scene),o=(0,g.useRef)(new e),l=(0,g.useRef)({x:0,y:0});return(0,g.useLayoutEffect)(()=>(a.fog=new c(`#05060a`,.13),()=>{a.fog=null}),[a]),i((e,i)=>{let a=n?.35:t.get();l.current.x+=(e.pointer.x-l.current.x)*Math.min(1,i*2),l.current.y+=(e.pointer.y-l.current.y)*Math.min(1,i*2);let s=3.2-a*7.5;r.position.set(l.current.x*.12,1.15+l.current.y*.06,s),o.current.set(l.current.x*.3,1,s-4),r.lookAt(o.current)}),(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(`ambientLight`,{intensity:.25}),(0,_.jsx)(`pointLight`,{position:[0,2.4,-2],intensity:6,distance:8,color:`#5f8bff`}),(0,_.jsx)(`pointLight`,{position:[0,2.4,-8],intensity:6,distance:8,color:`#5f8bff`}),(0,_.jsx)(`pointLight`,{position:[0,.4,1],intensity:2,distance:5,color:`#ffb547`}),(0,_.jsx)(T,{}),(0,_.jsx)(E,{}),(0,_.jsx)(D,{})]})}function k({progress:e,reduced:t}){return(0,_.jsxs)(l,{dpr:[1,1.5],camera:{fov:52,near:.05,far:40,position:[0,1.15,3]},gl:{antialias:!0,powerPreference:`high-performance`},children:[(0,_.jsx)(`color`,{attach:`background`,args:[`#05060a`]}),(0,_.jsxs)(g.Suspense,{fallback:null,children:[(0,_.jsx)(O,{progress:e,reduced:t}),(0,_.jsx)(o,{multisampling:0,children:(0,_.jsx)(u,{mipmapBlur:!0,intensity:1.1,luminanceThreshold:.55,radius:.75})})]})]})}export{k as default};