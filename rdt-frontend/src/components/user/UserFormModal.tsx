import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { z } from 'zod';

import type { CreateUserRequest, UserDTO } from '@/types/user';
import { UserStatus } from '@/types/user';
import { cn } from '@/utils/ui';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  initialData?: UserDTO;
}

const createUserSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(1, { message: t('validation.usernameRequired') })
      .min(3, { message: t('validation.usernameMinLength') }),
    email: z
      .string()
      .min(1, { message: t('validation.emailRequired') })
      // eslint-disable-next-line sonarjs/deprecation
      .email({ message: t('validation.emailInvalid') }),
    password: z.string().optional(),
    status: z
      .union([
        z.literal(UserStatus.ACTIVE),
        z.literal(UserStatus.DISABLED),
        z.literal(UserStatus.LOCKED),
      ])
      .optional(),
  });

type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>;

export const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Readonly<UserFormModalProps>) => {
  const { t } = useTranslation();
  const isEdit = !!initialData;

  const userSchema = useMemo(() => createUserSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      status: UserStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          username: initialData.username,
          email: initialData.email,
          status: initialData.status,
        });
      } else {
        reset({
          username: '',
          email: '',
          status: UserStatus.ACTIVE,
          password: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: UserFormValues) => {
    await onSubmit({
      ...data,
      password: data.password ?? '',
    } as CreateUserRequest);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="glass-panel relative w-full max-w-md transform overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl transition-all">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-xl font-bold text-transparent">
            {isEdit ? t('user.editUser') : t('user.createUser')}
          </h2>
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
              htmlFor="username"
            >
              {t('user.username')}
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={cn(
                'focus:ring-primary focus:border-primary w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none',
                errors.username && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
              )}
              placeholder="e.g. jdoe"
            />
            {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold tracking-wider text-slate-400 uppercase"
              htmlFor="email"
            >
              {t('user.email')}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={cn(
                'focus:ring-primary focus:border-primary w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none',
                errors.email && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
              )}
              placeholder="e.g. name@company.com"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {!isEdit && (
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold tracking-wider text-slate-400 uppercase"
                htmlFor="password"
              >
                {t('user.password')}
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="focus:ring-primary focus:border-primary w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:ring-1 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          )}

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
              {isSubmitting ? t('user.saving') : t('user.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
