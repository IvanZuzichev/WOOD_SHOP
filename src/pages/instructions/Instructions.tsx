import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Instructions.scss";

export const PaymentInstructions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, amount, orderId, error, paymentMethod } = location.state || {};
  
  return (
    <div className="instructions-container">
      <div className="instructions-breadcrumbs">
        <span onClick={() => navigate('/')} className="breadcrumb-link">Главная</span>
        <span className="breadcrumb-separator"> / </span>
        <span onClick={() => navigate('/checkout')} className="breadcrumb-link">Оформление заказа</span>
        <span className="breadcrumb-separator"> / </span>
        <span className="breadcrumb-current">Инструкции по оплате</span>
      </div>
      
      <div className="instructions-content">
        <h1 className="instructions-title">Инструкции по оплате</h1>
        
        {error && (
          <div className="instructions-error">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Ошибка онлайн-оплаты</h3>
              <p>{error}</p>
              <p className="error-hint">Пожалуйста, используйте альтернативные способы оплаты:</p>
            </div>
          </div>
        )}
        
        <div className="order-info-card">
          <div className="order-header">
            <h2>Заказ #{orderNumber || 'не указан'}</h2>
            <div className="order-badge">Ожидает оплаты</div>
          </div>
          
          <div className="order-details-grid">
            <div className="order-detail-item">
              <span className="detail-label">Сумма к оплате:</span>
              <span className="detail-value amount">{amount || 0} ₽</span>
            </div>
            <div className="order-detail-item">
              <span className="detail-label">ID заказа:</span>
              <span className="detail-value">{orderId || 'не указан'}</span>
            </div>
            {paymentMethod && (
              <div className="order-detail-item">
                <span className="detail-label">Способ оплаты:</span>
                <span className="detail-value">
                  {paymentMethod === 'invoice' ? 'Оплата по счету' : 
                   paymentMethod === 'cash' ? 'Наличными' : 'Банковской картой'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="payment-methods-section">
          <h3>Доступные способы оплаты:</h3>
          
          <div className="method-card">
            <div className="method-header">
              <div className="method-number">1</div>
              <h4>Онлайн через ЮMoney</h4>
            </div>
            <div className="method-body">
              <div className="method-step">
                <span className="step-number">1.</span>
                <span className="step-text">
                  Перейдите по ссылке:{" "}
                  <a 
                    href="" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="payment-link"
                  >
                  </a>
                </span>
              </div>
              <div className="method-step">
                <span className="step-number">2.</span>
                <span className="step-text">
                  Укажите получателя: <strong>410011774639476</strong>
                </span>
              </div>
              <div className="method-step">
                <span className="step-number">3.</span>
                <span className="step-text">
                  Введите сумму: <strong>{amount || 0} ₽</strong>
                </span>
              </div>
              <div className="method-step">
                <span className="step-number">4.</span>
                <span className="step-text">
                  В комментарии укажите: <strong>"Заказ {orderNumber}"</strong>
                </span>
              </div>
              <div className="method-note">
                ⚠️ Обязательно указывайте комментарий с номером заказа для быстрой идентификации платежа
              </div>
            </div>
          </div>
          
          <div className="method-card">
            <div className="method-header">
              <div className="method-number">2</div>
              <h4>Банковский перевод</h4>
            </div>
            <div className="method-body">
              <div className="bank-details">
                <div className="bank-detail-row">
                  <span className="bank-label">Банк:</span>
                  <span className="bank-value">Сбербанк России</span>
                </div>
                <div className="bank-detail-row">
                  <span className="bank-label">Счет:</span>
                  <span className="bank-value">40817810099910012345</span>
                </div>
                <div className="bank-detail-row">
                  <span className="bank-label">БИК:</span>
                  <span className="bank-value">044525225</span>
                </div>
                <div className="bank-detail-row">
                  <span className="bank-label">Корр. счет:</span>
                  <span className="bank-value">30101810400000000225</span>
                </div>
                <div className="bank-detail-row">
                  <span className="bank-label">Получатель:</span>
                  <span className="bank-value">ИП Иванов Иван Иванович</span>
                </div>
                <div className="bank-detail-row">
                  <span className="bank-label">ИНН:</span>
                  <span className="bank-value">7707083893</span>
                </div>
                <div className="bank-detail-row">
                  <span className="bank-label">КПП:</span>
                  <span className="bank-value">770701001</span>
                </div>
                <div className="bank-detail-row important">
                  <span className="bank-label">Назначение платежа:</span>
                  <span className="bank-value">"Оплата заказа {orderNumber} от {new Date().toLocaleDateString('ru-RU')}"</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="method-card">
            <div className="method-header">
              <div className="method-number">3</div>
              <h4>Наличными при получении</h4>
            </div>
            <div className="method-body">
              <p>Вы можете оплатить заказ наличными при получении в пункте самовывоза или курьеру</p>
              <div className="pickup-info">
                <h5>Пункт самовывоза:</h5>
                <p><strong>Адрес:</strong> ул. Кабардинская 158, Нальчик, Кабардино-Балкарская Республика</p>
                <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
                <p><strong>Время работы:</strong> Пн-Пт: 9:00-18:00, Сб: 10:00-16:00, Вс: выходной</p>
              </div>
              <div className="pickup-info">
                <h5>Курьерская доставка:</h5>
                <p>Стоимость доставки рассчитывается индивидуально в зависимости от адреса</p>
                <p>Курьер свяжется с вами для уточнения времени доставки</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="actions-section">
          <button 
            onClick={() => navigate('/account?tab=orders')}
            className="btn btn-primary"
          >
            <span className="btn-icon">📋</span>
            Перейти к моим заказам
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            <span className="btn-icon">🏠</span>
            Вернуться на главную
          </button>
          <button 
            onClick={() => window.print()}
            className="btn btn-outline"
          >
            <span className="btn-icon">🖨️</span>
            Распечатать инструкцию
          </button>
        </div>
        
        <div className="help-section">
          <div className="help-header">
            <h4>Нужна помощь?</h4>
            <div className="help-icon">❓</div>
          </div>
          <p>Если у вас возникли вопросы по оплате или заказу, свяжитесь с нами:</p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div className="contact-details">
                <strong>Телефон:</strong>
                <a href="tel:+79991234567">+7 (999) 123-45-67</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div className="contact-details">
                <strong>Email:</strong>
                <a href="mailto:support@centertkani.ru">support@centertkani.ru</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div className="contact-details">
                <strong>Telegram/WhatsApp:</strong>
                <a href="https://t.me/centertkani_support">@centertkani_support</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🏢</span>
              <div className="contact-details">
                <strong>Адрес офиса:</strong>
                <span>ул. Кабардинская 158, Нальчик</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="payment-status-note">
          <p>
            <strong>Важно:</strong> После оплаты обязательно сохраните чек или квитанцию. 
            Статус заказа обновится в течение 1-2 часов после поступления платежа.
            Если статус не изменился в течение суток, свяжитесь с нами.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;