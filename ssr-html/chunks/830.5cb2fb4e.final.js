export const ids=["830"];export const modules={878:function(t,e,r){function n(t){return`
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
`}r.d(e,{b:function(){return n}}),r(992)},286:function(t,e,r){function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.d(e,{T:function(){return o}});class o{get props(){if(null===this._props)throw Error("props is null");return this._props}set props(t){this._props=t}render(){return""}onCreated(){}onClient(){}async onServer(){this.importMetaSet.add(import.meta)}constructor(){n(this,"importMetaSet",new Set),n(this,"_props",null),n(this,"title",""),n(this,"state",{})}}},654:function(t,e,r){r.r(e),r.d(e,{default:function(){return s}});var n=r(878),o=r(286),i=r(944);class s extends o.T{render(){return(0,n.b)("<h2>Not Found</h2>")}async onServer(){this.importMetaSet.add(import.meta),super.onServer()}constructor(...t){var e,r,n;super(...t),e=this,r="title",n=i.title.notFound,r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n}}},992:function(t,e,r){t.exports={}}};