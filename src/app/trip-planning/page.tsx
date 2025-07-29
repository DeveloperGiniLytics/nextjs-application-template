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
import { Separator } from '@/components/ui/separator'

const gccCities = [
  { value: 'dubai', label: 'Dubai, UAE' },
  { value: 'abu-dhabi', label: 'Abu Dhabi, UAE' },
  { value: 'sharjah', label: 'Sharjah, UAE' },
  { value: 'riyadh', label: 'Riyadh, Saudi Arabia' },
  { value: 'jeddah', label: 'Jeddah, Saudi Arabia' },
  { value: 'dammam', label: 'Dammam, Saudi Arabia' },
  { value: 'kuwait-city', label: 'Kuwait City, Kuwait' },
  { value: 'doha', label: 'Doha, Qatar' },
  { value: 'manama', label: 'Manama, Bahrain' },
  { value: 'muscat', label: 'Muscat, Oman' },
]

const vehicles = [
  { value: 'dxb-001', label: 'DXB-001 (40ft Container)' },
  { value: 'auh-003', label: 'AUH-003 (20ft Container)' },
  { value: 'shj-007', label: 'SHJ-007 (Flatbed)' },
  { value: 'dxb-012', label: 'DXB-012 (Refrigerated)' },
]

const drivers = [
  { value: 'ahmed-ali', label: 'Ahmed Ali (License: Valid)' },
  { value: 'mohammed-hassan', label: 'Mohammed Hassan (License: Valid)' },
  { value: 'omar-khalil', label: 'Omar Khalil (License: Valid)' },
  { value: 'hassan-ahmed', label: 'Hassan Ahmed (License: Valid)' },
]

const tripSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  vehicle: z.string().min(1, 'Vehicle selection is required'),
  driver: z.string().min(1, 'Driver selection is required'),
  loadType: z.enum(['FCL', 'LTL']),
  estimatedDistance: z.number().min(1, 'Distance must be greater than 0'),
  estimatedDuration: z.number().min(1, 'Duration must be greater than 0'),
  fuelCost: z.number().min(0, 'Fuel cost cannot be negative'),
  tollCharges: z.number().min(0, 'Toll charges cannot be negative'),
  driverAllowance: z.number().min(0, 'Driver allowance cannot be negative'),
  notes: z.string().optional(),
})

type TripFormData = z.infer<typeof tripSchema>

export default function TripPlanningPage() {
  const [calculatedCosts, setCalculatedCosts] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      loadType: 'FCL',
      estimatedDistance: 0,
      estimatedDuration: 0,
      fuelCost: 0,
      tollCharges: 0,
      driverAllowance: 500,
    },
  })

  const watchedOrigin = watch('origin')
  const watchedDestination = watch('destination')

  const calculateRoute = async () => {
    if (!watchedOrigin || !watchedDestination) return

    setIsCalculating(true)
    
    // Simulate API call to Google Maps Distance Matrix
    setTimeout(() => {
      const mockDistances: { [key: string]: number } = {
        'dubai-riyadh': 1050,
        'dubai-kuwait-city': 850,
        'abu-dhabi-doha': 650,
        'sharjah-muscat': 350,
      }
      
      const routeKey = `${watchedOrigin}-${watchedDestination}`
      const distance = mockDistances[routeKey] || 800
      const duration = Math.round(distance / 80) // Assuming 80 km/h average speed
      const fuelCost = Math.round(distance * 0.8) // AED 0.8 per km
      const tollCharges = Math.round(distance * 0.1) // AED 0.1 per km

      setValue('estimatedDistance', distance)
      setValue('estimatedDuration', duration)
      setValue('fuelCost', fuelCost)
      setValue('tollCharges', tollCharges)

      setIsCalculating(false)
    }, 1500)
  }

  const onSubmit = (data: TripFormData) => {
    const totalCost = data.fuelCost + data.tollCharges + data.driverAllowance + 200 // Base cost
    const profitMargin = 0.25 // 25%
    const sellingPrice = totalCost * (1 + profitMargin)
    const profit = sellingPrice - totalCost

    setCalculatedCosts({
      totalCost,
      sellingPrice,
      profit,
      profitMargin: profitMargin * 100,
      tcnNumber: `TCN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trip Planning & Costing</h1>
        <p className="text-muted-foreground mt-2">
          Plan routes, calculate costs, and generate TCN documents
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Configure your freight trip parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Select onValueChange={(value) => setValue('origin', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin city" />
                    </SelectTrigger>
                    <SelectContent>
                      {gccCities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.origin && (
                    <p className="text-sm text-red-500">{errors.origin.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Select onValueChange={(value) => setValue('destination', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      {gccCities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destination && (
                    <p className="text-sm text-red-500">{errors.destination.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={calculateRoute}
                disabled={!watchedOrigin || !watchedDestination || isCalculating}
                className="w-full"
              >
                {isCalculating ? 'Calculating Route...' : 'Calculate Route & Costs'}
              </Button>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select onValueChange={(value) => setValue('vehicle', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.value} value={vehicle.value}>
                          {vehicle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicle && (
                    <p className="text-sm text-red-500">{errors.vehicle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Driver</Label>
                  <Select onValueChange={(value) => setValue('driver', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.value} value={driver.value}>
                          {driver.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.driver && (
                    <p className="text-sm text-red-500">{errors.driver.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loadType">Load Type</Label>
                <Select onValueChange={(value: 'FCL' | 'LTL') => setValue('loadType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select load type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCL">FCL (Full Container Load)</SelectItem>
                    <SelectItem value="LTL">LTL (Less Than Load)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="estimatedDistance">Distance (km)</Label>
                  <Input
                    type="number"
                    {...register('estimatedDistance', { valueAsNumber: true })}
                    placeholder="Auto-calculated"
                    readOnly
                  />
                  {errors.estimatedDistance && (
                    <p className="text-sm text-red-500">{errors.estimatedDistance.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Duration (hours)</Label>
                  <Input
                    type="number"
                    {...register('estimatedDuration', { valueAsNumber: true })}
                    placeholder="Auto-calculated"
                    readOnly
                  />
                  {errors.estimatedDuration && (
                    <p className="text-sm text-red-500">{errors.estimatedDuration.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fuelCost">Fuel Cost (AED)</Label>
                  <Input
                    type="number"
                    {...register('fuelCost', { valueAsNumber: true })}
                    placeholder="Auto-calculated"
                  />
                  {errors.fuelCost && (
                    <p className="text-sm text-red-500">{errors.fuelCost.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tollCharges">Toll Charges (AED)</Label>
                  <Input
                    type="number"
                    {...register('tollCharges', { valueAsNumber: true })}
                    placeholder="Auto-calculated"
                  />
                  {errors.tollCharges && (
                    <p className="text-sm text-red-500">{errors.tollCharges.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverAllowance">Driver Allowance (AED)</Label>
                  <Input
                    type="number"
                    {...register('driverAllowance', { valueAsNumber: true })}
                    placeholder="500"
                  />
                  {errors.driverAllowance && (
                    <p className="text-sm text-red-500">{errors.driverAllowance.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  {...register('notes')}
                  placeholder="Any special instructions or requirements..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Generate Trip Plan & TCN
              </Button>
            </form>
          </CardContent>
        </Card>

        {calculatedCosts && (
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis & TCN</CardTitle>
              <CardDescription>Trip profitability and document generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {calculatedCosts.tcnNumber}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Transport Control Number</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Operating Cost</span>
                  <span className="text-lg">AED {calculatedCosts.totalCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Selling Price</span>
                  <span className="text-lg font-bold text-green-600">
                    AED {calculatedCosts.sellingPrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Expected Profit</span>
                  <span className="text-lg font-bold text-blue-600">
                    AED {calculatedCosts.profit.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Profit Margin</span>
                  <Badge variant="secondary">
                    {calculatedCosts.profitMargin.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button className="w-full">
                  Download TCN Document
                </Button>
                <Button variant="outline" className="w-full">
                  Save as Draft
                </Button>
                <Button variant="secondary" className="w-full">
                  Schedule Monthly Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
