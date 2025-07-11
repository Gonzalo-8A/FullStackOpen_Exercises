import Header from './Header.jsx'
import Content from './Content.jsx'
import Total from './Total.jsx'

const Course = (props) => {

  return (
    <div>
      {props.courses.map((course, id) =>
        <div key={id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      )}
    </div>

  )
}

export default Course
