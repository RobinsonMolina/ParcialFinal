const mongoose = require('mongoose')
const URI = "mongodb+srv://jazminmoreno01:hGFoGK5veGBf0M76@cluster0.he758.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.set('strictQuery', false)

mongoose.connect(URI)
    .then(() => console.log('base conectada'))
    .catch((err) => console.log('conexion fallida: ' + err))

module.exports = mongoose