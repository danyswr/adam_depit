import { ApiResponse } from "@shared/schema";

const API_URL = 'https://script.google.com/macros/s/AKfycbyNHxX8D69GlkvQR0CBUJjeQIzbsBTKcRzqhB1dhUfbyIJc9KC4tra9C21rWZVMwJ62/exec';

export async function apiCall<T = any>(data: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// User authentication
export async function loginUser(email: string, password: string) {
  return apiCall({
    email,
    password,
  });
}

export async function registerUser(userData: any) {
  return apiCall(userData);
}

// UKM operations
export async function getUKMs(email: string = 'guest@example.com') {
  return apiCall({
    email,
    action: 'read',
  });
}

export async function createUKM(email: string, ukmData: any) {
  return apiCall({
    email,
    action: 'create',
    data: ukmData,
  });
}

export async function updateUKM(email: string, ukmId: string, ukmData: any) {
  return apiCall({
    email,
    action: 'update',
    id_ukm: ukmId,
    data: ukmData,
  });
}

export async function deleteUKM(email: string, ukmId: string) {
  return apiCall({
    email,
    action: 'delete',
    id_ukm: ukmId,
  });
}

// UKM Registration operations
export async function registerToUKM(email: string, ukmId: string) {
  return apiCall({
    email,
    action: 'register',
    id_ukm: ukmId,
  });
}

export async function getUserUKMs(email: string) {
  return apiCall({
    email,
    action: 'getUserUKMs',
  });
}

export async function unregisterFromUKM(email: string, ukmId: string) {
  return apiCall({
    email,
    action: 'unregister',
    id_ukm: ukmId,
  });
}
