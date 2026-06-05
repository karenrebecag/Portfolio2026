'use client'

import { useEffect, useState } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { cn } from '@/lib/utils'

function useSonnerTheme(): ToasterProps['theme'] {
  const [theme, setTheme] = useState<ToasterProps['theme']>('light')

  useEffect(() => {
    const read = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

export function Toaster({ className, ...props }: ToasterProps) {
  const theme = useSonnerTheme()

  return (
    <Sonner
      theme={theme}
      position="top-right"
      offset={24}
      closeButton
      className={cn('toaster group', className)}
      toastOptions={{
        classNames: {
          toast: cn(
            'group toast !rounded-sm !border !border-border !bg-background !text-foreground !shadow-none',
            'font-sans !font-normal',
          ),
          title: '!text-foreground !font-semibold !text-sm',
          description: '!text-muted-foreground !text-xs',
          actionButton: '!bg-primary !text-primary-foreground !rounded-sm !font-accent !text-xs',
          cancelButton: '!bg-muted !text-muted-foreground !rounded-sm',
          closeButton: '!bg-background !text-foreground !border-border !rounded-sm',
          success: '!border-border !bg-background !text-foreground',
          error: '!border-destructive/30 !bg-background !text-foreground',
        },
      }}
      {...props}
    />
  )
}