import {createBrowserRouter} from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';

import LoginHomePage from "../pages/LoginHomePage";
import WorkBoardPage from "../pages/WorkBoardPage";


const router = createBrowserRouter([
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/',
        element: <LoginHomePage />, // 首页
    },
    {
        path:'/work',
        element: <WorkBoardPage/>
    }
    // ...其他路由
]);

export default router;