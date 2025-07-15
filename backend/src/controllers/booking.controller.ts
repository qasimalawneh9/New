import { Request, Response } from 'express';
import Booking from '../models/bookings.model';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { studentId, teacherId, lessonDate, duration, totalAmount } = req.body;
    const booking = await Booking.create({
      studentId,
      teacherId,
      lessonDate,
      duration,
      totalAmount,
      bookingReference: 'BK-' + Math.floor(Math.random() * 1000000),
      status: 'pending',
      currency: 'USD',
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error });
  }
};
