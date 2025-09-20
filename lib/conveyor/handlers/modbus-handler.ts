import { handle } from '@/lib/main/shared'
import ModbusRTU from 'modbus-serial'

let client: ModbusRTU | null = null

export const registerModbusHandlers = () => {
    // @ts-ignore
    handle('modbus-connect', async ({ host, port }) => {
        try {
            client = new ModbusRTU()
            await client.connectTCP(host, { port })
            return true
        } catch (e) {
            console.error('Modbus connect failed', e)
            client = null
            return false
        }
    })

    // @ts-ignore
    handle('modbus-disconnect', async () => {
        try {
            if (client) {
                await client.close()
                client = null
                return true
            }
            return false
        } catch (e) {
            console.error('Modbus disconnect failed', e)
            return false
        }
    })

    // @ts-ignore
    handle('modbus-read-holding-registers', async ({ address, length }) => {
        try {
            if (!client) throw new Error('Not connected')
            const data = await client.readHoldingRegisters(address, length)
            return data.data // usually an array of numbers
        } catch (e) {
            console.error('Modbus read failed', e)
            throw e
        }
    })

    // @ts-ignore
    handle('modbus-write-single-register', async ({ address, value }) => {
        try {
            if (!client) throw new Error('Not connected')
            await client.writeRegister(address, value)
            return true
        } catch (e) {
            console.error('Modbus write failed', e)
            return false
        }
    })
}