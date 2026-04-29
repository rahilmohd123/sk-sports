import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserCartQuery, useUpdateCartMutation } from '../slices/usersApiSlice';
import { setCartItems } from '../slices/cartSlice';

const CartStoreSync = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const { data: dbCartItems, isSuccess: isFetchSuccess } = useGetUserCartQuery(undefined, {
    skip: !userInfo,
  });
  
  const [updateCart] = useUpdateCartMutation();
  const initialFetchDone = useRef(false);

  // 1. When user logs in/app loads, if we fetch DB cart, update Redux
  useEffect(() => {
    if (userInfo && isFetchSuccess && !initialFetchDone.current) {
        // If DB has items, we sync them to Redux. 
        // NOTE: The LoginPage/RegisterPage already handles the 'sync' of local items TO db.
        // So here we are just ensuring Redux matches DB on refresh/initial load.
        dispatch(setCartItems(dbCartItems));
        initialFetchDone.current = true;
    }
    
    if (!userInfo) {
        initialFetchDone.current = false;
    }
  }, [userInfo, isFetchSuccess, dbCartItems, dispatch]);

  // 2. Whenever Redux cart changes AND we are logged in AND initial fetch is done, sync to DB
  useEffect(() => {
    const syncToDB = async () => {
        if (userInfo && initialFetchDone.current) {
            try {
                await updateCart(cartItems).unwrap();
            } catch (err) {
                console.error('Failed to sync cart to DB:', err);
            }
        }
    };

    syncToDB();
  }, [cartItems, userInfo, updateCart]);

  return null;
};

export default CartStoreSync;
