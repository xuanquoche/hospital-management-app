export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  username?: string;
  phone?: string;
  address?: string;
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

export interface RefreshTokenResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
