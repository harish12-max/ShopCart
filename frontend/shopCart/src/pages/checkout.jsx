import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import "../styles/checkout.css";

const initialForm={fullName:"",phone:"",address:"",city:"",state:"",pincode:""};

const money=(value)=>`₹${Number(value||0).toLocaleString("en-IN")}`;

const Checkout=()=>{
 const navigate=useNavigate();
 const {cart,loading}=useCart();
 const [form,setForm]=useState(initialForm);
 const [errors,setErrors]=useState({});
 const [submitting,setSubmitting]=useState(false);
 const [submitError,setSubmitError]=useState("");
 const [placed,setPlaced]=useState(false);
 const [orderId,setOrderId]=useState("");

 const items=useMemo(()=>cart.filter((item)=>item?.product),[cart]);
 const subtotal=useMemo(()=>items.reduce((sum,item)=>sum+Number(item.product.price||0)*Number(item.quantity||0),0),[items]);
 const delivery=subtotal>=999?0:49;
 const total=subtotal+delivery;
 const itemCount=items.reduce((sum,item)=>sum+Number(item.quantity||0),0);

 const change=(e)=>{
  const {name,value}=e.target;
  setForm((prev)=>({...prev,[name]:value}));
  setErrors((prev)=>({...prev,[name]:""}));
  setSubmitError("");
 };

 const validate=()=>{
  const next={};
  if(form.fullName.trim().length<3) next.fullName="Enter your full name.";
  if(!/^\d{10}$/.test(form.phone.trim())) next.phone="Enter a valid 10-digit phone number.";
  if(form.address.trim().length<10) next.address="Enter your complete delivery address.";
  if(!form.city.trim()) next.city="Enter your city.";
  if(!form.state.trim()) next.state="Enter your state.";
  if(!/^\d{6}$/.test(form.pincode.trim())) next.pincode="Enter a valid 6-digit pincode.";
  setErrors(next);
  return Object.keys(next).length===0;
 };

 const placeOrder=async(e)=>{
  e.preventDefault();
  setSubmitError("");
  if(!validate()) return;
  if(!items.length){setSubmitError("Your cart is empty.");return;}
  setSubmitting(true);
  try{
   await new Promise((resolve)=>setTimeout(resolve,500));
   const id=`ORD-${Date.now().toString().slice(-8)}`;
   const newOrder={
    id,
    date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
    time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),
    status:"Placed",
    statusTone:"success",
    payment:"Pending",
    paymentTone:"warning",
    items:items.map((item)=>({
     id:item.product._id,
     name:item.product.name,
     category:item.product.category,
     price:Number(item.product.price||0),
     quantity:Number(item.quantity||0),
     image:item.product.image
    })),
    shippingAddress:{...form}
   };
   const previous=JSON.parse(localStorage.getItem("shopcart_orders")||"[]");
   localStorage.setItem("shopcart_orders",JSON.stringify([newOrder,...(Array.isArray(previous)?previous:[])]));
   setOrderId(id);
   setPlaced(true);
  }catch{
   setSubmitError("Something went wrong while placing your order.");
  }finally{
   setSubmitting(false);
  }
 };

 if(loading) return <div className="checkout-page"><div className="checkout-state"><div className="checkout-loader"/><h2>Preparing checkout</h2><p>Loading your cart details...</p></div></div>;

 if(placed) return <div className="checkout-page"><div className="checkout-success"><div className="checkout-success-icon">✓</div><p className="checkout-eyebrow">ORDER CONFIRMED</p><h1>Your order has been placed</h1><p className="checkout-success-copy">Your order is now ready to be processed. You can track it from My Orders.</p><div className="checkout-success-card"><div><span>Order ID</span><strong>{orderId}</strong></div><div><span>Total</span><strong>{money(total)}</strong></div></div><div className="checkout-success-actions"><button className="checkout-primary-button" onClick={()=>navigate("/orders")}>View My Orders</button><button className="checkout-secondary-button" onClick={()=>navigate("/products")}>Continue Shopping</button></div></div></div>;

 if(!items.length) return <div className="checkout-page"><div className="checkout-empty"><div className="checkout-empty-icon">🛒</div><p className="checkout-eyebrow">CHECKOUT</p><h1>Your cart is empty</h1><p>Add products to your cart before continuing.</p><button className="checkout-primary-button" onClick={()=>navigate("/products")}>Browse Products</button></div></div>;

 return <div className="checkout-page">
  <div className="checkout-header"><div><p className="checkout-eyebrow">CHECKOUT</p><h1>Complete your order</h1><p>Enter your delivery details and review your purchase.</p></div><button className="checkout-back-button" type="button" onClick={()=>navigate("/cart")}>← Back to Cart</button></div>
  <div className="checkout-stepper"><div className="checkout-step checkout-step-active"><span>1</span><div><strong>Delivery</strong><small>Shipping details</small></div></div><div className="checkout-step-line"/><div className="checkout-step checkout-step-active"><span>2</span><div><strong>Review</strong><small>Confirm order</small></div></div></div>
  <form className="checkout-layout" onSubmit={placeOrder}>
   <main className="checkout-main">
    <section className="checkout-card"><div className="checkout-section-heading"><div className="checkout-section-number">01</div><div><h2>Delivery details</h2><p>Where should we deliver your order?</p></div></div>
     {submitError&&<div className="checkout-error"><span>!</span>{submitError}</div>}
     <div className="checkout-form-grid">
      <Field label="Full name" name="fullName" value={form.fullName} onChange={change} error={errors.fullName} placeholder="Enter your full name" full/>
      <Field label="Phone number" name="phone" value={form.phone} onChange={change} error={errors.phone} placeholder="10-digit mobile number" maxLength="10" full/>
      <div className="checkout-field checkout-field-full"><label htmlFor="address">Address</label><textarea id="address" name="address" rows="4" value={form.address} onChange={change} placeholder="House / flat, street, area, landmark..." aria-invalid={Boolean(errors.address)}/>{errors.address&&<small className="field-error">{errors.address}</small>}</div>
      <Field label="City" name="city" value={form.city} onChange={change} error={errors.city} placeholder="Your city"/>
      <Field label="State" name="state" value={form.state} onChange={change} error={errors.state} placeholder="Your state"/>
      <Field label="Pincode" name="pincode" value={form.pincode} onChange={change} error={errors.pincode} placeholder="6-digit pincode" maxLength="6"/>
     </div>
    </section>
    <section className="checkout-card"><div className="checkout-section-heading"><div className="checkout-section-number">02</div><div><h2>Payment method</h2><p>Choose how you want to pay.</p></div></div><div className="checkout-payment-option checkout-payment-selected"><div className="checkout-radio"><span/></div><div><strong>Cash on Delivery</strong><p>Pay when your order arrives at your doorstep.</p></div><span className="checkout-payment-tag">Available</span></div><div className="checkout-payment-option checkout-payment-disabled"><div className="checkout-radio"><span/></div><div><strong>Online Payment</strong><p>Online payment will be connected later.</p></div><span className="checkout-payment-tag">Coming soon</span></div></section>
   </main>
   <aside className="checkout-sidebar"><section className="checkout-card checkout-review-card"><div className="checkout-review-heading"><div><p className="checkout-eyebrow">YOUR ORDER</p><h2>Order review</h2></div><span>{itemCount} items</span></div>
    <div className="checkout-review-items">{items.map((item)=><div className="checkout-review-item" key={item.product._id}><div className="checkout-review-image"><img src={item.product.image} alt={item.product.name}/><span>{item.quantity}</span></div><div className="checkout-review-details"><strong>{item.product.name}</strong><small>{item.product.category}</small></div><strong className="checkout-review-price">{money(Number(item.product.price||0)*Number(item.quantity||0))}</strong></div>)}</div>
    <div className="checkout-summary-list"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong>{delivery===0?"FREE":money(delivery)}</strong></div></div>
    <div className="checkout-summary-total"><div><span>Total</span><strong>{money(total)}</strong></div><small>Inclusive of all applicable charges</small></div>
    <button className="checkout-primary-button checkout-place-button" disabled={submitting}>{submitting?<><span className="checkout-button-spinner"/>Placing order...</>:<>Place Order <span>→</span></>}</button>
    <p className="checkout-secure-note">🔒 Your order details are securely handled by ShopCart.</p>
   </section></aside>
  </form>
 </div>;
};

const Field=({label,name,value,onChange,error,placeholder,maxLength,full})=><div className={full?"checkout-field checkout-field-full":"checkout-field"}><label htmlFor={name}>{label}</label><input id={name} name={name} type={name==="phone"?"tel":"text"} inputMode={name==="phone"||name==="pincode"?"numeric":undefined} maxLength={maxLength} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)}/>{error&&<small className="field-error">{error}</small>}</div>;

export default Checkout;
