import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ban, CheckCircle, Trash2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import AdminModal from '@/components/admin/AdminModal';

export default function Users() {
 const { t } = useTranslation();
 const currentUser = useAuthStore((s) => s.user);
 const [users, setUsers] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [promoteModal, setPromoteModal] = useState(null);
 const [promoteForm, setPromoteForm] = useState({ username: '', password: '' });
 const [isPromoting, setIsPromoting] = useState(false);
 const modalRef = useRef(null);
 const EMPTY_PROMOTE = { username: '', password: '' };
 const hasUnsavedChanges = promoteForm.username !== '' || promoteForm.password !== '';

 function load() {
 setIsLoading(true);
 api
 .get('/users/admin/all')
 .then(({ data }) => {
 const filtered = (data.users || []).filter((u) => u.id !== currentUser?.id);
 setUsers(filtered);
 })
 .finally(() => setIsLoading(false));
 }

 useEffect(load, []);

 async function toggleBan(user) {
 try {
 await api.patch(`/users/admin/${user.id}/${user.status === 'BANNED' ? 'unban' : 'ban'}`);
 toast.success(t('common.save'));
 load();
 } catch (err) {
 toast.error(err.friendlyMessage);
 }
 }

 async function handleDelete(user) {
 if (!confirm(`${user.name}ni o'chirishni tasdiqlaysizmi?`)) return;
 try {
 await api.delete(`/users/admin/${user.id}`);
 toast.success(t('common.delete'));
 load();
 } catch (err) {
 toast.error(err.friendlyMessage);
 }
 }

 function openPromoteModal(user) {
 setPromoteModal(user);
 setPromoteForm({ username: '', password: '' });
 }

 async function handlePromote() {
 if (!promoteForm.username || !promoteForm.password) {
 toast.error('Login va parolni kiriting');
 return;
 }
 if (promoteForm.password.length < 6) {
 toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
 return;
 }

 setIsPromoting(true);
 try {
 await api.post(`/admin-users/promote/${promoteModal.id}`, promoteForm);
 toast.success(`${promoteModal.name} yordamchi admin qilindi!`);
 setPromoteModal(null);
 load();
 } catch (err) {
 toast.error(err.friendlyMessage || 'Xatolik yuz berdi');
 } finally {
 setIsPromoting(false);
 }
 }

 const isSuperAdmin = currentUser?.adminLevel === 'SUPER_ADMIN';

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h1 className="text-xl font-bold">{t('admin.users')}</h1>
 <p className="text-sm text-muted-foreground">Jami: <span className="font-semibold text-foreground">{users.length}</span> ta foydalanuvchi</p>
 </div>

 {isLoading ? (
 <div className="space-y-2">
 {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
 </div>
 ) : (
 <div className="overflow-x-auto rounded-xl border border-border bg-card">
 <table className="w-full text-sm">
 <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
 <tr>
 <th className="px-2 py-3 sm:p-3">Ism</th>
 <th className="px-2 py-3 sm:p-3 hidden sm:table-cell">Email</th>
 <th className="px-2 py-3 sm:p-3 hidden md:table-cell">Telefon</th>
 <th className="px-2 py-3 sm:p-3 hidden lg:table-cell">Manba</th>
 <th className="px-2 py-3 sm:p-3 hidden lg:table-cell">Ro'yxatdan o'tgan</th>
 <th className="px-2 py-3 sm:p-3 hidden md:table-cell">Rol</th>
 <th className="px-2 py-3 sm:p-3 hidden sm:table-cell">Holat</th>
 <th className="px-2 py-3 sm:p-3 text-right">Amallar</th>
 </tr>
 </thead>
 <tbody>
 {users.map((u) => (
 <tr key={u.id} className="border-b border-border last:border-0">
 <td className="px-2 py-3 sm:p-3 font-medium truncate max-w-[100px] sm:max-w-[150px]">{u.name}</td>
 <td className="px-2 py-3 sm:p-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
 <td className="px-2 py-3 sm:p-3 text-muted-foreground hidden md:table-cell">{u.phone || '—'}</td>
 <td className="px-2 py-3 sm:p-3 hidden lg:table-cell">
 <Badge variant="outline">
 {u.telegramId ? 'Telegram' : u.googleId ? 'Google' : 'Email'}
 </Badge>
 </td>
 <td className="px-2 py-3 sm:p-3 text-muted-foreground hidden lg:table-cell">{new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
 <td className="px-2 py-3 sm:p-3 hidden md:table-cell">
 <Badge variant={u.role === 'ADMIN' ? 'default' : 'outline'}>{u.role}</Badge>
 </td>
 <td className="px-2 py-3 sm:p-3 hidden sm:table-cell">
 <Badge variant={u.status === 'BANNED' ? 'destructive' : 'success'}>{u.status}</Badge>
 </td>
 <td className="px-2 py-3 sm:p-3 text-right">
 <div className="flex justify-end gap-1">
 {isSuperAdmin && u.role === 'CUSTOMER' && (
 <Button
 variant="ghost"
 size="icon"
 onClick={() => openPromoteModal(u)}
 title="Admin qilish"
 >
 <Crown className="h-4 w-4 text-amber-500" />
 </Button>
 )}
 <Button variant="ghost" size="icon" onClick={() => toggleBan(u)} title={u.status === 'BANNED' ? t('admin.unban_user') : t('admin.ban_user')}>
 {u.status === 'BANNED' ? <CheckCircle className="h-4 w-4 text-success" /> : <Ban className="h-4 w-4 text-destructive" />}
 </Button>
 <Button variant="ghost" size="icon" onClick={() => handleDelete(u)}>
 <Trash2 className="h-4 w-4 text-destructive" />
 </Button>
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
 open={!!promoteModal}
 onClose={() => setPromoteModal(null)}
 onCloseConfirmed={() => { setPromoteForm({ ...EMPTY_PROMOTE }); setPromoteModal(null); }}
 title="Yordamchi admin qilish"
 hasUnsavedChanges={hasUnsavedChanges}
 maxWidth="md"
 >
 {promoteModal && (
 <p className="mb-4 text-sm text-muted-foreground">
 <span className="font-medium text-foreground">{promoteModal.name}</span> — {promoteModal.email}
 </p>
 )}
 <div className="space-y-3">
 <div>
 <label className="mb-1 block text-sm font-medium">Login (username)</label>
 <Input
 placeholder="Masalan: admin2"
 value={promoteForm.username}
 onChange={(e) => setPromoteForm({ ...promoteForm, username: e.target.value })}
 />
 </div>
 <div>
 <label className="mb-1 block text-sm font-medium">Parol</label>
 <Input
 placeholder="Kamida 6 ta belgi"
 value={promoteForm.password}
 onChange={(e) => setPromoteForm({ ...promoteForm, password: e.target.value })}
 />
 <p className="mt-1 text-xs text-muted-foreground">
 Bu login va parol yordamchi admin uchun. Siz uni keyinroq ko'rishingiz mumkin.
 </p>
 </div>
 </div>
 <div className="flex gap-2 mt-6">
 <Button variant="outline" onClick={() => modalRef.current?.handleClose()} className="flex-1">
 Bekor qilish
 </Button>
 <Button onClick={handlePromote} disabled={isPromoting} className="flex-1">
 {isPromoting ? 'Saqlanmoqda...' : 'Admin qilish'}
 </Button>
 </div>
 </AdminModal>
 </div>
 );
}
