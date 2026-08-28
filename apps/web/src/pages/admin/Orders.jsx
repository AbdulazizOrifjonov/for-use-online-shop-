import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { formatUZS } from '@/lib/utils';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const STATUS_VARIANT = {
 PENDING: 'secondary', CONFIRMED: 'default', SHIPPING: 'default',
 DELIVERED: 'success', CANCELLED: 'destructive', REFUNDED: 'destructive',
};

export default function Orders() {
 const navigate = useNavigate();
 const { t } = useTranslation();
 const [orders, setOrders] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [filterStatus, setFilterStatus] = useState('ALL');
 const [dateFrom, setDateFrom] = useState('');
 const [dateTo, setDateTo] = useState('');
 const [page, setPage] = useState(1);
 const [pages, setPages] = useState(1);

 function load(p) {
 setIsLoading(true);
 const params = { page: p || page, limit: 50 };
 if (filterStatus !== 'ALL') params.status = filterStatus;
 if (dateFrom) params.dateFrom = dateFrom;
 if (dateTo) params.dateTo = dateTo;
 api.get('/orders/admin/all', { params }).then(({ data }) => {
 setOrders(data.orders);
 setPages(data.pagination.pages);
 setPage(data.pagination.page);
 }).finally(() => setIsLoading(false));
 }

 useEffect(() => { load(1); }, [filterStatus, dateFrom, dateTo]);

 async function updateStatus(orderId, status) {
 try {
 await api.patch(`/orders/admin/${orderId}/status`, { status });
 toast.success(t('common.save'));
 load();
 } catch (err) { toast.error(err.friendlyMessage); }
 }

 return (
 <div className="space-y-4">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <h1 className="text-xl font-bold">{t('admin.orders')}</h1>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
  <div className="flex items-center gap-2 w-full sm:w-auto">
  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 sm:w-36 h-9" />
  <span className="text-muted-foreground">—</span>
  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 sm:w-36 h-9" />
  </div>
  <Select value={filterStatus} onValueChange={setFilterStatus}>
  <SelectTrigger className="w-full sm:w-40 h-9"><SelectValue /></SelectTrigger>
  <SelectContent>
  <SelectItem value="ALL">Barchasi</SelectItem>
  {STATUSES.map((s) => (<SelectItem key={s} value={s}>{t(`order.status.${s}`)}</SelectItem>))}
  </SelectContent>
  </Select>
  </div>
 </div>

 {isLoading ? (
 <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
 ) : (
 <>
 <div className="overflow-x-auto rounded-xl border border-border bg-card">
 <table className="w-full text-sm">
 <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
 <tr>
 <th className="px-1.5 py-3 sm:px-3">Raqam</th>
 <th className="px-1.5 py-3 sm:px-3">Mijoz</th>
 <th className="px-1.5 py-3 sm:px-3 hidden sm:table-cell">Sana</th>
 <th className="px-1.5 py-3 sm:px-3">Summa</th>
 <th className="px-1.5 py-3 sm:px-3 text-right">Holat</th>
 </tr>
 </thead>
 <tbody>
 {orders.map((order) => (
 <tr key={order.id} className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate(`/admin/orders/${order.id}`)}>
 <td className="px-1.5 py-3 sm:px-3 font-medium text-[10px] sm:text-sm">
   <span className="hidden sm:inline">#{order.orderNumber}</span>
   <span className="sm:hidden text-muted-foreground">..{order.orderNumber.slice(-6)}</span>
 </td>
 <td className="px-1.5 py-3 sm:px-3"><div className="truncate max-w-[70px] sm:max-w-[150px] text-[11px] sm:text-sm font-medium">{order.user.name}</div><div className="text-[9px] sm:text-xs text-muted-foreground truncate max-w-[70px] sm:max-w-[150px]">{order.user.phone || order.user.email}</div></td>
 <td className="px-1.5 py-3 sm:px-3 text-muted-foreground hidden sm:table-cell text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
 <td className="px-1.5 py-3 sm:px-3 font-bold text-primary whitespace-nowrap text-[11px] sm:text-sm">{formatUZS(order.total)}</td>
 <td className="px-1.5 py-3 sm:px-3 text-right">
 <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
 <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
 <SelectTrigger className="h-7 w-[90px] sm:h-8 sm:w-36 px-1 sm:px-3 text-[9px] sm:text-xs"><SelectValue><Badge variant={STATUS_VARIANT[order.status]} className="text-[9px] sm:text-xs px-1 py-0">{t(`order.status.${order.status}`)}</Badge></SelectValue></SelectTrigger>
 <SelectContent>{STATUSES.map((s) => (<SelectItem key={s} value={s}>{t(`order.status.${s}`)}</SelectItem>))}</SelectContent>
 </Select>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 {pages > 1 && (
 <div className="flex items-center justify-center gap-2">
 <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => load(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
 <span className="text-sm text-muted-foreground">{page} / {pages}</span>
 <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => load(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
 </div>
 )}
 </>
 )}
 </div>
 );
}
