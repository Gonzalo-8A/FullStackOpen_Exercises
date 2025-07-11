const Persons = (props) => {
  return (
    <ul>
      {props.filteredPersons.map((person) => {
        return (
          <li style={{ listStyle: 'none' }} key={person.name}>
            {person.name} - {person.number}
          </li>
        )
      })}
    </ul>
  )
}

export default Persons
