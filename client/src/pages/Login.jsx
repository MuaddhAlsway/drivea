
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  CloudUpload,
  FolderLock,
} from 'lucide-react'

import { useApp } from '../context/AppContext'

function Login({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()

  // Authentication Context
  const {
    login,
    register,
    authLoading,
  } = useApp()

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Update Form Fields
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }))
  }

  // Form Validation
  const validateForm = () => {
    const nextErrors = {}

    if (isRegister && !form.name.trim()) {
      nextErrors.name = 'Full name is required'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!form.password) {
      nextErrors.password = 'Password is required'
    } else if (
      isRegister &&
      form.password.length < 8
    ) {
      nextErrors.password =
        'Password must contain at least 8 characters'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  // Submit Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (authLoading || !validateForm()) return

    if (isRegister) {
      const result = await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      )

      if (result.success) {
        // Registration may require email verification.
        // This assumes registration does not sign in the user.
        navigate('/login', { replace: true })
      }

      return
    }

    const result = await login(
      form.email.trim(),
      form.password
    )

    if (result.success && result.data?.user) {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen flex-col text-zinc-900 md:flex-row">

      {/* LEFT BRAND PANEL */}
      <section className="relative flex flex-col justify-between overflow-hidden border-b border-zinc-200 bg-linear-to-br from-blue-50 via-zinc-100 to-sky-50 p-8 md:w-1/2 md:border-r md:border-b-0 md:p-12 lg:p-16">

        {/* Background Pattern */}
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/pattern.svg')] bg-cover bg-center opacity-10"
          aria-hidden="true"
        />

        {/* Decorative Glow */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
          aria-hidden="true"
        />

        {/* Brand Logo */}
        <Link
          to="/"
          className="relative z-10 flex w-fit items-center gap-3"
        >
          <img
            src="/logo.png"
            className="h-11 w-11 object-contain"
            alt=""
          />

          <span className="text-3xl font-bold tracking-tight text-zinc-900">
            MU
            <span className="text-blue-600">
              DRIVE
            </span>
          </span>
        </Link>

        {/* Hero Content */}
        <div className="relative z-10 my-12 space-y-6">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-semibold text-blue-700">
            <ShieldCheck size={15} />
            Your files. Your space.
          </div>

          <h1 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
            Secure, Simple
            <br />
            & Fast
            <br />
            <span className="text-blue-600">
              Cloud Storage.
            </span>
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-zinc-600 md:text-base">
            Store your files securely, organize them into
            folders, share with permissions, and access
            everything from anywhere.
          </p>

          {/* Feature Highlights */}
          <div className="grid max-w-md gap-4 pt-4 sm:grid-cols-2">

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
                <CloudUpload size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Easy Uploads
                </p>
                <p className="text-xs text-zinc-500">
                  Manage files easily
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-blue-100 bg-white p-3 text-blue-600 shadow-sm">
                <FolderLock size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Private Storage
                </p>
                <p className="text-xs text-zinc-500">
                  Control file access
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-xs text-zinc-500">
          © 2026 MU.LAB. All rights reserved.
        </div>
      </section>

      {/* RIGHT AUTHENTICATION PANEL */}
      <section className="flex flex-1 items-center justify-center bg-white p-8 md:w-1/2 md:p-12 lg:p-16">

        <div className="w-full max-w-md space-y-8">

          {/* Heading */}
          <div className="space-y-3">

            <div className="mb-6 h-1 w-12 rounded-full bg-blue-600" />

            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {isRegister
                ? 'Create an account'
                : 'Welcome back'}
            </h2>

            <p className="text-sm leading-relaxed text-zinc-500">
              {isRegister
                ? 'Enter your details to create your MUDRIVE account.'
                : 'Enter your credentials to access your Drive.'}
            </p>
          </div>

          {/* AUTH FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >

            {/* Full Name */}
            {isRegister && (
              <div className="space-y-2">

                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) =>
                      updateField('name', e.target.value)
                    }
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? 'name-error' : undefined
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pr-4 pl-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {errors.name && (
                  <p
                    id="name-error"
                    className="text-xs text-red-500"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-2">

              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    updateField('email', e.target.value)
                  }
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'email-error' : undefined
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pr-4 pl-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {errors.email && (
                <p
                  id="email-error"
                  className="text-xs text-red-500"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">

              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400"
                />

                <input
                  id="password"
                  type={
                    showPassword ? 'text' : 'password'
                  }
                  autoComplete={
                    isRegister
                      ? 'new-password'
                      : 'current-password'
                  }
                  placeholder={
                    isRegister
                      ? 'Create a password'
                      : 'Enter your password'
                  }
                  value={form.password}
                  onChange={(e) =>
                    updateField('password', e.target.value)
                  }
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password
                      ? 'password-error'
                      : undefined
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pr-12 pl-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {/* Password Visibility */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  aria-pressed={showPassword}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-400 transition hover:text-blue-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  className="text-xs text-red-500"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Please wait...
                </>
              ) : (
                <>
                  {isRegister
                    ? 'Create Account'
                    : 'Sign In'}

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Login / Register Navigation */}
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              {isRegister
                ? 'Already have an account?'
                : "Don't have an account?"}

              <Link
                to={isRegister ? '/login' : '/register'}
                className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                {isRegister
                  ? 'Sign In'
                  : 'Create Account'}
              </Link>
            </p>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 border-t border-zinc-100 pt-6 text-xs text-zinc-400">
            <ShieldCheck size={15} />
            Secure authentication for your account
          </div>

        </div>
      </section>
    </div>
  )
}

export default Login
