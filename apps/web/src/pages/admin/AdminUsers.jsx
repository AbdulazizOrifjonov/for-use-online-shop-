import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Ban, CheckCircle, Eye, EyeOff } from 'lucide-react';
import AdminModal from '@/components/admin/AdminModal';

export default function AdminUsers() {
 const user = useAuthStore((s) => s.user);
 const [admins, setAdmins] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [modalOpen, setModalOpen] = useState(false);
 const [editingAdmin, setEditingAdmin] = useState(null);
 const [isSaving, setIsSaving] = useState(false);
 const [formData, setFormData] = useState({ name: '', email: '', phone: '', username: '', password: '' });
 const [visiblePasswords, setVisiblePasswords] = useState({});
 const modalRef = useRef(null);
 const isSuperAdmin = user?.adminLevel === 'SUPER_ADMIN';
 const EMPTY_FORM = { name: '', email: '', phone: '', username: '', password: '' };

 const originalForm = editingAdmin ? {
 name: editingAdmin.name || '',
 email: editingAdmin.email || '',
 phone: editingAdmin.phone || '',
 username: editingAdmin.username || '',
 password: editingAdmin.credentialPassword || ''
 } : EMPTY_FORM;

 const hasUnsavedChanges = Object.keys(EMPTY_FORM).some((k) => formData[k] !== originalForm[k]);

 function handleOpenCreate() {
 setEditingAdmin(null);
 setFormData({ ...EMPTY_FORM });
 setModalOpen(true);
 }

 function handleRowClick(admin) {
 if (admin.adminLevel === 'SUPER_ADMIN') return;
 setEditingAdmin(admin);
 setFormData({
 name: admin.name || '',
 email: admin.email || '',
 phone: admin.phone || '',
 username: admin.username || '',
 password: admin.credentialPassword || '',
 });
 setModalOpen(true);
 }

 useEffect(() => {
 if (!isSuperAdmin) return;
 loadAdmins();
 }, [isSuperAdmin]);

 async function loadAdmins() {
 setIsLoading(true);
 try {
 const { data } = await api.get('/admin-users');
 const filtered = (data.admins || []).filter((a) => a.id !== user?.id);
 setAdmins(filtered);
 } catch (err) {
 toast.error(err.friendlyMessage || 'Adminlarni yuklashda xatolik');
 } finally {
 setIsLoading(false);
 }
 }

 if (!isSuperAdmin) {
 return (
 <div className="rounded-xl border border-border bg-card p-8 text-center">
 <p className="text-sm text-muted-foreground">Faqat Super Admin bu sahifani ko'ra oladi.</p>
 </div>
 );
 }

 async function handleSave() {
 if (!formData.name || !formData.email || !formData.phone || !formData.username) {
 toast.error('Asosiy maydonlarni to\'ldiring');
 return;
 }
 if (!editingAdmin && !formData.password) {
 toast.error('Yangi admin uchun parol kiritish shart');
 return;
 }

 setIsSaving(true);
 try {
 if (editingAdmin) {
 await api.patch(`/admin-users/${editingAdmin.id}`, formData);
 toast.success('Ma\'lumotlar yangilandi');
 } else {
 await api.post('/admin-users', formData);
 toast.success('Yordamchi admin yaratildi');
 }
 setModalOpen(false);
 loadAdmins();
 } catch (err) {
 toast.error(err.friendlyMessage || 'Xatolik yuz berdi');
 } finally {
 setIsSaving(false);
 }
 }

 async function toggleStatus(adminId) {
 try {
 await api.patch(`/admin-users/${adminId}/status`);
 toast.success('Holat o\'zgartirildi');
 loadAdmins();
 } catch (err) {
 toast.error(err.friendlyMessage);
 }
 }

 async function handleDelete(adminId) {
 if (!confirm('Bu adminni o\'chirishni tasdiqlaysizmi?')) return;
 try {
 await api.delete(`/admin-users/${adminId}`);
 toast.success('Admin o\'chirildi');
 loadAdmins();
 } catch (err) {
 toast.error(err.friendlyMessage);
 }
 }

 function togglePasswordVisibility(id) {
 setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
 }

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h1 className="text-xl font-bold">👑 Adminlarni boshqarish</h1>
 <Button onClick={handleOpenCreate} className="gap-2">
 <Plus className="h-4 w-4" />
 Yangi yordamchi admin
 </Button>
 </div>

 {isLoading ? (
 <div className="space-y-2">
 {Array.from({ length: 3 }).map((_, i) => (
 <Skeleton key={i} className="h-16 w-full rounded-xl" />
 ))}
 </div>
 ) : (
 <div className="overflow-x-auto rounded-xl border border-border bg-card">
 <table className="w-full text-sm">
 <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
 <tr>
 <th className="px-2 py-3 sm:p-3">Ism</th>
 <th className="px-2 py-3 sm:p-3 hidden sm:table-cell">Email</th>
 <th className="px-2 py-3 sm:p-3 hidden md:table-cell">Telefon</th>
 <th className="px-2 py-3 sm:p-3 hidden lg:table-cell">Login</th>
 <th className="px-2 py-3 sm:p-3 hidden xl:table-cell">Parol</th>
 <th className="px-2 py-3 sm:p-3 hidden md:table-cell">Darajasi</th>
 <th className="px-2 py-3 sm:p-3 hidden sm:table-cell">Holat</th>
 <th className="px-2 py-3 sm:p-3 text-right">Amallar</th>
 </tr>
 </thead>
 <tbody>
 {admins.map((admin) => (
 <tr 
 key={admin.id} 
 className={`border-b border-border last:border-0 ${admin.adminLevel !== 'SUPER_ADMIN' ? 'cursor-pointer hover:bg-muted/50' : ''}`}
 onClick={() => handleRowClick(admin)}
 >
 <td className="px-2 py-3 sm:p-3 font-medium truncate max-w-[100px] sm:max-w-xs">{admin.name}</td>
 <td className="px-2 py-3 sm:p-3 text-muted-foreground hidden sm:table-cell">{admin.email}</td>
 <td className="px-2 py-3 sm:p-3 text-muted-foreground hidden md:table-cell">{admin.phone}</td>
 <td className="px-2 py-3 sm:p-3 hidden lg:table-cell">
 {admin.username ? (
 <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
 {admin.username}
 </code>
 ) : (
 <span className="text-muted-foreground">—</span>
 )}
 </td>
 <td className="px-2 py-3 sm:p-3 hidden xl:table-cell">
 {admin.credentialPassword ? (
 <div className="flex items-center gap-1">
 <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
 {visiblePasswords[admin.id] ? admin.credentialPassword : '••••••'}
 </code>
 <button
 onClick={(e) => { e.stopPropagation(); togglePasswordVisibility(admin.id); }}
 className="rounded p-0.5 text-muted-foreground hover:text-foreground"
 >
 {visiblePasswords[admin.id] ? (
 <EyeOff className="h-3.5 w-3.5" />
 ) : (
 <Eye className="h-3.5 w-3.5" />
 )}
 </button>
 </div>
 ) : (
 <span className="text-muted-foreground">—</span>
 )}
 </td>
 <td className="px-2 py-3 sm:p-3 hidden md:table-cell">
 <Badge variant={admin.adminLevel === 'SUPER_ADMIN' ? 'default' : 'outline'}>
 {admin.adminLevel === 'SUPER_ADMIN' ? '👑 Super Admin' : '👨‍💼 Yordamchi'}
 </Badge>
 </td>
 <td className="px-2 py-3 sm:p-3 hidden sm:table-cell">
 <Badge variant={admin.status === 'ACTIVE' ? 'success' : 'destructive'}>
 {admin.status === 'ACTIVE' ? 'Faol' : 'Bloklangan'}
 </Badge>
 </td>
 <td className="px-2 py-3 sm:p-3 text-right">
 <div className="flex justify-end gap-1">
 {admin.adminLevel !== 'SUPER_ADMIN' && (
 <>
 <Button
 variant="ghost"
 size="icon"
 onClick={(e) => { e.stopPropagation(); toggleStatus(admin.id); }}
 title={admin.status === 'ACTIVE' ? 'Bloklash' : 'Faollash'}
 >
 {admin.status === 'ACTIVE' ? (
 <Ban className="h-4 w-4 text-destructive" />
 ) : (
 <CheckCircle className="h-4 w-4 text-success" />
 )}
 </Button>
 <Button
 variant="ghost"
 size="icon"
 onClick={(e) => { e.stopPropagation(); handleDelete(admin.id); }}
 title="O'chirish"
 >
 <Trash2 className="h-4 w-4 text-destructive" />
 </Button>
 </>
 )}
 {admin.adminLevel === 'SUPER_ADMIN' && (
 <span className="text-xs text-muted-foreground">Super Admin</span>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 <AdminModal
 ref={modalRef}
 open={modalOpen}
 onClose={() => setModalOpen(false)}
 onCloseConfirmed={() => setFormData({ ...EMPTY_FORM })}
 title={editingAdmin ? "Adminni tahrirlash" : "Yangi yordamchi admin"}
 hasUnsavedChanges={hasUnsavedChanges}
 maxWidth="md"
 >
 <div className="space-y-3">
 <div>
 <label className="mb-1 block text-sm font-medium">Ism</label>
 <Input
 placeholder="Ism"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 />
 </div>
 <div>
 <label className="mb-1 block text-sm font-medium">Email</label>
 <Input
 type="email"
 placeholder="Email"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 />
 </div>
 <div>
 <label className="mb-1 block text-sm font-medium">Telefon</label>
 <Input
 placeholder="+998901234567"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 />
 </div>
 <div>
 <label className="mb-1 block text-sm font-medium">Login (username)</label>
 <Input
 placeholder="Masalan: admin2"
 value={formData.username}
 onChange={(e) => setFormData({ ...formData, username: e.target.value })}
 />
 </div>
 <div>
 <label className="mb-1 block text-sm font-medium">Parol</label>
 <Input
 placeholder={editingAdmin ? "O'zgartirish uchun yangi parol kiriting (kamida 6 ta belgi)" : "Kamida 6 ta belgi"}
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 />
 </div>
 </div>
 <div className="flex gap-2 mt-6">
 <Button
 variant="outline"
 onClick={() => modalRef.current?.handleClose()}
 className="flex-1"
 >
 Bekor qilish
 </Button>
 {editingAdmin && (
 <Button
 variant="destructive"
 onClick={() => {
 setModalOpen(false);
 handleDelete(editingAdmin.id);
 }}
 className="flex-none"
 title="O'chirish"
 >
 <Trash2 className="h-4 w-4" />
 </Button>
 )}
 <Button
 onClick={handleSave}
 disabled={isSaving}
 className="flex-1"
 >
 {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
 </Button>
 </div>
 </AdminModal>
 </div>
 );
}
