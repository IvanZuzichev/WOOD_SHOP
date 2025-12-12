import { useState, useContext, useEffect, ChangeEvent, FormEvent } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, Link } from "react-router-dom";
import { REGISTRATION_ROUTE, SHOP_ROUTE, FORGOT_PASSWORD_ROUTE } from "../../utils/consts";
import { Context } from '../../context/index';
import { Email } from "../../components/input/Email";
import { Password } from "../../components/input/Password";

interface UserStore {
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const Auth = observer(() => {
  const { user } = useContext(Context) as { user: UserStore };
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Валидация email
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Пожалуйста, введите email";
    }
    if (!emailRegex.test(email)) {
      return "Введите корректный email адрес";
    }
    return "";
  };

  // Валидация пароля
  const validatePassword = (password: string): string => {
    if (!password) {
      return "Пожалуйста, введите пароль";
    }
    if (password.length < 6) {
      return "Пароль должен содержать минимум 6 символов";
    }
    return "";
  };

  // Очистка ошибок при изменении полей
  useEffect(() => {
    if (email) {
      setEmailError("");
      setLocalError("");
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      setPasswordError("");
      setLocalError("");
    }
  }, [password]);

  // Очистка ошибок из store при изменении полей
  useEffect(() => {
    if (user?.error && (email || password)) {
      // Ошибка из store будет очищена при следующем запросе
    }
  }, [email, password, user?.error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    setEmailError("");
    setPasswordError("");

    // Валидация
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    const result = await user.login(email, password);
    
    if (result.success) {
      navigate(SHOP_ROUTE);
    } else {
      setLocalError(result.error || "Ошибка входа");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const errorMessage = localError || user?.error;
  const errorId = errorMessage ? "login-error" : undefined;

  return (
    <div className="bg-[#f1f0ee] relative min-h-screen w-full flex items-center justify-center py-[40px] px-4">
      {/* Основная форма */}
      <div className="bg-white rounded-[16px] p-6 sm:p-8 w-full max-w-[472px] mt-[80px]">
        <div className="flex flex-col gap-6">
          {/* Заголовок */}
          <div className="flex flex-col">
            <h1 className="font-inter font-semibold text-2xl sm:text-[32px] leading-[1.2] text-[#101010] tracking-[-0.8px]">
              Войти
            </h1>
          </div>

          {/* Форма */}
          <form className="flex flex-col gap-6 sm:gap-[30px]" onSubmit={handleSubmit} noValidate>
            {/* Сообщения об ошибках */}
            {errorMessage && (
              <div 
                id={errorId}
                role="alert"
                aria-live="assertive"
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-brown-600 text-sm m-0">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Поле Email */}
              <div className="flex flex-col gap-2">
                <label 
                  htmlFor="email"
                  className="font-inter font-medium text-[14px] leading-[1.2] text-[#888888]"
                >
                  Электронная почта
                </label>
                <div>
                  <Email
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    bgColor="#e4e2df"
                    required
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && (
                    <p 
                      id="email-error"
                      role="alert"
                      className="text-brown-600 text-xs mt-1 m-0"
                    >
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              {/* Поле Пароль */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label 
                    htmlFor="password"
                    className="font-inter font-medium text-[14px] leading-[1.2] text-[#888888] whitespace-nowrap"
                  >
                    Пароль
                  </label>
                  <div className="flex-1 h-px bg-transparent" />
                  <Link 
                    to={FORGOT_PASSWORD_ROUTE} 
                    className="font-inter font-medium text-[14px] leading-[1.2] text-[#4d4d4d] underline hover:text-[#340A09] transition-colors"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <div>
                  <Password
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    bgColor="#e4e2df"
                    required
                    autoComplete="current-password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                  />
                  {passwordError && (
                    <p 
                      id="password-error"
                      role="alert"
                      className="text-brown-600 text-xs mt-1 m-0"
                    >
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопка Войти */}
            <button
              type="submit"
              disabled={user?.isLoading}
              aria-label={user?.isLoading ? "Выполняется вход..." : "Войти в аккаунт"}
              aria-describedby={errorId}
              className="bg-[#340A09] h-[40px] rounded-[8px] flex items-center justify-center font-inter font-medium text-[16px] leading-[1.2] text-white hover:bg-[#860202] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user?.isLoading ? "Вход..." : "Войти"}
            </button>
          </form>

          {/* Регистрация */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
            <p className="font-inter font-medium text-[14px] leading-[1.2] text-[#101010] whitespace-nowrap">
              Нет аккаунта?
            </p>
            <div className="hidden sm:block flex-1 h-px bg-transparent" />
            <Link to={REGISTRATION_ROUTE} className="w-full sm:w-auto">
              <button
                type="button"
                className="bg-white border border-[#c2c2c2] h-[40px] px-[17px] rounded-[8px] flex items-center justify-center font-inter font-medium text-[14px] leading-[1.2] text-[#101010] hover:bg-[#f1f0ee] transition-colors w-full sm:w-auto"
              >
                Зарегистрируйтесь
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});