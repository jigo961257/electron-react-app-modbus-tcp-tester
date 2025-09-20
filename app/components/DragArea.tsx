import { useDeviceStore } from '@/app/store/deviceStore'

export function DragArea() {
  const dragDevices = useDeviceStore((s) => s.dragDevices)
  const addToDrop = useDeviceStore((s) => s.addToDrop)
console.log("dragDevices", dragDevices);

  return (
    <div style={{ border: '1px solid #aaa', minHeight: 120, padding: 8 }}>
      {dragDevices.map((device) => (
        <div
          key={device.id}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('device-id', device.id)}
          style={{ margin: 4, padding: 8, border: '1px solid #888', borderRadius: 4 }}
        >
          {device.id} ({device.ip}:{device.port})
        </div>
      ))}
    </div>
  )
}