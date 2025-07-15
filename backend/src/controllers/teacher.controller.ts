import { Request, Response } from 'express';
import TeacherProfile from '../models/teacher_profiles.model';

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await TeacherProfile.findAll();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
};
