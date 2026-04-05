import { useRef, useState, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import { BrowserRouter as Router, Routes, Route, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Slip } from './components/Slip'
import SlipForm from './components/SlipForm'
import FormList from './components/FormList'
import MeasurementList from './components/MeasurementList'
import Dashboard from './components/Dashboard'
import { fetchSlipData, triggerFetchData } from './api/slipApi'
import { io } from 'socket.io-client'
import { toast, Toaster } from 'react-hot-toast'
import {
  Printer,
  ClipboardList,
  Activity,
  FileText,
  RefreshCw,
  Layers,
  Moon,
  Sun,
  LayoutDashboard
} from 'lucide-react'
import './index.css'

function SocketManager() {
  const navigate = useNavigate()

  useEffect(() => {
    const socket = io('http://localhost:5000')

    socket.on('connect', () => {
      console.log('Connected to server via socket')
    })

    socket.on('new_measurement', (data) => {
      console.log('New measurement received:', data)
      // Notify other components (like lists) to refresh
      window.dispatchEvent(new CustomEvent('new_measurement_added', { detail: data }))
      // Auto-redirect to the new slip view
      navigate(`/?id=${data.id}`)
    })

    return () => {
      socket.disconnect()
    }
  }, [navigate])

  return null
}

function SlipPages() {
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  })

  const [searchParams] = useSearchParams()
  const measurementId = searchParams.get('id')

  const [slipData, setSlipData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!measurementId) {
      setSlipData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchSlipData(measurementId)
      .then((data) => {
        setSlipData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [measurementId])

  if (!measurementId) return <Dashboard />

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
      <div className="text-center no-print">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Slip Generator</h1>
        <button
          onClick={() => handlePrint()}
          disabled={!slipData}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          <Printer size={20} />
          Print Slip
        </button>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm italic">
          Preview shown below. Click Print to generate PDF or print to device.
        </p>
      </div>

      <div className="overflow-auto max-w-full p-1 bg-gray-200 dark:bg-[#0f172a] rounded-lg shadow-inner border border-gray-300 dark:border-[#334155]">
        <div className="shadow-2xl rounded-lg overflow-hidden">
          {loading && <p className="text-center p-8 text-gray-500 dark:text-gray-400">Loading slip data...</p>}
          {error && <p className="text-center p-8 text-red-500">Error: {error}</p>}
          {slipData && <Slip ref={componentRef} data={slipData} />}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <Router>
      <SocketManager />
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-gray-100'} font-sans`}>
        <nav className="bg-white dark:bg-[#1e293b] shadow-sm mb-8 no-print border-b border-gray-100 dark:border-[#334155] transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <Layers className="text-blue-600 dark:text-blue-400" size={24} />
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">SJ Daimonds</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex space-x-6 mr-4 border-r border-gray-100 dark:border-[#334155] pr-6">
                  <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link to="/forms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
                    <ClipboardList size={18} />
                    Configure
                  </Link>
                  <Link to="/measurements" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
                    <Activity size={18} />
                    Measurements
                  </Link>
                </div>

                <Toaster position="top-right" />
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-[#334155] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#475569] transition-all border border-gray-200 dark:border-[#475569] shadow-sm flex items-center justify-center group"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? (
                    <Sun size={18} className="text-yellow-400 animate-in zoom-in-50 duration-300" />
                  ) : (
                    <Moon size={18} className="text-blue-600 animate-in zoom-in-50 duration-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={<SlipPages />} />
            <Route path="/forms" element={<FormList />} />
            <Route path="/measurements" element={<MeasurementList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
