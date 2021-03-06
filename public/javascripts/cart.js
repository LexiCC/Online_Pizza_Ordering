// -------Add Cart
async function addCart(params) {
  const POST = {
    product_id: params,
    quantity: 1,
  };
  alert("Added to cart");
  const result = await axios.post('cart', POST);
  document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}

// -------Customize
async function addCustomizeToCart(params) {
  const POST = {
    product_id: params,
    quantity: 1,
    customizations: [],
  };
  
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  for (i = 0; i < checkedBoxes.length; i++) {
    POST.customizations.push(checkedBoxes[i].value);
    checkedBoxes[i].checked = false;
  }
  alert("Added to cart");
  const result = await axios.post('cart', POST);
  document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}

// -----------Remove
async function deleteItem(button, id) {
  const result = await axios.delete('cart/' + id);
  button.parentNode.parentNode.remove();
  document.querySelector('#cartCount').innerHTML = ' (' + result.data.cartCount + ')';
}


function updateCartTotal() {
  const cartBody = document.getElementsByClassName('cart-body')[0];
  const cartItems = cartBody.getElementsByClassName('cart-row');
  let total = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const myItem = cartItems[i];
    const myQuantity = myItem.getElementsByClassName('cart-quantity')[0];
    total += myQuantity;
  }

  document.getElementsByClassName('total-quantity')[0].innerText = total;
}

// -----------Update
async function update(id) {
    const quantity = document.querySelector('#quantity' + id).value;
    const put = {
      quantity: quantity,
    };
    const result = await axios.put('cart/' + id, put);
    document.querySelector('#cartCount').innerHTML = ' ( ' + result.data.cartCount + ')';
  }

  //-----------Empty
  async function emptyCart() {
    const result = await axios.delete('cart/');
    document.querySelector('#allPizza').remove();
    document.querySelector('#cartCount').innerHTML = '( ' + result.data.cartCount + ' )';
 }


