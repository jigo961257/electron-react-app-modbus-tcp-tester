import WelcomeKit from '@/app/components/welcome/WelcomeKit'
// import './styles/app.css'
import DeviceDndBoard from './components/DeviceDndBoard'

export default function App() {
  return (
    <div className="app-container flex flex-col  min-h-screen p-10">
      Welcome to Electron + Vite + React + Tailwind CSS + Shadcn UI
      <DeviceDndBoard />
    </div>
  )
}
