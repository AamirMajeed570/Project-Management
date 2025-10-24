import React from 'react';

type Task = { _id?: string; status?: string };

interface ProjectCardProps {
  project: any;
  onClick?: (id: string) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const tasks: Task[] = project.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const progressColor = percent >= 80 ? 'bg-success' : percent >= 50 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="card p-3 shadow-sm hover-shadow" style={{ cursor: 'pointer', transition: '0.25s' }} onClick={() => onClick && onClick(project._id)}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="mb-1">{project.title}</h5>
          <p className="mb-2 text-muted small">{project.description}</p>
        </div>
        <span className={`badge ${project.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}>{project.status || 'Active'}</span>
      </div>

      <div className="mt-2">
        <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
          <div>{completed} / {total} tasks</div>
          <div>{percent}%</div>
        </div>
        <div className="progress" style={{ height: 10 }}>
          <div className={`progress-bar ${progressColor}`} role="progressbar" style={{ width: `${percent}%` }} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>
    </div>
  );
}