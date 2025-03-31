import supabase from '../config/supabaseClient.js';

// ✅ Signup / Register User
export const signUpUser = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Only VJTI emails are allowed" });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  // ✅ After successful signup, store user details in 'users' table
//   await supabase.from('users').insert([{ id: data.user.id, email, name, role }]);

  return res.status(201).json({ message: "Signup successful", user: data.user });
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ message: "Login successful", user: data.user });
};

// ✅ Logout User
export const logoutUser = async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ message: "Logout successful" });
};
