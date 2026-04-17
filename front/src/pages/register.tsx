
import { useState } from 'react';
import {register as registeruser} from '../services/authService';
const register = () => {

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const  handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await registeruser({username, email, password});
          console.log('Registration successful:', response);
        } catch (error) {
            console.error('Registration failed:', error);
            
        }
    }


    return(
        <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
  <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 border border-border">
    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Sign Up</h2>
    <form className="space-y-4" onSubmit={handleRegister}>

        <div>
            <label className="block text-sm font-medium text-foreground mb-1">Username</label>
            <input 
                type="text" 
                className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input 
                type="email" 
                className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border text-foreground rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />
        </div>
        
        <button className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2.5 rounded-lg transition-colors">
            Sign Up
        </button>
    </form>

    <div className="mt-6 text-center text-sm text-muted-foreground">
      Already have an account?{' '}
      <a href="/login" className="text-white hover:text-gray-300 font-medium">Sign in</a>
    </div>
    </div>
</div>
        </>
    );
};
export default register;