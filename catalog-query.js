'use strict';

// The catalog and the display language remain separate from the filter logic.
window.ALRcatalogQuery = Object.freeze({
  normalize(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  },
  select(products, state, searchText) {
    const query = this.normalize(state.query || '');
    const terms = query.split(/\s+/).filter(Boolean);
    const result = products.filter(product => {
      if (state.category === 'favorites' && !state.favorites.has(product.id)) return false;
      if (state.category === 'exclusive' && !product.exclusive) return false;
      if (state.category && !['all', 'favorites', 'exclusive'].includes(state.category) && product.category !== state.category) return false;
      if (state.size && !product.sizes.includes(state.size)) return false;
      if (state.color && !product.colors.some(color => color.id === state.color)) return false;
      if (state.price === 'under40' && product.price >= 40) return false;
      if (state.price === 'from40to65' && (product.price < 40 || product.price > 65)) return false;
      if (state.price === 'over65' && product.price <= 65) return false;
      const searchable = this.normalize(searchText(product));
      return terms.every(term => searchable.includes(term));
    });
    if (state.sort === 'low') result.sort((a, b) => a.price - b.price);
    if (state.sort === 'high') result.sort((a, b) => b.price - a.price);
    return result;
  }
});
