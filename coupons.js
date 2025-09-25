const coupons = {
    SAVE10:{
        type: 'percentage',
        value:10
    },
    FREESHIP:{
        type: 'fixed',
        value:5
    },
    SAVE20:{
        type: 'percentage',
        value: 20
    }
}

let appliedCoupon = null;
function applyCoupon(){
    const input=document.getElementById('coupon');
    const message = document.getElementById('coupon-message');
    const code= input.value.trim().toUpperCase();
    if (!coupons[code]){
        message.textContent = 'Invalid coupon code';
        message.className="text-red-500 text-sm mt-2";
        appliedCoupon = null; 
    }
    else{
        appliedCoupon = coupons[code];
        message.textContent="coupon applied";
        message.className = "text-green-500 text-sm mt-2"
    }
    renderCartSummary();
}
