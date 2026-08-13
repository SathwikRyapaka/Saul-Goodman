/**
 * Normalizes a name string for exact, safe matching.
 * Converts to lowercase, trims whitespace, and collapses multiple spaces.
 * 
 * @param {string} name - The raw name string.
 * @returns {string} - The normalized string.
 */
const normalizeName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // collapse multiple spaces into one
};

/**
 * Checks if the given user's full name is exactly present (post-normalization)
 * inside the case's petitioners or respondents array.
 * 
 * @param {Object} caseData - The case data from MongoDB (must have petitioners/respondents).
 * @param {string} userFullName - The full name of the authenticated user (from req.user).
 * @returns {boolean} - True if authorized, false otherwise.
 */
const authorizeCaseAccess = (caseData, userFullName) => {
  if (!caseData || !userFullName) return false;

  const normalizedUserName = normalizeName(userFullName);

  const petitioners = caseData.petitioners || [];
  const respondents = caseData.respondents || [];

  const isPetitioner = petitioners.some(p => normalizeName(p.name) === normalizedUserName);
  const isRespondent = respondents.some(r => normalizeName(r.name) === normalizedUserName);

  return isPetitioner || isRespondent;
};

/**
 * Escapes characters in a string for use in a RegExp.
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

module.exports = {
  normalizeName,
  authorizeCaseAccess,
  escapeRegExp
};
