const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

async function registerUser(request, response) {
  try {
    const { name, email, mobile_number, password, profie_pic } = request.body;

    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      return response.status(400).json({
        message: "Already user exits",
        error: true,
      });
    }

    //password into hashpassword
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      mobile_number,
      profie_pic,
      password: hashpassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return response.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = registerUser;
