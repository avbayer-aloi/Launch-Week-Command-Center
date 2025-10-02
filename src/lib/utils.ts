import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInHours = Math.abs(now.getTime() - targetDate.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d ago`
  } else {
    return formatDate(date)
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Planning':
      return 'bg-muted text-foreground'
    case 'In Progress':
      return 'bg-warning text-background'
    case 'Ready':
      return 'bg-success text-background'
    case 'Shipped':
      return 'bg-accent text-background'
    default:
      return 'bg-muted text-foreground'
  }
}

export function calculateProgress(checklist: Record<string, boolean>) {
  const total = Object.keys(checklist).length
  const completed = Object.values(checklist).filter(Boolean).length
  return Math.round((completed / total) * 100)
}