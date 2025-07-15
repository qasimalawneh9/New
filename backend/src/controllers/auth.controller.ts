import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // ملاحظة: في المشروع الحقيقي يجب التحقق من قاعدة البيانات وكلمة المرور
  if (email === 'admin@talkcon.com' && password === '123456') {
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  // ملاحظة: في المشروع الفعلي يتم إنشاء المستخدم داخل قاعدة البيانات
  return res.status(201).json({ message: 'User registered', email, role });
};
