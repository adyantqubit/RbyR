// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '../../api/config'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.apiBaseURL }),
  endpoints: (builder) => ({
    registerUser:builder.mutation({
        query:(user)=>{
            return{
                url:'register/',
                method:'POST',
                body:user,
                headers:{
                    'Content-type':'application/json',
                }
        }
        }
    }),
    loginUser:builder.mutation({
        query:(user)=>{
            return{
                url:'login/',
                method:'POST',
                body:user,
                headers:{
                    'Content-type':'application/json',
                }
        }
        }
    }),
    getLoggedUser:builder.query({
        query:(access_token)=>{
            return{
                url:'profile/',
                method:'GET',
                headers:{
                     'authorization':`Bearer ${access_token}`
                }
        }
        }
    }),
    changeUserPassword:builder.mutation({
        query:({actualData,access_token})=>{
            return{
                url:'changePass/',
                method:'POST',
                body:actualData,
                headers:{
                    'authorization':`Bearer ${access_token}`,
                }
        }
        }
    }),
    sendPasswordResetEmail:builder.mutation({
        query:(user)=>{
            
            return{
                url:'send-reset-password-email/',
                method:'POST',
                body:user,
                headers:{
                      'Content-type':'application/json',
                }
        }
        }
    }),
    resetPassword:builder.mutation({
        query:({actualData,id,token})=>{
        
            return{
                url:`reset-password/${id}/${token}/`,
                method:'POST',
                body:actualData,
                headers:{
                      'Content-type':'application/json',
                }
        }
        }
    }),
    likedUpdate:builder.mutation({
        query:({data,access_token})=>{
        
            return{
                url:'likedUpdate/',
                method:'POST',
                body:data,
                headers:{
                      'Content-type':'application/json',
                      'authorization':`Bearer ${access_token}`
                }
        }
        }
    }),
    getLikedProduct:builder.query({
        query:(access_token)=>{
            return{
                url:'likedUpdate/',
                method:'GET',
                headers:{
                     'authorization':`Bearer ${access_token}`
                }
        }
        }
    }),
    cartUpdate:builder.mutation({
        query:({data,access_token})=>{
        
            return{
                url:'cartUpdate/',
                method:'POST',
                body:data,
                headers:{
                      'Content-type':'application/json',
                      'authorization':`Bearer ${access_token}`
                }
        }
        }
    }),
    getCartProduct:builder.query({
        query:(access_token)=>{
            return{
                url:'cartUpdate/',
                method:'GET',
                headers:{
                     'authorization':`Bearer ${access_token}`
                }
        }
        }
    }),
    getCategoryProduct:builder.query({
        query:(category)=>{
            return{
                url:`getCategoryProduct/${category}/`, 
                method:'GET',
                headers:{
                    'Content-type':'application/json',
                }
        }
        }
    }),
    CartBuyAll:builder.mutation({
        query:({data,access_token})=>{
            return{
                url:`buyAll/`, 
                method:'POST',
                body:data,
                headers:{
                    'Content-type':'application/json',
                    'authorization':`Bearer ${access_token}`
                   
                }
        }
        }
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetCategoryProductQuery,useCartBuyAllMutation,useGetCartProductQuery,useLikedUpdateMutation,useCartUpdateMutation,useGetLikedProductQuery, useRegisterUserMutation,useLoginUserMutation,useGetLoggedUserQuery,useChangeUserPasswordMutation,useSendPasswordResetEmailMutation,useResetPasswordMutation} = userAuthApi