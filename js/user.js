// import { getData, generatePassword, showPasswordSymbols, redirectToPage, setData, showState } from './utils.js';

class User {

   init() {
      this.initElements();
      this.showUserData();
      this.showPassword();
      this.saveChanges();
      this.generate();
      this.quit();
   }

   quit() {
      this.exit.addEventListener('click', () => redirectToPage('notes'));
   }

   saveChanges() {
      let { login, password, confirm, bio, save } = this;

      save.addEventListener('click', () => {
         if (login.value != '' && password != '') {
            if (password.value == confirm.value) {
               let users = getData('users');
               let currentUser = users[getData('currentUser')];
               currentUser.bio = bio.value;
               currentUser.login = login.value;
               currentUser.password = password.value;
               setData('users', users);
               redirectToPage('notes');
            }
            else {
               showState('The password must match');
            }
         }
         else {
            showState('The fields must not be empty');
         }
      });
   }

   generate() {
      let { password, confirm, passwordGen } = this;
      passwordGen.addEventListener('click', () => {
         if (passwordGen.checked) {
            let value = generatePassword(10);
            password.value = value;
            confirm.value = value;
         }
         else {
            password.value = '';
            confirm.value = '';
         }
      });
   }

   showPassword() {
      let { passwordShow, password, confirm } = this;
      passwordShow.addEventListener('click', () => {
         showPasswordSymbols(password);
         showPasswordSymbols(confirm);
      });
   }

   showUserData() {
      let { login, password, confirm, bio } = this;
      let users = getData('users');
      let currentUser = users[getData('currentUser')];
      login.value = currentUser.login;
      password.value = currentUser.password;
      confirm.value = currentUser.password;
      bio.value = currentUser.bio;
   }

   initElements() {
      this.login = document.querySelector('#userLogin');
      this.password = document.querySelector('#userPassword');
      this.confirm = document.querySelector('#userConfirm');
      this.passwordShow = document.querySelector('#userPassShow');
      this.passwordGen = document.querySelector('#userPassGen');
      this.bio = document.querySelector('#userBio');
      this.exit = document.querySelector('#userExit');
      this.save = document.querySelector('#userSave');
   }
}

new User().init();