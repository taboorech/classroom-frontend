export const dateNormalize = (date) => {
  return Intl.DateTimeFormat('ua', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}