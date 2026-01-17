import { type ReactElement, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';

import { auth } from '@/api/auth';
import gitlabLogo from '@/assets/images/gitlab-logo.png';
import { useRequest } from '@/hooks/useRequest';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginResponse } from '@/types/auth';
import { ui } from '@/utils/ui';

const createLoginSchema = (
  t: (key: string) => string
): z.ZodObject<{
  username: z.ZodString;
  password: z.ZodString;
}> =>
  z.object({
    username: z.string().min(1, t('validation.usernameRequired')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const LoginForm = (): ReactElement => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login: setAuth } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const { run: handleLogin, loading } = useRequest<AxiosResponse<LoginResponse>, LoginResponse>(
    auth.login,
    {
      manual: true,
      formatResult: (res) => res.data,
      onSuccess: async (data) => {
        localStorage.setItem('token', data.token);
        setAuth(data.token, data.user);
        ui.success(t('login.success'));
        await navigate('/');
      },
      onError: () => {
        setErrorMessage(t('validation.loginFailed'));
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setErrorMessage(null);
    try {
      await handleLogin(data);
    } catch {
      // Error handled by onError callback in useRequest
    }
  };

  return (
    <div className="group relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl lg:p-12">
      {/* Decorative Sweep Animation */}
      <div className="pointer-events-none absolute -inset-full rotate-45 bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

      <div className="relative z-10">
        <div className="mb-10 text-center lg:text-left">
          <h3 className="mb-2 text-3xl font-extrabold tracking-tight text-white">
            {t('login.title')}
          </h3>
          <p className="text-sm text-slate-400">{t('login.subtitle')}</p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch(() => {});
          }}
        >
          {/* Email Input */}
          <div className="space-y-2">
            <label
              className="px-1 text-xs font-bold tracking-wider text-slate-200 uppercase"
              htmlFor="username"
            >
              {t('login.emailLabel')}
            </label>
            <div className="group/input relative">
              {/* eslint-disable-next-line i18next/no-literal-string */}
              <span className="material-symbols-outlined group-focus-within/input:text-accent absolute top-1/2 left-4 -translate-y-1/2 text-xl text-slate-500 transition-colors">
                alternate_email
              </span>
              <input
                {...register('username')}
                className="focus:border-accent focus:ring-accent/50 h-14 w-full rounded-xl border border-white/10 bg-black/20 pr-4 pl-12 text-base text-white transition-all placeholder:text-slate-600 hover:bg-black/30 focus:ring-1 focus:outline-none"
                id="username"
                placeholder={t('login.emailPlaceholder')}
                type="text"
              />
            </div>
            {errors.username && (
              <p className="px-1 text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label
                className="text-xs font-bold tracking-wider text-slate-200 uppercase"
                htmlFor="password"
              >
                {t('login.passwordLabel')}
              </label>
              <button
                className="text-accent text-xs font-semibold transition-colors hover:text-white hover:underline"
                type="button"
              >
                {t('login.forgotPassword')}
              </button>
            </div>
            <div className="group/input relative">
              {/* eslint-disable-next-line i18next/no-literal-string */}
              <span className="material-symbols-outlined group-focus-within/input:text-accent absolute top-1/2 left-4 -translate-y-1/2 text-xl text-slate-500 transition-colors">
                lock
              </span>
              <input
                {...register('password')}
                className="focus:border-accent focus:ring-accent/50 h-14 w-full rounded-xl border border-white/10 bg-black/20 pr-4 pl-12 text-base text-white transition-all placeholder:text-slate-600 hover:bg-black/30 focus:ring-1 focus:outline-none"
                id="password"
                placeholder={t('login.passwordPlaceholder')}
                type="password"
              />
            </div>
            {errors.password && (
              <p className="px-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <div className="flex">
                <div className="text-sm text-red-400">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            className="shadow-accent/30 hover:shadow-accent/50 from-accent group/btn to-brand-blue flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            <span>{loading ? t('login.signingIn') : t('login.signInButton')}</span>
            {!loading && (
              /* eslint-disable-next-line i18next/no-literal-string */
              <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:translate-x-1">
                arrow_forward
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mt-8">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2 font-bold tracking-widest text-slate-500">
              {t('login.orContinueWith')}
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10 active:scale-95">
            <img alt="GitLab" className="h-5 w-5" src={gitlabLogo} />
            <span className="text-sm font-semibold text-slate-300">{t('login.gitlab')}</span>
          </button>
          <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10 active:scale-95">
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className="material-symbols-outlined text-sm text-slate-300">shield</span>
            <span className="text-sm font-semibold text-slate-300">{t('login.ldap')}</span>
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          {t('login.dontHaveAccount')}{' '}
          <button
            className="font-bold text-slate-300 underline decoration-slate-600 decoration-1 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            type="button"
          >
            {t('login.requestAccess')}
          </button>
        </p>
      </div>
    </div>
  );
};
