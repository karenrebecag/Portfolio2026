import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
} & ComponentPropsWithoutRef<'div'>

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] ${className}`} {...props}>
      {children}
    </div>
  )
}
