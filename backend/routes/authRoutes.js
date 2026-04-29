import bcrypt from "bcryptjs";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 🔒 hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed, // ✅ store hashed password
    });

    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});