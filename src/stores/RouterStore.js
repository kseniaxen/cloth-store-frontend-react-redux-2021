import { createSlice } from '@reduxjs/toolkit'
import Home from "../components/pages/Home";
import Shopping from "../components/pages/Shopping";
import SignIn from "../components/pages/SignIn";
import SignUp from "../components/pages/SignUp";
import DashboardSubcategories from "../components/pages/admin/DashboardSubcategories";
import Dashboard from "../components/pages/admin/Dashboard";
import DashboardCategories from "../components/pages/admin/DashboardCategories";
import DashboardSizes from "../components/pages/admin/DashboardSizes";
import DashboardProducts from "../components/pages/admin/DashboardProducts";

const anonymousRoutes = [
    { path: '/', name: 'Home', Component: Home },
    { path: '/shopping', name: 'Shopping', Component: Shopping },
    { path: '/signin', name: 'Log In', Component: SignIn },
    { path: '/signup', name: 'Registration', Component: SignUp}
]

const loggedRoutes = [
    { path: '/', name: 'Home', Component: Home },
    { path: '/shopping', name: 'Shopping', Component: Shopping },
    { path: '/auth:out', name: 'Log Out', Component: Home }
]

const adminRoutes = [
    { path: '/', name: 'Home', Component: Home },
    { path: '/shopping', name: 'Shopping', Component: Shopping },
    { path: '/admin', name: 'Dashboard', Component: Dashboard },
    { path: '/admin/categories', name: 'DashboardCategories', Component: DashboardCategories },
    { path: '/admin/subcategories', name: 'DashboardSubcategories', Component: DashboardSubcategories },
    { path: '/admin/sizes', name: 'DashboardSizes', Component: DashboardSizes },
    { path: '/admin/products', name: 'DashboardProducts', Component: DashboardProducts },
    { path: '/auth:out', name: 'Log Out', Component: Home }
]

const RouterStore = createSlice({
    name:'RouterStore',
    initialState:{
        routes: anonymousRoutes
    },
    reducers:{
        setAnonymousRoutes:(state) =>{
            state.routes = anonymousRoutes
        },
        setLoggedRoutes:(state) =>{
            state.routes = loggedRoutes
        },
        setAdminRoutes:(state) =>{
            state.routes = adminRoutes
        }
    }
})

export const { setAnonymousRoutes, setLoggedRoutes, setAdminRoutes } = RouterStore.actions
export default RouterStore.reducer;