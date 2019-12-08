async function addCart (params) {
    const POST = {
        "product_id": params,
        "quantity": 1
    };
    const result = await axios.post('cart', POST);
    document.querySelector('#cartCount').innerHTML = 'Cart (' + result.data.cartCount + ')';
}

