import React from 'react'
import { useNotification } from '../context/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) return null

  return (
    <div
      style={{
        border: 'solid 1px',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#cce5ff',
        color: '#004085',
      }}
    >
      {notification}
    </div>
  )
}

export default Notification
