import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('auth/fetchProducts', async () => {
    try {
        const res = await fetch(import.meta.env.VITE_GET_ALL_PRODUCT, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        // Ensure API response has the expected structure
        if (!data || !data.message || !data.message.products) {
            throw new Error("Invalid API response format");
        }

        console.log(data);
        return data.message.products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Propagate error so Redux Toolkit can handle it
    }
});

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        status: false,
        userData: null,
        all_products: [],
        cartItemCount :0,
        reqProduct :[],
    },
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.all_products = [];
        },
        cartItemCount: (state, action) => {
            state.cartItemCount = action.payload;
        },
        searchProduct : (state,action) =>{
            state.reqProduct = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                console.log(action.payload);
                state.all_products = [...action.payload];
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                console.error("Failed to fetch products:", action.error);
                // Optionally, you can set an error state or handle the error in some way
            });
    }
});

export const { login, logout ,cartItemCount,searchProduct} = AuthSlice.actions;
export default AuthSlice.reducer;