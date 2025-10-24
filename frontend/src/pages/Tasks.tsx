import React, { useEffect, useState } from 'react';
import { getTasks } from '../api/api';
import Navbar from '../components/Navbar';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
    const username:any = localStorage.getItem('username') || 'User';
  useEffect(() => {
    getTasks().then(res => setTasks(res.data));
  }, []);

  return (
    <>
      <Navbar username={username} />
      <h1>Tasks</h1>
      {tasks.map(t => (
        <div key={t._id}>
          {t.title} - Assigned to: {t.assignedTo?.name || 'Unassigned'}
        </div>
      ))}
    </>
  );
}
