const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const students = require('./students.json')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const lastIdFinder = () => {
    return students.length
}

app.get('/students', (request, response) => {
    let whatToSendBack = students
    if (request.query.name !== undefined) {
        students.filter(stud => {
            if (stud.name.toString().replace(',', '') === request.query.name.replace(' ', '')) {
                whatToSendBack = stud
            }
        })
    } else if (request.query.id !== undefined) {
        students.filter(stud => {
            if (stud.id === Number.parseInt(request.query.id)) {
                whatToSendBack = stud
            }
        })
    }
    response.send(whatToSendBack)
})

app.get('/students/:studentId', ((req, res) => {
    let whatToSendBack = "No student ID exists"

    if (req.params !== undefined) {
        let reqObj = Object.values(req.params);
        let numReqObj = Number.parseInt(reqObj[0])
        students.filter(stud => {
            if (stud.id === numReqObj) {
                whatToSendBack = stud
            }
        })
    }
    res.send(whatToSendBack)
}))

app.get('/grades/:studentId', (req, res) => {
    let whatToSendBack = "No such student ID exists"
    if (req.params !== undefined) {
        let strIdArray = Object.values(req.params)
        let numID = Number.parseInt(strIdArray[0])
        students.filter(stud => {
            if (stud.id === numID){
                whatToSendBack =  stud.grades
            }
        })
    }
    res.send(whatToSendBack)
})

app.post('/register', (req, res) => {
    let whatToSendBack = 'Oofta, please use this format: {"firstName": "xxxxx", "lastName": "yyyyyy"}'
    let userInfo = req.body;
    if (userInfo.firstName !== undefined && userInfo.lastName !== undefined){
        let newStudentRecord = {
            id: lastIdFinder() +1,
            name: [userInfo.firstName, userInfo.lastName],
            profilePic: null,
            notes: [null],
            grades: [null]
        }
        whatToSendBack = [`SUCCESS!`, newStudentRecord]
    }
    res.send(whatToSendBack)
})

const port = 3000;
app.listen(port, () => console.log(`:==: Listening at port: ${port} :==:`))
