import{S as y,i as C,s as q,w as k,x as b,y as h,q as f,o as u,B as w,k as B,l as d,m as M,g as p,p as S,d as $,F,n as G,G as H,H as I,I as J,J as L,t as N,h as P}from"../chunks/index-57bb6886.js";import{C as T}from"../chunks/Center-0b1c2bf9.js";import{M as j}from"../chunks/Modal-cbcc3831.js";import{r as z}from"../chunks/api-f05df814.js";import{p as A}from"../chunks/stores-7a7ccbfa.js";import"../chunks/icons-a10bc4c8.js";import"../chunks/Icon-d4a9ed8c.js";import"../chunks/navigation-0e6511d1.js";import"../chunks/singletons-d1fb5791.js";import"../chunks/auth-aa803006.js";import"../chunks/index-9be95f4f.js";function g(s){let t,o;return t=new j({props:{title:s[0][0],open:s[0].length>0,noCancelButton:!0}}),t.$on("click",s[2]),t.$on("close",s[3]),{c(){k(t.$$.fragment)},l(e){b(t.$$.fragment,e)},m(e,r){h(t,e,r),o=!0},p(e,r){const a={};r&1&&(a.title=e[0][0]),r&1&&(a.open=e[0].length>0),t.$set(a)},i(e){o||(f(t.$$.fragment,e),o=!0)},o(e){u(t.$$.fragment,e),o=!1},d(e){w(t,e)}}}function D(s){let t,o;return t=new T({props:{class:"text-3xl font-bold text-white",$$slots:{default:[K]},$$scope:{ctx:s}}}),{c(){k(t.$$.fragment)},l(e){b(t.$$.fragment,e)},m(e,r){h(t,e,r),o=!0},p(e,r){const a={};r&16&&(a.$$scope={dirty:r,ctx:e}),t.$set(a)},i(e){o||(f(t.$$.fragment,e),o=!0)},o(e){u(t.$$.fragment,e),o=!1},d(e){w(t,e)}}}function E(s){let t;const o=s[1].default,e=H(o,s,s[4],null);return{c(){e&&e.c()},l(r){e&&e.l(r)},m(r,a){e&&e.m(r,a),t=!0},p(r,a){e&&e.p&&(!t||a&16)&&I(e,o,r,r[4],t?L(o,r[4],a,null):J(r[4]),null)},i(r){t||(f(e,r),t=!0)},o(r){u(e,r),t=!1},d(r){e&&e.d(r)}}}function K(s){let t;return{c(){t=N("\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443")},l(o){t=P(o,"\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443")},m(o,e){p(o,t,e)},d(o){o&&$(t)}}}function O(s){let t,o,e,r,a,l=s[0].length&&g(s);const m=[E,D],_=[];function i(n,c){return navigator.onLine?0:1}return o=i(),e=_[o]=m[o](s),{c(){l&&l.c(),t=B(),e.c(),r=d()},l(n){l&&l.l(n),t=M(n),e.l(n),r=d()},m(n,c){l&&l.m(n,c),p(n,t,c),_[o].m(n,c),p(n,r,c),a=!0},p(n,[c]){n[0].length?l?(l.p(n,c),c&1&&f(l,1)):(l=g(n),l.c(),f(l,1),l.m(t.parentNode,t)):l&&(G(),u(l,1,1,()=>{l=null}),S()),e.p(n,c)},i(n){a||(f(l),f(e),a=!0)},o(n){u(l),u(e),a=!1},d(n){l&&l.d(n),n&&$(t),_[o].d(n),n&&$(r)}}}function Q(s,t,o){let e;F(s,A,i=>o(5,e=i));let{$$slots:r={},$$scope:a}=t;!(e.url.searchParams.has("code")&&e.url.pathname==="")&&z();let l=[];window.alert=i=>o(0,l=[...l,i]);const m=()=>o(0,l=l.slice(1)),_=()=>o(0,l=l.slice(1));return s.$$set=i=>{"$$scope"in i&&o(4,a=i.$$scope)},[l,r,m,_,a]}class oe extends y{constructor(t){super(),C(this,t,Q,O,q,{})}}export{oe as default};
