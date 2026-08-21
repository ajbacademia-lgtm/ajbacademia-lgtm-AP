import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  Building, 
  Coins, 
  X, 
  Save, 
  Zap, 
  Lock,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { PaymentGatewayConfig, PaymentGatewayType } from '../../types';
import { MockService } from '../../services/mockDb';

export const PaymentGatewaysManager: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  // New Gateway Modal Form State
  const [presetType, setPresetType] = useState<string>('razorpay');
  const [newName, setNewName] = useState('Razorpay Payment Gateway');
  const [newId, setNewId] = useState('razorpay');
  const [newDesc, setNewDesc] = useState('Online payment processing for India and global multi-currency transactions.');
  const [newMode, setNewMode] = useState<'test' | 'live' | 'sandbox' | 'mainnet' | 'testnet'>('test');
  const [newCurrencies, setNewCurrencies] = useState('INR, USD, EUR, GBP, SGD');
  const [newPublicKey, setNewPublicKey] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [newApiEndpoint, setNewApiEndpoint] = useState('');
  const [newCustomNotes, setNewCustomNotes] = useState('');
  const [newEnabled, setNewEnabled] = useState(true);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    setLoading(true);
    try {
      const data = await MockService.getPaymentGateways();
      setGateways(data);
    } catch (e) {
      console.error('Failed to load payment gateways:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnable = async (gateway: PaymentGatewayConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...gateway, enabled: !gateway.enabled };
    const newList = await MockService.updatePaymentGatewayConfig(updated);
    setGateways(newList);
  };

  const handleOpenGatewayModal = (gateway: PaymentGatewayConfig) => {
    setSelectedGateway(JSON.parse(JSON.stringify(gateway))); // deep copy
    setSaveSuccess(false);
  };

  const handleSaveGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGateway) return;

    try {
      const newList = await MockService.updatePaymentGatewayConfig(selectedGateway);
      setGateways(newList);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setSelectedGateway(null);
      }, 1200);
    } catch (err) {
      console.error('Failed to update gateway:', err);
    }
  };

  const handleDeleteGateway = async (gatewayId: string, gatewayName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the payment gateway "${gatewayName}"?`)) {
      try {
        const newList = await MockService.deletePaymentGateway(gatewayId);
        setGateways(newList);
        setActionNotification(`Payment gateway "${gatewayName}" deleted successfully.`);
        setTimeout(() => setActionNotification(null), 3500);
      } catch (err) {
        console.error('Failed to delete gateway:', err);
      }
    }
  };

  const handlePresetChange = (preset: string) => {
    setPresetType(preset);
    switch (preset) {
      case 'razorpay':
        setNewName('Razorpay Payment Gateway');
        setNewId('razorpay');
        setNewDesc('Online payment processing for India and global multi-currency transactions.');
        setNewCurrencies('INR, USD, EUR, GBP, SGD');
        break;
      case 'square':
        setNewName('Square Financial Gateway');
        setNewId('square');
        setNewDesc('In-person, web, and mobile card payment processing by Square.');
        setNewCurrencies('USD, CAD, GBP, AUD, EUR');
        break;
      case 'authorizenet':
        setNewName('Authorize.Net Payment Gateway');
        setNewId('authorizenet');
        setNewDesc('Visa, Mastercard, Discover, and eCheck merchant payment services.');
        setNewCurrencies('USD, CAD, EUR, GBP');
        break;
      case 'adyen':
        setNewName('Adyen Enterprise Checkout');
        setNewId('adyen');
        setNewDesc('Omnichannel global payments, point-of-sale, and local payment methods.');
        setNewCurrencies('USD, EUR, GBP, CAD, AUD, JPY');
        break;
      case 'skrill':
        setNewName('Skrill Digital Wallet');
        setNewId('skrill');
        setNewDesc('Global online money transfers and e-wallet checkout.');
        setNewCurrencies('USD, EUR, GBP');
        break;
      case 'monnify':
        setNewName('Monnify Payment System');
        setNewId('monnify');
        setNewDesc('Account transfers, cards, and bank account reservations.');
        setNewCurrencies('NGN, USD');
        break;
      default:
        setNewName('Custom Webhook / API Gateway');
        setNewId(`custom_gw_${Date.now().toString().slice(-4)}`);
        setNewDesc('Custom REST API or webhook-integrated payment processing channel.');
        setNewCurrencies('USD, EUR, GBP');
        break;
    }
  };

  const handleAddGatewaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newId.trim()) return;

    const newGatewayObj: PaymentGatewayConfig = {
      id: newId.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      name: newName,
      enabled: newEnabled,
      mode: newMode,
      iconName: presetType,
      description: newDesc,
      isCustom: true,
      credentials: {
        publicKey: newPublicKey,
        secretKey: newSecretKey,
        webhookSecret: newWebhookSecret,
        apiEndpoint: newApiEndpoint,
        customNotes: newCustomNotes,
      },
      supportedCurrencies: newCurrencies.split(',').map(s => s.trim().toUpperCase()).filter(Boolean),
    };

    try {
      const updatedList = await MockService.addPaymentGateway(newGatewayObj);
      setGateways(updatedList);
      setShowAddModal(false);
      setActionNotification(`Payment Gateway "${newName}" created and activated!`);
      setTimeout(() => setActionNotification(null), 4000);
      
      // Reset defaults
      handlePresetChange('razorpay');
      setNewPublicKey('');
      setNewSecretKey('');
      setNewWebhookSecret('');
      setNewApiEndpoint('');
      setNewCustomNotes('');
    } catch (err) {
      console.error('Failed to add gateway:', err);
    }
  };

  // Icon mapping for payment gateways
  const renderGatewayIcon = (id: PaymentGatewayType, iconName?: string) => {
    const key = id || iconName || '';
    switch (key) {
      case 'stripe':
        return (
          <div className="w-12 h-12 rounded-md bg-indigo-600 text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-md">
            S
          </div>
        );
      case 'paypal':
        return (
          <div className="w-12 h-12 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold italic text-xl shadow-md">
            P
          </div>
        );
      case 'paystack':
        return (
          <div className="w-12 h-12 rounded-md bg-cyan-600 text-white flex items-center justify-center font-black text-lg shadow-md">
            PST
          </div>
        );
      case 'flutterwave':
        return (
          <div className="w-12 h-12 rounded-md bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-md">
            FLW
          </div>
        );
      case 'crypto':
        return (
          <div className="w-12 h-12 rounded-md bg-purple-700 text-white flex items-center justify-center shadow-md">
            <Coins size={24} />
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="w-12 h-12 rounded-md bg-slate-800 text-white flex items-center justify-center shadow-md">
            <Building size={24} />
          </div>
        );
      case 'razorpay':
        return (
          <div className="w-12 h-12 rounded-md bg-blue-700 text-white flex items-center justify-center font-black text-xs tracking-tighter shadow-md">
            RZP
          </div>
        );
      case 'square':
        return (
          <div className="w-12 h-12 rounded-md bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md">
            SQ
          </div>
        );
      case 'authorizenet':
        return (
          <div className="w-12 h-12 rounded-md bg-emerald-700 text-white flex items-center justify-center font-black text-[10px] shadow-md">
            AUTH
          </div>
        );
      case 'adyen':
        return (
          <div className="w-12 h-12 rounded-md bg-green-600 text-white flex items-center justify-center font-black text-xs shadow-md">
            ADY
          </div>
        );
      case 'skrill':
        return (
          <div className="w-12 h-12 rounded-md bg-purple-800 text-white flex items-center justify-center font-black text-xs shadow-md">
            SKR
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-md bg-brand-navy text-white flex items-center justify-center shadow-md font-bold text-xs uppercase">
            {key.substring(0, 3).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Notification */}
      {actionNotification && (
        <div className="bg-emerald-600 text-white p-4 rounded-md shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={18} /> {actionNotification}
          </div>
          <button onClick={() => setActionNotification(null)} className="text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-8 rounded-md text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-brand-action mb-2">
            <CreditCard size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Ingress & Gateways</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Payment Gateway Settings & API Keys</h2>
          <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
            Manage global checkout channels, credit card processors, mobile money, crypto wallets, and custom REST API gateways. Click on any provider icon to configure live/test API credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3.5 bg-brand-action hover:bg-brand-action/90 text-white text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} /> Add New Payment Gateway
          </button>

          <div className="hidden xl:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-md border border-white/10">
            <ShieldCheck size={28} className="text-emerald-400" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">Encryption Standard</div>
              <div className="text-xs font-mono font-bold text-emerald-300">256-bit AES Vault</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Grid Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-brand-navy">Active Payment Channels</h3>
          <p className="text-xs text-slate-500">
            {gateways.filter(g => g.enabled).length} of {gateways.length} payment gateways active on author checkout.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-navy/5 text-brand-navy hover:bg-brand-navy hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle size={15} /> Add Gateway
        </button>
      </div>

      {/* Gateway Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400 animate-pulse font-mono">
          Loading active payment gateway configurations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gateways.map(gw => (
            <div
              key={gw.id}
              onClick={() => handleOpenGatewayModal(gw)}
              className={`group bg-white rounded-md border transition-all duration-200 p-6 cursor-pointer relative shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                gw.enabled ? 'border-gray-200 hover:border-brand-action' : 'border-gray-100 opacity-75 bg-gray-50/50'
              }`}
            >
              {/* Enabled Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {renderGatewayIcon(gw.id, gw.iconName)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-base text-brand-navy group-hover:text-brand-action transition-colors">
                        {gw.name}
                      </h3>
                      {gw.isCustom && (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        gw.mode === 'live' || gw.mode === 'mainnet'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {gw.mode}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono line-clamp-1 max-w-[120px]">
                        {gw.credentials.publicKey || gw.credentials.clientId || gw.credentials.bankName || gw.credentials.apiEndpoint || 'Configured'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Delete Button for Custom Gateways */}
                  {gw.isCustom && (
                    <button
                      onClick={e => handleDeleteGateway(gw.id, gw.name, e)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="Delete Gateway"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  {/* Enable/Disable Toggle */}
                  <button
                    onClick={e => handleToggleEnable(gw, e)}
                    className={`p-1.5 rounded-full transition-colors ${
                      gw.enabled ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                    }`}
                    title={gw.enabled ? 'Gateway Active (Click to Disable)' : 'Gateway Inactive (Click to Enable)'}
                  >
                    {gw.enabled ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                {gw.description}
              </p>

              {/* Supported Currencies */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {gw.supportedCurrencies.slice(0, 4).map(curr => (
                    <span key={curr} className="text-[9px] font-mono font-bold bg-gray-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {curr}
                    </span>
                  ))}
                  {gw.supportedCurrencies.length > 4 && (
                    <span className="text-[9px] font-mono text-gray-400">
                      +{gw.supportedCurrencies.length - 4} more
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-action flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Configure Keys <Key size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW GATEWAY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[230] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden relative my-8">
            {/* Header */}
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-brand-action/20 text-brand-action flex items-center justify-center border border-brand-action/30">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Add New Payment Gateway</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                    Integrate custom merchant channels & API payment endpoints
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGatewaySubmit} className="p-6 space-y-5">
              {/* Preset Templates */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2">
                  Select Provider Preset or Custom Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'razorpay', label: 'Razorpay' },
                    { id: 'square', label: 'Square' },
                    { id: 'authorizenet', label: 'Authorize.Net' },
                    { id: 'adyen', label: 'Adyen' },
                    { id: 'skrill', label: 'Skrill' },
                    { id: 'monnify', label: 'Monnify' },
                    { id: 'custom', label: 'Custom REST API' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id)}
                      className={`p-2.5 text-center text-xs font-bold rounded border transition-all ${
                        presetType === p.id
                          ? 'bg-brand-navy text-white border-brand-navy shadow'
                          : 'bg-gray-50 text-slate-700 border-gray-200 hover:border-brand-action'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gateway Name & ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Gateway Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Razorpay Enterprise"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-brand-action"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Gateway ID / Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    placeholder="e.g. razorpay"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action bg-gray-50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Provider Description
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Brief description displayed to authors during checkout"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action"
                />
              </div>

              {/* Environment Mode & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Environment Mode
                  </label>
                  <select
                    value={newMode}
                    onChange={e => setNewMode(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action bg-white"
                  >
                    <option value="test">Test Sandbox Mode</option>
                    <option value="live">Live Production Mode</option>
                    <option value="mainnet">Mainnet Network</option>
                    <option value="testnet">Testnet Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Activation Status
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={newEnabled}
                      onChange={e => setNewEnabled(e.target.checked)}
                      className="w-4 h-4 text-brand-action rounded border-gray-300 focus:ring-brand-action"
                    />
                    <span className="text-xs font-bold text-brand-navy">
                      {newEnabled ? 'Enabled (Active for Checkout)' : 'Disabled (Inactive)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Supported Currencies */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Supported Settlement Currencies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={newCurrencies}
                  onChange={e => setNewCurrencies(e.target.value)}
                  placeholder="USD, EUR, GBP, NGN, INR, CAD"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                />
              </div>

              {/* API Credentials */}
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-brand-navy text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={14} className="text-brand-action" /> API Credentials & Integration Keys
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">Encrypted 256-bit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Public API Key / Client ID / Merchant ID
                    </label>
                    <input
                      type="text"
                      value={newPublicKey}
                      onChange={e => setNewPublicKey(e.target.value)}
                      placeholder="e.g. rzp_test_10293847"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Secret API Key / Private Token
                    </label>
                    <input
                      type="password"
                      value={newSecretKey}
                      onChange={e => setNewSecretKey(e.target.value)}
                      placeholder="Secret Key"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      API Endpoint URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={newApiEndpoint}
                      onChange={e => setNewApiEndpoint(e.target.value)}
                      placeholder="https://api.provider.com/v1"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Webhook Secret (Optional)
                    </label>
                    <input
                      type="text"
                      value={newWebhookSecret}
                      onChange={e => setNewWebhookSecret(e.target.value)}
                      placeholder="whsec_..."
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Author Checkout Instructions / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newCustomNotes}
                    onChange={e => setNewCustomNotes(e.target.value)}
                    placeholder="Instructions displayed to authors on checkout..."
                    className="w-full border border-gray-300 rounded-sm p-2 text-xs outline-none focus:border-brand-action"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-gray-100 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-action text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-navy transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={14} /> Create & Save Payment Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GATEWAY CREDENTIALS MODAL */}
      {selectedGateway && (
        <div className="fixed inset-0 z-[220] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden relative my-8">
            {/* Modal Header */}
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                {renderGatewayIcon(selectedGateway.id, selectedGateway.iconName)}
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">{selectedGateway.name}</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
                    API Credentials & Gateway Configuration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGateway(null)}
                className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGateway} className="p-6 space-y-6">
              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-sm text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} /> API credentials updated and saved successfully!
                </div>
              )}

              {/* Status and Environment Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Gateway Status
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={selectedGateway.enabled}
                      onChange={e => setSelectedGateway({ ...selectedGateway, enabled: e.target.checked })}
                      className="w-4 h-4 text-brand-action rounded border-gray-300 focus:ring-brand-action"
                    />
                    <span className="text-xs font-bold text-brand-navy">
                      {selectedGateway.enabled ? 'Enabled (Active for Checkout)' : 'Disabled (Hidden from Authors)'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                    Environment / Mode
                  </label>
                  <select
                    value={selectedGateway.mode}
                    onChange={e => setSelectedGateway({ ...selectedGateway, mode: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-xs outline-none focus:border-brand-action bg-white font-mono"
                  >
                    <option value="test">Test Mode / Sandbox</option>
                    <option value="live">Live Production Mode</option>
                    <option value="mainnet">Mainnet (Crypto)</option>
                    <option value="testnet">Testnet (Crypto)</option>
                  </select>
                </div>
              </div>

              {/* Edit Name & Description for Custom Gateways */}
              {selectedGateway.isCustom && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-sm border border-blue-100">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                      Gateway Display Name
                    </label>
                    <input
                      type="text"
                      value={selectedGateway.name}
                      onChange={e => setSelectedGateway({ ...selectedGateway, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-xs font-bold outline-none focus:border-brand-action bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                      Gateway Description
                    </label>
                    <input
                      type="text"
                      value={selectedGateway.description}
                      onChange={e => setSelectedGateway({ ...selectedGateway, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-xs outline-none focus:border-brand-action bg-white"
                    />
                  </div>
                </div>
              )}

              {/* DYNAMIC CREDENTIAL FIELDS PER GATEWAY */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-serif font-bold text-brand-navy text-sm flex items-center gap-2">
                    <Lock size={16} className="text-brand-action" /> API Keys & Access Tokens
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">Sensitive Credentials</span>
                </div>

                {/* STRIPE FIELDS */}
                {selectedGateway.id === 'stripe' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Stripe Publishable Key (pk_...)
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.publicKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, publicKey: e.target.value }
                        })}
                        placeholder="pk_test_..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Stripe Secret Key (sk_...)
                      </label>
                      <input
                        type="password"
                        value={selectedGateway.credentials.secretKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, secretKey: e.target.value }
                        })}
                        placeholder="sk_test_..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Webhook Signing Secret (whsec_...)
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.webhookSecret || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, webhookSecret: e.target.value }
                        })}
                        placeholder="whsec_..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                  </>
                )}

                {/* PAYPAL FIELDS */}
                {selectedGateway.id === 'paypal' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        PayPal Client ID
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.clientId || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, clientId: e.target.value }
                        })}
                        placeholder="PayPal Client ID"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        PayPal Client Secret
                      </label>
                      <input
                        type="password"
                        value={selectedGateway.credentials.clientSecret || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, clientSecret: e.target.value }
                        })}
                        placeholder="PayPal Client Secret"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Merchant Payer ID / Account ID
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.payerId || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, payerId: e.target.value }
                        })}
                        placeholder="PAYPAL_MERCHANT_ID"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                  </>
                )}

                {/* PAYSTACK FIELDS */}
                {selectedGateway.id === 'paystack' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Paystack Public Key (pk_...)
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.paystackPublicKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, paystackPublicKey: e.target.value }
                        })}
                        placeholder="pk_test_..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Paystack Secret Key (sk_...)
                      </label>
                      <input
                        type="password"
                        value={selectedGateway.credentials.paystackSecretKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, paystackSecretKey: e.target.value }
                        })}
                        placeholder="sk_test_..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Merchant Contact Email
                      </label>
                      <input
                        type="email"
                        value={selectedGateway.credentials.merchantEmail || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, merchantEmail: e.target.value }
                        })}
                        placeholder="billing@academicpublishinggroup.org"
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                  </>
                )}

                {/* FLUTTERWAVE FIELDS */}
                {selectedGateway.id === 'flutterwave' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Flutterwave Public Key (FLWPUBK_...)
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.flwPublicKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, flwPublicKey: e.target.value }
                        })}
                        placeholder="FLWPUBK_TEST-..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Flutterwave Secret Key (FLWSECK_...)
                      </label>
                      <input
                        type="password"
                        value={selectedGateway.credentials.flwSecretKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, flwSecretKey: e.target.value }
                        })}
                        placeholder="FLWSECK_TEST-..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Encryption Key
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.flwEncryptionKey || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, flwEncryptionKey: e.target.value }
                        })}
                        placeholder="FLWENC_TEST_..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                  </>
                )}

                {/* CRYPTO FIELDS */}
                {selectedGateway.id === 'crypto' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Bitcoin (BTC) Receiving Wallet Address
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.btcAddress || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, btcAddress: e.target.value }
                        })}
                        placeholder="1A1zP1eP5QG..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Ethereum (ETH / ERC-20) Receiving Address
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.ethAddress || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, ethAddress: e.target.value }
                        })}
                        placeholder="0x71C7656..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Tether USDT (TRC-20 TRON) Receiving Address
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.usdtTrc20Address || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, usdtTrc20Address: e.target.value }
                        })}
                        placeholder="TR7NHqj..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Solana (SOL) Receiving Address
                      </label>
                      <input
                        type="text"
                        value={selectedGateway.credentials.solAddress || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, solAddress: e.target.value }
                        })}
                        placeholder="7XwK1f8..."
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                      />
                    </div>
                  </>
                )}

                {/* BANK TRANSFER FIELDS */}
                {selectedGateway.id === 'bank_transfer' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.bankName || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, bankName: e.target.value }
                          })}
                          placeholder="e.g. Barclays Bank UK PLC"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-brand-action"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          Account Beneficiary Name
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.accountName || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, accountName: e.target.value }
                          })}
                          placeholder="e.g. Academic Publishing Group Ltd"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-bold outline-none focus:border-brand-action"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          Account Number / NUBAN
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.accountNumber || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, accountNumber: e.target.value }
                          })}
                          placeholder="Account Number"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          SWIFT / BIC Code
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.swiftCode || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, swiftCode: e.target.value }
                          })}
                          placeholder="BARCGB22"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          IBAN Number
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.iban || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, iban: e.target.value }
                          })}
                          placeholder="GB82 BARC..."
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Transfer Reference Memo Instructions for Authors
                      </label>
                      <textarea
                        rows={2}
                        value={selectedGateway.credentials.wireInstructions || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, wireInstructions: e.target.value }
                        })}
                        placeholder="Please include Invoice Number and Manuscript DOI as the transfer memo reference."
                        className="w-full border border-gray-300 rounded-sm p-2 text-xs outline-none focus:border-brand-action"
                      ></textarea>
                    </div>
                  </>
                )}

                {/* CUSTOM / ADDED GATEWAY FIELDS */}
                {!['stripe', 'paypal', 'paystack', 'flutterwave', 'crypto', 'bank_transfer'].includes(selectedGateway.id) && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          Public API Key / Client ID / Merchant ID
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.publicKey || selectedGateway.credentials.clientId || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, publicKey: e.target.value, clientId: e.target.value }
                          })}
                          placeholder="e.g. rzp_test_..."
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          Secret Key / API Token
                        </label>
                        <input
                          type="password"
                          value={selectedGateway.credentials.secretKey || selectedGateway.credentials.clientSecret || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, secretKey: e.target.value, clientSecret: e.target.value }
                          })}
                          placeholder="Secret Key"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          API Endpoint Base URL
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.apiEndpoint || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, apiEndpoint: e.target.value }
                          })}
                          placeholder="https://api.yourgateway.com/v1"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                          Webhook Secret
                        </label>
                        <input
                          type="text"
                          value={selectedGateway.credentials.webhookSecret || ''}
                          onChange={e => setSelectedGateway({
                            ...selectedGateway,
                            credentials: { ...selectedGateway.credentials, webhookSecret: e.target.value }
                          })}
                          placeholder="whsec_..."
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                        Author Checkout Instructions / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={selectedGateway.credentials.customNotes || ''}
                        onChange={e => setSelectedGateway({
                          ...selectedGateway,
                          credentials: { ...selectedGateway.credentials, customNotes: e.target.value }
                        })}
                        placeholder="Instructions displayed to authors during checkout..."
                        className="w-full border border-gray-300 rounded-sm p-2 text-xs outline-none focus:border-brand-action"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>

              {/* Supported Currencies Tag Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Supported Settlement Currencies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={selectedGateway.supportedCurrencies.join(', ')}
                  onChange={e => setSelectedGateway({
                    ...selectedGateway,
                    supportedCurrencies: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
                  })}
                  placeholder="USD, EUR, GBP, NGN, GHS, CAD"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs font-mono outline-none focus:border-brand-action"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedGateway(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-gray-100 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all shadow-md flex items-center gap-2"
                >
                  <Save size={14} /> Save Gateway Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
