import React from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data);
      // console.log(res);
      // console.log('username', res.data.data.user.name);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #6a11cb, #2575fc)' }}>
      <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4" style={{ color: '#2575fc' }}>Welcome Back!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              {...register('email')} 
              placeholder="Enter your email"
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              {...register('password')} 
              placeholder="Enter your password"
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{ background: '#2575fc', border: 'none', fontWeight: '600' }}>Login</button>
        </form>
        <div className="text-center mt-3">
          <small style={{ color: '#555' }}>Don't have an account? <a href="/register">Sign up</a></small>
        </div>
      </div>
    </div>
  );
}
