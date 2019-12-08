async function addCart (params) {
    const POST = {
        "product_id": params,
        "quantity": 1
    };
    const result = await axios.post('cart', POST);
    document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}

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
