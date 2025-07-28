const User = require('../model/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  let { username, email, password, role } = req.body;

  try {
    if (email === "admin@gmail.com") role = "ADMIN";

    const hashed = await bcrypt.hash(password, 10);

    const imagePath = req.file ? req.file.filename : null;

    const user = await User.create({
      username,
      email,
      password: hashed,
      image: imagePath,
      role
    });

    return res.status(201).json({ message: "User registered", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed", details: err.message });
  }
};


exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const exist = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });

    if (!exist) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, exist.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: exist._id, role: exist.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   return res.status(200).json({ 
  token, 
  user: {
    _id: exist._id,
    username: exist.username,
    email: exist.email,
    role: exist.role,
    image: exist.image
  }
});

  } catch (err) {
    return res.status(500).json({ error: "Login failed", details: err.message });
  }
};

exports.getAllUsers=async(req,res)=>{
  try{
  const users =await User.find();
  res.status(200).json(users);

  }catch(err){
    return res.status(400).json({message:"not found users"})
  }

}

exports.deleteUser=async(req,res)=>{
  const userId = req.params.id;
  try{
    const deleted = await User.findByIdAndDelete(userId);
    res.status(201).json({message:"user deleted"})
  }
 catch(err){
    return res.status(400).json({message:"not found users"})
  }
}