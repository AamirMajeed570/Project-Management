import React, { useEffect, useState } from 'react';
import { getProjects } from '../api/api';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
    const token = localStorage.getItem('token');
    const username:any = localStorage.getItem('username') || 'User';
  useEffect(() => {
    getProjects(token).then(res => setProjects(res.data));
  }, []);

  return (
    <>
      <Navbar username={username}/>
      <h1>Projects</h1>
      {projects.map(p => (
        <div key={p._id}>{p.title}</div>
      ))}
    </>
  );
}
