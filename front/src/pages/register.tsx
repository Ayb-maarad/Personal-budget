
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
    <form className="space-y-4" onSubmit={handleRegister}>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}

                placeholder="your@email.com"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />
        </div>
        
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Sign Up
        </button>
    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      Already have an account? 
      <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign in</a>
    </div>
    </div>
</div>
        </>
    );
};
export default register;