const mockUser = {
  validUser: {
    email: 'anifowose_habeeb@gmail.com',
    firstName: 'Anifowose',
    lastName: 'Habeeb',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  validUser2: {
    email: 'alimibasheer@gmail.com',
    firstName: 'Alimi',
    lastName: 'Basheer',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidPasswordUser: {
    email: 'anifowose_habeeb@gmail.com',
    firstName: 'Anifowose',
    lastName: 'Habeeb',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidAddressUser: {
    email: 'anifowose_habeeb@gmail.com',
    firstName: 'Anifowose',
    lastName: 'Habeeb',
    password: 'MAYOR.2324',
  },
  invalidEmailUser: {
    firstName: 'Anifowose',
    lastName: 'Habeeb',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidFirstnameUser: {
    email: 'anifowose_habeeb@gmail.com',
    lastName: 'Habeeb',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidLastnameUser: {
    email: 'anifowose_habeeb@gmail.com',
    firstName: 'Anifowose',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  email: 'anifowose_habeeb@gmail.com',
  password: 'MAYOR.2324',
  fakeUserEmail: 'tolufashola@gmail.com',
  fakeUserPassword: 'MSHA_WE11',
};
export default mockUser;