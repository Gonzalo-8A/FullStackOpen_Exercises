import Part from './Part.jsx'

const Content = (props) => (
  <div>
    {props.parts.map((part, id) =>
      <Part key={id} part={part}/>
    )}
  </div>
)

export default Content
