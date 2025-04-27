import type { FC } from "react"

interface LogoProps {
  className?: string
}

const Logo: FC<LogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        <path
          d="M10 30C15.5228 30 20 25.5228 20 20C20 14.4772 15.5228 10 10 10C4.47715 10 0 14.4772 0 20C0 25.5228 4.47715 30 10 30Z"
          fill="hsl(180 100% 50%)"
        />
        <path
          d="M30 30C35.5228 30 40 25.5228 40 20C40 14.4772 35.5228 10 30 10C24.4772 10 20 14.4772 20 20C20 25.5228 24.4772 30 30 30Z"
          fill="hsl(280 100% 60%)"
        />
        <path d="M45 15H55V20H45V15Z" fill="hsl(180 100% 50%)" />
        <path d="M60 10H70V30H60V10Z" fill="hsl(280 100% 60%)" />
        <path d="M75 10H85V30H75V10Z" fill="hsl(180 100% 50%)" />
        <path d="M90 10H100V30H90V10Z" fill="hsl(280 100% 60%)" />
      </svg>
    </div>
  )
}

export default Logo
