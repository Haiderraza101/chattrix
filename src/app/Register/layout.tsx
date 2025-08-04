import { ReactNode } from "react"

interface RegisterLayoutProps{
  children:ReactNode;
}
export default function RegistrLayout({children}:RegisterLayoutProps){
  return (
    <div>
      {children}
      </div>
  )
}