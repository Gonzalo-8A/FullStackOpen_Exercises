import PropTypes from 'prop-types'

const Notification = ({ message, testId }) => {
  if (!message) return null

  const style = {
    color: message.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={style} data-testid={testId}>{message.text}</div>
}

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    text: PropTypes.string.isRequired,
  }),
}

export default Notification
