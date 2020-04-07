import { SSR, Format, Plugin, RenderData } from '@fmfe/genesis-core';
const mergeArr = (
    data: RenderData,
    cb: (arr: RenderData[]) => string
): string => {
    // 展开成一维数组
    const arr = [data];
    const mergeState = (state, deep) => {
        const remoteArr = state.__remote_view_server_state__ || [];
        if (!remoteArr.length) return;
        if (deep > 10) {
            throw new Error('Remote view call nesting too deep');
        }
        remoteArr.forEach((item) => {
            if (!item.id) return;
            arr.push(item);
            if (typeof item.state === 'object') {
                mergeState(item.state, ++deep);
            }
        });
    };
    mergeState(data.state, 1);
    return cb(arr);
};
export class RemoteFormat extends Format {
    public scriptSet = new Set<string>();
    public styleSet = new Set<string>();

    public style(data: RenderData) {
        return mergeArr(data, (arr) => {
            let text = arr.map((item) => item.style).join('');
            text = text.replace(/<link([^>]+)>/g, ($1, $2) => {
                if (this.styleSet.has($2)) {
                    return '';
                }
                this.styleSet.add($2);
                return $1;
            });
            return text;
        });
    }

    public script(data: RenderData) {
        return mergeArr(data, (arr) => {
            let text = arr.map((item) => item.script).join('');
            text = text.replace(/<script([^>]+)>[^<]*<\/script>/g, ($1, $2) => {
                if (this.scriptSet.has($2)) {
                    return '';
                }
                this.scriptSet.add($2);
                return $1;
            });
            return text;
        });
    }

    public scriptState(data: RenderData) {
        return mergeArr(data, (arr) => {
            return arr
                .map((item) => {
                    return super.scriptState(item);
                })
                .join('');
        });
    }
}
export class RemotePlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
        ssr.Format = RemoteFormat;
    }

    public async renderBefore(context) {
        context.format = new RemoteFormat(this.ssr);
    }
}
