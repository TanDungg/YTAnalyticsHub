import React, { useState } from 'react';
import { X, Link2, Youtube, Sparkles, Loader2, Key } from 'lucide-react';
import { importChannelByUrlOrHandle, getGoogleAuthUrl } from '../services/api';

export default function ConnectChannelModal({ isOpen, onClose, onChannelAdded, showToast }) {
  const [activeTab, setActiveTab] = useState('url'); // 'url' hoặc 'oauth'
  const [urlInput, setUrlInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleImportByUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast("Vui lòng nhập link kênh hoặc @handle");
      return;
    }

    try {
      setIsImporting(true);
      showToast("Đang quét dữ liệu video từ YouTube...");
      const res = await importChannelByUrlOrHandle(urlInput);
      showToast(`🎉 Đã thêm kênh thành công: ${res.channel.name}`);
      setUrlInput('');
      onChannelAdded(res.channel);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.error || err.message || "Không thể quét kênh này");
    } finally {
      setIsImporting(false);
    }
  };

  const handleOAuthLogin = async () => {
    try {
      showToast("Đang kết nối tới Google OAuth 2.0...");
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err) {
      showToast(err.response?.data?.error || "Vui lòng cấu hình GOOGLE_CLIENT_ID trong backend/.env");
    }
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className="modal-dialog" style={{ maxWidth: 640 }} role="dialog">
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-badge"><Sparkles size={14} /> THÊM KÊNH YOUTUBE VÀO HỆ THỐNG</span>
            <h2 className="modal-title">Chọn Phương Thức Liên Kết Kênh</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: 20 }}>
          {/* TAB SELECTOR */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-card)',
            padding: 4,
            borderRadius: 12,
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setActiveTab('url')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'url' ? 'var(--bg-elevated)' : 'transparent',
                color: activeTab === 'url' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'url' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              <Link2 size={16} color="var(--neon-cyan)" />
              <span>Dán Link / @Handle (Siêu tốc)</span>
            </button>

            <button
              onClick={() => setActiveTab('oauth')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'oauth' ? 'var(--bg-elevated)' : 'transparent',
                color: activeTab === 'oauth' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'oauth' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              <Youtube size={16} color="var(--yt-red)" />
              <span>Đăng Nhập Google OAuth</span>
            </button>
          </div>

          {/* TAB 1: NHẬP LINK SIÊU TỐC */}
          {activeTab === 'url' ? (
            <form onSubmit={handleImportByUrl} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 13,
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                ⚡ <strong>Cách nhanh nhất:</strong> Không cần đăng nhập tài khoản Google. Chỉ cần dán link kênh hoặc mã @handle của bạn (hoặc bất kỳ kênh nào bạn muốn theo dõi).
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Link Kênh YouTube Hoặc @Handle:
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  gap: 10
                }}>
                  <Link2 size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Ví dụ: https://www.youtube.com/@MixiGaming hoặc @F8VNOfficial"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: 14,
                      width: '100%'
                    }}
                    autoFocus
                  />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  Hỗ trợ: Link trang chủ kênh, link /videos, mã @handle hoặc Channel ID (UC...).
                </div>
              </div>

              <button
                type="submit"
                disabled={isImporting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isImporting ? 'not-allowed' : 'pointer',
                  opacity: isImporting ? 0.7 : 1,
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
                  marginTop: 6
                }}
              >
                {isImporting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Đang quét video từ YouTube...</span>
                  </>
                ) : (
                  <span>Quét & Tải Kênh Này Ngay ➔</span>
                )}
              </button>
            </form>
          ) : (
            /* TAB 2: ĐĂNG NHẬP GOOGLE OAUTH */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: 'rgba(255, 0, 51, 0.08)',
                border: '1px solid rgba(255, 0, 51, 0.25)',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 13,
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                🔒 <strong>Đăng nhập chính chủ:</strong> Cần thiết nếu bạn muốn xem các chỉ số Analytics riêng tư (Audience Retention từng giây, Phễu hiển thị...).
              </div>

              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: 16,
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neon-amber)', fontWeight: 700, marginBottom: 6 }}>
                  <Key size={15} /> Để tránh lỗi 403 access_denied:
                </div>
                Vào <strong>Google Cloud Console &gt; Audience (hoặc OAuth consent screen)</strong> và bấm nút <strong>PUBLISH APP</strong> (Xuất bản) để mở khóa đăng nhập tự do cho tài khoản của bạn.
              </div>

              <button
                onClick={handleOAuthLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'linear-gradient(135deg, #ff0033, #dc2626)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 0, 51, 0.35)'
                }}
              >
                <Youtube size={18} />
                <span>Đăng nhập Google OAuth 2.0</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
