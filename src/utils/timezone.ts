import moment from 'moment-timezone'

// Timezone configuration
export const APP_TIMEZONE = 'America/Lima'
export const APP_LOCALE = 'es'

// Configure moment to use Lima timezone by default
moment.tz.setDefault(APP_TIMEZONE)
moment.locale(APP_LOCALE)

// Helper function to get current time in Lima timezone
export const getLimaTime = () => {
  return moment.tz(APP_TIMEZONE)
}

// Helper function to format date in Lima timezone
export const formatLimaDate = (date: string | Date, format: string = 'DD/MM/YYYY HH:mm') => {
  return moment.tz(date, APP_TIMEZONE).format(format)
}

// Helper function to convert any date to Lima timezone
export const toLimaTime = (date: string | Date) => {
  return moment.tz(date, APP_TIMEZONE)
}
