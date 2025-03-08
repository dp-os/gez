export const __webpack_ids__ = ['830'];
export const __webpack_modules__ = {
878: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  b: () => (layout)
});
/* ESM import */var _layout_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(992);

function layout(slot) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const { base = '/' } = options;
    // 判断链接是否激活
    const isActive = (path)=>{
        // 对于空路径的特殊处理
        if (!path) {
            return '';
        }
        // 如果 options.url 不存在，返回空字符串
        if (!options.url) {
            return '';
        }
        // 从 URL 中移除查询参数
        const urlWithoutQuery = options.url.split('?')[0];
        const pathWithoutQuery = path.startsWith('/') ? path : '/' + path;
        // 对于首页的特殊处理
        if (pathWithoutQuery === '/' && urlWithoutQuery === '/') {
            return 'active';
        }
        return urlWithoutQuery === pathWithoutQuery ? 'active' : '';
    };
    // 处理相对路径
    const resolvePath = (path)=>{
        if (path.startsWith('http')) return path;
        return base + (path.startsWith('/') ? path.slice(1) : path);
    };
    return `
<div class="layout">
    <header class="header">
        <div class="container">
            <h1><img src="https://www.jsesm.com/logo.svg" alt="Gez Logo" width="48" height="48"></h1>
            <nav class="nav">
                <a href="${resolvePath('/')} " class="${isActive('/')}">首页</a>
                <a href="${resolvePath('about')}" class="${isActive('/about')}">关于我们</a>
                <a href="https://github.com/js-esm/gez/tree/master/examples/ssr-html" target="_blank">示例代码</a>
            </nav>
        </div>
    </header>
    <main class="main">
        <div class="container">
            ${slot}
        </div>
    </main>
</div>
`;
}


}),
286: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  T: () => (Page)
});
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class Page {
    get props() {
        if (this._props === null) {
            throw new Error(`props is null`);
        }
        return this._props;
    }
    set props(props) {
        this._props = props;
    }
    /**
     * 服务端渲染生成的 HTML
     */ render() {
        return ``;
    }
    /**
     * 组件已经创建完成，props 和 state 已经准备就绪
     */ onCreated() {}
    /**
     * 客户端执行
     */ onClient() {}
    /**
     * 服务端执行
     */ async onServer() {
        this.importMetaSet.add(import.meta);
    }
    constructor(){
        _define_property(this, "importMetaSet", new Set());
        _define_property(this, "_props", null);
        _define_property(this, "title", '');
        /**
     * 自定义页面状态
     */ _define_property(this, "state", {});
    }
}


}),
654: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (NotFound)
});
/* ESM import */var _components_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(878);
/* ESM import */var _page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(286);
/* ESM import */var _title__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(360);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}



class NotFound extends _page__WEBPACK_IMPORTED_MODULE_2__/* .Page */.T {
    render() {
        const { url, base } = this.props;
        return (0,_components_layout__WEBPACK_IMPORTED_MODULE_0__/* .layout */.b)(`<div class="not-found">
                <div class="not-found-content">
                    <div class="error-code">404</div>
                    <h1>页面未找到</h1>
                    <p>抱歉，您访问的页面不存在或已被移除</p>
                    <div class="actions">
                        <a href="${base}/" class="back-home">返回首页</a>
                        <button onclick="window.history.back()" class="go-back">返回上一页</button>
                    </div>
                </div>
            </div>`, {
            url,
            base
        });
    }
    async onServer() {
        this.importMetaSet.add(import.meta);
        super.onServer();
    }
    constructor(...args){
        super(...args), _define_property(this, "title", _title__WEBPACK_IMPORTED_MODULE_1__.title.notFound);
    }
}



}),
992: (function (module, __unused_webpack_exports, __webpack_require__) {
module.exports = {};


}),

};
