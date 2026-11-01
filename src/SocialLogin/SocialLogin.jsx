
import useAuth from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';


export default function SocialLogin() {
    const {signInGoogle} = useAuth();
      const axiosSecure = useAxiosSecure()

    const location = useLocation()
    const navigate = useNavigate()
    
  const handleGoogleLogin = () => {
    signInGoogle()
    .then(result => {
      console.log(result.user)

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        studentId: result.user.studentId,
        department: result.user.department,
        photoURL: result.user.photoURL
      };
      axiosSecure.post('/users', userInfo)
      .then(res => {
        console.log(res.data)
        navigate(location.state || '/')
      })

    })
    .catch(error =>{
      console.log(error)
    })
  };

  return (
    <div className="w-full space-y-3">
      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 mb-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-lg transition"
      >
        {/* Official Google 'G' Logo SVG */}
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}