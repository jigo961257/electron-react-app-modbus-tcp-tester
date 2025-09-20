import { useDeviceStore } from '@/app/store/deviceStore'
import { useEffect, useRef } from 'react'

const pollRegister = async (device: { id: string; ip: string; port: number }, setDeviceStatus: (id: string, status: boolean, rpm: number) => void) => {
  try {
    await window.conveyor.modbus.connect(device.ip, device.port, Number(device.id))
    const values = await window.conveyor.modbus.readHoldingRegisters(6, 1)
    const rpmValue = await window.conveyor.modbus.readHoldingRegisters(5, 2)
    const rpm = rpmValue[0]
    setDeviceStatus(device.id, values[0] === 1, rpm)
  } catch (e) {
    setDeviceStatus(device.id, false, 0)
  }
}

export function DropArea() {
  const dropDevices = useDeviceStore((s) => s.dropDevices)
  const setDeviceStatus = useDeviceStore((s) => s.setDeviceStatus)
  const removeFromDrop = useDeviceStore((s) => s.removeFromDrop)
  const writeDeviceStatus = useDeviceStore((s) => s.writeDeviceStatus)
  const addToDrop = useDeviceStore((s) => s.addToDrop)
  const dragDevices = useDeviceStore((s) => s.dragDevices)

  // Store interval IDs per device
  const pollingRefs = useRef<{ [id: string]: NodeJS.Timeout }>({})

  useEffect(() => {
    // Start polling for new devices
    dropDevices.forEach((device) => {
      if (!pollingRefs.current[device.id]) {
        pollingRefs.current[device.id] = setInterval(() => {
          pollRegister(device, setDeviceStatus)
        }, 600)
      }
    })

    // Clear intervals for removed devices
    Object.keys(pollingRefs.current).forEach((id) => {
      if (!dropDevices.find((d) => d.id === id)) {
        clearInterval(pollingRefs.current[id])
        delete pollingRefs.current[id]
      }
    })

    // Cleanup all on unmount
    return () => {
      Object.values(pollingRefs.current).forEach(clearInterval)
      pollingRefs.current = {}
    }
  }, [dropDevices, setDeviceStatus])

  const onDrop = (e: React.DragEvent) => {
    const deviceId = e.dataTransfer.getData('device-id')
    const device = dragDevices.find((d) => d.id === deviceId)
    if (device) addToDrop(device)
  }

  return (
    <div
      style={{ border: '1px solid #aaa', minHeight: 120, padding: 8 }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {dropDevices.map((device) => (
        <div key={device.id} style={{ margin: 4, padding: 8, border: '1px solid #888', borderRadius: 4, display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 100 }}>{device.id}</span>
          <span style={{ width: 80 }}>Status: {device.status ? 'ON' : 'OFF'}</span>
          <span style={{ width: 120 }}>RPM: {device.rpm ?? '--'}</span>
          <button
            style={{ marginLeft: 8 }}
            onClick={() => writeDeviceStatus(device.id, !device.status)}
          >
            Turn {device.status ? 'OFF' : 'ON'}
          </button>
          <button onClick={() => removeFromDrop(device.id)} style={{ marginLeft: 8 }}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}