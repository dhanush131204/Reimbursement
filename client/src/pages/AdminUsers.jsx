import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Table } from 'antd';
import { Edit3, Eye, Plus, Trash2 } from 'lucide-react';
import { getAdminUsers, saveAdminUsers } from '../utils/adminUsersStorage';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getAdminUsers());
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openDelete = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers((currentUsers) => {
        const nextUsers = currentUsers.filter((user) => user.id !== selectedUser.id);
        saveAdminUsers(nextUsers);
        return nextUsers;
      });
    }
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const columns = useMemo(
    () => [
      { title: 'user ID', dataIndex: 'vizNo', key: 'vizNo', render: (value) => <span className="font-semibold text-[#172033]">{value}</span> },
      { title: 'Employee Name', dataIndex: 'name', key: 'name' },
      { title: 'Contact Number', dataIndex: 'contactNumber', key: 'contactNumber' },
      { title: 'Email Address', dataIndex: 'email', key: 'email', render: (value) => <span className="font-semibold text-[#172033]">{value}</span> },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex items-center gap-5">
            <button type="button" aria-label="View user" onClick={() => setSelectedUser(record)} className="cursor-pointer text-[#006bd6]">
              <Eye className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Edit user" onClick={() => navigate(`/users/${record.id}/edit`)} className="cursor-pointer text-[#04b66d]">
              <Edit3 className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Delete user" onClick={() => openDelete(record)} className="cursor-pointer text-[#ff2f3f]">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-5 pt-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/users/new')}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[#19b9ef] px-4 text-xs font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="overflow-hidden bg-white">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          tableLayout="fixed"
          className="app-table"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            size: 'small',
            className: 'app-pagination px-4 py-3',
            showTotal: (total, range) => total > 0 ? `Showing ${range[0]} of ${total} requests` : 'Showing 0 of 0 requests',
          }}
          locale={{
            emptyText: (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-[#172033]">No employees added yet</p>
                <p className="mt-1 text-xs text-[#64748b]">Create a user to show employee data here.</p>
              </div>
            ),
          }}
        />
      </div>

      <Modal
        open={Boolean(selectedUser) && !deleteOpen}
        title="User Details"
        footer={null}
        onCancel={() => setSelectedUser(null)}
        width={420}
      >
        {selectedUser && (
          <div className="space-y-3 text-sm text-[#344054]">
            <p><span className="font-semibold text-[#172033]">User ID:</span> {selectedUser.vizNo}</p>
            <p><span className="font-semibold text-[#172033]">Employee Name:</span> {selectedUser.name}</p>
            <p><span className="font-semibold text-[#172033]">Contact Number:</span> {selectedUser.contactNumber}</p>
            <p><span className="font-semibold text-[#172033]">Email Address:</span> {selectedUser.email}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={deleteOpen}
        centered
        width={360}
        footer={null}
        closable={false}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedUser(null);
        }}
        className="delete-modal"
        rootClassName="delete-modal-root"
      >
        <p className="mb-5 text-center text-base font-medium text-[#172033]">Are you sure want to delete</p>
        <div className="flex justify-center gap-5">
          <button
            type="button"
            onClick={() => {
              setDeleteOpen(false);
              setSelectedUser(null);
            }}
            className="h-9 w-28 rounded-md border border-[#d7e0e8] bg-white text-sm text-[#667085]"
          >
            Cancel
          </button>
          <button type="button" onClick={confirmDelete} className="h-9 w-28 rounded-md bg-[#c90010] text-sm font-semibold text-white">
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
