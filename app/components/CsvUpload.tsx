import { useDeviceStore } from '@/app/store/deviceStore'
import Papa from 'papaparse'

export function CsvUpload() {
  const setDragDevices = useDeviceStore((s) => s.setDragDevices)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const devices = results.data
          .filter((row: any) => row.ID && row.IP && row.Port)
          .map((row: any) => ({
            id: row.ID,
            ip: row.IP,
            port: Number(row.Port),
          }))
          console.log("devices from csv", devices);
          
        setDragDevices(devices)
      },
    })
  }

  return <input type="file" accept=".csv" onChange={onFileChange} />
}