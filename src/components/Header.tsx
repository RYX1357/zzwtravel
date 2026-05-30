import './Header.css'

interface HeaderProps {
  name: string
}

export default function Header({ name }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/zzwtravel/" className="header-logo">
          <span className="logo-icon">&#x2708;</span>
          <span className="logo-text">{name}的旅行足迹</span>
        </a>
      </div>
    </header>
  )
}
