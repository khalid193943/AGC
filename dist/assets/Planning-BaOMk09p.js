import{c as t,j as e}from"./index-5YNnYP6s.js";import{b as i}from"./react-wkWpE0wM.js";import{P as d,g as a,s as m,a as h,C as p}from"./AdminApp-XvFimqTK.js";import"./motion-B8P7UpCq.js";import"./firebase-DjQtgkIG.js";import"./x-CESclrSd.js";import"./loader-circle-Df154Nr-.js";import"./eye-DHahsgvz.js";import"./users-BQnCKx_k.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],g=t("maximize-2",x);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m14 10 7-7",key:"oa77jy"}],["path",{d:"M20 10h-6V4",key:"mjg0md"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M4 14h6v6",key:"rmj7iw"}]],u=t("minimize-2",f);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],v=t("refresh-cw",j),r="https://agcplanning.vercel.app/";function L(){const[l,c]=i.useState(0),[s,o]=i.useState(!1);return e.jsxs("div",{className:s?"fixed inset-0 z-[100] bg-salt p-4 flex flex-col":"",children:[e.jsx(d,{title:"Planning — emplois du temps",desc:"Classes, enseignants, salles et créneaux se gèrent dans Planning AGC. Connectez-vous avec vos identifiants Planning.",actions:e.jsxs(e.Fragment,{children:[e.jsxs(a,{variant:"ghost",onClick:()=>c(n=>n+1),children:[e.jsx(v,{size:16})," Recharger"]}),e.jsx(a,{variant:"ghost",onClick:()=>o(n=>!n),children:s?e.jsxs(e.Fragment,{children:[e.jsx(u,{size:16})," Réduire"]}):e.jsxs(e.Fragment,{children:[e.jsx(g,{size:16})," Plein écran"]})}),e.jsxs(a,{href:r,className:"[&>a]:no-underline",children:[e.jsx(m,{size:16})," Ouvrir dans un onglet"]})]})}),e.jsx(h,{className:`overflow-hidden ${s?"flex-1":""}`,children:e.jsx("iframe",{src:r,title:"Planning AGC — Emplois du temps",className:`w-full bg-white ${s?"h-full":"h-[78vh] min-h-[640px]"}`,allow:"clipboard-write; fullscreen",referrerPolicy:"no-referrer-when-downgrade"},l)}),!s&&e.jsxs("p",{className:"text-xs text-mute mt-3 inline-flex items-center gap-2",children:[e.jsx(p,{size:14})," Si l’application ne s’affiche pas dans ce cadre (réglage de sécurité de son hébergement), utilisez « Ouvrir dans un onglet »."]})]})}export{r as PLANNING_URL,L as default};
