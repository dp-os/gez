export const ids=["887"];export const modules={878:function(t,e,i){function n(t){return`
<div>
    <h1>Gez</h1>
    <nav>
        <a href="{{__HTML_BASE__}}/">首页</a>
        <a href="{{__HTML_BASE__}}/about">关于我们</a>
    </nav>
    <main>
    ${t}
    </main>
</div>
`}i.d(e,{b:function(){return n}}),i(992)},930:function(t,e,i){i.d(e,{d3:()=>n,Dt:()=>a,V_:()=>r,YP:()=>s,M5:()=>o});let n=i.p+"images/cat.ed79ef6b.final.jpeg",r=i.p+"images/loading.6e6b1b2e.final.gif",s=i.p+"images/logo.310683d2.final.svg",o=i.p+"images/starry.d914a632.final.jpg",a=i.p+"images/sun.429a7bc5.final.png"},286:function(t,e,i){function n(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}i.d(e,{T:function(){return r}});class r{get props(){if(null===this._props)throw Error("props is null");return this._props}set props(t){this._props=t}render(){return""}onCreated(){}onClient(){}async onServer(){this.importMetaSet.add(import.meta)}constructor(){n(this,"importMetaSet",new Set),n(this,"_props",null),n(this,"title",""),n(this,"state",{})}}},780:function(t,e,i){i.a(t,async function(t,n){try{i.r(e),i.d(e,{default:function(){return c}});var r=i(878),s=i(930),o=i(286),a=i(890),l=t([a]);function u(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}a=(l.then?(await l)():l)[0];class c extends o.T{render(){let{url:t}=this.props,{count:e}=this.state;return(0,r.b)(`
        <h2>计数器</h2>
        <div id="count">${e}</div>
        <h2>请求地址</h2>
        <pre>${t}</pre>
        <h2>图片</h2>
        <ul>
            <li>${s.YP} <br>
                <img height="100" src="${s.YP}">
            </li>
            <li>${s.M5} <br>
                <img height="100" src="${s.M5}">
            </li>
            <li>${s.d3} <br>
                <img height="100" src="${s.d3}">
            </li>
            <li>${s.V_} <br>
                <img height="100" src="${s.V_}">
            </li>
            <li>${s.Dt} <br>
                <img height="100" src="${s.Dt}">
            </li>
        </ul>
`)}onClient(){setInterval(()=>{this.state.count++;let t=document.querySelector("#count");t instanceof HTMLDivElement&&(t.innerText=String(this.state.count))},1e3)}async onServer(){this.importMetaSet.add(import.meta),super.onServer(),this.state.count=1}constructor(...t){super(...t),u(this,"state",{count:0}),u(this,"title",a.title.home)}}n()}catch(t){n(t)}})},992:function(t,e,i){t.exports={}}};