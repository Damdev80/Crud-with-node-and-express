// Helper function to get authentication headers for API requests
export const getAuthHeaders = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    if (!user || !user.user_id) {
      console.warn('No user found in localStorage for authentication');
      return {};
    }
    
    return {
      'Content-Type': 'application/json',
      'x-user-id': user.user_id,
      'x-user-role': user.role
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

// Helper function to get auth headers for multipart form data (without Content-Type)
export const getAuthHeadersFormData = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    if (!user || !user.user_id) {
      console.warn('No user found in localStorage for authentication');
      return {};
    }
    
    return {
      'x-user-id': user.user_id,
      'x-user-role': user.role
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {};
  }
};

// Helper function to check if user is authenticated
export const isUserAuthenticated = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return !!(user && user.user_id);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
