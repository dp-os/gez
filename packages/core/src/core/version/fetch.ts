export async function getFile(url: string): Promise<Response | null> {
    try {
        const result = await fetch(url);
        if (!result.ok || result.status !== 200) {
            console.log(`fetch error: ${url}`);
            return null;
        }
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getJsonFile<T = Record<string, any>>(
    url: string
): Promise<null | T> {
    const result = await getFile(url);
    if (result !== null) {
        try {
            return JSON.parse(await result.text());
        } catch {
            console.log(`JSON parsing failed: ${url}`);
            return null;
        }
    }
    return null;
}
