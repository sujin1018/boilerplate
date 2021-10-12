const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //스페이스 없애주는 역할
        unique: 1 // 같은 이메일은 사용하지 못하게
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { //유효기간
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User } //다른 곳에도 쓰일 수 있게