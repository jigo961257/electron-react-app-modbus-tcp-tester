import { create } from 'zustand'

export interface Device {
  id: string
  ip: string
  port: number
  status?: boolean // on/off, live from register value
  rpm?: number     // Simulated RPM
}

type DeviceStore = {
  dragDevices: Device[]
  dropDevices: (Device & { timerId?: NodeJS.Timeout })[]
  setDragDevices: (devices: Device[]) => void
  addToDrop: (device: Device) => void
  removeFromDrop: (deviceId: string) => void
  setDeviceStatus: (deviceId: string, status: boolean, rpm?: number) => void
  writeDeviceStatus: (deviceId: string, status: boolean) => Promise<void>
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  dragDevices: [],
  dropDevices: [],
  setDragDevices: (devices) => set({ dragDevices: devices }),
  addToDrop: (device) => {
    set((state) => ({
      dragDevices: state.dragDevices.filter((d) => d.id !== device.id),
      dropDevices: [...state.dropDevices, { ...device }],
    }))
  },
  removeFromDrop: (deviceId) => {
    const device = get().dropDevices.find((d) => d.id === deviceId)
    if (device && device.timerId) clearInterval(device.timerId)
    set((state) => ({
      dropDevices: state.dropDevices.filter((d) => d.id !== deviceId),
      dragDevices: [...state.dragDevices, { id: device!.id, ip: device!.ip, port: device!.port }],
    }))
  },
  setDeviceStatus: (deviceId, status, rpm) =>
    set((state) => ({
      dropDevices: state.dropDevices.map((d) =>
        d.id === deviceId ? { ...d, status, rpm: rpm !== undefined ? rpm : d.rpm } : d
      ),
    })),
  writeDeviceStatus: async (deviceId, status) => {
    const device = get().dropDevices.find((d) => d.id === deviceId)
    if (!device) return
    // Write to register 6 for on/off (1/0)
    try {
      await window.conveyor.modbus.connect(device.ip, device.port, Number(deviceId))
      console.log("status to write", status ? 1 : 0);
      
      await window.conveyor.modbus.writeSingleRegister(6, status ? 1 : 0)
      get().setDeviceStatus(deviceId, status)
    } catch (e) {
      // Optionally handle error, maybe revert UI
    }
  },
}))