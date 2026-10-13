import React from 'react';
import { Youtube, ShieldCheck, PlusCircle } from 'lucide-react';

export default function Sidebar({ channels, activeChannelId, onSelectChannel, onOpenConnectModal }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Youtube className="brand-icon" />
        </div>
        <div className="brand-info">
          <h2>YT Analytics Hub</h2>
          <span className="badge-read-only">
            <ShieldCheck size={12} /> Read-Only Mode
          </span>
        </div>
      </div>

      <div className="sidebar-section-title">
        <span>KÊNH QUẢN LÝ (ĐỘC LẬP)</span>
      </div>

      <div className="channel-list">
        {channels.length === 0 ? (
          <div style={{ padding: '20px 10px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            Chưa có kênh nào
          </div>
        ) : (
          channels.map((channel) => {
            const isActive = channel.id === activeChannelId || channel.channelId === activeChannelId;
            return (
              <div
                key={channel.id}
                className={`channel-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelectChannel(channel.id)}
              >
                <div className="channel-avatar-wrap">
                  <img src={channel.avatar} alt={channel.name} className="channel-avatar" />
                  {isActive && <span className="active-indicator"></span>}
                </div>
                <div className="channel-text">
                  <div className="channel-name">{channel.name}</div>
                  <div className="channel-meta">
                    <span>{channel.benchmarks?.subscribers || '0'} subs</span>
                    <span>•</span>
                    <span>{channel.videos?.length || 0} videos</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="btn-add-channel" onClick={onOpenConnectModal}>
        <PlusCircle size={16} />
        <span>Thêm kênh mới</span>
      </button>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span>Hệ thống: Đang chạy</span>
        </div>
        <small>Dữ liệu cô lập 100% theo kênh</small>
      </div>
    </aside>
  );
}
