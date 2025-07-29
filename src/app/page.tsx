import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to CARGOWISE</h1>
        <p className="text-muted-foreground mt-2">
          Your comprehensive road freight management system for GCC operations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Badge variant="secondary">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <Badge variant="outline">85%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34/40</div>
            <p className="text-xs text-muted-foreground">
              Vehicles in operation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Badge variant="default">AED</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245,000</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Badge variant="secondary">92%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Above target of 90%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
            <CardDescription>Latest freight operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dubai → Riyadh</p>
                  <p className="text-sm text-muted-foreground">TCN-2024-001</p>
                </div>
                <Badge>In Transit</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Abu Dhabi → Kuwait</p>
                  <p className="text-sm text-muted-foreground">TCN-2024-002</p>
                </div>
                <Badge variant="secondary">Delivered</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sharjah → Doha</p>
                  <p className="text-sm text-muted-foreground">TCN-2024-003</p>
                </div>
                <Badge variant="outline">Planning</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Vehicle V-001 Maintenance Due</p>
                  <p className="text-sm text-muted-foreground">Service required in 2 days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Driver License Expiry</p>
                  <p className="text-sm text-muted-foreground">Ahmed Ali - expires in 15 days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">New Shipment Request</p>
                  <p className="text-sm text-muted-foreground">Dubai to Muscat - FCL</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
