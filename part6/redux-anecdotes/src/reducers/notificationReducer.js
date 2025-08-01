import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    },
  },
})

let timeoutId

export const { setNotification: setNotificationAction, clearNotification } =
  notificationSlice.actions

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    clearTimeout(timeoutId)
    dispatch(setNotificationAction(message))
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
