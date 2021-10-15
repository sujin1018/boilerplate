const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //salt 글자 수
const jwt = require('jsonwebtoken');

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
    password: {
        type: String,
        minlength: 5
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

userSchema.pre('save', function(next) { // 저장하기 전에 
    var user = this;
    // 비밀번호를 암호화 시킨다
    if(user.isModified('password')) { // 비밀번호 변경할 때만
        bcrypt.genSalt(saltRounds, function(err, salt) { // salt 생성
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) { // hash: 암호회된 비밀번호
                if(err) return next(err)
                user.password = hash //plaintext를 암호회된 비밀번호로 바꿔줌
                next()
            })
        })   
    } 
    else { // 다른거를 바꿀 때는
        next()
    }
})

// comparePassword 메소드 정의 
userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword 1234567    암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken') 
    // user._id + 'secretToken' = token

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToekn = function(token, cb) {
    var user = this;


    // 토큰을 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token }, function(err, user){

            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User } //다른 곳에도 쓰일 수 있게