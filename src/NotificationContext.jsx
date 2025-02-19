import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
        return action.payload
    case "RESET":
        return null
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 0)

  const setNotification = (message, timeout = 5000) => {
    notificationDispatch({ type: 'SET', payload: message })
    setTimeout(() => {
      notificationDispatch({ type: 'RESET' })
    }, timeout)
  }

  return (
    <NotificationContext.Provider value={[notification, setNotification] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NotificationContext