const mainImage=document.querySelector(".main-image"),thumbnails=document.querySelectorAll(".thumbnail");let currentImageIndex=0;const currentLocation=window.location.pathname;let images,productImage;function updateMainImage(){mainImage.src=images[currentImageIndex]}images="/fast-defrost-tray"===currentLocation?["../images/tray_preview1.webp","../images/tray_preview2.webp","../images/tray_preview3.webp"]:["../images/pot_preview1.webp","../images/pot_preview2.webp","../images/pot_preview3.webp"],thumbnails.forEach(((t,e)=>{t.addEventListener("click",(()=>{currentImageIndex=e,updateMainImage()}))})),mainImage.addEventListener("click",(()=>{const t=document.createElement("img"),e=document.createElement("button");e.classList.add("close_image"),e.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',t.alt="Mini Electric Juicer",t.src=mainImage.src,t.classList.add("zoom_image"),document.body.style.overflow="hidden",document.body.appendChild(t),document.body.appendChild(e),e.addEventListener("click",(()=>{document.body.removeChild(t),document.body.removeChild(e),document.body.style.overflow=""}))}));let savedColor="green",savedDelivery="normal";const cartButton=document.querySelectorAll(".cart__button");function cartClick(){this.classList.add("clicked")}cartButton.forEach((t=>{t.addEventListener("click",cartClick)}));const decreaseAmount=document.getElementById("productMinus"),increaseAmount=document.getElementById("productPlus"),productAmount=document.getElementById("productAmount"),productAmount2=document.getElementById("productAmount"),productTitle=document.querySelector(".product_title").innerHTML.trim(),addToCart=document.querySelector(".cart__button"),cartInner=document.querySelector(".modal-body"),productPrice=document.querySelector(".product_priceSale").innerHTML;window.onload=productAmount.innerHTML="1";let cartData=localStorage.getItem("cart");cartData=cartData?JSON.parse(cartData):[];const existingItems=cartData.find((t=>t.productTitle===productTitle));existingItems&&(savedColor=existingItems.productColor,productImage=existingItems.productImage),"green"===savedColor?productImage=document.querySelector(".main-image").src:"white"===savedColor&&(productImage=document.querySelector(".white_image").src);const colorRadios=document.querySelectorAll('input[name="color"]');colorRadios.forEach((t=>{t.value===savedColor&&(t.checked=!0),t.addEventListener("change",(()=>{const e=cartData.findIndex((t=>t.productTitle===productTitle));savedColor=t.value,"green"===t.value?productImage=document.querySelector(".main-image").src:"white"===t.value&&(productImage=document.querySelector(".white_image").src),-1!==e&&(updateCartData(),updateCart())}))}));const deliveryRadios=document.querySelectorAll('input[name="delivery"]');function updateCart(){null!==cartData&&cartData.length>0?cartInner.innerHTML="":cartInner.innerHTML="Your cart is empty",localStorage.setItem("cart",JSON.stringify(cartData)),cartData.forEach(((t,e)=>{const a=t.productTitle,n=t.productAmount,r=t.productColor,c=document.createElement("div");c.classList.add("cart_product");const o=document.createElement("p");o.classList.add("titleParagr");const d=document.createElement("p");d.classList.add("amountParagr");const i=document.createElement("button"),u=document.createElement("button"),l=document.createElement("button"),s=document.createElement("div");u.textContent="-",l.textContent="+",u.classList.add("cartDecrease"),l.classList.add("cartIncrease"),i.classList.add("delete"),i.textContent="x",s.appendChild(u),s.appendChild(d),s.appendChild(l),s.classList.add("amountBox"),o.textContent=`${r[0].toUpperCase()+r.slice(1)} ${a}`,d.textContent=n,i.addEventListener("click",(()=>{cartData.splice(e,1),updateCart(),location.reload()})),c.appendChild(o),c.appendChild(s),c.appendChild(i),cartInner.appendChild(c)}));const t=document.querySelectorAll(".amountParagr"),e=document.querySelectorAll(".cartDecrease");document.querySelectorAll(".cartIncrease").forEach(((e,a)=>{e.addEventListener("click",(function(){const e=parseInt(t[a].innerHTML)+1;t[a].innerHTML=e,updateCartInner(a,e),updateAmountInBothPlaces(a,e)}))})),e.forEach(((e,a)=>{e.addEventListener("click",(function(){const e=parseInt(t[a].innerHTML);if(e>1){const n=e-1;t[a].innerHTML=n,updateCartInner(a,n),updateAmountInBothPlaces(a,n)}}))}))}deliveryRadios.forEach((t=>{t.value===savedDelivery&&(t.checked=!0),t.addEventListener("change",(()=>{const e=cartData.findIndex((t=>t.productTitle===productTitle));savedDelivery=t.value,-1!==e&&(updateCartData(),updateCart())}))})),cartInner.innerHTML="",updateCart(),decreaseAmount.addEventListener("click",(function(){if(productAmount.innerHTML>1)if(productAmount.innerHTML--,-1!==existingItemIndex){const t=parseInt(productAmount.innerHTML);document.querySelectorAll(".amountBox")[existingItemIndex].querySelector(".amountParagr").textContent=t,updateCartInner(existingItemIndex,t),updateCartData(),updateCart()}else updateCartData(),updateCart()}));const cartTitle=document.querySelectorAll(".titleParagr");increaseAmount.addEventListener("click",(function(){if(productAmount.innerHTML++,-1!==existingItemIndex){const t=parseInt(productAmount.innerHTML);document.querySelectorAll(".amountBox")[existingItemIndex].querySelector(".amountParagr").textContent=t,updateCartInner(existingItemIndex,t)}else updateCartData(),addToCart.classList.add("clicked"),addToCart.disabled=!0,updateCart()}));const productTitles=document.querySelectorAll("#title"),productAmounts=document.querySelectorAll("#amount"),existingItemIndex2=cartData.findIndex((t=>t.productTitle===productTitle));function updateCartData(){const t=cartData.findIndex((t=>t.productTitle===productTitle));-1!==t&&cartData.splice(t,1),cartData.push({productTitle:productTitle,productAmount:parseInt(productAmount.innerHTML),productPrice:productPrice,productImage:productImage,productColor:savedColor}),addToCart.classList.add("clicked"),addToCart.disabled=!0,localStorage.setItem("cart",JSON.stringify(cartData)),productTitles.forEach(((e,a)=>{e.innerHTML==`${productTitle}`&&(productAmounts[a].textContent=cartData[t].productAmount)}))}-1!==existingItemIndex2&&(addToCart.innerHTML="Added",addToCart.classList.add("clicked_cart"),addToCart.disabled=!0);const existingItemIndex=cartData.findIndex((t=>t.productTitle===productTitle));function updateAmountInBothPlaces(t,e){document.querySelectorAll(".amountBox")[t].querySelector(".amountParagr").textContent=e,productAmount.innerHTML=e,cartData[t].productAmount=e}function updateCartInner(t,e){const a=cartData[t].productTitle,n=cartData[t].productPrice,r=cartData[t];cartData[t]={...r,productTitle:a,productAmount:e,productPrice:n,productImage:productImage},localStorage.setItem("cart",JSON.stringify(cartData))}-1!==existingItemIndex&&(productAmount.innerHTML=cartData[existingItemIndex].productAmount),addToCart.addEventListener("click",(function(){updateCartData(),updateCart(),addToCart.classList.add("clicked"),addToCart.disabled=!0}));