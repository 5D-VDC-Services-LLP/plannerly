//server/utils/dbHelpers.js
import UserPreferences from "../model/userPreferencesModel.js";

/**
 * Get or create user preferences
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User preferences object
 */
export const getOrCreateUserPreferences = async (userId) => {
  try {
    let userPrefs = await UserPreferences.findOne({ userId });
    
    if (!userPrefs) {
      userPrefs = new UserPreferences({ userId });
      await userPrefs.save();
    }
    
    return userPrefs;
  } catch (error) {
    throw new Error(`Failed to get or create user preferences: ${error.message}`);
  }
};

/**
 * Update user preferences with deep merge
 * @param {string} userId - The user ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated user preferences
 */
export const updateUserPreferences = async (userId, updates) => {
  try {
    const userPrefs = await getOrCreateUserPreferences(userId);
    
    // Deep merge preferences
    if (updates.preferences) {
      Object.keys(updates.preferences).forEach(key => {
        if (typeof updates.preferences[key] === 'object' && !Array.isArray(updates.preferences[key])) {
          userPrefs.preferences[key] = { ...userPrefs.preferences[key], ...updates.preferences[key] };
        } else {
          userPrefs.preferences[key] = updates.preferences[key];
        }
      });
    }
    
    // Merge custom parameters
    if (updates.customParams) {
      userPrefs.customParams = { ...userPrefs.customParams, ...updates.customParams };
    }
    
    await userPrefs.save();
    return userPrefs;
  } catch (error) {
    throw new Error(`Failed to update user preferences: ${error.message}`);
  }
};

/**
 * Get specific preference value
 * @param {string} userId - The user ID
 * @param {string} path - Dot notation path to preference (e.g., 'theme', 'notifications.email')
 * @returns {Promise<any>} Preference value
 */
export const getUserPreference = async (userId, path) => {
  try {
    const userPrefs = await getOrCreateUserPreferences(userId);
    
    const pathArray = path.split('.');
    let value = userPrefs;
    
    for (const key of pathArray) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return null;
      }
    }
    
    return value;
  } catch (error) {
    throw new Error(`Failed to get user preference: ${error.message}`);
  }
};

/**
 * Set specific preference value
 * @param {string} userId - The user ID
 * @param {string} path - Dot notation path to preference
 * @param {any} value - Value to set
 * @returns {Promise<Object>} Updated user preferences
 */
export const setUserPreference = async (userId, path, value) => {
  try {
    const userPrefs = await getOrCreateUserPreferences(userId);
    
    const pathArray = path.split('.');
    let current = userPrefs;
    
    // Navigate to the parent of the target property
    for (let i = 0; i < pathArray.length - 1; i++) {
      const key = pathArray[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Set the final value
    current[pathArray[pathArray.length - 1]] = value;
    
    await userPrefs.save();
    return userPrefs;
  } catch (error) {
    throw new Error(`Failed to set user preference: ${error.message}`);
  }
};

export default {
  getOrCreateUserPreferences,
  updateUserPreferences,
  getUserPreference,
  setUserPreference
};