const PersonForm = (props) => {
  return (
    <form onSubmit={props.addNewPhone}>
      <div>
        Name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        Number: <input value={props.newPhone} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type='submit'>Add</button>
      </div>
    </form>
  )
}

export default PersonForm
