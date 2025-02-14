import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true, 
            minlength: 4, 
            maxlength: 20,
            validate: {
                validator: function(value) {
                    return !/^\d+$/.test(value); // Ensures username is not all numbers
                },
                message: "Username should not contain only numbers"
            } 
        },
        password: { type: String, required: true},
        fullName: { type: String, required: true, 
            validate: {
                validator: function(value) {
                    return /^[A-Za-z\s]+$/.test(value); // Allows only alphabets and spaces
                },
                message: "Full name should only contain alphabets and spaces"
            } 
        },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        dateOfBirth: { type: Date, required: true },
        country: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

export {User}