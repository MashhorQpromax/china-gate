'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
  moq: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  addedAt: string;
}

const CART_KEY = 'cg_inquiry_cart';

export default function InquiryCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user?.id || data?.data?.id) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
    window.dispatchEvent(new CustomEvent('inquiry-cart-updated'));
  };

  const removeItem = (productId: string) => {
    updateCart(items.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    updateCart(items.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    updateCart([]);
  };

  // Group items by supplier
  const groupedBySupplier: Record<string, { supplierName: string; supplierId: string; items: CartItem[] }> = {};
  items.forEach(item => {
    if (!groupedBySupplier[item.supplierId]) {
      groupedBySupplier[item.supplierId] = {
        supplierName: item.supplierName,
        supplierId: item.supplierId,
        items: [],
      };
    }
    groupedBySupplier[item.supplierId].items.push(item);
  });

  const formatPrice = (price: number, currency: string) => {
    const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
    return `${currency || 'USD'} ${safePrice.toLocaleString()}`;
  };

  const handleSendInquiries = async () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/marketplace/inquiry-cart');
      return;
    }
    setSending(true);
    try {
      // Send one message per supplier with all their products
      for (const group of Object.values(groupedBySupplier)) {
        const productLines = group.items.map(item =>
          `- ${item.name}: ${item.quantity} ${item.unit} (${formatPrice(item.price, item.currency)} each)`
        ).join('\n');

        const message = `Hi, I'd like to inquire about the following products:\n\n${productLines}\n\nPlease provide your best quotation. Thank you!`;

        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            recipient_id: group.supplierId,
            content: message,
          }),
        });
      }

      // Clear cart after sending
      clearCart();
      setSent(true);
    } catch (err) {
      console.error('Failed to send inquiries:', err);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Inquiries Sent!</h1>
          <p className="text-gray-400 mb-6">
            Your inquiries have been sent to {Object.keys(groupedBySupplier).length || 'the'} supplier(s). Check your messages for their responses.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/messages" className="px-6 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
              Go to Messages
            </Link>
            <Link href="/marketplace/products" className="px-6 py-2 border border-[#242830] text-white rounded-lg hover:bg-[#12151c] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-white">Inquiry Cart</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Inquiry Cart
            {items.length > 0 && (
              <span className="text-gray-400 text-lg font-normal ml-2">({items.length} item{items.length !== 1 ? 's' : ''})</span>
            )}
          </h1>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            <h2 className="text-xl font-bold text-gray-300 mb-2">Your inquiry cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse products and add them to your inquiry cart to request quotes from suppliers.</p>
            <Link href="/marketplace/products" className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Grouped by Supplier */}
            {Object.values(groupedBySupplier).map(group => (
              <div key={group.supplierId} className="bg-[#12151c] border border-[#1e2230] rounded-xl overflow-hidden">
                {/* Supplier Header */}
                <div className="px-6 py-3 bg-[#1a1d23] border-b border-[#1e2230] flex items-center justify-between">
                  <Link href={`/marketplace/suppliers/${group.supplierId}`} className="font-semibold text-white hover:text-[#c41e3a] transition-colors">
                    {group.supplierName || 'Supplier'}
                  </Link>
                  <span className="text-xs text-gray-400">{group.items.length} product{group.items.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Products */}
                <div className="divide-y divide-[#1e2230]">
                  {group.items.map(item => (
                    <div key={item.productId} className="px-6 py-4 flex items-center gap-4">
                      {/* Image */}
                      <Link href={`/marketplace/products/${item.productId}`} className="flex-shrink-0">
                        <div className="w-16 h-16 bg-[#1a1d23] rounded-lg overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/marketplace/products/${item.productId}`} className="text-sm font-medium text-white hover:text-[#c41e3a] transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {formatPrice(item.price, item.currency)} / {item.unit || 'pc'}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-400">Qty:</label>
                        <input
                          type="number"
                          value={item.quantity}
                          min={item.moq || 1}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || item.moq || 1)}
                          className="w-20 bg-[#0a0d14] border border-[#242830] rounded px-2 py-1 text-sm text-white text-center"
                        />
                        <span className="text-xs text-gray-500">{item.unit || 'pcs'}</span>
                      </div>

                      {/* Estimated Total */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-semibold text-[#d4a843]">
                          {formatPrice(item.price * item.quantity, item.currency)}
                        </div>
                        <div className="text-[10px] text-gray-500">estimated</div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Summary and Send */}
            <div className="bg-[#12151c] border border-[#1e2230] rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {items.length} product{items.length !== 1 ? 's' : ''} from {Object.keys(groupedBySupplier).length} supplier{Object.keys(groupedBySupplier).length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    A message will be sent to each supplier with your inquiry details
                  </p>
                </div>
                <button
                  onClick={handleSendInquiries}
                  disabled={sending}
                  className="px-8 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 whitespace-nowrap"
                >
                  {sending ? 'Sending...' : isLoggedIn ? 'Send Inquiries' : 'Login to Send Inquiries'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
