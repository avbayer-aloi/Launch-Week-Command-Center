'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Rocket } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Launches', href: '/launches' },
  { name: 'Launch Week', href: '/launch-week', highlight: true },
  { name: 'AI Assistant', href: '/assistant' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Rocket className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Launch Week Command Center</h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent relative',
                  pathname === item.href
                    ? 'text-accent border-b-2 border-accent pb-1'
                    : 'text-muted',
                  item.highlight && pathname !== item.href && 'text-accent/80'
                )}
              >
                {item.name}
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}