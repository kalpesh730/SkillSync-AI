import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token') || '';

  const [step, setStep] = useState(urlToken ? 'reset' : 'request');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState('');
  const [devToken, setDevToken] = useState('');

  const { forgotPassword, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  // Request Reset form
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
  } = useForm();

  // Reset Password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    setValue: setResetValue,
    watch: watchReset,
    formState: { errors: resetErrors },
  } = useForm({
    defaultValues: {
      token: urlToken,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (urlToken) {
      setResetValue('token', urlToken);
      setStep('reset');
    }
  }, [urlToken, setResetValue]);

  const newPassword = watchReset('password');

  const onRequestSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await forgotPassword(data.email);
    setIsSubmitting(false);

    if (result.success) {
      setRequestSuccessMessage(result.message || 'Password reset instructions have been dispatched.');
      if (result.devResetToken) {
        setDevToken(result.devResetToken);
      }
    } else {
      toast.error(result.error || 'Failed to process request');
    }
  };

  const onResetSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await resetPassword({
      token: data.token.trim(),
      password: data.password,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message || 'Password reset successfully!');
      navigate('/login');
    } else {
      toast.error(result.error || 'Failed to reset password');
    }
  };

  const handleUseDevToken = () => {
    setResetValue('token', devToken);
    setStep('reset');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 py-12">
      <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl shadow-2xl">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {step === 'request' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-gray-400 text-sm">
            {step === 'request'
              ? 'Enter your registered email to receive reset instructions'
              : 'Enter your reset token and set a new password'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-gray-800/80 p-1 mb-6 border border-gray-700/40">
          <button
            type="button"
            onClick={() => setStep('request')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
              step === 'request'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            1. Request Token
          </button>
          <button
            type="button"
            onClick={() => setStep('reset')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
              step === 'reset'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            2. Enter Token & Reset
          </button>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleSubmitRequest(onRequestSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  {...registerRequest('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              {requestErrors.email && (
                <p className="text-red-400 text-xs mt-1">{requestErrors.email.message}</p>
              )}
            </div>

            {requestSuccessMessage && (
              <div className="p-4 bg-blue-900/30 border border-blue-500/40 rounded-xl text-blue-200 text-xs space-y-2">
                <div className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0 mt-0.5" />
                  <p>{requestSuccessMessage}</p>
                </div>
                {devToken && (
                  <div className="pt-2 border-t border-blue-500/20 flex flex-col gap-2">
                    <span className="text-gray-300 font-mono text-[11px] break-all bg-gray-900/60 p-2 rounded">
                      Demo Token: {devToken}
                    </span>
                    <button
                      type="button"
                      onClick={handleUseDevToken}
                      className="text-xs text-blue-300 hover:text-blue-100 font-semibold underline text-left"
                    >
                      Use this token in Step 2 &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Instructions'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Reset Token</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  {...registerReset('token', { required: 'Reset token is required' })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="Paste your 64-character reset token"
                />
              </div>
              {resetErrors.token && (
                <p className="text-red-400 text-xs mt-1">{resetErrors.token.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerReset('password', {
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Must be at least 8 characters' },
                  })}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {resetErrors.password && (
                <p className="text-red-400 text-xs mt-1">{resetErrors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerReset('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (value) => value === newPassword || 'Passwords do not match',
                  })}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {resetErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{resetErrors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
