const qS = (el) => document.querySelector(el);
const qSAll = (el) => document.querySelectorAll(el);

let cart = [];
let modalqtde = 1;
let modalKey = 0;

pizzaJson.map((item, index) => {
   let pizzaItem = qS('.models .pizza-item').cloneNode(true);

   pizzaItem.setAttribute('data-key', index);
   pizzaItem.querySelector('.pizza-item--img img').src = item.img;

   pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
   pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
   pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

   pizzaItem.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();

      let key = e.target.closest('.pizza-item').getAttribute('data-key');
      modalqtde = 1;
      modalKey = key;

      qS('.pizzaBig img').src = pizzaJson[key].img;
      qS('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      qS('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      qS('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
      qS('.pizzaInfo--size.selected').classList.remove('selected');
      qSAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
         if (sizeIndex == 2) {
            size.classList.add('selected');
         }
         size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      });
      qS('.pizzaInfo--qt').innerHTML = modalqtde;

      qS('.pizzaWindowArea').style.opacity = 0;
      qS('.pizzaWindowArea').style.display = 'flex';
      setTimeout(() => {
         qS('.pizzaWindowArea').style.opacity = 1;
      }, 200);
   })

   qS('.pizza-area').append(pizzaItem);
});

function closeModal() {
   qS('.pizzaWindowArea').style.opacity = 0;
   setTimeout(() => {
      qS('.pizzaWindowArea').style.display = 'none';
   }, 500);
}
qSAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
   item.addEventListener('click', closeModal);
})

qS('.pizzaInfo--qtmenos').addEventListener('click', () => {
   if (modalqtde > 1) {
      modalqtde--;
      qS('.pizzaInfo--qt').innerHTML = modalqtde;
   }
})
qS('.pizzaInfo--qtmais').addEventListener('click', () => {
   modalqtde++;
   qS('.pizzaInfo--qt').innerHTML = modalqtde;
})
qSAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
   size.addEventListener('click', (e) => {
      qS('.pizzaInfo--size.selected').classList.remove('selected');
      size.classList.add('selected');
   })
});
qS('.pizzaInfo--addButton').addEventListener('click', () => {
   let size = parseInt(qS('.pizzaInfo--size.selected').getAttribute('data-key'));

   let identifier = pizzaJson[modalKey].id + '@' + size;

   let key = cart.findIndex((item) => item.identifier == identifier);

   if (key > -1) {
      cart[key].qtde += modalqtde;
   } else {
      cart.push({
         identifier,
         id: pizzaJson[modalKey].id,
         size: size,
         qtde: modalqtde,
      })
   }
   updateCart();
   closeModal();
});

qS('.menu-openner').addEventListener('click', () => {
   if(cart.length > 0) {
      qS('aside').style.left = '0';
   }
});
qS('.menu-closer').addEventListener('click', () => {
      qS('aside').style.left = '100vw';
});

function updateCart() {
   qS('.menu-openner span').innerHTML = cart.length;

   if (cart.length > 0) {
      qS('aside').classList.add('show');
      qS('.cart').innerHTML = '';

      let subtotal = 0;
      let desconto = 0;
      let total = 0;

      for (let i in cart) {
         let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
         subtotal += pizzaItem.price * cart[i].qtde;

         let cartItem = qS('.models .cart--item').cloneNode(true);
         let pizzaSizeName;
         switch (cart[i].size) {
            case 0:
               pizzaSizeName = 'P';
               break;
            case 1:
               pizzaSizeName = 'M';
               break;
            case 2:
               pizzaSizeName = 'G';
               break;
         }
         let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

         cartItem.querySelector('img').src = pizzaItem.img;
         cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
         cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtde;
         cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
            if(cart[i].qtde > 1) {
               cart[i].qtde--;
            } else {
               cart.splice(i, 1);
            }
            updateCart();

         });
         cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
            cart[i].qtde++;
            updateCart();
         })

         qS('.cart').append(cartItem);
      }
      desconto = subtotal * 0.1;
      total = subtotal - desconto;

      qS('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
      qS('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
      qS('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
   } else {
      qS('aside').classList.remove('show');
      qS('aside').style.left = '100vw';
   }
}