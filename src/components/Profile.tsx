import type { Profile as ProfileType } from '../types'
import './Profile.css'

interface ProfileProps {
  profile: ProfileType
  visitedCount: number
}

export default function Profile({ profile, visitedCount }: ProfileProps) {
  return (
    <div className="profile-card">
      {/* 头像区域 */}
      <div className="profile-avatar-wrap">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            {profile.name.charAt(0)}
          </div>
        )}
      </div>

      {/* 基本信息 */}
      <h1 className="profile-name">{profile.name}</h1>
      <p className="profile-occupation">{profile.occupation}</p>
      <p className="profile-hometown">
        <span className="label-icon">&#x1F3E0;</span>
        {profile.hometown}
      </p>

      {/* 统计 */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{visitedCount}</span>
          <span className="stat-label">已访问城市</span>
        </div>
      </div>

      {/* 个人简介 */}
      <p className="profile-bio">{profile.bio}</p>

      {/* 兴趣爱好 */}
      <div className="profile-section">
        <h3 className="section-label">兴趣爱好</h3>
        <div className="hobby-tags">
          {profile.hobbies.map((hobby) => (
            <span key={hobby} className="hobby-tag">
              {hobby}
            </span>
          ))}
        </div>
      </div>

      {/* 旅行格言 */}
      <blockquote className="profile-motto">&ldquo;{profile.motto}&rdquo;</blockquote>

      {/* 社交链接 */}
      <div className="profile-social">
        {profile.socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
