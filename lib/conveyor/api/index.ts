import { electronAPI } from '@electron-toolkit/preload'
import { AppApi } from './app-api'
import { WindowApi } from './window-api'
import { ModbusApi } from './modbus-api'

export const conveyor = {
  app: new AppApi(electronAPI),
  window: new WindowApi(electronAPI),
  modbus: new ModbusApi(electronAPI),
}

export type ConveyorApi = typeof conveyor
