import { useState, useEffect, useRef } from 'react'
import './App.css'

// =====================================================
// BACKEND CONFIGURATION
// =====================================================

const API = 'http://localhost:3000'

const LOGIN_PATH = '/api/v1/login'
const SIGNUP_PATH = '/api/v1/register'
const GOOGLE_PATH = '/api/v1/login-with-google-code'

const GOOGLE_CLIENT_ID =
    '497654583307-css7j1vk4grsv1bqtf5r2221d549vno9.apps.googleusercontent.com'


// =====================================================
// FACEBOOK ICON
// =====================================================

const FacebookIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
      <path
          fill="#1877F2"
          d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"
      />
    </svg>
)


// =====================================================
// APP
// =====================================================

function App() {

  const [mode, setMode] = useState('login')

  const [showPassword, setShowPassword] =
      useState(false)

  const [error, setError] =
      useState('')

  const [loading, setLoading] =
      useState(false)

  const [googleReady, setGoogleReady] =
      useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  // Google controls this element directly
  const googleButtonRef = useRef(null)

  const isSignup = mode === 'signup'


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

    setError('')
  }


  // =====================================================
  // SWITCH LOGIN / SIGNUP
  // =====================================================

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setShowPassword(false)
  }


  // =====================================================
  // NORMAL LOGIN / SIGNUP
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (
        isSignup &&
        form.password !== form.confirm
    ) {
      setError('Passwords do not match.')
      return
    }

    const body = isSignup
        ? {
          name: form.name,
          email: form.email,
          password: form.password
        }
        : {
          email: form.email,
          password: form.password
        }

    setLoading(true)
    setError('')

    try {

      const res = await fetch(
          `${API}${isSignup ? SIGNUP_PATH : LOGIN_PATH}`,
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            credentials: 'include',

            body: JSON.stringify(body)
          }
      )

      const data =
          await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(
            data.message || 'Request failed.'
        )
      }

      console.log('Success:', data)

      // Navigate to dashboard if needed:
      // window.location.href = '/dashboard'

    } catch (err) {

      console.error(err)

      setError(
          err.message ||
          'Something went wrong.'
      )

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleResponse = async (response) => {

    console.log('Google response:', response)

    // Google Identity Services returns
    // the ID token in response.credential

    if (!response?.credential) {

      setError(
          'Google did not return an ID token.'
      )

      return
    }

    setLoading(true)
    setError('')

    try {

      const res = await fetch(
          `${API}${GOOGLE_PATH}`,
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            credentials: 'include',

            body: JSON.stringify({
              idToken: response.credential
            })
          }
      )

      const data =
          await res.json().catch(() => ({}))

      if (!res.ok) {

        throw new Error(
            data.message ||
            'Google login failed.'
        )
      }

      console.log(
          'Google login successful:',
          data
      )

      // Navigate to dashboard:
      // window.location.href = '/dashboard'

    } catch (err) {

      console.error(
          'Google login error:',
          err
      )

      setError(
          err.message ||
          'Google login failed.'
      )

    } finally {

      setLoading(false)

    }
  }


  // =====================================================
  // LOAD GOOGLE SDK
  // =====================================================

  useEffect(() => {

    let cancelled = false

    const initializeGoogle = () => {

      if (cancelled) return

      if (
          !window.google ||
          !window.google.accounts ||
          !window.google.accounts.id
      ) {

        console.error(
            'Google Identity Services not available.'
        )

        setError(
            'Google Sign-In could not be loaded.'
        )

        return
      }

      console.log(
          'Google Identity Services loaded.'
      )

      // Initialize Google
      window.google.accounts.id.initialize({

        client_id:
        GOOGLE_CLIENT_ID,

        callback:
        handleGoogleResponse

      })

      setGoogleReady(true)

      // IMPORTANT:
      // This element is dedicated to Google.
      // React must NOT render children inside it.

      if (googleButtonRef.current) {

        window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: 300
            }
        )
      }
    }


    // Google already loaded
    if (
        window.google?.accounts?.id
    ) {

      initializeGoogle()

      return () => {
        cancelled = true
      }
    }


    // Load Google Identity Services
    const SRC =
        'https://accounts.google.com/gsi/client'


    let script =
        document.querySelector(
            `script[src="${SRC}"]`
        )


    if (!script) {

      script =
          document.createElement('script')

      script.src = SRC
      script.async = true
      script.defer = true

      document.head.appendChild(script)
    }


    script.addEventListener(
        'load',
        initializeGoogle
    )


    return () => {

      cancelled = true

      script.removeEventListener(
          'load',
          initializeGoogle
      )
    }

  }, [])


  // =====================================================
  // FACEBOOK
  // =====================================================

  const handleFacebook = () => {

    setError(
        'Facebook login is not configured yet.'
    )

    console.log(
        'Continue with Facebook'
    )
  }


  // =====================================================
  // UI
  // =====================================================

  return (

      <div className="App">

        <div className="card">

          {/* ================= TABS ================= */}

          <div
              className="tabs"
              role="tablist"
          >

          <span
              className={`tab-indicator ${
                  isSignup ? 'right' : ''
              }`}
          />

            <button
                type="button"
                role="tab"
                aria-selected={!isSignup}
                className={
                  !isSignup ? 'active' : ''
                }
                onClick={() =>
                    switchMode('login')
                }
            >
              Log in
            </button>

            <button
                type="button"
                role="tab"
                aria-selected={isSignup}
                className={
                  isSignup ? 'active' : ''
                }
                onClick={() =>
                    switchMode('signup')
                }
            >
              Sign up
            </button>

          </div>


          {/* ================= FORM ================= */}

          <form
              key={mode}
              className="form"
              onSubmit={handleSubmit}
          >

            <h1>
              {
                isSignup
                    ? 'Create your account'
                    : 'Welcome back'
              }
            </h1>


            {/* ================= NAME ================= */}

            {isSignup && (

                <div className="field">

                  <label htmlFor="name">
                    Full name
                  </label>

                  <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                  />

                </div>

            )}


            {/* ================= EMAIL ================= */}

            <div className="field">

              <label htmlFor="email">
                Email
              </label>

              <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
              />

            </div>


            {/* ================= PASSWORD ================= */}

            <div className="field">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrap">

                <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                          ? 'text'
                          : 'password'
                    }
                    autoComplete={
                      isSignup
                          ? 'new-password'
                          : 'current-password'
                    }
                    minLength={
                      isSignup
                          ? 8
                          : undefined
                    }
                    required
                    value={form.password}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    className="toggle"
                    onClick={() =>
                        setShowPassword(
                            !showPassword
                        )
                    }
                >
                  {
                    showPassword
                        ? 'Hide'
                        : 'Show'
                  }
                </button>

              </div>

            </div>


            {/* ================= CONFIRM PASSWORD ================= */}

            {isSignup && (

                <div className="field">

                  <label htmlFor="confirm">
                    Confirm password
                  </label>

                  <input
                      id="confirm"
                      name="confirm"
                      type={
                        showPassword
                            ? 'text'
                            : 'password'
                      }
                      autoComplete="new-password"
                      required
                      value={form.confirm}
                      onChange={handleChange}
                  />

                </div>

            )}


            {/* ================= ERROR ================= */}

            {error && (

                <p
                    className="error"
                    role="alert"
                >
                  {error}
                </p>

            )}


            {/* ================= SUBMIT ================= */}

            <button
                type="submit"
                className="primary"
                disabled={loading}
            >
              {
                loading
                    ? 'Please wait...'
                    : isSignup
                        ? 'Create account'
                        : 'Log in'
              }
            </button>


            {/* ================= DIVIDER ================= */}

            <div className="divider">

            <span>
              or continue with
            </span>

            </div>


            {/* ================= GOOGLE ================= */}

            {/*
            IMPORTANT:
            Do NOT put React children inside this div.

            Google owns the DOM inside this element.
          */}

            <div
                className="google-login-container"
                ref={googleButtonRef}
            />

            {!googleReady && (
                <p className="google-loading">
                  Loading Google...
                </p>
            )}


            {/* ================= FACEBOOK ================= */}

            <div className="social">

              <button
                  type="button"
                  onClick={handleFacebook}
                  disabled={loading}
              >

                <FacebookIcon />

                Facebook

              </button>

            </div>

          </form>

        </div>

      </div>
  )
}


export default App