'use strict';

// Concept products and sample prices. Stable IDs and legacy color names keep
// saved favorites and bag selections compatible across languages and releases.
(() => {
  const colors = {
    cherry: {id:'cherry', name:'Rojo cereza', hex:'#bc1534'},
    black: {id:'black', name:'Negro', hex:'#292327'},
    blush: {id:'blush', name:'Rosa suave', hex:'#d69aa6'},
    ivory: {id:'ivory', name:'Marfil', hex:'#eee3d3'},
    amber: {id:'amber', name:'Ámbar', hex:'#b47742'}
  };
  const standardSizes = ['XS','S','M','L','XL','XXL'];
  const products = [
    {id:'cherry-body', category:'lingerie', price:68, image:'assets/cherry-body.jpg', position:'center', colors:[colors.cherry]},
    {id:'perfume-rose', category:'fragrance', price:64, image:'assets/perfume-rose.jpg', position:'center', colors:[colors.ivory], sizes:['50 ml'], variantKind:'volume'},
    {id:'gloss-cherry', category:'beauty', price:18, image:'assets/gloss-cherry.jpg', position:'center', colors:[colors.cherry], sizes:['6 ml'], variantKind:'volume'},
    {id:'ivory-bralette', category:'essentials', price:34, image:'assets/ivory-bralette.jpg', position:'center', colors:[colors.ivory]},
    {id:'blush-robe', category:'lounge', price:88, image:'assets/blush-robe.jpg', position:'center', colors:[colors.blush], sizes:['S','M','L','XL','XXL']},
    {id:'perfume-ambre', category:'fragrance', price:76, image:'assets/perfume-ambre.jpg', position:'center', colors:[colors.amber], sizes:['50 ml'], variantKind:'volume'},
    {id:'gloss-pearl', category:'beauty', price:18, image:'assets/gloss-pearl.jpg', position:'center', colors:[colors.blush], sizes:['6 ml'], variantKind:'volume'},
    {id:'rose', category:'lingerie', price:58, image:'assets/editorial.jpg', position:'78% center', colors:[colors.cherry]},
    {id:'noir', category:'lingerie', price:62, image:'assets/noir.jpg', position:'center', colors:[colors.black]},
    {id:'lune', category:'lounge', price:72, image:'assets/lune.jpg', position:'center', colors:[colors.blush]},
    {id:'rose-bra', category:'essentials', price:38, image:'assets/rose-bra-single.jpg', position:'center', colors:[colors.cherry]},
    {id:'noir-brief', category:'essentials', price:24, image:'assets/noir-brief-single.jpg', position:'center', colors:[colors.black]},
    {id:'lune-top', category:'lounge', price:44, image:'assets/lune-top-single.jpg', position:'center', colors:[colors.blush]},
    {id:'edition-perfume', category:'fragrance', price:112, image:'assets/edition-perfume.jpg', position:'center', colors:[colors.cherry], sizes:['50 ml'], variantKind:'volume', exclusive:true},
    {id:'edition-gloss', category:'beauty', price:28, image:'assets/edition-gloss.jpg', position:'center', colors:[colors.cherry], sizes:['6 ml'], variantKind:'volume', exclusive:true},
    {id:'edition-coffret', category:'beauty', price:138, image:'assets/edition-coffret.jpg', position:'center', colors:[colors.cherry], sizes:['Set'], variantKind:'set', exclusive:true}
  ].map(product => ({...product, sizes:product.sizes || [...standardSizes]}));

  window.ALRcatalog = {colors, products};
})();
