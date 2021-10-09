function getData(key) {
   return JSON.parse(localStorage.getItem(key));
}

function setData(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}

function clearData(key) {
   localStorage.removeItem(key);
}

function redirectToPage(page) {
   setTimeout(() => {
      window.location.href = `${page}.html`;
   }, 0);
}

function showMessage(message) {
   alert(message);
}

function createElement(type, block, value) {
   let item = document.createElement(type);
   item.innerHTML = value;
   block.append(item);
   return item;
}

function showPasswordSymbols(input) {
   if (input.type == 'password') input.type = 'text';
   else input.type = 'password';
}

function generatePassword(length) {
   let result = '';

   for (let i = 0; i < length; i++) {
      let direction = Math.random();

      if (direction > 0.6) {
         result += String.fromCodePoint(randomNumber(65, 90));
      } 
      else if (direction > 0.3 && direction < 0.7) {
         result += String.fromCodePoint(randomNumber(97, 122));
      }
      else {
         result += String.fromCodePoint(randomNumber(48, 57));
      }
   }

   return result;

   function randomNumber(min, max) {
      return Math.round(min + Math.random() * (max - min));
   }
}

function showState(message) {
   let wrap = document.querySelector('#wrap');
   let block = document.createElement('div');
   wrap.append(block);
   block.innerHTML = message;
   block.style.cssText = `
      position: fixed;
      text-align: center;
      min-width: 150px;
      max-width: 200px;
      padding: 10px;
      bottom: 35px;
      right: -300px;
      background: #fff;
      font-size: 18px;
      color:  #4ec2e7;
      z-index: 3;
      transition: 0.5s all linear;
      box-shadow: 0 0 5px 0 rgb(160, 159, 159);
      font-family: Arial, Helvetica, sans-serif;
   `;

   setTimeout(() => {
      block.style.right = '30px';
   }, 300);

   setTimeout(() => {
      block.style.right = '-300px';
   }, 2200);

   setTimeout(() => {
      block.remove();
   }, 2500);
}