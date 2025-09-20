import { ConveyorApi } from '@/lib/preload/shared'

export class ModbusApi extends ConveyorApi {
  connect = (host: string, port: number) =>
    this.invoke('modbus-connect', { host, port })
  disconnect = () =>
    this.invoke('modbus-disconnect')
  readHoldingRegisters = (address: number, length: number) =>
    this.invoke('modbus-read-holding-registers', { address, length })
  writeSingleRegister = (address: number, value: number) =>
    this.invoke('modbus-write-single-register', { address, value })
}