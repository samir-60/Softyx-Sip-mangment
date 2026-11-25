<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice {{ $order->order_number }}</title>
<style>
  @page { margin: 40px; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C2C2C; background: #FFFFFF; font-size: 12px; }
  .page { padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 2px solid #2C2C2C; }
  .brand-block {}
  .brand-name { font-size: 18px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 400; color: #2C2C2C; }
  .brand-sub { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(44,44,44,0.4); margin-top: 4px; }
  .invoice-block { text-align: right; }
  .invoice-label { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(44,44,44,0.4); }
  .invoice-number { font-size: 20px; font-weight: 300; color: #C17B3F; margin-top: 4px; letter-spacing: 0.05em; }
  .invoice-date { font-size: 10px; color: rgba(44,44,44,0.5); margin-top: 4px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 40px; }
  .meta-block {}
  .meta-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(44,44,44,0.35); margin-bottom: 6px; }
  .meta-value { font-size: 13px; color: #2C2C2C; font-weight: 400; }
  .meta-sub { font-size: 10px; color: rgba(44,44,44,0.45); margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead tr { border-bottom: 1px solid #E8E0D0; }
  th { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(44,44,44,0.35); font-weight: 400; padding: 0 0 10px 0; text-align: left; }
  th.right { text-align: right; }
  td { padding: 12px 0; border-bottom: 1px solid #F5F0E8; font-size: 12px; vertical-align: top; }
  td.right { text-align: right; font-weight: 500; }
  .item-name { font-weight: 400; color: #2C2C2C; }
  .item-unit { font-size: 10px; color: rgba(44,44,44,0.4); margin-top: 2px; }
  .totals-section { margin-left: auto; width: 240px; }
  .total-line { display: flex; justify-content: space-between; padding: 5px 0; font-size: 11px; color: rgba(44,44,44,0.6); }
  .total-line.final { border-top: 1px solid #2C2C2C; padding-top: 10px; margin-top: 6px; font-size: 14px; color: #2C2C2C; font-weight: 500; }
  .total-line.discount { color: #8B9E6E; }
  .footer-section { margin-top: 60px; padding-top: 20px; border-top: 1px solid #E8E0D0; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-note { font-size: 10px; color: rgba(44,44,44,0.35); line-height: 1.6; }
  .footer-brand { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(44,44,44,0.3); text-align: right; }
  .accent-line { width: 32px; height: 2px; background: #C17B3F; margin-bottom: 20px; }
  .status-pill { display: inline-block; padding: 3px 10px; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; border: 1px solid #8B9E6E; color: #8B9E6E; }
</style>
</head>
<body>
<div class="page">
  <div class="accent-line"></div>

  <!-- Header -->
  <div class="header">
    <div class="brand-block">
      <div class="brand-name">Softyx <span style="color:#C17B3F">&amp;</span> Sip</div>
      <div class="brand-sub">Food and Beverages</div>
    </div>
    <div class="invoice-block">
      <div class="invoice-label">Invoice</div>
      <div class="invoice-number">{{ $order->order_number }}</div>
      <div class="invoice-date">{{ $order->created_at->format('d F Y') }}</div>
    </div>
  </div>

  <!-- Meta -->
  <div class="meta-grid">
    <div class="meta-block">
      <div class="meta-label">Billed To</div>
      <div class="meta-value">{{ $order->customer_name }}</div>
      @if($order->customer_email)
        <div class="meta-sub">{{ $order->customer_email }}</div>
      @endif
      @if($order->customer_phone)
        <div class="meta-sub">{{ $order->customer_phone }}</div>
      @endif
    </div>
    <div class="meta-block">
      <div class="meta-label">Table</div>
      <div class="meta-value">{{ $order->table?->name ?? 'Takeaway' }}</div>
      <div class="meta-sub">{{ $order->created_at->format('H:i') }}</div>
    </div>
    <div class="meta-block" style="text-align: right">
      <div class="meta-label">Status</div>
      <span class="status-pill">{{ ucfirst($order->payment_status) }}</span>
      @if($order->payment_method)
        <div class="meta-sub" style="margin-top: 6px">{{ ucfirst($order->payment_method) }}</div>
      @endif
    </div>
  </div>

  <!-- Items Table -->
  <table>
    <thead>
      <tr>
        <th style="width: 50%">Description</th>
        <th style="width: 15%; text-align: center">Qty</th>
        <th style="width: 17.5%; text-align: right">Unit Price</th>
        <th style="width: 17.5%; text-align: right">Total</th>
      </tr>
    </thead>
    <tbody>
      @foreach($order->items as $item)
      <tr>
        <td>
          <div class="item-name">{{ $item->product_name }}</div>
          @if($item->options)
            <div class="item-unit">
              @foreach($item->options as $key => $val){{ $key }}: {{ $val }}@if(!$loop->last), @endif@endforeach
            </div>
          @endif
        </td>
        <td style="text-align: center; color: rgba(44,44,44,0.6)">{{ $item->quantity }}</td>
        <td class="right">BDT {{ number_format($item->unit_price, 0) }}</td>
        <td class="right">BDT {{ number_format($item->subtotal, 0) }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-section">
    <div class="total-line">
      <span>Subtotal</span>
      <span>BDT {{ number_format($order->subtotal, 0) }}</span>
    </div>
    @if($order->discount_amount > 0)
    <div class="total-line discount">
      <span>Discount</span>
      <span>-BDT {{ number_format($order->discount_amount, 0) }}</span>
    </div>
    @endif
    <div class="total-line final">
      <span>Total</span>
      <span>BDT {{ number_format($order->total, 0) }}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer-section">
    <div class="footer-note">
      Thank you for dining with us.<br>
      For support, contact us through our website.<br>
      Clothing available at <strong>softyx.shop</strong>
    </div>
    <div class="footer-brand">
      Softyx <span style="color: #C17B3F">&amp;</span> Sip<br>
      <span style="font-size: 9px; color: rgba(44,44,44,0.2)">Food and Beverages</span>
    </div>
  </div>
</div>
</body>
</html>
