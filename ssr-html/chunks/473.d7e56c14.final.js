export const ids=["473"];export const modules={878:function(t,e,r){function n(t){return`
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
`}r.d(e,{b:function(){return n}}),r(992)},286:function(t,e,r){function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.d(e,{T:function(){return i}});class i{get props(){if(null===this._props)throw Error("props is null");return this._props}set props(t){this._props=t}render(){return""}onCreated(){}onClient(){}async onServer(){this.importMetaSet.add(import.meta)}constructor(){n(this,"importMetaSet",new Set),n(this,"_props",null),n(this,"title",""),n(this,"state",{})}}},896:function(t,e,r){r.a(t,async function(t,n){try{r.r(e),r.d(e,{default:function(){return c}});var i=r(878),o=r(286),a=r(890),s=t([a]);function u(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}a=(s.then?(await s)():s)[0];class c extends o.T{render(){return(0,i.b)(`Gez 是一个基于 Rspack 构建的模块链接（Module Link） 解决方案，通过 importmap 将多服务的模块映射到具有强缓存，基于内容哈希的 URL 中。`)}async onServer(){this.importMetaSet.add(import.meta),super.onServer(),this.state.time=new Date().toISOString()}constructor(...t){super(...t),u(this,"state",{time:""}),u(this,"title",a.title.about)}}n()}catch(t){n(t)}})},992:function(t,e,r){t.exports={}}};