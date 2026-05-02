/**
 * @param {string} isoString
 * @returns {string} formatted date e.g. "May 10, 2025"
 */
export const formatDate = (isoString) => {
  if (!isoString) return 'No due date';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * @param {string} dueDate - ISO date string
 * @returns {boolean}
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  return due < today;
};
