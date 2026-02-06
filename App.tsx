
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Users, Repeat, Gift, Menu, X, Info, LogOut, Database } from 'lucide-react';
import { storage } from './services/storage';
import { TOTP_SECRET } from './constants';
import Login from './components/Login';
import Agents from './components/Agents';
import Inventory from './components/Inventory';
import ExchangeBoard from './components/ExchangeBoard';
import LuckyDraw from './components/LuckyDraw';
import IngressLogo from './components/IngressLogo';

const Navigation = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/agents', label: '特工管理', icon: Users },
    { path: '/inventory', label: '物资清单', icon: Database },
    { path: '/exchange', label: '物资交换', icon: Repeat },
    { path: '/prizes', label: '奖品抽奖', icon: Gift },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
              <IngressLogo className="w-8 h-8 text-purple-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                TIANJIN IFS
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                注销
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10 animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <button 
              onClick={() => { setIsOpen(false); onLogout(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              注销
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Home = () => (
  <div className="max-w-4xl mx-auto py-12 px-4">
    <div className="bg-glass p-8 rounded-2xl border border-white/10 space-y-6">
      <div className="flex items-center gap-3 text-purple-500">
        <IngressLogo className="w-12 h-12" />
        <h1 className="text-3xl font-bold tracking-tight text-white">隐私声明与活动说明</h1>
      </div>
      <p className="text-lg text-slate-300 leading-relaxed">
        欢迎使用 <span className="text-white font-semibold">Tianjin Ingress First Saturday</span> 活动支持系统。
      </p>
      <ul className="space-y-4 text-slate-400 list-disc pl-5">
        <li><span className="text-slate-200">不收集任何个人信息</span>：我们仅记录您的 Agent Name 用于活动管理。</li>
        <li><span className="text-slate-200">数据用途</span>：所有数据仅用于物资交换匹配和奖品抽奖，不会用于其他用途。</li>
        <li><span className="text-slate-200">公平抽奖</span>：抽奖算法随机生成，确保每位参与者机会均等。</li>
        <li><span className="text-red-400 font-semibold">即刻清空</span>：活动结束后，所有存储的数据将被物理清空，不留备份。</li>
      </ul>
      <div className="pt-6 border-t border-white/5">
        <Link 
          to="/agents" 
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
        >
          进入系统
          <IngressLogo className="w-5 h-5" />
        </Link>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Repeat className="text-blue-400" /> 物资交换</h3>
        <p className="text-sm text-slate-500">实时匹配特工之间的物资需求。系统会自动连线“我拥有”和“我需要”的对应项。</p>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gift className="text-purple-400" /> 随机抽奖</h3>
        <p className="text-sm text-slate-500">根据现场特工录入情况进行实时抽奖。结果透明可见，奖品数量可动态配置。</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tjinfs_auth_state') === 'true';
  });

  useEffect(() => {
    console.log('%c[安全] TOTP 配置信息', 'color: #00ff00; font-weight: bold; font-size: 16px;');
    console.log(`%c密钥 (Base32): ${TOTP_SECRET}`, 'color: #f8fafc; font-family: monospace;');
    console.log(`%cOTP URL: otpauth://totp/TianjinIFS:Agent?secret=${TOTP_SECRET}&issuer=TianjinIFS`, 'color: #3b82f6; text-decoration: underline;');
    console.log('%c(请将密钥手动输入 Google Authenticator 或其他验证器 App)', 'color: #888;');
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
    localStorage.setItem('tjinfs_auth_state', String(success));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tjinfs_auth_state');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen pt-20 pb-10">
        <Navigation onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/exchange" element={<ExchangeBoard />} />
          <Route path="/prizes" element={<LuckyDraw />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
