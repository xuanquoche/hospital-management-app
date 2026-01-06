export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  username?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthResponse;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: User;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface UserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}
