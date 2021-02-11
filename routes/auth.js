const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req,res) => {

    //Validate data input
    const validation = registerValidation(req.body)

    if(validation.error) {
        console.log('Error en Registro de Usuario: ' + validation.error.details[0].message)
        return res.send(validation.error.details[0].message)
    } else {
        console.log('Entrada Valida')
    }

    //Checking if the user already exists
    const emailExist = await User.findOne({email: req.body.email})
    
    if(emailExist) return res.status(400).send('Email already exists')

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password,salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })

    try {
        const registerUser = await user.save()
        //res.send({status: 'Registered', email: registerUser.email, name: registerUser.name, plain})
        res.status(201).send(registerUser)
        console.log('Se ha añadido el usuario ' + registerUser.email )
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {

    //Validate data input
    const validation = loginValidation(req.body)

    if(validation.error) {
        console.log('Credenciales Invàlidas: ' + validation.error.details[0].message)
        return res.send(validation.error.details[0].message)
    } else {
        console.log('Entrada Valida')
    }

    //Checking if the user already exists
    const user = await User.findOne({email: req.body.email})    
    if(!user) return res.status(400).send('Wrong Credentials n')

    //Check Password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    console.log(user.password)
    console.log(validPass)
    if(!validPass) return res.status(400).send('Wrong Credentials p')

    //Generate and assign Token
    console.log(process.env.TOKEN_SECRET)
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET)

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token
    }

    res.header('auth-token', token).send(userData)



    
})

module.exports = router