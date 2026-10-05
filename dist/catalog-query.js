'use strict';

// The catalog and the display language remain separate from the filter logic.
window.ALRcatalogQuery = Object.freeze({
  normalize(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  },
  createIndex(products, searchText) {
    return new Map(products.map(product => [product.id, this.normalize(searchText(product))]));
  },
  isIntimate(product) {
    return ['lingerie', 'essentials', 'lounge'].includes(product.category);
  },
  isClothingCategory(category) {
    return ['intimates', 'lingerie', 'essentials', 'lounge'].includes(category);
  },
  colorsForCategory(products, category, favorites = new Set()) {
    const family = this.select(products, {category, favorites}, new Map());
    return [...new Map(family.flatMap(product => product.colors.map(color => [color.id, color]))).values()];
  },
  sanitizeView(state = {}, products = []) {
    const categories = new Set(['all', 'intimates', 'exclusive', ...products.map(product => product.category)]);
    const sizes = new Set(products.filter(product => !product.variantKind || product.variantKind === 'size').flatMap(product => product.sizes));
    const colors = new Set(products.flatMap(product => product.colors.map(color => color.id)));
    const category = categories.has(state.category) ? state.category : 'all';
    return {
      category,
      query:typeof state.query === 'string' ? state.query.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 120).trim() : '',
      size:!['fragrance', 'beauty', 'exclusive'].includes(category) && sizes.has(state.size) ? state.size : '',
      color:colors.has(state.color) ? state.color : '',
      price:['under40', 'from40to65', 'over65'].includes(state.price) ? state.price : '',
      sort:['low', 'high'].includes(state.sort) ? state.sort : 'featured'
    };
  },
  readView(search, products) {
    const params = new URLSearchParams(typeof search === 'string' ? search : '');
    return this.sanitizeView({
      category:params.get('category'), query:params.get('q'), size:params.get('size'),
      color:params.get('color'), price:params.get('price'), sort:params.get('sort')
    }, products);
  },
  encodeView(state, products) {
    const view = this.sanitizeView(state, products);
    const params = new URLSearchParams();
    if (view.category !== 'all') params.set('category', view.category);
    if (view.query) params.set('q', view.query);
    for (const key of ['size', 'color', 'price']) if (view[key]) params.set(key, view[key]);
    if (view.sort !== 'featured') params.set('sort', view.sort);
    return params.toString();
  },
  select(products, state, searchText) {
    const query = this.normalize(state.query || '');
    const terms = query.split(/\s+/).filter(Boolean);
    const result = products.filter(product => {
      if (state.category === 'favorites' && !state.favorites.has(product.id)) return false;
      if (state.category === 'exclusive' && !product.exclusive) return false;
      if (state.category === 'intimates' && !this.isIntimate(product)) return false;
      if (state.category && !['all', 'intimates', 'favorites', 'exclusive'].includes(state.category) && product.category !== state.category) return false;
      if (state.size && !product.sizes.includes(state.size)) return false;
      if (state.color && !product.colors.some(color => color.id === state.color)) return false;
      if (state.price === 'under40' && product.price >= 40) return false;
      if (state.price === 'from40to65' && (product.price < 40 || product.price > 65)) return false;
      if (state.price === 'over65' && product.price <= 65) return false;
      const searchable = typeof searchText === 'function' ? this.normalize(searchText(product)) : searchText.get(product.id) || '';
      return terms.every(term => searchable.includes(term));
    });
    if (state.sort === 'low') result.sort((a, b) => a.price - b.price);
    if (state.sort === 'high') result.sort((a, b) => b.price - a.price);
    return result;
  }
});
