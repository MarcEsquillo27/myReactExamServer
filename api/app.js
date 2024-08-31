const express = require('express')
require('dotenv').config()
const port = 12799
const helmet = require('helmet')
const employee = require('../routes/employee.js')

const cors = require('cors')
const app = express()
app.use(helmet())

app.use(cors())
 
app.use('/employee', employee)

 
app.listen(port,function(){
	console.log('listening to port ' + port);
})