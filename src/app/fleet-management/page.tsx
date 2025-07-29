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
import { format } from 'date-fns'

const vehicleSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1990, 'Year must be 1990 or later'),
  plateNumber: z.string().min(1, 'Plate number is required'),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
  fuelType: z.enum(['diesel', 'petrol', 'electric', 'hybrid']),
  insuranceExpiry: z.string().min(1, 'Insurance expiry is required'),
  registrationExpiry: z.string().min(1, 'Registration expiry is required'),
})

const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  maintenanceType: z.enum(['oil_change', 'tire_replacement', 'brake_service', 'engine_service', 'inspection', 'other']),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  mileage: z.number().min(0, 'Mileage cannot be negative'),
  serviceProvider: z.string().min(1, 'Service provider is required'),
  nextServiceMileage: z.number().optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>
type MaintenanceFormData = z.infer<typeof maintenanceSchema>

const mockVehicles = [
  {
    id: 'DXB-001',
    make: 'Mercedes',
    model: 'Actros',
    year: 2022,
    plateNumber: 'DXB-A-12345',
    capacity: 25000,
    fuelType: 'Diesel',
    currentMileage: 45000,
    engineHours: 1200,
    status: 'Active',
    insuranceExpiry: '2024-12-15',
    registrationExpiry: '2024-10-30',
    lastService: '2024-01-15',
    nextService: '2024-04-15',
    fuelEfficiency: 28.5,
    maintenanceCost: 15000,
  },
  {
    id: 'AUH-003',
    make: 'Volvo',
    model: 'FH16',
    year: 2021,
    plateNumber: 'AUH-B-67890',
    capacity: 30000,
    fuelType: 'Diesel',
    currentMileage: 62000,
    engineHours: 1850,
    status: 'Maintenance',
    insuranceExpiry: '2024-11-20',
    registrationExpiry: '2024-09-12',
    lastService: '2024-01-20',
    nextService: '2024-02-01',
    fuelEfficiency: 26.8,
    maintenanceCost: 22000,
  },
  {
    id: 'SHJ-007',
    make: 'Scania',
    model: 'R450',
    year: 2023,
    plateNumber: 'SHJ-C-11111',
    capacity: 28000,
    fuelType: 'Diesel',
    currentMileage: 28000,
    engineHours: 750,
    status: 'Active',
    insuranceExpiry: '2025-03-10',
    registrationExpiry: '2025-01-25',
    lastService: '2024-01-10',
    nextService: '2024-04-10',
    fuelEfficiency: 30.2,
    maintenanceCost: 8000,
  },
]

const mockMaintenanceHistory = [
  {
    id: 'M-001',
    vehicleId: 'DXB-001',
    type: 'Oil Change',
    date: '2024-01-15',
    cost: 450,
    mileage: 42000,
    provider: 'Al Habtoor Motors',
    description: 'Regular oil and filter change',
  },
  {
    id: 'M-002',
    vehicleId: 'AUH-003',
    type: 'Brake Service',
    date: '2024-01-20',
    cost: 1200,
    mileage: 60000,
    provider: 'Volvo Service Center',
    description: 'Front brake pads replacement',
  },
  {
    id: 'M-003',
    vehicleId: 'SHJ-007',
    type: 'Tire Replacement',
    date: '2024-01-10',
    cost: 2400,
    mileage: 25000,
    provider: 'Bridgestone Center',
    description: 'All 6 tires replaced',
  },
]

export default function FleetManagementPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false)
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false)

  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  })

  const maintenanceForm = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
  })

  const onVehicleSubmit = (data: VehicleFormData) => {
    console.log('Vehicle Data:', data)
    setIsVehicleDialogOpen(false)
    vehicleForm.reset()
  }

  const onMaintenanceSubmit = (data: MaintenanceFormData) => {
    console.log('Maintenance Data:', data)
    setIsMaintenanceDialogOpen(false)
    maintenanceForm.reset()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500'
      case 'Maintenance':
        return 'bg-yellow-500'
      case 'Inactive':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))

    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'destructive' }
    if (daysUntilExpiry <= 30) return { status: 'Expiring Soon', color: 'secondary' }
    return { status: 'Valid', color: 'default' }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet & Maintenance Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage vehicles, track maintenance, and monitor fleet performance
          </p>
        </div>
        <div className="space-x-2">
          <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Vehicle</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>Register a new vehicle in the fleet</DialogDescription>
              </DialogHeader>
              <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">Vehicle ID</Label>
                    <Input {...vehicleForm.register('vehicleId')} placeholder="DXB-001" />
                    {vehicleForm.formState.errors.vehicleId && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.vehicleId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plateNumber">Plate Number</Label>
                    <Input {...vehicleForm.register('plateNumber')} placeholder="DXB-A-12345" />
                    {vehicleForm.formState.errors.plateNumber && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.plateNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input {...vehicleForm.register('make')} placeholder="Mercedes" />
                    {vehicleForm.formState.errors.make && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.make.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input {...vehicleForm.register('model')} placeholder="Actros" />
                    {vehicleForm.formState.errors.model && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.model.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input type="number" {...vehicleForm.register('year', { valueAsNumber: true })} placeholder="2023" />
                    {vehicleForm.formState.errors.year && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.year.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (kg)</Label>
                    <Input type="number" {...vehicleForm.register('capacity', { valueAsNumber: true })} placeholder="25000" />
                    {vehicleForm.formState.errors.capacity && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.capacity.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select onValueChange={(value: any) => vehicleForm.setValue('fuelType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                    <Input type="date" {...vehicleForm.register('insuranceExpiry')} />
                    {vehicleForm.formState.errors.insuranceExpiry && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.insuranceExpiry.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationExpiry">Registration Expiry</Label>
                    <Input type="date" {...vehicleForm.register('registrationExpiry')} />
                    {vehicleForm.formState.errors.registrationExpiry && (
                      <p className="text-sm text-red-500">{vehicleForm.formState.errors.registrationExpiry.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Vehicle</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Schedule Maintenance</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>Record maintenance activity for a vehicle</DialogDescription>
              </DialogHeader>
              <form onSubmit={maintenanceForm.handleSubmit(onMaintenanceSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">Vehicle</Label>
                    <Select onValueChange={(value) => maintenanceForm.setValue('vehicleId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.id} - {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceType">Maintenance Type</Label>
                    <Select onValueChange={(value: any) => maintenanceForm.setValue('maintenanceType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil_change">Oil Change</SelectItem>
                        <SelectItem value="tire_replacement">Tire Replacement</SelectItem>
                        <SelectItem value="brake_service">Brake Service</SelectItem>
                        <SelectItem value="engine_service">Engine Service</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea {...maintenanceForm.register('description')} placeholder="Describe the maintenance work..." />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (AED)</Label>
                    <Input type="number" {...maintenanceForm.register('cost', { valueAsNumber: true })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input type="number" {...maintenanceForm.register('mileage', { valueAsNumber: true })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextServiceMileage">Next Service Mileage</Label>
                    <Input type="number" {...maintenanceForm.register('nextServiceMileage', { valueAsNumber: true })} placeholder="Optional" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceProvider">Service Provider</Label>
                  <Input {...maintenanceForm.register('serviceProvider')} placeholder="Service center name" />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Maintenance</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="fleet" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-6">
          <div className="grid gap-6">
            {mockVehicles.map((vehicle) => {
              const insuranceStatus = getExpiryStatus(vehicle.insuranceExpiry)
              const registrationStatus = getExpiryStatus(vehicle.registrationExpiry)
              
              return (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{vehicle.id}</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                          <Badge variant="outline">{vehicle.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.plateNumber}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Mileage</p>
                          <p className="text-lg font-semibold">{vehicle.currentMileage.toLocaleString()} km</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Engine Hours</p>
                          <p className="text-lg font-semibold">{vehicle.engineHours.toLocaleString()} hrs</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <p className="text-lg font-semibold">{vehicle.capacity.toLocaleString()} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                          <p className="text-lg font-semibold">{vehicle.fuelEfficiency} L/100km</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Insurance Expiry</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm">{format(new Date(vehicle.insuranceExpiry), 'MMM dd, yyyy')}</p>
                            <Badge variant={insuranceStatus.color as any} className="text-xs">
                              {insuranceStatus.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Registration Expiry</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm">{format(new Date(vehicle.registrationExpiry), 'MMM dd, yyyy')}</p>
                            <Badge variant={registrationStatus.color as any} className="text-xs">
                              {registrationStatus.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Last Service</p>
                          <p className="text-sm">{format(new Date(vehicle.lastService), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Service</p>
                          <p className="text-sm">{format(new Date(vehicle.nextService), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Maintenance Cost (YTD)</p>
                          <p className="text-lg font-semibold">AED {vehicle.maintenanceCost.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>Complete maintenance records for all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMaintenanceHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{record.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.vehicleId} • {format(new Date(record.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline">AED {record.cost.toLocaleString()}</Badge>
                    </div>
                    
                    <p className="text-sm mb-3">{record.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Mileage</p>
                        <p className="font-medium">{record.mileage.toLocaleString()} km</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Service Provider</p>
                        <p className="font-medium">{record.provider}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Record ID</p>
                        <p className="font-medium">{record.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84%</div>
                <p className="text-xs text-muted-foreground">42 of 50 vehicles active</p>
                <Progress value={84} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Fuel Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28.5 L</div>
                <p className="text-xs text-muted-foreground">Per 100km across fleet</p>
                <Progress value={72} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED 45K</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <Progress value={65} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Vehicle Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">Uptime this month</p>
                <Progress value={96} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fleet Performance Trends</CardTitle>
              <CardDescription>Key metrics over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Performance charts and analytics will be displayed here using recharts library.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will include fuel efficiency trends, maintenance costs, and utilization rates.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
