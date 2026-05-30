import { useState, useCallback } from 'react'
import Header from './components/Header'
import Profile from './components/Profile'
import ChinaMap from './components/ChinaMap'
import CityDetail from './components/CityDetail'
import Footer from './components/Footer'
import { useEditableCities } from './hooks/useEditableCities'
import { useEditableProfile } from './hooks/useEditableProfile'
import type { CityTravel } from './types'
import './App.css'

export default function App() {
  const {
    cities,
    isEditing,
    isDirty: citiesDirty,
    toggleEditMode,
    updateCity,
    addPhotosBatch,
    removePhoto,
    resetToOriginal: resetCities,
  } = useEditableCities()

  const {
    profile,
    isDirty: profileDirty,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    resetProfile,
  } = useEditableProfile()

  const [selectedCity, setSelectedCity] = useState<CityTravel | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  const handleCityClick = useCallback((city: CityTravel) => {
    const latest = cities.find(
      (c) => c.cityName === city.cityName && c.province === city.province,
    )
    setSelectedCity(latest ?? city)
    setShowMobileDetail(true)
  }, [cities])

  const handleCloseDetail = useCallback(() => {
    setShowMobileDetail(false)
  }, [])

  const selectedCityIndex = selectedCity
    ? cities.findIndex(
        (c) => c.cityName === selectedCity.cityName && c.province === selectedCity.province,
      )
    : -1

  const isDirty = citiesDirty || profileDirty

  const handleReset = useCallback(() => {
    resetCities()
    resetProfile()
  }, [resetCities, resetProfile])

  return (
    <div className="app">
      <Header
        name={profile.name}
        isEditing={isEditing}
        isDirty={isDirty}
        onToggleEdit={toggleEditMode}
        onReset={handleReset}
      />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-left">
            <Profile
              profile={profile}
              visitedCount={cities.length}
              isEditing={isEditing}
              onUpdateProfile={updateProfile}
              onUploadAvatar={uploadAvatar}
              onRemoveAvatar={removeAvatar}
            />
          </div>
          <div className="hero-center">
            <ChinaMap visitedCities={cities} onCityClick={handleCityClick} />
          </div>
          <div className="hero-right">
            <CityDetail
              city={selectedCity}
              isEditing={isEditing}
              cityIndex={selectedCityIndex}
              onUpdateCity={updateCity}
              onAddPhotos={addPhotosBatch}
              onRemovePhoto={removePhoto}
            />
          </div>
        </section>
      </main>

      {showMobileDetail && selectedCity && (
        <div className="mobile-overlay" onClick={handleCloseDetail}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-drawer-close" onClick={handleCloseDetail}>
              &times;
            </button>
            <CityDetail
              city={selectedCity}
              isEditing={isEditing}
              cityIndex={selectedCityIndex}
              onUpdateCity={updateCity}
              onAddPhotos={addPhotosBatch}
              onRemovePhoto={removePhoto}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
