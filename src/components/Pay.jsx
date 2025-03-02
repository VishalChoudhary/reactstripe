import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Load Stripe with your **public** key
const stripePromise = loadStripe("pk_test_51QxTpuRtRBgZfbyUq2OQeVnB3PzA4CqEaMiLEg6ix5YtgmW9dVKMIcT9iCawEC340kROOiSANr6dav5lnpA1hNBQ00Zgf9M9o8");

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState("");

    // Convert cents to dollars
    const amountInDollars = (amount / 100).toFixed(2);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setMessage("");

        if (!stripe || !elements) {
            setMessage("Stripe is not loaded.");
            setIsProcessing(false);
            return;
        }

        // Create a payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/checkout/payment", {
                amount,
                paymentMethodId: paymentMethod.id,
            });

            if (response.data.success) {
                setMessage("✅ Payment successful! 🎉");
            } else {
                setMessage("❌ Payment failed. Try again.");
            }
        } catch (err) {
            setMessage(err.response?.data?.error || "Server error.");
        }

        setIsProcessing(false);
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5"
        }}>
            <form 
                onSubmit={handleSubmit} 
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    width: "350px",
                    textAlign: "center"
                }}
            >
                <h2 style={{ marginBottom: "20px", color: "#333" }}>Complete Payment</h2>

                <div style={{
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginBottom: "20px",
                    background: "#fff"
                }}>
                    <CardElement options={{ hidePostalCode: true }} />
                </div>

                <button 
                    type="submit" 
                    disabled={!stripe || isProcessing} 
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: isProcessing ? "#6c757d" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: isProcessing ? "not-allowed" : "pointer"
                    }}
                >
                    {isProcessing ? "Processing..." : `Pay $${amountInDollars}`}
                </button>

                {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
            </form>
        </div>
    );
};

const Pay = () => {
    const amount = 10000; // Amount in cents (e.g., 6000 cents = $60)

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} />
        </Elements>
    );
};

export default Pay;
