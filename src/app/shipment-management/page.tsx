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
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

const shipmentSchema = z.object({
  shipmentId: z.string().min(1, 'Shipment ID is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerContact: z.string().min(1, 'Customer contact is required'),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  cbm: z.number().min(0.1, 'CBM must be greater than 0'),
  pallets: z.number().min(1, 'Number of pallets must be at least 1'),
  cargoType: z.string().min(1, 'Cargo type is required'),
  specialInstructions: z.string().optional(),
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  declaredValue: z.number().min(0, 'Declared value cannot be negative'),
})

type ShipmentFormData = z.infer<typeof shipmentSchema>

const cargoTypes = [
  { value: 'general', label: 'General Cargo' },
  { value: 'fragile', label: 'Fragile Items' },
  { value: 'hazardous', label: 'Hazardous Materials' },
  { value: 'perishable', label: 'Perishable Goods' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'automotive', label: 'Automotive Parts' },
]

const mockShipments = [
  {
    id: 'SH-2024-001',
    customer: 'Al Futtaim Trading',
    status: 'In Transit',
    weight: 2500,
    cbm: 15.5,
    origin: 'Dubai',
    destination: 'Riyadh',
    tripId: 'TCN-2024-001',
    progress: 65,
  },
  {
    id: 'SH-2024-002',
    customer: 'Emirates Steel',
    status: 'Delivered',
    weight: 5000,
    cbm: 28.0,
    origin: 'Abu Dhabi',
    destination: 'Kuwait City',
    tripId: 'TCN-2024-002',
    progress: 100,
  },
  {
    id: 'SH-2024-003',
    customer: 'Majid Al Futtaim',
    status: 'Planning',
    weight: 1800,
    cbm: 12.3,
    origin: 'Sharjah',
    destination: 'Doha',
    tripId: null,
    progress: 0,
  },
]

export default function ShipmentManagementPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [loadCapacity, setLoadCapacity] = useState<any>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      weight: 0,
      cbm: 0,
      pallets: 1,
      declaredValue: 0,
    },
  })

  const watchedWeight = watch('weight')
  const watchedCbm = watch('cbm')
  const watchedPallets = watch('pallets')

  const calculateLoadCapacity = () => {
    if (!watchedWeight || !watchedCbm || !watchedPallets) return

    // Standard truck capacities
    const maxWeight = 25000 // kg
    const maxCbm = 80 // cubic meters
    const maxPallets = 33 // standard pallets

    const weightUtilization = (watchedWeight / maxWeight) * 100
    const cbmUtilization = (watchedCbm / maxCbm) * 100
    const palletUtilization = (watchedPallets / maxPallets) * 100

    const overallUtilization = Math.max(weightUtilization, cbmUtilization, palletUtilization)

    setLoadCapacity({
      weightUtilization: Math.min(weightUtilization, 100),
      cbmUtilization: Math.min(cbmUtilization, 100),
      palletUtilization: Math.min(palletUtilization, 100),
      overallUtilization: Math.min(overallUtilization, 100),
      recommendedVehicle: overallUtilization > 80 ? '40ft Container' : '20ft Container',
      canCombine: overallUtilization < 70,
    })
  }

  const onSubmit = (data: ShipmentFormData) => {
    console.log('Shipment Data:', data)
    // Here you would typically send the data to your backend
    alert('Shipment created successfully!')
    reset()
    setLoadCapacity(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500'
      case 'In Transit':
        return 'bg-blue-500'
      case 'Planning':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shipment Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, track, and manage freight shipments across GCC routes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Shipment</TabsTrigger>
          <TabsTrigger value="track">Track Shipments</TabsTrigger>
          <TabsTrigger value="combine">Combine Loads</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
                <CardDescription>Enter shipment information and cargo details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="shipmentId">Shipment ID</Label>
                      <Input
                        {...register('shipmentId')}
                        placeholder="SH-2024-XXX"
                      />
                      {errors.shipmentId && (
                        <p className="text-sm text-red-500">{errors.shipmentId.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        {...register('customerName')}
                        placeholder="Company or individual name"
                      />
                      {errors.customerName && (
                        <p className="text-sm text-red-500">{errors.customerName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerContact">Customer Contact</Label>
                    <Input
                      {...register('customerContact')}
                      placeholder="Phone number or email"
                    />
                    {errors.customerContact && (
                      <p className="text-sm text-red-500">{errors.customerContact.message}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        type="number"
                        {...register('weight', { valueAsNumber: true })}
                        placeholder="0"
                        onChange={(e) => {
                          register('weight').onChange(e)
                          setTimeout(calculateLoadCapacity, 100)
                        }}
                      />
                      {errors.weight && (
                        <p className="text-sm text-red-500">{errors.weight.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cbm">Volume (CBM)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        {...register('cbm', { valueAsNumber: true })}
                        placeholder="0.0"
                        onChange={(e) => {
                          register('cbm').onChange(e)
                          setTimeout(calculateLoadCapacity, 100)
                        }}
                      />
                      {errors.cbm && (
                        <p className="text-sm text-red-500">{errors.cbm.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pallets">Pallets</Label>
                      <Input
                        type="number"
                        {...register('pallets', { valueAsNumber: true })}
                        placeholder="1"
                        onChange={(e) => {
                          register('pallets').onChange(e)
                          setTimeout(calculateLoadCapacity, 100)
                        }}
                      />
                      {errors.pallets && (
                        <p className="text-sm text-red-500">{errors.pallets.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cargoType">Cargo Type</Label>
                      <Select onValueChange={(value) => register('cargoType').onChange({ target: { value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cargo type" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargoTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.cargoType && (
                        <p className="text-sm text-red-500">{errors.cargoType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="declaredValue">Declared Value (AED)</Label>
                      <Input
                        type="number"
                        {...register('declaredValue', { valueAsNumber: true })}
                        placeholder="0"
                      />
                      {errors.declaredValue && (
                        <p className="text-sm text-red-500">{errors.declaredValue.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Pickup Address</Label>
                    <Textarea
                      {...register('pickupAddress')}
                      placeholder="Complete pickup address with landmarks"
                      rows={2}
                    />
                    {errors.pickupAddress && (
                      <p className="text-sm text-red-500">{errors.pickupAddress.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea
                      {...register('deliveryAddress')}
                      placeholder="Complete delivery address with landmarks"
                      rows={2}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-sm text-red-500">{errors.deliveryAddress.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      {...register('specialInstructions')}
                      placeholder="Any special handling requirements..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDocs">Upload Delivery Documents</Label>
                      <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" />
                      <p className="text-xs text-muted-foreground">
                        Upload invoices, packing lists, or other relevant documents
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Shipment
                  </Button>
                </form>
              </CardContent>
            </Card>

            {loadCapacity && (
              <Card>
                <CardHeader>
                  <CardTitle>Load Capacity Analysis</CardTitle>
                  <CardDescription>Vehicle utilization and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Weight Utilization</span>
                        <span>{loadCapacity.weightUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={loadCapacity.weightUtilization} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Volume Utilization</span>
                        <span>{loadCapacity.cbmUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={loadCapacity.cbmUtilization} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Pallet Utilization</span>
                        <span>{loadCapacity.palletUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={loadCapacity.palletUtilization} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Overall Utilization</span>
                      <Badge variant={loadCapacity.overallUtilization > 80 ? 'default' : 'secondary'}>
                        {loadCapacity.overallUtilization.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Recommended Vehicle</span>
                      <Badge variant="outline">{loadCapacity.recommendedVehicle}</Badge>
                    </div>

                    {loadCapacity.canCombine && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Optimization Opportunity:</strong> This shipment can be combined with other loads to improve efficiency.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full">
                    Find Compatible Shipments
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="track" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Track and monitor all shipments in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockShipments.map((shipment) => (
                  <div key={shipment.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{shipment.id}</h3>
                        <p className="text-sm text-muted-foreground">{shipment.customer}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(shipment.status)}`}></div>
                        <Badge variant="outline">{shipment.status}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{shipment.weight.toLocaleString()} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-medium">{shipment.cbm} CBM</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Route</p>
                        <p className="font-medium">{shipment.origin} → {shipment.destination}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trip ID</p>
                        <p className="font-medium">{shipment.tripId || 'Not assigned'}</p>
                      </div>
                    </div>

                    {shipment.status === 'In Transit' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Delivery Progress</span>
                          <span>{shipment.progress}%</span>
                        </div>
                        <Progress value={shipment.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Track Location</Button>
                      <Button size="sm" variant="outline">Upload POD</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Load Combination (LTL)</CardTitle>
              <CardDescription>Optimize vehicle utilization by combining multiple shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  LTL (Less-than-truckload) functionality will be implemented in future updates.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This feature will allow combining multiple smaller shipments into a single trip for better efficiency.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
