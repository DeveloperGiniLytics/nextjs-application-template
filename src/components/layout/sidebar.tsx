'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Trip Planning', href: '/trip-planning' },
  { label: 'Shipment Management', href: '/shipment-management' },
  { label: 'Fleet Management', href: '/fleet-management' },
  { label: 'Driver Management', href: '/driver-management' },
  { label: 'GPS Tracking', href: '/gps-tracking' },
  { label: 'Vehicle Inspection', href: '/vehicle-inspection' },
  { label: 'Finance', href: '/finance' },
  { label: 'Reports & Analytics', href: '/reports' },
  { label: 'KPI Management', href: '/kpi' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">CARGOWISE</h1>
        <p className="text-sm text-muted-foreground mt-1">Freight Management</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground'
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
