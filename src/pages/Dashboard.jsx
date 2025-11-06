import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'grade', title: 'Grade' },
    {
      key: 'status',
      title: 'Status',
      render: (row) => <Badge variant={row.status.toLowerCase()}>{row.status}</Badge>,
    },
  ];

  const data = [
    { name: 'Aisha Noor', grade: '5', status: 'Pending' },
    { name: 'Mohamed Ali', grade: '7', status: 'Approved' },
    { name: 'Fatima Omar', grade: '4', status: 'Rejected' },
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-3">
            <Button variant="primary">Primary Action</Button>
            <Spinner />
          </div>
        </div>

        <div className="mb-4">
          <Input placeholder="Search students..." />
        </div>

        <div className="flex gap-2 mb-4">
          <Badge variant="pending">Pending</Badge>
          <Badge variant="approved">Approved</Badge>
          <Badge variant="rejected">Rejected</Badge>
        </div>

        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
};

export default Dashboard;