import { useAuth0 } from '@auth0/auth0-react'
import './App.css'

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect: login,
    logout: auth0Logout,
    user,
  } = useAuth0()

  const signup = () =>
    login({ 
      authorizationParams: { 
        screen_hint: 'signup',
        connection: 'google-oauth2'
      } 
    })

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <h1>Job Application Tracker</h1>
          <p>Logged in as {user.email}</p>

          <h2>User Profile</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h1>Job Application Tracker</h1>
          {error && <p>Error: {error.message}</p>}

          <p>Manage all of your jobs, All in one place.</p>

          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
        </>
      )}
    </>
  )
}

export default App
