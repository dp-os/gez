export const ids=["222"];export const modules={878:function(t,e,i){function r(t){return`
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
`}i.d(e,{b:function(){return r}}),i(992)},286:function(t,e,i){function r(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}i.d(e,{T:function(){return n}});class n{get props(){if(null===this._props)throw Error("props is null");return this._props}set props(t){this._props=t}render(){return""}onCreated(){}onClient(){}async onServer(){this.importMetaSet.add(import.meta)}constructor(){r(this,"importMetaSet",new Set),r(this,"_props",null),r(this,"title",""),r(this,"state",{})}}},421:function(t,e,i){i.r(e),i.d(e,{default:()=>p});var r=i("878");let n=i.p+"images/cat.ed79ef6b.final.jpeg",s=i.p+"images/loading.6e6b1b2e.final.gif",o=i.p+"images/logo.310683d2.final.svg",a=i.p+"images/starry.d914a632.final.jpg",l=i.p+"images/sun.429a7bc5.final.png";var u=i("286"),c=i("944");function h(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}class p extends u.T{render(){let{url:t}=this.props,{count:e}=this.state;return(0,r.b)(`
        <h2>计数器</h2>
        <div id="count">${e}</div>
        <h2>请求地址</h2>
        <pre>${t}</pre>
        <h2>图片</h2>
        <ul>
            <li>${o} <br>
                <img height="100" src="${o}">
            </li>
            <li>${a} <br>
                <img height="100" src="${a}">
            </li>
            <li>${n} <br>
                <img height="100" src="${n}">
            </li>
            <li>${s} <br>
                <img height="100" src="${s}">
            </li>
            <li>${l} <br>
                <img height="100" src="${l}">
            </li>
        </ul>
`)}onClient(){setInterval(()=>{this.state.count++;let t=document.querySelector("#count");t instanceof HTMLDivElement&&(t.innerText=String(this.state.count))},1e3)}async onServer(){this.importMetaSet.add(import.meta),super.onServer(),this.state.count=1}constructor(...t){super(...t),h(this,"state",{count:0}),h(this,"title",c.title.home)}}},992:function(t,e,i){t.exports={}}};