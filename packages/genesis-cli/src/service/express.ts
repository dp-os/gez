import portfinder from 'portfinder'
import express, { Express } from 'express';

export async function createExpress (port: number, isAutoPort: boolean = false): Promise<Express> {
    if (isAutoPort) {
        portfinder.basePort = port
        port = await portfinder.getPortPromise()
    }

    const service = express()
    try {
        await service.listen(port)
    } catch (e) {
        throw e
    }

    return service
}
