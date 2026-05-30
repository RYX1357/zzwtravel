import './Header.css'

interface HeaderProps {
  name: string
  isEditing: boolean
  isDirty: boolean
  onToggleEdit: () => void
  onReset: () => void
}

export default function Header({ name, isEditing, isDirty, onToggleEdit, onReset }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/zzwtravel/" className="header-logo">
          <span className="logo-icon">&#x2708;</span>
          <span className="logo-text">{name}的旅行足迹</span>
        </a>

        <div className="header-actions">
          <button
            className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
            onClick={onToggleEdit}
            title={isEditing ? '完成编辑' : '编辑模式'}
          >
            <span className="edit-icon">{isEditing ? '✔' : '✎'}</span>
            <span className="edit-label">{isEditing ? '完成' : '编辑'}</span>
          </button>

          {isDirty && (
            <button className="reset-btn" onClick={onReset} title="恢复原始数据">
              重置
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
