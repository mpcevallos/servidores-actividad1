// Se requiere Express
const express = require("express")

// Se requiere el JSON, lo guardamos en una constante
const employees = require("./employees.json")

// Crea API ejecutando la función de la librería Express
const app = express()

// Middleware Express JSON
app.use(express.json())

// 1. GET http://localhost:8000/api/employees/ Devuelve el listado total de Employees en formato JSON
app.get("/api/employees", (req, res) => {
  res.json(employees)
})

// 2. GET http://localhost:8000/api/employees/page1 Devuelve los Empleados del 0 al 1 del listado.
// Se utiliza el método de JavaScript slice, solución simplificada.
app.get("/api/employees/page1", (req, res) => {
  const startIndex = 0
  const endIndex = 1
  const firstTwoEmployees = employees.slice(startIndex, endIndex + 1)
  res.json(firstTwoEmployees)
})

// 2. GET http://localhost:8000/employees?page=1
// 2. GET http://localhost:8000/employees?page=2
// Devuelve los Empleados del 0 al 1 y del 2 al 3 del listado
app.get("/employees", (req, res) => {
  const page = parseInt(req.query.page) // Función parseInt y (req.query.params) para calcular los indices de inicio y fin de la paginación

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ code: "bad_request" })
  }

  const startIndex = (page - 1) * 2
  const endIndex = startIndex + 1

  const employeesGet = employees.slice(startIndex, endIndex + 1)

  res.json(employeesGet)
})

// 2. GET Devuelve los Empleados 2 y 3 del listado. http://localhost:8000/api/employees/page2
// Se utiliza el método de JavaScript slice, solución más simplificada.
app.get("/api/employees/page2", (req, res) => {
  const startIndex = 2
  const endIndex = 3
  const secondThirdEmployees = employees.slice(startIndex, endIndex + 1)
  res.json(secondThirdEmployees)
})

// 3. http://localhost:8000/employees?page=1
// GET Devolverá del elemento (2 * (N - 1)) al (2 * (N - 1)) + 1.
app.get("/employees/:page", (req, res) => {
  const page = parseInt(req.params.page)
  const startIndex = 2 * (page - 1)
  const endIndex = 2 * (page - 1) + 1
  const pageEmployees = employees.slice(startIndex, endIndex + 1)
  res.json(pageEmployees)
})

//4. GET http://localhost:8000/api/employees/oldest Ruta para obtener el empleado de mayor edad del listado
app.get("/api/employees/oldest/", (req, res) => {
  let oldestEmployee = employees[0]
  employees.forEach((employee) => {
    if (employee.age > oldestEmployee.age) {
      oldestEmployee = employee
    }
  })
  res.json(oldestEmployee)
})

// 5. GET http://localhost:8000/api/employees/user/?user=true Devuelve los Empleados con Privilegios de Usuario
app.get("/api/employees/user", (req, res) => {
  const userEmployees = employees.filter(
    (employee) => employee.privileges === "user"
  )
  res.json(userEmployees)
})

// 6. POST http://localhost:8000/api/employees Agregar un Nuevo Empleado al listado
app.post("/api/employees/", (req, res) => {
  const newEmployee = req.body

  // Verificar si el nuevo empleado cumple con todos los atributos requeridos
  if (
    newEmployee &&
    newEmployee.name &&
    newEmployee.age &&
    newEmployee.phone &&
    newEmployee.privileges &&
    newEmployee.favorites &&
    newEmployee.finished &&
    newEmployee.badges &&
    newEmployee.points
  ) {
    employees.push(newEmployee)
    res.json({ message: "¡Nuevo empleado agregado con éxito!" })
  } else {
    res.status(400).json({ code: "bad_request" })
  }
})

// 7. GET http://localhost:8000/api/employees/badges/black?badge=black Ver Empleados con Insignias Black
app.get("/api/employees/badges/:badges", (req, res) => {
  const badges = req.params.badges
  const badgeEmployees = employees.filter((employee) =>
    employee.badges.includes(badges)
  )
  res.json(badgeEmployees)
})

// 8. GET http://localhost:8000/api/employees/Martin Buscar un Empleado por Nombre
app.get("/api/employees/:name", (req, res) => {
  const name = req.params.name
  const employee = employees.find((employee) => employee.name === name)
  if (employee) {
    res.json(employee)
  } else {
    res.status(404).json({ code: "not_found" })
  }
})

// Función controladora, procesa cada una de las peticiones HTTP Esta función callback se va a ejecutar para atender las rutas o procesar a una petición
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" })
})

// Se levanta la API en el puerto 8000
app.listen(8000, () => {
  console.log('Ready! Api listening in Port 8000"')
})
