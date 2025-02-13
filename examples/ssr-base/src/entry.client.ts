function copyCode() {
    const code = `const server = http.createServer((req, res) => {
    gez.middleware(req, res, async () => {
        const rc = await gez.render({
            params: { url: req.url }
        });
        res.end(rc.html);
    });
});`;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy');
        if (btn) {
            btn.textContent = '已复制';
            setTimeout(() => {
                btn.textContent = '复制代码';
            }, 2000);
        }
    });
}

// 添加事件监听
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.querySelector('.copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCode);
    }
});
