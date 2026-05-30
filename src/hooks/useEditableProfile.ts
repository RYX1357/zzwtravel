import { useState, useEffect, useCallback, useRef } from 'react'
import type { Profile } from '../types'
import { profile as staticProfile } from '../data/profile'

const STORAGE_KEY = 'zzwtravel-profile'

function loadFromStorage(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.name) return null
    return parsed as Profile
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function saveToStorage(profile: Profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // silently fail, in-memory state still works
  }
}

function compressAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('仅支持图片文件'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const size = Math.min(img.width, img.height, 400)
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        // crop center square
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

export function useEditableProfile() {
  const [profile, setProfile] = useState<Profile>(() => loadFromStorage() ?? staticProfile)
  const isDirtyRef = useRef(false)

  useEffect(() => {
    isDirtyRef.current = JSON.stringify(profile) !== JSON.stringify(staticProfile)
  }, [profile])

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch }
      saveToStorage(next)
      return next
    })
  }, [])

  const uploadAvatar = useCallback(async (file: File): Promise<void> => {
    try {
      const dataUrl = await compressAvatar(file)
      updateProfile({ avatar: dataUrl })
    } catch (err) {
      alert(err instanceof Error ? err.message : '头像上传失败')
    }
  }, [updateProfile])

  const removeAvatar = useCallback(() => {
    updateProfile({ avatar: '' })
  }, [updateProfile])

  const resetProfile = useCallback(() => {
    if (!window.confirm('确认重置个人信息？所有修改将丢失。')) return
    localStorage.removeItem(STORAGE_KEY)
    setProfile(structuredClone(staticProfile))
  }, [])

  return {
    profile,
    isDirty: isDirtyRef.current,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    resetProfile,
  }
}
