// import { notes } from './Data/Storage.js';
// import { getData, createElement, clearData, redirectToPage, showState } from './utils.js';

class Notes {
   constructor(data) {
      this.notes = data;
      this.allNotes = data;
   }

   init() {
      this.initElements();
      this.showNewNoteState();
      this.dragNotes();
      // this.droppable();
      this.checkUserPermissions();
      this.logout();
      this.myProfile();
   }

   checkUserPermissions() {
      if (getData('currentUser') != null) {
         let users = getData('users');
         let currentUser = users[getData('currentUser')];

         this.isAdmin(currentUser);
         this.userData(currentUser);
         this.render(this.notes);
         this.searchNote();

         if (!currentUser.canAdd) {
            this.noteInputBlock.remove();
         }
         if (currentUser.canEdit) {
            this.performNote();
            this.editNote();
         }
         if (currentUser.canDelete) {
            this.deleteNote();
         }
         if (currentUser.canAdd) {
            this.addNote(this.noteText, this.noteDate, this.noteImportant);
         }
      }
   }

   isAdmin(user) {
      if (user.isAdmin) {
         let link = createElement('li', this.userPages, 'Permissions');
         link.addEventListener('click', () => redirectToPage('admin'));
      }
   }

   userData(user) {
      this.userName.innerHTML = user.login;
   }

   logout() {
      this.userLogout.addEventListener('click', () => {
         clearData('currentUser');
         redirectToPage('auth');
      });
   }

   myProfile() {
      this.userProfile.addEventListener('click', () => {
         redirectToPage('user');
      });
   }

   render(data) {
      let allNotes = this.addIndex(data);
      let doneNotes = this.filterDone(data);
      let processNotes = this.filterInProcess(data);
      let importantNotes = this.filterImportant(data);

      this.showAllNotes(this.allNotesBlock, allNotes);
      this.showCategoryNotes(this.processNotesBlock, processNotes);
      this.showCategoryNotes(this.importantNotesBlock, importantNotes);
      this.showCategoryNotes(this.doneNotesBlock, doneNotes);
   }

   searchNote() {
      this.search.addEventListener('keyup', () => {
         let value = this.search.value.toLowerCase();
         this.notes = this.allNotes.filter(el => {
            return el.target.toLowerCase().includes(value);
         });
         if (value == '') this.notes = this.allNotes;
         this.render(this.notes);
      });
   }

   performNote() {
      this.allNotesBlock.addEventListener('click', (event) => {
         let item = event.target.closest('li');
         let action = event.target.getAttribute('data-action');
         if (!item) return;
         let index = item.getAttribute('data-index');

         if (action == 'perform') {
            this.notes[index].done = !this.notes[index].done;
            this.render(this.notes);
         }
      });
   }

   editNote() {
      let item, action, index;

      this.noteTabBlock.addEventListener('click', (event) => {
         item = event.target.closest('li');
         action = event.target.getAttribute('data-action');
         if (!item) return;
         index = item.getAttribute('data-index');

         if (action == 'edit') {
            this.editBlock.style.display = 'block';
            document.body.classList.add('active');
            document.documentElement.classList.add('noscroll');
         }
      });

      this.editExit.addEventListener('click', () => close());
      this.editSave.addEventListener('click', () => {
         if (this.editText != '') {
            this.notes[index].target = this.editText.value;
            if (this.editDate.value != '') {
               this.notes[index].deadline = this.formatDate(this.editDate.value);
            }
            this.render(this.notes);
            showState('Item changed');
            close();
         }
      })

      let close = () => {
         this.editText.value = '';
         this.editDate.value = '';
         this.editBlock.style.display = 'none';
         document.body.classList.remove('active');
         document.documentElement.classList.remove('noscroll');
      };
   };

   deleteNote() {
      this.noteTabBlock.addEventListener('click', (event) => {
         let action = event.target.getAttribute('data-action');
         let item = event.target.closest('li');
         if (!item) return;
         let index = item.getAttribute('data-index');

         if (action == 'delete') {
            this.notes.splice(index, 1);
            this.render(this.notes);
            showState('Item deleted');
         }
      });
   }

   showNewNoteState() {
      this.noteImportant.addEventListener('click', () => {
         if (this.noteImportant.checked) showState('Important');
         else showState('Usual');
      });
   }

   addNote(target, deadline, important) {
      this.noteAdd.addEventListener('click', () => {
         if (target.value != '' & deadline.value != '') {
            this.notes.push({
               done: false,
               target: target.value,
               important: important.checked,
               deadline: this.formatDate(deadline.value)
            });

            target.value = '';
            deadline.value = '';
            important.checked = false;
            this.render(this.notes);
            showState('Note added');
         }
      });
   }

   dragNotes() {
      this.processNotesBlock.ondragover = this.allowDrop;
      this.importantNotesBlock.ondragover = this.allowDrop;
      this.doneNotesBlock.ondragover = this.allowDrop;
      this.processNotesBlock.addEventListener('drop', (event) => this.drop(event));
      this.importantNotesBlock.addEventListener('drop', (event) => this.drop(event));
      this.doneNotesBlock.addEventListener('drop', (event) => this.drop(event));
      this.categoryItems.addEventListener('dragstart', (event) => this.drag(event));
   }

   droppable(event) {
      let elemBelow;
      let current;
      let ol;
      let droppableBlock = (event) => {
         elemBelow = document.elementFromPoint(event.clientX, event.clientY);
         ol = elemBelow.closest('ol');
         if (!ol) return;
         if (ol != current) {
            if (current) current.style.background = '';
            current = ol;
            if (current) current.style.background = '#ccc';
         }
      }
      document.addEventListener('mousedown', (event) => {
         document.onmousemove = (event) => droppableBlock(event);
      });
      document.addEventListener('mouseup', (event) => {
         document.onmousemove = null;
      });
   }

   allowDrop(event) {
      event.preventDefault();
   }

   drag(event) {
      let item = event.target.closest('li');
      if (!item) return;
      item.setAttribute('id', `${new Date().getTime()}`);
      event.dataTransfer.setData('id', item.getAttribute('id'));
      event.dataTransfer.setData('index', item.getAttribute('data-index'));
   }

   drop(event) {
      let itemId = event.dataTransfer.getData('id');
      let itemIndex = event.dataTransfer.getData('index');
      let list = event.target.closest('ol');
      list.append(document.getElementById(itemId));
      this.changeNoteState(list, itemIndex);
   }

   changeNoteState(list, itemIndex) {
      if (list.getAttribute('data-block') == 'process') {
         this.notes[itemIndex].done = false;
         this.notes[itemIndex].important = false;
      }
      if (list.getAttribute('data-block') == 'important') {
         this.notes[itemIndex].done = false;
         this.notes[itemIndex].important = true;
      }
      if (list.getAttribute('data-block') == 'done') {
         this.notes[itemIndex].done = true;
      }
      this.render(this.notes);
   }

   filterDone(notes) {
      return notes.filter(el => el.done);
   }

   filterInProcess(notes) {
      return notes.filter(el => {
         if (!el.done && !el.important) {
            return true;
         }
      });
   }

   filterImportant(notes) {
      return notes.filter(el => {
         if (el.important && !el.done) {
            return true;
         }
      });
   }

   addIndex(data) {
      return data.map((el, index) => {
         el.index = index;
         return el;
      });
   }

   formatDate(date) {
      let data = date.split('-');
      return new Date(data[0], data[1] - 1, data[2]);
   }

   showCategoryNotes(block, notes) {
      block.innerHTML = '';
      if (notes.length) {
         notes.forEach(el => {
            let item = document.createElement('li');
            let date = el.deadline.toLocaleString().split(',');
            item.className = 'notes-tab__category-item';
            item.setAttribute('data-index', el.index);
            item.setAttribute('draggable', true);
            block.append(item);
            item.innerHTML = `
               <p class="notes-tab__category-name">${el.target}</p>
               <p class="notes-tab__category-date">${date[0]}</p>
               <button class="notes-tab__category-delete" data-action='delete'>Delete</button>
               <button class="notes-tab__category-edit" data-action='edit'>Edit</button>
            `;
         });
      }
   }

   showAllNotes(block, notes) {
      block.innerHTML = '';
      if (notes.length) {
         notes.forEach(el => {
            let item = document.createElement('li');
            item.className = 'notes-tab__list-item';
            item.setAttribute('data-index', el.index);
            if (el.done) item.classList.add('done');
            if (el.important) item.classList.add('important');
            block.append(item);
            item.innerHTML = `
               <p class="notes-tab__list-name" data-action='perform'>${el.target}</p>
               <p class="notes-tab__list-date">${el.deadline.toLocaleString()}</p>
               <button class="notes-tab__list-delete" data-action='delete'>Delete</button>
               <button class="notes-tab__list-edit" data-action='edit'>Edit</button>
            `;
         });
      }
   }

   initElements() {
      // add note begin
      this.noteInputBlock = document.querySelector('#inputData');
      this.noteDate = document.querySelector('#date');
      this.noteText = document.querySelector('#text');
      this.noteAdd = document.querySelector('#addButton');
      this.noteImportant = document.querySelector('#important');
      // user pages begin
      this.userName = document.querySelector('#userName');
      this.userPages = document.querySelector('#userPages');
      this.userLogout = document.querySelector('#logout');
      this.userProfile = document.querySelector('#profile');
      // notes blocks begin
      this.search = document.querySelector('#searchText');
      this.noteTabBlock = document.querySelector('#noteTabBlock');
      this.allNotesBlock = document.querySelector('#allNotes');
      this.categoryItems = document.querySelector('#categoryItemsBlock');
      this.processNotesBlock = document.querySelector('#processNotes');
      this.importantNotesBlock = document.querySelector('#importantNotes');
      this.doneNotesBlock = document.querySelector('#doneNotes');
      // edit block begin
      this.editBlock = document.querySelector('#editBlock');
      this.editText = document.querySelector('#editText');
      this.editDate = document.querySelector('#editDate');
      this.editSave = document.querySelector('#editSave');
      this.editExit = document.querySelector('#editExit');
   }
}

new Notes(notes).init();