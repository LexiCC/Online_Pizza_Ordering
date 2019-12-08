async function addCustomizeToCart (params) {
    const POST = {
        "product_id": params,
        "quantity": 1,
        "customizations": [customizations.product_id, 9]
    };

    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    for(i = 0; i < 4;i++){
        if(checkedBoxes[i].checked === true){

        }
    }
    const result = await axios.post('cart', POST);
    document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}
