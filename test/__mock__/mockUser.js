const mockUser = {
  validUser: {
    email: 'anifowose_habeeb@gmail.com',
    first_name: 'Anifowose',
    last_name: 'Habeeb',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  validUser2: {
    email: 'alimibasheer@gmail.com',
    first_name: 'Alimi',
    last_name: 'Basheer',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidPasswordUser: {
    email: 'anifowose_habeeb@gmail.com',
    first_name: 'Anifowose',
    last_name: 'Habeeb',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidAddressUser: {
    email: 'anifowose_habeeb@gmail.com',
    first_name: 'Anifowose',
    last_name: 'Habeeb',
    password: 'MAYOR.2324',
  },
  invalidEmailUser: {
    first_name: 'Anifowose',
    last_name: 'Habeeb',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidFirstnameUser: {
    email: 'anifowose_habeeb@gmail.com',
    last_name: 'Habeeb',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  invalidLastnameUser: {
    email: 'anifowose_habeeb@gmail.com',
    first_name: 'Anifowose',
    password: 'MAYOR.2324',
    address: 'NO 45, Harmony reservation area, ganmo',
  },
  email: 'anifowose_habeeb@gmail.com',
  password: 'MAYOR.2324',
  fakeUserEmail: 'tolufashola@gmail.com',
  fakeUserPassword: 'MSHA_WE11',
};
export default mockUser;
