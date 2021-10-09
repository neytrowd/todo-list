// import { users } from './Data/StorageUsers.js';
// import { getData, setData, redirectToPage, showMessage } from './utils.js';

class Auth {
   constructor(data) {
      this.initUsers('users', data);
      this.initElements();
      this.signIn();
   }

   initUsers(key, data) {
      if (!localStorage.key(key)) {
         setData(key, data);
      }
   }

   signIn() {
      this.submit.addEventListener('click', () => {
         this.checkPassword();
      });
   }

   checkPassword() {
      let authorized = false;
      let password = this.password.value;
      let login = this.login.value.toLowerCase();

      getData('users').forEach((user, index) => {
         if (user.login == login && user.password == password) {
            authorized = true;
            redirectToPage('notes');
            setData('currentUser', index);
         }
      });

      if (!authorized) showMessage('Неверный логин или пароль!!!');
   }

   initElements() {
      this.login = document.querySelector('#login');
      this.password = document.querySelector('#password');
      this.submit = document.querySelector('#signIn');
   }
}

new Auth(users);
