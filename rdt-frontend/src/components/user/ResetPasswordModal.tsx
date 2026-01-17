import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { z } from 'zod';

import type { UserDTO } from '@/types/user';
import { cn } from '@/utils/ui';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  user: UserDTO | undefined;
}

const createResetSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z.string().min(6, t('validation.passwordLength')),
      confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsNoMatch'),
      path: ['confirmPassword'],
    });

type ResetFormValues = z.infer<ReturnType<typeof createResetSchema>>;

export const ResetPasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}: Readonly<ResetPasswordModalProps>) => {
  const { t } = useTranslation();

  // Create schema with translation function
  const resetSchema = useMemo(() => createResetSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: ResetFormValues) => {
    await onSubmit(data.password);
    reset();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="glass-panel relative w-full max-w-md transform overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl transition-all">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-xl font-bold text-transparent">
              {t('user.resetPassword')}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {t('user.resetPasswordDescription', { username: user.username })}
            </p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}>
          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold tracking-wider text-slate-400 uppercase"
              htmlFor="reset-password"
            >
              {t('user.newPassword')}
            </label>
            <input
              id="reset-password"
              type="password"
              {...register('password')}
              className={cn(
                'focus:ring-primary focus:border-primary w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none',
                errors.password && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
              )}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold tracking-wider text-slate-400 uppercase"
              htmlFor="reset-confirm"
            >
              {t('user.confirmPassword')}
            </label>
            <input
              id="reset-confirm"
              type="password"
              {...register('confirmPassword')}
              className={cn(
                'focus:ring-primary focus:border-primary w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none',
                errors.confirmPassword &&
                  'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
              )}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10"
              type="button"
              onClick={onClose}
            >
              {t('user.cancel')}
            </button>
            <button
              className="bg-primary shadow-primary/40 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? t('user.reset') : t('user.resetPassword')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
