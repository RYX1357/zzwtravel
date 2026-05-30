import { useState, useCallback } from 'react'
import Header from './components/Header'
import Profile from './components/Profile'
import ChinaMap from './components/ChinaMap'
import CityDetail from './components/CityDetail'
import Footer from './components/Footer'
import { profile } from './data/profile'
import { visitedCities } from './data/travels'
import type { CityTravel } from './types'
import './App.css'

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityTravel | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  const handleCityClick = useCallback((city: CityTravel) => {
    setSelectedCity(city)
    setShowMobileDetail(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowMobileDetail(false)
  }, [])

  return (
    <div className="app">
      <Header name={profile.name} />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-left">
            <Profile profile={profile} visitedCount={visitedCities.length} />
          </div>
          <div className="hero-center">
            <ChinaMap visitedCities={visitedCities} onCityClick={handleCityClick} />
          </div>
          <div className="hero-right">
            <CityDetail city={selectedCity} />
          </div>
        </section>
      </main>

      {/* 移动端城市详情弹出层 */}
      {showMobileDetail && selectedCity && (
        <div className="mobile-overlay" onClick={handleCloseDetail}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-drawer-close" onClick={handleCloseDetail}>
              &times;
            </button>
            <CityDetail city={selectedCity} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
