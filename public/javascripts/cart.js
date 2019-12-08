//-------Add Cart
async function addCart (params) {
    const POST = {
        "product_id": params,
        "quantity": 1
    };
    const result = await axios.post('cart', POST);
    document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}

//-------Customize
async function addCustomizeToCart (params) {
    const POST = {
        "product_id": params,
        "quantity": 1,
        "customizations": []
    };

    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for(i = 0; i < checkedBoxes.length;i++){
        POST.customizations.push (checkedBoxes[i].value);
        checkedBoxes[i].checked = false;
    }
    
    const result = await axios.post('cart', POST);
    document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}

//-----------Remove
var removed = document.getElementsByClassName('btn-remove');

for(var i =0; i< removed.length; i++){
    var button = removed[i];
    button.addEventListener('click', function(event) {
  var buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
    })
}

function updateCartTotal(){
    var cartBody = document.getElementsByClassName('cart-body')[0];
    var cartItems = cartBody.getElementsByClassName('cart-row');
    var total = 0;

    for(var i = 0; i< cartItems.length; i++){
        var myItem = cartItems[i];
        var myQuantity = myItem.getElementsByClassName('cart-quantity')[0];
        total = total + myQuantity;
    }

    document.getElementsByClassName('total-quantity')[0].innerText = total;
}

//-----------Update
