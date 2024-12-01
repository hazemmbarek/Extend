'use client';
import './payment.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe('pk_test_51QR0ayP9Uhv3khdSOtjef6CTtqkheeK5JMSw1N6iZH0u2hnmVBj7B5fs0vsG0TtXItIY1WqewT4AY6UL9qIcoEwV00uCiAvv2T');

// Payment Form Component
const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      email: '',
    });
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!stripe || !elements) return;
  
      setIsProcessing(true);
      setError('');
  
      try {
        // Mock user ID for testing - replace with actual user ID from your auth system
        const userId = 1; 
  
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 1000, // 10 TND in cents
            currency: 'tnd',
            userId: userId,
            trainingId: null, // Add if needed
            couponId: null, // Add if needed
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const { clientSecret, transactionId } = await response.json();
  
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement)!,
              billing_details: {
                name: formData.name,
                email: formData.email,
              },
            },
          }
        );
  
        if (stripeError) {
          setError(stripeError.message || 'Une erreur est survenue.');
        } else if (paymentIntent.status === 'succeeded') {
          alert('Paiement réussi!');
          onClose();
        }
      } catch (error) {
        console.error('Payment error:', error);
        setError('Une erreur est survenue lors du paiement.');
      } finally {
        setIsProcessing(false);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    return (
      <div className="payment-modal">
        <div className="payment-modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2>Informations de Paiement</h2>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="name">Nom Complet</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Entrez votre nom complet"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="email">Adresse Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="votre@email.com"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="card">Informations de la Carte</label>
              <CardElement 
                id="card"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
  
            {error && <div className="payment-error">{error}</div>}
            
            <button 
              type="submit" 
              className="btn-payment"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Traitement...' : 'Confirmer le Paiement'}
            </button>
          </form>
        </div>
      </div>
    );
  };

// Add these environment variables to your .env.local
const FLOUCI_APP_TOKEN = "your_app_token";
const FLOUCI_APP_SECRET = "your_app_secret";
const D17_API_KEY = "your_d17_api_key";
const D17_MERCHANT_ID = "your_merchant_id";

const FlouciPaymentForm = ({ onClose }: { onClose: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '10',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Call Flouci API
      const response = await fetch('https://developers.flouci.com/api/generate_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_token: FLOUCI_APP_TOKEN,
          app_secret: FLOUCI_APP_SECRET,
          accept_card: "true",
          amount: (parseFloat(formData.amount) * 1000).toString(), // Convert to millimes
          success_link: `${window.location.origin}/payment/success`,
          fail_link: `${window.location.origin}/payment/fail`,
          session_timeout_secs: 1200,
          developer_tracking_id: `order_${Date.now()}` // You can customize this
        }),
      });

      const data = await response.json();

      if (data.result?.success) {
        // Redirect to Flouci payment page
        window.location.href = data.result.link;
      } else {
        setError('Erreur lors de la génération du paiement Flouci.');
      }
    } catch (error) {
      console.error('Flouci payment error:', error);
      setError('Une erreur est survenue lors du paiement Flouci.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Paiement avec Flouci</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="amount">Montant (TND)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="1"
              step="0.001"
            />
          </div>

          {error && <div className="payment-error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn-payment"
            disabled={isProcessing}
          >
            {isProcessing ? 'Traitement...' : 'Payer avec Flouci'}
          </button>
        </form>
      </div>
    </div>
  );
};

const D17PaymentForm = ({ onClose }: { onClose: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '10',
    phoneNumber: '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Call D17 API
      const response = await fetch('https://api.d17.tn/api/v1/payments/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${D17_API_KEY}`,
        },
        body: JSON.stringify({
          merchant_id: D17_MERCHANT_ID,
          amount: parseFloat(formData.amount),
          phone_number: formData.phoneNumber,
          callback_url: `${window.location.origin}/payment/d17/callback`,
          cancel_url: `${window.location.origin}/payment/d17/cancel`,
          reference: `order_${Date.now()}`
        }),
      });

      const data = await response.json();

      if (data.success && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setError('Erreur lors de l\'initialisation du paiement D17.');
      }
    } catch (error) {
      console.error('D17 payment error:', error);
      setError('Une erreur est survenue lors du paiement D17.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Paiement avec D17</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="phoneNumber">Numéro de Téléphone D17</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="Entrez votre numéro D17"
              pattern="[0-9]{8}"
              maxLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Montant (TND)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="1"
              step="0.001"
            />
          </div>

          {error && <div className="payment-error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn-payment"
            disabled={isProcessing}
          >
            {isProcessing ? 'Traitement...' : 'Payer avec D17'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFlouciModal, setShowFlouciModal] = useState(false);
  const [showD17Modal, setShowD17Modal] = useState(false);

  return (
    <>
      {/* Paiements Header */}
      <section className="paiements-header">
        <div className="container">
          <h1>Méthodes de Paiement</h1>
        </div>
      </section>

      {/* Méthodes de Paiement */}
      <section className="payment-methods">
        <div className="container">
          <div className="row">
            {/* D17 */}
            <div className="col-lg-4 col-md-6">
              <div className="payment-card text-center">
                <img src="/assets/img/pai1.webp" alt="D17" className="payment-icon" />
                <h3 className="payment-title">D17</h3>
                <p className="payment-description">Solution de paiement mobile tunisienne rapide et sécurisée</p>
                <ul className="payment-steps">
                  <li>Scannez le QR code</li>
                  <li>Confirmez le montant</li>
                  <li>Validez avec votre code PIN</li>
                </ul>
                <button 
                  className="btn-payment"
                  onClick={() => setShowD17Modal(true)}
                >
                  Payer avec D17
                </button>
              </div>
            </div>

            {/* Flousi */}
            <div className="col-lg-4 col-md-6">
              <div className="payment-card text-center">
                <img src="/assets/img/pai2.webp" alt="FlouciTn" className="payment-icon" />
                <h3 className="payment-title">FlouciTn</h3>
                <p className="payment-description">Paiement électronique sécurisé via votre compte FlouciTn</p>
                <ul className="payment-steps">
                  <li>Connectez-vous à votre compte</li>
                  <li>Vérifiez les détails</li>
                  <li>Confirmez le paiement</li>
                </ul>
                <button 
                  className="btn-payment"
                  onClick={() => setShowFlouciModal(true)}
                >
                  Payer avec FlouciTn
                </button>
              </div>
            </div>

            {/* Carte bancaire */}
            <div className="col-lg-4 col-md-6">
              <div className="payment-card text-center">
                <img src="/assets/img/pai3.webp" alt="Carte Bancaire" className="payment-icon" />
                <h3 className="payment-title">Carte Bancaire</h3>
                <p className="payment-description">Paiement sécurisé par carte VISA ou MasterCard</p>
                <ul className="payment-steps">
                  <li>Entrez vos informations</li>
                  <li>Vérification 3D Secure</li>
                  <li>Confirmation instantanée</li>
                </ul>
                <button 
                  className="btn-payment"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Payer par Carte
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Elements stripe={stripePromise}>
          <CheckoutForm onClose={() => setShowPaymentModal(false)} />
        </Elements>
      )}

      {/* Flooci Modal */}
      {showFlouciModal && (
        <FlouciPaymentForm onClose={() => setShowFlouciModal(false)} />
      )}

      {/* D17 Modal */}
      {showD17Modal && (
        <D17PaymentForm onClose={() => setShowD17Modal(false)} />
      )}

      {/* FAQ Section */}
            {/* FAQ Section */}
            <section className="payment-faq">
        <div className="container">
          <h2 className="text-center mb-5">Questions Fréquentes sur les Paiements</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="faq-item">
                <h4 className="faq-question">Quels sont les frais de transaction ?</h4>
                <p>Les frais varient selon la méthode de paiement choisie. D17 et FlouciTn : 2%, Carte bancaire : 3%.</p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">Combien de temps pour recevoir mes commissions ?</h4>
                <p>Les commissions sont versées automatiquement chaque fin de mois, avec un délai de traitement de 2-3 jours ouvrables.</p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question">Les paiements sont-ils sécurisés ?</h4>
                <p>Oui, toutes nos transactions sont protégées par un cryptage SSL et respectent les normes de sécurité bancaires.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}