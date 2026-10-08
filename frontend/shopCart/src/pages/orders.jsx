import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/orders.css";

const seedOrders=[
 {id:"ORD-84253190",date:"08 Oct 2026",time:"10:42 PM",status:"Delivered",statusTone:"success",payment:"Paid",paymentTone:"success",items:[{id:"demo-1",name:"Minimal Everyday Backpack",category:"Bags",price:1299,quantity:1,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"},{id:"demo-2",name:"Classic Analog Watch",category:"Accessories",price:799,quantity:1,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"}],shippingAddress:{fullName:"Rahul Sharma",phone:"9876543210",address:"24 Green Avenue, Indiranagar",city:"Bengaluru",state:"Karnataka",pincode:"560038"}},
 {id:"ORD-61573842",date:"06 Oct 2026",time:"03:15 PM",status:"Pending",statusTone:"warning",payment:"Pending",paymentTone:"warning",items:[{id:"demo-3",name:"Wireless Headphones",category:"Electronics",price:2199,quantity:1,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"}],shippingAddress:{fullName:"Rahul Sharma",phone:"9876543210",address:"24 Green Avenue, Indiranagar",city:"Bengaluru",state:"Karnataka",pincode:"560038"}},
 {id:"ORD-30714625",date:"03 Oct 2026",time:"08:05 PM",status:"Failed",statusTone:"danger",payment:"Failed",paymentTone:"danger",items:[{id:"demo-4",name:"Urban Running Shoes",category:"Footwear",price:1899,quantity:1,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"}],shippingAddress:{fullName:"Rahul Sharma",phone:"9876543210",address:"24 Green Avenue, Indiranagar",city:"Bengaluru",state:"Karnataka",pincode:"560038"}},
 {id:"ORD-12498651",date:"27 Sep 2026",time:"12:20 PM",status:"Cancelled",statusTone:"neutral",payment:"Refunded",paymentTone:"success",items:[{id:"demo-5",name:"Ceramic Coffee Mug",category:"Home",price:499,quantity:2,image:"https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=600&q=80"}],shippingAddress:{fullName:"Rahul Sharma",phone:"9876543210",address:"24 Green Avenue, Indiranagar",city:"Bengaluru",state:"Karnataka",pincode:"560038"}}
];

const money=(value)=>`₹${Number(value||0).toLocaleString("en-IN")}`;
const stored=()=>{try{const value=JSON.parse(localStorage.getItem("shopcart_orders")||"[]");return Array.isArray(value)?value:[]}catch{return[]}};

const Orders=()=>{
 const navigate=useNavigate();
 const {id}=useParams();
 const [filter,setFilter]=useState("All");
 const [customOrders]=useState(stored);

 const orders=useMemo(()=>[...customOrders,...seedOrders].map((order)=>({...order,status:order.status||"Placed",statusTone:order.statusTone||"success",payment:order.payment||"Pending",paymentTone:order.paymentTone||"warning"})),[customOrders]);
 const filtered=orders.filter((order)=>{
  if(filter==="Active") return ["Placed","Pending"].includes(order.status);
  if(filter==="Completed") return ["Delivered"].includes(order.status);
  return true;
 });
 const order=orders.find((item)=>item.id===id);

 if(id){
  if(!order) return <div className="orders-page"><div className="orders-state"><div className="orders-state-icon">?</div><p className="orders-eyebrow">ORDER NOT FOUND</p><h1>We couldn't find that order</h1><p>The order may have been removed or the link is invalid.</p><button className="orders-primary-button" onClick={()=>navigate("/orders")}>Back to My Orders</button></div></div>;
  const subtotal=order.items.reduce((sum,item)=>sum+Number(item.price||0)*Number(item.quantity||0),0);
  const delivery=subtotal>=999?0:49;
  const count=order.items.reduce((sum,item)=>sum+Number(item.quantity||0),0);
  return <div className="orders-page"><div className="orders-detail-header"><button className="orders-back-button" onClick={()=>navigate("/orders")}>← My Orders</button><div className="orders-detail-title"><p className="orders-eyebrow">ORDER DETAILS</p><h1>{order.id}</h1><p>Placed on {order.date} at {order.time}</p></div><span className={`order-status order-status-${order.statusTone}`}>{order.status}</span></div>
   <div className="orders-detail-grid"><main className="orders-detail-main"><section className="orders-detail-card"><div className="orders-card-heading"><div><p className="orders-eyebrow">ITEMS</p><h2>Order items</h2></div><span>{count} items</span></div><div className="orders-detail-items">{order.items.map((item)=><article className="orders-detail-item" key={item.id}><div className="orders-detail-image"><img src={item.image} alt={item.name}/></div><div className="orders-detail-item-info"><span>{item.category}</span><h3>{item.name}</h3><p>Quantity: {item.quantity} · {money(item.price)} each</p></div><strong>{money(item.price*item.quantity)}</strong></article>)}</div></section>
   <section className="orders-detail-card"><div className="orders-card-heading"><div><p className="orders-eyebrow">DELIVERY</p><h2>Shipping address</h2></div></div><div className="orders-address"><strong>{order.shippingAddress?.fullName}</strong><p>{order.shippingAddress?.address}</p><p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p><span>Phone: {order.shippingAddress?.phone}</span></div></section></main>
   <aside className="orders-detail-sidebar"><section className="orders-detail-card orders-summary-card"><p className="orders-eyebrow">SUMMARY</p><h2>Payment summary</h2><div className="orders-summary-row"><span>Items</span><span>{count}</span></div><div className="orders-summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="orders-summary-row"><span>Delivery</span><span>{delivery===0?"FREE":"₹49"}</span></div><div className="orders-summary-divider"/><div className="orders-summary-total"><span>Total</span><strong>{money(subtotal+delivery)}</strong></div><div className="orders-payment-status"><span>Payment</span><strong className={`payment-status-${order.paymentTone}`}>{order.payment}</strong></div></section>
   <section className="orders-detail-card orders-timeline-card"><p className="orders-eyebrow">STATUS</p><h2>Order progress</h2><div className="orders-timeline"><Timeline active label="Order placed" note={order.date}/><Timeline active={order.status==="Delivered"} label="Processing" note={order.status==="Failed"?"Payment issue":"Preparing your order"}/><Timeline active={order.status==="Delivered"} label="Delivered" note={order.status==="Delivered"?"Successfully delivered":"Awaiting delivery"}/></div></section></aside></div></div>;
 }

 return <div className="orders-page"><div className="orders-header"><div><p className="orders-eyebrow">SHOPCART</p><h1>My Orders</h1><p>Track your purchases and view complete order details.</p></div><button className="orders-secondary-button" onClick={()=>navigate("/products")}>Continue Shopping</button></div>
  <div className="orders-toolbar"><div className="orders-filter-heading"><strong>{orders.length}</strong><span>orders</span></div><div className="orders-filter-tabs">{["All","Active","Completed"].map((name)=><button key={name} className={filter===name?"active":""} onClick={()=>setFilter(name)}>{name}</button>)}</div></div>
  <div className="orders-list">{filtered.map((order)=>{const count=order.items.reduce((sum,item)=>sum+Number(item.quantity||0),0);const amount=order.items.reduce((sum,item)=>sum+Number(item.price||0)*Number(item.quantity||0),0);return <article className="order-card" key={order.id}><div className="order-card-top"><div><div className="order-card-id-row"><span className="order-card-id">{order.id}</span><span className={`order-status order-status-${order.statusTone}`}>{order.status}</span></div><p>{order.date} · {order.time}</p></div><div className="order-card-total"><span>Total</span><strong>{money(amount)}</strong></div></div><div className="order-card-items">{order.items.slice(0,3).map((item)=><div className="order-mini-item" key={item.id}><img src={item.image} alt={item.name}/><div><strong>{item.name}</strong><span>Qty {item.quantity}</span></div></div>)}{order.items.length>3&&<div className="order-more-items">+{order.items.length-3} more</div>}</div><div className="order-card-bottom"><div className="order-meta"><span>{count} items</span><span>•</span><span>Payment: {order.payment}</span></div><button className="orders-view-button" onClick={()=>navigate(`/orders/${order.id}`)}>View Details <span>→</span></button></div></article>})}</div>
 </div>;
};

const Timeline=({active,label,note})=><div className={active?"orders-timeline-item active":"orders-timeline-item"}><span/><div><strong>{label}</strong><small>{note}</small></div></div>;

export default Orders;
