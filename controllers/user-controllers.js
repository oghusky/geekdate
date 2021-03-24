const User = require("../models/User"),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken");

exports.postRegisterUser = async (req, res) => {
  try {
    const { fname, lname, nickname, email, password, blurb, dob } = req.body.register;
    const user = await User.findOne({ email });
    if (user) res.status(400).json({ msg: "User with that email already exists" });
    const newUser = await User.create({ fname, lname, nickname, email, password, blurb, dob })
    newUser && res.status(201).json({ msg: "User created" })
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" })
  }
}

exports.postLoginUser = async (req, res) => {
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZmEwMzYzYTkzYjdkMjJhNDU1NTI1MCIsImVtYWlsIjoiYUBiLmNvbSIsIm5hbWUiOiJQaGlsaXAgU2ltbW9ucyIsImlhdCI6MTYxMDIyMDU3Mn0.ZrlzbnfpGKLD_BxN_p1UsET1UcelZpTB5pzljQWFTSQ
  try {
    const { email, password } = req.body.login;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ msg: "Wrong email or password" });
    const isUser = await bcrypt.compare(password, user.password);
    if (isUser) {
      const token = jwt.sign({ id: user._id, email: user.email, fname: user.fname, nickname: user.nickname }, "philisawesome");
      return res
        .status(200)
        .json({
          token,
          msg: `${user.fname} Logged in`,
          user: {
            id: user._id,
            fname: user.fname,
            nickname: user.nickname,
            email: user.email
          }
        })
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

exports.getMyInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user });
    if (user) res.status(200).json({ msg: "Found User", user: user.populate("sessions") });
  } catch (err) {
    res.status(404).json({ msg: "User doesn't exist" })
  }
}

exports.putUpdateUser = async (req, res) => {
  try {
    const { nickname, password, blurb } = req.body.update;
    await User.findOneAndUpdate({ _id: req.user }, { new: true }, (err, user) => {
      user.nickname = nickname || user.nickname;
      user.password = password || user.password;
      user.blurb = blurb || user.blurb;
      user.save();
      res.status(201).json({ msg: "Info Updated", user })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Could not update info" })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = User.findOne({ _id: req.user });
    if (user) {
      await user.remove();
      res.status(200).json({ msg: "User deleted" })
    }
  } catch (err) {
    res.status(500).json({ msg: "Unable to remove user" })
  }
}