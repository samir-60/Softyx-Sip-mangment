<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Confirmed — SOFTYX &amp; SIP</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #F5F0E8; color: #2C2C2C; }
  .wrapper { max-width: 580px; margin: 0 auto; padding: 32px 16px; }
  .card { background: #FFFFFF; border: 1px solid #E8E0D0; overflow: hidden; }
  .header { background: linear-gradient(135deg, #2C2C2C 0%, #3D3028 60%, #2C2C2C 100%); padding: 48px 40px; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(193,123,63,0.3) 0%, transparent 70%); }
  .header::after { content: ''; position: absolute; bottom: -20px; left: 20px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(139,158,110,0.2) 0%, transparent 70%); }
  .brand { position: relative; z-index: 1; }
  .brand-name { color: #F5F0E8; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: 400; }
  .brand-accent { color: #C17B3F; }
  .order-confirmed-label { color: rgba(245,240,232,0.5); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 24px; display: block; }
  .order-heading { color: #F5F0E8; font-size: 28px; font-weight: 300; margin-top: 6px; letter-spacing: -0.02em; }
  .order-number-display { display: inline-block; color: #C17B3F; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px; }
  .body { padding: 40px; }
  .greeting { color: #2C2C2C; font-size: 15px; font-weight: 400; margin-bottom: 8px; }
  .subtext { color: rgba(44,44,44,0.5); font-size: 13px; font-weight: 300; line-height: 1.6; margin-bottom: 32px; }
  .section-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(44,44,44,0.35); margin-bottom: 12px; display: block; }
  .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  .items-table th { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(44,44,44,0.35); font-weight: 400; padding: 0 0 10px 0; text-align: left; border-bottom: 1px solid #E8E0D0; }
  .items-table th:last-child { text-align: right; }
  .items-table td { padding: 12px 0; font-size: 13px; border-bottom: 1px solid #F5F0E8; vertical-align: top; }
  .items-table td:last-child { text-align: right; font-weight: 500; }
  .item-name { color: #2C2C2C; font-weight: 400; }
  .item-qty { color: rgba(44,44,44,0.4); font-size: 12px; }
  .totals { background: #F5F0E8; padding: 20px; margin-bottom: 32px; }
  .total-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 13px; color: rgba(44,44,44,0.6); }
  .total-row.final { padding-top: 12px; margin-top: 8px; border-top: 1px solid #E8E0D0; color: #2C2C2C; font-size: 15px; font-weight: 500; }
  .cta-section { text-align: center; padding: 32px 0; border-top: 1px solid #E8E0D0; }
  .cta-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(44,44,44,0.35); margin-bottom: 16px; }
  .cta-button { display: inline-block; background: #C17B3F; color: #F5F0E8; padding: 14px 32px; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; text-decoration: none; }
  .footer { padding: 32px 40px; background: #F5F0E8; border-top: 1px solid #E8E0D0; }
  .footer-brand { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(44,44,44,0.35); margin-bottom: 8px; }
  .footer-note { font-size: 11px; color: rgba(44,44,44,0.35); line-height: 1.6; }
  .footer-link { color: #C17B3F; text-decoration: none; }
  .status-badge { display: inline-block; padding: 3px 10px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; background: rgba(139,158,110,0.15); color: #8B9E6E; }
  .options-text { font-size: 11px; color: rgba(44,44,44,0.4); margin-top: 2px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">

    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-name">
          Softyx <span class="brand-accent">&amp;</span> Sip
        </div>
        <span class="order-confirmed-label">Order Confirmation</span>
        <div class="order-heading">Thank you,<br>{{ $order->customer_name }}.</div>
        <span class="order-number-display">{{ $order->order_number }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="greeting">Your order has been received.</p>
      <p class="subtext">
        We're preparing your order now. You'll receive another notification when it's ready.
        @if($order->table)
          Your order is for <strong>{{ $order->table->name }}</strong>.
        @endif
      </p>

      <!-- Order Items -->
      <span class="section-label">Items Ordered</span>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align:center">Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          @foreach($order->items as $item)
          <tr>
            <td>
              <div class="item-name">{{ $item->product_name }}</div>
              @if($item->options)
                <div class="options-text">
                  @foreach($item->options as $key => $val)
                    {{ $key }}: {{ $val }}@if(!$loop->last), @endif
                  @endforeach
                </div>
              @endif
            </td>
            <td style="text-align:center" class="item-qty">{{ $item->quantity }}</td>
            <td>BDT {{ number_format($item->subtotal, 0) }}</td>
          </tr>
          @endforeach
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>BDT {{ number_format($order->subtotal, 0) }}</span>
        </div>
        @if($order->discount_amount > 0)
        <div class="total-row">
          <span>Discount</span>
          <span style="color: #8B9E6E">-BDT {{ number_format($order->discount_amount, 0) }}</span>
        </div>
        @endif
        <div class="total-row final">
          <span>Total</span>
          <span>BDT {{ number_format($order->total, 0) }}</span>
        </div>
      </div>

      <!-- Status -->
      <div style="margin-bottom: 32px;">
        <span class="section-label">Order Status</span>
        <span class="status-badge">{{ ucfirst($order->status) }}</span>
        <p style="font-size: 12px; color: rgba(44,44,44,0.4); margin-top: 10px; font-weight: 300;">
          Payment: {{ ucfirst($order->payment_status) }}
        </p>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <p class="cta-label">Questions about your order?</p>
        <a href="{{ url('/') }}" class="cta-button">Visit SOFTYX &amp; SIP</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-brand">Softyx <span style="color: #C17B3F">&amp;</span> Sip</p>
      <p class="footer-note">
        This confirmation was sent to {{ $order->customer_email }}.<br>
        Looking for clothing? Visit <a href="https://softyx.shop" class="footer-link">softyx.shop</a>.
      </p>
    </div>

  </div>
  <p style="text-align: center; font-size: 11px; color: rgba(44,44,44,0.3); margin-top: 20px; letter-spacing: 0.1em;">
    &copy; {{ date('Y') }} SOFTYX &amp; SIP. Food and Beverages.
  </p>
</div>
</body>
</html>
