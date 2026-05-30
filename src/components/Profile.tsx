import { useRef, useState } from 'react'
import type { Profile as ProfileType } from '../types'
import './Profile.css'

interface ProfileProps {
  profile: ProfileType
  visitedCount: number
  isEditing: boolean
  onUpdateProfile: (patch: Partial<ProfileType>) => void
  onUploadAvatar: (file: File) => Promise<void>
  onRemoveAvatar: () => void
}

export default function Profile({
  profile,
  visitedCount,
  isEditing,
  onUpdateProfile,
  onUploadAvatar,
  onRemoveAvatar,
}: ProfileProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [newHobby, setNewHobby] = useState('')
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  return (
    <div className={`profile-card ${isEditing ? 'edit-mode' : ''}`}>
      {/* ====== 头像 ====== */}
      <div className="profile-avatar-wrap">
        {profile.avatar ? (
          <div className="avatar-img-wrap">
            <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
            {isEditing && (
              <button className="avatar-remove-btn" onClick={onRemoveAvatar} title="移除头像">
                &times;
              </button>
            )}
          </div>
        ) : (
          <div className="profile-avatar-placeholder">
            {profile.name.charAt(0)}
          </div>
        )}
        {isEditing && (
          <>
            <button
              className="avatar-upload-btn"
              onClick={() => avatarInputRef.current?.click()}
            >
              {profile.avatar ? '更换头像' : '上传头像'}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="file-input-hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  onUploadAvatar(file)
                  e.target.value = ''
                }
              }}
            />
          </>
        )}
      </div>

      {/* ====== 姓名 ====== */}
      {isEditing ? (
        <input
          className="profile-name-input"
          value={profile.name}
          onChange={(e) => onUpdateProfile({ name: e.target.value })}
          placeholder="姓名"
        />
      ) : (
        <h1 className="profile-name">{profile.name}</h1>
      )}

      {/* ====== 职业 ====== */}
      {isEditing ? (
        <input
          className="profile-field-input"
          value={profile.occupation}
          onChange={(e) => onUpdateProfile({ occupation: e.target.value })}
          placeholder="职业/身份"
        />
      ) : (
        <p className="profile-occupation">{profile.occupation}</p>
      )}

      {/* ====== 家乡 ====== */}
      {isEditing ? (
        <input
          className="profile-field-input hometown-input"
          value={profile.hometown}
          onChange={(e) => onUpdateProfile({ hometown: e.target.value })}
          placeholder="家乡"
        />
      ) : (
        <p className="profile-hometown">
          <span className="label-icon">&#x1F3E0;</span>
          {profile.hometown}
        </p>
      )}

      {/* ====== 统计 ====== */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{visitedCount}</span>
          <span className="stat-label">已访问城市</span>
        </div>
      </div>

      {/* ====== 个人简介 ====== */}
      <div className="profile-section">
        <h3 className="section-label">个人简介</h3>
        {isEditing ? (
          <textarea
            className="profile-bio-textarea"
            value={profile.bio}
            onChange={(e) => onUpdateProfile({ bio: e.target.value })}
            placeholder="介绍一下自己..."
            rows={4}
          />
        ) : (
          <p className="profile-bio">{profile.bio}</p>
        )}
      </div>

      {/* ====== 兴趣爱好 ====== */}
      <div className="profile-section">
        <h3 className="section-label">兴趣爱好</h3>
        {isEditing ? (
          <div className="chip-edit-area">
            {profile.hobbies.map((hobby) => (
              <span key={hobby} className="hobby-tag removable">
                {hobby}
                <button
                  className="tag-remove-btn"
                  onClick={() =>
                    onUpdateProfile({ hobbies: profile.hobbies.filter((h) => h !== hobby) })
                  }
                >
                  &times;
                </button>
              </span>
            ))}
            <form
              className="chip-add-form"
              onSubmit={(e) => {
                e.preventDefault()
                const v = newHobby.trim()
                if (v && !profile.hobbies.includes(v)) {
                  onUpdateProfile({ hobbies: [...profile.hobbies, v] })
                  setNewHobby('')
                }
              }}
            >
              <input
                type="text"
                className="chip-input"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="添加爱好"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const v = newHobby.trim()
                    if (v && !profile.hobbies.includes(v)) {
                      onUpdateProfile({ hobbies: [...profile.hobbies, v] })
                      setNewHobby('')
                    }
                  }
                }}
              />
            </form>
          </div>
        ) : (
          <div className="hobby-tags">
            {profile.hobbies.map((hobby) => (
              <span key={hobby} className="hobby-tag">
                {hobby}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ====== 旅行格言 ====== */}
      <div className="profile-section">
        <h3 className="section-label">旅行格言</h3>
        {isEditing ? (
          <textarea
            className="profile-motto-textarea"
            value={profile.motto}
            onChange={(e) => onUpdateProfile({ motto: e.target.value })}
            placeholder="你的旅行格言..."
            rows={2}
          />
        ) : (
          <blockquote className="profile-motto">&ldquo;{profile.motto}&rdquo;</blockquote>
        )}
      </div>

      {/* ====== 社交链接 ====== */}
      <div className="profile-section">
        <h3 className="section-label">社交链接</h3>
        {isEditing ? (
          <div className="social-edit-area">
            {profile.socialLinks.map((link, idx) => (
              <div key={idx} className="social-link-edit-row">
                <input
                  className="social-label-input"
                  value={link.label}
                  onChange={(e) => {
                    const next = [...profile.socialLinks]
                    next[idx] = { ...next[idx], label: e.target.value }
                    onUpdateProfile({ socialLinks: next })
                  }}
                  placeholder="平台"
                />
                <input
                  className="social-url-input"
                  value={link.url}
                  onChange={(e) => {
                    const next = [...profile.socialLinks]
                    next[idx] = { ...next[idx], url: e.target.value }
                    onUpdateProfile({ socialLinks: next })
                  }}
                  placeholder="链接"
                />
                <button
                  className="social-remove-btn"
                  onClick={() =>
                    onUpdateProfile({
                      socialLinks: profile.socialLinks.filter((_, i) => i !== idx),
                    })
                  }
                >
                  &times;
                </button>
              </div>
            ))}
            <form
              className="social-add-form"
              onSubmit={(e) => {
                e.preventDefault()
                const label = newLinkLabel.trim()
                const url = newLinkUrl.trim()
                if (label && url) {
                  onUpdateProfile({ socialLinks: [...profile.socialLinks, { label, url }] })
                  setNewLinkLabel('')
                  setNewLinkUrl('')
                }
              }}
            >
              <input
                className="social-label-input"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="平台名"
              />
              <input
                className="social-url-input"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="链接地址"
              />
              <button type="submit" className="social-add-btn">+</button>
            </form>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
