import { axiosi } from "../../config/axios";

export const addProduct = async (data) => {
    try {
        const res = await axiosi.post('/products', data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const fetchProducts = async (filters) => {
    let queryString = '';

    if (filters.brand && filters.brand.length > 0) {
        filters.brand.forEach((brand) => {
            queryString += `brand=${brand}&`;
        });
    }

    if (filters.category && filters.category.length > 0) {
        filters.category.forEach((category) => {
            queryString += `category=${category}&`;
        });
    }

    if (filters.pagination) {
        queryString += `page=${filters.pagination.page}&limit=${filters.pagination.limit}&`;
    }

    if (filters.sort && filters.order) {
        queryString += `sort=${filters.sort}&order=${filters.order}&`;
    }

    if (filters.user) {
        queryString += `user=${filters.user}&`;
    }

    if (queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
    }
    const timestamp = new Date().getTime();
    queryString += `&timestamp=${timestamp}`;

    try {
        const res = await axiosi.get(`/products?${queryString}`);
        const totalResults = res.headers['x-total-count'] || res.headers['X-Total-Count'];
        return { data: res.data, totalResults: totalResults };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error.response ? error.response.data : error.message;
    }
};

export const fetchProductById = async (id) => {
    try {
        const res = await axiosi.get(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const updateProductById = async (update) => {
    try {
      const res = await axiosi.patch(`/products/${update.id}`, update.formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
export const undeleteProductById = async (id) => {
    try {
        const res = await axiosi.patch(`/products/undelete/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const deleteProductById = async (id) => {
    try {
        const res = await axiosi.delete(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
