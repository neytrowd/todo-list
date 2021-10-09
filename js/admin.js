// import { getData, generatePassword, showPasswordSymbols, redirectToPage, showState, setData } from './utils.js';

class Users {

   init() {
      this.user = null;
      this.initElements();
      this.quit();
      this.addUser();
      this.generate();
      this.showPassword();
      this.showUsers(this.userList);
      this.deleteUser(this.userList);
      this.settings(this.userList, this.settingsBlock);
   }

   showPassword() {
      let { addPassword, changePassword } = this;
      let { addPasswordShow, changePassShow } = this;
      addPasswordShow.addEventListener('click', () => showPasswordSymbols(addPassword));
      changePassShow.addEventListener('click', () => showPasswordSymbols(changePassword));
   }

   generate() {
      let { addPassword, changePassword } = this;
      let { addPasswordGen, changePassGen } = this;

      function gen(activator, input) {
         activator.addEventListener('click', () => {
            if (activator.checked) input.value = generatePassword(10);
            else input.value = '';
         });
      }

      gen(addPasswordGen, addPassword);
      gen(changePassGen, changePassword);
   }

   addUser() {
      let { addLogin, addPassword, addAdmin, addUserData, addPasswordGen, addPasswordShow } = this;

      addUserData.addEventListener('click', () => {
         if (addLogin.value != '' && addPassword.value != '') {
            let users = getData('users');
            users.push({
               canEdit: true,
               canAdd: true,
               canDelete: true,
               login: addLogin.value,
               isAdmin: addAdmin.checked,
               password: addPassword.value,
            });
            addLogin.value = '';
            addPassword.value = '';
            addAdmin.checked = false;
            addPasswordGen.checked = false;
            addPasswordShow.checked = false;
            setData('users', users);
            this.showUsers(this.userList);
         }
      });
   }

   settings(userList, block) {
      userList.addEventListener('click', (event) => {
         let user = event.target.closest('li');
         let action = event.target.getAttribute('data-action');
         if (!user) return;
         if (action == 'change') {
            this.openSettingBlock(block);
            this.userPermissions(user.getAttribute('data-index'));
         }
      });
   }

   userPermissions(index) {
      this.showUserData(index);
      this.showUserPermissions(index);
      this.dragPermissions(index);
      this.saveChanges(index);
      this.close();
   }

   dragPermissions(index) {
      let users = getData('users');
      this.user = users[index];
      this.activePerm.ondragover = this.allowDrop;
      this.avialablePerm.ondragover = this.allowDrop;
      this.activePerm.addEventListener('drop', (event) => this.drop(event));
      this.avialablePerm.addEventListener('drop', (event) => this.drop(event));
      this.allPerm.addEventListener('dragstart', (event) => this.drag(event));
   }

   allowDrop(event) {
      event.preventDefault();
   }

   drag(event) {
      let item = event.target.closest('li');
      if (!item) return;
      item.setAttribute('id', `${new Date().getTime()}`);
      event.dataTransfer.setData('id', item.getAttribute('id'));
      event.dataTransfer.setData('action', item.getAttribute('data-action'));
   }

   drop(event) {
      let itemId = event.dataTransfer.getData('id');
      let action = event.dataTransfer.getData('action');
      let list = event.target.closest('ul');
      list.append(document.getElementById(itemId));
      this.changeState(list, action);
   }

   saveChanges(index) {
      let { save, changeLogin, changePassword, changeAdmin, changePassGen } = this;

      save.addEventListener('click', () => {
         if (changeLogin != '' && changePassword != '') {
            let users = getData('users');
            users[index] = this.user;
            users[index].login = changeLogin.value;
            users[index].password = changePassword.value;
            users[index].isAdmin = changeAdmin.checked;
            changePassGen.checked = false;
            setData('users', users);
            this.showUsers(this.userList);
            this.closeSettingBlock(this.settingsBlock);
         }
      }, { once: true });
   }

   changeState(list, action) {
      if (list.getAttribute('data-permission') == 'active') {
         this.user[action] = true;
      }
      else if (list.getAttribute('data-permission') == 'avialable') {
         this.user[action] = false;
      }
   }

   showUserPermissions(index) {
      let users = getData('users')
      let currentUser = users[index];
      let { activePerm, avialablePerm } = this;
      activePerm.innerHTML = '';
      avialablePerm.innerHTML = '';

      ['canEdit', 'canDelete', 'canAdd'].forEach(permission => {
         if (currentUser[permission]) {
            activePerm.innerHTML +=
               `<li draggable="true" data-action="${permission}">${permission}</li>`;
         }
         else {
            avialablePerm.innerHTML +=
               `<li draggable="true" data-action="${permission}">${permission}</li>`;
         }
      });
   }

   showUserData(index) {
      let users = getData('users');
      let { changeLogin, changePassword, changeAdmin } = this;
      changeLogin.value = users[index].login;
      changePassword.value = users[index].password;
      changeAdmin.checked = users[index].isAdmin;
   }

   openSettingBlock(block) {
      block.style.cssText = 'display: block';
      document.body.classList.add('active');
      document.documentElement.classList.add('noscroll');
   }

   closeSettingBlock(block) {
      block.style.cssText = 'display: none';
      document.body.classList.remove('active');
      document.documentElement.classList.remove('noscroll');
   }

   quit() {
      this.back.addEventListener('click', () => redirectToPage('notes'));
   }

   close() {
      this.exit.addEventListener('click', () => this.closeSettingBlock(this.settingsBlock));
   }

   deleteUser(userList) {
      userList.addEventListener('click', (event) => {
         let user = event.target.closest('li');
         let action = event.target.getAttribute('data-action');
         if (!user) return;
         let index = user.getAttribute('data-index');
         let users = getData('users');

         if (action == 'delete') {
            users.splice(index, 1);
            setData('users', users);
            showState('Item deleted');
            this.showUsers(userList);
         }
      });
   }

   showUsers(userList) {
      let users = getData('users');
      userList.innerHTML = "";
      users.forEach((user, index) => {
         if (index != getData("currentUser")) {
            userList.innerHTML += `
            <li data-index ="${index}">
               <p>${user.login}</p>
               <button data-action="change">Change</button>
               <button data-action="delete">Delete</button>
            </li>
         `;
         }
      });
   }

   initElements() {
      this.back = document.querySelector('#quit');
      this.userList = document.querySelector('#userList');
      this.settingsBlock = document.querySelector('#settingsBlock');
      // settings begin
      this.changeLogin = document.querySelector('#changeLogin');
      this.changePassword = document.querySelector('#changePassword');
      this.changeAdmin = document.querySelector('#changeAdmin');
      this.changePassGen = document.querySelector('#changePassGen');
      this.changePassShow = document.querySelector('#changePassShow');
      // permissions
      this.allPerm = document.querySelector('#allPermissions');
      this.activePerm = document.querySelector('#activePerm');
      this.avialablePerm = document.querySelector('#avialablePerm');
      this.exit = document.querySelector('#dontSave');
      this.save = document.querySelector('#changeSave');
      // add user
      this.addLogin = document.querySelector('#addLogin');
      this.addPassword = document.querySelector('#addPassword');
      this.addPasswordShow = document.querySelector('#addPasswordShow');
      this.addAdmin = document.querySelector('#addAdmin');
      this.addPasswordGen = document.querySelector('#addPasswordGen');
      this.addUserData = document.querySelector('#addUserData');
   }
}


new Users().init();