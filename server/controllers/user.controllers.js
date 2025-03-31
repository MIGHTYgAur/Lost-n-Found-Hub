import supabase from '../config/supabaseClient.js';

// ✅ Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(data);
};

// ✅ Get User by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) return res.status(404).json({ error: "User not found" });

  return res.status(200).json(data);
};

// ✅ Update User Info (User can update their own profile)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase.from('users').update({ name }).eq('id', id);

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ message: "User updated successfully", user: data });
};

// ✅ Delete User (Admin Only)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('users').delete().eq('id', id);

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ message: "User deleted successfully" });
};
