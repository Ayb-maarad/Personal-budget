

import { useState } from 'react';
import {login as loginuser} from '../services/authService';
import { Link, useNavigate  } from "react-router-dom";



const login = () =>{

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginuser({email, password});
      console.log('Login successful:', response);
      navigate("/envelopes")
    } catch (error) {
      console.error('Login failed:', error);
      
    }
  };



    return(
        <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
  <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 border border-border">
    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Sign In</h2>
    
    <form className="space-y-4" onSubmit={handleLogin}>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input 
          type="email" 
          className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
        <input 
          type="password" 
          className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2.5 rounded-lg transition-colors">
        Sign In
      </button>
    </form>

    <div className="mt-6 text-center text-sm text-muted-foreground">
      Don't have an account?{' '}
      <Link to="/register" className="text-white hover:text-gray-300 font-medium">Sign up</Link>
    </div>
  </div>
</div>
        
        </>
    );
}

export default login;