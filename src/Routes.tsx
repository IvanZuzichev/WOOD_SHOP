import {
  WOOD_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  VERIFY_CODE_ROUTE,
  RESET_PASSWORD_ROUTE,
  SHOP_ROUTE,
  ABOUTUS_ROUTE,
  CATALOG_ROUTE,
  DISCOUNTS_ROUTE,
  NEW_ROUTE, // Добавлено
  OUR_WORKS_ROUTE,
  PRIVACY_POLICY_ROUTE,
  TERMS_OF_SERVICE_ROUTE,
  WORK_DETAIL_ROUTE 
} from "./utils/consts";

import { Shop } from "./pages/shop/Shop";
import { Auth } from "./pages/auth/Auth";
import { Woodpage } from "./pages/woodpage/Woodpage";
import { Registration } from "./pages/registration/Registration";
import { ForgotPassword } from "./pages/forgotPassword/ForgotPassword";
import { VerifyCode } from "./pages/verifyCode/VerifyCode";
import { ResetPassword } from "./pages/resetPassword/ResetPassword";
import { AboutUs } from "./pages/aboutUs/AboutUs";
import { Catalog } from "./pages/catalog/Catalog";
import { Discounts } from "./pages/discounts/Discounts";
import { New } from "./pages/new/New"; 
import { OurWorks } from "./pages/ourWorks/OurWorks";
import { PrivacyPolicy } from "./pages/privacyPolicy/PrivacyPolicy";
import { TermsOfService } from "./pages/termsOfService/TermsOfService";
import { Page404 } from "./pages/page404/Page404"; 
import { WorkPage } from "./pages/WorkPage/WorkPage";

export const authRoutes = [
];

export const publicRoutes = [
  {
    path: SHOP_ROUTE,
    element: <Shop />,
  },
  {
    path: CATALOG_ROUTE,
    element: <Catalog />,
  },
  {
    path: CATALOG_ROUTE + "/:category",
    element: <Catalog />,
  },
  {
    path: "/catalog-clothing",
    element: <Catalog />,
  },
  {
    path: "/catalog-clothing/:category",
    element: <Catalog />,
  },
  {
    path: LOGIN_ROUTE,
    element: <Auth />,
  },
  {
    path: REGISTRATION_ROUTE,
    element: <Registration />,
  },
  {
    path: FORGOT_PASSWORD_ROUTE,
    element: <ForgotPassword />,
  },
  {
    path: VERIFY_CODE_ROUTE,
    element: <VerifyCode />,
  },
  {
    path: RESET_PASSWORD_ROUTE,
    element: <ResetPassword />,
  },
  {
    path: ABOUTUS_ROUTE,
    element: <AboutUs/>,
  },
  {
    path: WOOD_ROUTE + "/:id",
    element: <Woodpage/>,
  },
  {
    path: WORK_DETAIL_ROUTE,
    element: <WorkPage/>,
  },
  {
    path: DISCOUNTS_ROUTE,
    element: <Discounts/>,
  },
  {
    path: NEW_ROUTE,
    element: <New/>,
  },
  {
    path: OUR_WORKS_ROUTE,
    element: <OurWorks/>,
  },
  {
    path: PRIVACY_POLICY_ROUTE,
    element: <PrivacyPolicy/>,
  },
  {
    path: TERMS_OF_SERVICE_ROUTE,
    element: <TermsOfService/>,
  },
  {
    path: "*",
    element: <Page404 />,
  },
];