import { CsvUpload } from './CsvUpload'
import { DragArea } from './DragArea'
import { DropArea } from './DropArea'

export default function DeviceDndBoard() {
  return (
    <div className="flex gap-8">
      <div>
        <h3>Drag Area</h3>
        <CsvUpload />
        <DragArea />
      </div>
      <div>
        <h3>Drop Area</h3>
        <DropArea />
      </div>
    </div>
  )
}