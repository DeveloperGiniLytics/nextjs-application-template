'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time insights and analytics for your freight operations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                <Badge variant="secondary">Today</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                <Badge variant="default">Live</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42/50</div>
                <p className="text-xs text-muted-foreground">
                  84% utilization rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drivers Available</CardTitle>
                <Badge variant="outline">Ready</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">
                  12 on duty, 16 resting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                <Badge variant="secondary">L/100km</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.5</div>
                <p className="text-xs text-muted-foreground">
                  -2.1L from target
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Performance</CardTitle>
                <CardDescription>Top performing routes this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dubai → Riyadh</span>
                    <span className="text-sm text-muted-foreground">95% OTD</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Abu Dhabi → Kuwait</span>
                    <span className="text-sm text-muted-foreground">88% OTD</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sharjah → Doha</span>
                    <span className="text-sm text-muted-foreground">92% OTD</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Alerts</CardTitle>
                <CardDescription>Upcoming maintenance requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vehicle DXB-001</p>
                      <p className="text-xs text-muted-foreground">Oil change overdue by 500km</p>
                    </div>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vehicle AUH-003</p>
                      <p className="text-xs text-muted-foreground">Tire inspection due in 3 days</p>
                    </div>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Vehicle SHJ-007</p>
                      <p className="text-xs text-muted-foreground">Annual inspection in 2 weeks</p>
                    </div>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>On-Time Delivery</CardTitle>
                <CardDescription>Last 30 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">94.2%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Target: 90% | +4.2% above target
                </p>
                <Progress value={94.2} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Trip Time</CardTitle>
                <CardDescription>Compared to planned duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.2h</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Planned: 8.5h | -0.3h faster
                </p>
                <Progress value={96.5} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Based on delivery feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.7/5</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on 234 reviews this month
                </p>
                <Progress value={94} className="mt-4" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Current month performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED 485,200</div>
                <p className="text-sm text-muted-foreground">
                  +15.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Costs</CardTitle>
                <CardDescription>Fuel, maintenance, salaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED 312,800</div>
                <p className="text-sm text-muted-foreground">
                  64.5% of revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Profit</CardTitle>
                <CardDescription>After all expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED 172,400</div>
                <p className="text-sm text-muted-foreground">
                  35.5% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per KM</CardTitle>
                <CardDescription>Average operational cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED 2.85</div>
                <p className="text-sm text-muted-foreground">
                  -AED 0.15 from target
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
