import type { CityTravel } from '../types'
import './CityDetail.css'

interface CityDetailProps {
  city: CityTravel | null
}

export default function CityDetail({ city }: CityDetailProps) {
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

  return (
    <div className="city-detail">
      {/* 城市名称 & 日期 */}
      <div className="city-detail-header">
        <h2 className="city-name">{city.cityName}</h2>
        <span className="city-date">{city.visitDate}</span>
      </div>

      {/* 照片区域 */}
      <div className="city-photos">
        {city.photos.length === 0 ? (
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
                    const placeholder = target.nextElementSibling as HTMLElement | null
                    if (placeholder) placeholder.style.display = 'flex'
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

      {/* 标签 */}
      {city.tags.length > 0 && (
        <div className="city-tags">
          {city.tags.map((tag) => (
            <span key={tag} className="city-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 评分 */}
      {city.rating !== undefined && (
        <div className="city-rating">
          <span className="rating-label">个人评分</span>
          <span className="rating-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < city.rating! ? 'star filled' : 'star'}>
                &#9733;
              </span>
            ))}
          </span>
        </div>
      )}

      {/* 同行人 */}
      {city.companions && city.companions.length > 0 && (
        <div className="city-meta-row">
          <span className="meta-label">同行人</span>
          <span className="meta-value">{city.companions.join('、')}</span>
        </div>
      )}

      {/* 推荐美食 */}
      {city.foods && city.foods.length > 0 && (
        <div className="city-meta-row">
          <span className="meta-label">推荐美食</span>
          <span className="meta-value">{city.foods.join(' · ')}</span>
        </div>
      )}

      {/* 推荐景点 */}
      {city.attractions && city.attractions.length > 0 && (
        <div className="city-meta-row">
          <span className="meta-label">推荐景点</span>
          <span className="meta-value">{city.attractions.join(' · ')}</span>
        </div>
      )}

      {/* 旅行日记 */}
      <div className="city-diary">
        <h4 className="diary-title">旅行日记</h4>
        <div className="diary-content">
          {city.diary.split('\n').map((paragraph, idx) =>
            paragraph.trim() ? (
              <p key={idx}>{paragraph}</p>
            ) : (
              <br key={idx} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
