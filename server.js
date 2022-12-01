const express = require('express')
const app = express()

const port = process.env.PORT || 7000

app.use(express.static('public'))

function dbConnect() {
    // Db connection
const mongoose = require('mongoose')
const url = 'mongodb+srv://rajat4661:Rajat1598@cluster0.ncboalk.mongodb.net/comments'

mongoose.connect(url, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})

const connection = mongoose.connection
connection.once('open', function() {
    console.log('Database connected...')
}).catch(function(err){
    console.log('Connection failed...')
})
}
dbConnect()
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    username: { type: String, required: true },
    comment: { type: String, require: true }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)



app.use(express.json())

// Routes 
app.post('/api/comments', (req, res) => {
    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then(response => {
        res.send(response)
    })

})

app.get('/api/comments', (req, res) => {
    Comment.find().then(function(comments) {
        res.send(comments)
    })
})


const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

let io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)
    // Recieve event
    socket.on('comment', (data) => {
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data) 
    })
})