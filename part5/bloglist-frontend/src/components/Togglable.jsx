import PropTypes from 'prop-types'
import { useState } from 'react'

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false)

  if (!visible) {
    return (
      <div>
        <button onClick={() => setVisible(true)}>{buttonLabel}</button>
      </div>
    )
  }

  return (
    <div>
      {children}
      <button onClick={() => setVisible(false)}>cancel</button>
    </div>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Togglable
