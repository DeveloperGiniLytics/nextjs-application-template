'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { format, differenceInDays } from 'date-fns'

const driverSchema = z.object({
  driverId: z.string().min(1, 'Driver ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseExpiry: z.string().min(1, 'License expiry is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
  address: z.string().min(1, 'Address is required'),
})

const advanceSchema = z.object({
  driverId: z.string().min(1, 'Driver selection is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  type: z.enum(['fuel', 'trip_allowance', 'salary_advance', 'other']),
  description: z.string().min(1, 'Description is required'),
  tripId: z.string().optional(),
})

type DriverFormData = z.infer<typeof driverSchema>
type AdvanceFormData = z.infer<typeof advanceSchema>

const mockDrivers = [
  {
    id: 'DR-001',
    firstName: 'Ahmed',
    lastName: 'Ali',
    phone: '+971-50-123-4567',
    email: 'ahmed.ali@cargowise.com',
    licenseNumber: 'DL-12345678',
    licenseExpiry: '2025-06-15',
    nationality: 'UAE',
    status: 'Available',
    currentTrip: null,
    totalTrips: 156,
    rating: 4.8,
    totalEarnings: 45000,
    pendingAdvances: 2500,
    restingPeriod: 0,
    lastTripDate: '2024-01-25',
    emergencyContact: '+971-50-987-6543',
    address: 'Al Qusais, Dubai, UAE',
  },
  {
    id: 'DR-002',
    firstName: 'Mohammed',
    lastName: 'Hassan',
    phone: '+971-55-234-5678',
    email: 'mohammed.hassan@cargowise.com',
    licenseNumber: 'DL-87654321',
    licenseExpiry: '2024-03-20',
    nationality: 'Pakistan',
    status: 'On Trip',
    currentTrip: 'TCN-2024-001',
    totalTrips: 203,
    rating: 4.9,
    totalEarnings: 52000,
    pendingAdvances: 1800,
    restingPeriod: 0,
    lastTripDate: '2024-01-28',
    emergencyContact: '+92-300-123-4567',
    address: 'International City, Dubai, UAE',
  },
  {
    id: 'DR-003',
    firstName: 'Omar',
    lastName: 'Khalil',
    phone: '+971-56-345-6789',
    email: 'omar.khalil@cargowise.com',
    licenseNumber: 'DL-11223344',
    licenseExpiry: '2024-12-10',
    nationality: 'Egypt',
    status: 'Resting',
    currentTrip: null,
    totalTrips: 89,
    rating: 4.6,
    totalEarnings: 28000,
    pendingAdvances: 0,
    restingPeriod: 18,
    lastTripDate: '2024-01-20',
    emergencyContact: '+20-100-123-4567',
    address: 'Sonapur, Dubai, UAE',
  },
]

const mockAdvances = [
  {
    id: 'ADV-001',
    driverId: 'DR-001',
    driverName: 'Ahmed Ali',
    amount: 1500,
    type: 'Fuel Advance',
    date: '2024-01-25',
    status: 'Pending Settlement',
    tripId: 'TCN-2024-003',
    description: 'Fuel advance for Dubai-Riyadh trip',
  },
  {
    id: 'ADV-002',
    driverId: 'DR-002',
    driverName: 'Mohammed Hassan',
    amount: 800,
    type: 'Trip Allowance',
    date: '2024-01-28',
    status: 'Settled',
    tripId: 'TCN-2024-001',
    description: 'Trip allowance for Abu Dhabi-Kuwait route',
  },
  {
    id: 'ADV-003',
    driverId: 'DR-001',
    driverName: 'Ahmed Ali',
    amount: 1000,
    type: 'Salary Advance',
    date: '2024-01-20',
    status: 'Pending Settlement',
    tripId: null,
    description: 'Emergency salary advance',
  },
]

export default function DriverManagementPage() {
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false)
  const [isAdvanceDialogOpen, setIsAdvanceDialogOpen] = useState(false)

  const driverForm = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  })

  const advanceForm = useForm<AdvanceFormData>({
    resolver: zodResolver(advanceSchema),
  })

  const onDriverSubmit = (data: DriverFormData) => {
    console.log('Driver Data:', data)
    setIsDriverDialogOpen(false)
    driverForm.reset()
  }

  const onAdvanceSubmit = (data: AdvanceFormData) => {
    console.log('Advance Data:', data)
    setIsAdvanceDialogOpen(false)
    advanceForm.reset()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500'
      case 'On Trip':
        return 'bg-blue-500'
      case 'Resting':
        return 'bg-yellow-500'
      case 'Unavailable':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLicenseStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = differenceInDays(expiry, today)

    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'destructive' }
    if (daysUntilExpiry <= 30) return { status: 'Expiring Soon', color: 'secondary' }
    return { status: 'Valid', color: 'default' }
  }

  const getRestingStatus = (restingHours: number) => {
    const requiredRest = 24 // hours
    const progress = Math.min((restingHours / requiredRest) * 100, 100)
    
    if (restingHours >= requiredRest) return { status: 'Ready', progress: 100, color: 'green' }
    if (restingHours > 0) return { status: 'Resting', progress, color: 'yellow' }
    return { status: 'Available', progress: 100, color: 'green' }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage driver profiles, assignments, and track performance
          </p>
        </div>
        <div className="space-x-2">
          <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Driver</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Register a new driver in the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={driverForm.handleSubmit(onDriverSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="driverId">Driver ID</Label>
                    <Input {...driverForm.register('driverId')} placeholder="DR-001" />
                    {driverForm.formState.errors.driverId && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.driverId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input {...driverForm.register('nationality')} placeholder="UAE" />
                    {driverForm.formState.errors.nationality && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.nationality.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input {...driverForm.register('firstName')} placeholder="Ahmed" />
                    {driverForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input {...driverForm.register('lastName')} placeholder="Ali" />
                    {driverForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input {...driverForm.register('phone')} placeholder="+971-50-123-4567" />
                    {driverForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" {...driverForm.register('email')} placeholder="driver@cargowise.com" />
                    {driverForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input {...driverForm.register('licenseNumber')} placeholder="DL-12345678" />
                    {driverForm.formState.errors.licenseNumber && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.licenseNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiry">License Expiry</Label>
                    <Input type="date" {...driverForm.register('licenseExpiry')} />
                    {driverForm.formState.errors.licenseExpiry && (
                      <p className="text-sm text-red-500">{driverForm.formState.errors.licenseExpiry.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input {...driverForm.register('emergencyContact')} placeholder="+971-50-987-6543" />
                  {driverForm.formState.errors.emergencyContact && (
                    <p className="text-sm text-red-500">{driverForm.formState.errors.emergencyContact.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea {...driverForm.register('address')} placeholder="Complete address..." rows={2} />
                  {driverForm.formState.errors.address && (
                    <p className="text-sm text-red-500">{driverForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDriverDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Driver</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAdvanceDialogOpen} onOpenChange={setIsAdvanceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Record Advance</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Record Driver Advance</DialogTitle>
                <DialogDescription>Record fuel advance or trip allowance</DialogDescription>
              </DialogHeader>
              <form onSubmit={advanceForm.handleSubmit(onAdvanceSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="driverId">Driver</Label>
                  <Select onValueChange={(value) => advanceForm.setValue('driverId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName} ({driver.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (AED)</Label>
                    <Input type="number" {...advanceForm.register('amount', { valueAsNumber: true })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select onValueChange={(value: any) => advanceForm.setValue('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">Fuel Advance</SelectItem>
                        <SelectItem value="trip_allowance">Trip Allowance</SelectItem>
                        <SelectItem value="salary_advance">Salary Advance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tripId">Trip ID (Optional)</Label>
                  <Input {...advanceForm.register('tripId')} placeholder="TCN-2024-XXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea {...advanceForm.register('description')} placeholder="Purpose of advance..." rows={2} />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAdvanceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Record Advance</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="drivers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="drivers">Driver Profiles</TabsTrigger>
          <TabsTrigger value="assignments">Trip Assignments</TabsTrigger>
          <TabsTrigger value="advances">Advances & Settlements</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-6">
          <div className="grid gap-6">
            {mockDrivers.map((driver) => {
              const licenseStatus = getLicenseStatus(driver.licenseExpiry)
              const restingStatus = getRestingStatus(driver.restingPeriod)
              
              return (
                <Card key={driver.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{driver.firstName} {driver.lastName}</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(driver.status)}`}></div>
                          <Badge variant="outline">{driver.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {driver.id} • {driver.nationality} • {driver.phone}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Route
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">License Number</p>
                          <p className="font-medium">{driver.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">License Expiry</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm">{format(new Date(driver.licenseExpiry), 'MMM dd, yyyy')}</p>
                            <Badge variant={licenseStatus.color as any} className="text-xs">
                              {licenseStatus.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Trips</p>
                          <p className="text-lg font-semibold">{driver.totalTrips}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <div className="flex items-center space-x-1">
                            <span className="text-lg font-semibold">{driver.rating}</span>
                            <span className="text-sm text-muted-foreground">/5.0</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Earnings (YTD)</p>
                          <p className="text-lg font-semibold">AED {driver.totalEarnings.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pending Advances</p>
                          <p className="text-lg font-semibold text-orange-600">
                            AED {driver.pendingAdvances.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {driver.status === 'Resting' && (
                          <div>
                            <p className="text-sm text-muted-foreground">Resting Period</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{driver.restingPeriod}h / 24h</span>
                                <span>{restingStatus.status}</span>
                              </div>
                              <Progress value={restingStatus.progress} className="h-2" />
                            </div>
                          </div>
                        )}
                        {driver.currentTrip && (
                          <div>
                            <p className="text-sm text-muted-foreground">Current Trip</p>
                            <p className="font-medium">{driver.currentTrip}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Last Trip</p>
                          <p className="text-sm">{format(new Date(driver.lastTripDate), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Emergency Contact</p>
                          <p className="text-sm">{driver.emergencyContact}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="text-sm">{driver.address}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Trip Assignments</CardTitle>
              <CardDescription>Active driver assignments and route information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDrivers.filter(driver => driver.currentTrip).map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{driver.firstName} {driver.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{driver.id} • {driver.currentTrip}</p>
                      </div>
                      <Badge>On Trip</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Route</p>
                        <p className="font-medium">Dubai → Riyadh</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">65% Complete</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ETA</p>
                        <p className="font-medium">Jan 30, 14:30</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Contact</p>
                        <p className="font-medium">{driver.phone}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={65} className="h-2" />
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">Track Location</Button>
                      <Button size="sm" variant="outline">Send Message</Button>
                      <Button size="sm" variant="outline">View Route</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Driver Advances & Settlements</CardTitle>
              <CardDescription>Track fuel advances, trip allowances, and settlements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAdvances.map((advance) => (
                  <div key={advance.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{advance.driverName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {advance.id} • {format(new Date(advance.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">AED {advance.amount.toLocaleString()}</p>
                        <Badge variant={advance.status === 'Settled' ? 'default' : 'secondary'}>
                          {advance.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{advance.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{advance.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trip ID</p>
                        <p className="font-medium">{advance.tripId || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Driver ID</p>
                        <p className="font-medium">{advance.driverId}</p>
                      </div>
                    </div>

                    {advance.status === 'Pending Settlement' && (
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">Mark as Settled</Button>
                        <Button size="sm" variant="outline">Adjust Amount</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">12 on duty, 16 resting</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
                <Progress value={94} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Trips completed on time</p>
                <Progress value={92} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">License Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">Valid licenses</p>
                <Progress value={96} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Driver Performance Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Performance analytics charts will be displayed here.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will include trip completion rates, earnings trends, and safety metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
