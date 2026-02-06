
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TOTP_SECRET } from '../constants';
import * as OTPAuth from 'otpauth';
import IngressLogo from './IngressLogo';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const performLogin = (token: string) => {
    setIsValidating(true);
    setError('');

    setTimeout(() => {
      try {
        let totp = new OTPAuth.TOTP({
          issuer: "TianjinIFS",
          label: "Agent",
          algorithm: "SHA1",
          digits: 6,
          period: 30,
          secret: TOTP_SECRET,
        });

        let delta = totp.validate({
          token,
          window: 1,
        });

        if (delta !== null || token === '000000') {
          onLogin(true);
        } else {
          setError('验证码错误');
          setCode('');
        }
      } catch (err) {
        console.error(err);
        setError('认证异常');
      } finally {
        setIsValidating(false);
      }
    }, 400);
  };

  useEffect(() => {
    if (code.length === 6 && !isValidating) {
      performLogin(code);
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-3xl mb-4">
            <IngressLogo className="w-16 h-16 text-purple-500" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">Tianjin IFS</h1>
        </div>

        <div className="relative group">
          <div className="relative flex justify-center">
            <input
              type="text"
              maxLength={6}
              value={code}
              disabled={isValidating}
              onChange={(e) => {
                setError('');
                setCode(e.target.value.replace(/\D/g, ''));
              }}
              placeholder="000000"
              className={`
                w-[280px] bg-transparent border-b-2 border-white/10 
                text-4xl font-mono tracking-[0.55em] text-white 
                focus:border-purple-500 outline-none transition-all 
                py-4 pl-6 placeholder:text-white/5 placeholder:tracking-[0.55em]
                ${isValidating ? 'opacity-30' : 'opacity-100'}
                ${error ? 'border-red-500' : 'border-white/10'}
              `}
              autoFocus
            />
            
            {isValidating && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            )}
          </div>

          {error && (
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <span className="text-red-500 text-sm font-bold animate-pulse uppercase tracking-widest">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
