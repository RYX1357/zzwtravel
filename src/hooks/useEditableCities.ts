import { useState, useEffect, useCallback, useRef } from 'react'
import type { CityTravel } from '../types'
import { visitedCities as staticCities } from '../data/travels'

const STORAGE_KEY = 'zzwtravel-edits'
const MAX_STORAGE_BYTES = 6 * 1024 * 1024

function loadFromStorage(): CityTravel[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.cities || !Array.isArray(parsed.cities)) return null
    return parsed.cities as CityTravel[]
  } catch {
    console.warn('localStorage 数据损坏，已恢复为默认数据')
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function saveToStorage(cities: CityTravel[]): boolean {
  try {
    const data = JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), cities })
    if (data.length > MAX_STORAGE_BYTES) {
      alert('存储空间不足（超过 6MB），请删除部分照片后重试。当前编辑内容仅在本次会话中有效。')
      return false
    }
    localStorage.setItem(STORAGE_KEY, data)
    return true
  } catch {
    alert('存储失败，请清理浏览器存储空间。')
    return false
  }
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('仅支持图片文件'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 800
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const ratio = maxDim / Math.max(width, height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

export function useEditableCities() {
  const [cities, setCities] = useState<CityTravel[]>(() => loadFromStorage() ?? staticCities)
  const [isEditing, setIsEditing] = useState(false)
  const isDirtyRef = useRef(false)

  useEffect(() => {
    const current = JSON.stringify(cities)
    const original = JSON.stringify(staticCities)
    isDirtyRef.current = current !== original
  }, [cities])

  const persist = useCallback((next: CityTravel[]) => {
    saveToStorage(next)
    setCities(next)
  }, [])

  const toggleEditMode = useCallback(() => {
    setIsEditing((prev) => !prev)
  }, [])

  const updateCity = useCallback(
    (cityIndex: number, updatedCity: CityTravel) => {
      if (cityIndex < 0 || cityIndex >= cities.length) return
      setCities((prev) => {
        const next = prev.map((c, i) => (i === cityIndex ? updatedCity : c))
        saveToStorage(next)
        return next
      })
    },
    [cities.length],
  )

  const addPhoto = useCallback(
    async (cityIndex: number, file: File): Promise<void> => {
      if (cityIndex < 0 || cityIndex >= cities.length) return
      try {
        const dataUrl = await compressImage(file)
        setCities((prev) => {
          const next = prev.map((c, i) =>
            i === cityIndex ? { ...c, photos: [...c.photos, dataUrl] } : c,
          )
          saveToStorage(next)
          return next
        })
      } catch (err) {
        alert(err instanceof Error ? err.message : '图片处理失败')
      }
    },
    [cities.length],
  )

  const removePhoto = useCallback(
    (cityIndex: number, photoIndex: number) => {
      if (cityIndex < 0 || cityIndex >= cities.length) return
      setCities((prev) => {
        const next = prev.map((c, i) =>
          i === cityIndex
            ? { ...c, photos: c.photos.filter((_, pi) => pi !== photoIndex) }
            : c,
        )
        saveToStorage(next)
        return next
      })
    },
    [cities.length],
  )

  const resetToOriginal = useCallback(() => {
    if (!window.confirm('确认重置？所有编辑内容将丢失。')) return
    localStorage.removeItem(STORAGE_KEY)
    setCities(structuredClone(staticCities))
    setIsEditing(false)
  }, [])

  const addPhotosBatch = useCallback(
    async (cityIndex: number, files: FileList | File[]): Promise<void> => {
      const fileArray = Array.from(files)
      for (const file of fileArray) {
        await addPhoto(cityIndex, file)
      }
    },
    [addPhoto],
  )

  return {
    cities,
    isEditing,
    isDirty: isDirtyRef.current,
    toggleEditMode,
    updateCity,
    addPhoto,
    addPhotosBatch,
    removePhoto,
    resetToOriginal,
  }
}
