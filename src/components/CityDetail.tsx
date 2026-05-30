import { useRef, useState } from 'react'
import type { CityTravel, TravelTag } from '../types'
import './CityDetail.css'

const ALL_TRAVEL_TAGS: TravelTag[] = [
  '美食', '自然风光', '历史文化', '城市漫步', '博物馆', '古镇',
  '海滩', '登山', '自驾', '摄影', '美食探店', '艺术展', '寺庙', '园林', '夜市',
]

interface CityDetailProps {
  city: CityTravel | null
  isEditing: boolean
  cityIndex: number
  onUpdateCity: (index: number, city: CityTravel) => void
  onAddPhotos: (index: number, files: FileList | File[]) => Promise<void>
  onRemovePhoto: (index: number, photoIndex: number) => void
}

export default function CityDetail({
  city,
  isEditing,
  cityIndex,
  onUpdateCity,
  onAddPhotos,
  onRemovePhoto,
}: CityDetailProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hoverRating, setHoverRating] = useState(0)

  if (!city) {
    return (
      <div className="city-detail-empty">
        <div className="empty-illustration">
          <span className="empty-icon">&#x1F5FA;</span>
          <h3>选择一座城市</h3>
          <p>
            点击地图上
            <span className="highlight-dot" />
            高亮的城市，查看旅行日记与照片
          </p>
        </div>
      </div>
    )
  }

  const update = (patch: Partial<CityTravel>) => {
    onUpdateCity(cityIndex, { ...city, ...patch })
  }

  const currentRating = hoverRating || city.rating || 0

  return (
    <div className={`city-detail ${isEditing ? 'edit-mode' : ''}`}>
      {/* ====== 城市名称 & 日期 ====== */}
      <div className="city-detail-header">
        <div className="city-name-row">
          <h2 className="city-name">{city.cityName}</h2>
          <span className="city-province">{city.province}</span>
        </div>
        {isEditing ? (
          <input
            type="date"
            className="date-input"
            value={city.visitDate}
            onChange={(e) => update({ visitDate: e.target.value })}
          />
        ) : (
          <span className="city-date">{city.visitDate}</span>
        )}
      </div>

      {/* ====== 照片 ====== */}
      <div className="city-photos">
        {isEditing ? (
          <div className="photo-edit-area">
            <div className="photo-scroll">
              {/* 添加照片卡片 */}
              <button
                className="photo-add-card"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="add-icon">+</span>
                <span className="add-text">添加照片</span>
              </button>

              {city.photos.map((photo, idx) => (
                <div key={idx} className="photo-card editable">
                  <img
                    src={photo}
                    alt={`${city.cityName} - ${idx + 1}`}
                    className="photo-img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const fb = target.nextElementSibling as HTMLElement | null
                      if (fb) fb.style.display = 'flex'
                    }}
                  />
                  <div className="photo-fallback" style={{ display: 'none' }}>
                    <span>&#x1F4F7;</span>
                    <span>{city.cityName} 照片 {idx + 1}</span>
                  </div>
                  <button
                    className="photo-delete-btn"
                    onClick={() => onRemovePhoto(cityIndex, idx)}
                    title="删除照片"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="file-input-hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onAddPhotos(cityIndex, e.target.files)
                  e.target.value = ''
                }
              }}
            />
          </div>
        ) : city.photos.length === 0 ? (
          <div className="photo-placeholder">
            <span>&#x1F4F7;</span>
            <p>照片待添加</p>
          </div>
        ) : (
          <div className="photo-scroll">
            {city.photos.map((photo, idx) => (
              <div key={idx} className="photo-card">
                <img
                  src={photo}
                  alt={`${city.cityName} - ${idx + 1}`}
                  className="photo-img"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    const fb = target.nextElementSibling as HTMLElement | null
                    if (fb) fb.style.display = 'flex'
                  }}
                />
                <div className="photo-fallback" style={{ display: 'none' }}>
                  <span>&#x1F4F7;</span>
                  <span>{city.cityName} 照片 {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====== 标签 ====== */}
      <div className="city-tags">
        {isEditing ? (
          <div className="tag-edit-area">
            {city.tags.map((tag) => (
              <span key={tag} className="city-tag removable">
                {tag}
                <button
                  className="tag-remove-btn"
                  onClick={() => update({ tags: city.tags.filter((t) => t !== tag) })}
                >
                  &times;
                </button>
              </span>
            ))}
            <div className="tag-add-dropdown">
              <select
                className="tag-select"
                value=""
                onChange={(e) => {
                  if (e.target.value && !city.tags.includes(e.target.value as TravelTag)) {
                    update({ tags: [...city.tags, e.target.value as TravelTag] })
                  }
                  e.target.value = ''
                }}
              >
                <option value="">+ 添加标签</option>
                {ALL_TRAVEL_TAGS.filter((t) => !city.tags.includes(t)).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          city.tags.map((tag) => (
            <span key={tag} className="city-tag">
              {tag}
            </span>
          ))
        )}
      </div>

      {/* ====== 评分 ====== */}
      <div className="city-rating">
        <span className="rating-label">个人评分</span>
        {isEditing ? (
          <span
            className="rating-stars editable"
            onMouseLeave={() => setHoverRating(0)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`star ${i < currentRating ? 'filled' : ''}`}
                onMouseEnter={() => setHoverRating(i + 1)}
                onClick={() => update({ rating: i + 1 === city.rating ? undefined : i + 1 })}
              >
                &#9733;
              </span>
            ))}
            {city.rating !== undefined && (
              <button
                className="clear-rating-btn"
                onClick={() => update({ rating: undefined })}
              >
                清除
              </button>
            )}
          </span>
        ) : city.rating !== undefined ? (
          <span className="rating-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < city.rating! ? 'star filled' : 'star'}>
                &#9733;
              </span>
            ))}
          </span>
        ) : (
          <span className="rating-empty">未评分</span>
        )}
      </div>

      {/* ====== 同行人 ====== */}
      <ChipField
        label="同行人"
        values={city.companions || []}
        isEditing={isEditing}
        placeholder="添加同行人"
        onChange={(vals) => update({ companions: vals })}
      />

      {/* ====== 推荐美食 ====== */}
      <ChipField
        label="推荐美食"
        values={city.foods || []}
        isEditing={isEditing}
        placeholder="添加美食"
        onChange={(vals) => update({ foods: vals })}
      />

      {/* ====== 推荐景点 ====== */}
      <ChipField
        label="推荐景点"
        values={city.attractions || []}
        isEditing={isEditing}
        placeholder="添加景点"
        onChange={(vals) => update({ attractions: vals })}
      />

      {/* ====== 旅行日记 ====== */}
      <div className="city-diary">
        <h4 className="diary-title">旅行日记</h4>
        {isEditing ? (
          <div className="diary-edit-area">
            <textarea
              className="diary-textarea"
              value={city.diary}
              onChange={(e) => update({ diary: e.target.value })}
              placeholder="写下你的旅行日记..."
              rows={12}
            />
            <span className="diary-char-count">{city.diary.length} 字</span>
          </div>
        ) : (
          <div className="diary-content">
            {city.diary.split('\n').map((paragraph, idx) =>
              paragraph.trim() ? (
                <p key={idx}>{paragraph}</p>
              ) : (
                <br key={idx} />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** 可编辑字符串数组字段（同行人/美食/景点） */
function ChipField({
  label,
  values,
  isEditing,
  placeholder,
  onChange,
}: {
  label: string
  values: string[]
  isEditing: boolean
  placeholder: string
  onChange: (vals: string[]) => void
}) {
  const [input, setInput] = useState('')

  if (!isEditing && values.length === 0) return null

  return (
    <div className="city-meta-row">
      <span className="meta-label">{label}</span>
      {isEditing ? (
        <div className="chip-edit-area">
          {values.map((v) => (
            <span key={v} className="chip">
              {v}
              <button
                className="chip-remove-btn"
                onClick={() => onChange(values.filter((x) => x !== v))}
              >
                &times;
              </button>
            </span>
          ))}
          <form
            className="chip-add-form"
            onSubmit={(e) => {
              e.preventDefault()
              const trimmed = input.trim()
              if (trimmed && !values.includes(trimmed)) {
                onChange([...values, trimmed])
                setInput('')
              }
            }}
          >
            <input
              type="text"
              className="chip-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const trimmed = input.trim()
                  if (trimmed && !values.includes(trimmed)) {
                    onChange([...values, trimmed])
                    setInput('')
                  }
                }
              }}
            />
          </form>
        </div>
      ) : (
        <span className="meta-value">{values.join(' · ')}</span>
      )}
    </div>
  )
}
