const UserModel = require('../../models/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signUpUser = async(params) =>{
    // Get data from request(query)
    const userData = params.userInput

    try {
        // If user with that email exists...
        const userIsAlreadyExist = await UserModel.findOne({ email: userData.email })
        // ... we will throw an error
        if (userIsAlreadyExist) throw new Error("User with that email is already exists")

        // Else we will create new user and give him hashed password
        const hashedPassword = await bcrypt.hash(userData.password, 12)
        const newUser = new UserModel({ ...userData, password: hashedPassword })
        // ... and finally save this object at the database
        const token = jwt.sign({ userId:newUser._id, email:newUser.email }, 'secretkey', { expiresIn: '1h' })
        await newUser.save()
        console.log( {...newUser, token:token, tokenExpiration: 1} )
        return { userId:newUser._id, token:token, tokenExpiration: 1}
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.signInUser = async(params) =>{
    // Extracting email and password from params
    const { email, password } = params
    // Try to find existed user
    const existedUser = await UserModel.findOne({ email: email })
    // If user with that email does not exists, then we will throw an error
    if (!existedUser) throw new Error('User with that email does not exists!')
    // If all fine, we check user's password
    const passwordIsCorrect = await bcrypt.compare(password, existedUser.password)
    // If it's not correct, we will throw an error
    if (!passwordIsCorrect) throw new Error('Password is incorrect!')

    // Else, we create new token for user, that expires is 1 hour
    const token = jwt.sign({ userId:existedUser._id, email:existedUser.email }, 'secretkey', { expiresIn: '1h' })
    // ... and as response (backend) we just return this object:
    return { userId: existedUser._id, token:token, tokenExpiration: 1 }
}

