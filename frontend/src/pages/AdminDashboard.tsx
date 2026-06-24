import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Globe, ShieldCheck, Printer, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  membership: string;
  is_superuser: boolean;
}

interface Website {
  id: number;
  slug: string;
  theme: string;
  business_type: string;
  published: boolean;
  user: number;
}

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'websites'>('users');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, websitesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users/'),
        axios.get('http://localhost:8000/api/websites/?all=true'),
      ]);
      setUsers(usersRes.data);
      setWebsites(websitesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  if (!user?.is_superuser) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary-400" />
            <span className="text-xl font-bold">Admin Portal</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 flex-1 flex flex-col">
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 font-medium text-lg flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users size={20} /> Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('websites')}
            className={`pb-4 px-2 font-medium text-lg flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'websites' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Globe size={20} /> Websites ({websites.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading admin data...</div>
        ) : activeTab === 'users' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium text-sm">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Membership</th>
                  <th className="py-4 px-6">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 text-slate-500">#{u.id}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{u.username}</td>
                    <td className="py-4 px-6 text-slate-600">{u.email || '-'}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide uppercase">
                        {u.membership}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {u.is_superuser ? (
                        <span className="text-purple-600 font-medium flex items-center gap-1"><ShieldCheck size={16} /> Admin</span>
                      ) : (
                        <span className="text-slate-500">User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map(site => (
              <div key={site.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{site.slug}</h3>
                    <p className="text-sm text-slate-500">User ID: {site.user} • {site.business_type}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${site.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {site.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setSelectedWebsite(site)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer size={18} /> Generate QR Sticker
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        {selectedWebsite && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
              <button 
                onClick={() => setSelectedWebsite(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={24} />
              </button>
              <div className="p-8 pb-6 border-b border-slate-100 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">QR Sticker</h3>
                <p className="text-slate-500">Ready to print for {selectedWebsite.slug}</p>
              </div>
              <div className="p-8 flex justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center">
                  <div className="font-bold text-xl mb-4 text-slate-800 tracking-tight">{selectedWebsite.slug.toUpperCase()}</div>
                  <QRCodeSVG 
                    value={`${window.location.origin}/${selectedWebsite.slug}`} 
                    size={200}
                    level="H"
                    includeMargin={false}
                    className="mb-4"
                  />
                  <div className="text-sm text-slate-500 font-medium tracking-wide">SCAN TO VISIT</div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setSelectedWebsite(null)}
                  className="flex-1 px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePrintQR}
                  className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex justify-center items-center gap-2 transition-colors"
                >
                  <Printer size={18} /> Print Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Print-only View */}
        {selectedWebsite && (
          <div className="hidden print:flex fixed inset-0 bg-white z-[9999] items-center justify-center">
            <div className="flex flex-col items-center border-4 border-black p-10 rounded-[3rem] w-[400px]">
              <div className="font-black text-3xl mb-8 uppercase text-center tracking-wider">{selectedWebsite.slug}</div>
              <QRCodeSVG 
                value={`${window.location.origin}/${selectedWebsite.slug}`} 
                size={250}
                level="H"
                includeMargin={false}
                className="mb-8"
              />
              <div className="text-xl font-bold tracking-[0.2em] text-center">SCAN TO VISIT US</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
