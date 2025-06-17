export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}
// -> "30 Jun 2025"

export function truncate(str, max = 50) {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}