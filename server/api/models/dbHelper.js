/**
 * This is a mapper for the dummy database. perform all transactions here
 */
import dummyUsers from './dummyUsers';

const dbHelper = {
  getUser(userId) {
    for (let i = 0; i < dummyUsers.length; i += 1) {
      const { id } = dummyUsers[i];
      if (id === userId) {
        return dummyUsers[i];
      }
    }
    return -1;
  },
  getUserByEmail(userEmail) {
    for (let i = 0; i < dummyUsers.length; i += 1) {
      const { email } = dummyUsers[i];
      if (email === userEmail) {
        return dummyUsers[i];
      }
    }
    return -1;
  },
  removeAllUsers() {
    while (dummyUsers.length > 0) {
      dummyUsers.pop();
    }
  },
  addUser(data) {
    dummyUsers.push(data);
  },
};

export default dbHelper;
