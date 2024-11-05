export function layout(slot: string) {
    return `
<div>
    <h1>Gez</h1>
    <nav>
        <a href="{{__HTML_BASE__}}/">首页<a>
        <a href="{{__HTML_BASE__}}/about">关于我们<a>
    </nav>
    <main>
    ${slot}
    </main>
</div>
`;
}
