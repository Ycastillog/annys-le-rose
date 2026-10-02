'use strict';

// Concept products and sample prices. Stable IDs and legacy color names keep
// saved favorites and bag selections compatible across languages and releases.
(() => {
  const colors = {
    cherry: {id:'cherry', name:'Rojo cereza', hex:'#bc1534'},
    black: {id:'black', name:'Negro', hex:'#292327'},
    blush: {id:'blush', name:'Rosa suave', hex:'#d69aa6'},
    ivory: {id:'ivory', name:'Marfil', hex:'#eee3d3'}
  };
  const standardSizes = ['XS','S','M','L','XL','XXL'];
  const products = [
    {id:'cherry-body', category:'lingerie', price:68, image:'assets/cherry-body.jpg', position:'center', colors:[colors.cherry]},
    {id:'ivory-bralette', category:'essentials', price:34, image:'assets/ivory-bralette.jpg', position:'center', colors:[colors.ivory]},
    {id:'blush-robe', category:'lounge', price:88, image:'assets/blush-robe.jpg', position:'center', colors:[colors.blush], sizes:['S','M','L','XL','XXL']},
    {id:'rose', category:'lingerie', price:58, image:'assets/editorial.jpg', position:'78% center', colors:[colors.cherry]},
    {id:'noir', category:'lingerie', price:62, image:'assets/noir.jpg', position:'center', colors:[colors.black]},
    {id:'lune', category:'lounge', price:72, image:'assets/lune.jpg', position:'center', colors:[colors.blush]},
    {id:'rose-bra', category:'essentials', price:38, image:'assets/editorial.jpg', position:'80% 35%', colors:[colors.cherry]},
    {id:'noir-brief', category:'essentials', price:24, image:'assets/noir.jpg', position:'center bottom', colors:[colors.black]},
    {id:'lune-top', category:'lounge', price:44, image:'assets/lune.jpg', position:'center top', colors:[colors.blush]}
  ].map(product => ({...product, sizes:product.sizes || [...standardSizes]}));

  window.ALRcatalog = {colors, products};
})();
