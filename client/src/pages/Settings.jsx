import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, UserRound, BellRing, Pencil } from 'lucide-react';
import { Button, Form, Input, Modal, Switch, Upload, message } from 'antd';
import PageHeader from '../components/PageHeader';
import { useUpdateProfileMutation, useUploadFileMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';





const getExternalUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

const Settings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    userInfo?.profileImageUrl
      ? userInfo.profileImageUrl.startsWith('http')
        ? userInfo.profileImageUrl
        : `http://localhost:5000${userInfo.profileImageUrl}`
      : null,
  );

  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [uploadFile] = useUploadFileMutation();
  const name = userInfo?.name || 'Santhosh';
  const accountRoleLabel = userInfo?.role === 'ADMIN' ? 'Admin' : 'Employee';
  const designation = userInfo?.designation || accountRoleLabel;
  const isProfileEditRequested = searchParams.get('edit') === 'profile';
  const showEditForm = isEditing || isProfileEditRequested;
  const pageTitle = userInfo?.role === 'ADMIN' ? 'Admin Profile' : 'Settings';
  const pageSubtitle = userInfo?.role === 'ADMIN'
    ? 'Update your admin account details and preferences.'
    : 'Manage your profile, account status, and app preferences.';

  useEffect(() => {
    form.setFieldsValue({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      contactNumber: userInfo?.contactNumber || '',
      vizNo: userInfo?.vizNo || '',
      designation: userInfo?.designation || '',
    });
  }, [form, userInfo]);

  useEffect(() => {
    setPreviewImage(getExternalUrl(userInfo?.profileImageUrl));
  }, [userInfo?.profileImageUrl]);

  const handlePreviewClick = () => {
    if (previewImage) {
      setIsViewerOpen(true);
    }
  };

  const customUpload = async (options) => {
    try {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResult = await uploadFile(formData).unwrap();
      
      const payload = {
        profileImageUrl: uploadResult.url,
      };
      
      const updatedUser = await updateProfile(payload).unwrap();
      dispatch(setCredentials(updatedUser));
      message.success('Profile picture updated successfully');
      onSuccess('ok');
    } catch (err) {
      message.error(err?.data?.message || 'Failed to update profile picture');
      onError(err);
    }
  };



  const handleCancel = () => {
    form.setFieldsValue({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      contactNumber: userInfo?.contactNumber || '',
      vizNo: userInfo?.vizNo || '',
      designation: userInfo?.designation || '',
    });
    setIsEditing(false);
    setSearchParams({});
    setFileList([]);
    setProfileImageFile(null);
    setRemoveProfileImage(false);
    setPreviewImage(getExternalUrl(userInfo?.profileImageUrl));
  };

  const handleSave = async (values) => {
    try {
      const payload = { ...values };

      if (profileImageFile) {
        const formData = new FormData();
        formData.append('file', profileImageFile);
        const uploadResult = await uploadFile(formData).unwrap();
        payload.profileImageUrl = uploadResult.url;
        setRemoveProfileImage(false);
      } else if (removeProfileImage) {
        payload.profileImageUrl = null;
      }

      const updatedUser = await updateProfile(payload).unwrap();
      dispatch(setCredentials(updatedUser));
      message.success('Profile updated successfully');
      setIsEditing(false);
      setSearchParams({});
    } catch (err) {
      message.error(err?.data?.message || 'Failed to update profile');
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    const latestFile = newFileList.slice(-1);
    setFileList(latestFile);
    setRemoveProfileImage(false);

    if (latestFile[0]?.originFileObj) {
      setProfileImageFile(latestFile[0].originFileObj);
      setPreviewImage(URL.createObjectURL(latestFile[0].originFileObj));
    }
  };

  const handleRemoveProfileImage = () => {
    setFileList([]);
    setProfileImageFile(null);
    setPreviewImage(null);
    setRemoveProfileImage(true);
  };

  return (
    <div>
      <PageHeader title={pageTitle} subtitle={pageSubtitle} />

      <div className="mb-5 overflow-hidden rounded-lg border border-[#d7e0e8] bg-white">
        <div className="h-28" style={{ background: 'linear-gradient(90deg, var(--app-primary), var(--app-primary-dark))' }} />
        <div className="-mt-10 flex items-end gap-4 px-6 pb-6">
          <div
            className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-4 border-white bg-[var(--app-primary-soft)] text-3xl font-semibold text-[var(--app-primary)] shadow-sm ${previewImage ? 'cursor-pointer' : ''}`}
            onClick={handlePreviewClick}
          >
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              name.charAt(0)
            )}
            <div className="absolute right-1 bottom-1 flex h-7 w-7 items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Upload showUploadList={false} customRequest={customUpload} accept="image/*">
                <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[var(--app-primary)] shadow-sm hover:bg-white transition-colors">
                  <Pencil className="h-4 w-4" />
                </div>
              </Upload>
            </div>
          </div>
          <div className="pb-2">
            <h2 className="text-2xl font-semibold text-[#111827]">{name}</h2>
            <p className="text-sm text-[#64748b]">{designation}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">

        <div className="space-y-5">
          <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#edf2f7] pb-3">
              <h3 className="text-sm font-semibold text-[#172033]">Account Status</h3>
              <CheckCircle className="h-5 w-5 text-[#0b9f5a]" />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dff8ec] px-3 py-1 text-xs font-semibold text-[#0b9f5a]">
              <span className="h-2 w-2 rounded-full bg-current" />
              Active
            </div>
            <p className="text-xs leading-5 text-[#64748b]">
              Your {accountRoleLabel.toLowerCase()} account is active and ready to use.
            </p>
          </section>

          <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-[#edf2f7] pb-3">
              <BellRing className="h-4 w-4 text-[var(--app-primary)]" />
              <h3 className="text-sm font-semibold text-[#172033]">Notifications</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#172033]">Email Summaries</p>
                <p className="text-xs text-[#64748b]">Weekly expense reports</p>
              </div>
              <Switch defaultChecked size="small" />
            </div>
          </section>
        </div>
      </div>
      <Modal
        open={isViewerOpen}
        footer={null}
        onCancel={() => setIsViewerOpen(false)}
        centered
        bodyStyle={{ padding: 0 }}
      >
        {previewImage && (
          <img src={previewImage} alt="Profile Preview" className="w-full" />
        )}
      </Modal>
    </div>
  );
};

export default Settings;
