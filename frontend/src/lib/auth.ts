import api from './api';

export interface RegisterPayload {
  email: string;
  password: string;
  role: 'CLIENT' | 'FREELANCER';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export async function registerUser(payload: RegisterPayload): Promise<ApiResponse> {
  try {
    const response = await api.post('/register/', {
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });

    return {
      success: true,
      message: response.data?.message || 'User registered successfully.',
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Registration failed.',
        errors: error.response.data?.errors || error.response.data || null,
      };
    }

    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
}

export async function signup(payload: RegisterPayload): Promise<ApiResponse> {
  try {
    const response = await api.post('/register/', {
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });

    return {
      success: true,
      message: response.data?.message || 'Account created successfully.',
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Signup failed.',
        errors: error.response.data?.errors || error.response.data || null,
      };
    }

    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload): Promise<ApiResponse> {
  try {
    const response = await api.post('/login/', {
      email: payload.email,
      password: payload.password,
    });

    return {
      success: true,
      message: response.data?.message || 'Login successful.',
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Login failed.',
        errors: error.response.data?.errors || error.response.data || null,
      };
    }

    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
}

export async function logoutUser(): Promise<ApiResponse> {
  try {
    await api.post('/logout/');
  } catch (error: any) {
    // optional: ignore backend errors on logout
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  return {
    success: true,
    message: 'Logged out successfully.',
  };
}
