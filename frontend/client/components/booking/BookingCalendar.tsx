import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format, addDays, startOfDay, isBefore, isToday } from "date-fns";
import { Clock, User, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TimeSlot, TeacherProfile, BookingForm } from "../../types/platform";
import { cn } from "../../lib/utils";
import "react-calendar/dist/Calendar.css";

interface BookingCalendarProps {
  teacher: TeacherProfile;
  onBookingSelect: (booking: Partial<BookingForm>) => void;
  userTimezone: string;
  className?: string;
}

interface TimeSlotWithDate extends TimeSlot {
  displayDate: Date;
  localTime: string;
  isAvailable: boolean;
}

export function BookingCalendar({
  teacher,
  onBookingSelect,
  userTimezone,
  className,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState<TimeSlotWithDate | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [availableSlots, setAvailableSlots] = useState<TimeSlotWithDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert teacher's time slots to user's timezone
  useEffect(() => {
    const generateAvailableSlots = () => {
      const slots: TimeSlotWithDate[] = [];
      const today = startOfDay(new Date());

      // Generate slots for next 30 days
      for (let i = 0; i < 30; i++) {
        const date = addDays(today, i);
        const dayOfWeek = date.getDay();

        // Find teacher's availability for this day
        const dayAvailability = teacher.availability.filter(
          (slot) => slot.dayOfWeek === dayOfWeek && !slot.isBlocked,
        );

        dayAvailability.forEach((slot) => {
          // Convert time to user's timezone (simplified - in real app use proper timezone library)
          const localTime = convertToUserTimezone(slot.startTime, userTimezone);

          slots.push({
            ...slot,
            displayDate: date,
            localTime,
            isAvailable: !slot.isBooked && !isBefore(date, today),
          });
        });
      }

      setAvailableSlots(slots);
    };

    generateAvailableSlots();
  }, [teacher.availability, userTimezone]);

  const convertToUserTimezone = (time: string, timezone: string): string => {
    // Simplified timezone conversion - in production use moment-timezone or date-fns-tz
    return time; // Return as-is for now
  };

  const getSlotsForDate = (date: Date): TimeSlotWithDate[] => {
    return availableSlots.filter(
      (slot) =>
        slot.displayDate.toDateString() === date.toDateString() &&
        slot.isAvailable,
    );
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlotWithDate) => {
    setSelectedTimeSlot(slot);
  };

  const handleBooking = () => {
    if (!selectedTimeSlot) return;

    onBookingSelect({
      teacherId: teacher.id,
      timeSlotId: selectedTimeSlot.id,
      date: format(selectedDate, "yyyy-MM-dd"),
      duration: selectedDuration,
    });
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const slotsForDate = getSlotsForDate(date);

    if (slotsForDate.length === 0) {
      return "no-slots";
    }

    if (date.toDateString() === selectedDate.toDateString()) {
      return "selected-date";
    }

    return "has-slots";
  };

  const currentDateSlots = getSlotsForDate(selectedDate);

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule with {teacher.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Teacher Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{teacher.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>${teacher.hourlyRate}/hour</span>
                <Badge variant="secondary">⭐ {teacher.rating}</Badge>
              </div>
            </div>
          </div>

          {/* Timezone Notice */}
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              All times shown in your timezone: {userTimezone}
            </AlertDescription>
          </Alert>

          {/* Calendar */}
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              maxDate={addDays(new Date(), 30)}
              tileClassName={tileClassName}
              className="w-full"
            />
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available times for {format(selectedDate, "EEEE, MMMM d")}
            </h4>

            {currentDateSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No available time slots for this date
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentDateSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={
                      selectedTimeSlot?.id === slot.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleTimeSlotSelect(slot)}
                    className="h-auto py-2 px-3"
                  >
                    <div className="text-center">
                      <div className="font-medium">{slot.localTime}</div>
                      <div className="text-xs text-muted-foreground">
                        {slot.endTime}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Duration Selection */}
          {selectedTimeSlot && (
            <div className="space-y-3">
              <h4 className="font-medium">Lesson Duration</h4>
              <Select
                value={selectedDuration.toString()}
                onValueChange={(value) => setSelectedDuration(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">
                    30 minutes - ${(teacher.hourlyRate * 0.5).toFixed(2)}
                  </SelectItem>
                  <SelectItem value="60">
                    1 hour - ${teacher.hourlyRate.toFixed(2)}
                  </SelectItem>
                  <SelectItem value="90">
                    1.5 hours - ${(teacher.hourlyRate * 1.5).toFixed(2)}
                  </SelectItem>
                  <SelectItem value="120">
                    2 hours - ${(teacher.hourlyRate * 2).toFixed(2)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Booking Summary */}
          {selectedTimeSlot && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTimeSlot.localTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{selectedDuration} minutes</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Lesson fee:</span>
                  <span>
                    ${(teacher.hourlyRate * (selectedDuration / 60)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Platform fee (7%):</span>
                  <span>
                    $
                    {(
                      teacher.hourlyRate *
                      (selectedDuration / 60) *
                      0.07
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>
                    $
                    {(
                      teacher.hourlyRate *
                      (selectedDuration / 60) *
                      1.07
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Book This Lesson"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        .calendar-container :global(.react-calendar) {
          width: 100%;
          background: transparent;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          padding: 1rem;
        }

        .calendar-container :global(.react-calendar__tile) {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .calendar-container :global(.react-calendar__tile.has-slots) {
          background: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
        }

        .calendar-container :global(.react-calendar__tile.selected-date) {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }

        .calendar-container :global(.react-calendar__tile.no-slots) {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          cursor: not-allowed;
        }

        .calendar-container
          :global(.react-calendar__tile:hover:not(.no-slots)) {
          background: hsl(var(--primary) / 0.2);
        }
      `}</style>
    </div>
  );
}

export default BookingCalendar;
