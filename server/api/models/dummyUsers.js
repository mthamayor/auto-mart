const dummyUsers = [];
export default dummyUsers;

export const getUser = userId => dummyUsers.find(user => user.id === userId) || -1;

export const getUserByEmail = userEmail => dummyUsers.find(user => user.email === userEmail) || -1;

export const removeAllUsers = () => {
  dummyUsers.splice(0, dummyUsers.length);
};

export const addUser = (data) => {
  dummyUsers.push(data);
};

export const setAdmin = (id) => {
  const user = getUser(id);
  user.isAdmin = true;
};

export const changePassword = (email, password) => {
  const user = getUserByEmail(email);
  user.password = password;
};
