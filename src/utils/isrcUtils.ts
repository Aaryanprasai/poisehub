
// This would typically connect to a database to manage ISRCs
// For this demo, we're using mock data

/**
 * Validate if an ISRC code matches the expected format
 * Format with hyphens (for input): CC-XXX-YY-NNNNN
 * Format without hyphens (for storage): CCXXXYYNNNNN
 */
export function validateIsrc(isrc: string): boolean {
  // First normalize by removing hyphens
  const normalizedIsrc = isrc.replace(/-/g, '');
  
  // Check if it matches the expected pattern when normalized
  const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;
  return isrcRegex.test(normalizedIsrc);
}

/**
 * Format an ISRC code with hyphens for display purposes 
 */
export function formatIsrcWithHyphens(isrc: string): string {
  // Remove any existing hyphens first
  const normalizedIsrc = isrc.replace(/-/g, '');
  
  if (normalizedIsrc.length !== 12) {
    return isrc; // Return original if not the right length
  }
  
  // Format as CC-XXX-YY-NNNNN
  return `${normalizedIsrc.substring(0, 2)}-${normalizedIsrc.substring(2, 5)}-${normalizedIsrc.substring(5, 7)}-${normalizedIsrc.substring(7)}`;
}

/**
 * Normalize ISRC by removing hyphens for storage
 */
export function normalizeIsrc(isrc: string): string {
  return isrc.replace(/-/g, '');
}

/**
 * Generate a new ISRC code based on the configured prefix and last sequence
 */
export function generateIsrc(
  prefix: { countryCode: string; registrantCode: string; year: string },
  lastSequence: number
): string {
  // Increment the sequence and pad with leading zeros to ensure 5 digits
  const nextSequence = (lastSequence + 1).toString().padStart(5, '0');
  
  // Format without hyphens: CCXXXYYNNNNN
  return `${prefix.countryCode.toUpperCase()}${prefix.registrantCode.toUpperCase()}${prefix.year}${nextSequence}`;
}

/**
 * Check if we need to reset the sequence for a new year
 */
export function shouldResetSequence(currentYear: string, configuredYear: string): boolean {
  return currentYear !== configuredYear;
}

/**
 * Get the current year in YY format
 */
export function getCurrentYearYY(): string {
  return new Date().getFullYear().toString().substring(2);
}

// In a real app, these would be API calls or database operations
// For this demo, we'll use these mock functions

// Mock of the ISRC configuration stored in a database
let mockIsrcConfig = {
  countryCode: "US",
  registrantCode: "ABC",
  year: getCurrentYearYY(),
  lastSequence: 123
};

export function getIsrcConfig() {
  return { ...mockIsrcConfig };
}

export function updateIsrcConfig(newConfig: typeof mockIsrcConfig) {
  mockIsrcConfig = { ...newConfig };
  return mockIsrcConfig;
}

export function incrementIsrcSequence() {
  // Check if we need to reset for a new year
  const currentYearYY = getCurrentYearYY();
  if (shouldResetSequence(currentYearYY, mockIsrcConfig.year)) {
    mockIsrcConfig.year = currentYearYY;
    mockIsrcConfig.lastSequence = 0;
  } else {
    mockIsrcConfig.lastSequence += 1;
  }
  
  return { ...mockIsrcConfig };
}

export function getNextIsrc(): string {
  return generateIsrc(
    { 
      countryCode: mockIsrcConfig.countryCode, 
      registrantCode: mockIsrcConfig.registrantCode, 
      year: mockIsrcConfig.year 
    }, 
    mockIsrcConfig.lastSequence
  );
}
