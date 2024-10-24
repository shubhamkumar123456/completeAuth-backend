const express = require('express')
const app = express();
const port = 8080;
const cors = require('cors')

const authRouter = require('./routes/auth')
const connection = require('./db')
connection()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('wlcome page')
})


app.use('/api',authRouter)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})