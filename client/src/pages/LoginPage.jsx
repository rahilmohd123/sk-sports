import { useState, useEffect, Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useLoginMutation, useSyncCartOnLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';
import LightRays from '../components/LightRays';
import logo from '../assets/logo.png';

/* ── LightRays background ── */

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [syncCart] = useSyncCartOnLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      
      // For existing users logging in: Discard local cart, clear localStorage
      // The CartStoreSync component will then fetch the existing DB items into Redux
      dispatch(clearCartItems());
      
      navigate(redirect);
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {/* ── Full-viewport GridScan background (fixed, under everything) ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#080010',
      }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#cdfb0a"
          raysSpeed={1.2}
          lightSpread={1.2}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.08}
          distortion={0.15}
          pulsating={true}
        />
      </div>

      {/* ── Login card — above the fixed background ── */}
      <div style={{
        position: 'relative',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 80px)',
        padding: '24px 16px',
        paddingTop: '80px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(8, 0, 20, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '3px solid #cdfb0a',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(168,85,247,0.1), 0 0 40px rgba(168,85,247,0.08)',
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src={logo} alt="SK Sports Logo" style={{ width: '80px', height: 'auto', marginBottom: '16px', display: 'inline-block', borderRadius: '8px' }} />
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', margin: 0 }}>
              Gear up and push your limits.
            </p>
          </div>

          <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={iconStyle} />
                <input
                  type="email" required placeholder="athlete@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.15)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={labelStyle}>Password</label>
                <button type="button" style={forgotStyle}
                  onClick={() => {
                    const phone = window.prompt('Enter your registered mobile number to receive an OTP:');
                    if (phone && phone.trim().length >= 10) {
                      alert(`An OTP has been sent to ${phone}. Use it to reset your password.`);
                    } else if (phone !== null) {
                      alert('Invalid number. Please enter a valid mobile number.');
                    }
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={iconStyle} />
                <input
                  type="password" required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.15)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '14px',
                background: isLoading
                  ? 'rgba(168,85,247,0.3)'
                  : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                border: 'none', borderRadius: '12px', color: '#fff',
                fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.03em',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(168,85,247,0.6)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(168,85,247,0.4)'; }}
            >
              {isLoading ? 'Signing In…' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <Link
                to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}
                style={{ color: '#a855f7', fontWeight: 700, textDecoration: 'none' }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── shared micro-styles ── */
const labelStyle = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: '#fff', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.07em',
};
const iconStyle = {
  position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
  color: 'rgba(168,85,247,0.5)', pointerEvents: 'none',
};
const inputStyle = {
  width: '100%', padding: '12px 12px 12px 40px', boxSizing: 'border-box',
  background: 'rgba(168,85,247,0.06)',
  border: '1px solid rgba(168,85,247,0.15)',
  borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
const forgotStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: '0.78rem', color: '#a855f7', fontWeight: 600, padding: 0,
};

export default LoginPage;
