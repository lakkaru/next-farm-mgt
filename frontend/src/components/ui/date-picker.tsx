'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (value) {
      return dayjs(value)
    }
    return dayjs()
  })

  const handleDateSelect = (day: number) => {
    if (disabled) return
    const selected = currentMonth.date(day).format('YYYY-MM-DD')
    onChange(selected)
    setOpen(false)
  }

  const getDaysInMonth = () => {
    const startDate = currentMonth.startOf('month')
    const endDate = currentMonth.endOf('month')
    const daysInMonth = endDate.date()
    const startingDayOfWeek = startDate.day()

    const days = []
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const days = getDaysInMonth()
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  // Ensure we always have 6 weeks (42 cells) to prevent layout shift
  while (weeks.length < 6) {
    weeks.push(Array(7).fill(null))
  }

  const displayValue = value
    ? dayjs(value).format('MMM DD, YYYY')
    : placeholder

  const selectedDate = value ? dayjs(value).date() : null
  const selectedMonth = value ? dayjs(value).month() : null
  const selectedYear = value ? dayjs(value).year() : null

  return (
    <Popover open={open && !disabled} onOpenChange={(newOpen) => !disabled && setOpen(newOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            disabled && 'opacity-60 cursor-not-allowed',
            className
          )}
          disabled={disabled}
        >
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 w-72">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-medium text-sm min-w-[150px] text-center">
              {currentMonth.format('MMMM YYYY')}
            </div>
            <button
              onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days - Fixed 6 rows x 7 columns */}
          <div className="grid grid-cols-7 gap-1 min-h-[216px]">
            {weeks.map((week, weekIndex) => (
              week.map((day, dayIndex) => {
                const isSelected =
                  day &&
                  selectedDate === day &&
                  selectedMonth === currentMonth.month() &&
                  selectedYear === currentMonth.year()
                const isToday =
                  day &&
                  day === dayjs().date() &&
                  currentMonth.month() === dayjs().month() &&
                  currentMonth.year() === dayjs().year()

                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day}
                    className={cn(
                      'h-8 text-sm rounded hover:bg-gray-100 disabled:opacity-0 disabled:cursor-default transition-colors',
                      isSelected && 'bg-blue-500 text-white hover:bg-blue-600 font-medium',
                      isToday && !isSelected && 'border border-blue-500 text-blue-600 font-medium'
                    )}
                  >
                    {day}
                  </button>
                )
              })
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
